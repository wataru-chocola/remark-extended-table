import { test, expect } from 'vitest';

import { extendedTable, extendedTableHtml } from './index.js';
import { micromark } from 'micromark';
import { gfmTable, gfmTableHtml } from 'micromark-extension-gfm-table';
import { tokenTypes } from './lib/types.js';
import { CompileContext } from 'micromark-util-types';

const parse = (md: string) =>
  micromark(md, {
    extensions: [gfmTable(), extendedTable],
    htmlExtensions: [gfmTableHtml(), extendedTableHtml],
  });

const parseWithDevHtml = (md: string) => {
  const devHtml = {
    enter: {
      [tokenTypes.extendedTableCellColspanMarker](this: CompileContext): undefined {
        this.raw(this.encode('*COLSPAN*'));
      },
      [tokenTypes.extendedTableCellRowspanMarker](this: CompileContext): undefined {
        this.raw(this.encode('*ROWSPAN*'));
      },
    },
  };
  return micromark(md, {
    extensions: [gfmTable(), extendedTable],
    htmlExtensions: [gfmTableHtml(), devHtml],
  });
};

test('rowspan marker', () => {
  const result = parse(`
| a | b |
|---|---|
| ^ | 1 |
`);
  const expected = `
<table>
<thead>
<tr>
<th>a</th>
<th>b</th>
</tr>
</thead>
<tbody>
<tr>
<td>^</td>
<td>1</td>
</tr>
</tbody>
</table>
`;
  expect(result).toEqual(expected.trimLeft());
});

test('colspan marker', () => {
  const result = parse(`
| a | b |
|---|---|
| > | 1 |
`);
  const expected = `
<table>
<thead>
<tr>
<th>a</th>
<th>b</th>
</tr>
</thead>
<tbody>
<tr>
<td>></td>
<td>1</td>
</tr>
</tbody>
</table>
`;
  expect(result).toEqual(expected.trimLeft());
});

test('rowspan marker with text', () => {
  const result = parseWithDevHtml(`
| a | b |
|---|---|
| > | ^ |
| ^aaa | bbb^ |
| ^*aaa* | *bbb*^ |
`);
  const expected = `
<table>
<thead>
<tr>
<th>a</th>
<th>b</th>
</tr>
</thead>
<tbody>
<tr>
<td>*COLSPAN*</td>
<td>*ROWSPAN*</td>
</tr>
<tr>
<td>^aaa</td>
<td>bbb^</td>
</tr>
<tr>
<td>^<em>aaa</em></td>
<td><em>bbb</em>^</td>
</tr>
</tbody>
</table>
`;
  expect(result).toEqual(expected.trimLeft());
});

test('rowspan marker and escaped rowspan marker', () => {
  const result = parseWithDevHtml(`
| a | b |
|---|---|
| ^ | \\^ |
`);
  const expected = `
<table>
<thead>
<tr>
<th>a</th>
<th>b</th>
</tr>
</thead>
<tbody>
<tr>
<td>*ROWSPAN*</td>
<td>^</td>
</tr>
</tbody>
</table>
`;
  expect(result).toEqual(expected.trimLeft());
});

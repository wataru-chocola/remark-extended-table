import { extendedTable, extendedTableHtml } from './index.js';
import { micromark } from 'micromark';
import { gfmTable, gfmTableHtml } from 'micromark-extension-gfm-table';

const parse = (md: string) =>
  micromark(md, {
    extensions: [gfmTable, extendedTable],
    htmlExtensions: [gfmTableHtml, extendedTableHtml],
  });

test('simple extended table', () => {
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
<td colspan=2>1</td>
</tr>
</tbody>
</table>`;
  expect(result).toEqual(expected.trimLeft());
});

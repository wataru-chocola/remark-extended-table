import { remarkExtendedTable, extendedTableHandlers, Options } from './index';

import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import rehypeStringify from 'rehype-stringify';
import remarkGfm, { Options as gfmOptions } from 'remark-gfm';

const process = (md: string, options?: Options, gfmOptions?: gfmOptions) =>
  unified()
    .use(remarkParse)
    .use(remarkGfm, gfmOptions)
    .use(remarkExtendedTable, options)
    .use(remarkRehype, null, { handlers: Object.assign({}, extendedTableHandlers) })
    .use(rehypeStringify)
    .process(md);

test('simple rowspan', () => {
  const md = `
| a | b |
|---|---|
| 1 | 2 |
| ^ | 3 |
`;
  const html = `<table>
<thead>
<tr>
<th>a</th>
<th>b</th>
</tr>
</thead>
<tbody>
<tr>
<td rowspan="2">1</td>
<td>2</td>
</tr>
<tr>
<td>3</td>
</tr>
</tbody>
</table>`;
  process(md).then((result) => expect(result.value).toBe(html));
});

test('simple colspan', () => {
  const md = `
| a | b |
|---|---|
| 1 | 2 |
| > | 3 |
`;
  const html = `<table>
<thead>
<tr>
<th>a</th>
<th>b</th>
</tr>
</thead>
<tbody>
<tr>
<td>1</td>
<td>2</td>
</tr>
<tr>
<td colspan="2">3</td>
</tr>
</tbody>
</table>`;
  process(md).then((result) => expect(result.value).toBe(html));
});

test('marker at end', () => {
  const md = `
| a | b |
|---|---|
| ^ | 2 |
| 3 | > |
`;
  const html = `<table>
<thead>
<tr>
<th>a</th>
<th>b</th>
</tr>
</thead>
<tbody>
<tr>
<td>^</td>
<td>2</td>
</tr>
<tr>
<td>3</td>
<td>></td>
</tr>
</tbody>
</table>`;
  process(md).then((result) => expect(result.value).toBe(html));
});

test('marker at end', () => {
  const md = `
| a | b | c |
|---|---|---|
| > | 1 | 2 |
| ^ | ^ | 3 |
| > | 4 | 5 |
| > | ^ | 6 |
`;
  const html = `<table>
<thead>
<tr>
<th>a</th>
<th>b</th>
<th>c</th>
</tr>
</thead>
<tbody>
<tr>
<td rowspan="2" colspan="2">1</td>
<td>2</td>
</tr>
<tr>
<td>3</td>
</tr>
<tr>
<td rowspan="2" colspan="2">4</td>
<td>5</td>
</tr>
<tr>
<td>6</td>
</tr>
</tbody>
</table>`;
  process(md).then((result) => expect(result.value).toBe(html));
});

test('span with empty cell', () => {
  const md = `
| a | b |
|---|---|
| 1    ||
| 2 | 3 |
`;
  const html = `<table>
<thead>
<tr>
<th>a</th>
<th>b</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2">1</td>
</tr>
<tr>
<td>2</td>
<td>3</td>
</tr>
</tbody>
</table>`;
  process(md, { colspanWithEmpty: true }).then((result) => expect(result.value).toBe(html));
});

test('no span with empty cell', () => {
  const md = `
| a | b |
|---|---|
| 1    ||
| 2 | 3 |
`;
  const html = `<table>
<thead>
<tr>
<th>a</th>
<th>b</th>
</tr>
</thead>
<tbody>
<tr>
<td>1</td>
<td></td>
</tr>
<tr>
<td>2</td>
<td>3</td>
</tr>
</tbody>
</table>`;
  process(md).then((result) => expect(result.value).toBe(html));
});

test('edge case: empty cell merged with below cell', () => {
  const md = `
a | b
--|--
1 |
2 |
3 | ^
`;
  const html = `<table>
<thead>
<tr>
<th>a</th>
<th>b</th>
</tr>
</thead>
<tbody>
<tr>
<td>1</td>
<td></td>
</tr>
<tr>
<td>2</td>
<td rowspan="2"></td>
</tr>
<tr>
<td>3</td>
</tr>
</tbody>
</table>`;
  process(md).then((result) => expect(result.value).toBe(html));
});

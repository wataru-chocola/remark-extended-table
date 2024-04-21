import { test, expect } from 'vitest';

import { remarkExtendedTable, extendedTableHandlers, Options } from './index.js';

import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import rehypeStringify from 'rehype-stringify';
import remarkGfm, { Options as gfmOptions } from 'remark-gfm';

const process = (md: string, options?: Options, gfmOptions?: gfmOptions) =>
  unified()
    .use(remarkParse)
    .use(remarkGfm, gfmOptions)
    .use(remarkExtendedTable, { ...options, ...gfmOptions })
    .use(remarkRehype, { handlers: extendedTableHandlers })
    .use(rehypeStringify)
    .process(md);

test('simple rowspan', async () => {
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
  expect((await process(md)).value).toBe(html);
});

test('simple colspan', async () => {
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
  expect((await process(md)).value).toBe(html);
});

test('span in header', async () => {
  const md = `
| > | ^ |
|---|---|
| 1 | 2 |
| 3 | 4 |
`;
  const html = `<table>
<thead>
<tr>
<th colspan="2">^</th>
</tr>
</thead>
<tbody>
<tr>
<td>1</td>
<td>2</td>
</tr>
<tr>
<td>3</td>
<td>4</td>
</tr>
</tbody>
</table>`;
  expect((await process(md)).value).toBe(html);
});

test('marker at end', async () => {
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
  expect((await process(md)).value).toBe(html);
});

test('marker at end', async () => {
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
  expect((await process(md)).value).toBe(html);
});

test('span with empty cell', async () => {
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
  expect((await process(md, { colspanWithEmpty: true })).value).toBe(html);
});

test('no span with empty cell', async () => {
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
  expect((await process(md)).value).toBe(html);
});

test('cell sandwiched between colspan markers', async () => {
  const md = `
| a | b | c |
|---|---|---|
| > | 1    ||
| 2 | 3 | 4 |
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
<td colspan="3">1</td>
</tr>
<tr>
<td>2</td>
<td>3</td>
<td>4</td>
</tr>
</tbody>
</table>`;
  expect((await process(md, { colspanWithEmpty: true })).value).toBe(html);
});

test('align', async () => {
  const md = `
| col 1 | col 2 | col 3 |
|---|---:|:---:|
| 1 | 2 | 4 |
| ^ | 3 | 5 |
| > | 6 | 7 |
`;
  const html = `<table>
<thead>
<tr>
<th>col 1</th>
<th align="right">col 2</th>
<th align="center">col 3</th>
</tr>
</thead>
<tbody>
<tr>
<td rowspan="2">1</td>
<td align="right">2</td>
<td align="center">4</td>
</tr>
<tr>
<td align="right">3</td>
<td align="center">5</td>
</tr>
<tr>
<td colspan="2">6</td>
<td align="center">7</td>
</tr>
</tbody>
</table>`;
  expect((await process(md, { colspanWithEmpty: true })).value).toBe(html);
});

test('edge case: empty cell merged with below cell', async () => {
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
  expect((await process(md)).value).toBe(html);
});

test('edge case: conflict between colspanWithRight and colspanWithLeft', async () => {
  const md = `
| a | b | c | d |
|---|---|---|---|
| 1 | >    || 4 |
`;
  const html = `<table>
<thead>
<tr>
<th>a</th>
<th>b</th>
<th>c</th>
<th>d</th>
</tr>
</thead>
<tbody>
<tr>
<td>1</td>
<td colspan="2"></td>
<td>4</td>
</tr>
</tbody>
</table>`;
  expect((await process(md, { colspanWithEmpty: true })).value).toBe(html);
});

test('regression: more than 2 colspanWithRight is not working', async () => {
  const md = `
| a | b | c |
| - | - | - |
| > | > | 1 |
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
<td colspan="3">1</td>
</tr>
</tbody>
</table>`;
  expect((await process(md, { colspanWithEmpty: true })).value).toBe(html);
});

test('too many cells in a row', async () => {
  const md = `
| col 1 | col 2 |
|---|---:|
| 1 | 2 |
| ^ | 3 | 5 |
| > | 6 |
`;
  const html = `<table>
<thead>
<tr>
<th>col 1</th>
<th align="right">col 2</th>
</tr>
</thead>
<tbody>
<tr>
<td rowspan="2">1</td>
<td align="right">2</td>
</tr>
<tr>
<td align="right">3</td>
<td>5</td>
</tr>
<tr>
<td colspan="2">6</td>
</tr>
</tbody>
</table>`;
  expect((await process(md, { colspanWithEmpty: true })).value).toBe(html);
});

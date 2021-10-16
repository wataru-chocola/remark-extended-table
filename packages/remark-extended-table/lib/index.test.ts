import { remarkExtendedTable, extendedTableHandler } from './index';

import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import rehypeStringify from 'rehype-stringify';
import remarkGfm from 'remark-gfm';

const process = (md: string) =>
  unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkExtendedTable)
    .use(remarkRehype, {
      handlers: { table: extendedTableHandler },
    })
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

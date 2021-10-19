import { extendedTableToMarkdown } from './to-markdown';
import { gfmTableToMarkdown } from 'mdast-util-gfm-table';
import { toMarkdown } from 'mdast-util-to-markdown';

const compile = (mdast: any) =>
  toMarkdown(mdast, {
    extensions: [gfmTableToMarkdown(), extendedTableToMarkdown],
  });

test('mdast -> markdown', () => {
  const mdast = {
    type: 'root',
    children: [
      {
        type: 'table',
        align: [null, null],
        children: [
          {
            type: 'tableRow',
            children: [
              {
                type: 'tableCell',
                children: [{ type: 'text', value: 'a' }],
              },
              {
                type: 'tableCell',
                children: [{ type: 'text', value: 'b' }],
              },
            ],
          },
          {
            type: 'tableRow',
            children: [
              {
                type: 'tableCell',
                rowspan: 2,
                children: [{ type: 'text', value: '1' }],
              },
              {
                type: 'tableCell',
                children: [{ type: 'text', value: '2' }],
              },
            ],
          },
          {
            type: 'tableRow',
            children: [
              {
                type: 'tableCell',
                children: [{ type: 'text', value: '3' }],
              },
            ],
          },
        ],
      },
    ],
  };
  const md = `| a | b |
| - | - |
| 1 | 2 |
| ^ | 3 |
`;
  const result = compile(mdast);
  expect(result).toEqual(md);
});

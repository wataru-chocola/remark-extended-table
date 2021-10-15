import { fromMarkdown } from 'mdast-util-from-markdown';
import { extendedTableFromMarkdown } from './from-markdown';
import { extendedTable } from 'micromark-extension-extended-table';
import { gfmTable } from 'micromark-extension-gfm-table';
import { gfmTableFromMarkdown } from 'mdast-util-gfm-table';

const compile = (md: string) =>
  fromMarkdown(md, {
    extensions: [gfmTable, extendedTable],
    mdastExtensions: [gfmTableFromMarkdown, extendedTableFromMarkdown],
  });

test.only('markdown -> mdast', () => {
  const md = `
| a | b |
|---|---|
| 1 | 2 |
| ^ | 3 |
`;
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
                children: [
                  {
                    type: 'text',
                    value: 'a',
                    position: {
                      end: { column: 4, line: 2, offset: 4 },
                      start: { column: 3, line: 2, offset: 3 },
                    },
                  },
                ],
                position: {
                  end: { column: 6, line: 2, offset: 6 },
                  start: { column: 1, line: 2, offset: 1 },
                },
              },
              {
                type: 'tableCell',
                children: [
                  {
                    type: 'text',
                    value: 'b',
                    position: {
                      end: { column: 8, line: 2, offset: 8 },
                      start: { column: 7, line: 2, offset: 7 },
                    },
                  },
                ],
                position: {
                  end: {
                    column: 10,
                    line: 2,
                    offset: 10,
                  },
                  start: {
                    column: 6,
                    line: 2,
                    offset: 6,
                  },
                },
              },
            ],
            position: {
              start: { column: 1, line: 2, offset: 1 },
              end: { column: 10, line: 2, offset: 10 },
            },
          },
          {
            type: 'tableRow',
            children: [
              {
                type: 'tableCell',
                rowspan: 2,
                children: [
                  {
                    type: 'text',
                    value: '1',
                    position: {
                      end: { column: 4, line: 4, offset: 24 },
                      start: { column: 3, line: 4, offset: 23 },
                    },
                  },
                ],
                position: {
                  end: { column: 6, line: 4, offset: 26 },
                  start: { column: 1, line: 4, offset: 21 },
                },
              },
              {
                type: 'tableCell',
                children: [
                  {
                    type: 'text',
                    value: '2',
                    position: {
                      start: { column: 7, line: 4, offset: 27 },
                      end: { column: 8, line: 4, offset: 28 },
                    },
                  },
                ],
                position: {
                  start: { column: 6, line: 4, offset: 26 },
                  end: { column: 10, line: 4, offset: 30 },
                },
              },
            ],
            position: {
              start: { column: 1, line: 4, offset: 21 },
              end: { column: 10, line: 4, offset: 30 },
            },
          },
          {
            type: 'tableRow',
            children: [
              {
                type: 'tableCell',
                children: [
                  {
                    type: 'text',
                    value: '3',
                    position: {
                      start: { column: 7, line: 5, offset: 37 },
                      end: { column: 8, line: 5, offset: 38 },
                    },
                  },
                ],
                position: {
                  start: { column: 6, line: 5, offset: 36 },
                  end: { column: 10, line: 5, offset: 40 },
                },
              },
            ],
            position: {
              end: { column: 10, line: 5, offset: 40 },
              start: { column: 1, line: 5, offset: 31 },
            },
          },
        ],
        position: {
          start: { column: 1, line: 2, offset: 1 },
          end: { column: 10, line: 5, offset: 40 },
        },
      },
    ],
    position: {
      start: { column: 1, line: 1, offset: 0 },
      end: { column: 1, line: 6, offset: 41 },
    },
  };
  const result = compile(md);
  expect(result).toEqual(mdast);
});

test('markdown -> mdast: marker in text', () => {
  const md = `^`;
  const mdast = {
    type: 'root',
    children: [
      {
        type: 'paragraph',
        children: [
          {
            type: 'Text',
            value: '^',
            position: {
              start: { column: 1, line: 1, offset: 0 },
              end: { column: 2, line: 1, offset: 1 },
            },
          },
        ],
        position: {
          start: { column: 1, line: 1, offset: 0 },
          end: { column: 2, line: 1, offset: 1 },
        },
      },
    ],
    position: {
      end: { column: 2, line: 1, offset: 1 },
      start: { column: 1, line: 1, offset: 0 },
    },
  };
  const result = compile(md);
  expect(result).toEqual(mdast);
});

import { test, expect } from 'vitest';

import { fromMarkdown } from 'mdast-util-from-markdown';
import { extendedTableFromMarkdown, extendedTableFromMarkdownOptions } from './from-markdown.js';
import { extendedTable } from 'micromark-extension-extended-table';
import { gfmTable } from 'micromark-extension-gfm-table';
import { gfmTableFromMarkdown } from 'mdast-util-gfm-table';

import { toHast } from 'mdast-util-to-hast';
import { extendedTableHandlers } from './mdast-to-hast';

const compile = (md: string, options?: extendedTableFromMarkdownOptions) =>
  fromMarkdown(md, {
    extensions: [gfmTable(), extendedTable],
    mdastExtensions: [gfmTableFromMarkdown(), extendedTableFromMarkdown(options)],
  });

const mdast2hast = (mdast: any) => {
  return toHast(mdast, {
    handlers: extendedTableHandlers,
  });
};

const md2hast = (md: string, options?: extendedTableFromMarkdownOptions) => {
  return mdast2hast(compile(md, options));
};

test('mdast to hast', () => {
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
                  end: { column: 10, line: 2, offset: 10 },
                  start: { column: 6, line: 2, offset: 6 },
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
  const expected = {
    type: 'root',
    children: [
      {
        type: 'element',
        tagName: 'table',
        properties: {},
        children: [
          { type: 'text', value: '\n' },
          {
            type: 'element',
            tagName: 'thead',
            properties: {},
            children: [
              { type: 'text', value: '\n' },
              {
                type: 'element',
                tagName: 'tr',
                properties: {},
                children: [
                  { type: 'text', value: '\n' },
                  {
                    type: 'element',
                    tagName: 'th',
                    properties: {
                      align: null,
                      colspan: undefined,
                      rowspan: undefined,
                    },
                    children: [
                      {
                        type: 'text',
                        value: 'a',
                        position: {
                          start: { column: 3, line: 2, offset: 3 },
                          end: { column: 4, line: 2, offset: 4 },
                        },
                      },
                    ],
                    position: {
                      start: { column: 1, line: 2, offset: 1 },
                      end: { column: 6, line: 2, offset: 6 },
                    },
                  },
                  { type: 'text', value: '\n' },
                  {
                    type: 'element',
                    tagName: 'th',
                    properties: {
                      align: null,
                      colspan: undefined,
                      rowspan: undefined,
                    },
                    children: [
                      {
                        type: 'text',
                        value: 'b',
                        position: {
                          start: { column: 7, line: 2, offset: 7 },
                          end: { column: 8, line: 2, offset: 8 },
                        },
                      },
                    ],
                    position: {
                      start: { column: 6, line: 2, offset: 6 },
                      end: { column: 10, line: 2, offset: 10 },
                    },
                  },
                  { type: 'text', value: '\n' },
                ],
                position: {
                  start: { column: 1, line: 2, offset: 1 },
                  end: { column: 10, line: 2, offset: 10 },
                },
              },
              { type: 'text', value: '\n' },
            ],
            position: {
              start: { column: 1, line: 2, offset: 1 },
              end: { column: 10, line: 2, offset: 10 },
            },
          },
          { type: 'text', value: '\n' },
          {
            type: 'element',
            tagName: 'tbody',
            properties: {},
            children: [
              { type: 'text', value: '\n' },
              {
                type: 'element',
                tagName: 'tr',
                properties: {},
                children: [
                  { type: 'text', value: '\n' },
                  {
                    type: 'element',
                    tagName: 'td',
                    properties: {
                      align: null,
                      colspan: undefined,
                      rowspan: 2,
                    },
                    children: [
                      {
                        type: 'text',
                        value: '1',
                        position: {
                          start: { column: 3, line: 4, offset: 23 },
                          end: { column: 4, line: 4, offset: 24 },
                        },
                      },
                    ],
                    position: {
                      start: { column: 1, line: 4, offset: 21 },
                      end: { column: 6, line: 4, offset: 26 },
                    },
                  },
                  { type: 'text', value: '\n' },
                  {
                    type: 'element',
                    tagName: 'td',
                    properties: {
                      align: null,
                      colspan: undefined,
                      rowspan: undefined,
                    },
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
                  { type: 'text', value: '\n' },
                ],
                position: {
                  start: { column: 1, line: 4, offset: 21 },
                  end: { column: 10, line: 4, offset: 30 },
                },
              },
              { type: 'text', value: '\n' },
              {
                type: 'element',
                tagName: 'tr',
                properties: {},
                children: [
                  { type: 'text', value: '\n' },
                  {
                    type: 'element',
                    tagName: 'td',
                    properties: {
                      align: null,
                      colspan: undefined,
                      rowspan: undefined,
                    },
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
                  { type: 'text', value: '\n' },
                ],
                position: {
                  start: { column: 1, line: 5, offset: 31 },
                  end: { column: 10, line: 5, offset: 40 },
                },
              },
              { type: 'text', value: '\n' },
            ],
            position: {
              start: { column: 1, line: 4, offset: 21 },
              end: { column: 10, line: 5, offset: 40 },
            },
          },
          { type: 'text', value: '\n' },
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

  const result = mdast2hast(mdast);
  expect(result).toEqual(expected);
});

test('align', () => {
  const md = `
| col 1 | col 2 | col 3 |
|---|---:|:---:|
| 1 | 2 | 4 |
| ^ | 3 | 5 |
| > | 6 | 7 |
`;
  const expected = {
    type: 'root',
    children: [
      {
        type: 'element',
        tagName: 'table',
        properties: {},
        children: [
          // table header
          { type: 'text', value: '\n' },
          {
            type: 'element',
            tagName: 'thead',
            properties: {},
            children: [
              { type: 'text', value: '\n' },
              {
                type: 'element',
                tagName: 'tr',
                properties: {},
                children: [
                  { type: 'text', value: '\n' },
                  {
                    type: 'element',
                    tagName: 'th',
                    properties: {
                      align: null,
                      colspan: undefined,
                      rowspan: undefined,
                    },
                    children: [
                      {
                        type: 'text',
                        value: 'col 1',
                        position: expect.anything(),
                      },
                    ],
                    position: expect.anything(),
                  },
                  { type: 'text', value: '\n' },
                  {
                    type: 'element',
                    tagName: 'th',
                    properties: {
                      align: 'right',
                      colspan: undefined,
                      rowspan: undefined,
                    },
                    children: [
                      {
                        type: 'text',
                        value: 'col 2',
                        position: expect.anything(),
                      },
                    ],
                    position: expect.anything(),
                  },
                  { type: 'text', value: '\n' },
                  {
                    type: 'element',
                    tagName: 'th',
                    properties: {
                      align: 'center',
                      colspan: undefined,
                      rowspan: undefined,
                    },
                    children: [
                      {
                        type: 'text',
                        value: 'col 3',
                        position: expect.anything(),
                      },
                    ],
                    position: expect.anything(),
                  },
                  { type: 'text', value: '\n' },
                ],
                position: expect.anything(),
              },
              { type: 'text', value: '\n' },
            ],
            position: expect.anything(),
          },
          // table body
          { type: 'text', value: '\n' },
          {
            type: 'element',
            tagName: 'tbody',
            properties: {},
            children: [
              // table row 1
              { type: 'text', value: '\n' },
              {
                type: 'element',
                tagName: 'tr',
                properties: {},
                children: [
                  { type: 'text', value: '\n' },
                  {
                    type: 'element',
                    tagName: 'td',
                    properties: {
                      align: null,
                      colspan: undefined,
                      rowspan: 2,
                    },
                    children: [
                      {
                        type: 'text',
                        value: '1',
                        position: expect.anything(),
                      },
                    ],
                    position: expect.anything(),
                  },
                  { type: 'text', value: '\n' },
                  {
                    type: 'element',
                    tagName: 'td',
                    properties: {
                      align: 'right',
                      colspan: undefined,
                      rowspan: undefined,
                    },
                    children: [
                      {
                        type: 'text',
                        value: '2',
                        position: expect.anything(),
                      },
                    ],
                    position: expect.anything(),
                  },
                  { type: 'text', value: '\n' },
                  {
                    type: 'element',
                    tagName: 'td',
                    properties: {
                      align: 'center',
                      colspan: undefined,
                      rowspan: undefined,
                    },
                    children: [
                      {
                        type: 'text',
                        value: '4',
                        position: expect.anything(),
                      },
                    ],
                    position: expect.anything(),
                  },
                  { type: 'text', value: '\n' },
                ],
                position: expect.anything(),
              },
              // table row 2
              { type: 'text', value: '\n' },
              {
                type: 'element',
                tagName: 'tr',
                properties: {},
                children: [
                  { type: 'text', value: '\n' },
                  {
                    type: 'element',
                    tagName: 'td',
                    properties: {
                      align: 'right',
                      colspan: undefined,
                      rowspan: undefined,
                    },
                    children: [
                      {
                        type: 'text',
                        value: '3',
                        position: expect.anything(),
                      },
                    ],
                    position: expect.anything(),
                  },
                  { type: 'text', value: '\n' },
                  {
                    type: 'element',
                    tagName: 'td',
                    properties: {
                      align: 'center',
                      colspan: undefined,
                      rowspan: undefined,
                    },
                    children: [
                      {
                        type: 'text',
                        value: '5',
                        position: expect.anything(),
                      },
                    ],
                    position: expect.anything(),
                  },
                  { type: 'text', value: '\n' },
                ],
                position: expect.anything(),
              },
              // table row 3
              { type: 'text', value: '\n' },
              {
                type: 'element',
                tagName: 'tr',
                properties: {},
                children: [
                  { type: 'text', value: '\n' },
                  {
                    type: 'element',
                    tagName: 'td',
                    properties: {
                      align: null,
                      colspan: 2,
                      rowspan: undefined,
                    },
                    children: [
                      {
                        type: 'text',
                        value: '6',
                        position: expect.anything(),
                      },
                    ],
                    position: expect.anything(),
                  },
                  { type: 'text', value: '\n' },
                  {
                    type: 'element',
                    tagName: 'td',
                    properties: {
                      align: 'center',
                      colspan: undefined,
                      rowspan: undefined,
                    },
                    children: [
                      {
                        type: 'text',
                        value: '7',
                        position: expect.anything(),
                      },
                    ],
                    position: expect.anything(),
                  },
                  { type: 'text', value: '\n' },
                ],
                position: expect.anything(),
              },
              { type: 'text', value: '\n' },
            ],
            position: expect.anything(),
          },
          { type: 'text', value: '\n' },
        ],
        position: expect.anything(),
      },
    ],
    position: expect.anything(),
  };
  const result = md2hast(md);
  expect(result).toEqual(expected);
});

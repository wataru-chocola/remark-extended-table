import { test, expect } from 'vitest';

import { fromMarkdown } from 'mdast-util-from-markdown';
import { extendedTableFromMarkdown, extendedTableFromMarkdownOptions } from './from-markdown.js';
import { extendedTable } from 'micromark-extension-extended-table';
import { gfmTable } from 'micromark-extension-gfm-table';
import { gfmTableFromMarkdown } from 'mdast-util-gfm-table';

const compile = (md: string, options?: extendedTableFromMarkdownOptions) =>
  fromMarkdown(md, {
    extensions: [gfmTable(), extendedTable],
    mdastExtensions: [gfmTableFromMarkdown(), extendedTableFromMarkdown(options)],
  });

test('simple rowspan', () => {
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
                  end: { column: 5, line: 2, offset: 5 },
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
                  start: { column: 5, line: 2, offset: 5 },
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
                  end: { column: 5, line: 4, offset: 25 },
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
                  start: { column: 5, line: 4, offset: 25 },
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
                  start: { column: 5, line: 5, offset: 35 },
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

test('simple colspan', () => {
  const md = `
| a | b |
|---|---|
| 1 | 2 |
| > | 3 |
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
                  end: { column: 5, line: 2, offset: 5 },
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
                  start: { column: 5, line: 2, offset: 5 },
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
                  end: { column: 5, line: 4, offset: 25 },
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
                  start: { column: 5, line: 4, offset: 25 },
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
                colspan: 2,
                position: {
                  start: { column: 5, line: 5, offset: 35 },
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

test('caret marker in text', () => {
  const md = `^`;
  const mdast = {
    type: 'root',
    children: [
      {
        type: 'paragraph',
        children: [
          {
            type: 'text',
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

test('greaterThan marker in text', () => {
  const md = `# >`;
  const mdast = {
    type: 'root',
    children: [
      {
        type: 'heading',
        depth: 1,
        children: [
          {
            type: 'text',
            value: '>',
            position: {
              start: { column: 3, line: 1, offset: 2 },
              end: { column: 4, line: 1, offset: 3 },
            },
          },
        ],
        position: {
          start: { column: 1, line: 1, offset: 0 },
          end: { column: 4, line: 1, offset: 3 },
        },
      },
    ],
    position: {
      end: { column: 4, line: 1, offset: 3 },
      start: { column: 1, line: 1, offset: 0 },
    },
  };
  const result = compile(md);
  expect(result).toEqual(mdast);
});

test('empty cell colspan', () => {
  const md = `
| a | b |
|---|---|
| 1    ||
| 3 |   |
|| 4    |
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
                  end: { column: 5, line: 2, offset: 5 },
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
                  start: { column: 5, line: 2, offset: 5 },
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
                colspan: 2,
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
                  end: { column: 8, line: 4, offset: 28 },
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
                      start: { column: 3, line: 5, offset: 33 },
                      end: { column: 4, line: 5, offset: 34 },
                    },
                  },
                ],
                position: {
                  start: { column: 1, line: 5, offset: 31 },
                  end: { column: 5, line: 5, offset: 35 },
                },
              },
              {
                type: 'tableCell',
                children: [],
                position: {
                  start: { column: 5, line: 5, offset: 35 },
                  end: { column: 10, line: 5, offset: 40 },
                },
              },
            ],
            position: {
              start: { column: 1, line: 5, offset: 31 },
              end: { column: 10, line: 5, offset: 40 },
            },
          },
          {
            type: 'tableRow',
            children: [
              {
                type: 'tableCell',
                children: [],
                position: {
                  start: { column: 1, line: 6, offset: 41 },
                  end: { column: 2, line: 6, offset: 42 },
                },
              },
              {
                type: 'tableCell',
                children: [
                  {
                    type: 'text',
                    value: '4',
                    position: {
                      start: { column: 4, line: 6, offset: 44 },
                      end: { column: 5, line: 6, offset: 45 },
                    },
                  },
                ],
                position: {
                  start: { column: 2, line: 6, offset: 42 },
                  end: { column: 10, line: 6, offset: 50 },
                },
              },
            ],
            position: {
              start: { column: 1, line: 6, offset: 41 },
              end: { column: 10, line: 6, offset: 50 },
            },
          },
        ],
        position: {
          start: { column: 1, line: 2, offset: 1 },
          end: { column: 10, line: 6, offset: 50 },
        },
      },
    ],
    position: {
      start: { column: 1, line: 1, offset: 0 },
      end: { column: 1, line: 7, offset: 51 },
    },
  };
  const result = compile(md, { colspanWithEmpty: true });
  expect(result).toEqual(mdast);
});

test('not empty cell colspan', () => {
  const md = `
 a | b 
---|---
 1 | 
 2 |\\|
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
                      start: { column: 2, line: 2, offset: 2 },
                      end: { column: 3, line: 2, offset: 3 },
                    },
                  },
                ],
                position: {
                  start: { column: 2, line: 2, offset: 2 },
                  end: { column: 4, line: 2, offset: 4 },
                },
              },
              {
                type: 'tableCell',
                children: [
                  {
                    type: 'text',
                    value: 'b',
                    position: {
                      start: { column: 6, line: 2, offset: 6 },
                      end: { column: 7, line: 2, offset: 7 },
                    },
                  },
                ],
                position: {
                  start: { column: 4, line: 2, offset: 4 },
                  end: { column: 8, line: 2, offset: 8 },
                },
              },
            ],
            position: {
              start: { column: 2, line: 2, offset: 2 },
              end: { column: 8, line: 2, offset: 8 },
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
                    value: '1',
                    position: {
                      start: { column: 2, line: 4, offset: 18 },
                      end: { column: 3, line: 4, offset: 19 },
                    },
                  },
                ],
                position: {
                  start: { column: 2, line: 4, offset: 18 },
                  end: { column: 6, line: 4, offset: 22 },
                },
              },
              {
                type: 'tableCell',
                children: [],
                //position: {
                //  start: { column: 5, line: 4, offset: 21 },
                //  end: { column: 6, line: 4, offset: 22 },
                //},
              },
            ],
            position: {
              start: { column: 2, line: 4, offset: 18 },
              end: { column: 6, line: 4, offset: 22 },
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
                    value: '2',
                    position: {
                      start: { column: 2, line: 5, offset: 24 },
                      end: { column: 3, line: 5, offset: 25 },
                    },
                  },
                ],
                position: {
                  start: { column: 2, line: 5, offset: 24 },
                  end: { column: 4, line: 5, offset: 26 },
                },
              },
              {
                type: 'tableCell',
                children: [
                  {
                    type: 'text',
                    value: '|',
                    position: {
                      start: { column: 5, line: 5, offset: 27 },
                      end: { column: 7, line: 5, offset: 29 },
                    },
                  },
                ],
                position: {
                  start: { column: 4, line: 5, offset: 26 },
                  end: { column: 7, line: 5, offset: 29 },
                },
              },
            ],
            position: {
              start: { column: 2, line: 5, offset: 24 },
              end: { column: 7, line: 5, offset: 29 },
            },
          },
        ],
        position: {
          start: { column: 2, line: 2, offset: 2 },
          end: { column: 7, line: 5, offset: 29 },
        },
      },
    ],
    position: {
      start: { column: 1, line: 1, offset: 0 },
      end: { column: 1, line: 6, offset: 30 },
    },
  };
  const result = compile(md, { colspanWithEmpty: true });
  expect(result).toEqual(mdast);
});

test('align', () => {
  const md = `
| col 1 | col 2 | col 3 |
|---|---:|:---:|
| 1 | 2 | 4 |
| ^ | 3 | 5 |
| > | 6 | 7 |
`;
  const mdast = {
    type: 'root',
    children: [
      {
        type: 'table',
        align: [null, 'right', 'center'],
        children: [
          {
            type: 'tableRow',
            children: [
              {
                type: 'tableCell',
                children: [{ type: 'text', value: 'col 1', position: expect.anything() }],
                position: expect.anything(),
              },
              {
                type: 'tableCell',
                children: [{ type: 'text', value: 'col 2', position: expect.anything() }],
                position: expect.anything(),
              },
              {
                type: 'tableCell',
                children: [{ type: 'text', value: 'col 3', position: expect.anything() }],
                position: expect.anything(),
              },
            ],
            position: expect.anything(),
          },
          {
            type: 'tableRow',
            children: [
              {
                type: 'tableCell',
                children: [{ type: 'text', value: '1', position: expect.anything() }],
                rowspan: 2,
                position: expect.anything(),
              },
              {
                type: 'tableCell',
                children: [{ type: 'text', value: '2', position: expect.anything() }],
                position: expect.anything(),
              },
              {
                type: 'tableCell',
                children: [{ type: 'text', value: '4', position: expect.anything() }],
                position: expect.anything(),
              },
            ],
            position: expect.anything(),
          },
          {
            type: 'tableRow',
            children: [
              {
                type: 'tableCell',
                children: [{ type: 'text', value: '3', position: expect.anything() }],
                position: expect.anything(),
              },
              {
                type: 'tableCell',
                children: [{ type: 'text', value: '5', position: expect.anything() }],
                position: expect.anything(),
              },
            ],
            position: expect.anything(),
          },
          {
            type: 'tableRow',
            children: [
              {
                type: 'tableCell',
                children: [{ type: 'text', value: '6', position: expect.anything() }],
                colspan: 2,
                position: expect.anything(),
              },
              {
                type: 'tableCell',
                children: [{ type: 'text', value: '7', position: expect.anything() }],
                position: expect.anything(),
              },
            ],
            position: expect.anything(),
          },
        ],
        position: expect.anything(),
      },
    ],
    position: expect.anything(),
  };
  const result = compile(md);
  expect(result).toEqual(mdast);
});

test('regression: more than 2 colspanWithRight is not working', () => {
  const md = `
| a | b | c |
| - | - | - |
| > | > | 1 |
`;
  const mdast = {
    type: 'root',
    children: [
      {
        type: 'table',
        align: [null, null, null],
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
                      start: { column: 3, line: 2, offset: 3 },
                      end: { column: 4, line: 2, offset: 4 },
                    },
                  },
                ],
                position: {
                  start: { column: 1, line: 2, offset: 1 },
                  end: { column: 5, line: 2, offset: 5 },
                },
              },
              {
                type: 'tableCell',
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
                  start: { column: 5, line: 2, offset: 5 },
                  end: { column: 9, line: 2, offset: 9 },
                },
              },
              {
                type: 'tableCell',
                children: [
                  {
                    type: 'text',
                    value: 'c',
                    position: {
                      start: { column: 11, line: 2, offset: 11 },
                      end: { column: 12, line: 2, offset: 12 },
                    },
                  },
                ],
                position: {
                  end: { column: 14, line: 2, offset: 14 },
                  start: { column: 9, line: 2, offset: 9 },
                },
              },
            ],
            position: {
              start: { column: 1, line: 2, offset: 1 },
              end: { column: 14, line: 2, offset: 14 },
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
                    value: '1',
                    position: {
                      end: { column: 12, line: 4, offset: 40 },
                      start: { column: 11, line: 4, offset: 39 },
                    },
                  },
                ],
                colspan: 3,
                position: {
                  start: { column: 9, line: 4, offset: 37 },
                  end: { column: 14, line: 4, offset: 42 },
                },
              },
            ],
            position: {
              start: { column: 1, line: 4, offset: 29 },
              end: { column: 14, line: 4, offset: 42 },
            },
          },
        ],
        position: {
          start: { column: 1, line: 2, offset: 1 },
          end: { column: 14, line: 4, offset: 42 },
        },
      },
    ],
    position: {
      start: { column: 1, line: 1, offset: 0 },
      end: { column: 1, line: 5, offset: 43 },
    },
  };
  const result = compile(md, { colspanWithEmpty: true });
  expect(result).toEqual(mdast);
});

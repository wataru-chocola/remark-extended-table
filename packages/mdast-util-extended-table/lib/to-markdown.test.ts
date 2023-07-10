import { test, expect } from 'vitest';

import { extendedTableToMarkdown } from './to-markdown.js';
import { gfmTableToMarkdown } from 'mdast-util-gfm-table';
import { toMarkdown } from 'mdast-util-to-markdown';

const compile = (mdast: any) =>
  toMarkdown(mdast, {
    extensions: [gfmTableToMarkdown(), extendedTableToMarkdown()],
  });

test('simple rowspan', () => {
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

test('rowspan and colspan', () => {
  const mdast = {
    type: 'root',
    children: [
      {
        type: 'table',
        align: [null, null, null, null],
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
              {
                type: 'tableCell',
                children: [{ type: 'text', value: 'c' }],
              },
              {
                type: 'tableCell',
                children: [{ type: 'text', value: 'd' }],
              },
            ],
          },
          {
            type: 'tableRow',
            children: [
              {
                type: 'tableCell',
                rowspan: 3,
                colspan: 3,
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
          {
            type: 'tableRow',
            children: [
              {
                type: 'tableCell',
                children: [{ type: 'text', value: '4' }],
              },
            ],
          },
          {
            type: 'tableRow',
            children: [
              {
                type: 'tableCell',
                children: [{ type: 'text', value: '5' }],
              },
              {
                type: 'tableCell',
                children: [{ type: 'text', value: '6' }],
              },
              {
                type: 'tableCell',
                children: [{ type: 'text', value: '7' }],
              },
              {
                type: 'tableCell',
                children: [{ type: 'text', value: '8' }],
              },
            ],
          },
        ],
      },
    ],
  };
  const md = `| a | b | c | d |
| - | - | - | - |
| > | > | 1 | 2 |
| ^ | ^ | ^ | 3 |
| ^ | ^ | ^ | 4 |
| 5 | 6 | 7 | 8 |
`;
  const result = compile(mdast);
  expect(result).toEqual(md);
});

test('escape unsafe', () => {
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
                children: [{ type: 'text', value: '^' }],
              },
              {
                type: 'tableCell',
                children: [{ type: 'text', value: '>' }],
              },
            ],
          },
        ],
      },
    ],
  };
  const md = `| a  | b  |
| -- | -- |
| \\^ | \\> |
`;
  const result = compile(mdast);
  expect(result).toEqual(md);
});

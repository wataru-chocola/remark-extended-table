import type { Handle } from 'mdast-util-to-markdown';
import { gfmTableToMarkdown } from 'mdast-util-gfm-table';
import type { Options as gfmTableToMarkdownOptions } from 'mdast-util-gfm-table';
import type { Table, TableCell } from './types.js';

export type extendedTableToMarkdownOptions = gfmTableToMarkdownOptions;

function makeColspanCellNode(): TableCell {
  return {
    type: 'tableCell',
    // @ts-ignore
    children: [{ type: 'tableCellColspan', children: [] as string[] }],
  };
}

function makeRowspanCellNode(): TableCell {
  return {
    type: 'tableCell',
    // @ts-ignore
    children: [{ type: 'tableCellRowspan', children: [] as string[] }],
  };
}

export const extendedTableToMarkdown = (options?: extendedTableToMarkdownOptions) => {
  const tableHandler: Handle = (node: Table, parent, context, safeOptions) => {
    for (let i = 1; i < node.children.length; i++) {
      const row = node.children[i];

      let j = 0;
      while (j < row.children.length) {
        const cell = node.children[i].children[j];

        const offsetCol = expandColspan(node, cell, i, j);
        expandRowspan(node, cell, i, j);

        j += 1 + offsetCol;
      }
    }
    return gfmTableToMarkdown(options).handlers!.table!(node, parent, context, safeOptions);
  };

  function expandColspan(table: Table, cell: TableCell, i: number, j: number): number {
    let offsetCol = 0;
    if (cell.colspan == null || cell.colspan <= 1) {
      return offsetCol;
    }
    for (let k = 0; k < cell.colspan - 1; k++) {
      table.children[i].children.splice(j, 0, makeColspanCellNode());
      offsetCol += 1;
    }
    return offsetCol;
  }

  function expandRowspan(table: Table, cell: TableCell, i: number, j: number): void {
    if (cell.rowspan == null || cell.rowspan <= 1) {
      return;
    }
    for (let k = 0; k < cell.rowspan - 1; k++) {
      const targetRow = table.children[i + k + 1];
      for (let l = 0; l < (cell.colspan ? cell.colspan : 1); l++) {
        targetRow.children.splice(j + l, 0, makeRowspanCellNode());
      }
    }
  }

  const handleCellColspan: Handle = (_node, _parent, _context) => {
    return '>';
  };

  const handleCellRowspan: Handle = (_node, _parent, _context) => {
    return '^';
  };

  return {
    unsafe: [
      { character: '^', inConstruct: ['tableCell' as const] },
      { character: '>', inConstruct: ['tableCell' as const] },
    ],
    handlers: {
      table: tableHandler,
      tableCellColspan: handleCellColspan,
      tableCellRowspan: handleCellRowspan,
    },
  };
};

import type { CompileContext, Token } from 'mdast-util-from-markdown';
import type { Root, Text } from 'mdast';
import type { Table, TableCell, TableCellColspanNode, TableCellRowspanNode } from './types';
import { types } from 'micromark-extension-extended-table';
import { visit } from 'unist-util-visit';

export const extendedTableFromMarkdown = {
  enter: {
    [types.extendedTableCellColspanMarker]: enterColspanMarker,
    [types.extendedTableCellRowspanMarker]: enterRowspanMarker,
    tableData: enterCell,
  },
  exit: {
    [types.extendedTableCellColspanMarker]: exit,
    [types.extendedTableCellRowspanMarker]: exit,
    tableData: exitCell,
  },
  transforms: [transformTable],
};

function enterCell(this: CompileContext, token: Token): void {
  this.enter<TableCell>({ type: 'tableCell', children: [] }, token);
  this.setData('inTableCell', true);
}

function enterColspanMarker(this: CompileContext, token: Token): void {
  if (this.getData('inTableCell')) {
    // @ts-ignore
    this.enter<TableCellColspanNode>({ type: 'tableCellColspan' }, token);
  } else {
    this.enter({ type: 'text', value: '>' }, token);
  }
}

function enterRowspanMarker(this: CompileContext, token: Token): void {
  if (this.getData('inTableCell')) {
    // @ts-ignore
    this.enter<TableCellRowspanNode>({ type: 'tableCellRowspan' }, token);
  } else {
    this.enter({ type: 'text', value: '^' }, token);
  }
}

function exitCell(this: CompileContext, token: Token): void {
  this.exit(token);
  this.setData('inTableCell');
}

function exit(this: CompileContext, token: Token): void {
  this.exit(token);
}

function transformTable(tree: Root): Root {
  visit(tree, 'table', (node: Table) => {
    const toBeDeleted: Array<[number, number]> = [];
    processTableCell(node, (cell: TableCell, i: number, j: number) => {
      const row = node.children[i];
      if (isCellColspan(cell)) {
        if (j >= row.children.length - 1) {
          makeTextFromCell(cell);
        } else {
          row.children[j + 1].colspan = 1 + (cell.colspan ? cell.colspan : 1);
          toBeDeleted.push([i, j]);
        }
      } else if (isCellRowspan(cell)) {
        if (i <= 1) {
          makeTextFromCell(cell);
        } else {
          const prev_row = node.children[i - 1];
          prev_row.children[j].rowspan = 1 + (cell.rowspan ? cell.rowspan : 1);
          toBeDeleted.push([i, j]);
        }
      }
    });

    for (let point of toBeDeleted) {
      const [i, j] = point;
      node.children[i].children.splice(j, 1);
    }
  });
  return tree;
}

function makeTextFromCell(cell: TableCell): void {
  const value = isCellColspan(cell) ? '>' : '^';
  const text: Text = {
    type: 'text',
    value: value,
    position: Object.assign({}, cell.children[0].position),
  };
  cell.children.splice(0, 1, text);
}

function processTableCell(
  table: Table,
  callback: (cell: TableCell, i: number, j: number) => void,
): void {
  for (let i = table.children.length - 1; i >= 0; i--) {
    const row = table.children[i];
    for (let j = row.children.length - 1; j >= 0; j--) {
      callback(row.children[j], i, j);
    }
  }
}

function isCellColspan(cell: TableCell): Boolean {
  if (cell.children.length !== 1) {
    return false;
  }
  const cellContent = cell.children[0];
  // @ts-ignore
  return cellContent.type === 'tableCellColspan';
}

function isCellRowspan(cell: TableCell): Boolean {
  if (cell.children.length !== 1) {
    return false;
  }
  const cellContent = cell.children[0];
  // @ts-ignore
  return cellContent.type === 'tableCellRowspan';
}

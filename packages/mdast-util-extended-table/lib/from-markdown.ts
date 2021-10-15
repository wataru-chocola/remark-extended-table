import type { CompileContext, Token } from 'mdast-util-from-markdown';
import type { Parent, Root, Table, TableCell } from 'mdast';
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

interface TableCellNode extends Parent {
  type: 'tableCell';
  colspan?: number;
  rowspan?: number;
  children: [];
}

interface TableCellColspanNode extends Node {
  type: 'tableCellColspan';
}

interface TableCellRowspanNode extends Node {
  type: 'tableCellRowspan';
}

function enterCell(this: CompileContext, token: Token): void {
  // @ts-ignore
  this.enter<TableCellNode>({ type: 'tableCell', children: [] }, token);
  this.setData('inTableCell', true);
}

function enterColspanMarker(this: CompileContext, token: Token): void {
  if (this.getData('inTableCell')) {
    // @ts-ignore
    this.enter<TableCellColspanNode>({ type: 'tableCellColspan' }, token);
  } else {
    // @ts-ignore
    this.enter({ type: 'Text', value: '>' }, token);
  }
}

function enterRowspanMarker(this: CompileContext, token: Token): void {
  if (this.getData('inTableCell')) {
    // @ts-ignore
    this.enter<TableCellColspanNode>({ type: 'tableCellRowspan' }, token);
  } else {
    // @ts-ignore
    this.enter({ type: 'Text', value: '^' }, token);
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
    for (let i = node.children.length - 1; i >= 0; i--) {
      const row = node.children[i];
      for (let j = row.children.length - 1; j >= 0; j--) {
        const cell = row.children[j];
        if (isCellColspan(cell)) {
          // @ts-ignore
          row.children[j - 1].colspan = 1 + (cell.colspan ? cell.colspan : 1);
          row.children.splice(j, 1);
        } else if (isCellRowspan(cell)) {
          const prev_row = node.children[i - 1];
          // @ts-ignore
          prev_row.children[j].rowspan = 1 + (cell.rowspan ? cell.rowspan : 1);
          row.children.splice(j, 1);
        }
      }
    }
  });
  return tree;
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

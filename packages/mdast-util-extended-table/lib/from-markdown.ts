import type { CompileContext, Token } from 'mdast-util-from-markdown';
import type { Root, Text } from 'mdast';
import { mdastTypes } from './types.js';
import type { Table, TableCell } from './types.js';
import { types } from 'micromark-extension-extended-table';
import { visit } from 'unist-util-visit';

export interface extendedTableFromMarkdownOptions {
  colspanWithEmpty?: boolean;
}

export const extendedTableFromMarkdown = (options?: extendedTableFromMarkdownOptions) => {
  return {
    enter: {
      [types.extendedTableCellColspanMarker]: enterColspanMarker,
      [types.extendedTableCellRowspanMarker]: enterRowspanMarker,
      tableHeader: enterCell,
      tableData: enterCell,
    },
    exit: {
      [types.extendedTableCellColspanMarker]: exit,
      [types.extendedTableCellRowspanMarker]: exit,
      tableHeader: exitCell,
      tableData: exitCell,
    },
    transforms: [transformTable],
  };

  function enterCell(this: CompileContext, token: Token): void {
    this.enter({ type: 'tableCell', children: [] }, token);
    this.data.inTableCell = true;
  }

  function enterColspanMarker(this: CompileContext, token: Token): void {
    if (this.data.inTableCell) {
      this.enter({ type: mdastTypes.tableCellColspanWithRight }, token);
    } else {
      this.enter({ type: 'text', value: '>' }, token);
    }
  }

  function enterRowspanMarker(this: CompileContext, token: Token): void {
    if (this.data.inTableCell) {
      this.enter({ type: mdastTypes.tableCellRowspan }, token);
    } else {
      this.enter({ type: 'text', value: '^' }, token);
    }
  }

  function exitCell(this: CompileContext, token: Token): void {
    if (options?.colspanWithEmpty && ['|', '||'].includes(this.sliceSerialize(token))) {
      this.enter({ type: mdastTypes.tableCellColspanWithLeft }, token);
      this.exit(token);
    }
    this.exit(token);
    this.data.inTableCell = undefined;
  }

  function exit(this: CompileContext, token: Token): void {
    this.exit(token);
  }

  function processSpanMarkers(table: Table) {
    const toBeDeleted: [number, number][] = [];
    for (let i = table.children.length - 1; i >= 0; i--) {
      const row = table.children[i];
      for (let j = row.children.length - 1; j >= 0; j--) {
        const cell = row.children[j];
        if (cell.children.length !== 1) continue;

        switch (cell.children[0].type) {
          case mdastTypes.tableCellColspanWithRight:
            if (j >= row.children.length - 1) {
              marker2text(cell);
              break;
            }
            for (let k = 1; j + k < row.children.length; k++) {
              row.children[j + k].colspan = (row.children[j + k].colspan ?? 1) + 1;
              if (!isCellColspanWithRight(row.children[j + k])) break;
            }
            toBeDeleted.push([i, j]);
            break;

          case mdastTypes.tableCellRowspan: {
            if (i <= 1) {
              marker2text(cell);
              break;
            }

            const prev_row = table.children[i - 1];
            prev_row.children[j].rowspan =
              (prev_row.children[j].rowspan ?? 1) + (cell.rowspan ?? 1);
            toBeDeleted.push([i, j]);
            break;
          }

          case mdastTypes.tableCellColspanWithLeft:
            if (j < 1 || isCellColspanWithRight(row.children[j - 1])) {
              // behave as a normal empty cell when conflicting with colspanWithRight marker
              marker2text(cell);
              break;
            }
            row.children[j - 1].colspan = (row.children[j - 1].colspan ?? 1) + (cell.colspan ?? 1);
            toBeDeleted.push([i, j]);
            break;
        }
      }
    }

    for (const point of toBeDeleted) {
      const [i, j] = point;
      table.children[i].children.splice(j, 1);
    }
  }

  function transformTable(tree: Root): Root {
    visit(tree, 'table', (node: Table) => {
      // create empty cell node
      if (node.align) {
        for (const row of node.children) {
          for (let i = 0; i < node.align.length - row.children.length; i++) {
            row.children.push(makeCell());
          }
        }
      }

      // process span markers
      processSpanMarkers(node);
    });
    return tree;
  }
};

function makeCell(): TableCell {
  return {
    type: 'tableCell',
    children: [],
  };
}

function marker2text(cell: TableCell): void {
  if (cell.children.length !== 1) {
    return;
  }
  let text: string | null;
  switch (cell.children[0].type) {
    case mdastTypes.tableCellColspanWithRight:
      text = '>';
      break;
    case mdastTypes.tableCellRowspan:
      text = '^';
      break;
    case mdastTypes.tableCellColspanWithLeft:
      text = null;
      break;
    default:
      return;
  }
  if (text == null) {
    cell.children.splice(0, 1);
  } else {
    const textNode: Text = {
      type: 'text',
      value: text,
      position: cell.children[0].position != null ? { ...cell.children[0].position } : undefined,
    };
    cell.children.splice(0, 1, textNode);
  }
}

function isCellColspanWithRight(cell: TableCell): boolean {
  if (cell.children.length !== 1) {
    return false;
  }
  const cellContent = cell.children[0];
  return cellContent.type === mdastTypes.tableCellColspanWithRight;
}

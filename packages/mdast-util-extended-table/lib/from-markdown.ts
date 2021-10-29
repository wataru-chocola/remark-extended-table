import type { CompileContext, Token } from 'mdast-util-from-markdown';
import type { Root, Text } from 'mdast';
import { mdastTypes } from './types.js';
import type {
  Table,
  TableCell,
  TableCellColspanWithRightNode,
  TableCellColspanWithLeftNode,
  TableCellRowspanNode,
} from './types.js';
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
    this.enter<TableCell>({ type: 'tableCell', children: [] }, token);
    this.setData('inTableCell', true);
  }

  function enterColspanMarker(this: CompileContext, token: Token): void {
    if (this.getData('inTableCell')) {
      // @ts-ignore
      this.enter<TableCellColspanWithRightNode>(
        { type: mdastTypes.tableCellColspanWithRight },
        token,
      );
    } else {
      this.enter({ type: 'text', value: '>' }, token);
    }
  }

  function enterRowspanMarker(this: CompileContext, token: Token): void {
    if (this.getData('inTableCell')) {
      // @ts-ignore
      this.enter<TableCellRowspanNode>({ type: mdastTypes.tableCellRowspan }, token);
    } else {
      this.enter({ type: 'text', value: '^' }, token);
    }
  }

  function exitCell(this: CompileContext, token: Token): void {
    if (options?.colspanWithEmpty && this.sliceSerialize(token) === '|') {
      // @ts-ignore
      this.enter<TableCellColspanWithLeftNode>(
        { type: mdastTypes.tableCellColspanWithLeft },
        token,
      );
      this.exit(token);
    }
    this.exit(token);
    this.setData('inTableCell');
  }

  function exit(this: CompileContext, token: Token): void {
    this.exit(token);
  }

  function transformTable(tree: Root): Root {
    visit(tree, 'table', (node: Table) => {
      // create empty cell node
      if (node.align) {
        for (let row of node.children) {
          for (let i = 0; i < node.align.length - row.children.length; i++) {
            row.children.push(makeCell());
          }
        }
      }

      // process span markers
      const toBeDeleted: Array<[number, number]> = [];
      processTableCell(node, (cell: TableCell, i: number, j: number) => {
        const row = node.children[i];
        if (cell.children.length !== 1) {
          return;
        }
        switch (cell.children[0].type) {
          case mdastTypes.tableCellColspanWithRight:
            if (j >= row.children.length - 1) {
              marker2text(cell);
            } else {
              row.children[j + 1].colspan =
                (row.children[j + 1].colspan || 1) + (cell.colspan || 1);
              toBeDeleted.push([i, j]);
            }
            break;

          case mdastTypes.tableCellRowspan:
            if (i <= 1) {
              marker2text(cell);
            } else {
              const prev_row = node.children[i - 1];
              prev_row.children[j].rowspan =
                (prev_row.children[j].rowspan || 1) + (cell.rowspan || 1);
              toBeDeleted.push([i, j]);
            }
            break;

          case mdastTypes.tableCellColspanWithLeft:
            if (j >= 1) {
              if (isCellColspanWithRight(row.children[j - 1])) {
                // behave as a normal empty cell when conflicting with colspanWithRight marker
                marker2text(cell);
              } else {
                row.children[j - 1].colspan =
                  (row.children[j - 1].colspan || 1) + (cell.colspan ? cell.colspan : 1);
                toBeDeleted.push([i, j]);
              }
            } else {
              marker2text(cell);
            }
            break;
        }
      });

      for (let point of toBeDeleted) {
        const [i, j] = point;
        node.children[i].children.splice(j, 1);
      }
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
      position: Object.assign({}, cell.children[0].position),
    };
    cell.children.splice(0, 1, textNode);
  }
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

function isCellColspanWithRight(cell: TableCell): Boolean {
  if (cell.children.length !== 1) {
    return false;
  }
  const cellContent = cell.children[0];
  // @ts-ignore
  return cellContent.type === mdastTypes.tableCellColspanWithRight;
}

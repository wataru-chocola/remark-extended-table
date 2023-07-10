import type {
  Table as MdastTable,
  TableRow as MdastTableRow,
  TableCell as MdastTableCell,
} from 'mdast';
import type { Node } from 'unist';

export const mdastTypes = {
  tableCellColspanWithRight: 'tableCellColspanWithRight',
  tableCellColspanWithLeft: 'tableCellColspanWithLeft',
  tableCellRowspan: 'tableCellRowspan',
};

export type Table = Omit<MdastTable, 'children'> & {
  children: Array<TableRow>;
};

export type TableRow = Omit<MdastTableRow, 'children'> & {
  children: Array<TableCell>;
};

export type TableCell = MdastTableCell & {
  colspan?: number;
  rowspan?: number;
};

export interface TableCellColspanWithRightNode extends Node {
  type: 'tableCellColspanWithRight';
}

export interface TableCellColspanWithLeftNode extends Node {
  type: 'tableCellColspanWithLeft';
}

export interface TableCellRowspanNode extends Node {
  type: 'tableCellRowspan';
}

declare module 'mdast-util-from-markdown' {
  interface CompileData {
    inTableCell?: boolean;
  }
}

declare module 'mdast-util-to-markdown' {
  interface ConstructNameMap {
    tableCell: 'tableCell';
  }
}

import type {
  Table as MdastTable,
  TableRow as MdastTableRow,
  TableCell as MdastTableCell,
} from 'mdast';
import type { Node } from 'unist';

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

export interface TableCellColspanNode extends Node {
  type: 'tableCellColspan';
}

export interface TableCellRowspanNode extends Node {
  type: 'tableCellRowspan';
}

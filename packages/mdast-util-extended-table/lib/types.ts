import type {
  Table as MdastTable,
  TableRow as MdastTableRow,
  TableCell as MdastTableCell,
} from 'mdast';

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

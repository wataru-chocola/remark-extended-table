# mdast-util-extended-table

mdast extensions for extended table syntax

## Feature

This package provides mdast utilities to handle extended table syntax with [micromark-extension-extended-table][].


This includes:

 * `extendedTableFromMarkdown`: [mdast-util-from-markdown] extension
 * `extendedTableToMarkdown`: [mdast-util-to-markdown] extension
 * `extendedTableMdast2HastHandlers`: [mdast-util-to-hast] extension

## Install

```
$ npm install mdast-util-extended-table
```

## Use

T.B.D

## Mdast Node Extension

`mdast-util-extended-table` extends [mdast TableCell node](https://github.com/syntax-tree/mdast#tablecell).

```typescript
import type {
  Table as MdastTable,
  TableRow as MdastTableRow,
  TableCell as MdastTableCell,
} from 'mdast';

type Table = Omit<MdastTable, 'children'> & {
  children: Array<TableRow>;
};

type TableRow = Omit<MdastTableRow, 'children'> & {
  children: Array<TableCell>;
};

type TableCell = MdastTableCell & {
  colspan?: number;
  rowspan?: number;
};
```


[mdast-util-from-markdown]: https://github.com/syntax-tree/mdast-util-from-markdown
[mdast-util-to-markdown]: https://github.com/syntax-tree/mdast-util-to-markdown
[mdast-util-to-hast]: https://github.com/syntax-tree/mdast-util-to-hast

[micromark-extension-extended-table]: ../micromark-extension-extended-table
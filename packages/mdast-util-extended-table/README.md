# mdast-util-extended-table

mdast extensions for extended table syntax

## Feature

This package provides mdast utilities to handle extended table syntax with [micromark-extension-extended-table][].


This includes:

 * `extendedTableFromMarkdown()`: factory function of [mdast-util-from-markdown] extension
 * `extendedTableToMarkdown()`: factory function of [mdast-util-to-markdown] extension
 * `extendedTableHandlers`: [mdast-util-to-hast] extension

## Important

`extendedTableFromMarkdown()` and `extendedTableToMarkdown` override some handlers for [mdast-util-gfm-table][].
If you encounter any problems, disable this first and see what happens.


## Install

```
$ npm install mdast-util-extended-table
```

## Use

```typescript
import {
  extendedTableFromMarkdown,
  extendedTableToMarkdown,
  extendedTableHandlers,
} from 'mdast-util-extended-table';

import { extendedTable } from 'micromark-extension-extended-table';
import { gfmTable } from 'micromark-extension-gfm-table';
import { gfmTableFromMarkdown, gfmTableToMarkdown } from 'mdast-util-gfm-table';

import { fromMarkdown } from 'mdast-util-from-markdown';
import { toMarkdown } from 'mdast-util-to-markdown';
import { toHast } from 'mdast-util-to-hast';
import { inspect } from 'unist-util-inspect';

const md = `
| a | b | c |
|---|---|---|
| > | 1 | 2 |
| ^ | ^ | 3 |
`;

const mdast = fromMarkdown(md, {
  extensions: [gfmTable(), extendedTable],
  mdastExtensions: [gfmTableFromMarkdown(), extendedTableFromMarkdown()],
});
console.log(inspect(mdast));

const markdown = toMarkdown(mdast, {
  extensions: [gfmTableToMarkdown(), extendedTableToMarkdown()],
});
console.log(markdown);

const hast = toHast(mdast, {
  handlers: extendedTableHandlers,
});
console.log(inspect(hast));
```

## API

### `extendedTableFromMarkdown(extendedTableFromMarkdownOptions?)`

This returns a [mdast-util-from-markdown][] extension.

**This MUST be set after `gfmTableFromMarkdown` in [mdast-util-gfm-table][]** to override its handlers.

#### `options`

##### `extendedTableFromMarkdownOptions.colspanWithEmpty` (`boolean?`, default: `false`)

Whether to merge cell with the right empty cell which contains no spaces (`||`).


### `extendedTableFromMarkdown(extendedTableToMarkdownOptoins?)`

This returns a [mdast-util-to-markdown][] extension.

**This MUST be set after `gfmTableToMarkdown` in [mdast-util-gfm-table][]** to override its handlers.

#### `options`

Same as [`gfmTableToMarkdown` options](https://github.com/syntax-tree/mdast-util-gfm-table#options).
This will be used for overriding handlers.


### `extendedTableHandlers`

[mdast-util-to-hast] handlers


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
[mdast-util-gfm-table]: https://github.com/syntax-tree/mdast-util-gfm-table

[micromark-extension-extended-table]: ../micromark-extension-extended-table
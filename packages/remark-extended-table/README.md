# remark-extended-table

[remark][] plugin to support table syntax allowing colspan / rowspan

[remark]: https://github.com/remarkjs/remark

## Feature

* support [extended table syntax][] of [markdown-preview-enhanced][] which allows colspan / rowspan cells
* built on top of [remark-gfm][] and [micromark-extension-gfm-table][]

[extended table syntax]: https://shd101wyy.github.io/markdown-preview-enhanced/#/markdown-basics?id=table
[markdown-preview-enhanced]: https://github.com/shd101wyy/markdown-preview-enhanced
[remark-gfm]: https://github.com/remarkjs/remark-gfm
[micromark-extension-gfm-table]: https://github.com/micromark/micromark-extension-gfm-table


## Warning

This package overrides `remarkGfm` behaviors.
If you encounter any problems, disable this first and see what will happen.


## Extended Table Syntax

With extended table syntax, you can write table cell with colspan / rowspan using the following special cells.

* cell containing only `>` (to be merged with the right cell)
* cell containing only `^` (to be merged with the upper cell)

```markdown
| header1          | header2          |
| ---------------- | ---------------- |
| cell (rowspan=2) | cell             |
| ^                | cell             |
| >                | cell (colspan=2) |
| escape >         | \>               |
| escape ^         | \^               |
```

If set `colspanWithEmptyCell` option, you can use empty cell containing no spaces which merges with the left cell.
For the purpose of avoiding unintentional merges, the followings are not merged.

* Cell containing whitespaces
* Cell without ending divider (`|`)

```markdown
| header1     | header2 |
| ----------- | ------- |
| cell (rowspan=2)     ||
| normal cell |         |
| normal cell |
```


## Install

```
$ npm install remark-extended-table
```

## Use

```typescript
import { remarkExtendedTable, extendedTableHandlers } from 'remark-extended-table';

import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import rehypeStringify from 'rehype-stringify';
import remarkGfm from 'remark-gfm';

const md = `
| a | b |
|---|---|
| 1 | 2 |
| ^ | 3 |
`;

const process = (md: string) =>
  unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkExtendedTable)
    .use(remarkRehype, {
      handlers: {
        // any other handlers
        ...extendedTableHandlers,
      }
    })
    .use(rehypeStringify)
    .process(md);
```

## API

### `unified().use(remarkExtendedTable[, options])`

Configures remark to parse extended table syntax.

**This MUST be applied after `remarkGfm`**.


#### `options`

##### `tablePipeAlign` (`boolean?`, default: `true`)

Passed to [mdast-util-gfm-table][] (used in `remarkGfm`) as `tablePipeAlign` option.

**MUST be set to the same value as `remarkGfm`**.

```typescript
const result = await unified()
  .use(remarkParse)
  .use(remarkGfm, { tablePipeAlign: false })
  .use(remarkExtendedTable, { tablePipeAlign: false })
  .use(remarkStringify)
  .process(md);
``` 


##### `tableCellPadding` (`boolean?`, default: `true`)

Passed to [mdast-util-gfm-table][] (used in `remarkGfm`) as `tableCellPadding` option.

**MUST be set to the same value as `remarkGfm`**.

##### `stringLength` (`((value: string) => number)?`, default: `s => s.length`)

Passed to [mdast-util-gfm-table][] (used in `remarkGfm`) as `stringLength` option.

**MUST be set to the same value as `remarkGfm`**.

##### `colspanWithEmpty` (`boolean?`, default: `false`)

Whether to merge cell with the right empty cell which contains no spaces (`||`).


### `extendedTableHandlers`

[mdast-util-to-hast] handlers, which you can set to `options.handlers` of `remarkRehype`.



[micromark]: https://github.com/micromark/micromark
[mdast]: https://github.com/syntax-tree/mdast
[mdast-util-from-markdown]: https://github.com/syntax-tree/mdast-util-from-markdown
[mdast-util-to-markdown]: https://github.com/syntax-tree/mdast-util-to-markdown
[mdast-util-to-hast]: https://github.com/syntax-tree/mdast-util-to-hast
[mdast-util-gfm-table]: https://github.com/syntax-tree/mdast-util-gfm-table#options
# remark-extended-table

[![Lerna CI](https://github.com/wataru-chocola/remark-extended-table/actions/workflows/lerna-ci.js.yml/badge.svg)](https://github.com/wataru-chocola/remark-extended-table/actions/workflows/lerna-ci.js.yml)

[remark][] plugin to support table syntax allowing colspan / rowspan

[remark]: https://github.com/remarkjs/remark

## Feature

* support [extended table syntax][] of [markdown-preview-enhanced][] which allows colspan / rowspan cells
* built on top of [remark-gfm][] and [micromark-extension-gfm-table][]

[extended table syntax]: https://shd101wyy.github.io/markdown-preview-enhanced/#/markdown-basics?id=table
[markdown-preview-enhanced]: https://github.com/shd101wyy/markdown-preview-enhanced
[remark-gfm]: https://github.com/remarkjs/remark-gfm
[micromark-extension-gfm-table]: https://github.com/micromark/micromark-extension-gfm-table

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
    .use(remarkRehype, null, { handlers: Object.assign({}, extendedTableHandlers) })
    .use(rehypeStringify)
    .process(md);
```

## Packages

`remark-extended-table` consists of the following packages.

* [remark-extended-table](packages/remark-extended-table): [remark][] plugin
* [micromark-extension-extended-table](packages/micromark-extension-extended-table): [micromark][] parser extension (only works with `remark-exended-table`)
* [mdast-util-extended-table](packages/mdast-util-extended-table): [mdast][] utilities

[micromark]: https://github.com/micromark/micromark
[mdast]: https://github.com/syntax-tree/mdast
[mdast-util-from-markdown]: https://github.com/syntax-tree/mdast-util-from-markdown
[mdast-util-to-markdown]: https://github.com/syntax-tree/mdast-util-to-markdown
[mdast-util-to-hast]: https://github.com/syntax-tree/mdast-util-to-hast
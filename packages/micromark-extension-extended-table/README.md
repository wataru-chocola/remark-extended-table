# micromark-extension-extended-table

[micromark][] extension to parse table syntax allowing colspan / rowspan

## Important

If you want to generate HTML table with colspan / rowspan from markdown source, **please use [mdast-util-extended-table][] or [remark-extended-table][]** which internally uses this extension.

This parses [extended table syntax][] and generates some events.
Those events are processed by [mdast-util-extended-table][] into mdast and hast.
Only this package doesn't generate HTML table with colspan / rowspan.


## Install

```
$ npm install micromark-extension-extended-table
```

## Use

Set this in micromark `extensions` option with [micromark-extension-gfm-table][].

```typescript
import { micromark } from 'micromark';
import { gfmTable, gfmTableHtml } from 'micromark-extension-gfm-table';
import { extendedTable, extendedTableHtml } from 'micromark-extension-extended-table';

const md = `
| a | b |
|---|---|
| ^ | 1 |
`;

const result = micromark(md, {
  extensions: [gfmTable(), extendedTable],
  htmlExtensions: [gfmTableHtml(), extendedTableHtml],
});
```

## Test in development

For development purpose, you can run tests with debug messages.

```console
$ DEBUG="micromark-extension-extended-table:syntax" pnpm run test
```

[micromark]: https://github.com/micromark/micromark
[extended table syntax]: https://shd101wyy.github.io/markdown-preview-enhanced/#/markdown-basics?id=table
[micromark-extension-gfm-table]: https://github.com/micromark/micromark-extension-gfm-table

[mdast-util-extended-table]: ../mdast-util-extended-table
[remark-extended-table]: ../remark-extended-table
# micromark-extension-extended-table

[micromark][] extension to parse table syntax allowing colspan / rowspan

## Important

If you want to try this, **please use [mdast-util-extended-table][] or [remark-extended-table][]** which internally use this extension.

This parses [extended table syntax][] and generates some events.
Those events are processed by [mdast-util-extended-table][] into mdast and hast.

The compiler doesn't generate HTML table with colspan / rowspan.


## Install

```
$ npm install micromark-extension-extended-table
```

## Test in development

For development purpose, you can run tests with debug messages.

```console
$ DEBUG="micromark-extension-extended-table:syntax" npm run test-dev
```

[micromark]: https://github.com/micromark/micromark
[extended table syntax]: https://shd101wyy.github.io/markdown-preview-enhanced/#/markdown-basics?id=table

[mdast-util-extended-table]: ../mdast-util-extended-table
[remark-extended-table]: ../remark-extended-table
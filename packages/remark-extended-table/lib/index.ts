import type { Processor } from 'unified';
import { extendedTable } from 'micromark-extension-extended-table';
import {
  extendedTableFromMarkdown,
  extendedTableFromMarkdownOptions,
  extendedTableToMarkdown,
  extendedTableToMarkdownOptions,
} from 'mdast-util-extended-table';
export { extendedTableHandler, extendedTableHandlers } from 'mdast-util-extended-table';
import remarkGfm, { Options as gfmOptions } from 'remark-gfm';

export type Options = extendedTableToMarkdownOptions & extendedTableFromMarkdownOptions;

export function remarkExtendedTable(this: Processor, options?: Options): void {
  let gfmOptions: gfmOptions = {};
  for (let attacher of this.attachers) {
    // also check function name because functions may not be identical due to NPM doppelgangers
    if (attacher[0] === remarkGfm || attacher[0].name === 'remarkGfm') {
      gfmOptions = attacher[1] != null ? (attacher[1] as gfmOptions) : {};
      break;
    }
  }
  const data = this.data();
  if (options == null) {
    options = {};
  }
  options = Object.assign(options, gfmOptions);

  add('micromarkExtensions', extendedTable);
  add('fromMarkdownExtensions', extendedTableFromMarkdown(options));
  add('toMarkdownExtensions', extendedTableToMarkdown(options));

  function add(field: string, value: any) {
    if (data[field] == null) {
      data[field] = [];
    }
    const list = data[field];
    if (!(list instanceof Array)) {
      throw new Error(`expect data[${field}] is array`);
    }
    list.push(value);
  }
}

export default remarkExtendedTable;

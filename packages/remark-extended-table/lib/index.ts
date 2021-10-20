import type { Processor } from 'unified';
import { extendedTable } from 'micromark-extension-extended-table';
import {
  extendedTableFromMarkdown,
  extendedTableFromMarkdownOptions,
  extendedTableToMarkdown,
  extendedTableToMarkdownOptions,
} from 'mdast-util-extended-table';
export { extendedTableHandler, extendedTableHandlers } from 'mdast-util-extended-table';

export type Options = extendedTableToMarkdownOptions & extendedTableFromMarkdownOptions;

export function remarkExtendedTable(this: Processor, options?: Options): void {
  const data = this.data();

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

import type { Processor } from 'unified';
import { extendedTableFromMarkdown } from 'mdast-util-extended-table';
export { extendedTableHandler } from './mdast-to-hast';

export function remarkExtendedTable(this: Processor): void {
  const data = this.data();

  add('fromMarkdownExtensions', extendedTableFromMarkdown);

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

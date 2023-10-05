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

  const micromarkExtensions = data.micromarkExtensions ?? (data.micromarkExtensions = []);
  const fromMarkdownExtensions = data.fromMarkdownExtensions ?? (data.fromMarkdownExtensions = []);
  const toMarkdownExtensions = data.toMarkdownExtensions ?? (data.toMarkdownExtensions = []);

  micromarkExtensions.push(extendedTable);
  fromMarkdownExtensions.push(extendedTableFromMarkdown(options));
  toMarkdownExtensions.push(extendedTableToMarkdown(options));
}

export default remarkExtendedTable;

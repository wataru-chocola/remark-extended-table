import { all, Handler } from 'mdast-util-to-hast';
import { u } from 'unist-builder';
import { pointStart, pointEnd } from 'unist-util-position';
import type { ElementContent as Content } from 'hast';

import type { Table } from './types.js';

export const extendedTableHandler: Handler = (h, node: Table) => {
  const rows = node.children;
  const align = node.align || [];
  const result = [];

  for (let i = 0; i < rows.length; i++) {
    const cells = rows[i].children;
    const tag = i === 0 ? 'th' : 'td';
    const out = [];

    for (let j = 0; j < cells.length; j++) {
      const cell = cells[j];
      out.push(
        h(
          cell,
          tag,
          { align: align[j], rowspan: cell.rowspan, colspan: cell.colspan },
          cell ? all(h, cell) : [],
        ),
      );
    }

    result.push(h(rows[i], 'tr', wrap(out)));
  }

  let newRows = [h(result[0].position, 'thead', wrap([result[0]]))];
  if (result[1]) {
    newRows = newRows.concat(
      h(
        { start: pointStart(result[1]), end: pointEnd(result[result.length - 1]) },
        'tbody',
        wrap(result.slice(1)),
      ),
    );
  }

  return h(node, 'table', wrap(newRows));
};

function wrap(nodes: Array<Content>): Array<Content> {
  const result = [];

  result.push(u('text', '\n'));
  for (let i = 0; i < nodes.length; i++) {
    if (i) result.push(u('text', '\n'));
    result.push(nodes[i]);
  }
  if (nodes.length > 0) {
    result.push(u('text', '\n'));
  }

  return result;
}

export const extendedTableHandlers = {
  table: extendedTableHandler,
};

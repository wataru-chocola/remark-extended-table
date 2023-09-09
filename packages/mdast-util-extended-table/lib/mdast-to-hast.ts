import type { Handler, State } from 'mdast-util-to-hast';
import { u } from 'unist-builder';
import { pointStart, pointEnd } from 'unist-util-position';
import type { Element, ElementContent as Content } from 'hast';

import type { Table, TableRow } from './types.js';
import { AlignType } from 'mdast';

const mdastTableRowsToHast = (state: State, rows: TableRow[], align: AlignType[]) => {
  const hRows = [];

  for (let i = 0; i < rows.length; i++) {
    const cells = rows[i].children;
    const tag = i === 0 ? 'th' : 'td';
    const out = [] as Element[];

    for (let j = 0; j < cells.length; j++) {
      const cell = cells[j];
      const hCell = {
        type: 'element',
        tagName: tag,
        properties: { align: align[j], rowspan: cell.rowspan, colspan: cell.colspan },
        children: cell ? state.all(cell) : [],
      } as Element;
      state.patch(cell, hCell);
      out.push(hCell);
    }

    const hRow = {
      type: 'element',
      tagName: 'tr',
      properties: {},
      children: wrap(out),
    } as Element;
    state.patch(rows[i], hRow);
    hRows.push(hRow);
  }
  return hRows;
};

export const extendedTableHandler: Handler = (state, node: Table) => {
  const hRows = mdastTableRowsToHast(state, node.children, node.align ?? []);

  const hTContents = [] as Element[];
  if (hRows.length >= 1) {
    const hTHead = {
      type: 'element',
      tagName: 'thead',
      properties: {},
      children: wrap([hRows[0]]),
      position: hRows[0].position,
    } as Element;
    hTContents.push(hTHead);
  }

  if (hRows.length >= 2) {
    const hTBody = {
      type: 'element',
      tagName: 'tbody',
      properties: {},
      children: wrap(hRows.slice(1)),
      position: {
        start: pointStart(hRows[1]),
        end: pointEnd(hRows[hRows.length - 1]),
      },
    } as Element;
    hTContents.push(hTBody);
  }

  const hTable = {
    type: 'element',
    tagName: 'table',
    properties: {},
    children: wrap(hTContents),
  } as Element;
  state.patch(node, hTable);

  return hTable;
};

function wrap(nodes: Content[]): Content[] {
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

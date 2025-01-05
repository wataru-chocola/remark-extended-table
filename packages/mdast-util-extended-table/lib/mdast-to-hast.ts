import type { Handler, State } from 'mdast-util-to-hast';
import { u } from 'unist-builder';
import { pointStart, pointEnd } from 'unist-util-position';
import type { Element, ElementContent as Content } from 'hast';

import type { Table, TableRow, TableCell } from './types.js';
import type { AlignType } from 'mdast';

const mdastTableRowsToHast = (state: State, rows: TableRow[], align: AlignType[]) => {
  const hRows = [];
  const tmpTable: (TableCell | null)[][] = rows.map((row) => [...row.children]);

  for (let i = 0; i < rows.length; i++) {
    const cells = tmpTable[i];
    const tag = i === 0 ? 'th' : 'td';
    const out = [] as Element[];
    let colOffset = 0;

    for (let j = 0; j < cells.length; j++) {
      const cell = cells[j];
      if (cell === null) continue;

      const hCell = {
        type: 'element',
        tagName: tag,
        properties: { align: align[j + colOffset], rowspan: cell.rowspan, colspan: cell.colspan },
        children: cell ? state.all(cell) : [],
      } as Element;

      // adjust offset
      if (cell.colspan != null && cell.colspan > 1) {
        colOffset += cell.colspan - 1;
      }
      // insert empty cells to fill the gap
      if (cell.rowspan != null && cell.rowspan > 1) {
        const size = cell.colspan ?? 1;
        tmpTable[i + 1].splice(j, 0, ...(Array(size).fill(null) as null[]));
      }

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

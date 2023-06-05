export const tokenTypes = {
  extendedTableCellRowspanMarker: 'extendedTableCellRowspanMarker' as const,
  extendedTableCellColspanMarker: 'extendedTableCellColspanMarker' as const,
};

declare module 'micromark-util-types' {
  interface TokenTypeMap {
    extendedTableCellRowspanMarker: 'extendedTableCellRowspanMarker';
    extendedTableCellColspanMarker: 'extendedTableCellColspanMarker';
  }
}

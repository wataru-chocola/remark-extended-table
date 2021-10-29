import { tokenTypes } from './types.js';
import { CompileContext } from 'micromark-util-types';

export const extendedTableHtml = {
  enter: {
    [tokenTypes.extendedTableCellColspanMarker](this: CompileContext): void {
      this.raw('>');
    },
    [tokenTypes.extendedTableCellRowspanMarker](this: CompileContext): void {
      this.raw(this.encode('^'));
    },
  },
};

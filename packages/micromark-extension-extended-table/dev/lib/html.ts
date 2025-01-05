import { tokenTypes } from './types.js';
import type { CompileContext } from 'micromark-util-types';

export const extendedTableHtml = {
  enter: {
    [tokenTypes.extendedTableCellColspanMarker](this: CompileContext): undefined {
      this.raw('>');
    },
    [tokenTypes.extendedTableCellRowspanMarker](this: CompileContext): undefined {
      this.raw(this.encode('^'));
    },
  },
};

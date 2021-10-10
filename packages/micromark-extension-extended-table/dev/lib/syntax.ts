import {
  Construct,
  Extension,
  State,
  Code,
  Event,
  Effects,
  Point,
  TokenizeContext,
  Token,
} from 'micromark-util-types';
import { codes } from 'micromark-util-symbol/codes';
import { factorySpace } from 'micromark-factory-space';
import { constants } from 'micromark-util-symbol/constants.js';
import { markdownSpace } from 'micromark-util-character';
import { blankLine } from 'micromark-core-commonmark';
import { tokenTypes } from './types.js';
import assert from 'assert';
import Debug from 'debug';

const debug = Debug('micromark-extension-extended-table:syntax');

const extendedTableCellConstruct: Construct = {
  name: 'extendedTableCell',
  tokenize: tokenizeExtendedTableCell,
};

export const extendedTable: Extension = {
  text: {
    [codes.caret]: extendedTableCellConstruct,
    [codes.lessThan]: extendedTableCellConstruct,
  },
};

function tokenizeExtendedTableCell(
  this: TokenizeContext,
  effects: Effects,
  ok: State,
  nok: State,
): State {
  debug('initialize tokenizer');
  const self = this; // eslint-disable-line @typescript-eslint/no-this-alias
  return start;

  function start(code: Code): State | void {
    debug('start: start' + String(code));
    if (code !== codes.caret && code !== codes.lessThan) {
      return nok(code);
    }
    effects.consume(code);
    return end;
  }

  function end(code: Code): State | void {
    return ok;
  }
}

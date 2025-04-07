import type {
  Construct,
  Extension,
  State,
  Code,
  Event,
  Effects,
  TokenizeContext,
} from 'micromark-util-types';
import { splice } from 'micromark-util-chunked';
import { codes, types } from 'micromark-util-symbol';
import { tokenTypes } from './types.js';
import { ok as assert } from 'devlop';
import Debug from 'debug';

const debug = Debug('micromark-extension-extended-table:syntax');

const extendedTableCellConstruct: Construct = {
  name: 'extendedTableCell',
  tokenize: tokenizeExtendedTableCell,
  resolveAll: resolveAll,
};

export const extendedTable: Extension = {
  text: {
    [codes.caret]: extendedTableCellConstruct,
    [codes.greaterThan]: extendedTableCellConstruct,
  },
};

function formatEvents(events: Event[] | undefined): [string, string, string][] | undefined {
  if (events == null) {
    return;
  }
  return events.map((x) => {
    let content = '';
    try {
      content = x[2].sliceSerialize(x[1], true);
    } catch (e) {
      content = '<maybe incomplete token>';
    }
    return [x[0], x[1].type, content];
  });
}

function resolveAll(events: Event[], context: TokenizeContext): Event[] {
  debug('+ resolveAll');
  debug('+ original events');
  debug(formatEvents(events));

  // remove span marker if cell contains any other elements
  if (events.length >= 3) {
    const tokenType = events[0][1].type;
    assert(
      events[0][0] === 'enter' &&
        (tokenType === tokenTypes.extendedTableCellColspanMarker ||
          tokenType === tokenTypes.extendedTableCellRowspanMarker),
      'events must start with ^ or >',
    );
    assert(
      events[1][0] === 'exit' && events[1][1].type === tokenType,
      'events must start with ^ or >',
    );

    if (events[2][1].type === types.data) {
      events[2][1].start = Object.assign({}, events[0][1].start);
      splice(events, 0, 2, []);
    } else {
      events[0][1].type = types.data;
      events[1][1].type = types.data;
    }
  }

  debug('+ resolved events');
  debug(formatEvents(events));
  return events;
}

function tokenizeExtendedTableCell(
  this: TokenizeContext,
  effects: Effects,
  ok: State,
  nok: State,
): State {
  debug('initialize tokenizer');
  const self = this; // eslint-disable-line @typescript-eslint/no-this-alias

  // expect the start in a cell
  if (self.events.length !== 0) {
    return nok;
  }

  return start;

  function start(code: Code): State | undefined {
    debug('start: start' + String(code));
    switch (code) {
      case codes.caret:
        effects.enter(tokenTypes.extendedTableCellRowspanMarker);
        effects.consume(code);
        effects.exit(tokenTypes.extendedTableCellRowspanMarker);
        break;
      case codes.greaterThan:
        effects.enter(tokenTypes.extendedTableCellColspanMarker);
        effects.consume(code);
        effects.exit(tokenTypes.extendedTableCellColspanMarker);
        break;
      default:
        return nok(code);
    }
    return ok;
  }
}

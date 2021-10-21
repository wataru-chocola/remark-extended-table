import { remarkExtendedTable } from './index';

import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkStringify from 'remark-stringify';
import remarkGfm from 'remark-gfm';

test('toMarkdown', () => {
  const md = `
| a | bcd |
| - | - |
| > | 2 |
`;
  const expected = `| a | bcd |
| - | --- |
| > | 2   |
`;
  const promise = unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkExtendedTable)
    .use(remarkStringify)
    .process(md);
  promise.then((result) => expect(result.value).toBe(expected));
});

test('passing gfmOptions', () => {
  const md = `
| a | bcd |
| - | - |
| > | 2 |
`;
  const expected = `| a | bcd |
| - | - |
| > | 2 |
`;
  const promise = unified()
    .use(remarkParse)
    .use(remarkGfm, { tablePipeAlign: false })
    .use(remarkExtendedTable)
    .use(remarkStringify)
    .process(md);
  promise.then((result) => expect(result.value).toBe(expected));
});

import { test, expect } from 'vitest';
import { remarkExtendedTable } from './index.js';

import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkStringify from 'remark-stringify';
import remarkGfm from 'remark-gfm';

test('toMarkdown', async () => {
  const md = `
| a | bcd |
| - | - |
| > | 2 |
`;
  const expected = `| a | bcd |
| - | --- |
| > | 2   |
`;
  const result = await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkExtendedTable)
    .use(remarkStringify)
    .process(md);
  expect(result.value).toBe(expected);
});

test('passing gfmOptions', async () => {
  const md = `
| a | bcd |
| - | - |
| > | 2 |
`;
  const expected = `| a | bcd |
| - | - |
| > | 2 |
`;
  const result = await unified()
    .use(remarkParse)
    .use(remarkGfm, { tablePipeAlign: false })
    .use(remarkExtendedTable, { tablePipeAlign: false })
    .use(remarkStringify)
    .process(md);
  expect(result.value).toBe(expected);
});

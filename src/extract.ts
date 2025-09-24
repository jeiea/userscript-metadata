import type { Metadata } from "./types.ts";

/**
 * Get records from userscript metadata block.
 *
 * @param code The source code containing the metadata block.
 * @returns Parsed metadata records, or `undefined` if no header is found
 * @example
 * ```ts
 * import { assertEquals } from "@std/assert/equals";
 *
 * const code = `// ==UserScript==\n// @name My Script\n// ==/UserScript==`;
 * const meta = extract(code);
 * assertEquals(meta, { "@name": ["My Script"] });
 * ```
 */
export function extract(code: string): Metadata | undefined {
  const header = code.match(
    /(?:^\/\/ ==UserScript==\r?\n)(?:\/\/.*\r?\n)+\/\/ ==\/UserScript==$/m,
  )?.[0];
  if (!header) {
    return;
  }

  const matches = header.matchAll(/^\s*\/\/\s*(@\S+)\s+(.+)/gm);
  const record: Record<string, string[]> = {};
  for (const [, key, value] of matches) {
    if (record![key!]) {
      record[key!]!.push(value!);
    } else {
      record[key!] = [value!];
    }
  }

  return record;
}

import type { Metadata } from "./types.ts";

/**
 * Render a userscript metadata block from {@link Metadata}.
 *
 * @param metadata Header records (e.g., `{ "@name": ["My Script"] }`).
 * @returns Formatted metadata block including sort and align processing.
 * @example
 * ```ts
 * import { assertEquals } from "@std/assert/equals";
 *
 * const metadata = { "@name": ["My Script"] };
 * const result = render(metadata);
 * assertEquals(result, `// ==UserScript==\n// @name My Script\n// ==/UserScript==`);
 * ```
 */
export function render(metadata: Metadata): string {
  return ["// ==UserScript==", ...headerToRows(metadata), "// ==/UserScript=="].join("\n");
}

function* headerToRows(header: Metadata) {
  const keys = Object.keys(header);
  const maxKeyLength = Math.max(...keys.map((x) => x.length));

  const entries = Object.entries(header).flatMap(([key, values]) =>
    values.map((value) => [key, value] as const)
  );
  entries.sort(compareEntry);

  const maxResourceKeyLength = Math.max(
    ...entries.flatMap(([key, value]) =>
      key === "@resource" ? [value.split(/\s+/)[0]!.length] : []
    ),
    0,
  );

  for (const [key, value] of entries) {
    const paddedKey = key.padEnd(maxKeyLength);
    const paddedValue = key === "@resource"
      ? value.replace(/(\S+)\s+/, (_, p1) => p1.padEnd(maxResourceKeyLength + 1))
      : value;
    yield `// ${paddedKey} ${paddedValue}`;
  }
}

function compareEntry(a: readonly [string, string], b: readonly [string, string]) {
  const orderedKeys = [
    "@name",
    "@description",
    "@version",
    "@author",
    "@namespace",
    "",
    "@grant",
    "@require",
    "@resource",
    "@downloadURL",
    "@updateURL",
  ];

  const segmentsA = a[0].split(":");
  const segmentsB = b[0].split(":");
  const [nameA, ...restA] = segmentsA;
  const [nameB, ...restB] = segmentsB;
  const pA = orderedKeys.indexOf(nameA!);
  const pB = orderedKeys.indexOf(nameB!);
  const defaultOrder = 5;
  const orderA = pA === -1 ? defaultOrder : pA;
  const orderB = pB === -1 ? defaultOrder : pB;
  if (orderA !== orderB) {
    return orderA - orderB;
  }

  if (nameA !== nameB) {
    // keep the original minor order
    return 0;
  }

  const tagComparison = compareStringArray(restA, restB);
  if (tagComparison !== 0) {
    return tagComparison;
  }

  return compareStringArray(a.slice(1), b.slice(1));
}

function compareStringArray(restA: string[], restB: string[]) {
  const count = Math.max(restA.length, restB.length);

  for (let i = 0; i < count; i++) {
    const tagA = restA[i];
    const tagB = restB[i];
    if (!tagA) return -1;
    if (!tagB) return 1;
    if (tagA !== tagB) {
      return tagA.localeCompare(tagB);
    }
  }

  return 0;
}

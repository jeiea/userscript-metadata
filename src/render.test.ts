import { assertEquals } from "@std/assert/equals";
import { render } from "./render.ts";

Deno.test("render simple metadata", () => {
  const metadata = { "@key": ["value"] };

  const result = render(metadata);

  assertEquals(
    result,
    `// ==UserScript==
// @key value
// ==/UserScript==`,
  );
});

Deno.test("render multiple keys with align", () => {
  const metadata = { "@key": ["value"], "@key2": ["value2"] };

  const result = render(metadata);

  assertEquals(
    result,
    `// ==UserScript==
// @key  value
// @key2 value2
// ==/UserScript==`,
  );
});

Deno.test("sort well-known keys", () => {
  const metadata = {
    "@resource": ["a b"],
    "@require": ["a"],
    "@grant": ["GM_getValue"],
    "@homepage": ["g"],
    "@supportURL": ["i"],
    "@updateURL": ["j"],
    "@downloadURL": ["k"],
    "@namespace": ["e"],
    "@icon": ["d"],
    "@description:en": ["c"],
    "@author": ["f"],
    "@description": ["c"],
    "@version": ["d"],
    "@name": ["a"],
  };

  const result = render(metadata);

  assertEquals(
    result,
    `// ==UserScript==
// @name           a
// @version        d
// @description    c
// @description:en c
// @icon           d
// @author         f
// @namespace      e
// @homepage       g
// @supportURL     i
// @grant          GM_getValue
// @require        a
// @resource       a b
// @downloadURL    k
// @updateURL      j
// ==/UserScript==`,
  );
});

Deno.test("sort and align resources", () => {
  const metadata = { "@resource": ["@std/path jsr:@std/path", "@std/assert jsr:@std/assert"] };

  const result = render(metadata);

  assertEquals(
    result,
    `// ==UserScript==
// @resource @std/assert jsr:@std/assert
// @resource @std/path   jsr:@std/path
// ==/UserScript==`,
  );
});

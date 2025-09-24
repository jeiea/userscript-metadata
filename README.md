# userscript-metadata

Extract metadata from userscripts.

## Usage

```ts
import { extract, render } from "jsr:@jeiea/userscript-metadata";
import { assertEquals } from "@std/assert/equals";

const code = `// ==UserScript==
// @name     Script
// @name:ko  스크립트
// @version  0.0.1
// @resource link:react     https://cdn.jsdelivr.net/npm/react@19.0.0/cjs/react.production.js
// @resource link:react-dom https://cdn.jsdelivr.net/npm/react-dom@19.0.0/cjs/react-dom.production.js
// ==/UserScript==`;
const metadata = extract(code);

assertEquals(metadata, {
  "@name": ["Script"],
  "@name:ko": ["스크립트"],
  "@version": ["0.0.1"],
  "@resource": [
    "link:react     https://cdn.jsdelivr.net/npm/react@19.0.0/cjs/react.production.js",
    "link:react-dom https://cdn.jsdelivr.net/npm/react-dom@19.0.0/cjs/react-dom.production.js",
  ],
});
assertEquals(render(metadata!), code);
```

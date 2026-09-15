#!/usr/bin/env node

// Regenerate the "Open in LiveCodes" links of the exercises from the code
// blocks they introduce, so that a link can never drift from the code a student
// is looking at.
//
// In the slides, these links are generated in the browser by
// src/subject/livecodes.js. The exercises are plain Markdown read on GitHub,
// so their links have to be written into the file: that is what this does.
//
// Usage:
//   npm run livecodes           Update the links that are out of date
//   npm run livecodes:check     Only report them (exits 1 if any), for CI
//
// To add a link to a new exercise, write the placeholder below under its
// heading and run the script:
//
//   [Open in LiveCodes](TODO)

import { readFile, writeFile } from "node:fs/promises";
import { glob } from "node:fs/promises";
import { relative } from "node:path";

import { livecodesUrl } from "../src/subject/livecodes-url.mjs";

const PATTERN =
  /^(?<heading>#{2,4} (?<title>[^\n]+))\n\n\[Open in LiveCodes\]\((?<url>[^)]*)\)\n\n```js\n(?<code>(?:(?!```)[\s\S])*?)```/gm;

// Turn a Markdown heading into the plain text used as the playground title.
function plainTitle(title) {
  return title
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/[`*_]/g, "")
    .trim();
}

async function updateFile(file, { check }) {
  const original = await readFile(file, "utf-8");
  const changed = [];

  const updated = original.replace(PATTERN, (match, ...args) => {
    const { heading, title, url, code } = args.at(-1);
    const expected = livecodesUrl(code.replace(/\n+$/, ""), plainTitle(title));

    if (url === expected) {
      return match;
    }

    changed.push({ title: plainTitle(title), added: !url.startsWith("https://") });
    return match.replace(`[Open in LiveCodes](${url})`, `[Open in LiveCodes](${expected})`);
  });

  if (changed.length && !check) {
    await writeFile(file, updated, "utf-8");
  }

  return changed;
}

const check = process.argv.includes("--check");
const files = [];
for await (const file of glob("exercises/*.md")) {
  files.push(file);
}

let total = 0;
for (const file of files.sort()) {
  const changed = await updateFile(file, { check });
  total += changed.length;

  for (const { title, added } of changed) {
    const verb = check ? "out of date" : added ? "added" : "updated";
    console.log(`${relative(".", file)}: ${verb} — ${title}`);
  }
}

if (!total) {
  console.log("All LiveCodes links are up to date.");
} else if (check) {
  console.error(
    `\n${total} LiveCodes link(s) are out of date. Run 'npm run livecodes' and commit the result.`
  );
  process.exit(1);
} else {
  console.log(`\nUpdated ${total} LiveCodes link(s).`);
}

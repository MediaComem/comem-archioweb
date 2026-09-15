// Build a LiveCodes playground URL that carries the code in the URL itself.
//
// This is the single source of truth for the playground options: it is used
// both by the slide controller (src/subject/livecodes.js), which adds a button
// to every JavaScript code block, and by the script that regenerates the links
// in the exercises (scripts/update-livecodes-links.mjs).
//
// See https://livecodes.io/docs/configuration/query-params
export function livecodesUrl(source, title) {
  const params = new URLSearchParams({
    // The code to load into the JavaScript editor.
    js: source,
    // Open the console, where the output of the code appears.
    console: "open",
    // Go straight to the code: no welcome screen, and no prompt asking to
    // recover the previous (unsaved) playground, which would otherwise appear
    // as soon as a student has edited an earlier one.
    welcome: "false",
    recoverUnsaved: "false",
  });

  if (title) {
    params.set("title", title);
  }

  return `https://livecodes.io/?${params.toString()}`;
}

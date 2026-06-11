import assert from "node:assert/strict";
import { phrasesByLocale, type SupportedLocale } from "../phrases";
import { createThinkingPhrasesSetting } from "../settings";

const locales: SupportedLocale[] = ["zh-cn", "zh-tw", "en"];

for (const locale of locales) {
  const phrases = phrasesByLocale[locale];

  assert.ok(Array.isArray(phrases), `${locale} phrases must be an array`);
  assert.ok(phrases.length > 0, `${locale} phrases must not be empty`);

  for (const phrase of phrases) {
    assert.equal(typeof phrase, "string", `${locale} phrase must be a string`);
    assert.ok(phrase.trim().length > 0, `${locale} phrase must not be blank`);
  }

  assert.deepEqual(
    createThinkingPhrasesSetting(phrases),
    {
      mode: "replace",
      phrases,
    },
    `${locale} setting must use VS Code's replacement object format`
  );
}

console.log(`Validated ${locales.length} locales with curated phrases.`);
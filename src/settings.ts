export type ThinkingPhrasesSetting = {
  mode: "replace";
  phrases: string[];
};

export function createThinkingPhrasesSetting(phrases: string[]): ThinkingPhrasesSetting {
  return {
    mode: "replace",
    phrases,
  };
}

export function isThinkingPhrasesSetting(value: unknown): value is ThinkingPhrasesSetting {
  return typeof value === "object" &&
    value !== null &&
    "mode" in value &&
    "phrases" in value &&
    value.mode === "replace" &&
    Array.isArray(value.phrases);
}
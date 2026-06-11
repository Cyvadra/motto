import * as vscode from "vscode";
import { phrasesByLocale, type SupportedLocale } from "./phrases";
import { createThinkingPhrasesSetting, isThinkingPhrasesSetting } from "./settings";

const SETTING_KEY = "chat.agent.thinking.phrases";
const BACKUP_KEY = "previousThinkingPhrases";
const EXT_DISPLAY = "ThePilot";

type StoredSetting = {
  hadValue: boolean;
  value?: unknown;
};

const messages = {
  "zh-cn": {
    empty: `${EXT_DISPLAY}：语录列表为空，请先补全文案。`,
    applied: (count: number) =>
      `${EXT_DISPLAY}：已成功应用 ${count} 条语录到 AI 思考提示语。`,
    applyError: (err: unknown) => `${EXT_DISPLAY}：应用语录时出错 - ${String(err)}`,
    reset: `${EXT_DISPLAY}：已恢复之前的 AI 思考提示语。`,
    resetError: (err: unknown) => `${EXT_DISPLAY}：恢复默认设置时出错 - ${String(err)}`,
  },
  "zh-tw": {
    empty: `${EXT_DISPLAY}：語錄清單為空，請先補全文案。`,
    applied: (count: number) =>
      `${EXT_DISPLAY}：已成功套用 ${count} 條語錄到 AI 思考提示語。`,
    applyError: (err: unknown) => `${EXT_DISPLAY}：套用語錄時發生錯誤 - ${String(err)}`,
    reset: `${EXT_DISPLAY}：已恢復先前的 AI 思考提示語。`,
    resetError: (err: unknown) => `${EXT_DISPLAY}：恢復預設設定時發生錯誤 - ${String(err)}`,
  },
  en: {
    empty: `${EXT_DISPLAY}: No phrases are configured yet.`,
    applied: (count: number) =>
      `${EXT_DISPLAY}: Applied ${count} thinking phrases successfully.`,
    applyError: (err: unknown) => `${EXT_DISPLAY}: Failed to apply phrases - ${String(err)}`,
    reset: `${EXT_DISPLAY}: Restored the previous AI thinking phrases.`,
    resetError: (err: unknown) => `${EXT_DISPLAY}: Failed to restore defaults - ${String(err)}`,
  },
} satisfies Record<SupportedLocale, {
  empty: string;
  applied: (count: number) => string;
  applyError: (err: unknown) => string;
  reset: string;
  resetError: (err: unknown) => string;
}>;

export function activate(context: vscode.ExtensionContext): void {
  const applyCmd = vscode.commands.registerCommand(
    "motto.applyPhrases",
    () => applyPhrases(context, true)
  );

  const resetCmd = vscode.commands.registerCommand(
    "motto.resetPhrases",
    () => resetPhrases(context, true)
  );

  context.subscriptions.push(applyCmd, resetCmd);

  const config = vscode.workspace.getConfiguration("motto");
  if (config.get<boolean>("autoApply", false)) {
    applyPhrases(context, false);
  }
}

function resolveLocale(): SupportedLocale {
  const language = vscode.env.language.toLowerCase();

  if (language === "zh-tw" || language === "zh-hk" || language === "zh-mo") {
    return "zh-tw";
  }

  if (language.startsWith("zh")) {
    return "zh-cn";
  }

  return "en";
}

async function applyPhrases(
  context: vscode.ExtensionContext,
  showNotification: boolean
): Promise<void> {
  const locale = resolveLocale();
  const ui = messages[locale];
  const phrases = phrasesByLocale[locale];

  if (phrases.length === 0) {
    vscode.window.showWarningMessage(ui.empty);
    return;
  }

  try {
    const config = vscode.workspace.getConfiguration();
    const currentValue = config.inspect<unknown>(SETTING_KEY)?.globalValue;

    if (
      context.globalState.get<StoredSetting>(BACKUP_KEY) === undefined &&
      !isKnownPhraseSet(currentValue)
    ) {
      await context.globalState.update(BACKUP_KEY, {
        hadValue: currentValue !== undefined,
        value: currentValue,
      } satisfies StoredSetting);
    }

    await config.update(
      SETTING_KEY,
      createThinkingPhrasesSetting(phrases),
      vscode.ConfigurationTarget.Global
    );

    if (showNotification) {
      vscode.window.showInformationMessage(ui.applied(phrases.length));
    }
  } catch (err) {
    vscode.window.showErrorMessage(ui.applyError(err));
  }
}

async function resetPhrases(
  context: vscode.ExtensionContext,
  showNotification: boolean
): Promise<void> {
  const ui = messages[resolveLocale()];

  try {
    const config = vscode.workspace.getConfiguration();
    const previous = context.globalState.get<StoredSetting>(BACKUP_KEY);

    await config.update(
      SETTING_KEY,
      previous?.hadValue ? previous.value : undefined,
      vscode.ConfigurationTarget.Global
    );
    await context.globalState.update(BACKUP_KEY, undefined);

    if (showNotification) {
      vscode.window.showInformationMessage(ui.reset);
    }
  } catch (err) {
    vscode.window.showErrorMessage(ui.resetError(err));
  }
}

function isKnownPhraseSet(value: unknown): boolean {
  return Object.values(phrasesByLocale).some((phrases) =>
    arraysEqual(value, phrases) ||
    (isThinkingPhrasesSetting(value) && arraysEqual(value.phrases, phrases))
  );
}

function arraysEqual(value: unknown, expected: string[]): boolean {
  return Array.isArray(value) &&
    value.length === expected.length &&
    value.every((phrase, index) => phrase === expected[index]);
}

export function deactivate(): void {}

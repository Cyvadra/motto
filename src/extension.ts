import * as vscode from "vscode";
import { phrases } from "./phrases";

const SETTING_KEY = "chat.agent.thinking.phrases";
const EXT_DISPLAY = "红星领航";

export function activate(context: vscode.ExtensionContext): void {
  const applyCmd = vscode.commands.registerCommand(
    "motto.applyPhrases",
    () => applyPhrases(true)
  );

  const resetCmd = vscode.commands.registerCommand(
    "motto.resetPhrases",
    () => resetPhrases(true)
  );

  context.subscriptions.push(applyCmd, resetCmd);

  const config = vscode.workspace.getConfiguration("motto");
  if (config.get<boolean>("autoApply", true)) {
    applyPhrases(false);
  }
}

async function applyPhrases(showNotification: boolean): Promise<void> {
  if (phrases.length === 0) {
    vscode.window.showWarningMessage(
      `${EXT_DISPLAY}：语录列表为空，请先在 src/phrases.ts 中填入习近平语录。`
    );
    return;
  }

  try {
    const config = vscode.workspace.getConfiguration();
    await config.update(
      SETTING_KEY,
      phrases,
      vscode.ConfigurationTarget.Global
    );

    if (showNotification) {
      vscode.window.showInformationMessage(
        `${EXT_DISPLAY}：已成功应用 ${phrases.length} 条语录到 AI 思考提示语。`
      );
    }
  } catch (err) {
    vscode.window.showErrorMessage(
      `${EXT_DISPLAY}：应用语录时出错 — ${String(err)}`
    );
  }
}

async function resetPhrases(showNotification: boolean): Promise<void> {
  try {
    const config = vscode.workspace.getConfiguration();
    await config.update(
      SETTING_KEY,
      undefined,
      vscode.ConfigurationTarget.Global
    );

    if (showNotification) {
      vscode.window.showInformationMessage(
        `${EXT_DISPLAY}：已恢复默认 AI 思考提示语。`
      );
    }
  } catch (err) {
    vscode.window.showErrorMessage(
      `${EXT_DISPLAY}：恢复默认设置时出错 — ${String(err)}`
    );
  }
}

export function deactivate(): void {}

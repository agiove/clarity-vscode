import * as vscode from "vscode";
import { ClrHoverProvider } from "./clrHoverProvider";

export async function activate(
  context: vscode.ExtensionContext
): Promise<void> {
  context.subscriptions.push(
    vscode.languages.registerHoverProvider("html", new ClrHoverProvider())
  );
}

export function deactivate(): void {
  return;
}

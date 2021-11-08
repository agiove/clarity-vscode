import {
  ExtensionContext,
  languages,
} from "vscode";

import { ClrHoverProvider } from "./clrHoverProvider";

export async function activate(context: ExtensionContext): Promise<void> {
  context.subscriptions.push(
    languages.registerHoverProvider("html", new ClrHoverProvider())
  );
}

export function deactivate(): void {
  return;
}

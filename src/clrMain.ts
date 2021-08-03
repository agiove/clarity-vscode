"use strict";

import { ExtensionContext, DocumentFilter, languages } from "vscode";
import { ClrHoverProvider } from "./clrHoverProvider";

export function activate(context: ExtensionContext) {
  console.log("vscode-clarity is active!");

  const HTML_MODE: DocumentFilter = { language: "html", scheme: "file" };

  context.subscriptions.push(
    languages.registerHoverProvider("html", new ClrHoverProvider())
  );
}

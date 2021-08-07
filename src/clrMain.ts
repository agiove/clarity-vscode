import { ExtensionContext, languages } from "vscode";
import { ClrDocs } from "./clrDocs";
import { ClrHoverProvider } from "./clrHoverProvider";

export async function activate(context: ExtensionContext) {
  const clrDocumentation = await new ClrDocs().loadDocumentation();

  context.subscriptions.push(
    languages.registerHoverProvider(
      "html",
      new ClrHoverProvider(clrDocumentation)
    )
  );
}

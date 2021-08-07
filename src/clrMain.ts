import { ExtensionContext, languages } from "vscode";
import { ClrDocs } from "./clrDocs";
import { ClrHoverProvider } from "./clrHoverProvider";

export async function activate(context: ExtensionContext) {
  // TODO: VSCode says this is slow.
  //  WARN UNRESPONSIVE extension host, 'vscode.html-language-features' took 98% of 2045.973ms, saved PROFILE here: 'file:///c%3A/Users/jeron/AppData/Local/Temp/exthost-9e6c7e.cpuprofile'
  const clrDocumentation = await new ClrDocs().loadDocumentation();

  context.subscriptions.push(
    languages.registerHoverProvider(
      "html",
      new ClrHoverProvider(clrDocumentation)
    )
  );
}

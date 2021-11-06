import assert = require("assert");
import * as vscode from "vscode";

// export async function openUntitledDocument(
//   content: string,
//   language?: string
// ): Promise<vscode.TextDocument> {
//   return await vscode.workspace.openTextDocument({
//     language,
//     content,
//   });
// }

// export async function openFile(content: string): Promise<vscode.TextDocument> {
//   const document = openUntitledDocument(content, "html");
//   vscode.window.showTextDocument(await document);
//   return document;
// }

export async function activateExtension(): Promise<void> {
  const extension = vscode.extensions.getExtension("agiove.clarity-vscode");
  assert.ok(extension);
  await extension.activate();
}

export async function hover(uri: vscode.Uri): Promise<vscode.Hover[]> {
  return <vscode.Hover[]>(
    await vscode.commands.executeCommand(
      "vscode.executeHoverProvider",
      uri,
      new vscode.Position(0, 10)
    )
  );
}

export function getHoverValue(hover: Array<vscode.Hover>): string {
  return (<{ value: string }>hover[0].contents[0]).value;
}

export async function delay(ms: number): Promise<unknown> {
  return new Promise((res) => setTimeout(res, ms));
}

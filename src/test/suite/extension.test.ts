import * as assert from "assert";
import { beforeEach } from "mocha";
import * as path from "path";
import * as vscode from "vscode";
import { activateExtension, getHoverValue, hover } from "./test-helpers";

const workspace = path.join(
  __dirname,
  "..",
  "..",
  "..",
  "src",
  "test",
  "suite"
);

suite("Extension Test Suite", () => {
  let document: vscode.TextDocument;

  beforeEach(async () => {
    await activateExtension();

    const filePath = path.join(workspace, "fixtures", "test.html");
    document = await vscode.workspace.openTextDocument(filePath);
    await vscode.window.showTextDocument(document);
  });

  test("hover value from clr-datagrid", async () => {
    const hoverProvider = await hover(document.uri);

    const answer = `
\`\`\`html
<clr-datagrid>
\`\`\`
A datagrid is a presentation of data in a table which enables the user to perform actions upon the entries which are organized in rows, with columns for each attribute.

Input: _clrDgLoading, clrDgSelected, clrDgSingleSelected, clrDgRowSelection_

Output: _clrDgRefresh, clrDgSelectedChange, clrDgSingleSelectedChange_

https://clarity.design/angular-components/clr-datagrid`;

    const value = getHoverValue(hoverProvider);

    assert.strictEqual(value, answer);
  });
});

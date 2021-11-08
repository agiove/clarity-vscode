import assert = require("assert");

import { ClrDocs } from "../../clrDocs";

suite("ClrDocs", () => {
  test("get documentation", async () => {
    const docs = new ClrDocs().loadDocumentation();
    const result = docs.getDocumentation("clr-datagrid");
    assert.strictEqual(result.tag, "<clr-datagrid>");
    assert.strictEqual(
      result.info,
      "A datagrid is a presentation of data in a table which enables the user to perform actions upon the entries which are organized in rows, with columns for each attribute."
    );
    assert.strictEqual(
      result.link,
      "https://clarity.design/angular-components/datagrid"
    );
  });
});

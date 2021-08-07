import { ClrDocsUtil } from "./clrDocs";
import { DefinitionInfo } from "./shared/DefinitionInfo";
import {
  CancellationToken,
  Hover,
  HoverProvider,
  MarkdownString,
  Position,
  ProviderResult,
  TextDocument,
} from "vscode";

export class ClrHoverProvider implements HoverProvider {
  getDefinition(
    document: TextDocument,
    position: Position
  ): Promise<MarkdownString[]> {
    const wordRange = document.getWordRangeAtPosition(position);
    const word = wordRange ? document.getText(wordRange) : "";
    /*
        console.log(wordRange);
        console.log(lineText);
        console.log(word);
        */
    const docsUtil = new ClrDocsUtil();

    if (!wordRange || !docsUtil.hasDoc(word)) {
      return Promise.resolve(null);
    }

    return new Promise<MarkdownString[]>((resolve, reject) => {
      const definition: DefinitionInfo = docsUtil.getDoc(word);

      const hoverTexts: MarkdownString[] = [];

      const doc = new MarkdownString()
        .appendCodeblock(definition.tag, "html")
        .appendMarkdown(definition.info);

      if (definition.inputs.length > 0)
        doc.appendMarkdown("\n\nInput: _" + definition.getInputsStr() + "_");

      if (definition.outputs.length > 0)
        doc.appendMarkdown("\n\nOutput: _" + definition.getOutputsStr() + "_");

      doc.appendMarkdown("\n\n" + definition.link);

      hoverTexts.push(doc);

      return resolve(hoverTexts);
    });
  }

  public provideHover(
    document: TextDocument,
    position: Position,
    token: CancellationToken
  ): ProviderResult<Hover> {
    return this.getDefinition(document, position).then(
      (definitionInfo) => {
        const hover = new Hover(definitionInfo);
        return hover;
      },
      () => {
        return null;
      }
    );
  }
}

import {
  Hover,
  HoverProvider,
  MarkdownString,
  Position,
  ProviderResult,
  TextDocument,
} from "vscode";
import { ClrDocs } from "./clrDocs";
import { DefinitionInfo } from "./shared/DefinitionInfo";

export class ClrHoverProvider implements HoverProvider {
  /**
   *
   */
  constructor(private readonly docs: ClrDocs) {}

  getDefinition(
    document: TextDocument,
    position: Position
  ): Promise<MarkdownString> {
    const wordRange = document.getWordRangeAtPosition(position);
    const word = wordRange ? document.getText(wordRange) : "";

    if (!wordRange || !this.docs.hasDoc(word)) {
      return Promise.reject();
    }

    return new Promise<MarkdownString>((resolve) => {
      const definition: DefinitionInfo = this.docs.getDoc(word);

      const doc = new MarkdownString().appendCodeblock(definition.tag, "html");

      if (definition.info) {
        doc.appendMarkdown(definition.info);
      }

      if (definition.inputs.length > 0) {
        doc.appendMarkdown("\n\nInput: _" + definition.getInputsStr() + "_");
      }

      if (definition.outputs.length > 0) {
        doc.appendMarkdown("\n\nOutput: _" + definition.getOutputsStr() + "_");
      }

      doc.appendMarkdown("\n\n" + definition.link);

      return resolve(doc);
    });
  }

  public provideHover(
    document: TextDocument,
    position: Position
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

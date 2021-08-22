import {
  Hover,
  HoverProvider,
  MarkdownString,
  Position,
  ProviderResult,
  TextDocument,
} from "vscode";
import { ClrDocs } from "./clrDocs";
import { DefinitionInfo } from "./definitionInfo";

/**
 * The hover provider interface defines the contract between this extension and
 * the [hover](https://code.visualstudio.com/docs/editor/intellisense)-feature.
 */
export class ClrHoverProvider implements HoverProvider {
  private readonly _docs: ClrDocs;

  /**
   * The hover provider interface defines the contract between this extension and
   * the [hover](https://code.visualstudio.com/docs/editor/intellisense)-feature.
   */
  constructor() {
    this._docs = new ClrDocs().loadDocumentation();
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

  private getDefinition(
    document: TextDocument,
    position: Position
  ): Promise<MarkdownString> {
    const wordRange = document.getWordRangeAtPosition(position);
    if (!wordRange) {
      return Promise.reject();
    }

    const word = document.getText(wordRange);
    if (!this._docs.hasDoc(word)) {
      return Promise.reject();
    }

    return new Promise<MarkdownString>((resolve) => {
      const definition: DefinitionInfo = this._docs.getDoc(word);
      const markdown: MarkdownString = this.createMarkdown(definition);
      return resolve(markdown);
    });
  }

  /**
   * Creates a markdown string from the given definition.
   */
  private createMarkdown(definition: DefinitionInfo): MarkdownString {
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

    return doc;
  }
}

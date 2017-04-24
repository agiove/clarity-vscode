import { Hover, HoverProvider, Position, TextDocument, CancellationToken, MarkedString } from "vscode";
import { clrTags } from "./clrTags";
import { clrDocs } from "./clrDocs";
import { DefinitionInfo } from "./shared/DefinitionInfo";

export class ClrHoverProvider implements HoverProvider {

    getDefinition(document: TextDocument, position: Position): Promise<MarkedString[]> {
        let wordRange = document.getWordRangeAtPosition(position);
        let lineText = document.lineAt(position.line).text;
        let word = wordRange ? document.getText(wordRange) : '';
        /*
        console.log(wordRange);
        console.log(lineText);
        console.log(word);
        */
        if (!wordRange || !clrDocs.has(word)) {
            return Promise.resolve(null);
        }

        return new Promise<MarkedString[]>((resolve, reject) => {
            let definition: DefinitionInfo = clrDocs.get(word);
            let hoverTexts: MarkedString[] = [];
            hoverTexts.push({ language: 'html', value: definition.tag });
            hoverTexts.push(definition.info);
            hoverTexts.push(definition.link);
            return resolve(hoverTexts);
        });
    }

    public provideHover(
        document: TextDocument, position: Position, token: CancellationToken): Thenable<Hover> {
            return this.getDefinition(document, position).then(definitionInfo => {
                let hover = new Hover(definitionInfo);
                return hover;
            }, () => {
                return null;
            }
        );    
    }
}
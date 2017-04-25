import { Hover, HoverProvider, Position, TextDocument, CancellationToken, MarkedString } from "vscode";
import { clrTags } from "./clrTags";
import { ClrDocsUtil } from "./clrDocs";
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
        let docsUtil = new ClrDocsUtil();

        if (!wordRange || !docsUtil.hasDoc(word)) {
            return Promise.resolve(null);
        }

        return new Promise<MarkedString[]>((resolve, reject) => {
            let definition: DefinitionInfo = docsUtil.getDoc(word);
            let hoverTexts: MarkedString[] = [];
            hoverTexts.push({ language: 'html', value: definition.tag });
            hoverTexts.push(definition.info);
            if (definition.inputs.length > 0) 
                hoverTexts.push("Input: _" + definition.getInputsStr() + "_");
            if (definition.outputs.length > 0) 
                hoverTexts.push("Output: _" + definition.getOutputsStr() + "_");
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
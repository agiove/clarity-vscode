import * as clrMetadata from "@clr/angular/clr-angular.metadata.json";
import * as clrDescriptions from "./metadata.json";

import { DefinitionInfo } from "./shared/DefinitionInfo";

const baseUrl = "https://clarity.design/angular-components/";

const docMap: Map<string, DefinitionInfo> = new Map();

Object.keys(clrMetadata.metadata).forEach((elementName) => {
  const element = clrMetadata.metadata[elementName];
  if (!element.hasOwnProperty("decorators")) return;

  const component = element.decorators.find(
    (decorator: any) =>
      decorator.hasOwnProperty("expression") &&
      decorator.expression.name === "Component" &&
      decorator.hasOwnProperty("arguments") &&
      decorator.arguments instanceof Array &&
      decorator.arguments[0].hasOwnProperty("selector")
  );
  if (!component) return;

  const tag = component.arguments[0].selector;
  const info = clrDescriptions[tag] || "";

  docMap.set(tag, new DefinitionInfo(`<${tag}>`, info, baseUrl + tag, element));
});

export class ClrDocsUtil {
  hasDoc(tag: string): boolean {
    return docMap.has(tag);
  }

  getDoc(tag: string): DefinitionInfo {
    const definition: DefinitionInfo = docMap.get(tag);

    if (!definition.lazy) return definition;
    definition.lazy = false;

    const meta = definition.meta.members;
    Object.keys(meta).map((propertyName) => {
      const member = meta[propertyName];
      if (
        member instanceof Array &&
        member[0].hasOwnProperty("decorators") &&
        member[0].decorators instanceof Array &&
        member[0].decorators[0].hasOwnProperty("arguments") &&
        member[0].decorators[0].arguments instanceof Array &&
        member[0].decorators[0].hasOwnProperty("expression")
      ) {
        const attributeName = member[0].decorators[0].arguments[0];
        const exprName = member[0].decorators[0].expression.name;
        if (exprName == "Input") {
          definition.inputs.push(attributeName);
        } else if (exprName == "Output") {
          definition.outputs.push(attributeName);
        }
      }
    });

    return definition;
  }
}

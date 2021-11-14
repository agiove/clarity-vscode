import {
  isClassMetadata,
  isMetadataImportedSymbolReferenceExpression,
  isMetadataSymbolicCallExpression,
  MemberMetadata,
  MetadataEntry,
  MetadataError,
  MetadataObject,
  MetadataSymbolicCallExpression,
  MetadataSymbolicExpression,
} from "@angular/compiler-cli";

import * as clrMetadata from "@clr/angular/clr-angular.metadata.json";

import { ClrDescriptionsType } from "./clrDescriptionsType";
import { DefinitionInfo } from "./definitionInfo";
import * as _clrDescriptions from "./metadata.json";

const clrDescriptions = _clrDescriptions as ClrDescriptionsType;

export class ClrDocs {
  private _definitions: Map<string, DefinitionInfo> = new Map();

  public loadDocumentation(): ClrDocs {
    Object.keys(clrMetadata.metadata).forEach(this.loadDefinition.bind(this));
    return this;
  }

  public hasDocumentation(tag: string): boolean {
    return this._definitions.has(tag);
  }

  public getDocumentation(tag: string): DefinitionInfo {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion -- safety-check done before.
    const definition: DefinitionInfo = this._definitions.get(tag)!;

    if (!definition.lazy) {
      return definition;
    }
    definition.lazy = false;

    const members = definition.meta.members;
    if (members === undefined) {
      return definition;
    }

    Object.keys(members).map((propertyName: string) => {
      const member: Array<MemberMetadata> = members[propertyName];

      const memberProperties = member
        // Ignore constructors and methods.
        .filter((member) => {
          return (
            member.__symbolic === "property" &&
            member.decorators instanceof Array &&
            member.decorators.length > 0
          );
        });
      memberProperties.forEach((property) => {
        const callExpressions: Array<MetadataSymbolicCallExpression> =
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion -- safety-check done before.
          property
            .decorators! // Must be an `call` expression.
            .filter(isMetadataSymbolicCallExpression);

        const inputDecorators = this.getDecorators(callExpressions, "Input");
        if (inputDecorators.length > 0) {
          definition.inputs.push(...inputDecorators);
        }

        const outputDecorators = this.getDecorators(callExpressions, "Output");
        if (outputDecorators.length > 0) {
          definition.outputs.push(...outputDecorators);
        }
      });
    });

    return definition;
  }

  private loadDefinition(entryName: string): void {
    const entryKey = entryName as keyof typeof clrMetadata.metadata;
    const entry: MetadataEntry = clrMetadata.metadata[entryKey];

    // Entry should be of type `ClassMetadata` and have decorators.
    if (
      !isClassMetadata(entry) ||
      !(entry.decorators instanceof Array) ||
      entry.decorators.length === 0
    ) {
      return;
    }

    const component: MetadataSymbolicCallExpression | undefined =
      this.getComponentNode(entry.decorators);
    if (component === undefined) {
      return;
    }

    const tag: string = this.getTag(component);
    const info: string = this.getClrDescription(tag);
    const link: string = this.getDocumentationLink(tag);

    this._definitions.set(
      tag,
      new DefinitionInfo(`<${tag}>`, info, link, entry)
    );
  }

  private getClrDescription(tag: string): string {
    if (clrDescriptions[tag] === undefined) {
      console.debug(`No description found for ${tag}`);
    }
    return clrDescriptions[tag] || "";
  }

  private getComponentNode(
    decorators: (MetadataSymbolicExpression | MetadataError)[]
  ): MetadataSymbolicCallExpression | undefined {
    return (
      decorators
        // Must be an `call` expression.
        .filter(isMetadataSymbolicCallExpression)
        // Only want `@Component` decorators.
        .filter(
          (decorator) =>
            isMetadataImportedSymbolReferenceExpression(decorator.expression) &&
            decorator.expression.name === "Component"
        )
        // Must have a selector parameter (which contains the component tag).
        .find(
          (decorator) =>
            decorator.arguments instanceof Array &&
            decorator.arguments.length > 0 &&
            Object.prototype.hasOwnProperty.call(
              decorator.arguments[0],
              "selector"
            )
        )
    );
  }

  private getTag(component: MetadataSymbolicCallExpression): string {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion -- safety-check done before.
    return (component.arguments![0] as MetadataObject)["selector"] as string;
  }

  private getDecorators(
    callExpressions: Array<MetadataSymbolicCallExpression>,
    decoratorType: "Input" | "Output"
  ): Array<string> {
    const inputDecorators = callExpressions.filter(
      (decorator) =>
        isMetadataImportedSymbolReferenceExpression(decorator.expression) &&
        decorator.expression.name === decoratorType &&
        decorator.arguments instanceof Array &&
        decorator.arguments.length > 0
    );
    return inputDecorators.map(
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion -- safety-check done before.
      (decorator) => decorator.arguments![0] as string
    );
  }

  private getDocumentationLink(tag: string): string {
    const tagPage = tag.replace(/^clr-/, "");
    return `https://clarity.design/angular-components/${tagPage}`;
  }
}

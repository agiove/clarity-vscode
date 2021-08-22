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
import { jsonc } from "jsonc";
import * as path from "path";
import { DefinitionInfo } from "./definitionInfo";

const baseUrl = "https://clarity.design/angular-components/";

export class ClrDocs {
  private _definitions: Map<string, DefinitionInfo> = new Map();

  private _descriptions: { [tag: string]: string } = {};

  public async loadDocumentation(): Promise<ClrDocs> {
    this._descriptions = await this.getClrDescriptions();

    Object.keys(clrMetadata.metadata).forEach((nodeName: string) => {
      const key: keyof typeof clrMetadata.metadata =
        nodeName as keyof typeof clrMetadata.metadata;
      const node: MetadataEntry = clrMetadata.metadata[key];
      if (
        !isClassMetadata(node) ||
        !(node.decorators instanceof Array) ||
        node.decorators.length === 0
      ) {
        return;
      }

      const component: MetadataSymbolicCallExpression | undefined =
        this.getComponentNode(node.decorators);
      if (component === undefined) {
        return;
      }

      const tag: string = this.getTag(component);
      const info: string = this.getClrDescription(tag);

      this._definitions.set(
        tag,
        new DefinitionInfo(`<${tag}>`, info, baseUrl + tag, node)
      );
    });

    return this;
  }

  private async getClrDescriptions(): Promise<{ [tag: string]: string }> {
    const [err, clrDescriptions] = await jsonc.safe.read(
      path.resolve(__dirname, "metadata.json")
    );
    console.assert(err === null, "Failed to load metadata.json");
    return clrDescriptions;
  }

  private getClrDescription(tag: string): string {
    return this._descriptions[tag] || "";
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
    return (component.arguments![0] as MetadataObject).selector as string;
  }

  hasDoc(tag: string): boolean {
    return this._definitions.has(tag);
  }

  getDoc(tag: string): DefinitionInfo {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion -- safety-check done before.
    const definition: DefinitionInfo = this._definitions.get(tag)!;

    if (!definition.lazy) {
      return definition;
    }
    definition.lazy = false;

    const members = definition.meta.members;
    if (members !== undefined) {
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
              .decorators!// Must be an `call` expression.
              .filter(isMetadataSymbolicCallExpression);

          const inputDecorators = this.getDecorators(callExpressions, "Input");
          if (inputDecorators.length > 0) {
            definition.inputs.push(...inputDecorators);
          }

          const outputDecorators = this.getDecorators(
            callExpressions,
            "Output"
          );
          if (outputDecorators.length > 0) {
            definition.outputs.push(...outputDecorators);
          }
        });
      });
    }

    return definition;
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
}

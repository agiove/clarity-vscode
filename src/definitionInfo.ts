import { ClassMetadata } from "@angular/compiler-cli";

export class DefinitionInfo {
  constructor(
    public tag: string,
    public info: string,
    public link: string,
    public meta: ClassMetadata,
    public inputs: string[] = [],
    public outputs: string[] = [],
    public lazy: boolean = true
  ) {}

  getInputsStr(): string {
    return this.arr2str(this.inputs);
  }

  getOutputsStr(): string {
    return this.arr2str(this.outputs);
  }

  private arr2str(arr: string[]): string {
    return arr.reduce((acc, current) => {
      if (acc !== "") acc += ", ";
      return acc + current;
    }, "");
  }
}

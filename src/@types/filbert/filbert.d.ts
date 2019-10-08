/// <reference types="node" />

declare module 'filbert' {
  export interface IDNode {
    type: string,
    name: string
  }
  
  interface Position {
    line: number,
    column: number
  }

  export interface ASTNode {
    type: string,
    name?: string,
    params?: ASTNode[],
    id?: IDNode,
    body?: ASTNode | ASTNode[],
    range?: [number, number],
    loc?: { start: Position, end: Position }
  }

  interface Options {
    languageVersion?: number,
    allowTrailingCommas?: boolean,
    allowReturnOutsideFunction?: boolean,
    locations?: boolean,
    onComment?: (...args: any[]) => void,
    ranges?: boolean,
    program?: ASTNode,
    sourceFile?: string,
    directSourceFile?: string,
    runtimeParamName?: string
  }

  export function parse(content: string, options?: Options): ASTNode;
}
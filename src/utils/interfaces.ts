import { ASTProgramNode } from "../interfaces/ast.ts";
import { Token } from "../interfaces/tokens.ts";

export interface ComponentNode {
  template?: string,
  content?: string,
  path: string,
  name: string,
  type?: NodeType,
  tokens?: Token[],
  ast?: ASTProgramNode
  errros?: [],
}

export enum NodeType {
  Tempalte = 'Tempalte',
  Component = 'Component',
  Program = 'Program',
}
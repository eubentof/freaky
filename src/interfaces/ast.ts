import { Token } from "./tokens.ts"

export enum ASTNodeType {
  Program = 'Program',
  HtmlTag = 'HtmlTag',
  HTMLAttribute = 'HTMLAttribute',
  Literal = 'Literal',
  String = 'String',
  Number = 'Number',
  Object = 'Object',
  ArrayStrings = 'ArrayStrings',
}

export interface ASTProgramNode {
  type: ASTNodeType.Program,
  children: ASTNode[]
}

export interface ASTGenericValueNode<T extends ASTNodeType, K> {
  type: T,
  value: K,
  token: Partial<Token>
}

interface ASTGenericttributeNode<T> {
  type: ASTNodeType.HTMLAttribute,
  name: string,
  value: T,
  token: Partial<Token>
}

export type SingleValueHTMLAttr = ASTGenericttributeNode<string> | ASTGenericttributeNode<number>
export type ListValueHTMLAttr = ASTGenericttributeNode<string[]>
export type ObjectValueHTMLAttr = ASTGenericttributeNode<ASTGenericttributeNode<string>>

export type ASTHtmlTagAttributeValueNode = SingleValueHTMLAttr | ListValueHTMLAttr | ObjectValueHTMLAttr

export interface ASTTagNode {
  type: ASTNodeType.HtmlTag,
  name: string,
  token: Partial<Token>,
  children?: ASTNode[]
  attributes?: ASTHtmlTagAttributeValueNode[]
}

export type ASTValueNode =
  | ASTGenericValueNode<ASTNodeType.String, string>
  | ASTGenericValueNode<ASTNodeType.Literal, string>
  | ASTGenericValueNode<ASTNodeType.Number, number>
  | ASTGenericValueNode<ASTNodeType.HTMLAttribute, ASTHtmlTagAttributeValueNode>


export type ASTNode =
  | ASTTagNode
  | ASTValueNode

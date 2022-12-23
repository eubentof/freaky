import { DataAttr } from "../attributeHandlers/DataAttributeHandler.ts";
import { Token, TokenPrimitiveType, TokenType } from "../tokenizer.ts";

export enum NodeType {
  Unknown = 'Unknown',
  EndOfFile = 'EOF',
  HTMLTag = 'HTMLTag',
  HTMLAttribute = 'HTMLAttribute',
  NumberLiteral = 'NumberLiteral',
  CallExpression = 'CallExpression',
  Component = 'Component',
  Program = 'Program',
  Tempalte = 'Tempalte',
}

export type AttributeUnity = 'px'

export interface NodeAttributeValueUnity {
  value: number,
  unity: AttributeUnity
}

export interface NodeAttributeZeroValue {
  value: 0
}

export type NodeAttributeValue = NodeAttributeValueUnity | NodeAttributeZeroValue

export interface NodeWidthAttr {
  width?: NodeAttributeValue,
}

export interface NodeAttributes {
  id?: string,
  class?: string[],
  border?: NodeWidthAttr,
  data?: DataAttr[]
}

export interface NodeProps {
  inline?: boolean
}

export interface AttributeNode {
  type: NodeType.HTMLAttribute
  token: Token,
  name: string,
  children: Token[]
}

export interface TagNode {
  type: NodeType.HTMLTag
  token: Token,
  name: string
  attributes?: NodeAttributes
  props?: NodeProps,
  children: GenericNode[]
}

export interface GenericNode {
  type: NodeType
  token?: Token,
  value?: any
  name: string
  params?: any
  props?: NodeProps,
  attributes?: NodeAttributes
  children: (Node | Token)[]
}

export type Node = AttributeNode | TagNode | GenericNode
import { ClassAttributeHandler } from "./attributeHandlers/ClassAttributeHandler.ts";
import { DataAttributeHandler } from "./attributeHandlers/DataAttributeHandler.ts";
import { IdAttributeHandler } from "./attributeHandlers/IdAttributeHandler.ts";
import { AttributeNode, TagNode } from "./utils/parser.utils.ts";

export type TagAttributeTransformer = (node: AttributeNode, parent: TagNode) => void
export type TagAttributeConverter = (value: any) => string

export interface TagAttributeHandler {
  transform: TagAttributeTransformer,
  toHtml: TagAttributeConverter,
}

export const attributeHandlers: { [attributeName: string]: TagAttributeHandler } = {
  'id': new IdAttributeHandler(),
  'class': new ClassAttributeHandler(),
  'data': new DataAttributeHandler(),
}
import { ASTHtmlTagAttributeValueNode, ListValueHTMLAttr, ObjectValueHTMLAttr, SingleValueHTMLAttr } from "../interfaces/ast.ts";
import { Token } from "../interfaces/tokens.ts";
import { TagAttributeParser, attributeParsersMap } from "../utils/attributeParsers.ts";
import { validateClassName } from "./attributeValidators/validateClass.ts";
import { validateDataset } from "./attributeValidators/validateDataset.ts";
import { validateId } from "./attributeValidators/validateId.ts";


interface TokenValidationError {
  token?: Token,
  error: string,
}

export const isHTMLAttrubute = (attr: string) => HtmlTagsAttributesHandlersMap[attr] !== undefined

export type AttributeValidatorResult = TokenValidationError | void
export interface HtmlTagsAttributesHandlers {
  parse: TagAttributeParser
  validate: (tokens: Token[]) => AttributeValidatorResult,
  toString: (node: ASTHtmlTagAttributeValueNode) => string
}

export const HtmlTagsAttributesHandlersMap: { [tag: string]: HtmlTagsAttributesHandlers } = {
  id: {
    parse: attributeParsersMap.single,
    validate: validateId,
    toString: (node: ASTHtmlTagAttributeValueNode) => `id="${node.value}"`
  },
  class: {
    parse: attributeParsersMap.list,
    validate: validateClassName,
    toString: (node: ASTHtmlTagAttributeValueNode) => `class="${(node as ListValueHTMLAttr).value.join(' ')}"`
  },
  dataset: {
    parse: attributeParsersMap.object,
    validate: validateDataset,
    toString: (node: ASTHtmlTagAttributeValueNode) => Object
      .entries((node as ObjectValueHTMLAttr).value)
      .map(([key, value]) => `data-${key}="${value}"`)
      .join(' ')
  }
}
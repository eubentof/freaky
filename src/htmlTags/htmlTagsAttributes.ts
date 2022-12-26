import { ASTHtmlTagAttributeValueNode, ListValueHTMLAttr, ObjectValueHTMLAttr } from "../interfaces/ast.ts";
import { Token } from "../interfaces/tokens.ts";
import { TagAttributeParser, attributeParsersMap } from "../utils/attributeParsers.ts";
import { validateListOfValues } from "./attributeValidators/listOfValues.ts";
import { validateBoolean } from "./attributeValidators/validateBoolean.ts";
import { validateClassName } from "./attributeValidators/validateClass.ts";
import { validateDataset } from "./attributeValidators/validateDataset.ts";
import { validateLanguage } from "./attributeValidators/validateLanguage.ts";
import { validateNumber } from "./attributeValidators/validateNumber.ts";
import { validateSingleChar } from "./attributeValidators/validateSingleChar.ts";
import { validateWord } from "./attributeValidators/validateWord.ts";


interface TokenValidationError {
  token?: Token,
  error: string,
}

export const isHTMLAttrubute = (attr: string) => HtmlTagsAttributesHandlersMap[attr] !== undefined

export type AttributeValidatorResult = TokenValidationError | void

export interface HtmlTagsAttributesHandlers {
  parse: TagAttributeParser
  validators?: (tokens: Token[]) => AttributeValidatorResult,
  toString: (node: ASTHtmlTagAttributeValueNode) => string
}

export const HtmlTagsAttributesHandlersMap: { [tag: string]: HtmlTagsAttributesHandlers } = {
  // Specifies a shortcut key to activate/focus an element
  accesskey: {
    parse: attributeParsersMap.single,
    validators: validateSingleChar,
    toString: (node: ASTHtmlTagAttributeValueNode) => `accesskey="${node.value}"`
  },

  // Specifies one or more classnames for an element (refers to a class in a style sheet)
  class: {
    parse: attributeParsersMap.list,
    validators: validateClassName,
    toString: (node: ASTHtmlTagAttributeValueNode) => `class="${(node as ListValueHTMLAttr).value.join(' ')}"`
  },

  // Specifies whether the content of an element is editable or not
  contenteditable: {
    parse: attributeParsersMap.single,
    validators: validateListOfValues(['true', 'false']),
    toString: (node: ASTHtmlTagAttributeValueNode) => `contenteditable="${node.value}"`
  },

  // Used to store custom data private to the page or application
  dataset: {
    parse: attributeParsersMap.object,
    validators: validateDataset,
    toString: (node: ASTHtmlTagAttributeValueNode) => Object
      .entries((node as ObjectValueHTMLAttr).value)
      .map(([key, value]) => `data-${key}="${value}"`)
      .join(' ')
  },

  // Specifies the text direction for the content in an element
  dir: {
    parse: attributeParsersMap.single,
    validators: validateListOfValues(['ltr', 'rtl', 'auto']),
    toString: (node: ASTHtmlTagAttributeValueNode) => `draggable="${node.value}"`
  },

  // Specifies whether an element is draggable or not
  draggable: {
    parse: attributeParsersMap.single,
    validators: validateListOfValues(['true', 'false', 'auto']),
    toString: (node: ASTHtmlTagAttributeValueNode) => `draggable="${node.value}"`
  },

  // Specifies that an element is not yet, or is no longer, relevant
  hidden: {
    parse: attributeParsersMap.single,
    toString: (node: ASTHtmlTagAttributeValueNode) => `hidden`
  },

  // Specifies a unique id for an element
  id: {
    parse: attributeParsersMap.single,
    validators: validateWord,
    toString: (node: ASTHtmlTagAttributeValueNode) => `id="${node.value}"`
  },

  // Specifies the language of the element's content
  lang: {
    parse: attributeParsersMap.single,
    validators: validateLanguage,
    toString: (node: ASTHtmlTagAttributeValueNode) => `lang="${(node.value as string).toLowerCase()}"`
  },

  // Specifies whether the element is to have its spelling and grammar checked or not
  spellcheck: {
    parse: attributeParsersMap.single,
    validators: validateListOfValues(['true', 'false']),
    toString: (node: ASTHtmlTagAttributeValueNode) => `spellcheck="${node.value}"`
  },

  // Specifies an inline CSS style for an element
  style: {
    parse: attributeParsersMap.single,
    validators: validateWord,
    toString: (node: ASTHtmlTagAttributeValueNode) => `style="${node.value}"`
  },

  // Specifies the tabbing order of an element
  tabindex: {
    parse: attributeParsersMap.single,
    validators: validateNumber,
    toString: (node: ASTHtmlTagAttributeValueNode) => `tabindex="${node.value}"`
  },

  // Specifies extra information about an element
  title: {
    parse: attributeParsersMap.single,
    validators: validateWord,
    toString: (node: ASTHtmlTagAttributeValueNode) => `title="${node.value}"`
  },

  // Specifies whether the content of an element should be translated or not
  translate: {
    parse: attributeParsersMap.single,
    validators: validateListOfValues(['true', 'false']),
    toString: (node: ASTHtmlTagAttributeValueNode) => `translate="${node.value == 'true' ? 'yes' : 'no'}"`
  },

}
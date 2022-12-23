import { TagAttributeHandler } from "../tagAttributeHandlers.ts"
import { TokenPrimitiveType, TokenSymbolType } from "../tokenizer.ts"
import { TagNode } from "../utils/parser.utils.ts"
import { AttributeNode } from "../utils/parser.utils.ts"
import { checkMissingQuote, errorInLine } from "../utils/utils.ts"

export interface DataAttr {
  name: string,
  value: string
}


export class DataAttributeHandler implements TagAttributeHandler {
  transform(node: AttributeNode, parent: TagNode) {
    const dataEls: DataAttr[] = []

    let current = -1;


    // [NAME] [COLON] [QUOTE] [NAME]+ [QUOTE] ?[COMMA]
    while (current < node.children.length) {
      let name = '';
      let value = '';
      let token = node.children[++current];
      const rootToken = token

      // Check for name
      if (token.type != TokenPrimitiveType.Name) throw errorInLine(rootToken, `Missing data name.`)
      name = token.value
      const DATA_NAME = /^[a-zA-Z][_\-a-zA-Z]+$/gm
      if (!DATA_NAME.test(name)) throw errorInLine(rootToken, `'${name}' is not a valid data atribute name.`)

      // Check for colon
      token = node.children[++current];
      if (!token) throw errorInLine(rootToken, `'data-${rootToken.value}' name must have a value.`)
      if (token.type != TokenSymbolType.Colon) throw errorInLine(token, `Missing ':'`)

      // Check for quote
      token = node.children[++current];
      if (!token) throw errorInLine(rootToken, `'data-${rootToken.value}' name must have a value.`)
      if (token.type != TokenSymbolType.SimpleQuote && token.type != TokenSymbolType.DoubleQuote) throw errorInLine(rootToken, `Missing quote.`)
      const quoteType = token.type

      // Check for name
      token = node.children[++current]
      while (token && token.type !== quoteType) {
        if (token.type == TokenSymbolType.Comma) checkMissingQuote(token, quoteType)
        value += token.value
        token = node.children[++current];
      }

      // Check for closing quote
      if (token.type != quoteType) throw errorInLine(rootToken, `Missing closing quote.`)

      dataEls.push({ name, value });

      token = node.children[++current];
      if (!token) break

      // Check for comma
      if (token.type !== TokenSymbolType.Comma) throw errorInLine(rootToken, `Missing comma.`)
    }

    if (!parent.attributes) parent.attributes = {}

    parent.attributes.data = dataEls
  }

  toHtml(datas: DataAttr[]) {
    return ` ${datas.map(({ name, value }): string => `data-${name}="${value}"`).join(' ')}`;
  }
}



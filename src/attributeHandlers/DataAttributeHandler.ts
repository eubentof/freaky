import { TagAttributeHandler } from "../tagAttributeHandlers.ts"
import { TokenPrimitiveType, TokenSymbolType } from "../tokenizer.ts"
import { TagNode } from "../utils/parser.utils.ts"
import { AttributeNode } from "../utils/parser.utils.ts"
import { errorInLine } from "../utils/utils.ts"

export interface DataAttr {
  name: string,
  value: string
}


export class DataAttributeHandler implements TagAttributeHandler {
  transform(node: AttributeNode, parent: TagNode) {
    const dataEls: DataAttr[] = []

    let current = 0;

    while (current < node.children.length) {
      let name = '';
      let value = '';
      let token = node.children[current];
      const rootToken = node.children[current]

      if (token.type != TokenPrimitiveType.Name)
        throw errorInLine(rootToken, `Missing data name.`)

      name = token.value
      const DATA_NAME = /^[a-zA-Z][_\-a-zA-Z]+$/gm
      if (!DATA_NAME.test(name))
        throw errorInLine(rootToken, `'${name}' is not a valid data atribute name.`)

      token = node.children[++current];

      if (!token)
        throw errorInLine(rootToken, `'data-${rootToken.value}' name must have a value.`)

      if (token.type != TokenSymbolType.Colon)
        throw errorInLine(token, `Missing ':'`)

      token = node.children[++current];

      if (!token)
        throw errorInLine(rootToken, `'data-${rootToken.value}' name must have a value.`)


      if (token.type != TokenSymbolType.SimpleQuote)
        throw errorInLine(rootToken, `Missing quote.`)

      current++

      while (node.children[current]) {
        token = node.children[current];

        if (token.type == TokenSymbolType.Comma) throw errorInLine(rootToken, 'Missing closing quote.')
        current++

        if (token.type == TokenSymbolType.SimpleQuote) break
        value += token.value
      }

      current++

      dataEls.push({ name, value });

      token = node.children[++current];

      if (!token) break

      if (token.type !== TokenSymbolType.Comma)
        throw errorInLine(rootToken, `Missing comma.`)

      current++
    }

    if (!parent.attributes) parent.attributes = {}

    parent.attributes.data = dataEls
  }

  toHtml(datas: DataAttr[]) {
    return ` ${datas.map(({ name, value }): string => `data-${name}="${value}"`).join(' ')}`;
  }
}



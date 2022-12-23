import { TagAttributeHandler } from "../tagAttributeHandlers.ts"
import { TokenSymbolType } from "../tokenizer.ts"
import { TagNode } from "../utils/parser.utils.ts"
import { AttributeNode } from "../utils/parser.utils.ts"
import { errorInLine } from "../utils/utils.ts"


export class ClassAttributeHandler implements TagAttributeHandler {
  transform(node: AttributeNode, parent: TagNode) {
    const classes: string[] = []

    let current = 0;

    while (current < node.children.length) {
      let className = '';
      let token = node.children[current];
      const rootToken = node.children[current]

      if (token.type != TokenSymbolType.SimpleQuote)
        throw errorInLine(rootToken, `Missing quote.`)

      current++

      while (node.children[current]) {
        token = node.children[current];

        if (token.type == TokenSymbolType.Comma) throw errorInLine(rootToken, 'Missing closing quote.')
        current++

        if (token.type == TokenSymbolType.SimpleQuote) break
        className += token.value
      }

      const CSS_CLASS_NAME = /^[_a-zA-Z][_\-a-zA-Z0-9]+$/gm
      if (!CSS_CLASS_NAME.test(className))
        throw errorInLine(rootToken, `'${className}' is not a valid css class name.`)

      classes.push(className);

      token = node.children[current];

      if (!token) break

      if (token.type !== TokenSymbolType.Comma)
        throw errorInLine(rootToken, `Missing comma.`)

      current++
    }

    if (!parent.attributes) parent.attributes = {}
    parent.attributes.class = classes
  }

  toHtml(classes: string[]): string { return ` class="${classes.join(' ')}"` }
}


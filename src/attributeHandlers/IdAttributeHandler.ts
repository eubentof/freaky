import { TagAttributeHandler } from "../tagAttributeHandlers.ts"
import { TokenSymbolType } from "../tokenizer.ts"
import { TagNode } from "../utils/parser.utils.ts"
import { AttributeNode } from "../utils/parser.utils.ts"
import { errorInLine, checkMissingQuote } from "../utils/utils.ts"


export class IdAttributeHandler implements TagAttributeHandler {
  transform(node: AttributeNode, parent: TagNode): void {

    // [quote] [id]+ [quote]
    let current = 0
    let token = node.children[current]

    // Check for quote
    if (token.type !== TokenSymbolType.SimpleQuote && token.type !== TokenSymbolType.DoubleQuote) throw errorInLine(token, `Missing opening quote.`)
    const quoteType = token.type

    // Check for id
    token = node.children[++current]
    let id = ''
    while (token && token.type !== quoteType) {
      id += token.value
      token = node.children[++current]
    }

    // Check for closing quote
    if (!token) token = node.children[current - 1]
    checkMissingQuote(token, quoteType)

    // Check if id is valid
    const ID_NAME = /^[A-Za-z]+[\w\-\:\.]*$/
    if (!ID_NAME.test(id)) throw errorInLine(token, `${id} is not a valid id.`)

    if (!parent.attributes) parent.attributes = {}
    parent.attributes.id = id;
  }

  toHtml(id: string): string { return ` id="${id}"` }
}


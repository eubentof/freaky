import { TagAttributeHandler } from "../tagAttributeHandlers.ts"
import { TokenPrimitiveType, TokenSymbolType } from "../tokenizer.ts"
import { TagNode } from "../utils/parser.utils.ts"
import { AttributeNode } from "../utils/parser.utils.ts"
import { errorInLine } from "../utils/utils.ts"


export class IdAttributeHandler implements TagAttributeHandler {
  transform(node: AttributeNode, parent: TagNode): void {
    const ls_quote = node.children[0]
    const rs_quote = node.children[node.children.length - 1]

    if (ls_quote.type !== TokenSymbolType.SimpleQuote) throw errorInLine(ls_quote, `Missing opening quote.`)
    if (rs_quote.type !== TokenSymbolType.SimpleQuote) throw errorInLine(rs_quote, `Missing closing quote.`)

    let current = 1
    let id = ''
    let token = node.children[current]
    while (current < node.children.length - 1) {
      id += token.value
      current++
      token = node.children[current]
    }

    const ID_NAME = /^[A-Za-z]+[\w\-\:\.]*$/
    if (!ID_NAME.test(id)) throw errorInLine(ls_quote, `${id} is not a valid id.`)

    if (!parent.attributes) parent.attributes = {}
    parent.attributes.id = id;
  }

  toHtml(id: string): string { return ` id="${id}"` }
}


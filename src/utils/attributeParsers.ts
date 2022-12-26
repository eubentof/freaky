import { Token, TokenType, TokenValueNode } from "../interfaces/tokens.ts"

export type Dataset = { [key: string]: string }
export type TagAttributeValue = string | number | string[] | Dataset
export type TagAttributeParser = (tokens: Token[]) => TagAttributeValue | undefined

interface AttributeParserMap {
  single: TagAttributeParser
  list: TagAttributeParser,
  object: TagAttributeParser,
}

export const attributeParsersMap: AttributeParserMap = {
  // tokens: [[value]]
  single: (tokens: Token[]): string | number | undefined => {
    const { value } = tokens[0] as TokenValueNode<TokenType.String>
    return value;
  },

  // tokens: [[value] ?[comma]]
  list: (tokens: Token[]): string[] => {
    const t = tokens as TokenValueNode<TokenType.String>[]
    const values: string[] = []
    t.forEach(({ type, value }) => {
      if (type == TokenType.String) values.push(value)
    })
    return values
  },

  // tokens: [[name] [colon] [value] ?[comma]]
  object: (tokens: Token[]): Dataset => {
    const value: Dataset = {}
    let current = 0;
    do {
      const nameToken = tokens[current] as TokenValueNode<TokenType.String>
      const valueToken = tokens[current + 2] as TokenValueNode<TokenType.String | TokenType.Number>
      value[nameToken.value] = valueToken.value
      current += 4
    } while (current < tokens.length)
    return value
  },
}
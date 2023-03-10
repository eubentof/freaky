import { Token, TokenType } from "../../interfaces/tokens.ts";
import { AttributeValidatorResult } from "../htmlTagsAttributes.ts";

export function validateClassName(tokens: Token[]): AttributeValidatorResult {
  let current = 0;

  // [class] ?[comma]
  do {
    const classToken = tokens[current]
    const CLASS_REGEX = /^[_a-zA-Z][_\-a-zA-Z0-9]+$/gm
    if (!CLASS_REGEX.test(classToken.value)) return {
      token: classToken,
      error: `'${classToken.value}' is not a valid class name`
    }

    const commaToken = tokens[current + 1]

    if (!commaToken) return
    if (commaToken.type !== TokenType.Comma) return {
      token: commaToken,
      error: `Missing comma after '${classToken.value}'`
    }

    current += 2
  } while (current < tokens.length)
}
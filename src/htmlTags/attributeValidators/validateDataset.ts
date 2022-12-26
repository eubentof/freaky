import { Token, TokenType } from "../../interfaces/tokens.ts";
import { AttributeValidatorResult } from "../htmlTagsAttributes.ts";

export function validateDataset(tokens: Token[]): AttributeValidatorResult {
  let current = 0;

  // [name] [colon] [value] ?[comma]
  do {
    const nameToken = tokens[current]
    const DATASET_NAME_REGEX = /^[a-zA-Z][_\-a-zA-Z]+$/gm
    if (!DATASET_NAME_REGEX.test(nameToken.value)) return {
      token: nameToken,
      error: `'${nameToken.value}' is not a valid class name`
    }

    const colonToken = tokens[current + 1]
    if (!colonToken || colonToken.type !== TokenType.Colon) return {
      token: colonToken ?? nameToken,
      error: `Missing colon after '${nameToken.value}'`
    }

    const valueToken = tokens[current + 2]
    if (!valueToken) return {
      token: colonToken,
      error: `Missing value for dataset '${nameToken.value}'`
    }
    if (valueToken.type !== TokenType.String && valueToken.type !== TokenType.Number) return {
      token: valueToken,
      error: `Dataset value must be string or number`
    }

    const commaToken = tokens[current + 3]

    if (!commaToken) return
    if (commaToken.type !== TokenType.Comma) return {
      token: commaToken,
      error: `Missing comma after '${valueToken.value}'`
    }

    current += 4
  } while (current < tokens.length)
}
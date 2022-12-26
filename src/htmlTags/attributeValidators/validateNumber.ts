import { Token } from "../../interfaces/tokens.ts";
import { AttributeValidatorResult } from "../htmlTagsAttributes.ts";

export function validateNumber(tokens: Token[]): AttributeValidatorResult {
  const token = tokens[0]

  if (tokens.length > 1) return {
    token,
    error: `'${token.value}' must be a single number`
  }

  const NUMBER_REGEX = /\d/
  if (!NUMBER_REGEX.test(token.value)) return {
    token,
    error: `'${token.value}' is not a number`
  }
}
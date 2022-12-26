import { Token } from "../../interfaces/tokens.ts";
import { AttributeValidatorResult } from "../htmlTagsAttributes.ts";

export function validateSingleChar(tokens: Token[]): AttributeValidatorResult {
  const token = tokens[0]

  const ID_REGEX = /[A-Za-z]/g
  if (!ID_REGEX.test(token.value)) return {
    token,
    error: `'${token.value}' must be a letter`
  }

  if (token.value.length > 1) return {
    token,
    error: `'${token.value}' must be a single letter`
  }
}
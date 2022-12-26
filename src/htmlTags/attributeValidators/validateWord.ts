import { Token } from "../../interfaces/tokens.ts";
import { AttributeValidatorResult } from "../htmlTagsAttributes.ts";

export function validateWord(tokens: Token[]): AttributeValidatorResult {
  const token = tokens[0]

  const ID_REGEX = /^[A-Za-z]+[\w\-\:\.]*$/
  if (!ID_REGEX.test(token.value)) return {
    token,
    error: `'${token.value}' is not a valid value for attribute`
  }
}
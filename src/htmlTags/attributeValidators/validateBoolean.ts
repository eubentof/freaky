import { Token } from "../../interfaces/tokens.ts";
import { AttributeValidatorResult } from "../htmlTagsAttributes.ts";

export function validateBoolean(tokens: Token[]): AttributeValidatorResult {
  const token = tokens[0]

  const BOOLEAN_REGEX = /true|false/
  if (!BOOLEAN_REGEX.test(token.value)) return {
    token,
    error: `value must be 'true' or 'false'`
  }
}
import { Token, TokenValueNode, TokenType } from "../../interfaces/tokens.ts";
import { AttributeValidatorResult } from "../htmlTagsAttributes.ts";

export function validateId(tokens: Token[]): AttributeValidatorResult {
  if (!tokens.length) return { error: "Attribute 'id' should not be empty" }

  const token = tokens[0] as TokenValueNode<TokenType.String>

  const ID_REGEX = /^[A-Za-z]+[\w\-\:\.]*$/
  if (!ID_REGEX.test(token.value)) return {
    token,
    error: `Invalid id: '${token.value}'`
  }
}
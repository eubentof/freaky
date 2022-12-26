import { LanguageCodesSet } from "../../interfaces/langCodes.ts";
import { Token } from "../../interfaces/tokens.ts";
import { AttributeValidatorResult } from "../htmlTagsAttributes.ts";

export function validateLanguage(tokens: Token[]): AttributeValidatorResult {
  const token = tokens[0]

  if (tokens.length > 1) return {
    token,
    error: `Must have only one language`
  }

  if (!LanguageCodesSet.has(token.value.toLowerCase())) return {
    token,
    error: `'${token.value}' is not a supported language`
  }
}
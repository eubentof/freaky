import { Token } from "../../interfaces/tokens.ts";
import { AttributeValidatorResult } from "../htmlTagsAttributes.ts";


export function validateListOfValues(values: string[]) {
  return function (tokens: Token[]): AttributeValidatorResult {
    const token = tokens[0]
    if (!values.includes(token.value)) return {
      token,
      error: `value must be one of [${values.map(v => `'${v}'`).join()}]`
    }
  }
}
import { filePath } from "../../build.ts";
import { Token, TokenType } from "../interfaces/tokens.ts";

export const errorInLine = (token: Partial<Token>, message: string): string => `error at ${filePath}:${token?.line}:${token?.col} | Error: ${message}`;

export const logWarningInLine = (token: Partial<Token>, message: string): string => `warning at ${filePath}:${token?.line}:${token?.col} | Warning: ${message}`;

export const checkMissingQuote = (token: Token, quoteType: TokenType.SimpleQuote | TokenType.DoubleQuote): void => {
  if (token.type !== quoteType) {
    if (quoteType == TokenType.SimpleQuote) throw errorInLine(token, `Missing closing simple quote: " ' "`)
    if (quoteType == TokenType.DoubleQuote) throw errorInLine(token, `Missing closing double quote: ' " '`)
  }
}
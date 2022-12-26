import { filePath } from "../../build.ts";
import { Token, TokenType } from "../interfaces/tokens.ts";

export const errorInLine = ({ line, col }: Partial<Token>, message: string): string => `at ${filePath}:${line}:${col} | Error: ${message}`;

export const checkMissingQuote = (token: Token, quoteType: TokenType.SimpleQuote | TokenType.DoubleQuote): void => {
  if (token.type !== quoteType) {
    if (quoteType == TokenType.SimpleQuote) throw errorInLine(token, `Missing closing simple quote: " ' "`)
    if (quoteType == TokenType.DoubleQuote) throw errorInLine(token, `Missing closing double quote: ' " '`)
  }
}
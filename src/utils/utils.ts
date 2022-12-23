import { Token, TokenSymbolType } from "../tokenizer.ts";

export const errorInLine = (token: Token, message: string): string => `[Error in line ${token.line}, collum ${token.col}]: ${message}`;

export const checkMissingQuote = (token: Token, quoteType: TokenSymbolType.SimpleQuote | TokenSymbolType.DoubleQuote): void => {
  if (token.type !== quoteType) {
    if (quoteType == TokenSymbolType.SimpleQuote) throw errorInLine(token, `Missing closing simple quote: " ' "`)
    if (quoteType == TokenSymbolType.DoubleQuote) throw errorInLine(token, `Missing closing double quote: ' " '`)
  }
}
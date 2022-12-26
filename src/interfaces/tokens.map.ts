import { isHTMLTag } from "../htmlTags/htmlTags.ts";
import { isHTMLAttrubute } from "../htmlTags/htmlTagsAttributes.ts";
import { isUnity } from "../htmlTags/htmlTagsAttributesUnities.ts";
import { Token, TokenNode, TokenType } from "./tokens.ts";

interface TokenHandlerParams {
  col: number,
  line: number,
  position: number,
  tab: number,
  value?: any
}

interface TokenHandlerParamsWithType<T> extends TokenHandlerParams {
  type: T
}

export const tokenHandler = <T extends TokenType>({ type, col, line, position, tab, value }: TokenHandlerParamsWithType<T>): TokenNode<T> => ({ type, line, col, tab, position, value })

const typeToTokenHandler = <T extends TokenType>(type: T) => (args: TokenHandlerParams) => tokenHandler<T>({ type, ...args })

export const tokenSymbolMap: { [char: string]: (args: TokenHandlerParams) => Token } = {
  '(': typeToTokenHandler<TokenType.LeftParentesis>(TokenType.LeftParentesis),
  ')': typeToTokenHandler<TokenType.RightParentesis>(TokenType.RightParentesis),
  ',': typeToTokenHandler<TokenType.Comma>(TokenType.Comma),
  ':': typeToTokenHandler<TokenType.Colon>(TokenType.Colon),
  '-': typeToTokenHandler<TokenType.Dash>(TokenType.Dash),
  '\'': typeToTokenHandler<TokenType.SimpleQuote>(TokenType.SimpleQuote),
  '"': typeToTokenHandler<TokenType.DoubleQuote>(TokenType.DoubleQuote),
  '[': typeToTokenHandler<TokenType.LeftBracket>(TokenType.LeftBracket),
  ']': typeToTokenHandler<TokenType.RightBracket>(TokenType.RightBracket),
  '{': typeToTokenHandler<TokenType.LeftBrace>(TokenType.LeftBrace),
  '}': typeToTokenHandler<TokenType.RightBrace>(TokenType.RightBrace),
  '%': typeToTokenHandler<TokenType.Percentage>(TokenType.Percentage),
  '+': typeToTokenHandler<TokenType.Adition>(TokenType.Adition),
  '/': typeToTokenHandler<TokenType.LeftSlash>(TokenType.LeftSlash),
  '\\': typeToTokenHandler<TokenType.RightSlath>(TokenType.RightSlath),
  '*': typeToTokenHandler<TokenType.Multiplication>(TokenType.Multiplication),
  '.': typeToTokenHandler<TokenType.Dot>(TokenType.Dot),
  '$': typeToTokenHandler<TokenType.DolarSign>(TokenType.DolarSign),
  '!': typeToTokenHandler<TokenType.Exclamation>(TokenType.Exclamation),
}

export const getWordToken = (word: string): TokenType => {
  if (isHTMLTag(word)) return TokenType.HTMLTag
  if (isHTMLAttrubute(word)) return TokenType.HTMLAttribute
  if (isUnity(word)) return TokenType.Unity

  return TokenType.Literal
}
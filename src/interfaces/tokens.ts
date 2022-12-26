import { HtmlTagAttibutes } from "./attributes.ts"

export enum TokenType {
  HTMLTag = "HTML_TAG",
  HTMLAttribute = "HTML_ATTR",
  Number = "NUMBER",
  Literal = "LIT",
  String = "STR",
  Unity = "UNITY",

  LineBreack = "NEW_LINE",
  Indentation = "TAB",
  LeftParentesis = "L_PAREN",
  RightParentesis = "R_PAREN",
  SimpleQuote = "S_QUOTE",
  DoubleQuote = "D_QUOTE",
  Comma = "COMMA",
  Colon = "COLON",
  VertialSeparator = "V_SEP",
  Dash = "DASH",
  LeftBracket = "L_BRACKET",
  RightBracket = "R_BRACKET",
  LeftBrace = "L_BRACE",
  RightBrace = "R_BRACE",
  Percentage = "PCTG",
  Adition = "ADD",
  LeftSlash = "L_SLASH",
  RightSlath = "R_SLASH",
  Multiplication = "MULTI",
  Dot = "DOT",
  DolarSign = "DS",
  Exclamation = "XCLT",
}


export interface TokenNode<T extends TokenType> {
  type: T
  tab: number,
  position: number,
  col: number,
  line: number,
  value: string
}

export interface TokenAttrinuteNode extends TokenNode<TokenType.HTMLAttribute> {
  type: TokenType.HTMLAttribute,
  value: keyof HtmlTagAttibutes
}

export type Token =
  TokenNode<TokenType.HTMLAttribute> |
  TokenNode<TokenType.HTMLTag> |
  TokenNode<TokenType.Number> |
  TokenNode<TokenType.String> |
  TokenNode<TokenType.Literal> |
  TokenNode<TokenType.Unity> |
  TokenNode<TokenType.Indentation> |
  TokenNode<TokenType.LeftParentesis> |
  TokenNode<TokenType.RightParentesis> |
  TokenNode<TokenType.SimpleQuote> |
  TokenNode<TokenType.DoubleQuote> |
  TokenNode<TokenType.Comma> |
  TokenNode<TokenType.Colon> |
  TokenNode<TokenType.VertialSeparator> |
  TokenNode<TokenType.Dash> |
  TokenNode<TokenType.LeftBracket> |
  TokenNode<TokenType.RightBracket> |
  TokenNode<TokenType.LeftBrace> |
  TokenNode<TokenType.RightBrace> |
  TokenNode<TokenType.Percentage> |
  TokenNode<TokenType.Adition> |
  TokenNode<TokenType.LeftSlash> |
  TokenNode<TokenType.RightSlath> |
  TokenNode<TokenType.Multiplication> |
  TokenNode<TokenType.Dot> |
  TokenNode<TokenType.DolarSign> |
  TokenNode<TokenType.Exclamation>


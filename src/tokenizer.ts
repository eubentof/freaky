import { isAttrubute, isTag, isUnity } from "./utils/tokenNameMap.ts";

const WORDS = /\w/i;
const WHITESPACE = /\s/;
const NUMBERS = /[0-9]/;
const NEXT_LINE_ATTR = '|';

export interface Token {
  type: TokenType,
  value: string,
  tab: number,
  position: number,
  col: number,
  line: number,
}

export enum TokenPrimitiveType {
  Number = "number",
  Name = "name",
  Tag = "tag",
  Attribute = "attr",
  Unity = "unity",
  Indentation = "tab",
}

export enum TokenSymbolType {
  LeftParentesis = "l_paren",
  RightParentesis = "r_paren",
  LeftBracket = "l_bracket",
  RightBracket = "r_bracket",
  LeftBrace = "l_brace",
  RightBrace = "r_brace",
  Comma = "comma",
  Colon = "colon",
  Percentage = "pctg",
  Adition = "add",
  Dash = "dash",
  LeftSlash = "l_slash",
  RightSlath = "r_slash",
  Multiplication = "multi",
  Dot = "dot",
  DolarSign = "ds",
  SimpleQuote = "s_quote",
  DoubleQuote = "d_quote",
  Exclamation = "xclt",
}

export type TokenType = TokenPrimitiveType | TokenSymbolType

const tokenSymbolMap: { [char: string]: TokenType } = {
  '(': TokenSymbolType.LeftParentesis,
  ')': TokenSymbolType.RightParentesis,
  '[': TokenSymbolType.LeftBracket,
  ']': TokenSymbolType.RightBracket,
  '{': TokenSymbolType.LeftBrace,
  '}': TokenSymbolType.RightBrace,
  ',': TokenSymbolType.Comma,
  ':': TokenSymbolType.Colon,
  '%': TokenSymbolType.Percentage,
  '+': TokenSymbolType.Adition,
  '-': TokenSymbolType.Dash,
  '/': TokenSymbolType.LeftSlash,
  '\\': TokenSymbolType.RightSlath,
  '*': TokenSymbolType.Multiplication,
  '.': TokenSymbolType.Dot,
  '$': TokenSymbolType.DolarSign,
  '\'': TokenSymbolType.SimpleQuote,
  '"': TokenSymbolType.DoubleQuote,
  '!': TokenSymbolType.Exclamation,
}

export function tokenizer(input: string): Token[] {
  const tokens: Token[] = []
  let current = 0;
  let line = 1;
  let col = 0;

  let tab = 0;
  let previousToken: Token | undefined = undefined

  while (current < input.length) {
    let c = input[current];

    const symbolType = tokenSymbolMap[c]

    // Ignore line comments
    if (c == '/') {
      const nextChar = input[current + 1]
      col++
      if (nextChar == '/') {
        while (c !== '\n') {
          c = input[current++];
        }
        line++
        col = 0
        continue
      }
    }

    if (c && symbolType) {
      const token = {
        type: symbolType,
        value: c,
        tab,
        position: current - 1,
        col,
        line,
      }

      tokens.push(token);
      previousToken = token
      current++;
      col++;
      continue;
    }

    if (c == NEXT_LINE_ATTR) {
      current++
      col++;
      if (previousToken) tab = previousToken.tab
      continue;
    }

    if (NUMBERS.test(c)) {
      let value = '';
      while (NUMBERS.test(c)) {
        value += c;
        c = input[++current];
      }

      const token = {
        type: TokenPrimitiveType.Number,
        value,
        tab,
        position: current - value.length,
        col,
        line,
      }

      tokens.push(token);
      previousToken = token
      col += value.length;
      continue;
    }

    if (WHITESPACE.test(c)) {
      let value = ''
      while (c && WHITESPACE.test(c)) {
        value += c;
        c = input[++current];
        col++
      }

      const newLines = value.match(/\n/gi)?.length
      if (newLines) {
        line += newLines;
        col = value.length - (newLines - 1)
        tab = 0;
        if (value.length > 2) tab = (value.length + 1) / 2 - 1
      }
      continue;
    }

    if (WORDS.test(c)) {
      let value = '';
      while (c && WORDS.test(c)) {
        value += c;
        c = input[++current];
      }

      let type: TokenPrimitiveType = TokenPrimitiveType.Name

      if (isTag(value)) type = TokenPrimitiveType.Tag
      if (isAttrubute(value)) type = TokenPrimitiveType.Attribute
      if (isUnity(value)) type = TokenPrimitiveType.Unity

      const token = {
        type,
        value,
        tab,
        position: current - value.length,
        col,
        line,
      }

      tokens.push(token);
      previousToken = token
      col += value.length;
      continue;
    }

    throw `[Error in line ${line}, collum ${col}]: Unknown char '${c}'`
  }

  // console.log(tokens);

  return tokens
}
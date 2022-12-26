import { getWordToken, tokenSymbolMap } from "./interfaces/tokens.map.ts";
import { Token, TokenNode, TokenType } from "./interfaces/tokens.ts";
import { ComponentNode } from "./utils/interfaces.ts";
import { errorInLine } from "./utils/utils.ts";

const WORDS = /\w/i;
const WHITESPACE = /\s/;
const NUMBERS = /[0-9]/;
const NEXT_LINE_CHAR = '|';
const COMMENT_LINE_CHAR = '/';
const QUOTE = /'|"/;

export function tokenizer(component: ComponentNode): ComponentNode {

  if (!component.content) return component

  let current = 0;
  let line = 1;
  let col = 0;

  let tab = 0;
  let previousToken: Token | undefined = undefined

  const input = component.content

  if (!component.tokens) component.tokens = []


  while (current < input.length) {
    const c = input[current];

    if (!c) break;

    // Ignore inline comments
    if (c == COMMENT_LINE_CHAR) {
      const nextChar = input[current + 1]
      if (nextChar == COMMENT_LINE_CHAR) {
        col++
        let c = input[current++]
        while (c !== '\n') {
          c = input[current++];
        }
        line++
        col = 0
        continue
      }
    }

    // Check for strings
    if (QUOTE.test(c)) {
      const quote = c;
      let value = ''
      current++
      while (input[current] !== '\n' && input[current] !== quote) value += input[current++];

      col += value.length

      if (input[current] == '\n') throw errorInLine({ line, col }, "Missing closing quote")

      const token: Token = {
        type: TokenType.String,
        value,
        line,
        col,
        tab,
        position: current - value.length,
      }

      component.tokens.push(token);
      previousToken = token
      current++;
      continue;
    }

    // Check for symble tokens
    const tokenSymbleHandler = tokenSymbolMap[c]
    if (tokenSymbleHandler) {
      const position = current - 1
      const token: Token = tokenSymbleHandler({ tab, position, col, line })
      component.tokens.push(token);
      previousToken = token
      current++;
      col++;
      continue;
    }

    if (c == NEXT_LINE_CHAR) {
      current++
      col++;
      if (previousToken) tab = previousToken.tab
      continue;
    }

    // Check for numbers
    if (NUMBERS.test(c)) {
      let value = '';
      while (NUMBERS.test(input[current])) value += input[current++];

      const token: Token = {
        type: TokenType.Number,
        value,
        line,
        col,
        tab,
        position: current - value.length,
      }

      component.tokens.push(token);
      previousToken = token
      col += value.length;
      continue;
    }

    if (WHITESPACE.test(c)) {
      let value = ''
      while (WHITESPACE.test(input[current])) {
        value += input[current++];
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
      while (WORDS.test(input[current])) value += input[current++];

      const type: TokenType | void = getWordToken(value)

      if (!type) throw errorInLine({ line, col }, `Unknown word '${value}'`)

      const token: any = {
        type,
        value,
        line,
        col,
        tab,
        position: current - value.length,
      }

      component.tokens.push(token);
      previousToken = token
      col += value.length;
      continue;
    }

    throw errorInLine({ line, col }, ` Unknown char '${c}'`)
  }

  return component
}
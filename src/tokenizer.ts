const LETTERS = /[a-z]/i;
const WHITESPACE = /\s/;
const NUMBERS = /[0-9]/;

export interface Token {
  type: string,
  value: string,
}

const specialCharactersMap: { [char: string]: string } = {
  '(': 'paren',
  ')': 'paren',
  ',': 'comma',
  ':': 'colon',
}

function generateToken(input: string): Token[] {
  const tokens: Token[] = []
  let current = 0;

  while (current < input.length) {
    let char = input[current];

    const specialChar = specialCharactersMap[char]
    if (char && specialChar) {
      tokens.push({
        type: specialChar,
        value: char
      });
      current++;
      continue;
    }

    if (LETTERS.test(char)) {
      let value = '';
      while (char && LETTERS.test(char)) {
        value += char;
        char = input[++current];
      }

      tokens.push({
        type: 'name',
        value
      });
      continue;
    }

    if (WHITESPACE.test(char)) {
      let value = ''
      while (char && WHITESPACE.test(char)) {
        value += char;
        char = input[++current];
      }
      if (value.length > 1) tokens.push({
        type: 'tab',
        value: String(value.length / 2)
      });
      continue;
    }

    if (NUMBERS.test(char)) {
      let value = '';
      console.log(value);

      while (NUMBERS.test(char)) {
        value += char;
        char = input[++current];
      }
      tokens.push({
        type: 'number',
        value,
      });
      continue;
    }

    throw new TypeError(`Unknown char: '${char}'`);
  }

  return tokens
}

export function tokenizer(input: string): Token[] {
  const lines = input.split('\n')

  const tokens: Token[] = lines.map(line => generateToken(line)).flat()

  return tokens
}
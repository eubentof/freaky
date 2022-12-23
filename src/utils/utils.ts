import { Token } from "../tokenizer.ts";

export const errorInLine = (token: Token, message: string): string => `[Error in line ${token.line}, collum ${token.col}]: ${message}`;
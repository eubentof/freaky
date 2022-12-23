import { Token, TokenPrimitiveType, TokenSymbolType } from "./tokenizer.ts"
import { AttributeNode, Node, NodeType, TagNode } from "./utils/parser.utils.ts";

export interface FkAST {
  type: NodeType,
  body: Node[],
}

export function parser(tokens: Token[]): FkAST {
  function walk(tokens: Token[], currentTab = 0): any {
    const siblingNodes: Node[] = []

    let childTokens: Token[] = []
    let expression: TagNode | undefined;
    let current = 0
    let token: Token | undefined;

    while (current < tokens.length) {
      token = tokens[current]

      if (token.tab != currentTab) {
        childTokens.push(token)
        current++
        continue
      }

      if (token.type == TokenPrimitiveType.Attribute) {
        if (!expression || expression.type !== NodeType.HTMLTag)
          throw new Error(`Attribute "${token.value}" must be after a tag. (line: ${token.line}, col: ${token.col})`)

        const attribute: AttributeNode = {
          type: NodeType.HTMLAttribute,
          name: token.value,
          token,
          children: []
        };

        token = tokens[++current]
        while (token.type !== TokenSymbolType.RightParentesis) {
          if (token.type == TokenSymbolType.LeftParentesis) {
            token = tokens[++current]
            continue
          }

          attribute.children.push(token)
          token = tokens[++current]
        }

        expression.children.push(attribute)

        current++
        continue
      }

      if (token.type == TokenPrimitiveType.Tag) {
        if (expression) {
          if (childTokens.length > 0) {
            const childNodes = walk(childTokens, currentTab + 1);
            expression.children?.push(...childNodes)
          }
          siblingNodes.push(expression)
          childTokens = []
        }

        expression = {
          type: NodeType.HTMLTag,
          name: token.value,
          children: [],
          token,
        };

        current++
      }
    }

    // For the last node
    if (expression) {
      if (childTokens.length > 0) {
        const childNodes = walk(childTokens, currentTab + 1);
        expression.children?.push(...childNodes)
      }
      siblingNodes.push(expression)
    }

    return siblingNodes
  }

  const ast = {
    type: NodeType.Component,
    body: walk(tokens),
  };

  // console.log(JSON.stringify(ast, null, 2));

  return ast
}
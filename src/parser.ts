import { HtmlTagsSet } from "./htmlTags/htmlTags.ts";
import { HtmlTagsAttributesHandlersMap } from "./htmlTags/htmlTagsAttributes.ts";
import { ASTTagNode, ASTNode, ASTNodeType } from "./interfaces/ast.ts";
import { Token, TokenType } from "./interfaces/tokens.ts";
import { ComponentNode } from "./utils/interfaces.ts";
import { errorInLine } from "./utils/utils.ts";


const getPosition = ({ line, col }: Token): Partial<Token> => ({ line, col })

export function parser(component: ComponentNode): ComponentNode {

  if (!component.tokens) return component

  const tokens = component.tokens

  function process(tokens: Token[], currentTab = 0): ASTNode[] {
    let current = 0
    const siblingNodes: ASTNode[] = []
    let expression: ASTTagNode | undefined;

    if (!tokens.length) return siblingNodes

    let children: Token[] = []
    while (current < tokens.length) {
      let token = tokens[current]

      // Place all indented tokens as children
      if (token.tab !== currentTab) {
        children.push(token)
        current++
        continue
      }

      if (token.type === TokenType.HTMLAttribute) {
        const attrNode = token

        // Check if there is a handler fot the attribute
        const attrHandler = HtmlTagsAttributesHandlersMap[attrNode.value]
        if (!attrHandler) errorInLine(attrNode, `'${attrNode}' is not a valid html attribute`)

        token = tokens[++current]

        // Check for right parentesis
        if (token.type !== TokenType.LeftParentesis) throw errorInLine(token, "Missing '(")

        const childrenTokens: Token[] = []

        token = tokens[++current]

        while (
          token.type == TokenType.String ||
          token.type == TokenType.Number ||
          token.type == TokenType.Literal ||
          token.type == TokenType.Colon ||
          token.type == TokenType.Comma
        ) {
          childrenTokens.push(token)
          token = tokens[++current]
          if (!token) throw errorInLine(tokens[current - 1], "Missing ')'")
        }

        if (token.type !== TokenType.RightParentesis) throw errorInLine(token, "Missing ')'")

        const validationError = attrHandler.validate(childrenTokens)

        if (validationError) throw errorInLine(validationError.token ?? attrNode, validationError.error)

        const value: any = attrHandler.parse(childrenTokens)

        current++

        if (!expression) throw errorInLine(attrNode, `Attibute '${attrNode.value}' must be inside a html tag`)

        if (!expression.attributes) expression.attributes = []

        expression.attributes.push({
          type: ASTNodeType.HTMLAttribute,
          name: attrNode.value,
          value,
          token: getPosition(attrNode),
        })

        continue
      }

      if (token.type === TokenType.String) {
        siblingNodes.push({
          type: ASTNodeType.String,
          value: token.value,
          token: getPosition(token),
        })

        current++
        continue
      }

      if (token.type === TokenType.Number) {
        siblingNodes.push({
          type: ASTNodeType.Number,
          value: Number(token.value),
          token: getPosition(token),
        })

        current++
        continue
      }

      if (token.type == TokenType.HTMLTag) {
        if (expression && children.length > 0) {
          expression.children = process(children, currentTab + 1) as ASTTagNode[]
          children = []
        }

        expression = {
          type: ASTNodeType.HtmlTag,
          name: token.value,
          token: getPosition(token),
        };

        siblingNodes.push(expression)
        current++
        continue
      }

      throw errorInLine(token, `Literal '${(token.value)}' is unknown`)
    }

    // For the last expression
    if (expression && children.length > 0)
      expression.children = process(children, currentTab + 1) as ASTTagNode[]


    return siblingNodes
  }

  delete component.tokens

  component.ast = {
    type: ASTNodeType.Program,
    children: process(tokens, 0),
  };

  // console.log(JSON.stringify(component.ast, null, 2));

  return component
}
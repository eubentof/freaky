import { inLineHtmlTags } from "./htmlTags/htmlTags.ts";
import { HtmlTagsAttributesHandlersMap } from "./htmlTags/htmlTagsAttributes.ts";
import { ASTHtmlTagAttributeValueNode, ASTNodeType, ASTProgramNode } from "./interfaces/ast.ts";
import { ASTNode } from "./interfaces/ast.ts";
import { ComponentNode } from "./utils/interfaces.ts";

const isInlineTag = (tag?: string) => tag && inLineHtmlTags.has(tag)


const attributesBulder = (attributes: ASTHtmlTagAttributeValueNode[]): string => attributes
  .map((node) => HtmlTagsAttributesHandlersMap[node.name].toString(node))
  .join(' ')

export function transformer(component: ComponentNode): any {

  if (!component.ast) return component

  component.template = ''

  if (!component.ast || component.ast.children.length == 0) return component

  function transformToHtml(ast: ASTProgramNode): string {
    function walkNode(node: ASTNode): string {

      let content = ''
      let attributes = ''

      if (node.type == ASTNodeType.HtmlTag) {
        if (node.attributes) attributes = ' ' + attributesBulder(node.attributes)

        if (isInlineTag(node.name)) return `<${node.name}${attributes}/>`

        if (node.children?.length) content = walkNodes(node.children)

        return `<${node.name}${attributes}>${content}</${node.name}>`
      }

      return content
    }

    function walkNodes(nodes: ASTNode[]): string {
      return nodes.map(node => walkNode(node)).join(' ')
    }

    return walkNodes(ast.children)
  }

  component.template = transformToHtml(component.ast);

  // console.log(component.template);

  return component;
}
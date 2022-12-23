import { attributeHandlers } from "./tagAttributeHandlers.ts";
import { Node, NodeAttributes, NodeType } from "./utils/parser.utils.ts";

export interface ComponentNode {
  template: string,
  file: string,
  name: string,
  type: NodeType,
  ast: Node
}

export function codeGenerator(componentAST: Node): ComponentNode {
  const component: ComponentNode = {
    template: '',
    file: '',
    name: '',
    type: NodeType.Component,
    ast: componentAST
  }

  const attributesBulder =
    (attributes: NodeAttributes): string => Object
      .entries(attributes)
      .map(([attr, value]) => {
        const handler = attributeHandlers[attr]
        return handler ? handler.toHtml(value) : ''
      })
      .join('')


  function tempalteBuilder(nodes: Node[]): string {
    return nodes.map(node => {
      if (node.type == NodeType.HTMLTag) {
        let content = ''
        let attributes = ''

        if (node.attributes) attributes = attributesBulder(node.attributes)

        if (node.props?.inline) return `<${node.name}${attributes}/>`

        if (node.children?.length) content = tempalteBuilder(node.children as Node[])

        return `<${node.name}${attributes}>${content}</${node.name}>`
      }
    }).join('')
  }

  if (componentAST.children) component.template = tempalteBuilder(componentAST.children as Node[]);

  return component
}
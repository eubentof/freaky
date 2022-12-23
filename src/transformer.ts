import { attributeHandlers, TagAttributeHandler, TagAttributeTransformer } from "./tagAttributeHandlers.ts";
import { FkAST } from "./parser.ts";
import { traverse } from "./trasverse.ts";
import { AttributeNode, Node, NodeType, TagNode } from "./utils/parser.utils.ts";

const isInlineTag = (tag?: string) => tag && ['input'].includes(tag)

export function transformer(tree: FkAST): any {

  const htmlAST: Node = {
    type: NodeType.Tempalte,
    name: '',
    children: []
  };

  traverse(tree, htmlAST, {
    [NodeType.HTMLTag]: (node: Node): Node => {
      const expression: Node = {
        type: NodeType.HTMLTag,
        name: node.name,
        children: []
      }

      if (isInlineTag(node.name)) {
        if (!expression.props) expression.props = {}
        expression.props.inline = true
      }

      return expression
    },

    [NodeType.HTMLAttribute]: (node: Node, parent: TagNode): void => {
      if (!parent.attributes) parent.attributes = {}

      const handler: TagAttributeHandler = attributeHandlers[node.name]

      if (!handler) throw `'${node.name}' is not a valid attribute. (line: ${node.token?.line}, col: ${node.token?.col})`

      if (node.children.length == 0) throw `There is a syntax error at ${node.token?.line} column ${node.token?.col}. '${node.name}' must a value.`

      handler.transform(node as AttributeNode, parent)
    }
  });

  return htmlAST;
}
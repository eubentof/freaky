import { FkAST } from "./parser.ts";
import { Node, TagNode } from "./utils/parser.utils.ts";

export type traverseTagNode = (node: Node) => TagNode;
export type traverseAttributeNode = (node: Node, parent: TagNode) => void;

type traverseMethod = traverseTagNode | traverseAttributeNode

export function traverse(ast: FkAST, root: Node, visitors: { [nodeType: string]: traverseMethod }): void {
  function walkNode(node: Node, parent: TagNode) {
    const method = visitors[node.type];

    if (!method) throw new Error(`Traverse not found for ${node.type}`)

    const expression: TagNode | void = method(node, parent);

    if (expression) {
      if (node.children) walkNodes(node.children as Node[], expression ?? parent)
      if (!parent.children) parent.children = []
      parent.children?.push(expression)
    }
  }

  function walkNodes(nodes: Node[], parent: TagNode) {
    nodes.forEach(node => walkNode(node, parent));
  }

  walkNodes(ast.body, root as TagNode);
}

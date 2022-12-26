import { ComponentNode, NodeType } from "./utils/interfaces.ts";

export function loadComponent(path: string): ComponentNode {

  const content = Deno.readTextFileSync(path).replaceAll(/([ ]*$)/gm, "") // Remove white space at the end of the line

  const name = path.split('/').pop()?.split('.')[0]

  if (!name) throw "Unable to load component"
  if (!content) console.warn(`Component ${name} is empty`);

  const component: ComponentNode = {
    type: NodeType.Component,
    content,
    path,
    name,
  }

  return component
}
import { pipeline } from 'https://deno.land/x/compose@1.0.0/index.js'

const filePath = Deno.args[0]

const fileContent = await Deno.readTextFile(filePath);

interface TokensTree<T> {
  imports?: any
  exports?: any
  components?: { [componentName: string]: T }
}
interface SegmentNode {
  segment: string
  childen?: SegmentNode[]
  isComponent?: boolean,
}

interface StreamNode {
  stream?: string
  exports?: string[]
  segments?: SegmentNode[]
  tokensTree?: TokensTree<ComponentToken>
}

enum ComponentType {
  Stateless = 'SL',
  Statefull = 'SF',
}
interface ComponentToken {
  name: string,
  interface: SegmentNode
  data?: SegmentNode[],
  type: ComponentType,
  componentRef?: string,
}

interface ComponentTokenBuild {
  name: string,
  type: ComponentType,
  interface: string,
  data?: SegmentNode[],
  componentRef?: string,
}

enum NodeType {
  COMPONENT = "component",
  EXPORT = "export",
  IMPORT = "import"
}

type StreamModifier = (node: StreamNode) => StreamNode | string

function removeComments(node: StreamNode): StreamNode {
  const streamWithoutComments = node?.stream?.replaceAll(/\/\*[\s\S]*?\*\/|([^:]|^)#.*$/gm, "");
  return { stream: streamWithoutComments?.trim() }
}

function buildSegmentNode(segments: string[], depth = 0): SegmentNode[] {

  let segmentNode: any = { segment: '', childen: [] }

  const nthDepthSegments: any = []
  segments.forEach(segment => {
    if (!segment) return

    if (segment.startsWith('  '.repeat(depth + 1))) return segmentNode.childen.push(segment)

    if (segment.startsWith('  '.repeat(depth))) {
      const segmentName = segment.trim()
      // const componentRef = segmentName.split('(')[0].trim()

      if (!segmentName) return

      if (segmentNode.segment) {
        nthDepthSegments.push(segmentNode)
        segmentNode = {
          segment: segmentName,
          childen: [],
        }
        // if (isComponent(segmentName)) segmentNode.componentRef = componentRef
        return
      }

      segmentNode.segment = segmentName
      // if (isComponent(segmentName)) segmentNode.componentRef = componentRef
    }
  })

  nthDepthSegments.push(segmentNode)

  nthDepthSegments.forEach((segmentedNode: any) => {
    if (segmentedNode.childen.length) segmentedNode.childen = buildSegmentNode(segmentedNode.childen, depth + 1)
    else delete segmentedNode.childen
  })

  return nthDepthSegments
}

function extractExports(stream: string): { exports: string[], words: string[] } {
  const streams = stream?.split('\n') ?? []

  const exports = []
  const words = []

  for (let i = 0; i < streams.length; i++) {
    const word = streams[i]
    if (word == '[export]') {
      const component = streams[i + 1].replace("%", "").replace(":", "")
      exports.push(component)
      continue
    }

    words.push(word)
  }

  return { exports, words }
}

function segmentContentByDepth({ stream }: StreamNode): StreamNode {

  if (!stream) return {}

  const { exports, words } = extractExports(stream)

  const segments = buildSegmentNode(words)

  return { stream, exports, segments }
}

function tokenizeComponents(name: string, segments: SegmentNode[]) {

  const component: ComponentToken = {
    type: name.startsWith("%") ? ComponentType.Stateless : ComponentType.Statefull,
    name: name.replace("%", "").replace(":", ""),
    interface: segments.pop() ?? { segment: 'ERROR' },
  }

  if (component.type == ComponentType.Statefull) component.data = segments

  return component
}

function isolateComponents({ segments, exports }: StreamNode): TokensTree<ComponentToken> {
  const tokensTree: TokensTree = { components: {}, exports }

  if (!segments) return tokensTree

  segments.forEach(({ segment, childen = [] }) => {
    switch (true) {
      case segment.startsWith('import'):
        tokensTree.imports = childen
        break
      // deno-lint-ignore no-case-declarations
      default:
        const component: ComponentToken = tokenizeComponents(segment, childen)
        if (!tokensTree.components) tokensTree.components = {}
        tokensTree.components[component.name] = component
    }
  })

  return tokensTree
}

type tagMapper = (tag: string) => { open: string, close?: string }
const openClose: tagMapper = (tag: string) => ({ open: `<${tag}>`, close: `</${tag}>` })
const openCloseInline: tagMapper = (tag: string) => ({ open: `<${tag}/>` })

const htmlMapper: { [tag: string]: tagMapper } = {
  div: openClose,
  section: openClose,
  label: openClose,
  span: openClose,
  input: openCloseInline,
}

function buildComponentSegment(node: SegmentNode): string {
  if (!node.segment) return ''

  const [head]: string[] = node.segment.match(/^([\w\-]+)/g) ?? []

  if (!head) return ''

  const mapper: tagMapper = htmlMapper[head]

  if (!mapper) return '' // TODO: verificar se é componente

  const htmlSnipet = mapper(head)

  let childrenSnipet = ''
  if (node.childen)
    childrenSnipet = node.childen.map(child => buildComponentSegment(child)).join('\n')
  return htmlSnipet.open + '\n' + childrenSnipet + (htmlSnipet.close ?? '') + '\n'
}

function buildComponentInterfaces(tree: TokensTree<ComponentToken>): TokensTree<ComponentTokenBuild> {
  const { components, exports, imports } = tree;

  if (!components) return { exports, imports }

  const finalTree: TokensTree<ComponentTokenBuild> = { exports, imports, components: {} }

  Object.entries(components).forEach(
    ([componentName, componentData]) => {
      const builtInterface = buildComponentSegment(componentData.interface)
      if (!finalTree.components) finalTree.components = {}
      finalTree.components[componentName] = { ...componentData, interface: builtInterface }
    })

  return finalTree
}

function buildHtml(tree: TokensTree<ComponentTokenBuild>): string {
  if (!tree) return ''

  const { components } = tree

  if (!components) return ''

  const appContent = Object.values(components).map(component => component.interface).join('')

  return `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
  </head>
  <body>
    ${appContent}
  </body>
  </html>
  `
}

const stream: StreamModifier = pipeline(
  removeComments,
  segmentContentByDepth,
  isolateComponents,
  buildComponentInterfaces,
  buildHtml,
)

// console.log(JSON.stringify(fileContent.replaceAll('  ', ' \t ')));

const html = stream({ stream: fileContent })
Deno.removeSync('dist', { recursive: true })
Deno.mkdirSync('dist')
Deno.writeTextFileSync('./dist/index.html', html as string)

// console.log(JSON.stringify(html, null, 2));
// console.log(sintaxTree);



import { pipeline } from 'https://deno.land/x/compose@1.0.0/index.js'

const fileContent = await Deno.readTextFile("./src/Container.fk");

interface TokensTree {
  imports?: any
  exports?: any
  components?: any[]
}
interface SegmentNode {
  segment: string
  childen?: SegmentNode[]
}

interface StreamNode {
  stream: string
  segments?: SegmentNode[]
  tokensTree?: TokensTree
}

enum ComponentType {
  StateLess = 'SL',
  StateFull = 'SF',
}
interface ComponentToken {
  name: string,
  interface: SegmentNode
  data?: SegmentNode[],
  type: ComponentType
}

enum NodeType {
  COMPONENT = "component",
  EXPORT = "export",
  IMPORT = "import"
}

type StreamModifier = (node: StreamNode) => StreamNode

function removeComments(node: StreamNode): StreamNode {
  const streamWithoutComments = node.stream.replaceAll(/\/\*[\s\S]*?\*\/|([^:]|^)#.*$/gm, "");
  return { stream: streamWithoutComments.trim() }
}

function buildSegmentNode(segments: string[], depth = 0): SegmentNode[] {

  let segmentNode: any = { segment: '', childen: [] }

  const nthDepthSegments: any = []
  segments.forEach(segment => {
    if (!segment) return

    if (segment.startsWith('  '.repeat(depth + 1))) return segmentNode.childen.push(segment)

    if (segment.startsWith('  '.repeat(depth))) {
      const segmentName = segment.trim()

      if (!segmentName) return

      if (segmentNode.segment) {
        nthDepthSegments.push(segmentNode)
        segmentNode = { segment: segmentName, childen: [] }
        return
      }

      segmentNode.segment = segmentName
    }
  })

  nthDepthSegments.push(segmentNode)

  nthDepthSegments.forEach((segmentedNode: any) => {
    if (segmentedNode.childen.length) segmentedNode.childen = buildSegmentNode(segmentedNode.childen, depth + 1)
    else delete segmentedNode.childen
  })

  return nthDepthSegments
}

function segmentContentByDepth({ stream }: StreamNode): StreamNode {

  const tabStream = stream.split('\n')

  const segments = buildSegmentNode(tabStream)

  return { stream, segments }
}

function tokenizeComponents(name: string, segments: SegmentNode[]) {

  const component: ComponentToken = {
    type: name.startsWith("%") ? ComponentType.StateLess : ComponentType.StateFull,
    name: name.replace("%", "").replace(":", ""),
    interface: segments.pop() ?? { segment: 'ERROR' },
  }

  if (component.type == ComponentType.StateFull) component.data = segments

  return component
}

function generateTokens({ segments, stream }: StreamNode): StreamNode {
  const tokensTree: TokensTree = { components: [] }

  if (!segments) return { stream }

  segments.forEach(({ segment, childen = [] }) => {
    switch (true) {
      case segment.startsWith('import'):
        tokensTree.imports = childen
        break
      case segment.startsWith('export'):
        tokensTree.exports = childen.map((node) => node.segment)
        break
      default:
        tokensTree.components?.push(tokenizeComponents(segment, childen))
    }
  })

  return { stream, tokensTree }
}

const stream: StreamModifier = pipeline(
  removeComments,
  segmentContentByDepth,
  generateTokens,
)

// console.log(JSON.stringify(fileContent.replaceAll('  ', ' \t ')));

const sintaxTree = stream({ stream: fileContent })

console.log(JSON.stringify(sintaxTree, null, 2));
// console.log(sintaxTree);


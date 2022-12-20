import { pipeline } from 'https://deno.land/x/compose@1.0.0/index.js'

const fileContent = await Deno.readTextFile("./src/Container.fk");

interface StreamNode {
  stream: string
  exports?: any[]
  segments?: any
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

function segmentContent({ stream }: StreamNode): StreamNode {

  const tabStream = stream.split('\n')

  const segments: string[][] = []
  let currSegment: string[] = []
  tabStream.forEach(word => {
    if (!word) return

    if (word.startsWith('  ')) return currSegment.push(word)

    if (currSegment.length) segments.push(currSegment)
    currSegment = []
    currSegment.push(word)
  })
  
  segments.push(currSegment)

  return { stream, segments }
}

const stream: StreamModifier = pipeline(
  removeComments,
  segmentContent,
)

console.log(JSON.stringify(fileContent.replaceAll('  ', ' \t ')));

const sintaxTree = stream({ stream: fileContent })

console.log(sintaxTree);


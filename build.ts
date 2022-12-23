import { pipeline } from 'https://deno.land/x/compose@1.0.0/index.js'
import { codeGenerator, ComponentNode } from './src/codeGenerator.ts';
import { parser } from './src/parser.ts';
import { tokenizer } from './src/tokenizer.ts';
import { transformer } from './src/transformer.ts';

const filePath = Deno.args[0]

let componentTemplateFile = await Deno.readTextFile(filePath);
componentTemplateFile = componentTemplateFile.replaceAll(/([ ]*$)/gm, "") // Remove white space at the end of the line

const componentName = filePath.split('/').pop()?.split('.')[0]

type FkTemplateCompiler = (fkTemplate: string) => ComponentNode
const compileComponent: FkTemplateCompiler = pipeline(
  tokenizer,
  parser,
  transformer,
  codeGenerator,
)

console.time('Build time')
const component: ComponentNode = compileComponent(componentTemplateFile)
console.timeEnd('Build time')

component.name = componentName ?? '';
component.file = componentTemplateFile;

// console.log(JSON.stringify(component, null, 2));

function buildPage(components: ComponentNode[]): string {
  const body = components.map(c => c.template).join()

  return `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta http-equiv="X-UA-Compatible" content="IE=edge"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>${componentName}</title></head><body>${body}</body></html>`
}

const html = buildPage([component])
Deno.removeSync('dist', { recursive: true })
Deno.mkdirSync('dist')
Deno.writeTextFileSync('./dist/index.html', html)
Deno.writeTextFileSync(`./dist/${componentName}.json`, JSON.stringify(component, null, 2))




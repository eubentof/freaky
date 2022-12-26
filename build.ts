import { pipeline } from 'https://deno.land/x/compose@1.0.0/index.js'
import { loadComponent } from './src/loadComponent.ts';
import { parser } from './src/parser.ts';
import { tokenizer } from './src/tokenizer.ts';
import { transformer } from './src/transformer.ts';
import { ComponentNode } from './src/utils/interfaces.ts';

export const filePath = Deno.args[0]

type FkTemplateCompiler = (path: string) => ComponentNode
const compileComponent: FkTemplateCompiler = pipeline(
  loadComponent,
  tokenizer,
  parser,
  transformer,
)

console.time('Build time')
const component: ComponentNode = compileComponent(filePath)
console.timeEnd('Build time')

// console.log(JSON.stringify(component, null, 2));

function buildPage(components: ComponentNode[]): string {
  const body = components.map(c => c.template).join()

  return `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta http-equiv="X-UA-Compatible" content="IE=edge"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>${component.name}</title></head><body>${body}</body></html>`
}

const html = buildPage([component])
Deno.removeSync('dist', { recursive: true })
Deno.mkdirSync('dist')
Deno.writeTextFileSync('./dist/index.html', html)
Deno.writeTextFileSync(`./dist/${component.name}.json`, JSON.stringify(component, null, 2))




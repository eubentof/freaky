import { pipeline } from 'https://deno.land/x/compose@1.0.0/index.js'
import { parser } from './src/parser.ts';
import { tokenizer } from './src/tokenizer.ts';

const filePath = Deno.args[0]

const fileContent = await Deno.readTextFile(filePath);

function transformer(input: any) { return input}

type FkTemplateCompiler = (fkTemplate: string) => string
const compiler: FkTemplateCompiler = pipeline(
  tokenizer,
  parser,
  transformer,
)

const html = compiler(fileContent)

console.log({ html });


// Deno.removeSync('dist', { recursive: true })
// Deno.mkdirSync('dist')
// Deno.writeTextFileSync('./dist/index.html', html)

// console.log(JSON.stringify(html, null, 2));
// console.log(sintaxTree);



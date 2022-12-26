import * as cheerio from "https://esm.sh/cheerio@1.0.0-rc.12";
// import { each } from "https://esm.sh/v100/cheerio@1.0.0-rc.12/lib/api/traversing";
// import * as language_codes from "./jsons/language_code.json" assert { type: "json" };

const IGNORE_CACHE = false


function getFileSync(filePath: string) {
  console.log('from local');

  return Deno.readTextFileSync(filePath);
}

function getJsonFileSync(filePath: string) {
  const content = Deno.readTextFileSync(filePath);
  if (content) return JSON.parse(content)
  return {}
}

const pagesCache = getJsonFileSync('./scrapping/cache.json')

const baseUrl = "https://developer.mozilla.org"


async function fetchPage(url: string) {
  const fileName = url.split('/').pop()
  const filePath = `./scrapping/pages/${fileName}.html`
  if (!IGNORE_CACHE && pagesCache[url]) return getFileSync(filePath)

  const fileContent = await fetch(url).then(r => r.text())
  pagesCache[url] = filePath
  Deno.writeTextFileSync(`./scrapping/pages/${fileName}.html`, fileContent)
  Deno.writeTextFileSync(`./scrapping/cache.json`, JSON.stringify(pagesCache, null, 2))

  return fileContent
}
const elementsPageContent = await fetchPage(`${baseUrl}/en-US/docs/Web/HTML/Element`)

interface HtmlTag {
  name: string,
  group: string | string[],
  description: string,
  href: string
}

function getTagsList(elementsPageContent: string): HtmlTag[] {
  const $ = cheerio.load(elementsPageContent)

  const tags_attibutes: HtmlTag[] = []

  $('.main-page-content > section').each((sectionIndex, sectionEl) => {
    const section = $(sectionEl);
    const group = section.get(0)?.attribs["aria-labelledby"] || ''
    const tableRowEls = $(section).find("table.standard-table > tbody > tr")

    tableRowEls.each((rowIndex, rowEl) => {
      const tagEl = $(($(rowEl).children('td').get(0)))
      const descEl = $(($(rowEl).children('td').get(1)))
      const name = ($(tagEl).text().match(/[a-z]+/) ?? [])[0]
      const href = tagEl.find('a').attr('href') || ''

      if (!name) return

      tags_attibutes.push({
        name,
        group,
        description: descEl.text(),
        href
      })
    })
  })

  return tags_attibutes
}

const htmlTags = getTagsList(elementsPageContent)


type ContentCategory = 'metadata' | 'flow' | 'sectioning' | 'heading' | 'phrasing' | 'embedded' | 'interactive' | 'palpable' | 'form-associated' | 'secondary_categories' | 'transparent_content_model' | 'script-supporting_elements'
//   name: string,
interface TagAttribute {
  name: string,
  description: string,
  group: string | string[]
  contentCategory?: ContentCategory[]
  contentCategoryText: string
  permitedContent?: ContentCategory
  permitedContentText: string
  tagOmission: boolean,
  permittedParentsText: string
  implicitARIARoleText: string
}
const tagsAttributes: { [tag: string]: TagAttribute } = {}


htmlTags.forEach(({ name, href, description, group }: HtmlTag) => {

});

// const attributesTypes: any = {
//   filename: {
//     name: 'filename',
//     type: 'string'
//   },
//   language_code: {
//     $ref: './language_codes'
//   },
// }



// interface Tag {
//   content_category: 'metadata' | 'flow' | 'sectioning' | 'heading' | 'phrasing' | 'embedded' | 'interactive' | 'palpable' | 'form-associated' | 'secondary_categories' | 'transparent_content_model' | 'script-supporting_elements'
//   name: string,
// }





Deno.writeTextFileSync(`./scrapping/dist/html_tags.json`, JSON.stringify(htmlTags, null, 2))

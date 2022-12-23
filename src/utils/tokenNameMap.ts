import { HtmlTags } from "../htmlTags/htmlTags.ts";
import { HtmlTagsAttributes } from "../htmlTags/htmlTagsAttributes.ts";
import { HtmlTagsAttributesUnities } from "../htmlTags/htmlTagsAttributesUnities.ts";

export const isTag = (tag: string) => HtmlTags[tag] !== undefined
export const isAttrubute = (attr: string) => HtmlTagsAttributes[attr] !== undefined
export const isUnity = (unity: string) => HtmlTagsAttributesUnities[unity] !== undefined
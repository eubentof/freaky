interface DataAttributeValues<T> { [name: string]: T }

type DataAttribute =
  & DataAttributeValues<string>
  & DataAttributeValues<number>
  & DataAttributeValues<string[]>
  & DataAttributeValues<DataAttributeValues<string>>

export interface HtmlTagAttibutes {
  id?: string,
  class?: string[],
  dataset: { [key: string]: DataAttribute }
} 
export type NonEmptyArray<T> = T[] & { 0: T }

export type PipelineOutput = {
  headers: (string | object)[]
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  items: Record<string, any>[]
}

type JSONType = null | boolean | number | string | object

export type JSONPathReturnObject = {
  parent: object | JSONType[]
  parentProperty: string
  path: string
  pointer: string
  value: JSONType | JSONType[]
}

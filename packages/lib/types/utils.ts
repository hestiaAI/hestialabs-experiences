export type NonEmptyArray<T> = T[] & { 0: T }

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type PipelineOutputItems = Record<string, any>[]

export type PipelineOutput = {
  headers: (string | object)[]
  items: PipelineOutputItems
}

export abstract class FileManager {
  abstract getPreprocessedTextFromId(id: string): Promise<string[]>
  abstract getCsvItemsFromId(id: string): Promise<PipelineOutput[]>
}

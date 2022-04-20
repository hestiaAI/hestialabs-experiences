type CustomPipelineOptions = object | object[]

type PipelineOutput = {
  headers: (string | object)[]
  items: object[]
}

export type ViewBlock = {
  customPipeline?(options: CustomPipelineOptions): PipelineOutput
  customPipelineOptions?: CustomPipelineOptions
  files?: string[]
  key: string
  postprocessor?(input: PipelineOutput): PipelineOutput
  showTable?: boolean
  sql?: string
  text: string
  title: string
  visualization?: string
  vizProps?: object
}

const defaultViewBlock: Partial<ViewBlock> = {
  postprocessor: (input: PipelineOutput) => input,
  showTable: false
}

export function createViewBlock(viewBlock: ViewBlock) {
  // merge with default options
  return {
    ...defaultViewBlock,
    ...viewBlock
  }
}

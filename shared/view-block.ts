type CustomPipelineOptions = {
  fileManager: object
  parameter: string
  options: object
}

type PipelineOutput = {
  headers: Array<string | object>
  items: Array<object>
}

export type ViewBlock = {
  customPipeline?(options: CustomPipelineOptions): PipelineOutput
  customPipelineOptions?: object
  key: string
  postprocessor?(input: PipelineOutput): PipelineOutput
  query?: string
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

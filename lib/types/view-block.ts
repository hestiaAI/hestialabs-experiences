type CustomPipelineOptions = object | object[]

export type PipelineOutput = {
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

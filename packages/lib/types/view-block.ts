type CustomPipelineOptions = object | object[]

import type { FileManager, PipelineOutput } from './utils'
export type PostprocessorFunction = (input: PipelineOutput) => PipelineOutput
export type CustomPipeline = (params: {
  fileManager: FileManager
  options?: CustomPipelineOptions
}) => Promise<PipelineOutput | { rawCsv: string; config: object }>

/**
 * The options that configure an experience tab
 */
export type ViewBlock = {
  id: string
  title: string
  text: string
  image?: string
  overlay?: string | boolean
  showTable?: boolean

  /**
   * The following attributes are highly dependent on
   * each other and on the particular experience.
   * You probably don't want to change them.
   */
  files?: string[]
  customPipeline?: string | CustomPipeline
  customPipelineOptions?: CustomPipelineOptions
  postprocessor?: string | PostprocessorFunction
  sql?: string
  visualization?: string | object
  /**
   * This is the configuration for the visualization.
   * In some cases it can be huge, for example when it includes
   * a whole kepler configuration.
   */
  vizProps?: object
}

export type ViewBlocks = ViewBlock[]

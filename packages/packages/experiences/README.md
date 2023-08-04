# Experience packages

These packages define experiences that can be displayed by the project [data-experience](../../../data-experience/README.md)

## Importing

An experience can be imported from npm in node, as in data-experience's [development example](https://github.com/hestiaAI/hestialabs-experiences/blob/master/data-experience/dev/App.vue#L39)

```javascript
import appleTracker from '@hestia.ai/apple-tracker'
```

or from cdns like jsdelivr.com or unpkg.com in the browser, as in this data-experience [deployment example](https://github.com/hestiaAI/hestialabs-experiences/blob/master/data-experience/deployment-examples/html-plain/index.js#L2)

```javascript
import experience from 'https://cdn.jsdelivr.net/npm/@hestia.ai/twitter-agg/dist/index.mjs'
```

## Configuration with viewer options

An experience can be configured with **viewer options**.

### All the possible attributes

The exact type of _ViewerOptions_ and its attributes are defined in the [types folder](../../lib/types)

[experience-options.ts](../../lib/types/experience-options.ts)

```typescript
export type ViewerOptions = {
  title: string
  version?: number
  hideEmptyTabs?: boolean
  hideFileExplorer?: boolean
  hideSummary?: boolean
  icon?: string
  messages?: Messages
  subtitle?: string
  dataPortal?: string
  dataPortalHtml?: string
  dataPortalMessage?: string
  dataSamples?: string[]
  tutorialVideos?: string[]
  url?: string
  viewBlocks: ViewBlock[]
  collaborator?: Collaborator
}

export type Messages = Record<
  Lang,
  {
    viewBlocks: {
      [key: string]: object
    }
    [key: string]: object
  }
>

export type Collaborator = {
  icon: string
  title: string
  url: string
}
```

[view-block.ts](../../lib/types/view-block.ts)

```typescript
export type ViewBlock = {
  customPipeline?: string | CustomPipeline
  customPipelineOptions?: CustomPipelineOptions
  files?: string[]
  id: string
  image?: string
  overlay?: string | boolean
  postprocessor?: string | PostprocessorFunction
  showTable?: boolean
  sql?: string
  text: string
  title: string
  visualization?: string | object
  vizProps?: object
}
```

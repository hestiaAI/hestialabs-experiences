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

An experience can be configured with **viewer options** that can be taken from a json file. When imported, it is already configured by the default *-viewer.json* file in its *src* folder, for example [instagram-viewer.json](instagram/src/instagram-viewer.json)

When defining a new configuration, it's best to start from a default configuration and modify it, as a lot of them have experience specific attributes.

### All the possible attributes

The exact type of _ViewerOptions_ and its attributes are defined in the [types folder](../../lib/types)

[experience-options.ts](../../lib/types/experience-options.ts)

```typescript
export type ViewerOptions = {

  /**
   * The viewblocks that define the different tabs of an experience.
   * See the ViewBlock type further down to see the possible attributes.
   **/
  viewBlocks: ViewBlock[]

  /** Monolingual texts.
   * They are meant to be replaced with multilingual texts
   * specified in the messages attribute.
   * However some parts of our code
   * (Probably the ViewBlocks in SectionViewer.vue,
   *  and possibly the list of experiences in _experience/index.vue)
   * don't use messages yet.
   */
  title: string
  subtitle?: string
  dataPortal?: string
  dataPortalHtml?: string
  dataPortalMessage?: string

  /**
   * The translations contain multilingual messages
   * that are specific to the experience.
   * Some of them should override the monolingual attributes above,
   * for example dataPortal would be overridden by
   * messages.en.dataPortal in english and
   * messages.fr.dataPortal in french.
   */
  messages?: Messages

  /** */
  version?: number

  /** Display options */
  hideEmptyTabs?: boolean
  hideFileExplorer?: boolean
  hideSummary?: boolean

  /** Link to an icon, typically a company logo */
  icon?: string

  /** Array of links to samples of the data to be analyzed in the experience*/
  dataSamples?: string[]
  /** Array of links to videos, on vimeo for example */
  tutorialVideos?: string[]
  /** (Apparently an alternative url for placeholder experiences without real content) */
  url?: string
  /** See the Collaborator type below*/
  collaborator?: Collaborator


}

/**
 * The multilingual messages.
 * A few replace the monolingual messages,
 * but there are also messages specific to
 * the experience, viewblocks and their charts.
 * See the default configuration to have an idea
 * of what texts you can change.
 **/
export type Messages = Record<
  Lang,
  {
    viewBlocks: {
      [key: string]: object
    }
    [key: string]: object
  }
>

/** Another organization we're working with, like eyeballs or dating privacy */
export type Collaborator = {
  icon: string
  title: string
  url: string
}
```

[view-block.ts](../../lib/types/view-block.ts)

```typescript
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
```

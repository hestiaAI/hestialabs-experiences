// to run this script
// node --experimental-specifier-resolution node --loader ts-node/esm ./migrate-viewer.ts
import { Experience } from './lib/'
import { writeFileSync, mkdirSync, readFileSync, existsSync } from 'fs'
import * as packages from './packages'

import camelCase from 'lodash/camelCase'
import isEqual from 'lodash/isEqual'
import { PostprocessorFunction, ViewBlock, ViewerOptions } from './lib/types'
import { ViewerFunctions } from './lib/types/experience-options'
import { CustomPipeline } from './lib/types/view-block'
const outputDir = 'viewer-opts'
const iconUrlPrefix =
  'https://raw.githubusercontent.com/hestiaAI/hestialabs-experiences/master/packages/lib/icons'

function migrate(
  [name, experience]: [name: string, experience: Experience],
  doWriteFiles = false
): void {
  const {
    // loaderOptions: { files, disabled, databaseConfig },
    viewerOptions,
    viewerFunctions
    // viewerOptions: { viewBlocks, url }
  } = experience
  const srcPath = `packages/experiences/${experience.name}/src`
  const viewerOptionsFileName = `${experience.name}-viewer.json`
  const migratedViewerOptsPath = `${srcPath}/${viewerOptionsFileName}`
  if (existsSync(migratedViewerOptsPath)) {
    console.log(`[${experience.name}] DONE: ${migratedViewerOptsPath}`)
    return
  }
  viewerOptions.viewBlocks.forEach(vb =>
    unpopulateViewerOptions(vb, viewerFunctions)
  )
  const unserializable = diffWithSerialized(viewerOptions)
  const migratable = !unserializable
  if (!migratable) {
    console.log(`[${experience.name}] BAD ${formatDiff(unserializable)}`)
    // console.log(JSON.stringify(unserializable, stringifyReplacer, 2))
    if (doWriteFiles) {
      createViewFunctions(experience.name)
    }
  } else {
    console.log(`[${experience.name}] OK`)
    // migrateViewBlocks(experience.name)
    if (doWriteFiles) {
      const fixedVOs = fixViewerOptions(viewerOptions, experience.name, 1)
      const almostMigratedVOptsPath = migratedViewerOptsPath + '.mig.json'
      writeFileSync(almostMigratedVOptsPath, JSON.stringify(fixedVOs, null, 2))
      console.log(`[${experience.name}] OK wrote ${almostMigratedVOptsPath}`)
      const testVOPath = `../data-experience/public/${viewerOptionsFileName}`
      // fixedVOs.version = 0
      writeFileSync(testVOPath, JSON.stringify(fixedVOs, null, 2))
      console.log(` wrote ${testVOPath}`)
      migrateIndexTs(experience.name)
      migratePackageJson(experience.name, viewerOptionsFileName)
    }
  }
}

function unpopulateViewerOptions(
  viewBlock: ViewBlock,
  viewerFunctions: ViewerFunctions
) {
  const postprocessor = viewBlock.postprocessor as PostprocessorFunction
  if (viewerFunctions.postprocessors) {
    const poproEntries = Object.entries(viewerFunctions.postprocessors)
    const poproName = poproEntries.find(([_, f]) => f === postprocessor)?.[0]
    if (poproName) {
      viewBlock.postprocessor = poproName
    }
  }
  const customPipeline = viewBlock.customPipeline as CustomPipeline
  if (viewerFunctions.customPipelines) {
    const cupiEntries = Object.entries(viewerFunctions.customPipelines)
    const cupiName = cupiEntries.find(([_, f]) => f === customPipeline)?.[0]
    if (cupiName) {
      viewBlock.customPipeline = cupiName
    }
  }
}

function fixViewerOptions(
  viewerOptions: ViewerOptions,
  experienceName: string,
  version: number
) {
  viewerOptions.viewBlocks.forEach(replaceSqlLineEndings)
  viewerOptions.version = version
  const iconFile = experienceIcons[experienceName]
  viewerOptions.icon = `${iconUrlPrefix}/${iconFile}`
  return viewerOptions
}

function insertViewerFunctionsIntoIndexTs(experienceName: string) {
  const filePath = `packages/experiences/${experienceName}/src/index.ts`
  replaceRegexesInFile(filePath, [
    [
      /^import \{ Experience, ExperienceOptions \} from '@\/index'.*/g,
      `import viewerFunctions from './viewer-functions'\n$&`
    ],
    [
      /export default new Experience\(options, options, packageJSON, import.meta.url/,
      `// eslint-disable-next-line prettier/prettier
$&, viewerFunctions`
    ]
  ])
}
function writeViewerFunctions(
  experienceName: string,
  imports: string[],
  postProcessorLines: string[][],
  customPipelineLines: string[][]
) {
  const filePath = `packages/experiences/${experienceName}/src/viewer-functions.ts`
  const cLF = customPipelineLines.length ? '\n' : ''
  const pLF = postProcessorLines.length ? '\n' : ''
  const content = `${imports.join('\n')}
const viewerFunctions = {
  postprocessors: {${pLF}${postProcessorLines
    .map(([n, v]) => `    ${n}: ${v}`)
    .join(',\n')}${pLF ? pLF + '  ' : pLF}},
  customPipelines: {${cLF}${customPipelineLines
    .map(([n, v]) => `    ${n}: ${v}`)
    .join(',\n')}${cLF ? cLF + '  ' : cLF}}
}

export default viewerFunctions
`
  writeFileSync(filePath, content)
  console.log('wrote', filePath)
}

function migratePackageJson(
  experienceName: string,
  viewerOptionsFileName: string
) {
  const filePath = `packages/experiences/${experienceName}/package.json`
  replaceRegexesInFile(filePath, [
    [/^( +)"dist" *$/g, `$&,\n$1"src/${viewerOptionsFileName}"`]
  ])
}

function viewerOptionRegexes(): [RegExp, string][] {
  return [
    'title',
    'version',
    'hideEmptyTabs',
    'hideFileExplorer',
    'hideSummary',
    'icon',
    'messages',
    'subtitle',
    'dataPortal',
    'dataPortalHtml',
    'dataPortalMessage',
    'dataSamples',
    'tutorialVideos',
    'url',
    'viewBlocks',
    'collaborator'
  ].map(opt => [new RegExp(`^ +${opt}(,? *|:.*)$`), ''])
}

function migrateIndexTs(experienceName: string) {
  const filePath = `packages/experiences/${experienceName}/src/index.ts`
  replaceRegexesInFile(filePath, [
    ...viewerOptionRegexes(),
    [
      /^import \{ Experience, ExperienceOptions \} from '@\/index'/g,
      `import { Experience, LoaderOptions, ViewerOptions } from '@/index'
import viewerOptions from './${experienceName}-viewer.json'`
    ],
    [/^import \{ .* \} from '@\/pipelines\/generic'/, ''],
    [/^import messages from/, ''],
    [/^import dataSample from/, ''],
    [/^import viewBlocks from '.\/blocks'/, ''],
    [/^import icon from.*$/, ''],
    [/^( *) {2}('[^']+'[^:']*)$/, '$1// $2'],
    [
      /const options: ExperienceOptions = \{/,
      `const loaderOptions: LoaderOptions = {
  viewerVersion: 1,`
    ],
    [/\/\/ eslint-disable-next-line prettier\/prettier/, ''],
    [
      /export default new Experience\(options, options, packageJSON, import.meta.url[^,]*$/,
      `export default new Experience(
  loaderOptions,
  viewerOptions as ViewerOptions,
  packageJSON,
  import.meta.url
)`
    ],
    [
      /^export default new Experience\(options, options, packageJSON, import.meta.url, viewerFunctions\)$/,
      `export default new Experience(
  loaderOptions,
  viewerOptions as ViewerOptions,
  packageJSON,
  import.meta.url,
  viewerFunctions
)`
    ]
  ])
}

function createViewFunctions(experienceName: string) {
  const filePath = `packages/experiences/${experienceName}/src/blocks.ts`
  const originalContent = readFileSync(filePath, 'utf8')
  const lines = originalContent.split(/\r?\n/)

  const pipelineImportRegex = /import.*pipelines\/custom/
  const pipelineImports = lines.filter(l => pipelineImportRegex.test(l))
  const customPipelineLines = lines.filter(l => /^ +customPipeline/.test(l))
  console.log('customPipeline lines:\n', customPipelineLines)
  const pipelineNames = customPipelineLines
    .map(l => [
      l
        .replace(
          /^ *customPipeline: ?customPipeline[^(]+CSV\('([^']+)[^,]+.*/,
          'csv_$1'
        )
        .replace(/-/g, '_'),
      l.replace(
        /^ *customPipeline: ?(customPipeline[^(]+CSV\('[^']+[^,]+).*/,
        '$1'
      )
    ])
    // map the lines that aren't calling a function
    .map(([l, n]) => [
      l.replace(/^ *customPipeline: ?([^,' ]+)[^']*$/, '$1'),
      n.replace(/^ *customPipeline: ?([^,' ]+)[^']*$/, '$1')
    ])
  console.log('customPipeline names:\n', pipelineNames)
  const pipelineRegexes = pipelineNames.map(([name, def]) => [
    new RegExp('customPipeline: ?' + def.replace(/([()])/g, '\\$1')),
    `customPipeline: '${name}'`
  ]) as [RegExp, string][]
  console.log('customPipeline regexes:\n', pipelineRegexes)

  const poproImportRegex = /import.*\/postprocessors/
  const poproImports = lines.filter(l => poproImportRegex.test(l))
  console.log('postProcessor imports:\n', poproImports)
  const poproLines = lines.filter(l => /^ +postprocessor/.test(l))
  console.log('postProcessor lines:\n', poproLines)
  const poproNames = poproLines.map(l => [
    l.replace(/^ *postprocessor: ?([^, ]+).*/, '$1'),
    l.replace(/^ *postprocessor: ?([^, ]+).*/, '$1')
  ])
  console.log('postProcessor names:\n', poproNames)
  const poproRegexes = poproNames.map(([name, def]) => [
    new RegExp(`postprocessor: *${def}`),
    `postprocessor: '${name}'`
  ]) as [RegExp, string][]
  console.log('postProcessor regexes:\n', poproRegexes)

  replaceRegexesInFile(filePath, [
    [poproImportRegex, ''],
    [pipelineImportRegex, ''],
    ...pipelineRegexes,
    ...poproRegexes
  ])

  writeViewerFunctions(
    experienceName,
    pipelineImports.concat(poproImports),
    poproNames,
    pipelineNames
  )
  insertViewerFunctionsIntoIndexTs(experienceName)
}

function replaceRegexesInFile(fileName: string, regexes: [RegExp, string][]) {
  const originalContent = readFileSync(fileName, 'utf8')
  const result = replaceRegexesInString(originalContent, regexes)
  const extension = fileName.split('.').pop()
  const newFileName = `${fileName}.mig.${extension}`
  writeFileSync(newFileName, result)
  console.log('wrote', newFileName)
}

function replaceRegexesInString(
  originalContent: string,
  regexes: [RegExp, string][]
) {
  const lines = originalContent.split(/\r?\n/)
  const replaced = lines
    .map(line => {
      const found = regexes.filter(([regex]) => regex.test(line))
      const uniqueReplacements = new Set(found.map(f => f[1]))
      if (uniqueReplacements.size == 1) {
        const [regex, replacement] = found[0]
        // console.log(`matched ${line}`)
        return replacement ? line.replace(regex, replacement) : undefined
      } else if (uniqueReplacements.size > 1) {
        throw new Error(
          `Found more than one matches with same replacement on line: ${line}`
        )
      }
      return line
    })
    .filter(l => l !== undefined)
  return replaced.join('\n')
}

function formatDiff(diff: any) {
  const { viewBlocks } = diff
  if (!viewBlocks) {
    return ''
  }
  return Object.keys(viewBlocks)
    .map(k => {
      const b = viewBlocks[k]
      return `${k}${b.customPipeline ? 'c' : ''}${b.postprocessor ? 'p' : ''}`
    })
    .join(' ')
}

function replaceSqlLineEndings(viewBlock: ViewBlock) {
  if (viewBlock.sql) {
    viewBlock.sql = viewBlock.sql.replace(/\r\n */g, ' ')
  }
}

function saveUberDriverKeplerConfigs(viewerOptions: ViewerOptions) {
  const keplerFileNames = [
    'kepler_config_heatmap',
    'kepler_config_onlineOffline',
    'kepler_config_restriction',
    'kepler_config_points'
  ]
  let kfindex = 0
  viewerOptions.viewBlocks.forEach(viewBlock => {
    const vizProps: any | undefined = viewBlock.vizProps
    if (vizProps?.keplerConfig) {
      console.log(viewBlock.id, keplerFileNames[kfindex])
      const config = vizProps.keplerConfig
      mkdirSync(outputDir, { recursive: true } as any)
      const fileName = `${outputDir}/${keplerFileNames[kfindex]}.json`
      writeFileSync(fileName, JSON.stringify(vizProps.keplerConfig))
      console.log('wrote', fileName)
      kfindex++
    }
  })
}

function diffObjects(
  obj1: Record<string, any>,
  obj2: Record<string, any>
): Record<string, any> {
  const differences: Record<string, any> = {}
  // Iterate through the keys in the first object
  for (const key in obj1) {
    // Check if the key exists in the second object
    if (key in obj2) {
      // Compare the values
      const val1 = obj1[key]
      const val2 = obj2[key]
      if (!isEqual(val1, val2)) {
        const difference = diffObjects(val1, val2)
        // console.log('value different for key', key)
        differences[key] = difference
        // differences[key] = 'value changed'
      }
    } else {
      differences[key] = 'missing'
    }
  }

  // Check for keys in the second object that are not in the first object
  for (const key in obj2) {
    if (!(key in obj1)) {
      differences[key] = 'appeared'
    }
  }

  return differences
}

const stringifyReplacer = (_: any, value: any) => {
  if (typeof value === 'function') {
    return `function ${value.name}: ${value.toString().substr(0, 80)}`
  } else if (value === undefined) {
    return 'undefined'
  }
  return value
}

function diffWithSerialized(object: any) {
  const deundefined = removeUndefinedKeys(object)
  const parstringified = JSON.parse(JSON.stringify(object))
  const equal = isEqual(deundefined, parstringified)
  if (!equal) {
    const diff = diffObjects(deundefined, parstringified)
    return diff
  }
  return undefined
}

function removeUndefinedKeys(object: any) {
  if (object) {
    Object.keys(object).forEach(key => {
      const val = object[key]
      if (val === undefined) {
        delete object[key]
      } else if (typeof val === 'object') {
        removeUndefinedKeys(val)
      }
    })
  }
  return object
}

// Change this typescript code so that it doesn't produce this error
// Argument of type 'Buffer' is not assignable to parameter of type 'string'. (lsp)
const experienceIconsBuf = readFileSync('./experience-icons.json')
const experienceIcons = JSON.parse(experienceIconsBuf.toString())
mkdirSync(outputDir, { recursive: true } as any)

if (process.argv.length > 2) {
  // test one or more packages
  const names: string[] = process.argv.slice(2)
  names.map(camelCase).forEach(name => {
    // we expect the name to be camelCased
    const module = (packages as { [key: string]: Experience })[name]
    if (module) {
      migrate([name, module], true)
    } else {
      throw new Error(`The name "${name}" does not match any package.`)
    }
  })
} else {
  // test all packages
  Object.entries(packages).forEach(p => migrate(p))
}

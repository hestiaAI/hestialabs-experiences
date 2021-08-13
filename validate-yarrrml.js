/* eslint no-console: "off" */
const { readdir, readFile } = require('fs').promises
const { resolve } = require('path')
const YarrrmlParser = require('@rmlio/yarrrml-parser/lib/rml-generator.js')

async function getFiles(dir) {
  // get all files in directory (recursive)
  const dirents = await readdir(dir, { withFileTypes: true })
  const files = await Promise.all(
    dirents.map(dirent => {
      const res = resolve(dir, dirent.name)
      return dirent.isDirectory() ? getFiles(res) : res
    })
  )
  return Array.prototype.concat(...files)
}

;(async () => {
  // Validate YARRRML files by parsing with yarrrml-parser
  const y2r = new YarrrmlParser()
  console.log('Validating YARRRRML files')

  const files = await getFiles('./manifests/experiences')
  const ymlFiles = files.filter(f => f.endsWith('yml') || f.endsWith('yaml'))

  ymlFiles.forEach(async f => {
    try {
      console.log(`Reading ${f}`)
      const yarrrml = await readFile(f, 'utf-8')
      console.log(`Parsing ${f}`)
      y2r.convert(yarrrml)
      console.log(`Parsed successfully!`)
    } catch (err) {
      console.error(`Error parsing YARRRML: ${f}`)
      console.error(err)
    }
  })
})()

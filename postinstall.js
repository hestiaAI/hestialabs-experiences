if (process.env.NETLIFY) {
  const { spawnSync } = require('child_process')
  const path = require('path')

  const configName = process.env.CONFIG_NAME || 'config'

  const { experiences } = require(path.resolve(
    __dirname,
    `config/${configName}.json`
  ))

  if (experiences) {
    const packages = experiences.map(
      packageNameAndTag => `@hestiaai/${packageNameAndTag}`
    )
    console.info(`
Installing the following packages from GitHub Package Registry:
${packages.join('\n')}`)
    spawnSync('npm', ['install', ...packages], { shell: true })
  }
}

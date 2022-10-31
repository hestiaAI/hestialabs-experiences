const { resolve } = require('path')
const { readdirSync } = require('fs')

const { CONFIG_NAME = 'dev', CIRCLECI, NODE_ENV } = process.env

const experiences = CIRCLECI
  ? readdirSync(resolve(__dirname, 'pipeline-tests/__tests__')) // experiences required for tests
  : require(resolve(__dirname, `config/${CONFIG_NAME}.json`)).experiences

function handleSpawnOutput({ status, stderr, stdout, error }) {
  if (status) {
    console.error(new Error(`Unexpected error (status ${status})`))
    if (stderr) {
      console.error(stderr.toString('utf8'))
    }
    if (error) {
      console.error(error.toString())
    }
  } else if (stdout) {
    console.info(stdout.toString('utf8'))
  }
}

if (experiences) {
  if (NODE_ENV === 'production' || CIRCLECI) {
    const { spawnSync } = require('child_process')
    // const { spawnSync, execSync } = require('child_process')
    // const npmrcPath = resolve(__dirname, '.npmrc')
    // const cmd = `echo "//npm.pkg.github.com/:_authToken=$\{HESTIA_OWNER_GITHUB_TOKEN}" >> ${npmrcPath}`
    // execSync(cmd)
    const packages = experiences.map(
      packageNameAndTag => `@hestia.ai/${packageNameAndTag}`
    )
    console.info(
      'Installing packages from the npm public registry...\n' +
      packages.join('\n')
    )
    handleSpawnOutput(spawnSync('npm', ['install', ...packages]))
  } else {
    // cross-platform spawn
    const spawn = require('cross-spawn')
    const packages = experiences.map((packageNameAndTag) => {
      const [name] = packageNameAndTag.split('@')
      return `@hestia.ai/${name}`
    })
    console.info(
      'Linking packages...\n' +
      packages.join('\n')
    )
    handleSpawnOutput(spawn.sync('npm', ['link', ...packages]))
  }
}

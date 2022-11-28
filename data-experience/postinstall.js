const { resolve } = require('path')
const { readdirSync } = require('fs')

const { CIRCLECI } = process.env

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

if (CIRCLECI) {
  // experiences required for tests
  const experiences = readdirSync(resolve(__dirname, 'src/__tests__'))

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
  // experiences required for dev
  const experiences = readdirSync(resolve(__dirname, '../packages/packages/experiences'))
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

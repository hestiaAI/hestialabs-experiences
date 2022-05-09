const { resolve } = require('path')

const { CONFIG_NAME = 'dev' } = process.env

const { experiences } = require(resolve(
  __dirname,
  `config/${CONFIG_NAME}.json`
))

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
  if (process.env.NODE_ENV === 'production') {
    const { spawnSync, execSync } = require('child_process')
    const npmrcPath = resolve(__dirname, '.npmrc')
    const cmd = `echo "//npm.pkg.github.com/:_authToken=$\{HESTIA_OWNER_GITHUB_TOKEN}" >> ${npmrcPath}`
    execSync(cmd)
    const packages = experiences.map(
      packageNameAndTag => `@hestiaai/${packageNameAndTag}`
    )
    console.info(
      'Installing packages from the GitHub Package Registry...\n' +
        packages.join('\n')
    )
    handleSpawnOutput(spawnSync('npm', ['install', ...packages]))
  } else {
    // cross-platform spawn
    const spawn = require('cross-spawn')
    const packages = experiences.map(packageNameAndTag => {
      const [name] = packageNameAndTag.split('@')
      return `@hestiaai/${name}`
    })
    console.info(
      'Linking packages from the hestialabs repository...\n' +
        packages.join('\n')
    )
    handleSpawnOutput(spawn.sync('npm', ['link', ...packages]))
  }
}

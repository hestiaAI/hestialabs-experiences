import { ESLint } from 'eslint'

// https://github.com/okonet/lint-staged#how-can-i-ignore-files-from-eslintignore
const removeIgnoredFiles = async(files) => {
  const eslint = new ESLint()
  const isIgnored = await Promise.all(
    files.map((file) => {
      return eslint.isPathIgnored(file)
    })
  )
  const filteredFiles = files.filter((_, i) => !isIgnored[i])
  if (filteredFiles.length) {
    console.info(`[lint-staged] Linting the following files:\n${filteredFiles.join('\n')}`)
  }
  return filteredFiles.join(' ')
}

export default {
  '**/*.{js,vue}': async(filenames) => {
    // only lint changed files
    const filesToLint = await removeIgnoredFiles(filenames)
    if (!filesToLint) {
      return 'exit'
    }
    return `npm run lint -- --fix ${filesToLint}`
  },
  '**/*.{json,md}': async(filenames) => {
    // only format changed files
    const filesToLint = await removeIgnoredFiles(filenames)
    if (!filesToLint) {
      return 'exit'
    }
    return `prettier --write ${filesToLint}`
  }
}

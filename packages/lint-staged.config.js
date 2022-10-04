import lodash from 'lodash'
const { camelCase } = lodash

export default {
  'packages/*/src/**/*.ts': filenames => {
    const packages = filenames
      .map(filename => /packages\/packages\/([^/]+)\//.exec(filename)[1])
      .map(camelCase)
    // need to build before testing
    return ['npm run build', `npm run test:ts-node -- ${packages.join(' ')}`]
  },
  '*.ts': filenames =>
    // only lint changed files
    `npm run lint -- --fix ${filenames.join(' ')}`,
  '*.{md,json,eslintrc,prettierrc}': filenames =>
    // only format changed files
    `prettier --write ${filenames.join(' ')}`,
  '*.sql': filenames =>
    filenames.map(
      filename =>
        `sql-formatter ${filename} --output ${filename} --config ./sql-formatter.config.json`
    )
}

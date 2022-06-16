export default {
  '*.ts': filenames =>
    // only lint changed files
    `eslint --ext .ts --fix ${filenames.join(' ')}`,
  '*.{md,json,eslintrc,prettierrc}': filenames =>
    // only format changed files
    `prettier --write ${filenames.join(' ')}`,
  '*.sql': filenames =>
    filenames.map(
      filename =>
        `sql-formatter ${filename} --output ${filename} --config ./sql-formatter.config.json`
    )
}

export default {
  '*.ts': filenames =>
    // only lint changed files
    `eslint --ext .ts --fix ${filenames.join(' ')}`,
  '*.md': filenames =>
    // only format changed files
    `prettier --write ${filenames.join(' ')}`
}

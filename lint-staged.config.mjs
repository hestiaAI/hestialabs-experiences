export default {
  '**/*.{js,vue}': filenames =>
    // only lint changed files
    `npm run lint -- --fix ${filenames.join(' ')}`,
  '{json,md}': filenames =>
    // only format changed files
    `prettier --write ${filenames.join(' ')}`
}

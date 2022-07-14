if (process.env.NODE_ENV !== 'production') {
  const out = require('child_process').execSync('cd ../ && husky install ./.husky')
  console.info(out.toString('utf8'))
}

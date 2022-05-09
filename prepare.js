if (process.env.NODE_ENV !== 'production') {
  const out = require('child_process').execSync('husky install')
  console.info(out.toString('utf8'))
}

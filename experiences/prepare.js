if (process.env.NODE_ENV !== 'production') {
  // const out = require('child_process').execSync('husky install')
  const out = require('child_process').execSync('cd ../ && husky install ./experiences/.husky')
  console.info(out.toString('utf8'))
}

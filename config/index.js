const reqConfig = require.context('./', false, /^\.\/config.json$/)

const config = reqConfig(reqConfig.keys()[0])

export default config

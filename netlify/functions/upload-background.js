// Background functions can run up to 15 minutes
// while normal functions that are limited to 10 seconds
// They're only available in paid plans
// https://docs.netlify.com/functions/background-functions/
const { handler } = require('./upload.js')
exports.handler = handler

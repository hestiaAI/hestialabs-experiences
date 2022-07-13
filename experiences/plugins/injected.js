export default ({ app }, inject) => {
  inject('url', (route) => {
    const { baseUrl } = process.env
    if (route) {
      // use route when provided
      // (needs to be provided when reactivity is required)
      return baseUrl + route.path
    }
    // otherwise, use router instance from app context
    return baseUrl + app.router.currentRoute.path
  })
}

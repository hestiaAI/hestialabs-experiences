// https://stackoverflow.com/a/63341004/8238129
export default ({ app, $auth }) => {
  $auth.onRedirect((to, from) => {
    return app.localePath(to)
  })
}

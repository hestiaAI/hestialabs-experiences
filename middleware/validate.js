export default function({ from, redirect, route, params: { key }, store }) {
  if (
    key &&
    (!from || from.path !== route.path) &&
    !store.getters.keys.includes(key)
  ) {
    return redirect('/not-found')
  }
}

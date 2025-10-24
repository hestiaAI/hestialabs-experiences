const apiURL = 'https://serverless.hestia.ai/.netlify/functions/'

export async function loginDashboard(username, password) {
  const request = apiURL + 'loginDashboard?' + new URLSearchParams({
    username,
    password
  })
  const response = await fetch(request)

  if (response.status !== 200) {
    const text = await response.text()
    throw new Error(`Le serveur à retourner le code d'erreur ${response.status} : ${text}`)
  }
  const json = await response.json()
  return json
}

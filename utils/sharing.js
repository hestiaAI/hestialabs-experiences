export function personalizeRDF(username, rdf) {
  const usernameEncoded = encodeURIComponent(username)
  rdf += `<http://schema.org/Person/${usernameEncoded}> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://schema.org/Person> .\n`
  rdf += `<http://schema.org/Person/${usernameEncoded}> <http://schema.org/name> "${username}" .\n`
  console.log(username)
  return rdf
}

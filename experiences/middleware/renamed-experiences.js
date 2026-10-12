// Experiences that were renamed: old slug -> new slug.
// Old links (/experience/<old>, /space/<bubble>/experience/<old>) keep working.
export const renamedExperiences = {
  babysits: 'yoojo'
}

export default function({ route, redirect }) {
  const renamed = renamedExperiences[route.params.experience]
  if (renamed) {
    const path = route.path.replace(
      new RegExp(`/experience/${route.params.experience}(?=/|$)`),
      `/experience/${renamed}`
    )
    redirect(301, { path, query: route.query, hash: route.hash })
  }
}

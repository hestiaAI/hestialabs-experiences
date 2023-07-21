// `key` has the format <name> or <name>@<version>
const matchExperienceName = (nameAndTagSource, nameAndTagTarget) => nameAndTagSource.match(new RegExp(`^${nameAndTagTarget}(?:$|@)`))

async function addExperience(store, key) {
  if (!(key in store.state.experiences)) {
    const url = `https://cdn.jsdelivr.net/npm/@hestia.ai/${key}`
    const experience = await import(/* webpackIgnore: true */ url)
    store.commit('addExperience', { key, value: experience.default })
  }
}

export default async({ store, params: { bubble, experience } }) => {
  if (bubble) {
    const bubbleConfig = store.state.config.bubbleConfig[bubble]
    if (experience) {
      const packageNameAndTag = bubbleConfig.experiences.find(
        nameAndTag => matchExperienceName(nameAndTag, experience)
      )
      await addExperience(store, packageNameAndTag)
    } else {
      for (const packageNameAndTag of bubbleConfig.experiences) {
        await addExperience(store, packageNameAndTag)
      }
    }
  }
}

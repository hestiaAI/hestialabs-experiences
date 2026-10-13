import { bubbleKey } from 'data-experience/src/utils/bubble-api'

// `key` has the format <name> or <name>@<version>
const matchExperienceName = (nameAndTagSource, nameAndTagTarget) => nameAndTagSource.match(new RegExp(`^${nameAndTagTarget}(?:$|@)`))

async function addExperience(store, key) {
  if (!(key in store.state.experiences)) {
    const url = `https://cdn.jsdelivr.net/npm/@hestia.ai/${key}`
    const experience = await import(/* webpackIgnore: true */ url)
    store.commit('addExperience', { key, value: experience.default })
  }
}

export default async({ store, error, params: { bubble, experience } }) => {
  if (bubble) {
    // Bubble configs other than the home page's are fetched on first visit
    const bubbleConfig = await store.dispatch('ensureBubbleConfig', bubble)
    if (!bubbleConfig) {
      if (store.state.config.bubbles?.some(b => bubbleKey(b, process.env.apiUrl) === bubble)) {
        error({ statusCode: 503, message: 'This data space is unavailable right now. Please try again later.' })
      }
      // unknown bubbles are left to the page's validate(), which shows "not found"
      return
    }
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

import { merge } from 'lodash-es'

export const state = () => ({
  loaded: false,
  config: {},
  experiences: []
})

export const getters = {
  enabledExperiences(state) {
    return state.experiences.filter(
      ({ slug, disabled }) => !disabled && slug !== 'other'
    )
  },
  disabledExperiences(state, getters) {
    const disabledExperiences = state.experiences.filter(
      ({ slug }) => !getters.enabledExperiences.find(e => e.slug === slug)
    )
    // Add 'other' to the end of the Array
    const otherIdx = disabledExperiences.findIndex(
      ({ slug }) => slug === 'other'
    )
    const [other] = disabledExperiences.splice(otherIdx, 1)
    if (other) {
      disabledExperiences.push(other)
    }
    return disabledExperiences
  },
  routeConfig:
    state =>
      (route) => {
        const bubble = route?.params?.bubble
        return bubble ? state.config.bubbleConfig[bubble] : state.config
      },
  // https://vuex.vuejs.org/guide/getters.html#method-style-access
  experience:
    state =>
      ({ params: { experience } }) =>
        state.experiences.find(e => e.slug === experience) || {}
}

export const mutations = {
  setLoaded(state) {
    state.loaded = true
  },
  setConfig(state, config) {
    state.config = config
  },
  setExperiences(state, experiences) {
    state.experiences = experiences
  }
}

export const actions = {
  async loadConfig({ commit, state }, { isDev, $axios }) {
    if (!state.loaded) {
      let configOverride = {}
      try {
        const confResp = await fetch('/config.json')
        configOverride = await confResp.json()
      } catch {
        if (!isDev) {
          console.info('configOverride not found')
        }
      }

      const configDefault = (await import(`@/config/${process.env.configName}.json`))
        .default

      const config = merge(configDefault, configOverride)

      if (!isDev) {
        // For debugging in production environment
        console.info('### SITE CONFIG ###')
        console.info(config)
      }

      if (config.bubbles?.length) {
        config.bubbleConfig = {}
        for (const bubble of config.bubbles) {
          try {
            const data = await this.$api.getConfig(bubble)
            if (data) {
              config.bubbleConfig[bubble] = data
            }
          } catch (error) {
            console.error(error)
            if (error.message === 'Network Error') {
              // avoid multiple API calls if there is a network error
              // for instance, when the server is off during development
              break
            }
          }
        }
      }
      commit('setConfig', config)
    }
  },
  async loadExperiences({ commit, state }) {
    if (!state.loaded) {
      const experiences = (
        await Promise.all(
          state.config.experiences.map((packageNameAndTag) => {
            // We need to explicitly import dist (dist/index.mjs)
            // and not just `@hestiaai/${name}`
            // since dynamic imports are not resolved by webpack
            // during the build step
            const [name] = packageNameAndTag.split('@')
            return import(`@hestiaai/${name}/dist`)
          })
        )
      ).map((module) => {
        const { name, version, options } = module.default
        return {
          slug: name,
          version,
          ...options
        }
      })

      commit('setExperiences', experiences)
    }
  }
}

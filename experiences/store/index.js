import { set } from 'vue'

import { merge } from 'lodash-es'
import BubbleAPI, { bubbleKey } from 'data-experience/src/utils/bubble-api'

import { mapTranslationObject } from '@/utils/directusHelpers'

export const state = () => ({
  loaded: false,
  config: {},
  uploads: {},
  experiences: {},
  pages: {}
})

export const getters = {
  experiencesArray: state => Object.entries(state.experiences).map(([nameAndTag, { config }]) => ({ nameAndTag, ...config })),
  experiencesEnabled: (state, getters) =>
    getters.experiencesArray.filter(({ slug, disabled }) => !disabled && slug !== 'other'),
  experiencesDisabled: (state, getters) => {
    const experiencesDisabled = getters.experiencesArray.filter(({ slug }) => !getters.experiencesEnabled.find(e => e.slug === slug))
    // Add 'other' to the end of the Array
    const otherIdx = experiencesDisabled.findIndex(
      ({ slug }) => slug === 'other'
    )
    const [other] = experiencesDisabled.splice(otherIdx, 1)
    if (other) {
      experiencesDisabled.push(other)
    }
    return experiencesDisabled
  },
  // https://vuex.vuejs.org/guide/getters.html#method-style-access
  experience:
    (state, getters) =>
      ({ params: { experience, bubble } }) => {
        if (!experience) {
          return
        }
        const bubbleConfig = bubble ? state.config.bubbleConfig[bubble] : undefined
        const nameAndTag = getters['xp/experienceNameAndTagFromConfig'](
          { name: experience },
          state.config,
          bubbleConfig
        )
        return state.experiences[nameAndTag]
      }
}

export const mutations = {
  setPage(state, { key, value }) {
    set(state.pages, key, value)
  },
  setLoaded(state) {
    state.loaded = true
  },
  setUploads(state, config) {
    state.uploads = config
  },
  setConfig(state, config) {
    state.config = config
  },
  setBubbleConfig(state, { key, value }) {
    set(state.config.bubbleConfig, key, value)
  },
  setExperiences(state, experiences) {
    state.experiences = experiences
  },
  addExperience(state, { key, value }) {
    set(state.experiences, key, value)
  }
}

function bubbleAPI() {
  return new BubbleAPI(process.env.apiUrl)
}

export const actions = {
  // Fetch a bubble's config the first time one of its pages is opened.
  // `key` is the route parameter: a bubble name, or name@host for other servers.
  // Returns the config, or undefined if the bubble is unknown or unavailable.
  async ensureBubbleConfig({ commit, state }, key) {
    const { bubbles = [], bubbleConfig = {} } = state.config
    if (bubbleConfig[key]) {
      return bubbleConfig[key]
    }
    const bubble = bubbles.find(b => bubbleKey(b, process.env.apiUrl) === key)
    if (!bubble) {
      return undefined
    }
    try {
      const data = await bubbleAPI().getConfig(bubble)
      if (data) {
        commit('setBubbleConfig', { key, value: data })
      }
      return data
    } catch (error) {
      console.error(error)
      return undefined
    }
  },
  async loadPage({ commit, state }, { pageId }) {
    if (pageId in state.pages) { return }

    try {
      const pagesData = await this.$directus.items('websites').readByQuery({
        fields: ['*', 'url_name', 'pages.Page_id.*', 'pages.Page_id.content.Content_id.*', 'pages.Page_id.content.Content_id.datasets.dataset_id.*', 'pages.Page_id.content.Content_id.view.view_id.*', 'pages.Page_id.content.Content_id.translations.*', 'pages.Page_id.content.Content_id.related_pages.*.url_name', 'pages.Page_id.translations.*', 'pages.Page_id.content.Content_id.view.view_id.experience_id.*', 'pages.Page_id.content.Content_id.view.view_id.experience.*'],
        filter: {
          url: {
            _eq: 'digipower.academy'
          }
        }
      })

      // Take first page with digipower.academy as website and current id as url_name, should always be unique
      const page = pagesData.data[0].pages.filter(p => p.Page_id.url_name === pageId)[0].Page_id

      const content = page.content.map((c) => {
        return {
          related_pages: c.Content_id.related_pages.map(p => p.Page_id.url_name),
          translations: mapTranslationObject(c.Content_id.translations),
          datasets: c.Content_id.datasets?.map(d => d.dataset_id) || [],
          views: c.Content_id.view?.map(d => d.view_id) || []
        }
      })

      commit('setPage', {
        key: pageId,
        value: {
          ...page,
          translations: mapTranslationObject(page.translations),
          content
        }
      })
    } catch (err) {
      console.error(err)
      commit('setPage', { key: pageId, value: null })
    }
  },
  async loadUploads({ commit, state }) {
    if (!state.loaded) {
      const config = (await import('@/config/uploads-config.json')).default
      commit('setUploads', config)
    }
  },
  async loadConfig({ commit, state }, { isDev }) {
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
        // Only the bubbles shown on the home page are needed to render it;
        // the others are fetched when their page is opened (ensureBubbleConfig).
        // Fetch them in parallel: one slow or failing server must not hold up the rest.
        config.bubbleConfig = {}
        const homePage = new Set(config.homePageBubbles || [])
        const results = await Promise.allSettled(
          config.bubbles
            .filter(bubble => homePage.has(bubble))
            .map(async bubble => [bubble, await bubbleAPI().getConfig(bubble)])
        )
        for (const result of results) {
          if (result.status === 'rejected') {
            console.error(result.reason)
          } else if (result.value[1]) {
            const [bubble, data] = result.value
            // a name on the default server, or a URL (https://<server>/bubbles/<name>)
            config.bubbleConfig[bubbleKey(bubble, process.env.apiUrl)] = data
          }
        }
        // homePageBubbles may also use URLs; match them by key
        config.homePageBubbles = (config.homePageBubbles || []).map(
          bubble => bubbleKey(bubble, process.env.apiUrl)
        )
      }
      commit('setConfig', config)
    }
  },
  async loadExperiences({ commit, state }) {
    const viewerOptionsRef = state.config.experienceViewerOptions
    if (!state.loaded) {
      const experiences = (
        await Promise.all(
          state.config.experiences.map(async(packageNameAndTag) => {
            // We need to explicitly import dist (dist/index.mjs)
            // and not just `@hestia.ai/${name}`
            // since dynamic imports are not resolved by webpack
            // during the build step
            const [name] = packageNameAndTag.split('@')
            return [
              packageNameAndTag,
              await import(`@hestia.ai/${name}/dist`)
            ]
          }).map(async(nameExpPromise) => {
            const [packageNameAndTag, module] = await nameExpPromise
            let experience = module.default
            const viewerOptions =
                  await experience.provideViewerOptions(viewerOptionsRef)
            const error = experience.viewerCompatibilityErrors(viewerOptions)
            if (viewerOptions && error) {
              console.error(error)
            }
            if (viewerOptions && !error) {
              experience = experience.configureViewer(viewerOptions)
            }
            return [
              // It is problematic to have '.' in a key,
              // notably for i18n messages
              packageNameAndTag.replace(/[@.]/g, '_'),
              experience
            ]
          })
        )
      )
      // cheap trick to prevent the viewer options
      // from being reloaded inside data-experience
      commit('setExperiences', Object.fromEntries(experiences))
      const newConfig = { ...state.config, experienceViewerOptions: undefined }
      commit('setConfig', newConfig)
    }
  }
}

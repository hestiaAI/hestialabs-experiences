<template>
  <VContainer>
    <VCard class="pa-2" flat>
      <VCardTitle class="text-h5 font-weight-bold justify-center mb-3">
        {{ $t('experience.intro.title') }}
      </VCardTitle>
      <VCardText>
        <VRow>
          <VCol align="center">
            <p v-if="$route.params.experience === 'explorer'" class="body-1">
              Explore the structure and contents of any file.
            </p>
            <!-- eslint-disable vue/no-v-html -->
            <p
              v-else-if="$te(k('dataPortalHtml'))"
              class="body-1"
              v-html="$t(k('dataPortalHtml'))"
            />
            <p v-else class="body-1">
              <template v-if="dataPortal">
                <a
                  :href="dataPortal"
                  target="_blank"
                  rel="noreferrer noopener"
                >Click here</a>
                to request
              </template>
              <template v-else>
                Request
              </template>
              the private data that {{ title }} collected on you. Once you
              receive it, analyze it here.
            </p>
            <!-- eslint-disable vue/no-v-html -->
            <p
              v-if="$te(k('dataPortalMessage'))"
              class="body-1"
              v-html="$t(k('dataPortalMessage'))"
            />
            <!-- eslint-enable vue/no-v-html -->
            <p>
              Unless explicitly consented in the "Share My Data" tab, no data is
              transmitted to HestiaLabs or anyone else. The whole experience
              takes place locally in the browser and nothing is left behind as
              soon as you close the tab.
            </p>
          </VCol>
        </VRow>
        <VRow>
          <VCol align="center">
            <UnitFiles
              v-bind="{
                progress,
                success,
                error,
                message
              }"
              ref="unit-files"
              @update="onUnitFilesUpdate"
            />
          </VCol>
        </VRow>
      </VCardText>
    </VCard>
    <VCard v-if="tutorialVideos.length" flat>
      <VCardTitle class="text-h5 font-weight-bold justify-center">
        Tutorial{{ tutorialVideos.length > 1 ? 's' : '' }}
      </VCardTitle>
      <VCardText>
        <VCarousel
          height="100%"
          hide-delimiter-background
          :hide-delimiters="tutorialVideos.length === 1"
          :show-arrows="tutorialVideos.length > 1"
          delimiter-icon="$vuetify.icons.mdiMinus"
          light
        >
          <VCarouselItem
            v-for="(tutorialVideo, idx) in tutorialVideos"
            :key="idx"
          >
            <VRow align="center" justify="center">
              <BaseVideo :video-src="tutorialVideo" :height="videoHeight" />
            </VRow>
          </VCarouselItem>
        </VCarousel>
      </VCardText>
    </VCard>
  </VContainer>
</template>

<script>
import { pick } from 'lodash-es'

export default {
  props: {
    success: {
      type: Boolean,
      default: false
    },
    error: {
      type: Boolean,
      default: false
    },
    progress: {
      type: Boolean,
      default: false
    },
    message: {
      type: String,
      default: ''
    }
  },
  data() {
    const experience = this.$store.getters.experience(this.$route)
    const properties = pick(experience, [
      'title',
      'dataPortal',
      'dataPortalHtml',
      'dataPortalMessage',
      'tutorialVideos'
    ])

    return {
      videoHeight: '400',
      ...properties
    }
  },
  created() {
    const experience = this.$store.getters.experience(this.$route)
    // TODO come up with a way to specify i18n messages in experiences
    // const locale = this.$i18n.locale
    const defaultMessagesForLocale = pick(experience, [
      'title',
      'dataPortal',
      'dataPortalHtml',
      'dataPortalMessage'
    ])
    this.i18nMergeComponentMessages(
      defaultMessagesForLocale,
      k => this.i18nMakeGlobalKey(k),
      m => this.i18nWrapInGlobalNamespace(m),
      this.$i18n
    )
  },
  methods: {
    /**
     * Wrap a local, experience-specific, key-value object into a format
     * that can be merged into vue-18n's global dictionary.
     */
    i18nWrapInGlobalNamespace(messages) {
      return {
        experiences: { [this.experienceName()]: { info: messages } }
      }
    },
    /** Convert a local, experience-specific key to a vue-i18n key. */
    // Implement this on each component with experience specific i18n
    i18nMakeGlobalKey(localKey) {
      return `experiences.${this.experienceName()}.intro.${localKey}`
    },
    /** Convenient alias for use in templates. */
    // Implement this on each component with experience specific i18n.
    k(localKey) {
      return this.i18nMakeGlobalKey(localKey)
    },
    /**
     * Merge local, experience-specific, default messages
     * into vue-i18n's global dictionary
     */
    // move this function somewhere central
    // it's meant to be used in every component
    // with experience-specific messages
    i18nMergeComponentMessages(
      defaultMessagesForCurrentLocale,
      i18nMakeGlobalKey,
      i18nWrapInGlobalNamespace,
      i18n) {
      // keep keys without an existing translation
      const keysUsingDefaults =
      Object.keys(defaultMessagesForCurrentLocale).filter((key) => {
        const i18nKey = i18nMakeGlobalKey(key)
        return !i18n.te(i18nKey)
      })
      // build messages
      const componentMessages = {}
      keysUsingDefaults.forEach((key) => {
        const defaultMessage = defaultMessagesForCurrentLocale[key]
        if (defaultMessage) {
          componentMessages[key] = defaultMessage
        }
      })
      // merge the messages into vue-i18n's global dictionary
      const mergeableMs = i18nWrapInGlobalNamespace(componentMessages)
      const locale = i18n.locale
      this.$i18n.mergeLocaleMessage(locale, mergeableMs)
    },
    experienceName() {
      return this.$route.params.experience
    },
    onUnitFilesUpdate({ uppyFiles }) {
      this.$emit('update', { uppyFiles })
    }
  }
}
</script>

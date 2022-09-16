<template>
  <VContainer>
    <VCard class="pa-2" flat>
      <VCardTitle class="text-h5 font-weight-bold justify-center mb-3">
        {{ $t('load-data.title') }}
      </VCardTitle>
      <VCardText>
        <VRow>
          <VCol align="center">
            <!-- eslint-disable vue/no-v-html -->
            <p
              v-if="$te(k('dataPortalHtml'))"
              class="body-1"
              v-html="$t(k('dataPortalHtml'))"
            />
            <p v-else-if="$te(k('dataPortal'))" class="body-1">
              <ExternalLink
                :href="dataPortal"
              >
                {{ $t('load-data.link-text') }}
              </ExternalLink>
              {{ $t('load-data.text') }}
            </p>
            <p v-else class="body-1">
              {{ $t("load-data.text-default") }}
            </p>
            <!-- eslint-disable vue/no-v-html -->
            <p
              v-if="$te(k('dataPortalMessage'))"
              class="body-1"
              v-html="$t(k('dataPortalMessage'))"
            />
            <!-- eslint-enable vue/no-v-html -->
            <p>
              {{ $t('load-data.disclaimer') }}
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
        {{ $t('load-data.tutorial-title') }}{{ tutorialVideos.length > 1 ? 's' : '' }}
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
import UnitFiles from './files/UnitFiles.vue'
export default {
  components: { UnitFiles },
  props: {
    slug: {
      type: String,
      required: true
    },
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
    const experience = this.$store.state.dataexp.config

    console.log('UnitIntro', this.$store.state)
    const properties = pick(experience, [
      'title',
      'dataPortal',
      'dataPortalHtml',
      'dataPortalMessage',
      'tutorialVideos'
    ])

    return {
      videoHeight: '400',
      experienceName: this.$route.params.experience,
      ...properties
    }
  },
  methods: {
    onUnitFilesUpdate({ uppyFiles }) {
      this.$emit('update', { uppyFiles })
    },
    k(localKey) {
      return `experiences.${this.slug}.intro.${localKey}`
    }
  }
}
</script>

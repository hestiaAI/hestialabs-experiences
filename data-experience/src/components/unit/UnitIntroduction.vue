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
              v-if="$te(k('dataPortalHtml')) || dataPortalHtml"
              class="body-1"
              v-html="$tev(k('dataPortalHtml'), dataPortalHtml)"
            />
            <p v-else-if="$te(k('dataPortal')) || dataPortal" class="body-1">
              <!-- localized link -->
              <ExternalLink
                :href="$tev(k('dataPortal'), dataPortal)"
              >
                {{ $t('load-data.link-text') }}
              </ExternalLink>
              {{ $t('load-data.text') }}
            </p>
            <p v-else class="body-1">
              {{ $t("load-data.text-default") }}
            </p>
            <p
              class="body-1"
              v-html="$tev(k('dataPortalMessage'), dataPortalMessage || '')"
            />
            <!-- eslint-enable vue/no-v-html -->
            <p class="disclaimer">
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
              <BaseVideo :video-src="tutorialVideo" :height="videoHeight || '400'" />
            </VRow>
          </VCarouselItem>
        </VCarousel>
      </VCardText>
    </VCard>
  </VContainer>
</template>

<script>
import { mapState, mapGetters } from '@/utils/store-helper'

import BaseVideo from '@/components/base/BaseVideo.vue'
import ExternalLink from '@/components/misc/ExternalLink.vue'
import UnitFiles from '@/components/unit/files/UnitFiles.vue'

const experienceProps = [
  'dataPortal',
  'dataPortalHtml',
  'dataPortalMessage',
  'tutorialVideos',
  'videoHeight',
  'slug'
]

export default {
  name: 'UnitIntroduction',
  components: { UnitFiles, ExternalLink, BaseVideo },
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
  computed: {
    ...mapState(
      Object.fromEntries(
        experienceProps.map(k => [k, state => state.experienceConfig[k]])
      )
    ),
    ...mapGetters(['experienceNameAndTag'])
  },
  methods: {
    onUnitFilesUpdate({ uppyFiles }) {
      this.$emit('update', { uppyFiles })
    },
    k(key) {
      const nameAndTag = this.experienceNameAndTag
      return `experiences.${nameAndTag}.intro.${key}`
    }
  }
}
</script>

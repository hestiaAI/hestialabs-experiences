<template>
  <VContainer>
    <VCard class="pa-2" flat>
      <VCardTitle class="text-h5 font-weight-bold justify-center mb-3">
        Analyze your private data
      </VCardTitle>
      <VCardText>
        <VRow>
          <VCol align="center">
            <p v-if="$route.params.experience === 'explorer'" class="body-1">
              Explore the structure and contents of any file.
            </p>
            <!-- eslint-disable vue/no-v-html -->
            <p
              v-else-if="dataPortalHtml"
              class="body-1"
              v-html="dataPortalHtml"
            ></p>
            <p v-else class="body-1">
              <template v-if="dataPortal">
                <a :href="dataPortal" target="_blank" rel="noreferrer noopener"
                  >Click here</a
                >
                to request
              </template>
              <template v-else> Request </template>
              the private data that {{ title }} collected on you. Once you
              receive it, analyze it here.
            </p>
            <!-- eslint-disable vue/no-v-html -->
            <p
              v-if="dataPortalMessage"
              class="body-1"
              v-html="dataPortalMessage"
            ></p>
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
import { pick } from 'lodash'

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
  methods: {
    onUnitFilesUpdate({ uppyFiles }) {
      this.$emit('update', { uppyFiles })
    }
  }
}
</script>

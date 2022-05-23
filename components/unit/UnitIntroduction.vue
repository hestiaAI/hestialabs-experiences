<template>
  <VContainer>
    <VCard class="pa-2" flat>
      <VCardTitle class="text-h5 font-weight-bold justify-center mb-3">
        Analyze your private data
      </VCardTitle>
      <VCardText>
        <VRow>
          <VCol align="center">
            <p v-if="$route.params.key === 'explorer'" class="body-1">
              Explore the structure and contents of any file.
            </p>
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
              the private data that {{ companyName }} collected on you. Once you
              receive it, analyze it here.
            </p>
            <p
              v-if="dataPortalMessage"
              class="body-1"
              v-html="dataPortalMessage"
            ></p>
            <p>
              No data is transmitted to HestiaLabs or anyone else. The whole
              experience takes place locally in the browser and nothing is left
              behind as soon as you close the tab.
            </p>
          </VCol>
        </VRow>
        <VRow>
          <VCol align="center">
            <UnitFiles
              v-bind="{
                files,
                samples,
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
import BaseVideo from '../base/BaseVideo.vue'
export default {
  components: { BaseVideo },
  props: {
    companyName: {
      type: String,
      required: true
    },
    dataPortal: {
      type: String,
      default: ''
    },
    dataPortalHtml: {
      type: String,
      default: ''
    },
    dataPortalMessage: {
      type: String,
      default: ''
    },
    tutorialVideos: {
      type: Array,
      default: () => []
    },
    files: {
      type: Object,
      required: true
    },
    samples: {
      type: Array,
      default: () => []
    },
    success: {
      type: Boolean,
      default: () => false
    },
    error: {
      type: Boolean,
      default: () => false
    },
    progress: {
      type: Boolean,
      default: () => false
    },
    message: {
      type: String,
      default: () => ''
    }
  },
  data() {
    return {
      videoHeight: '400'
    }
  },
  methods: {
    onUnitFilesUpdate({ uppyFiles }) {
      this.$emit('update', { uppyFiles })
    }
  }
}
</script>

<template>
  <VContainer>
    <VCard class="pa-2" flat>
      <VCardTitle class="text-h5 font-weight-bold justify-center">
        Analyze your private data
      </VCardTitle>
      <VCardText>
        <VRow>
          <VCol>
            <p v-if="$route.params.key === 'explorer'" class="body-1">
              Explore the structure and contents of any file.
            </p>
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
            <p>
              No data is transmitted to HestiaLabs or anyone else. The whole
              experience takes place locally in the browser and nothing is left
              behind as soon as you close the tab.
            </p>
          </VCol>
        </VRow>
        <VRow>
          <VCol>
            <UnitFiles
              v-bind="{
                files,
                samples
              }"
              ref="unit-files"
              @update="onUnitFilesUpdate"
            />
            <template v-if="progress">
              <BaseProgressCircular class="mr-2" />
              <span>Processing files...</span>
            </template>
            <template v-else-if="error || success">
              <BaseAlert
                :type="error ? 'error' : 'success'"
                border="left"
                dense
                text
                >{{ message }}
              </BaseAlert>
            </template>
          </VCol>
        </VRow>
      </VCardText>
    </VCard>
    <VCard class="" flat>
      <VCardTitle class="text-h5 font-weight-bold justify-center">
        Tutorial{{ tutorialVideos.length > 1 ? 's' : '' }}
      </VCardTitle>
      <VCardText>
        <BaseVideo
          v-for="(tutorialVideo, idx) in tutorialVideos"
          :key="`video_${idx}`"
          :video-src="tutorialVideo"
        />
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
  methods: {
    onUnitFilesUpdate({ uppyFiles }) {
      this.$emit('update', { uppyFiles })
    }
  }
}
</script>

<template>
  <VContainer>
    <VCard class="pa-2" flat>
      <VCardTitle class="text-h5 font-weight-bold justify-center mb-3">
        Explore the data of multiple participant
      </VCardTitle>
      <VCardText>
        <VRow>
          <VCol align="center">
            <p v-if="$route.params.experience === 'explorer'" class="body-1">
              Explore the data of multiple participant
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
          </VCol>
        </VRow>
        <VRow>
          <VCol align="center">
            <VCard height="500">
              <VCardTitle>Current</VCardTitle>
              <VCardText>
                <VListItemGroup
                  v-model="selectedFiles"
                  multiple
                  :prepend-icon="file.icon"
                >
                  <VListItem v-for="file in fileItems" :key="file.filename">
                    <template #default="{ active }">
                      <VListItemAction>
                        <VCheckbox
                          :input-value="active"
                          color="primary"
                        ></VCheckbox>
                      </VListItemAction>

                      <VListItemContent>
                        <VListItemTitle>{{ file.filename }}</VListItemTitle>
                        <VListItemSubtitle>{{ file.date }}</VListItemSubtitle>
                      </VListItemContent>
                    </template>
                  </VListItem>
                </VListItemGroup>
              </VCardText>
            </VCard>
          </VCol>
        </VRow>
      </VCardText>
    </VCard>
  </VContainer>
</template>

<script>
import { pick } from 'lodash'
import { filetype2icon, extension2filetype } from '@/utils/file-manager'
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
    const experienceProps = pick(experience, [
      'title',
      'dataPortal',
      'dataPortalHtml',
      'dataPortalMessage',
      'tutorialVideos'
    ])
    const bubbleConfig = this.$store.getters.config(this.$route)
    const bubbleProps = pick(bubbleConfig, ['dataFromBubble'])
    return {
      apiError: null,
      apiLoading: false,
      filenames: [],
      fileItems: [],
      selectedFiles: [],
      ...experienceProps,
      ...bubbleProps
    }
  },
  watch: {
    fileNames(newValue, oldValue) {
      const newFilenames = newValue.filter(file => !oldValue.includes(file))
      newFilenames.forEach(filename => {
        const extension = filename.match(/\.([\S]+)/)?.[1]
        const type = extension2filetype[extension] ?? 'folder'
        const icon = filetype2icon[type] || '$vuetify.icons.mdiFile'
        this.fileItems.push({
          filename,
          icon,
          date: new Date()
        })
      })
    }
  },
  mounted() {
    this.fetchData()
  },
  methods: {
    async fetchData() {
      this.apiError = null
      this.apiLoading = true
      try {
        const resp = await fetch(
          `${process.env.apiUrl}/bubbles/${this.dataFromBubble}/files`,
          {
            method: 'GET'
          }
        )
        this.apiLoading = false
        const response = await resp.json()
        if (!resp.ok) {
          this.apiError = response
        } else {
          this.files = response
        }
      } catch (e) {
        this.apiError = e
        console.error(e)
      }
    },
    onUnitFilesUpdate({ uppyFiles }) {
      this.$emit('update', { uppyFiles })
    }
  }
}
</script>

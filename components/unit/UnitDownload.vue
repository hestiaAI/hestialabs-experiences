<template>
  <VContainer>
    <VCard class="pa-2" flat>
      <VCardTitle class="text-h5 font-weight-bold justify-center mb-3">
        Explore the data from multiple participants
      </VCardTitle>
      <VCardText>
        <VRow>
          <VCol align="center">
            <p v-if="$route.params.experience === 'explorer'" class="body-1">
              Explore the data from multiple participants
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
            <VCard height="500" class="d-flex flex-column">
              <VCardTitle class="mb-2">
                <span class="caption"
                  >{{ nbSelected }} out of {{ nbFiles }} selected</span
                >
                <VBtn icon color="primary" class="mr-2" @click="fetchFilenames">
                  <VIcon>$vuetify.icon.mdiCached</VIcon>
                </VBtn>
                <BaseButton
                  outlined
                  small
                  color="primary"
                  min-width="120"
                  @click="selectAll"
                >
                  {{ allSelected ? 'un' : '' }}select All</BaseButton
                >
              </VCardTitle>
              <VCardText>
                <span v-if="!nbFiles">
                  No files retrieved on the server yet</span
                >
                <VListItemGroup v-else v-model="selectedFiles" multiple>
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

                      <VIcon> {{ file.icon }} </VIcon>
                    </template>
                  </VListItem>
                </VListItemGroup>
              </VCardText>
              <VSpacer></VSpacer>
              <VCardActions class="align-center justify-center">
                <div v-if="apiError">
                  <BaseAlert type="error" dense text class="ma-0"
                    >{{ apiError }}
                  </BaseAlert>
                </div>
                <div v-else-if="apiStatus">
                  <BaseProgressCircular class="ma-0" /><span class="ml-3"
                    >Fetching files from server...</span
                  >
                </div>
                <div v-else>
                  <BaseProgressCircular
                    class="ma-0"
                    :indeterminate="!apiStatus"
                  />
                  <span class="ml-3">
                    Updating files in {{ counter }} seconds
                  </span>
                </div>
              </VCardActions>
            </VCard>
          </VCol>
        </VRow>
        <div justify="center" align="center" class="mt-3">
          <VFileInput
            v-model="privateKey"
            accept=".txt"
            label="Secret Key"
            class="fileInput"
          ></VFileInput>
        </div>
        <div justify="center" align="center">
          <BaseButton
            v-bind="{ success, progress, error, status }"
            :disabled="!selectedFiles.length"
            text="Explore the data"
            icon="mdiStepForward"
            class="my-sm-2 mr-sm-4"
            @click="fetchFiles"
          />
        </div>
        <VRow>
          <VCol>
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
              <BaseAlert
                v-if="!privateKey"
                type="info"
                border="left"
                dense
                text
              >
                The files may be encrypted, please enter your secret key.
              </BaseAlert>
            </template>
          </VCol>
        </VRow>
      </VCardText>
    </VCard>
  </VContainer>
</template>

<script>
import { pick } from 'lodash'
import { filetype2icon, extension2filetype } from '@/utils/file-manager'
import { decryptBlob } from '@/utils/encryption'
const util = require('util')
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
      'slug',
      'title',
      'dataPortal',
      'dataPortalHtml',
      'dataPortalMessage',
      'tutorialVideos'
    ])
    const { publicKey } = this.$store.getters.config(this.$route)
    return {
      timer: null,
      counter: 5,
      apiError: null,
      apiStatus: '',
      filenames: [],
      fileItems: [],
      downloadedFiles: [],
      decryptedFiles: [],
      selectedFiles: [],
      privateKey: null,
      status: false,
      publicKey,
      ...experienceProps
    }
  },
  computed: {
    bubble() {
      return this.$route.params.bubble
    },
    nbSelected() {
      return this.selectedFiles.length
    },
    nbFiles() {
      return this.fileItems.length
    },
    allSelected() {
      return this.nbSelected === this.nbFiles
    }
  },
  watch: {
    filenames(newValue, oldValue) {
      const newFilenames = newValue.filter(file => !oldValue.includes(file))
      newFilenames.forEach(filename => {
        const extension = String(filename).match(/\.([\S]+)/)?.[1]
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
    this.fetchFilenames()
    this.timer = setInterval(() => {
      if (!this.apiStatus) {
        this.counter--
        if (this.counter <= 0) {
          this.fetchFilenames()
        }
      }
    }, 1000)
  },
  beforeDestroy() {
    clearInterval(this.timer)
  },
  methods: {
    selectAll() {
      if (!this.allSelected) {
        this.selectedFiles = [...Array(this.fileItems.length).keys()]
      } else {
        this.selectedFiles = []
      }
    },
    fetchFilenames() {
      this.apiError = null
      this.apiStatus = 'Fetching filenames from server...'
      this.counter = 5
      this.$api.getFilenames(this.bubble, (error, res) => {
        this.apiLoading = false
        if (error) {
          this.apiError = error.toString()
          this.apiStatus = null
          console.error(error)
        } else {
          // TODO: refactor the filetring part, maybe an endpoint per experience in the backend ?
          this.filenames = res.filter(f => this.slug.includes(f.split('_')[0]))
          this.apiStatus = null
        }
      })
    },
    fetchFiles() {
      this.apiError = null
      this.apiStatus = 'Downloading files from server...'
      this.status = true

      const getFilePromise = util.promisify(this.$api.getFile)
      const decryptBlobPromise = util.promisify(decryptBlob)
      const filenames = this.selectedFiles.map(
        idx => this.fileItems[idx].filename
      )

      // First Fetch the files
      Promise.all(
        filenames.map(filename =>
          getFilePromise(this.bubble, filename)
            .then(fileBlob => {
              this.apiStatus = 'Decrypting files...'
              return this.privateKey
                ? this.privateKey
                    .text()
                    .then(privateKey =>
                      decryptBlobPromise(fileBlob, privateKey, this.publicKey)
                    )
                : fileBlob
            })
            .then(blob => new File([blob], filename))
        )
      )
        .then(decryptedFiles => {
          this.apiStatus = 'Processing files...'
          this.$emit('update', { uppyFiles: decryptedFiles })
        })
        .catch(error => {
          console.error(error)
          this.apiError = error.toString()
        })
    }
  }
}
</script>
<style scoped>
.v-card__text {
  flex-grow: 1;
  overflow: auto;
}
.fileInput {
  max-width: 300px;
}
</style>

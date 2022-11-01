<template>
  <VContainer>
    <VCard class="pa-2" flat>
      <VCardTitle class="text-h5 font-weight-bold justify-center mb-3">
        Explore the data from multiple participants
      </VCardTitle>
      <VCardText>
        <VRow>
          <VCol align="center">
            <p class="body-1">
              Explore the data of several participants who have shared their
              data with you. with you. Once you have received enough files,
              select the ones you want to see, enter your secret key to decrypt
              them and click on "Explore the data".
            </p>
          </VCol>
        </VRow>
        <VRow>
          <VCol align="center">
            <VCard height="500" class="d-flex flex-column">
              <VCardTitle class="mb-2">
                <span>Fetching data</span>
                <VSpacer />
                <span class="caption">{{ nbSelected }} out of {{ nbFiles }} selected</span>
                <VSpacer />
                <VTooltip left>
                  <template #activator="{ on, attrs }">
                    <VBtn
                      icon
                      color="error"
                      class="mr-2"
                      v-bind="attrs"
                      v-on="on"
                      @click="deleteFiles"
                    >
                      <VIcon>$vuetify.icon.mdiDelete</VIcon>
                    </VBtn>
                  </template>
                  <span>Delete All Files</span>
                </VTooltip>
                <VTooltip left>
                  <template #activator="{ on, attrs }">
                    <VBtn
                      icon
                      color="primary"
                      class="mr-2"
                      v-bind="attrs"
                      @click="fetchFilenames"
                      v-on="on"
                    >
                      <VIcon>$vuetify.icon.mdiCached</VIcon>
                    </VBtn>
                  </template>
                  <span>Refresh Files</span>
                </VTooltip>
                <BaseButton
                  outlined
                  small
                  color="primary"
                  min-width="120"
                  @click="selectAll"
                >
                  {{ allSelected ? 'un' : '' }}select All
                </BaseButton>
              </VCardTitle>
              <VCardText>
                <span v-if="!nbFiles">
                  No files retrieved on the server yet</span>
                <VListItemGroup v-else v-model="selectedFiles" multiple>
                  <VListItem v-for="file in fileItems" :key="file.filename">
                    <template #default="{ active }">
                      <VListItemAction>
                        <VCheckbox :input-value="active" color="primary" />
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
              <VSpacer />
              <VCardActions class="align-center justify-center">
                <div v-if="apiError">
                  <BaseAlert
                    type="error"
                    dense
                    text
                    class="ma-0"
                  >
                    {{ apiError }}
                  </BaseAlert>
                </div>
                <div v-else-if="apiStatus">
                  <BaseProgressCircular class="ma-0" /><span class="ml-3">Fetching files from server...</span>
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
          />
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
              >
                {{ message }}
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
import { promisify } from 'util'
import { mapState } from '@/utils/store-helper'
import { BrowserFile, filetype2icon, extension2filetype } from '@/utils/file-manager'
import BubbleApi from '@/utils/bubble-api'
import { decryptBlob } from '@/utils/encryption'

import BaseAlert from '@/components/base/BaseAlert.vue'
import BaseButton from '@/components/base/button/BaseButton.vue'
import BaseProgressCircular from '@/components/base/BaseProgressCircular.vue'

export default {
  name: 'UnitDownload',
  components: { BaseAlert, BaseButton, BaseProgressCircular },
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
      status: false
    }
  },
  computed: {
    ...mapState(['experienceConfig', 'bubbleConfig', 'bubbleCodeword']),
    publicKey() {
      return this.bubbleConfig?.publicKey
    },
    slug() {
      return this.experienceConfig?.slug
    },
    bubbleApi() {
      if (!this.bubbleConfig) {
        return
      }
      return new BubbleApi(this.bubbleConfig.apiUrl)
    },
    bubble() {
      return this.bubbleConfig?.id
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
      newFilenames.forEach((filename) => {
        const extension = String(filename).match(/\.([\S]+)/)?.[1]
        const type = extension2filetype[extension] ?? 'folder'
        const icon = filetype2icon[type] || '$vuetify.icons.mdiFile'
        this.fileItems.push({
          filename,
          icon,
          date: new Date()
        })
      })
      this.fileItems = this.fileItems.filter(f => newValue.includes(f.filename))
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
  beforeUnmount() {
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
    deleteFiles() {
      const codeword = this.bubbleConfig
      this.bubbleApi.deleteFiles(this.bubble, codeword).then((res) => {
        if (res) {
          console.error(res)
        }
        this.fetchFilenames()
      })
    },
    fetchFilenames() {
      this.apiError = null
      this.apiStatus = 'Fetching filenames from server...'
      this.counter = 5
      this.bubbleApi.getFilenames(this.bubble, (error, res) => {
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
    async fetchFiles() {
      const consoleLabel = (...labels) => `UnitDownload.fetchFiles${labels.length ? '.' + labels.join('.') : ''}`
      console.time(consoleLabel())

      this.apiError = null
      this.apiStatus = 'Downloading files from server...'
      this.status = true

      // const getFilePromise = promisify(this.bubbleApi.getFile)
      const decryptBlobPromise = promisify(decryptBlob)
      const filenames = this.selectedFiles.map(
        idx => this.fileItems[idx].filename
      )

      try {
        console.time(consoleLabel('getFiles'))
        const filePromises = filenames.map(filename =>
          this.bubbleApi.getFile(this.bubble, filename))
        const encryptedFiles = await Promise.all(filePromises)
        console.timeEnd(consoleLabel('getFiles'))
        this.apiStatus = 'Decrypting files...'
        const decryptedFiles = await
        Promise.all(
          encryptedFiles.map(async(fileBlob, i) => {
            if (!this.privateKey) {
              return fileBlob
            }
            const label = consoleLabel('decryptBlob', i)
            console.time(label)
            const privateKey = await this.privateKey.text()
            const blob = await decryptBlobPromise(fileBlob, privateKey, this.publicKey)
            console.timeEnd(label)
            const filename = filenames[i]
            return new BrowserFile(new File([blob], filename))
          }))
        this.apiStatus = 'Processing files...'
        this.$emit('update', { uppyFiles: decryptedFiles })
      } catch (error) {
        console.error(error)
        this.apiError = error.toString()
      }

      console.timeEnd(consoleLabel())
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

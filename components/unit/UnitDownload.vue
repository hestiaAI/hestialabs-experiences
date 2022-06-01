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
            <VCard height="500" class="d-flex flex-column">
              <VCardTitle class="mb-2">
                <span
                  >Bubble: <b>{{ dataFromBubble }}</b></span
                >
                <VSpacer></VSpacer>
                <span class="caption"
                  >{{ nbSelected }} out of {{ nbFiles }} selected</span
                >
                <VSpacer></VSpacer>
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
                <div v-if="apiLoading">
                  ><BaseProgressCircular class="ma-0" /><span class="ml-3"
                    >Fetching files from server...</span
                  >
                </div>
                <div v-else-if="apiError">
                  <BaseAlert type="error" dense text class="ma-0"
                    >{{ apiError }}
                  </BaseAlert>
                </div>
                <div v-else>
                  <BaseProgressCircular
                    class="ma-0"
                    :indeterminate="timerPlay"
                  /><span class="ml-3"
                    >Updating files in {{ counter }} seconds</span
                  >
                </div>
              </VCardActions>
            </VCard>
          </VCol>
        </VRow>
        <div justify="center" align="center">
          <VFileInput
            v-model="privateKey"
            accept=".txt"
            label="Secret Key"
            class="fileInput"
          ></VFileInput>
        </div>
        <div justify="center" align="center">
          <BaseButton
            v-bind="{ success, progress, error }"
            :disabled="!selectedFiles.length"
            text="Explore the data"
            icon="mdiStepForward"
            class="my-sm-2 mr-sm-4"
            @click="downloadFiles"
          />
        </div>
      </VCardText>
    </VCard>
  </VContainer>
</template>

<script>
import { pick } from 'lodash'
import { filetype2icon, extension2filetype } from '@/utils/file-manager'
const _sodium = require('libsodium-wrappers')
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
    const bubbleProps = pick(bubbleConfig, ['dataFromBubble', 'publicKey'])
    return {
      timer: null,
      timerPlay: true,
      counter: 5,
      apiError: null,
      apiLoading: false,
      filenames: [],
      fileItems: [],
      selectedFiles: [],
      privateKey: null,
      ...experienceProps,
      ...bubbleProps
    }
  },
  computed: {
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
    this.fetchData()
    this.timer = setInterval(() => {
      if (this.timerPlay) {
        this.counter--
        if (this.counter <= 0) {
          this.counter = 5
          this.fetchData()
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
          this.filenames = response
        }
      } catch (e) {
        this.apiError = e
        console.error(e)
      }
    },
    async downloadFiles() {
      this.timerPlay = false
      this.apiError = null
      this.apiLoading = true
      const files = await Promise.all(
        this.selectedFiles.map(async fileIdx => {
          const filename = this.fileItems[fileIdx].filename
          try {
            const resp = await fetch(
              `${process.env.apiUrl}/bubbles/${this.dataFromBubble}/file/${filename}`,
              {
                method: 'GET'
              }
            )
            this.apiLoading = false
            let blob = await resp.blob()
            if (this.privateKey) {
              const [decryptedBlob, error] = await this.decryptBlob(
                blob,
                await this.privateKey.text(),
                this.publicKey
              )
              if (error) console.error(error)
              else blob = decryptedBlob
            }
            if (!resp.ok) {
              this.apiError = blob
              console.error(blob)
            } else {
              return new File([blob], filename)
            }
          } catch (e) {
            this.apiError = e
            console.error(e)
          }
        })
      )
      console.log(files)
      this.$emit('update', { uppyFiles: files })
    },
    async decryptBlob(blob, secretKey, publicKey) {
      try {
        await _sodium.ready
        const sodium = _sodium
        const sk = sodium.from_hex(secretKey)
        const pk = sodium.from_hex(publicKey)
        const buf = await blob.arrayBuffer()
        const ciphertext = new Uint8Array(buf)
        return [
          new Blob([sodium.crypto_box_seal_open(ciphertext, pk, sk)]),
          null
        ]
      } catch (error) {
        return [null, error]
      }
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

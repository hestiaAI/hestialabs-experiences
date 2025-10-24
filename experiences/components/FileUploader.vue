<!-- eslint-disable vue/no-v-html -->
<template>
  <VCard outlined class="pa-6">
    <VForm ref="fileForm">
      <VFileInput
        v-model="file"
        :disabled="disabled"
        :rules="fileRules"
        show-size
        class="mx-auto"
        label="Sélectionnez votre archive"
        accept="application/zip"
      />

      <BaseButton
        v-bind="{ error, success, disabled, progress }"
        mdi-icon="mdiUpload"
        class="my-sm-2 mr-sm-4"
        color="primary"
        @click="uploadFile"
      >
        <span>Transmettez vos données</span>
      </BaseButton>
      <div v-if="status" v-text="status" />
      <VAlert
        v-if="error || success"
        class="mt-6 text-left"
        :type="error ? 'error' : 'success'"
        text
      >
        <div v-html="error ? errorMessage : successMessage" />
      </VAlert>
      <CheckoutDialog v-if="success && paymentURL" v-bind="{paymentURL}" />
    </VForm>
    <div v-if="progress && uploadPercentage" class="text-center mt-6">
      <VProgressLinear
        :value="uploadPercentage"
        color="primary"
        height="4"
      />
      <div>{{ uploadPercentage }}%</div>
    </div>
  </VCard>
</template>
<script>
import { mapState } from 'vuex'
import JSZip from 'jszip'
import { hashFile, encryptFile } from 'data-experience'
import * as d3 from 'd3'
import mm from 'micromatch'
import CheckoutDialog from './CheckoutDialog.vue'
import { validateZip } from '@/utils/fileHelpers.js'

export default {
  name: 'FileUploader',
  components: { CheckoutDialog },
  props: {
    platform: {
      type: String,
      required: true
    },
    country: {
      type: String,
      required: true
    },
    productId: {
      type: Number,
      required: true
    },
    disable: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      file: null,
      progress: false,
      uploadPercentage: 0,
      disabled: this.disable,
      validated: false,
      error: false,
      errorMessage: '',
      success: false,
      status: '',
      successMessage: 'Votre archive a bien été envoyée. Nous vous contacterons dès que possible.',
      fileRules: [
        v => !!v || 'Fichier requis',
        v => (v && v.size < 500 * 1e6) || 'Le fichier est trop volumineux',
        v => (v && v.name.endsWith('.zip')) || 'Le fichier doit être un zip'
      ],
      paymentURL: null,
      fileType: null,
      paymentLink: null
    }
  },
  computed: {
    ...mapState({
      encryptionPK: state => state.uploads.encryptionPK,
      serverlessUrl: state => state.uploads.serverlessUrl,
      products: state => state.uploads.products
    })
  },
  watch: {
    file() {
      this.validated = false
      this.error = false
      this.progress = false
      this.success = false
      this.paymentURL = null
      this.paymentLink = null
    }
  },
  methods: {
    async getUberInfos(zip) {
      const product = this.products[this.country][this.platform].find(product => product.name === this.fileType)
      if (!product) { return }
      const file = await zip.file(mm.makeRe(product.driverInfos.file))[0].async('text')
      return await d3.csvParse(file, (d) => {
        const infos = {}
        Object.entries(product.driverInfos.fields).forEach(([k, v]) => {
          infos[k] = d[v]
        })
        return infos
      })[0]
    },
    getFileType(zip) {
      return this.products[this.country][this.platform].some((product) => {
        if (validateZip(zip, product.filesNeeded)) {
          this.fileType = product.name
          this.paymentLink = product.paymentLink
          return true
        } else {
          return false
        }
      })
    },
    async uploadFile() {
      if (!this.$refs.fileForm.validate()) { return }
      this.disabled = true
      this.error = false
      this.progress = true

      // Read the zip file
      this.status = 'Reading file...'
      const zipLoader = new JSZip()
      const zipObject = await zipLoader.loadAsync(this.file)

      // Validate the zip file
      this.status = 'Validating file...'
      this.error = !(this.getFileType(zipObject))
      if (this.error) {
        this.errorMessage = 'Erreur pendant la validation du fichier: votre archive n\'est pas reconnu par notre système. Si vous rencontrez des problèmes pour récupérer vos données ou si ce message apparait alors que vous avez récemment récupéré vos données en suivant bien le protocole indiqué sur <a href="https://personaldata.io/nos-donnees-nos-projets/mobilite/uber/rgpd/" target="blank">cette page</a>, veuillez nous contacter via <a :href="whatsAppLink" target="blank">Whatsapp</a>'
        this.disabled = false
        this.progress = false
        return
      }

      // Get the file name
      this.status = 'Getting file name...'
      const hash = await hashFile(this.file)
      const filename = `Uber_${hash}.zip`

      // Encrypt the file
      this.status = 'Encrypting file...'
      let encryptedFile = null
      try {
        const content = await zipObject.generateAsync({ type: 'uint8array' })
        const encryptedContent = await encryptFile(content, this.encryptionPK)
        encryptedFile = new File([encryptedContent], filename, {
          type: 'application/zip'
        })
      } catch (err) {
        this.error = true
        this.disabled = false
        this.progress = false
        this.status = ''
        this.errorMessage = 'Erreur pendant l\'encryption du fichier: ' + err.toString()
        return
      }

      // Get the presighned URL to upload the file
      this.status = 'Getting presigned URL...'
      let presignedUrl = null
      try {
        const apiURL = this.serverlessUrl + 'getUploadUrl?' + new URLSearchParams({
          platform: this.platform,
          country: this.country,
          name: filename
        })
        const response = await fetch(apiURL)

        if (response.status !== 200) {
          const text = await response.text()
          throw new Error(`Le serveur à retourner le code d'erreur ${response.status} : ${text}`)
        }

        const json = await response.json()
        presignedUrl = json.presignedUrl
        if (!presignedUrl) {
          throw new Error('No presigned URL returned')
        }
      } catch (err) {
        this.error = true
        this.disabled = false
        this.progress = false
        this.status = ''
        this.errorMessage = 'Erreur pendant la récupération du lien d\'upload: ' + err.toString()
        return
      }

      // Upload the file to S3
      this.status = 'Uploading file...'
      try {
        const response = await this.$axios.put(presignedUrl, encryptedFile, {
          headers: {
            'Content-Type': 'application/zip'
          },
          onUploadProgress: (progressEvent) => {
            const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total)
            if (progress < 100) {
              this.uploadPercentage = progress
            }
          }
        })
        // Check if the upload was successful
        if (response.status !== 200) {
          const text = await response.text()
          throw new Error(`Le serveur à retourner le code d'erreur ${response.status} : ${text}`)
        }
      } catch (err) {
        this.error = true
        this.disabled = false
        this.progress = false
        this.status = ''
        this.errorMessage = 'Erreur pendant l\'upload du fichier: ' + err.toString()
        return
      }

      // Create a transaction for payment
      this.status = 'Creating a transaction...'
      const uberInfos = await this.getUberInfos(zipObject)
      let clientRefID = null
      try {
        const apiURL = this.serverlessUrl + 'createTransaction?' + new URLSearchParams({
          filename,
          ...uberInfos,
          product: this.productId
        })
        const response = await fetch(apiURL)

        if (response.status !== 200) {
          const text = await response.text()
          throw new Error(`Le serveur à retourner le code d'erreur ${response.status} : ${text}`)
        }

        const json = await response.json()
        clientRefID = json.client_reference_id
        if (!clientRefID) {
          throw new Error('No clientRefID returned')
        }
      } catch (err) {
        this.error = true
        this.disabled = false
        this.progress = false
        this.status = ''
        this.errorMessage = 'Erreur pendant la création de la transaction: ' + err.toString()
        return
      }

      this.paymentURL = `${this.paymentLink}?prefilled_email=${uberInfos.email}&client_reference_id=${clientRefID}&locale=fr`
      this.status = ''
      this.success = true
      this.disabled = false
      this.progress = false
    }
  }
}
</script>

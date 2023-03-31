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
        v-bind="{ disabled, progress }"
        text="unit-files.run-btn"
        :mdi-icon="statusIcon"
        class="my-sm-2 mr-sm-4"
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
        {{ error ? errorMessage : successMessage }}
        <p v-if="fileMissing.length">
          {{ fileMissing.length }} fichiers manquent à votre archive:
          <ul>
            <li v-for="filename in fileMissing" :key="filename">
              {{ filename }}
            </li>
          </ul>
          <br>
          Avez bien suivi les instructions pour récupérer vos données ?
          <br>
          Si vous rencontrez des problèmes pour récupérer vos données ou si ce message apparait alors que vous avez récemment récupéré vos données en suivant bien le protocole indiqué sur <a href="https://personaldata.io/nos-donnees-nos-projets/mobilite/uber/rgpd/" target="blank">cette page</a>, veuillez nous contacter via <a :href="whatsAppLink" target="blank">Whatsapp</a>.
        </p>
      </VAlert>
      <CheckoutDialog v-if="success && paymentURL" v-bind="{paymentURL}" />
    </VForm>
  </VCard>
</template>
<script>
import JSZip from 'jszip'
import mm from 'micromatch'
import { hashFile, encryptFile } from 'data-experience'
import * as d3 from 'd3'
import CheckoutDialog from './CheckoutDialog.vue'

export default {
  name: 'FileUploader',
  components: { CheckoutDialog },
  props: {
    s3URL: {
      type: String,
      default: 'https://serverless.hestia.ai/.netlify/functions/'
    },
    publicKey: {
      type: String,
      default: 'fa71a63fafb8f9f3f5f23e120976c81995ee711a3d73ee871e82102bedf41022'
    }
  },
  data() {
    return {
      file: null,
      progress: false,
      disabled: false,
      validated: false,
      error: false,
      errorMessage: '',
      success: false,
      status: '',
      successMessage: 'Votre archive a bien été envoyée. Nous vous contacterons dès que possible.',
      fileNeeded: [
        '**/*Driver Profile Data*.csv',
        '**/*Driver Payments*.csv',
        '**/*Driver Lifetime Trip*.csv',
        '**/*Driver Online Offline.csv'
      ],
      fileMissing: [],
      fileRules: [
        v => !!v || 'Fichier requis',
        v => (v && v.size < 500 * 1e6) || 'Le fichier est trop volumineux',
        v => (v && v.name.endsWith('.zip')) || 'Le fichier doit être un zip'
      ],
      paymentURL: null
    }
  },
  computed: {
    statusIcon() {
      if (this.error) {
        return 'mdiAlert'
      } else if (this.success) {
        return 'mdiCheckCircle'
      } else {
        return 'mdiUpload'
      }
    }
  },
  watch: {
    file() {
      this.validated = false
      this.error = false
      this.progress = false
      this.success = false
      this.fileMissing = []
      this.paymentURL = null
    }
  },
  methods: {
    validateZip(zip) {
      this.fileMissing = this.fileNeeded.filter((file) => {
        const regex = mm.makeRe(file)
        return !zip.file(regex).length
      })
      return this.fileMissing.length === 0
    },
    async getUberInfos(zip) {
      const file = await zip.file(mm.makeRe('**/*Driver Profile Data*.csv'))[0].async('text')
      return await d3.csvParse(file, (d) => {
        return { email: d.email, firstname: d.firstname, lastname: d.lastname }
      })[0]
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
      this.error = !(this.validateZip(zipObject))
      if (this.error) {
        this.errorMessage = 'Erreur pendant la validation du fichier: '
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
        const encryptedContent = await encryptFile(content, this.publicKey)
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
        const apiURL = this.s3URL + 'getUploadUrl?' + new URLSearchParams({
          platform: 'uber',
          country: 'france',
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
        const response = await fetch(presignedUrl, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/zip'
          },
          body: encryptedFile
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
      const { email, firstname, lastname } = await this.getUberInfos(zipObject)
      let clientRefID = null
      try {
        const apiURL = this.s3URL + 'createTransaction?' + new URLSearchParams({
          filename,
          email,
          firstname,
          lastname
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

      this.paymentURL = `https://buy.stripe.com/fZe8wYbek6Nm6ze4gg?prefilled_email=${email}&client_reference_id=${clientRefID}&locale=fr`

      this.status = ''
      this.success = true
      this.disabled = false
      this.progress = false
    }
  }
}
</script>

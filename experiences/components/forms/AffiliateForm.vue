<template>
  <VCard outlined>
    <VCardText>
      <VForm ref="form" @submit.prevent="submitForm">
        <VRow>
          <VCol cols="12" md="6">
            <VTextField v-model="firstName" label="Prénom" :rules="[requiredRule, lengthRule]" :counter="maxLength" required />
          </VCol>
          <VCol cols="12" md="6">
            <VTextField v-model="lastName" label="Nom" :rules="[requiredRule, lengthRule]" :counter="maxLength" required />
          </VCol>
          <VCol cols="12" md="6">
            <VTextField
              v-model="email"
              label="Email"
              type="email"
              :rules="[requiredRule, emailRule]"
              required
            />
          </VCol>
          <VCol cols="4" md="3">
            <VAutocomplete
              v-model="phoneCountryCode"
              auto-select-first
              :clear-icon="$vuetify.icons.values['mdiClose']"
              clearable
              :items="dialCodes"
              label="Indicatif pays"
              item-text="name"
              item-value="code"
              :rules="[requiredRule]"
              required
            />
          </VCol>
          <VCol cols="8" md="3">
            <VTextField v-model="phoneNumber" label="Téléphone" :rules="[requiredRule, phoneNumberRule]" required />
          </VCol>
        </VRow>
        <VRow>
          <VCol cols="12">
            <BaseButton type="submit" color="primary" text="Devenir parrain" mdi-icon="mdiSend" v-bind="{error, success, progress}" />
          </VCol>
        </VRow>
        <VAlert
          v-if="error || success"
          class="mt-6 text-left"
          :type="error ? 'error' : 'success'"
          text
        >
          <div v-text="error ? errorMessage : successMessage" />
        </VAlert>
      </VForm>
    </VCardText>
  </VCard>
</template>

<script>
import { mapState } from 'vuex'

export default {
  data() {
    return {
      firstName: '',
      lastName: '',
      email: '',
      phoneCountryCode: null,
      phoneNumber: '',
      dialCodes: [],
      maxLength: 30,
      progress: false,
      error: false,
      success: false,
      errorMessage: 'Une erreur s\'est produite. Veuillez réessayer plus tard ou nous contacter.',
      successMessage: 'Félicitations, vous êtes maintenant un parain de Horkos Deluxe. Nous vous contacterons par email dans les plus brefs délais.'
    }
  },
  computed: {
    ...mapState({
      serverlessUrl: state => state.uploads.serverlessUrl
    }),
    requiredRule() {
      return value => !!value || 'This field is required'
    },
    lengthRule() {
      return value => value.length <= 30 || 'This field must be at most 30 characters'
    },
    emailRule() {
      return value => /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(value) || 'Invalid email address'
    },
    phoneNumberRule() {
      return value => /^\+?[0-9]+$/.test(value) || 'Invalid phone number'
    }
  },
  mounted() {
    this.fetchDialCodes()
  },
  methods: {
    async fetchDialCodes() {
      const codes = await fetch('/data/dial-codes.json')
      const codesJSON = await codes.json()
      this.dialCodes = codesJSON.map((code) => {
        if (code.header || code.divider) {
          return code
        }
        return {
          name: `${code.official_name_fr} (+${code.Dial})`,
          code: code.Dial
        }
      })
    },
    async submitForm() {
      this.progress = true
      this.error = false
      this.success = false

      if (this.$refs.form.validate()) {
        const contactInfo = {
          firstname: this.firstName,
          lastname: this.lastName,
          email: this.email,
          mobile_country_code: `+${this.phoneCountryCode}`,
          mobile_phone_number: this.phoneNumber
        }
        try {
          const apiURL = this.serverlessUrl + 'createAffiliate?' + new URLSearchParams(contactInfo)
          const response = await fetch(apiURL)

          if (response.status !== 200) {
            const text = await response.text()
            throw new Error(`le serveur à retourner le code d'erreur ${response.status} : ${text}`)
          }
        } catch (err) {
          this.error = true
          this.progress = false
          this.errorMessage = 'Une erreur s\'est produite. Veuillez réessayer plus tard ou nous contacter. Détail: ' + err.toString()
          return
        }

        this.success = true
        this.progress = false
      }
    }
  }
}
</script>

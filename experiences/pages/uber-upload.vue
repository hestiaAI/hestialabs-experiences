<template>
  <VContainer>
    <section class="mt-6">
      <h1 class="mb-6 text-h4 font-weight-bold primary--text">
        Get your data analysed
      </h1>
      <p>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut dolor ante, consectetur in velit a, sagittis lobortis justo. Sed scelerisque in urna quis ornare. Fusce iaculis blandit lacus eu consequat. In vitae leo ut mauris fringilla viverra. Interdum et malesuada fames ac ante ipsum primis in faucibus. Suspendisse ut mi a libero luctus varius at et lacus. Nullam vulputate erat quis cursus vulputate. Nulla commodo diam sem. Aenean vitae metus porta, pretium tortor nec, pretium tellus. Sed consequat turpis non bibendum faucibus.
      </p>
    </section>

    <section class="mt-6 mb-6">
      <VCard outlined class="pa-6">
        <VCardTitle>Send your data for analysis</VCardTitle>
        <VCardText>
          <VForm
            ref="form"
            v-model="valid"
            lazy-validation
          >
            <VRow>
              <VCol cols="12" md="6">
                <VTextField
                  v-model="firstname"
                  :counter="10"
                  :rules="nameRules"
                  label="First Name"
                  prepend-icon="$vuetify.icons.mdiAccount"
                  outlined
                  required
                />
              </VCol>
              <VCol cols="12" md="6">
                <VTextField
                  v-model="lastname"
                  :counter="10"
                  :rules="nameRules"
                  label="Last Name"
                  prepend-icon="$vuetify.icons.mdiAccount"
                  outlined
                  required
                />
              </VCol>
              <VCol cols="12" md="6">
                <VSelect
                  v-model="country"
                  name="country"
                  label="Country"
                  hint="Please select your country"
                  prepend-icon="$vuetify.icons.mdiEarth"
                  :items="countries"
                />
              </VCol>
              <VCol cols="12" md="6">
                <VTextField
                  v-model="email"
                  :rules="emailRules"
                  label="Phone"
                  prepend-icon="$vuetify.icons.mdiPhone"
                  outlined
                  required
                />
              </VCol>
              <VCol cols="12" md="6">
                <VTextField
                  v-model="email"
                  :rules="emailRules"
                  label="E-mail"
                  prepend-icon="$vuetify.icons.mdiAt"
                  outlined
                  required
                />
              </VCol>
              <VCol cols="12" md="6">
                <VFileInput
                  v-model="files"
                  label="SAR request data"
                  placeholder="Select your archive"
                  prepend-icon="$vuetify.icons.mdiPaperclip"
                  outlined
                  counter
                  :show-size="1000"
                />
              </VCol>
            </VRow>

            <VCheckbox
              v-model="checkbox"
              :rules="[v => !!v || 'You must agree to continue!']"
              label="Do you agree?"
              required
            >
              <template #label>
                <div>
                  I agree to the
                  <a
                    target="_blank"
                    href="https://vuetifyjs.com"
                    @click.stop
                    v-on="on"
                  >
                    terms and conditions
                  </a>
                </div>
              </template>
            </VCheckbox>

            <VBtn
              :disabled="!valid"
              class="mr-4"
              @click="validate"
            >
              Send your data for Analysis
            </VBtn>
          </VForm>
        </VCardText>
      </VCard>
    </section>
  </VContainer>
</template>

<script>
export default {
  data: () => ({
    valid: true,
    name: '',
    nameRules: [
      v => !!v || 'Name is required',
      v => (v && v.length <= 10) || 'Name must be less than 10 characters'
    ],
    email: '',
    emailRules: [
      v => !!v || 'E-mail is required',
      v => /.+@.+\..+/.test(v) || 'E-mail must be valid'
    ],
    countries: ['France', 'Switzerland'],
    checkbox: false
  }),

  methods: {
    validate() {
      this.$refs.form.validate()
    }
  }
}
</script>

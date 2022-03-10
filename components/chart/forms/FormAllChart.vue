<template>
  <VContainer>
    <VForm ref="form" v-model="valid" lazy-validation>
      <VTextField
        v-model="name"
        :counter="10"
        :rules="nameRules"
        label="Name"
        required
      ></VTextField>

      <VTextField
        v-model="email"
        :rules="emailRules"
        label="E-mail"
        required
      ></VTextField>

      <VSelect
        v-model="select"
        :items="items"
        :rules="[v => !!v || 'Item is required']"
        label="Item"
        required
      ></VSelect>

      <VCheckbox
        v-model="checkbox"
        :rules="[v => !!v || 'You must agree to continue!']"
        label="Do you agree?"
        required
      ></VCheckbox>

      <VBtn :disabled="!valid" color="success" class="mr-4" @click="validate">
        Validate
      </VBtn>

      <VBtn color="error" class="mr-4" @click="reset"> Reset Form </VBtn>

      <VBtn color="warning" @click="resetValidation"> Reset Validation </VBtn>
    </VForm>
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
    select: null,
    items: ['Item 1', 'Item 2', 'Item 3', 'Item 4'],
    checkbox: false
  }),

  methods: {
    validate() {
      this.$refs.form.validate()
    },
    reset() {
      this.$refs.form.reset()
    },
    resetValidation() {
      this.$refs.form.resetValidation()
    }
  }
}
</script>

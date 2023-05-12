<template>
  <VContainer>
    <span v-t="'sar-builder.infos-description'" class="blue-grey--text text--darken-2 mt-6 mb-6" />
    <VCard flat class="pa-3 mt-6">
      <VForm>
        <VRow>
          <VCol cols="6">
            <VTextField
              v-model="firstname"
              outlined
              label="First Name"
              placeholder="John"
              persistent-placeholder
              @input="updateModel"
            />
          </VCol>
          <VCol cols="6">
            <VTextField
              v-model="lastname"
              outlined
              label="Last Name"
              placeholder="Doe"
              persistent-placeholder
              @input="updateModel"
            />
          </vcol>
        </VRow>
        <VRow>
          <VCol cols="12">
            <VCombobox
              v-model="company"
              :items="companies"
              label="Company"
              outlined
              class="text-center"
              item-value="email"
              item-text="name"
              chips
              deletable-chips
              return-object
              @input="updateModel"
            />
          </VCol>
        </VRow>
      </vform>
    </VCard>
  </VContainer>
</template>
<script>
export default {
  props: {
    value: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      firstname: this.value.firstname,
      lastname: this.value.lastname,
      companies: [
        { header: 'Select an option or create one' },
        {
          name: 'Facebook',
          email: 'facebook@example.com'
        },
        {
          name: 'Instagram',
          email: 'instagram@example.com'
        },
        {
          name: 'Twitter',
          email: 'twitter@example.com'
        }
      ],
      company: this.value.company
    }
  },
  watch: {
    value(newValue) {
      this.firstname = newValue.firstname
      this.lastname = newValue.lastname
      this.company = newValue.company
    }
  },
  methods: {
    k(key) {
      return `sar-builder.${key}`
    },
    updateModel() {
      this.$emit('input', {
        firstname: this.firstname,
        lastname: this.lastname,
        company: this.company
      })
    }
  }
}
</script>
<style scoped>
</style>

<template>
  <VContainer>
    <span class="blue-grey--text text--darken-2 mt-6 mb-6">
      Fill in your informations and the company to contact.
    </span>
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
            />
          </VCol>
          <VCol cols="6">
            <VTextField
              v-model="lastname"
              outlined
              label="Last Name"
              placeholder="Doe"
              persistent-placeholder
            />
          </vcol>
        </VRow>
        <VRow>
          <VCol cols="12">
            <VSelect
              v-model="selectedCompany"
              :items="companies"
              label="Company"
              outlined
              class="text-center"
              item-value="email"
              item-text="name"
            />
          </VCol>
        </VRow>
      </vform>
    </VCard>
  </VContainer>
</template>
<script>
export default {
  data() {
    return {
      firstname: '',
      lastname: '',
      companies: [
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
      selectedCompany: null
    }
  }
}
</script>
<style scoped>
</style>

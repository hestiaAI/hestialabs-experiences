<template>
  <VContainer>
    <span class="blue-grey--text text--darken-2 mt-6 mb-6">
      Finally copy the generated SAR text or send it directly
    </span>
    <VCard flat class="pa-3 mt-6">
      <VForm>
        <VTextField
          v-model="to"
          outlined
          :append-icon="$vuetify.icons.values['mdiContentCopy']"
          label="To:"
          placeholder="example@example.com"
          persistent-placeholder
          @click:append="copyToClipboard(to)"
        />
        <VTextField
          v-model="subject"
          outlined
          :append-icon="$vuetify.icons.values['mdiContentCopy']"
          label="Subject:"
          placeholder="Subject Access Request"
          persistent-placeholder
          @click:append="copyToClipboard(subject)"
        />
        <VTextarea
          v-model="body"
          outlined
          :append-icon="$vuetify.icons.values['mdiContentCopy']"
          label="SAR Text"
          @click:append="copyToClipboard(body)"
        />
      </VForm>
    </VCard>
  </VContainer>
</template>
<script>
export default {
  data() {
    return {
      to: '',
      subject: '',
      body: 'The Woodman set to work at once, and so sharp was his axe that the tree was soon chopped nearly through.'
    }
  },
  methods: {
    copyToClipboard(text) {
      navigator.clipboard.writeText(text)
    }
  }
}
</script>
<style scoped>
</style>

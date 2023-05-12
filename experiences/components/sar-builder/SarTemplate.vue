<template>
  <VContainer>
    <span v-t="'sar-builder.send-sar-description'" class="blue-grey--text text--darken-2 mt-6 mb-6" />
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
          @input="updateModel"
        />
        <VTextField
          v-model="subject"
          outlined
          :append-icon="$vuetify.icons.values['mdiContentCopy']"
          label="Subject:"
          placeholder="Subject Access Request"
          persistent-placeholder
          @click:append="copyToClipboard(subject)"
          @input="updateModel"
        />
        <VTextarea
          v-model="body"
          outlined
          :append-icon="$vuetify.icons.values['mdiContentCopy']"
          label="Body"
          @click:append="copyToClipboard(body)"
          @input="updateModel"
        />
      </VForm>
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
      to: this.value.to,
      subject: this.value.subject,
      body: this.value.body,
      isLoading: true
    }
  },
  watch: {
    value: {
      deep: true,
      handler(newValue) {
        this.to = newValue.to
        this.subject = newValue.subject
        this.body = newValue.body
      }
    }
  },
  methods: {
    copyToClipboard(text) {
      navigator.clipboard.writeText(text)
    },
    updateModel() {
      this.$emit('input', {
        to: this.to,
        subject: this.subject,
        body: this.body
      })
    }
  }
}
</script>

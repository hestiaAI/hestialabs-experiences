<template>
  <VDialog
    v-model="dialog"
    transition="dialog-bottom-transition"
    max-width="600"
  >
    <VCard>
      <VCardText class="text-center pa-6">
        <VIcon color="success" size="100" class="mb-3">
          $vuetify.icons.mdiCheckCircleOutline
        </VIcon>
        <div class="mb-3">
          <span class="text-h6 font-weight-bold">
            Votre archive a bien été envoyée!
          </span>
        </div>
        <VBtn :href="paymentURL" target="_blank" color="primary" @click="dialog = false">
          Payez maintenant
        </VBtn>
      </VCardText>
      <VCardActions class="justify-end">
        <VBtn
          text
          @click="dialog = false"
        >
          Plus tard
        </VBtn>
      </VCardActions>
    </VCard>
  </VDialog>
</template>
<script>
export default {
  props: {
    show: {
      type: Boolean,
      default: true
    },
    paymentURL: {
      type: String,
      default: null
    }
  },
  data() {
    return {
      dialog: this.show
    }
  },
  computed: {
    disabled() {
      return !this.paymentURL
    }
  },
  watch: {
    show(value) {
      this.dialog = value
    }
  }
}
</script>

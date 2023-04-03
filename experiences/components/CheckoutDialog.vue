<template>
  <VDialog
    v-model="dialog"
    transition="dialog-bottom-transition"
    max-width="600"
    persistent
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
        <span>
          Vous allez être redirigé vers la page de paiement.
        </span>
        <div class="ma-3">
          <VProgressLinear
            color="success"
            indeterminate
            rounded
            height="6"
          />
        </div>
      </VCardText>
    </VCard>
  </VDialog>
</template>
<script>
export default {
  props: {
    paymentURL: {
      type: String,
      required: true
    },
    timeout: {
      type: Number,
      default: 5000
    }
  },
  data() {
    return {
      dialog: true
    }
  },
  mounted() {
    setTimeout(() => { window.location.href = this.paymentURL }, this.timeout)
  }
}
</script>

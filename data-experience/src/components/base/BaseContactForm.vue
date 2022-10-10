<template>
  <form>
    <VRow>
      <VCol cols="12" md="6">
        <VTextField
          label="Name"
          outlined
        />
      </VCol>
      <VCol cols="12" md="6">
        <VTextField
          label="Email"
          outlined
        />
      </VCol>
      <VCol cols="12">
        <VTextarea
          outlined
          name="input-7-4"
          label="Message"
        />
      </VCol>
    </VRow>
    <div class="d-flex">
      <VSpacer />
      <VBtn outlined>
        Contact us
        <VIcon
          right
          dark
        >
          $vuetify.icons.mdiSend
        </VIcon>
      </VBtn>
    </div>
  </form>
</template>
<script>
export default {
  name: 'BaseContactForm'
}
</script>

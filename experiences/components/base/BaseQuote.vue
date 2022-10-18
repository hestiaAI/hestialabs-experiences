<template>
  <VCard class="mx-auto" color="primary" flat>
    <VCardText class="white--text">
      <VRow dense>
        <VIcon large left color="white">
          $vuetify.icons.mdiFormatQuoteOpen
        </VIcon>
      </VRow>
      <div class="blockquote font-italic">
        {{ text }}
      </div>
      <VRow dense style="justify-content: end">
        <VIcon large right color="white">
          $vuetify.icons.mdiFormatQuoteClose
        </VIcon>
      </VRow>
      <div v-if="author" class="d-flex justify-space-between font-italic font-weight-thin">
        <span v-if="authorHref">
          <VIcon right color="white"> $vuetify.icons.mdiMinus </VIcon>
          <ExternalLink :href="linkSrc">{{ author }}</ExternalLink>
        </span>
        <span v-else>
          <VIcon right color="white">  $vuetify.icons.mdiMinus </VIcon>
          {{ author }}
        </span>
      </div>
    </VCardText>
  </VCard>
</template>

<script>
export default {
  name: 'BaseQuote',
  props: {
    text: {
      type: String,
      required: true
    },
    author: {
      type: String,
      default: ''
    },
    authorHref: {
      type: String,
      default: ''
    }
  }
}
</script>

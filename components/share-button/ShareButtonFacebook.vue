<template>
  <ShareNetwork
    network="facebook"
    :url="url"
    :title="title"
    :description="description"
    :quote="quote"
    :hashtags="hashtags"
  >
    <VBtn outlined small>
      <VIcon left>$vuetify.icons.mdiFacebook</VIcon>
      Share
    </VBtn>
  </ShareNetwork>
</template>

<script>
export default {
  props: {
    url: {
      type: String,
      default: ''
    },
    title: {
      type: String,
      default: ''
    },
    description: {
      type: String,
      default: ''
    },
    quote: {
      type: String,
      default: ''
    },
    hashtags: {
      type: String,
      default: ''
    }
  }
}
</script>

<template>
  <ShareNetwork
    network="facebook"
    :url="url"
    :title="title"
    :description="description"
    :quote="quote"
    :hashtags="hashtags"
  >
    <v-btn outlined small>
      <v-icon left>$vuetify.icons.mdiFacebook</v-icon>
      Share
    </v-btn>
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

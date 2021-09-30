<template>
  <ShareNetwork
    network="twitter"
    :url="url"
    :title="title"
    :hashtags="hashtags"
  >
    <v-btn outlined small>
      <v-icon left>$vuetify.icons.mdiTwitter</v-icon>
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
    hashtags: {
      type: String,
      default: ''
    }
  }
}
</script>

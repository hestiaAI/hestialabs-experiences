<template>
  <ShareNetwork
    network="twitter"
    :url="url"
    :title="title"
    :hashtags="hashtags"
    :twitter-user="twitterUser"
  >
    <VBtn outlined small>
      <VIcon left>$vuetify.icons.mdiTwitter</VIcon>
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
    hashtags: {
      type: String,
      default: ''
    },
    twitterUser: {
      type: String,
      default: ''
    }
  }
}
</script>

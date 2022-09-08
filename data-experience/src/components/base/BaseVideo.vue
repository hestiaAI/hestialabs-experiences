<template>
  <div style="width: 100%">
    <div class="overline text-center">
      {{ title }}
    </div>
    <VAlert v-if="!url" color="red" dense type="error">
      The video link provided is not recognized
    </VAlert>
    <iframe
      v-if="url"
      :src="url"
      :width="width"
      :height="height"
      frameborder="0"
      allow="autoplay; fullscreen; picture-in-picture"
      allowfullscreen
      class="pa-3 video"
    />
    <div style="text-align: end; margin-top: 0px; font-size: 12px">
      <ExternalLink :href="linkSrc">
        {{ linkTxt }}
      </ExternalLink>
    </div>
  </div>
</template>
<script>
export default {
  name: 'VideoWidget',
  props: {
    title: {
      type: String,
      default: () => ''
    },
    videoSrc: {
      type: String,
      required: true
    },
    width: {
      type: String,
      default: () => '100%'
    },
    height: {
      type: String,
      default: () => '250px'
    },
    linkSrc: {
      type: String,
      default: () => ''
    },
    linkTxt: {
      type: String,
      default: () => ''
    },
    caption: {
      type: String,
      default: () => ''
    }
  },
  computed: {
    url() {
      const videoID = this.videoSrc.split('/').pop()
      let videoPrefix = null

      // accepted hosts
      if (this.videoSrc.includes('vimeo.com')) { videoPrefix = 'https://player.vimeo.com/video/' }
      if (this.videoSrc.includes('youtube.com')) { videoPrefix = 'https://www.youtube.com/embed/' }

      if (!videoPrefix || !videoID) { return null }
      return videoPrefix + videoID
    }
  }
}
</script>
<style scoped>
.link {
  float: right;
  margin-top: 1em;
}
</style>

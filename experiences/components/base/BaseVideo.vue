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
  </div>
</template>

<script>
export default {
  name: 'BaseVideo',
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
      default: () => '500px'
    },
    height: {
      type: String,
      default: () => '300px'
    },
    caption: {
      type: String,
      default: () => ''
    }
  },
  computed: {
    url() {
      const videoID = this.videoSrc.split('/').pop()

      if (!videoID) { return null }

      // accepted hosts
      if (this.videoSrc.includes('vimeo.com')) {
        return `https://player.vimeo.com/video/${videoID}`
      } else if (this.videoSrc.includes('youtube.com')) {
        return `https://www.youtube.com/embed/${videoID}`
      } else if (this.videoSrc.includes('twitch.tv')) {
        return `https://player.twitch.tv/?video=${videoID}&parent=${this.host}&autoplay=false`
      } else {
        return null
      }
    },
    host() {
      if (window) {
        return window.location.host
          .toLowerCase()
          .replace(/www./g, '')
          .split(':')[0]
      } else {
        return null
      }
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

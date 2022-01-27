<template>
  <VTooltip left>
    <template #activator="{ on }">
      <BaseButton
        v-if="condition"
        icon="mdiShare"
        :text="buttonText"
        v-bind="$attrs"
        @click="share"
        v-on="on"
      />
    </template>
    <span>Reset all</span>
  </VTooltip>
</template>

<script>
import 'share-api-polyfill'
import { mapState, mapGetters } from 'vuex'

async function navigatorShare(shareData, polyfillOptions) {
  try {
    await navigator.share(shareData, polyfillOptions)
  } catch (err) {
    console.error('navigator.share() failed', err)
  }
}

export default {
  props: {
    buttonText: {
      type: String,
      default: 'Share'
    },
    title: {
      type: String,
      default: ''
    },
    text: {
      type: String,
      default: ''
    },
    files: {
      type: Array[File],
      default: () => []
    },
    fileShare: {
      type: Boolean,
      default: false
    }
  },
  data() {
    const condition =
      !this.fileShare ||
      (navigator.canShare &&
        navigator.canShare({
          files: [new File(['test'], 'test.txt')]
        }))
    return {
      condition
    }
  },
  computed: {
    ...mapState(['config']),
    ...mapGetters(['appName', 'manifest']),
    manifestTitle() {
      const { title } = this.manifest(this.$route)
      return title
    },
    hashtags() {
      const { manifestTitle } = this
      const hashtags = [...(this.config.hashtags || ['hestialabs'])]
      if (manifestTitle) {
        hashtags.push(manifestTitle)
      }
      return hashtags
    },
    titleToShare() {
      const { title, manifestTitle } = this
      if (title) {
        // use prop when provided
        return title
      }
      if (manifestTitle) {
        return `${this.appName}: ${manifestTitle}`
      }
      return this.appName
    },
    quoteToShare() {
      const { text, manifestTitle } = this
      if (text) {
        // use prop when provided
        return text
      }
      let textToShare = 'Analyze the data collected on you'
      if (manifestTitle) {
        textToShare += ` by ${manifestTitle}`
      }
      return `${textToShare}.`
    },
    textToShare() {
      return `${this.quoteToShare} ${this.hashtags.map(h => `#${h}`).join(' ')}`
    }
  },
  methods: {
    async share() {
      const {
        hashtags,
        titleToShare: title,
        quoteToShare,
        textToShare,
        files
      } = this

      if (
        files.length &&
        !(navigator.canShare && navigator.canShare({ files }))
      ) {
        throw new Error('Your system does not support sharing files')
      }

      let text = quoteToShare
      if (navigator.canShare && navigator.canShare({ text })) {
        // include hashtags for Web Share API
        text = textToShare
      }

      let url = this.$url()
      if (process.env.NODE_ENV === 'development') {
        url = `https://experiences.hestialabs.org${this.$route.path}`
      }

      const webShareData = {
        title,
        text,
        url,
        files
      }

      await navigatorShare(
        {
          // Web Share Api options
          ...webShareData,

          // share-api-polyfill options
          hashtag: 'hestialabs',
          hashtags,
          via: 'HestiaLabs'
          // fbId enables sharing with Facebook Messenger
          // fbId: '?'
        },
        {
          // disable text sharing with email, copy, sms, and messenger
          // since polyfill does not support text for these types
          email: !text,
          sms: !text,
          copy: !text,
          messenger: !text
        }
      )
    }
  }
}
</script>

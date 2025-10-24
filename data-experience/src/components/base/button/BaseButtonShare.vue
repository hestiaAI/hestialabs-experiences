<template>
  <BaseButton
    v-if="condition"
    mdi-icon="mdiShare"
    :text="buttonText"
    v-bind="$attrs"
    @click="share"
  />
</template>

<script>
import 'share-api-polyfill'
import BaseButton from '@/components/base/button/BaseButton.vue'

export default {
  name: 'BaseButtonShare',
  components: { BaseButton },
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
    experienceTitle() {
      return this.$store.state.xp.experienceConfig.title
    },
    hashtags() {
      const { experienceTitle } = this
      const hashtags = [...(this.$store.state.xp.siteConfig.hashtags || ['hestialabs'])]
      if (experienceTitle) {
        hashtags.push(experienceTitle)
      }
      return hashtags
    },
    titleToShare() {
      const { title, experienceTitle } = this
      if (title) {
        // use prop when provided
        return title
      }
      const appName = this.$t('app.name')
      if (experienceTitle) {
        return `${appName}: ${experienceTitle}`
      }
      return appName
    },
    quoteToShare() {
      const { text, experienceTitle } = this
      if (text) {
        // use prop when provided
        return text
      }
      const quoteToShareKey = `quote-to-share-${experienceTitle ? 'experience' : 'default'}`
      return this.$t(this.k(quoteToShareKey), { experienceTitle })
    },
    textToShare() {
      return `${this.quoteToShare} ${this.hashtags.map(h => `#${h}`).join(' ')}`
    }
  },
  methods: {
    k(key) {
      return `base-button-share.${key}`
    },
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
        throw new Error(this.$t(this.k('error-sharing-not-supported')))
      }

      let text = quoteToShare
      if (navigator.canShare && navigator.canShare({ text })) {
        // include hashtags for Web Share API
        text = textToShare
      }

      const { origin, pathname } = window.location
      const url = `${origin}${pathname}`
      const webShareData = {
        title,
        text,
        url,
        files
      }
      try {
        await navigator.share(
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
            skype: false,
            // disable text sharing with email, copy, sms, and messenger
            // since polyfill does not support text for these types
            email: !text,
            sms: !text,
            copy: !text,
            messenger: !text
          }
        )
      } catch (err) {
        console.error('navigator.share() failed', err)
        throw new Error(this.$t(this.k('error-sharing-failed')))
      }
    }
  }
}
</script>

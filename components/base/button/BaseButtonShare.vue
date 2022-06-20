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

async function navigatorShare (shareData, polyfillOptions) {
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
  data () {
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
    ...mapGetters(['appName', 'experience']),
    experienceTitle () {
      const { title } = this.experience(this.$route)
      return title
    },
    hashtags () {
      const { experienceTitle } = this
      const hashtags = [...(this.config.hashtags || ['hestialabs'])]
      if (experienceTitle) {
        hashtags.push(experienceTitle)
      }
      return hashtags
    },
    titleToShare () {
      const { title, experienceTitle } = this
      if (title) {
        // use prop when provided
        return title
      }
      if (experienceTitle) {
        return `${this.appName}: ${experienceTitle}`
      }
      return this.appName
    },
    quoteToShare () {
      const { text, experienceTitle } = this
      if (text) {
        // use prop when provided
        return text
      }
      let textToShare = 'Analyze the data collected on you'
      if (experienceTitle) {
        textToShare += ` by ${experienceTitle}`
      }
      return `${textToShare}.`
    },
    textToShare () {
      return `${this.quoteToShare} ${this.hashtags.map(h => `#${h}`).join(' ')}`
    }
  },
  methods: {
    async share () {
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

      const url = this.$url()
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
          skype: false,
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

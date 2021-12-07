<template>
  <BaseButton icon="mdiShare" :text="buttonText" @click.stop="share" />
</template>

<script>
import 'share-api-polyfill'
import { mapGetters } from 'vuex'

async function share(shareData, polyfillOptions) {
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
    }
  },
  computed: mapGetters(),
  methods: {
    async share() {
      const { title, text, hashtags, via } = this

      const url = this.$url()

      await share(
        {
          title,
          text,
          quote: text,
          url,
          // options for share-api-polyfill:
          hashtags,
          via
          // fbId enables sharing with Facebook Messenger
          // fbId: '?'
        },
        {
          // disable email, copy, sms, and messenger sharing
          // if no text to share is provided
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

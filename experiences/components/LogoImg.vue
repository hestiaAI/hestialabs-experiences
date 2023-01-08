<template>
  <VImg
    v-bind="$attrs"
    :src="logoSrc"
    :lazy-src="logoSrc"
    alt="HestiaLabs logo"
    contain
  />
</template>
<script>
import { mapState } from 'vuex'
export default {
  name: 'LogoImg',
  props: {
    url: {
      type: String,
      default: ''
    }
  },
  computed: {
    ...mapState(['config']),
    logoSrc() {
      return this.url || this.config.logoImg || '/hestialabs-logo.svg'
    }
  }
}
</script>

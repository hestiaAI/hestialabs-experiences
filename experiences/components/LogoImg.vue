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
  computed: {
    ...mapState(['config']),
    logoSrc() {
      return this.config.logo || '/hestialabs-logo.svg'
    }
  }
}
</script>

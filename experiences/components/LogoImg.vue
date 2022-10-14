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
export default {
  name: 'LogoImg',
  computed: {
    logoSrc() {
      return this.$store.getters.siteConfig.logo || '/hestialabs-logo.svg'
    }
  }
}
</script>

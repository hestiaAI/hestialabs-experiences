<template>
  <VContainer>
    <TheDataSpaceMenu />
  </VContainer>
</template>

<script>
import mixinPage from '@/mixins/page'

export default {
  mixins: [mixinPage],
  head() {
    return this.vueMeta(this.$tc('Data Space', 2))
  }
}
</script>

<template>
  <TheDataExperience />
</template>

<script>
import { vueMeta } from '@/utils/utils'

export default {
  head() {
    const { title: t, subtitle: s } = this.$store.getters.experience(
      this.$route
    )
    const title = `${t}: ${s}`
    return vueMeta(this, title)
  }
}
</script>

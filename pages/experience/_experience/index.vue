<template>
  <TheDataExperience />
</template>

<script>
import validate from '@/pages/validate'
import { vueMeta } from '@/utils/utils'

export default {
  validate(context) {
    return validate.experience(context)
  },
  head() {
    const { title: t, subtitle: s } = this.$store.getters.experience(
      this.$route
    )
    const title = `${t}: ${s}`
    return vueMeta(this, title)
  }
}
</script>

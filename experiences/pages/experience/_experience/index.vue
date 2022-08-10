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
    const k =
      key => `experiences.${this.$route.params.experience}.intro.${key}`
    const { title } = this.$store.getters.experience(
      this.$route
    )
    const t = this.$tev(k('title'), title)
    const s = this.$tet(k('subtitle'), 'Data Experience')
    const metaTitle = `${t}: ${s}`
    return vueMeta(this, metaTitle)
  }
}
</script>

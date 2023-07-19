<template>
  <TheDataExperience
    v-bind="{
      experienceModule,
      siteConfig
    }"
  />
</template>

<script>
import colors from 'vuetify/lib/util/colors'
import experiences from '@/experiences'

export default {
  name: 'ExperienceView',
  components: {
  },
  data() {
    return {
      siteConfig: {
        i18nLocales: ['fr', 'en'],
        theme: {
          primary: colors.teal.darken2,
          secondary: colors.teal.lighten2
        },
        mapboxToken: 'pk.eyJ1IjoiYW5kcmVhc2t1bmRpZyIsImEiOiJja3ZxcnlmNXc2ZzUwMnFva2F2a3Q1azU5In0.NrvCU8OKlkwJOVFOgZzTzA'
      }
    }
  },
  computed: {
    experienceModule() {
      return experiences[this.$route.params.experience]
    }
  }
}
</script>

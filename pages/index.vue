<template>
  <div>
    <template v-if="enabledExperiences.length > 0">
      <h1>Discover our experiences!</h1>
      <the-data-experience-list :experiences="enabledExperiences" />
    </template>
    <br /><br /><br />
    <template v-if="disabledExperiences.length > 0">
      <h1>
        Future experiences (<a href="mailto:contact@hestialabs.org"
          >Contact us</a
        >)
      </h1>
      <the-data-experience-list :experiences="disabledExperiences" />
    </template>
  </div>
</template>
<script>
import TheDataExperienceList from '~/components/TheDataExperienceList'

export default {
  components: { TheDataExperienceList },
  computed: {
    enabledExperiences() {
      return this.$store.getters.manifests.filter(({ disabled }) => !disabled)
    },
    disabledExperiences() {
      return this.$store.getters.manifests.filter(({ disabled }) => disabled)
    }
  }
}
</script>
<style>
.v-card--link:before {
  background: none;
}
</style>

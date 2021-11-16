<template>
  <the-data-experience-list
    v-bind="{ enabledExperiences, disabledExperiences }"
  />
</template>
<script>
import TheDataExperienceList from '~/components/TheDataExperienceList'

export default {
  components: { TheDataExperienceList },
  props: {
    enabledExperiences: {
      type: Array,
      required: true
    },
    disabledExperiences: {
      type: Array,
      required: true
    }
  }
}
</script>
<style>
.v-card--link:before {
  background: none;
}
</style>

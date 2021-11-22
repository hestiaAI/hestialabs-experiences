<template>
  <the-data-experience-list :big="$vuetify.breakpoint.smAndUp" />
</template>
<script>
import TheDataExperienceList from '~/components/TheDataExperienceList'

export default {
  components: { TheDataExperienceList }
}
</script>
<style>
.v-card--link:before {
  background: none;
}
</style>

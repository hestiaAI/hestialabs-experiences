<template>
  <the-data-experience-list
    v-bind="{
      enabledExperiences,
      disabledExperiences,
      big: $vuetify.breakpoint.smAndUp
    }"
  />
</template>
<script>
export default {
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

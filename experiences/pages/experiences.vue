<template>
  <VContainer>
    <TheExperienceMenu
      :cards="$vuetify.breakpoint.smAndUp"
      :include="$store.state.config.experiences"
    />
  </VContainer>
</template>

<script>
export default {}
</script>

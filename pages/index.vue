<template>
  <VContainer>
    <TheExperienceMenu :cards="$vuetify.breakpoint.smAndUp" />
  </VContainer>
</template>

<style>
.v-card--link:before {
  background: none;
}
</style>

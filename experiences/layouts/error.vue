<template>
  <VContainer fluid class="mt-16">
    <VRow align="center" justify="center" class="flex-column">
      <h1 class="h1">
        {{ title }}
      </h1>
      <LogoImg max-width="300" class="my-12" />
      <BaseButton nuxt :to="localePath('index')" mdi-icon="mdiHome" text="Home Page" />
    </VRow>
  </VContainer>
</template>

<script>
export default {
  layout: 'empty',
  props: {
    error: {
      type: Object,
      default: () => ({})
    }
  },
  head() {
    return {
      title: this.title
    }
  },
  computed: {
    title() {
      return (
        this.error.message ||
        (this.error.statusCode === 404 ? '404 Not Found' : 'An error occurred')
      )
    }
  }
}
</script>

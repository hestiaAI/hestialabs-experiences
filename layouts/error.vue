<template>
  <v-container fluid>
    <v-row align="center" justify="center" class="flex-column">
      <h1 class="h1">{{ title }}</h1>
      <logo-img max-width="300" class="my-12" />

      <base-button nuxt to="/">
        <template #prepend-icon>
          <v-icon left>
            $vuetify.icons.mdiHome
          </v-icon>
        </template>
        Home page
      </base-button>
    </v-row>
  </v-container>
</template>

<script>
export default {
  layout: 'empty',
  props: {
    error: {
      type: Object,
      default: null
    }
  },
  head() {
    return {
      title: this.title
    }
  },
  computed: {
    title() {
      return this.error.statusCode === 404
        ? '404 Not Found'
        : 'An error occurred'
    }
  }
}
</script>

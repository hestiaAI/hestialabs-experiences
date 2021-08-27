<template>
  <v-container fluid>
    <v-row align="center" justify="center" class="flex-column">
      <h1 class="h1">{{ title }}</h1>
      <logo-img max-width="300" class="my-12" />

      <base-button nuxt to="/">
        <template #prepend-icon>
          <v-icon left>
            mdi-home
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
  data() {
    return {
      pageNotFound: '404 Not Found',
      otherError: 'An error occurred'
    }
  },
  head() {
    return {
      title: this.title
    }
  },
  computed: {
    title() {
      return this.error.statusCode === 404 ? this.pageNotFound : this.otherError
    }
  }
}
</script>

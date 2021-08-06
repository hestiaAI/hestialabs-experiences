<template>
  <v-app>
    <v-app-bar fixed app height="75">
      <v-toolbar-title>
        <nuxt-link
          to="/"
          class="d-flex align-center"
          style="text-decoration: none; color: inherit;"
        >
          <v-img
            src="https://hestialabs.org/assets/img/hestialabs-logo+text.svg"
            alt="HestiaLabs logo"
            class="mr-5"
            contain
            width="100"
          />
          <span>HestiaLabs Demo</span>
        </nuxt-link>
      </v-toolbar-title>
    </v-app-bar>
    <v-main>
      <v-container class="mt-5">
        <nuxt />
      </v-container>
    </v-main>
    <v-footer app absolute>
      <span>&copy; {{ new Date().getFullYear() }}</span>
    </v-footer>
  </v-app>
</template>

<script>
export default {
  data() {
    return {}
  },
  head() {
    return {
      meta: [
        {
          hid: 'og:url',
          property: 'og:url',
          content: `${process.env.baseUrl}${this.$route.path}`
        }
      ]
    }
  }
}
</script>

<!-- eslint-disable vue/no-v-html -->
<template>
  <div class="wrapper">
    <VContainer>
      <section v-for="content in contents" :key="content.id">
        <h3 class="page-title">
          {{ content.translations[$i18n.locale].title }}
        </h3>
        <p v-html="content.translations[$i18n.locale].body" />
      </section>
    </VContainer>
  </div>
</template>

<script>

import { mapState } from 'vuex'

export default {
  computed: {
    ...mapState(['pages']),
    url() {
      return this.$route.params.id
    },
    contents() {
      return this.pages[this.url]
    }
  },
  created() {
    // if the page not in the store we load it
    if (!this.contents) {
      this.$store.dispatch('loadPage', { pageId: this.url })
    }
  }
}
</script>
<style scoped>
.page-title {
  margin-top: 1em;
  margin-bottom: 1em;
  text-transform: uppercase;
  line-height: 1.5;
  font-size: 3.5rem;
  font-weight:bolder;
}
.wrapper {
  height: 100%;
  font-size: 1.5em;
  color: white;
  background-color: var(--v-primary-base) !important;
  word-break: break-word;
  border-bottom: white solid 1pt;
  padding-bottom: 6rem;
}
</style>

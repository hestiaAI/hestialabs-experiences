<!-- eslint-disable vue/no-v-text-v-html-on-component -->
<!-- eslint-disable vue/no-v-html -->
<template>
  <div class="wrapper">
    <VContainer>
      <section v-for="content in contents" :key="content.id" class="mb-3">
        <h3 class="page-title">
          {{ content.translations[$i18n.locale].title }}
        </h3>
        <p v-html="content.translations[$i18n.locale].body" />

        <VRow class="mt-6">
          <VCol v-for="relatedPage in content.related_pages" :key="relatedPage" cols="12" md="6" lg="3">
            <template v-if="pages[relatedPage]">
              <VCard class="pa-3" height="100%" color="primary" flat :to="pages[relatedPage].url_name">
                <VImg
                  :src="$assetURL(pages[relatedPage].thumbnail)"
                  height="200px"
                  class="card-image"
                  cover
                />
                <VCardTitle class="card-title">
                  {{ pages[relatedPage].translations[$i18n.locale].title }}
                </VCardTitle>

                <VCardSubtitle class="card-subtitle" v-html="pages[relatedPage].translations[$i18n.locale].description" />
              </VCard>
            </template>
          </VCol>
        </VRow>
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
    page() {
      return this.pages[this.url]
    },
    contents() {
      const contents = this.page?.contents || []

      contents.forEach((c) => {
        const relatedPages = c.related_pages || []
        relatedPages.forEach((url) => {
          this.$store.dispatch('loadPage', { pageId: url })
        })
      })
      return contents
    }
  },
  created() {
    // if the page not in the store we load it
    if (!this.page) {
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

.card-image {
  border-radius: 4px;
}

.card-title {
  margin-top: 1em;
  margin-bottom: 1em;
  text-transform: uppercase;
  line-height: 1.5;
  font-size: 1.5rem;
  font-weight:bolder;
  text-decoration: underline;
  color: white;
}

.card-subtitle {
  color: white !important;
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

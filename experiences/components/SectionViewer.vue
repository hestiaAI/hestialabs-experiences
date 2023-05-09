<!-- eslint-disable vue/no-v-text-v-html-on-component -->
<!-- eslint-disable vue/no-v-html -->
<template>
  <div>
    <div class="content-wrapper">
      <p v-html="content.translations[$i18n.locale].body" />
    </div>
    <div v-for="view in content.views" :key="view.id" class="mt-6">
      <ViewBlock v-for="viewBlockProp in viewBlockProps" :key="viewBlockProp.id" v-bind="{ ...viewBlockProp, mapboxToken:'pk.eyJ1IjoiYW5kcmVhc2t1bmRpZyIsImEiOiJja3ZxcnlmNXc2ZzUwMnFva2F2a3Q1azU5In0.NrvCU8OKlkwJOVFOgZzTzA' }" />
    </div>
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
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { ViewBlock } from 'data-experience'
import JSZip from 'jszip'
export default {
  props: {
    content: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      data: null
    }
  },
  computed: {
    ...mapState(['pages', 'experiences']),
    viewBlockProps() {
      if (this.data) {
        return this.content.views.reduce((acc, view) => {
          if (this.experiences[view.experience.experience_id]) {
            acc.push(ViewBlock.buildProps(this.data, { config: this.experiences[view.experience.experience_id] }, view.name))
          }
          return acc
        }, [])
      } else {
        return []
      }
    }
  },
  created() {
    const zipLoader = new JSZip()
    Promise.all(this.content.views.map((view) => {
      return fetch(this.$assetURL(this.content.datasets[0].zip_file))
        .then(res => res.blob())
        .then(blob => zipLoader.loadAsync(blob))
        .then(zip => zip.file(`block0${view.position}.json`).async('string'))
        .then(json => JSON.parse(json).result)
    })).then(([data]) => {
      this.data = data
    })
  },
  methods: {
    async fetchDatasets() {

    }
  }
}
</script>
<style scoped>
.content-wrapper /deep/ h1 {
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

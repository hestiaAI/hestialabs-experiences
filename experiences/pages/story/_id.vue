<!-- eslint-disable vue/no-v-text-v-html-on-component -->
<!-- eslint-disable vue/no-v-html -->
<template>
  <div class="wrapper">
    <VContainer>
      <section v-for="content in sections" :key="content.id" class="mb-3">
        <SectionViewer :content="content" />
      </section>
    </VContainer>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { ViewBlock } from 'data-experience'
import SectionViewer from '@/components/SectionViewer.vue'
export default {
  components: {
    SectionViewer
  },
  data() {
    return {
      data: null
    }
  },
  computed: {
    ...mapState(['pages', 'experiences']),
    url() {
      return this.$route.params.id
    },
    page() {
      return this.pages[this.url]
    },
    sections() {
      const content = this.page?.content || []

      content.forEach((c) => {
        const relatedPages = c.related_pages || []
        relatedPages.forEach((url) => {
          this.$store.dispatch('loadPage', { pageId: url })
        })
      })
      return content
    },
    viewBlockProps() {
      if (this.data && this.experiences.twitter) {
        return ViewBlock.buildProps(this.data, { config: this.experiences.twitter }, 'overview')
      } else {
        return null
      }
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

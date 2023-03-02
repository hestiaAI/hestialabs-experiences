<template>
  <div
    v-if="loading"
    v-t="'Loading'"
  />
  <div v-else>
    <div class="explorer__content">
      <CodeEditor
        v-if="rawText != ''"
        :value="rawText"
        :language="language"
        readonly
        line-numbers
        height="100%"
      />
    </div>
  </div>
</template>

<script>
import mixin from './mixin'
import mixinLoading from './mixin-loading'
import CodeEditor from '@/components/misc/CodeEditor.vue'

export default {
  name: 'UnitFileExplorerViewerRaw',
  components: { CodeEditor },
  mixins: [mixin, mixinLoading],
  data() {
    return {
      rawText: '',
      loading: true,
      error: false
    }
  },
  computed: {
    language() {
      switch (this.filename.split('.').pop()) {
        case 'json': return 'json'
        default: return 'text'
      }
    }
  },
  watch: {
    filename: {
      async handler(filename) {
        await this.getContentFromFilename(filename)
      },
      immediate: true
    }
  },
  methods: {
    async getContentFromFilename(filename) {
      this.setLoading(true)
      this.rawText = await this.fileManager.getPreprocessedText(filename)
      this.setLoading(false)
    }
  }
}
</script>

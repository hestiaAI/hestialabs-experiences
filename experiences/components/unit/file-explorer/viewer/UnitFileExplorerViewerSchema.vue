<template>
  <div v-if="error">
    <p class="mt-3">
      Could not find a schema for this file, please contact us if you need it.
    </p>
  </div>
  <div v-else>
    <BaseSchemaTree :schema="jsonSchema" />
    <div class="text-center">
      <div v-if="!isValidPaths">
        {{ $t(k('invalid-paths')) }}
      </div>
      <BaseButton
        class="ma-3"
        :disabled="!isValidPaths"
        @click="buildTable"
      >
        {{ $t(k('Create table')) }}
      </BaseButton>
      <div v-if="isLoading">
        <BaseProgressCircular />
      </div>
      <div v-else-if="processed">
        <UnitFilterableTable
          v-bind="{headers, items}"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import mixin from './mixin'

export default {
  name: 'UnitFileExplorerViewerRaw',
  mixins: [mixin],
  data() {
    return {
      jsonSchema: {},
      error: false,
      isLoading: false,
      processed: false,
      headers: [],
      items: []
    }
  },
  computed: {
    ...mapGetters(['selectedPaths']),
    // Check that the selected paths can be converted to an array
    isValidPaths() {
      const toCheck = [...this.selectedPaths]
      let allGood = true
      while (toCheck.length && allGood) {
        const path1 = toCheck.pop()
        allGood = toCheck.every(path2 => this.validPaths(path1, path2))
      }
      return allGood
    }
  },
  watch: {
    filename: {
      async handler(filename) {
        await this.fetchSchema(filename)
      },
      immediate: true
    },
    selectedPaths() {
      this.processed = false
    }
  },
  methods: {
    k(key) {
      return `file-explorer.viewer.schema.${key}`
    },
    fetchSchema(filename) {
      // Try to fetch the schema if it exist
      try {
        this.jsonSchema = this.$store.getters.experience(this.$route).dataModel['@graph'].filter(item => filename.endsWith(item.fileName))[0] || {}
      } catch (e) {
        this.error = true
      }
    },
    // Check that arrays from path1 and path2 are all in the same tree branch
    validPaths(path1, path2) {
      if (!path1 || !path2) { return false }
      const getNbArrays = path => [...path.matchAll(/\[(:?\*)\]/g)].length
      const smallerArray = getNbArrays(path1) < getNbArrays(path2) ? path1 : path2
      const equalIdx = smallerArray.lastIndexOf('[*]') || 0
      return path1.slice(0, equalIdx) === path2.slice(0, equalIdx)
    },
    async buildTable() {
      this.isLoadind = true
      this.headers = this.selectedPaths.map(a => a.split('.').pop())
      this.items = await this.fileManager.findAllMatchingObjects(this.filename, this.selectedPaths)
      this.processed = true
      this.isLoadind = false
    }
  }
}
</script>

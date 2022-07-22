<template>
  <div v-if="error">
    <p>Could not find a schema for this file</p>
  </div>
  <div v-else>
    <BaseSchemaTree :schema="jsonSchema" />
    <div class="text-center">
      <div v-if="!isValidPaths">
        Cannot create table with those accessors
      </div>
      <VBtn
        class="ma-3"
        :disabled="!isValidPaths"
        @click="buildTable"
      >
        Create Table
      </VBtn>
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
import { mapState } from 'vuex'
import mixin from './mixin'
import BaseSchemaTree from '@/components/base/BaseSchemaTree.vue'
import BaseProgressCircular from '@/components/base/BaseProgressCircular.vue'
export default {
  name: 'UnitFileExplorerViewerRaw',
  components: { BaseSchemaTree, BaseProgressCircular },
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
    ...mapState(['selectedPaths']),
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
    }
  },
  methods: {
    fetchSchema(filename) {
      try {
        this.jsonSchema = this.$store.getters.experience(this.$route).dataModel['@graph'].filter(item => filename.endsWith(item.fileName))[0] || {}
        const items = []
        // this.visitNode(this.jsonSchemaFile, jsonSchemaKey, items)
        this.items = items
      } catch (e) {
        console.error(e)
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

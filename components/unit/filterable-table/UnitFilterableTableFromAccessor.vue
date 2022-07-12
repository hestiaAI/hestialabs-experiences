<template>
  <UnitFilterableTable
    v-bind="{headers, items}"
  />
</template>
<script>

import { mapState } from 'vuex'
import UnitFilterableTable from './UnitFilterableTable.vue'
export default {
  components: { UnitFilterableTable },
  props: {
    accessor: {
      type: Object,
      required: true,
      validator(accessor) {
        // The value must match one of these strings
        return accessor.filePath && accessor.jsonPath
      }
    }
  },
  data() {
    return {
      items: [],
      jsonPaths: [],
      errors: false
    }
  },
  computed: {
    ...mapState(['fileManager']),
    headers() {
      return this.jsonPaths.map(a => a.split('.').pop())
    }
  },
  watch: {
    accessor: {
      immediate: true,
      handler() {
        this.fetchSchema()
      }
    }
  },
  methods: {
    async fetchSchema() {
      const jsonSchema = this.$store.getters.experience(this.$route).dataModel
      const jsonSchemaKey = Object.keys(jsonSchema).filter(k => this.accessor.filePath.endsWith(jsonSchema[k].filename))[0]
      const jsonSchemaFile = jsonSchema[jsonSchemaKey]
      this.jsonPaths = []
      this.getLeafPaths(jsonSchemaFile, jsonSchemaKey, this.jsonPaths)
      if (this.checkPathsValid) {
        this.items = await this.fileManager.findAllMatchingObjects(this.accessor.filePath, this.jsonPaths)
      } else {
        this.error = true
      }
    },
    getLeafPaths(node, nodeKey, array, found) {
      if (nodeKey === `${this.accessor.filePath}:${this.accessor.jsonPath}`) {
        found = true
      }
      if (this.isEmpty(node?.traversal) && found) {
        array.push(nodeKey.split(':')[1])
      } else {
        Object.keys(node.traversal).forEach(k => this.getLeafPaths(node.traversal[k], k, array, found))
      }
    },
    isEmpty(obj) {
      return obj && Object.keys(obj).length === 0
    },
    checkPathsValid() {
      console.log(this.jsonPaths)
      return true
    }
  }
}
</script>

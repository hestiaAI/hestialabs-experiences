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
    filename: {
      type: String,
      required: true
    },
    jsonPaths: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      items: []
    }
  },
  computed: {
    ...mapState(['fileManager']),
    headers() {
      return this.jsonPaths.map(a => a.split('.').pop())
    }
  },
  watch: {
    jsonPaths: {
      immediate: true,
      handler() {
        this.fetchItems()
      }
    }
  },
  methods: {
    async fetchItems() {
      this.items = await this.fileManager.findAllMatchingObjects(this.filename, this.jsonPaths)
    }
  }
}
</script>

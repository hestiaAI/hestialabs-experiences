<template>
  <UnitFilterableTable
    v-bind="{headers, items}"
  />
</template>
<script>

import { mapState } from 'vuex'
import UnitFilterableTable from './UnitFilterableTable.vue'
import { createAccessor } from '@/utils/accessor'
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
      const items = await Promise.all(this.jsonPaths.map(async(jsonPath) => {
        const accessor = createAccessor(this.filename, jsonPath)
        const values = await this.fileManager.findMatchingObjects(accessor)
        console.log(values)
        return values
      }))
      console.log(items)
    }
  }
}
</script>

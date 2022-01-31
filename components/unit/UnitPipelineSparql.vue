<template>
  <div></div>
</template>

<script>
import mixin from './mixin-pipeline'
import quadstore from '@/utils/sparql'

export default {
  mixins: [mixin],
  props: {
    sparqlQuery: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      progress: false
    }
  },
  computed: {
    disabled() {
      return !this.sparqlQuery
    }
  },
  async beforeMount() {
    await this.run()
  },
  methods: {
    async run() {
      try {
        this.progress = true
        const result = await quadstore.select(this.sparqlQuery)
        this.$emit('update', { result })
      } catch (error) {
        this.$emit('update', { error })
      } finally {
        this.progress = false
      }
    }
  }
}
</script>

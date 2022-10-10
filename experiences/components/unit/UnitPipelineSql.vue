<template>
  <div />
</template>

<script>
import { mapState } from '@/utils/store-helper'
import mixin from './mixin-pipeline'
import { setTimeoutPromise } from '@/utils/utils'

export default {
  name: 'UnitPipelineSql',
  mixins: [mixin],
  props: {
    sql: {
      type: String,
      required: true
    }
  },
  computed: {
    ...mapState(['currentDB']),
    disabled() {
      return !this.currentDB || !this.sql
    }
  },
  mounted() {
    console.log('UnitPipelineSQL')
  },
  methods: {
    async run() {
      this.progress = true
      await setTimeoutPromise(1)
      try {
        const result = this.currentDB.select(this.sql)
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

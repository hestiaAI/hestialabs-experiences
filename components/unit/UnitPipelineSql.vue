<template>
  <div />
</template>

<script>
import { mapState } from 'vuex'
import mixin from './mixin-pipeline'
import { setTimeoutPromise } from '@/utils/utils'

export default {
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

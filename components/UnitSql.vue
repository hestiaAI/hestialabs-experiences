<template>
  <VContainer>
    <VRow v-if="parameterName">
      <VCol cols="4" class="mx-auto">
        <VTextField
          v-model="parameter"
          :label="parameterName"
          class="my-sm-2 mr-sm-2"
        />
      </VCol>
    </VRow>
  </VContainer>
</template>

<script>
import mixin from './unit/mixin-pipeline'
import db from '@/utils/sql'
import { setTimeoutPromise } from '@/utils/utils'

export default {
  mixins: [mixin],
  props: {
    sql: {
      type: String,
      required: true
    },
    parameterName: {
      type: String,
      default: ''
    },
    parameterKey: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      progress: false,
      parameter: ''
    }
  },
  computed: {
    disabled() {
      return !this.sql
    }
  },
  methods: {
    async run() {
      this.progress = true
      await setTimeoutPromise(1)
      try {
        const params = { [this.parameterKey]: this.parameter }
        const { headers, items } = db.select(this.sql, params)
        this.$emit('update', { headers, items })
      } catch (error) {
        console.error(error)
        this.$emit('update', { error })
      } finally {
        this.progress = false
      }
    }
  }
}
</script>

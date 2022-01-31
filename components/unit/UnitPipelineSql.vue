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
import { mapGetters } from 'vuex'
import mixin from './mixin-pipeline'
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
    ...mapGetters(['currentDB']),
    disabled() {
      return !this.currentDB || !this.sql
    }
  },
  async beforeMount() {
    await this.run()
  },
  methods: {
    async run() {
      this.progress = true
      await setTimeoutPromise(1)
      try {
        const params = { [this.parameterKey]: this.parameter }
        const result = this.currentDB.select(this.sql, params)
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

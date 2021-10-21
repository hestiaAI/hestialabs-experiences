<template>
  <div>
    <template v-if="$store.state.power">
      <h2 class="my-3">Custom Pipeline</h2>
    </template>

    <template v-else>
      <div v-if="progress" align="center">
        <base-progress-circular class="mr-2" />
        <span>Processing...</span>
      </div>
    </template>
  </div>
</template>

<script>
import { processError } from '@/utils/utils'
import customPipelines from '~/manifests/custom-pipeline'

export default {
  props: {
    inputFiles: {
      type: Object,
      required: true
    },
    customPipeline: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      message: '',
      status: false,
      error: false,
      progress: false,
      code: ''
    }
  },
  computed: {
    disabled() {
      return !this.inputFiles
    }
  },
  watch: {
    inputFiles: {
      immediate: true,
      handler(inputFiles) {
        this.runQuery()
      }
    }
  },
  methods: {
    async runQuery() {
      this.message = ''
      this.error = false
      this.progress = true
      try {
        const { headers, items } = await customPipelines[this.customPipeline](
          this.inputFiles
        )
        this.$emit('update', { headers, items })
      } catch (error) {
        console.error(error)
        this.error = true
        this.message = processError(error)
        this.$emit('update', { error })
      } finally {
        this.status = true
        this.progress = false
      }
    }
  }
}
</script>

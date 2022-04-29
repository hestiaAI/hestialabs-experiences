<template>
  <div v-if="customPipelineOptions">
    <div v-if="options" class="d-flex justify-center">
      <VSwitch v-model="optionsVisible" label="Edit options" />
    </div>
    <VExpandTransition>
      <div
        v-if="optionsVisible"
        class="d-flex flex-column justify-center align-center"
      >
        <CodeEditor :value.sync="options" language="json" />
        <BaseButton
          v-bind="{ progress, status, error, disabled }"
          text="Run"
          icon="mdiStepForward"
          @click="run"
        />
      </div>
    </VExpandTransition>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import mixin from './mixin-pipeline'
import { setTimeoutPromise } from '@/utils/utils'

export default {
  mixins: [mixin],
  props: {
    customPipeline: {
      type: [String, Function],
      required: true
    },
    customPipelineOptions: {
      type: [Object, Array],
      default: undefined
    }
  },
  data() {
    return {
      status: false,
      error: false,
      code: '',
      options: '',
      optionsVisible: false,
      pipeline: this.customPipeline
    }
  },
  computed: {
    ...mapState(['fileManager']),
    disabled() {
      return this.fileManager === null
    }
  },
  watch: {
    options() {
      this.status = false
    },
    async customPipelineOptions() {
      this.updateOptions()
      await this.run()
    }
  },
  async created() {
    const { customPipeline: pipe } = this
    if (typeof pipe === 'string') {
      const { [pipe]: pipeline } = await import('@/manifests/generic-pipelines')
      this.pipeline = pipeline
    }
  },
  beforeMount() {
    this.updateOptions()
  },
  methods: {
    updateOptions() {
      const optionsObject = this.customPipelineOptions
      if (optionsObject) {
        this.options = JSON.stringify(optionsObject, null, 2)
      }
    },
    async run() {
      this.error = false
      this.progress = true
      await setTimeoutPromise(1)
      try {
        const optionsObject = JSON.parse(this.options || 'null')
        const result = await this.pipeline({
          fileManager: this.fileManager,
          options: optionsObject
        })
        if (!result) {
          throw new Error(
            `The pipeline returned an invalid result (${result}). We apologize for the inconvenience. We would greatly appreciate if you could report this error via e-mail to contact@hestialabs.org. Thank you :)`
          )
        }
        this.$emit('update', { result })
      } catch (error) {
        this.error = true
        this.$emit('update', { error })
      } finally {
        this.status = true
        this.progress = false
      }
    }
  }
}
</script>

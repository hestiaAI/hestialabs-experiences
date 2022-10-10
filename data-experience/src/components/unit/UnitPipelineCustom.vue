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
        <CodeEditor v-model:value="options" language="json" />
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
import { mapState } from '@/utils/store-helper'
import mixin from './mixin-pipeline'
import { setTimeoutPromise } from '@/utils/utils'
import CodeEditor from '@/components/CodeEditor.vue'
import BaseButton from '@/components/base/button/BaseButton.vue'
export default {
  name: 'UnitPipelineCustom',
  components: { CodeEditor, BaseButton },
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
      const { [pipe]: pipeline } = await import('~/utils/generic-pipelines')
      this.pipeline = pipeline
    }
  },
  beforeMount() {
    this.updateOptions()
  },
  methods: {
    updateOptions() {
      const { customPipelineOptions: obj } = this
      if (obj) {
        this.options = JSON.stringify(obj, null, 2)
      }
    },
    async run() {
      this.error = false
      this.progress = true
      await setTimeoutPromise(1)
      try {
        const options = JSON.parse(this.options || 'null')
        const result = await this.pipeline({
          fileManager: this.fileManager,
          options
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

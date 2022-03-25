<template>
  <div v-if="customPipelineOptions.length">
    <VRow v-if="parameterName">
      <VCol cols="4" class="mx-auto">
        <VTextField
          v-model="parameter"
          :label="parameterName"
          class="my-sm-2 mr-sm-2"
        ></VTextField>
      </VCol>
    </VRow>
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
import { mapGetters } from 'vuex'
import mixin from './mixin-pipeline'
import { setTimeoutPromise } from '@/utils/utils'

export default {
  mixins: [mixin],
  props: {
    customPipeline: {
      type: Function,
      required: true
    },
    parameterName: {
      type: String,
      default: () => ''
    },
    customPipelineOptions: {
      type: [Object, Array],
      default: () => []
    }
  },
  data() {
    return {
      status: false,
      error: false,
      progress: false,
      code: '',
      parameter: '',
      options: '',
      optionsVisible: false
    }
  },
  computed: {
    ...mapGetters(['fileManager']),
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
  async beforeMount() {
    this.updateOptions()
    await this.run()
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
        const result = await this.customPipeline({
          fileManager: this.fileManager,
          parameter: this.parameter,
          options: optionsObject
        })
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

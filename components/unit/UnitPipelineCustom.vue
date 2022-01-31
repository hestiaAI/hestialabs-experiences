<template>
  <div>
    <VRow v-if="parameterName">
      <VCol cols="4" class="mx-auto">
        <VTextField
          v-model="parameter"
          :label="parameterName"
          class="my-sm-2 mr-sm-2"
        ></VTextField>
      </VCol>
    </VRow>
    <VRow>
      <VSpacer />
      <VCol align="center">
        <BaseButton
          v-bind="{ progress, status, error }"
          text="Run"
          icon="mdiStepForward"
          class="ma-sm-2"
          :disabled="disabled"
          @click="runPipeline"
        />
      </VCol>
      <VCol v-if="options">
        <VSwitch v-model="optionsVisible" label="Edit options" />
      </VCol>
      <VSpacer />
    </VRow>
    <VExpandTransition>
      <VRow v-show="optionsVisible">
        <VCol>
          <CodeEditor :value.sync="options" language="json" />
        </VCol>
      </VRow>
    </VExpandTransition>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { setTimeoutPromise } from '@/utils/utils'

export default {
  props: {
    customPipeline: {
      type: Function,
      required: true
    },
    parameterName: {
      type: String,
      default: ''
    },
    defaultViewElements: {
      type: Object,
      required: true
    },
    autoRun: {
      type: Boolean,
      default: false
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
      optionsVisible: false,
      disabled: false
    }
  },
  computed: {
    ...mapGetters(['fileManager'])
  },
  watch: {
    options() {
      this.status = false
    },
    fileManager() {
      this.disabled = this.fileManager === null
    },
    defaultViewElements: {
      handler() {
        const optionsObject = this.defaultViewElements.customPipelineOptions
        if (optionsObject) {
          this.options = JSON.stringify(optionsObject, null, 2)
        }
        if (this.autoRun) {
          this.runPipeline()
        }
      },
      immediate: true
    }
  },
  methods: {
    async runPipeline() {
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

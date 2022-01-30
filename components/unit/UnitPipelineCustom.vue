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
    <div v-if="options" class="d-flex justify-center">
      <VSwitch v-model="optionsVisible" label="Edit options" />
    </div>
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
import mixin from './mixin-pipeline'
import FileManager from '~/utils/file-manager'
import { setTimeoutPromise } from '@/utils/utils'

export default {
  mixins: [mixin],
  props: {
    fileManager: {
      type: FileManager,
      required: true
    },
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
    }
  },
  data() {
    return {
      progress: false,
      code: '',
      parameter: '',
      options: '',
      optionsVisible: false
    }
  },
  watch: {
    async options() {
      // auto-run pipeline if options are edited
      await this.run()
    },
    'defaultViewElements.customPipelineOptions'() {
      this.updateOptions()
    }
  },
  beforeMount() {
    this.updateOptions()
  },
  methods: {
    updateOptions() {
      const optionsObject = this.defaultViewElements.customPipelineOptions
      if (optionsObject) {
        this.options = JSON.stringify(optionsObject, null, 2)
      }
    },
    async run() {
      this.progress = true
      await setTimeoutPromise(1)
      try {
        const optionsObject = JSON.parse(this.options || 'null')
        const result = await this.customPipeline({
          fileManager: this.fileManager,
          manifest: this.$store.getters.manifest(this.$route),
          parameter: this.parameter,
          options: optionsObject
        })
        this.$emit('update', result)
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

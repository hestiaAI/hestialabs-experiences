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
      <VCol align="center">
        <BaseButton
          v-bind="{ progress, status, error }"
          text="Run"
          icon="mdiStepForward"
          class="ma-sm-2"
          @click="runPipeline"
        />
      </VCol>
    </VRow>
  </div>
</template>

<script>
import FileManager from '~/utils/file-manager'

export default {
  name: 'UnitCustomPipeline',
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
    }
  },
  data() {
    return {
      status: false,
      error: false,
      progress: false,
      code: '',
      parameter: ''
    }
  },
  methods: {
    runPipeline() {
      this.error = false
      this.progress = true
      setTimeout(async () => {
        try {
          const result = await this.customPipeline(
            this.fileManager,
            this.$store.getters.manifest(this.$route),
            this.parameter
          )
          this.$emit('update', result)
        } catch (error) {
          console.error(error)
          this.error = true
          this.$emit('update', { error })
        } finally {
          this.status = true
          this.progress = false
        }
      }, 1)
    }
  }
}
</script>

<template>
  <div>
    <template v-if="$store.state.power">
      <h2 class="my-3">Custom Pipeline</h2>
    </template>

    <template v-else>
      <template v-if="parameterName">
        <v-row>
          <v-col cols="4" class="mx-auto">
            <v-text-field
              v-model="parameter"
              :label="parameterName"
              class="my-sm-2 mr-sm-2"
            ></v-text-field>
          </v-col>
        </v-row>
        <v-row>
          <v-col align="center">
            <base-button
              text="Run"
              icon="mdiStepForward"
              class="ma-sm-2"
              @click="runQuery"
            />
          </v-col>
        </v-row>
      </template>

      <div v-if="progress" align="center">
        <base-progress-circular class="mr-2" />
        <span>Processing...</span>
      </div>
    </template>
  </div>
</template>

<script>
import { processError } from '@/utils/utils'

export default {
  props: {
    inputFiles: {
      type: Object,
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
      message: '',
      status: false,
      error: false,
      progress: false,
      code: '',
      parameter: ''
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
        if (!this.parameterName) {
          this.runQuery()
        }
      }
    }
  },
  methods: {
    runQuery() {
      this.message = ''
      this.error = false
      this.progress = true
      try {
        const { headers, items } = this.customPipeline(
          this.inputFiles,
          this.parameter
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

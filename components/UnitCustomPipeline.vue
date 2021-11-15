<template>
  <div>
    <template v-if="$store.state.power">
      <h2 class="my-3">Custom Pipeline</h2>
    </template>

    <template v-else>
      <v-row v-if="parameterName">
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
            v-bind="{ progress, status, error }"
            text="Run"
            icon="mdiStepForward"
            class="ma-sm-2"
            @click="runPipeline"
          />
        </v-col>
      </v-row>
    </template>
  </div>
</template>

<script>
import { processError } from '@/utils/utils'
import FileManager from '~/utils/file-manager'
import BaseButton from '~/components/BaseButton'

export default {
  name: 'UnitCustomPipeline',
  components: { BaseButton },
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
    manifest: {
      type: Object,
      default: () => {}
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
  methods: {
    runPipeline() {
      this.message = ''
      this.error = false
      this.progress = true
      setTimeout(async () => {
        try {
          const { headers, items } = await this.customPipeline(
            this.fileManager,
            this.$store.getters.manifest(this.$route),
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
      }, 1)
    }
  }
}
</script>

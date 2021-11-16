<template>
  <v-container>
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
          v-bind="{ progress, status, error, disabled }"
          text="Run"
          icon="mdiStepForward"
          class="ma-sm-2"
          @click="runQuery"
        />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { processError } from '@/utils/utils'
import db from '@/utils/sql'

export default {
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
      message: '',
      status: false,
      error: false,
      progress: false,
      parameter: ''
    }
  },
  computed: {
    disabled() {
      return !this.sql
    }
  },
  methods: {
    runQuery() {
      this.message = ''
      this.error = false
      this.progress = true
      setTimeout(() => {
        try {
          const params = { [this.parameterKey]: this.parameter }
          const { headers, items } = db.select(this.sql, params)
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

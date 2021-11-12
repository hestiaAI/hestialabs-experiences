<template>
  <v-container>
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
    }
  },
  data() {
    return {
      message: '',
      status: false,
      error: false,
      progress: false
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
      try {
        const { headers, items } = db.select(this.sql)
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

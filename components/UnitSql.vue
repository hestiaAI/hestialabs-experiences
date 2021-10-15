<template>
  <div>
    <template v-if="$store.state.power">
      <h2 class="my-3">SQL</h2>
    </template>

    <template v-else>
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
    </template>
  </div>
</template>

<script>
import * as csv from '@fast-csv/parse'
import { processError } from '@/utils/utils'

export default {
  props: {
    data: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      message: '',
      status: false,
      error: false,
      progress: false,
      code: ''
    }
  },
  computed: {
    disabled() {
      return !this.data
    }
  },
  methods: {
    async runQuery() {
      try {
        const { headers, items } = await new Promise(resolve => {
          const items = []
          csv
            .parseString(this.data, { headers: true })
            .on('data', row => items.push(row))
            .on('end', () => resolve({ headers: Object.keys(items[0]), items }))
        })
        this.message = ''
        this.error = false
        this.progress = true
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

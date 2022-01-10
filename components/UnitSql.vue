<template>
  <VContainer>
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
          v-bind="{ progress, status, error, disabled }"
          text="Run"
          icon="mdiStepForward"
          class="ma-sm-2"
          @click="runQuery"
        />
      </VCol>
    </VRow>
  </VContainer>
</template>

<script>
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

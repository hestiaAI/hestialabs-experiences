<template>
  <BaseButton
    v-bind="{ progress, status, error, disabled, text, icon }"
    @click="run"
  />
</template>

<script>
/**
 * BaseProgressButton provides an abstraction for the progress, status and error properties of the BaseButton.
 * It expects a function f to be run along with its arguments args, and emits a click event containing the result.
 */
export default {
  props: {
    text: {
      type: String,
      default: ''
    },
    icon: {
      type: String,
      default: null
    },
    disabled: {
      type: Boolean,
      default: false
    },
    f: {
      type: Function,
      default: null
    },
    args: {
      type: Array,
      default: null
    }
  },
  data() {
    return {
      progress: false,
      status: false,
      error: false
    }
  },
  methods: {
    async run() {
      this.progress = true
      this.status = false
      this.error = false
      try {
        const value = await this.f(...this.args)
        this.$emit('click', { value })
      } catch (error) {
        console.error(error)
        this.error = true
        this.$emit('click', { error })
      }
      this.status = true
      this.progress = false
    }
  }
}
</script>

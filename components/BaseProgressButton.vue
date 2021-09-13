<template>
  <base-button
    v-bind="{ progress, status, error, disabled, text, icon }"
    @click="run"
  />
</template>

<script>
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

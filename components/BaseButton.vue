<template>
  <v-btn outlined v-bind="$attrs" class="my-2" @click="run">
    <v-icon v-if="icon" left>{{ mdiIcon }}</v-icon>
    <slot>
      <span>{{ text }}</span>
    </slot>
    <base-progress-circular v-if="progress" class="ml-2" />
    <status-indicator v-else-if="status" :error="error" />
  </v-btn>
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
      status: false,
      error: false,
      progress: false
    }
  },
  computed: {
    mdiIcon() {
      return this.$vuetify.icons.values[this.icon]
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

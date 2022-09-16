<template>
  <div>
    <button @click="increment" style="background-color:grey">{{ text }}</button>
  </div>
</template>

<script>
export default {
  computed: {
    times() {
      return this.$store.getters.counter > 1
        ? 'times'
        : 'time'
    },
    text() {
      return `I have been clicked ${this.$store.getters.counter} ${this.times}`
    }
  },
  methods: {
    increment() {
      this.$store.commit('increment')
    }
  }
}
</script>

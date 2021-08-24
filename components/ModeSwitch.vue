<template>
  <v-switch v-model="model" inset label="Advanced view" hide-details />
</template>

<script>
import { mapState } from 'vuex'

export default {
  data() {
    return {
      model: this.power
    }
  },
  computed: {
    ...mapState(['power'])
  },
  watch: {
    power: {
      immediate: true,
      handler(value) {
        this.model = value
      }
    },
    model(value) {
      this.$store.commit('updatePower', value)
      if (!value && this.$route.params.key === 'playground') {
        // exiting power mode while currently in Playground
        // -> switch to home page
        this.$router.push('/')
      }
    }
  }
}
</script>

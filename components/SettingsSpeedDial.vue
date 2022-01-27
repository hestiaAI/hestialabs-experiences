<template>
  <VSpeedDial
    v-model="fab"
    bottom
    right
    direction="top"
    open-on-hover
    transition="slide-y-reverse-transition"
    fixed
  >
    <template #activator>
      <VBtn v-model="fab" color="primary" dark fab>
        <VIcon v-if="fab"> $vuetify.icon.mdiClose </VIcon>
        <VIcon v-else> $vuetify.icon.mdiCog </VIcon>
      </VBtn>
    </template>
    <BaseButtonShare
      fab
      dark
      small
      color="blue darken-2"
      button-text=""
      :outlined="false"
      tooltip="Share"
    />
    <BaseButton
      icon="mdiClose"
      text=""
      fab
      dark
      small
      tooltip="Clear all"
      color="red"
      :outlined="false"
      @click="$store.commit('clearStore')"
    />
  </VSpeedDial>
</template>

<script>
export default {
  name: 'SettingsSpeedDial',
  props: {},
  data() {
    return {
      fab: false
    }
  },
  methods: {
    handleError(error) {
      console.error(error)
      this.error = true
      this.message = error instanceof Error ? error.message : error
      this.progress = false
    }
  }
}
</script>

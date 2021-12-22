<template>
  <VDialog v-model="show" width="80%" persistent scrollable>
    <VCard>
      <VCardTitle class="text-h5 grey lighten-2"> Select files </VCardTitle>

      <VCardText style="height: 500px">
        <UnitFileExplorer v-bind="{ fileManager, selectable: true }" />
      </VCardText>

      <VDivider></VDivider>

      <VCardActions>
        <VSpacer></VSpacer>
        <VBtn color="primary" text @click="clear"> Clear selection </VBtn>
        <VBtn color="primary" text @click="ok"> OK </VBtn>
      </VCardActions>
    </VCard>
  </VDialog>
</template>

<script>
import FileManager from '~/utils/file-manager.js'

export default {
  props: {
    fileManager: {
      type: FileManager,
      required: true
    },
    value: {
      type: Boolean,
      required: true
    }
  },
  computed: {
    show: {
      get() {
        return this.value
      },
      set(value) {
        this.$emit('input', value)
      }
    },
    key() {
      return this.$route.params.key
    }
  },
  methods: {
    ok() {
      this.show = false
      this.$emit('return', { clear: false })
    },
    clear() {
      this.$store.commit('setSelectedFiles', { key: this.key, value: [] })
      this.show = false
      this.$emit('return', { clear: true })
    }
  }
}
</script>

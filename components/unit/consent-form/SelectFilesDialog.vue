<template>
  <div>
    <VDialog v-model="dialog" width="80%" persistent scrollable>
      <template #activator="{ on }">
        <BaseButton
          :ref="buttonRef"
          class="mb-4"
          text="Select files"
          v-on="on"
        />
      </template>

      <VDivider></VDivider>

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
  </div>
</template>

<script>
import FileManager from '~/utils/file-manager.js'

export default {
  props: {
    fileManager: {
      type: FileManager,
      required: true
    },
    buttonRef: {
      type: String,
      default: 'selectFilesDialogButton'
    }
  },
  data() {
    return {
      dialog: false
    }
  },
  computed: {
    key() {
      return this.$route.params.key
    }
  },
  methods: {
    ok() {
      this.dialog = false
      this.$emit('return', { clear: false })
    },
    clear() {
      this.$store.commit('setSelectedFiles', { key: this.key, value: [] })
      this.dialog = false
      this.$emit('return', { clear: true })
    }
  }
}
</script>

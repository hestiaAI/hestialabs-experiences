<template>
  <VDialog v-model="show" width="500" persistent scrollable>
    <VCard>
      <VCardTitle class="text-h5 grey lighten-2"> Selected files </VCardTitle>

      <VCardText>
        <ul>
          <li v-for="file in Object.keys(fileManager.fileDict)" :key="file">
            {{ file }}
          </li>
        </ul>
      </VCardText>

      <VDivider></VDivider>

      <VCardActions>
        <VSpacer></VSpacer>
        <VBtn color="primary" text @click="show = false"> Close </VBtn>
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
    }
  }
}
</script>

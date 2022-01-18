<template>
  <VDialog v-model="show" width="500" style="z-index: 2000" scrollable>
    <template #activator="{ on }">
      <VTooltip right>
        <template #activator="{ on: onTooltip }">
          <span v-on="onTooltip">
            <VIcon v-on="on">$vuetify.icons.mdiFolderInformationOutline</VIcon>
          </span>
        </template>
        <span>Show expected files</span>
      </VTooltip>
    </template>
    <VCard>
      <VCardTitle>Expected files</VCardTitle>
      <VDivider></VDivider>
      <VCardText>
        <template v-if="files && files.length > 0">
          <p class="mt-4">Required:</p>
          <ul>
            <li v-for="file in files" :key="file">
              {{ file }}
            </li>
          </ul>
        </template>
        <p v-else class="mt-4">No specific files required.</p>
        <p class="mt-4">
          All JSON/CSV files provided are analysed for dates and geographical
          coordinates. The related experiences will be more interesting the more
          files you include.
        </p>
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
export default {
  props: {
    files: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      show: false
    }
  }
}
</script>

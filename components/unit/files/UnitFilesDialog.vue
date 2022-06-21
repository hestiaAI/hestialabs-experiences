<template>
  <VDialog v-model="show" width="500" style="z-index: 2000" scrollable>
    <template #activator="{ on }">
      <VTooltip :right="main" :left="!main">
        <template #activator="{ on: onTooltip }">
          <span v-on="onTooltip">
            <VIcon
              class="ml-2"
              v-on="on"
            >$vuetify.icons.mdiFolderInformationOutline</VIcon>
          </span>
        </template>
        <span>Show expected files</span>
      </VTooltip>
    </template>
    <VCard>
      <VCardTitle>Expected files</VCardTitle>
      <VDivider />
      <VCardText>
        <template v-if="fileGlobs && fileGlobs.length > 0">
          <p v-if="main" class="mt-4">
            Files used in the experiences:
          </p>
          <p v-else class="mt-4">
            Files required:
          </p>
          <ul>
            <li v-for="glob in fileGlobs" :key="glob">
              {{ glob }}
            </li>
          </ul>
          <template v-if="!main && fileManager">
            <p class="mt-4">
              Files found:
            </p>
            <ul>
              <template v-for="glob in fileGlobs">
                <li
                  v-for="file in fileManager.findMatchingFilePaths(glob)"
                  :key="file"
                >
                  {{ file }}
                </li>
              </template>
            </ul>
          </template>
        </template>
        <p v-else class="mt-4">
          No specific files are used in these experiences.
        </p>
        <p v-if="main" class="mt-4">
          For the experiences marked with
          <VIcon>$vuetify.icons.mdiFileMultipleOutline</VIcon>, all JSON/CSV
          files provided will be analysed for dates and geographical
          coordinates. These experiences will be more interesting the more files
          you include.
        </p>
      </VCardText>

      <VDivider />

      <VCardActions>
        <VSpacer />
        <VBtn color="primary" text @click="show = false">
          Close
        </VBtn>
      </VCardActions>
    </VCard>
  </VDialog>
</template>

<script>
import FileManager from '~/utils/file-manager'

export default {
  props: {
    fileGlobs: {
      type: Array,
      required: true
    },
    main: {
      type: Boolean,
      default: false
    },
    fileManager: {
      type: FileManager,
      default: null
    }
  },
  data() {
    return {
      show: false
    }
  }
}
</script>

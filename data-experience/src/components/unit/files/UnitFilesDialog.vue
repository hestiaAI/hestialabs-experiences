<template>
  <div class="files-dialog">
    <VTooltip
      v-if="allFiles"
      left
    >
      <template #activator="{ on }">
        <VIcon
          class="ml-2 files-dialog__icon"
          v-on="on"
        >
          $vuetify.icons.mdiFileMultipleOutline
        </VIcon>
      </template>
      <span
        v-t="'All files are used'"
      />
    </VTooltip>
    <VDialog
      v-else
      v-model="show"
      width="500"
      style="z-index: 2000"
      scrollable
    >
      <template #activator="{ on }">
        <VTooltip
          :right="main"
          :left="!main"
        >
          <template #activator="{ on: onTooltip }">
            <span v-on="onTooltip">
              <VIcon
                class="ml-2 files-dialog__icon"
                v-on="on"
              >$vuetify.icons.mdiFolderInformationOutline</VIcon>
            </span>
          </template>
          <span>{{ $t('unit-files-dialog.tooltip') }}</span>
        </VTooltip>
      </template>
      <VCard>
        <VCardTitle>{{ $t('unit-files-dialog.title') }}</VCardTitle>
        <VDivider />
        <VCardText>
          <template v-if="fileGlobs && fileGlobs.length > 0">
            <p
              v-if="main"
              class="mt-4"
            >
              {{ $t('unit-files-dialog.used') }}
            </p>
            <p
              v-else
              class="mt-4"
            >
              {{ $t('unit-files-dialog.required') }}
            </p>
            <ul>
              <li
                v-for="glob in fileGlobs"
                :key="glob"
              >
                {{ glob }}
              </li>
            </ul>
            <template v-if="!main && fileManager">
              <p class="mt-4">
                {{ $t('unit-files-dialog.found') }}
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
          <p
            v-else
            class="mt-4"
          >
            {{ $t('unit-files-dialog.no-files') }}
          </p>
          <p
            v-if="main"
            class="mt-4"
          >
            {{ $t('unit-files-dialog.all-files-1') }}
            <VIcon>$vuetify.icons.mdiFileMultipleOutline</VIcon>
            {{ $t('unit-files-dialog.all-files-2') }}
          </p>
        </VCardText>

        <VDivider />

        <VCardActions>
          <VSpacer />
          <VBtn
            color="primary"
            text
            @click="show = false"
          >
            {{ $t('Close') }}
          </VBtn>
        </VCardActions>
      </VCard>
    </VDialog>
  </div>
</template>

<script>
import { mapState } from '@/utils/store-helper'

export default {
  name: 'UnitFilesDialog',
  props: {
    fileGlobs: {
      type: Array,
      required: true
    },
    main: {
      type: Boolean,
      default: false
    },
    allFiles: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      show: false
    }
  },
  computed: {
    ...mapState(['fileManager'])
  }
}
</script>

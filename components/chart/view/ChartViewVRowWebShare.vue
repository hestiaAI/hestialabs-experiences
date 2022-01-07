<template>
  <VRow ref="domToImageNode" v-bind="$attrs">
    <slot></slot>
    <VCol cols="12" class="dom-to-image-exclude">
      <BaseButton
        icon="mdiExport"
        text="Export"
        v-bind="{ progress, status, error }"
        @click="exportImage"
      />
      <BaseButtonDownloadData
        v-bind="{ disabled: !blob, extension, filename, data: blob }"
      />
      <BaseButtonShare file-share v-bind="{ files, disabled: !files }" />
    </VCol>
  </VRow>
</template>

<script>
import exportImageMixinFactory from '@/mixins/export-image-mixin-factory'

export default {
  mixins: [exportImageMixinFactory()]
}
</script>

<template>
  <VRow ref="domToImageNode" v-bind="$attrs">
    <slot />
    <VCol cols="12" class="dom-to-image-exclude">
      <BaseButton
        mdi-icon="mdiExport"
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
import BaseButton from '@/components/base/button/BaseButton.vue'
import BaseButtonDownloadData from '@/components/base/button/download/BaseButtonDownloadData.vue'
import BaseButtonShare from '@/components/base/button/BaseButtonShare.vue'

export default {
  components: { BaseButton, BaseButtonDownloadData, BaseButtonShare },
  mixins: [exportImageMixinFactory()]
}
</script>

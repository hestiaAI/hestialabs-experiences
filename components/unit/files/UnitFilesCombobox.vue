<template>
  <VCombobox
    v-model="filesCombobox"
    :items="filesComboboxItems"
    clearable
    multiple
    small-chips
    deletable-chips
    outlined
    dense
    hide-details
    class="mt-6"
    menu-props="auto, overflowY, offsetY, top"
    placeholder="Type file name or select from list..."
    label="Specify files to extract from zip archives..."
    style="max-width: 650px"
    @input="$emit('update', $event)"
  />
</template>

<script>
import filesComboboxItems from '@/utils/files-combobox-items'

export default {
  name: 'TheFilesCombobox',
  data() {
    return {
      filesCombobox: [],
      filesComboboxItems
    }
  }
}
</script>

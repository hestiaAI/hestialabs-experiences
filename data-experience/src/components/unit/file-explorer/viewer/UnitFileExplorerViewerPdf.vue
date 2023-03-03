<template>
  <iframe
    :src="path"
    width="100%"
    height="500px"
  />
</template>

<script>
import mixin from './mixin'
import mixinPath from './mixin-path'

export default {
  name: 'UnitFileExplorerViewerPdf',
  mixins: [mixin, mixinPath]
}
</script>

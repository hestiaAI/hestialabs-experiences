<template>
  <img width="100%" :src="path" :alt="filename">
</template>

<script>
import mixin from './mixin'
import mixinPath from './mixin-path'

export default {
  name: 'UnitFileExplorerViewerImg',
  mixins: [mixin, mixinPath]
}
</script>

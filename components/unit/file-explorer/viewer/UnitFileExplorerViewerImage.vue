<template>
  <img width="100%" :src="path" alt="problem" />
</template>

<script>
import mixin from './mixin'
import mixinPath from './mixin-path'

export default {
  name: 'UnitFileExplorerViewerImage',
  mixins: [mixin, mixinPath]
}
</script>

<template>
  <div>
    <VList rounded>
      <VListItem
        v-for="({ title, subtitle, icon, ...rest }, index) in experiences"
        :key="index"
        v-bind="menuItemAttrs(rest)"
      >
        <VListItemAvatar tile>
          <VImg :src="icon" :lazy-src="icon" />
        </VListItemAvatar>
        <VListItemContent>
          <VListItemTitle v-text="title" />
          <VListItemSubtitle v-text="subtitle" />
        </VListItemContent>
      </VListItem>
    </VList>
  </div>
</template>

<script>
import mixin from './mixin'

export default {
  mixins: [mixin]
}
</script>

<template>
  <div>
    <VList rounded>
      <VListItem
        v-for="{ key, title, subtitle, icon, url, disabled } in experiences"
        :key="key"
        v-bind="menuItemAttrs(url, key, disabled)"
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

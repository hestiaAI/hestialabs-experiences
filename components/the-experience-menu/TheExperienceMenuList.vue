<template>
  <div>
    <VList rounded>
      <VListItem
        v-for="{ slug, title, subtitle, icon, url, disabled } in experiences"
        :key="slug"
        v-bind="menuItemAttrs(url, slug, disabled)"
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

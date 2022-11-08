<template>
  <div>
    <VList rounded>
      <VListItem
        v-for="({ icon, ...rest }, index) in experiences"
        :key="index"
        v-bind="menuItemAttrs(rest)"
      >
        <VListItemAvatar tile>
          <VImg :src="icon" :lazy-src="icon" />
        </VListItemAvatar>
        <VListItemContent>
          <VListItemTitle>
            {{ title(rest) }}
          </VListItemTitle>
          <VListItemSubtitle>
            {{ subtitle(rest) }}
          </VListItemSubtitle>
        </VListItemContent>
      </VListItem>
    </VList>
  </div>
</template>

<script>
import mixin from './mixin'
import mixinTitles from '@/mixins/titles'

export default {
  mixins: [mixin, mixinTitles]
}
</script>

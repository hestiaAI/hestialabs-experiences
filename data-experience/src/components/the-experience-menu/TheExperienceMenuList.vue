<template>
  <div>
    <VList rounded>
      <VListItem
        v-for="({ icon, title, ...rest }, index) in experiences"
        :key="index"
        v-bind="menuItemAttrs(rest)"
      >
        <VListItemAvatar tile>
          <VImg :src="icon" :lazy-src="icon" />
        </VListItemAvatar>
        <VListItemContent>
          <VListItemTitle>
            {{ $tev(k(rest.slug, 'title'), title) }}
          </VListItemTitle>
          <VListItemSubtitle>
            {{ $tet(k(rest.slug, 'subtitle'), 'Data Experience') }}
          </VListItemSubtitle>
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

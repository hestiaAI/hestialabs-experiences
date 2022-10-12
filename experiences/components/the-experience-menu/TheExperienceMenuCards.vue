<template>
  <VRow class="mt-3 mb-6">
    <VCol
      v-for="({ icon, title, ...rest }, index) in experiences"
      :key="index"
      cols="12"
      sm="6"
      md="4"
      lg="3"
    >
      <VCard v-bind="menuItemAttrs(rest)" hover height="100%" class="pa-3">
        <div class="text-center">
          <VAvatar
            size="150"
            tile
          >
            <VImg
              contain
              :src="icon"
              :lazy-src="icon"
              class="mt-3"
            />
          </VAvatar>
        </div>
        <VCardTitle class="justify-center">
          {{ $tev(k(rest.slug, 'title'), title) }}
        </VCardTitle>
        <VCardSubtitle class="subtitle-1 text-center">
          {{ $tet(k(rest.slug, 'subtitle'), 'Data Experience') }}
        </VCardSubtitle>
      </VCard>
    </VCol>
  </VRow>
</template>

<script>
import mixin from './mixin'

export default {
  mixins: [mixin]
}
</script>

<style scoped>
.v-card--link:before {
  background: none;
}
</style>

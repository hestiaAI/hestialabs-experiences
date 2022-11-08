<template>
  <VRow class="mt-3 mb-6">
    <VCol
      v-for="({ icon, ...rest }, index) in experiences"
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
          {{ title(rest) }}
        </VCardTitle>
        <VCardSubtitle class="subtitle-1 text-center">
          {{ subtitle(rest) }}
        </VCardSubtitle>
      </VCard>
    </VCol>
  </VRow>
</template>

<script>
import mixin from './mixin'
import mixinTitles from '@/mixins/titles'

export default {
  mixins: [mixin, mixinTitles]
}
</script>

<style scoped>
.v-card--link:before {
  background: none;
}
</style>

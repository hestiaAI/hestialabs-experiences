<template>
  <div>
    <VRow class="mt-6">
      <VCol
        v-for="{ key, title, subtitle, icon, url, disabled } in experiences"
        :key="key"
        cols="12"
        sm="6"
        md="4"
        lg="3"
        xl="2"
      >
        <VCard
          class="d-flex flex-column"
          v-bind="menuItemAttrs(url, key, disabled)"
          hover
          shaped
        >
          <VImg max-height="250" contain :src="icon" :lazy-src="icon" />
          <VCardTitle v-text="title" />
          <VCardSubtitle class="subtitle-1" v-text="subtitle" />
        </VCard>
      </VCol>
    </VRow>
  </div>
</template>

<script>
import mixin from './mixin'

export default {
  mixins: [mixin]
}
</script>

<template>
  <VCard outlined class="view-card">
    <VCardTitle v-if="title || $slots.actions" class="text-subtitle-1 font-weight-bold">
      {{ title }}
      <VTooltip v-if="info" bottom max-width="300">
        <template #activator="{ on, attrs }">
          <VIcon small class="ml-1" :aria-label="info" v-bind="attrs" v-on="on">
            $vuetify.icons.mdiInformationOutline
          </VIcon>
        </template>
        <span>{{ info }}</span>
      </VTooltip>
      <VSpacer />
      <slot name="actions" />
    </VCardTitle>
    <VCardSubtitle v-if="subtitle">
      {{ subtitle }}
    </VCardSubtitle>
    <VCardText class="text--primary">
      <slot />
    </VCardText>
  </VCard>
</template>

<script>
// A titled card for one chart or panel.
export default {
  name: 'ViewCard',
  props: {
    title: {
      type: String,
      default: ''
    },
    subtitle: {
      type: String,
      default: ''
    },
    // shown in a tooltip next to the title
    info: {
      type: String,
      default: ''
    }
  }
}
</script>

<template>
  <VDialog v-model="show" width="500" scrollable style="z-index: 2000">
    <template #activator="{ on }">
      <VTooltip v-bind="{ ...tooltipPos }">
        <template #activator="{ on: onTooltip }">
          <span v-on="onTooltip">
            <VIcon class="ma-2" v-on="on">{{ mdiIcon }}</VIcon>
          </span>
        </template>
        <span>{{ tooltipLabel }}</span>
      </VTooltip>
    </template>
    <VCard>
      <VCardTitle>{{ dialogTitle }}</VCardTitle>
      <VDivider />
      <VCardText><slot /></VCardText>
      <VDivider />
      <VCardActions>
        <VSpacer />
        <VBtn color="primary" text @click="show = false">
          {{ $t('Close') }}
        </VBtn>
      </VCardActions>
    </VCard>
  </VDialog>
</template>

<script>
export default {
  props: {
    icon: {
      type: String,
      required: true
    },
    dialogTitle: {
      type: String,
      default: ''
    },
    tooltipLabel: {
      type: String,
      default: ''
    },
    tooltipPosition: {
      type: String,
      default: 'left',
      validator(value) {
        // The value must match one of these strings
        return ['left', 'right', 'top', 'bottom'].includes(value)
      }
    }
  },
  data() {
    return {
      show: false
    }
  },
  computed: {
    mdiIcon() {
      return this.$vuetify.icons.values[this.icon]
    },
    tooltipPos() {
      return {
        left: this.tooltipPosition === 'left',
        right: this.tooltipPosition === 'right',
        top: this.tooltipPosition === 'top',
        bottom: this.tooltipPosition === 'bottom'
      }
    }
  }
}
</script>

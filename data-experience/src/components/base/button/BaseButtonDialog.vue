<template>
  <VDialog v-model="show" width="500" scrollable style="z-index: 2000">
    <template #activator="{ on }">
      <VTooltip :[tooltipPosition]="true">
        <template #activator="{ on: onTooltip }">
          <span v-on="onTooltip">
            <VIcon class="ma-2" v-on="on">{{ mdiIconResolved }}</VIcon>
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
  name: 'BaseButtonDialog',
  props: {
    mdiIcon: {
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
    mdiIconResolved() {
      return this.$vuetify.icons.values[this.icon]
    }
  }
}
</script>

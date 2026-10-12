<template>
  <div class="period-toolbar">
    <div class="d-flex flex-wrap align-center justify-space-between">
      <VBtnToggle
        :value="mode"
        mandatory
        dense
        color="primary"
        class="period-switch my-1"
        @change="$emit('mode', $event)"
      >
        <VBtn
          v-for="p in modes"
          :key="p"
          :value="p"
          class="switch-btn"
          small
        >
          {{ p.toUpperCase() }}
        </VBtn>
      </VBtnToggle>
      <div class="week-nav-wrapper d-flex align-center my-1">
        <VBtn
          v-if="mode !== 'total'"
          class="nav-btn"
          icon
          small
          aria-label="previous"
          @click="$emit('prev')"
        >
          <VIcon>$vuetify.icons.mdiChevronLeft</VIcon>
        </VBtn>
        <span class="week-label text-subtitle-1 font-weight-medium px-2">{{ label }}</span>
        <VBtn
          v-if="mode !== 'total'"
          class="nav-btn"
          icon
          small
          aria-label="next"
          @click="$emit('next')"
        >
          <VIcon>$vuetify.icons.mdiChevronRight</VIcon>
        </VBtn>
      </div>
    </div>
    <p v-if="descriptions[mode]" class="text-caption text--secondary mt-1 mb-0">
      {{ descriptions[mode] }}
    </p>
  </div>
</template>

<script>
// Week / month / total switch with period navigation, shared by the
// Yoojo and Uber Eats views so they look like the other experiences.
// The period-switch and week-nav-wrapper classes are onboarding tour anchors;
// switch-btn, nav-btn and week-label are used by the views' tests.
export default {
  name: 'PeriodToolbar',
  props: {
    mode: {
      type: String,
      required: true
    },
    label: {
      type: String,
      default: ''
    },
    descriptions: {
      type: Object,
      default: () => ({})
    },
    modes: {
      type: Array,
      default: () => ['week', 'month', 'total']
    }
  }
}
</script>

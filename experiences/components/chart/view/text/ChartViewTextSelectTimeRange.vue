<!-- eslint-disable vue/no-v-html -->
<template>
  <p class="muted pull-right text-subtitle-2 mr-4 mb-1">
    <span v-html="$t('select-time-range')" />
    <slot />
  </p>
</template>

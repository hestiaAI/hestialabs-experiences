<template>
  <v-select
    v-bind="$attrs"
    item-text="name"
    item-value="comparator"
    style="max-width: 150px"
    hide-details
    label="Select operation"
    @change="$emit('change', $event)"
  />
</template>

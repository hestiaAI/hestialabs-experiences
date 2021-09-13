<template>
  <v-select
    v-bind="$attrs"
    item-text="name"
    item-value="key"
    style="max-width: 150px"
    hide-details
    label="Select operation"
    @change="$emit('change', $event)"
  />
</template>

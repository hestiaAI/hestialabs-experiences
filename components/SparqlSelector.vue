<template>
  <v-select
    v-bind="$attrs"
    item-text="name"
    item-value="sparql"
    style="max-width: 150px"
    hide-details
    label="Select query"
    @change="$emit('change', $event)"
  />
</template>

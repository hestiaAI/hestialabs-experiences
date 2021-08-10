<template>
  <v-btn outlined v-bind="$attrs" class="my-2" @click="$emit('click', $event)">
    <slot></slot>
  </v-btn>
</template>

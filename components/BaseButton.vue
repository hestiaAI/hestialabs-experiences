<template>
  <v-btn outlined v-bind="$attrs" @click="$emit('click', $event)">
    <slot></slot>
  </v-btn>
</template>

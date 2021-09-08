<template>
  <v-list rounded>
    <v-list-item
      v-for="{ key, title, subtitle, icon } in $store.getters.manifests"
      :key="key"
      :to="`/${key}`"
    >
      <v-list-item-avatar tile>
        <v-img :src="icon" :lazy-src="icon" />
      </v-list-item-avatar>
      <v-list-item-content>
        <v-list-item-title v-text="title"></v-list-item-title>
        <v-list-item-subtitle v-text="subtitle"></v-list-item-subtitle>
      </v-list-item-content>
    </v-list-item>
  </v-list>
</template>

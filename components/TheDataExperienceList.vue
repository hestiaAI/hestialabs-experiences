<template>
  <v-list rounded>
    <v-list-item
      v-for="{ key, title, subtitle, icon, url } in $store.getters.manifests"
      :key="key"
      v-bind="linkAttributes(url, key)"
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
<script>
export default {
  methods: {
    linkAttributes(url, key) {
      return url
        ? { href: url, target: '_blank', rel: 'noopener noreferrer' }
        : { nuxt: true, to: `/${key}` }
    }
  }
}
</script>

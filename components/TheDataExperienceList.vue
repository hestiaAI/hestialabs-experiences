<template>
  <v-list rounded>
    <v-list-item
      v-for="{ key, title, subtitle, icon, url, disabled } in $store.getters
        .manifests"
      :key="key"
      v-bind="cardAttributes(url, disabled, key)"
    >
      <v-list-item-avatar tile>
        <v-img :src="icon" :lazy-src="icon" />
      </v-list-item-avatar>
      <v-list-item-content>
        <v-list-item-title v-text="title" />
        <v-list-item-subtitle v-text="disabled ? 'Contact us' : subtitle" />
      </v-list-item-content>
    </v-list-item>
  </v-list>
</template>
<script>
export default {
  methods: {
    cardAttributes(url, disabled, key) {
      return disabled
        ? { disabled }
        : url
        ? { href: url, target: '_blank', rel: 'noopener noreferrer' }
        : { nuxt: true, to: `/${key}` }
    }
  }
}
</script>

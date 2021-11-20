<template>
  <div>
    <v-list rounded>
      <v-list-item
        v-for="{ key, title, subtitle, icon, url, disabled } in experiences"
        :key="key"
        v-bind="menuItemAttrs(url, key, disabled)"
      >
        <v-list-item-avatar tile>
          <v-img :src="icon" :lazy-src="icon" />
        </v-list-item-avatar>
        <v-list-item-content>
          <v-list-item-title v-text="title" />
          <v-list-item-subtitle v-text="subtitle" />
        </v-list-item-content>
      </v-list-item>
    </v-list>
  </div>
</template>

<script>
import mixin from './mixin'

export default {
  mixins: [mixin]
}
</script>

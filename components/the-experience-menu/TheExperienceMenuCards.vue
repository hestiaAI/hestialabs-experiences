<template>
  <div>
    <v-row class="mt-6">
      <v-col
        v-for="{ key, title, subtitle, icon, url, disabled } in experiences"
        :key="key"
        cols="12"
        sm="6"
        md="4"
        lg="3"
        xl="2"
      >
        <v-card
          class="d-flex flex-column"
          v-bind="menuItemAttrs(url, key, disabled)"
          hover
          shaped
        >
          <v-img max-height="250" contain :src="icon" :lazy-src="icon" />
          <v-card-title v-text="title" />
          <v-card-subtitle class="subtitle-1" v-text="subtitle" />
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import mixin from './mixin'

export default {
  mixins: [mixin]
}
</script>

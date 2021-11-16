<template>
  <div>
    <template
      v-if="typeof small === 'undefined' ? $vuetify.breakpoint.smAndUp : !small"
    >
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
            v-bind="cardAttributes(url, key, disabled)"
            hover
            shaped
          >
            <v-img max-height="250" contain :src="icon" :lazy-src="icon" />
            <v-card-title v-text="title" />
            <v-card-subtitle class="subtitle-1" v-text="subtitle" />
          </v-card>
        </v-col>
      </v-row>
    </template>
    <template v-else>
      <v-list rounded>
        <v-list-item
          v-for="{ key, title, subtitle, icon, url, disabled } in experiences"
          :key="key"
          v-bind="cardAttributes(url, key, disabled)"
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
    </template>
  </div>
</template>
<script>
export default {
  name: 'TheDataExperienceList',
  props: {
    small: {
      type: Boolean,
      default: undefined
    },
    experiences: {
      type: Array,
      required: true
    }
  },
  methods: {
    cardAttributes(url, key, disabled) {
      return url
        ? { href: url, target: '_blank', rel: 'noopener noreferrer', disabled }
        : disabled
        ? { disabled }
        : { nuxt: true, to: `/${key}` }
    }
  }
}
</script>

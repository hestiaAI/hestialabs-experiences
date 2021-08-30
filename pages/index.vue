<template>
  <div>
    <h1>Data experiences</h1>

    <template v-if="$vuetify.breakpoint.smAndUp">
      <v-row class="mt-6">
        <v-col
          v-for="{ key, title, subtitle, icon } in $store.getters.manifests"
          :key="key"
          cols="12"
          sm="6"
          md="4"
          lg="3"
          xl="2"
        >
          <v-card class="d-flex flex-column" nuxt :to="`/${key}`" hover shaped>
            <v-img
              max-height="250"
              contain
              :src="icon"
              :lazy-src="$icon(512)"
            />

            <v-card-title v-text="title" />
            <v-card-subtitle class="subtitle-1" v-text="subtitle" />
          </v-card>
        </v-col>
      </v-row>
    </template>
    <template v-else>
      <the-data-experience-list class="mt-4" />
    </template>
  </div>
</template>

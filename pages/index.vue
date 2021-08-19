<template>
  <div>
    <h1>Data experiences</h1>

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
          <v-img max-height="250" :src="icon" contain />

          <v-card-title v-text="title" />
          <v-card-subtitle
            class="subtitle-1"
            v-text="subtitle || 'Data Experience'"
          />
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

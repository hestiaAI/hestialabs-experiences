<template>
  <div>
    <h1>Data experiences</h1>

    <v-row class="mt-6">
      <v-col
        v-for="({ title, subtitle, icon }, slug) in manifests"
        :key="slug"
        cols="12"
        sm="6"
        md="4"
        lg="3"
        xl="2"
      >
        <v-card class="d-flex flex-column">
          <v-img max-height="250" :src="icon" contain />

          <v-card-title v-text="title" />
          <v-card-subtitle v-text="subtitle || 'Data Experience'" />
          <v-card-actions>
            <v-btn nuxt :to="`/${slug}`" color="primary">
              View
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import manifests from '@/manifests'

export default {
  data() {
    return {
      manifests
    }
  }
}
</script>

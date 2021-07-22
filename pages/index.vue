<template>
  <div>
    <h1>Welcome</h1>

    <h2>Data experiences</h2>

    <v-row class="mt-6">
      <v-col
        v-for="{ title, subtitle, imgsrc, key } in $store.state.experiences"
        :key="key"
        cols="12"
        sm="6"
        md="4"
        lg="3"
      >
        <v-card class="d-flex flex-column">
          <v-img max-height="250" :src="imgsrc" contain />

          <v-card-title v-text="title" />
          <v-card-subtitle v-text="subtitle" />
          <v-card-actions>
            <v-btn nuxt :to="`/${key}`" color="primary">
              View
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script>
export default {
  data() {
    return {}
  }
}
</script>

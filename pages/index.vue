<template>
  <div>
    <h1>Welcome</h1>

    <h2>Data experiences</h2>

    <v-row class="mt-6">
      <v-col
        v-for="{ title, subtitle, imgsrc, key } in experiences"
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
    return {
      experiences: [
        {
          title: 'TrackerControl',
          subtitle: 'Tracking data',
          key: 'tracker-control',
          imgsrc: 'https://trackercontrol.org/images/logo.png'
        },
        {
          title: 'Twitter',
          subtitle: 'Targeting Information',
          key: 'twitter-targeting-information',
          imgsrc:
            'https://www.iconpacks.net/icons/2/free-twitter-logo-icon-2429-thumb.png'
        }
      ]
    }
  }
}
</script>

<style>
pre {
  white-space: pre-wrap;
  height: 300px;
  overflow-y: auto;
}

pre code {
  width: 100%;
}
</style>

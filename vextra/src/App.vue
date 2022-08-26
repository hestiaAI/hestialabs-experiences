<template>
  <v-app>
    <v-app-bar
      app
      color="primary"
      dark
    >
      <div class="d-flex align-center">
        <DummyButton>test</DummyButton>
        <ChartViewBar />
        <ChartViewTimeSeries
          v-bind="{
            values: [
              {d: '2010-03-24', a: 'eat'},
              {d: '2010-03-25', a: 'eat'},
              {d: '2010-03-26', a: 'sleep'},
              {d: '2010-03-27', a: 'eat'},
              {d: '2010-03-28', a: 'sleep'}
            ],
            title: 'Followers vs Followings over time',
            legendOffset: 350,
            dateAccessor: { text: 'Date', value: 'd' },
            seriesAccessor: { text: 'Action', value: 'a' }
          }"
        />
        <v-img
          alt="Vuetify Logo"
          class="shrink mr-2"
          contain
          src="https://cdn.vuetifyjs.com/images/logos/vuetify-logo-dark.png"
          transition="scale-transition"
          width="40"
        />

        <v-img
          alt="Vuetify Name"
          class="shrink mt-1 hidden-sm-and-down"
          contain
          min-width="100"
          src="https://cdn.vuetifyjs.com/images/logos/vuetify-name-dark.png"
          width="100"
        />
      </div>

      <v-spacer></v-spacer>

      <v-btn
        href="https://github.com/vuetifyjs/vuetify/releases/latest"
        target="_blank"
        text
      >
        <span class="mr-2">Latest Release</span>
        <v-icon>mdi-open-in-new</v-icon>
      </v-btn>
    </v-app-bar>

    <v-main>
      <HelloWorld/>
    </v-main>
  </v-app>
</template>

<script>
import HelloWorld from './components/HelloWorld';

export default {
  name: 'App',

  components: {
    HelloWorld,
  },

  data: () => ({
    //
  }),
};
</script>

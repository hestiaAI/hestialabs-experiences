<template>
  <div class="wrapper" fill-height>
    <VContainer class="content-wrapper" fill-height>
      <template v-if="showLogin">
        <LoginScreen @success="fetchData" />
      </template>
      <template v-else>
        <section id="header">
          <h1>
            Combien vous <br>rapporte Uber
          </h1>
          <h2 class="border-bottom mb-3">
            Tableau de bord
          </h2>
          <p>
            Tout sur votre activité Uber : le nombre de courses que vous faites par jour, vos kilomètres parcourus et temps de travail, en course (P3), en approche (P2) et en disponibilité (P1), le jour, la nuit, le week-end, et l'évolution de vos revenus : <br>
            <strong>Combien gagnez vous par kilomètre ? Combien gagnez-vous par heure ?</strong><br>
            <strong>Comparez vos gains à ceux des autres chauffeurs.</strong>
          </p>
        </section>
        <section id="when" class="mt-6">
          <h3 class="mb-3">
            Vos courses
          </h3>
          <Dashboard v-if="data" v-bind="{graphs: tripsGraphs, values: tripsData}" />
        </section>
        <section id="income" class="mt-6">
          <h3 class="mb-3">
            Vos Revenus
          </h3>
          <Dashboard v-if="data" v-bind="{graphs: paymentsGraphs, values: data}" />
        </section>
        <VRow>
          <VCol cols="12" md="6">
            <section id="time" class="mt-6">
              <h3 class="mb-3 d-flex">
                Temps de connexion
                <VSpacer />
                <div class="d-flex">
                  <VCheckbox
                    v-model="statusSelected"
                    label="P1"
                    value="P1"
                    class="ml-3"
                    dark
                  />
                  <VCheckbox
                    v-model="statusSelected"
                    label="P2"
                    value="P2"
                    class="ml-3"
                    dark
                  />
                  <VCheckbox
                    v-model="statusSelected"
                    label="P3"
                    value="P3"
                    class="ml-3"
                    dark
                  />
                </div>
              </h3>
              <Dashboard v-if="data" v-bind="{graphs: timeGraphs, values: timeData}" />
            </section>
          </VCol>
          <VCol cols="12" md="6">
            <section id="km" class="mt-6">
              <h3 class="mb-3">
                Kilomètres parcourus
              </h3>
              <Dashboard v-if="data" v-bind="{graphs: kilometersGraphs, values: tripsData}" />
            </section>
          </VCol>
        </VRow>
      </template>
    </VContainer>
  </div>
</template>

<script>
import * as d3 from 'd3'
import mixinPage from '@/mixins/page'
import LoginScreen from '@/components/LoginScreen.vue'
export default {
  components: { LoginScreen },
  mixins: [mixinPage],
  data() {
    return {
      data: null,
      showLogin: true,
      paymentData: null,
      statusSelected: ['P1', 'P2', 'P3']
    }
  },
  computed: {
    timeGraphs() {
      return [{
        title: 'Temps de connexion',
        valueLabel: 'Heures',
        cols: '12',
        chart: 'StackTimelineChart',
        typeAccessor: 'status',
        dateAccessor: 'begin',
        valueAccessor: 'duration'
      }]
    },
    kilometersGraphs() {
      return [{
        title: 'Kilomètres parcourus',
        valueLabel: 'Km',
        cols: '12',
        chart: 'StackTimelineChart',
        typeAccessor: 'status',
        dateAccessor: 'begin',
        valueAccessor: 'distance'
      }]
    },
    paymentsGraphs() {
      return [
        {
          title: 'Vos revenus totaux',
          valueLabel: 'EUR',
          cols: '12',
          chart: 'TimelineChart',
          dateAccessor: 'begin',
          valueAccessor: 'income'
        },
        {
          title: 'Vos revenus par heure',
          valueLabel: 'EUR / Heure',
          cols: '6',
          chart: 'StackTimelineChart',
          typeAccessor: 'status',
          dateAccessor: 'begin',
          valueAccessor: 'per_hour',
          valueAggregate: 'avg'
        },
        {
          title: 'Vos revenus par kilomètre',
          valueLabel: 'EUR / Km',
          cols: '6',
          chart: 'StackTimelineChart',
          typeAccessor: 'status',
          dateAccessor: 'begin',
          valueAccessor: 'per_km',
          valueAggregate: 'avg'
        }
      ]
    },
    tripsGraphs() {
      return [
        {
          title: 'Vos courses',
          valueLabel: 'courses',
          cols: '12',
          chart: 'TimelineChart',
          dateAccessor: 'begin'
        },
        {
          valueLabel: 'courses',
          cols: '6',
          chart: 'WeekChart',
          dateAccessor: 'begin'
        },
        {
          valueLabel: 'courses',
          cols: '6',
          chart: 'HourChart',
          dateAccessor: 'begin'
        }
      ]
    },
    tripsData() {
      return this.data.filter(d => d.status === 'P3')
    },
    timeData() {
      return this.data.filter(d => this.statusSelected.includes(d.status))
    }
  },
  methods: {
    async fetchData(url) {
      this.showLogin = false
      const downloadUrl = process.env.NODE_ENV === 'development' ? '/data/test-sample.csv' : url
      this.data = await d3.dsv(',', downloadUrl, (data) => {
        const income = +(+data.uber_paid).toFixed(2)
        const duration = +(+data.duration_h).toFixed(2)
        const distance = +(+data.distance_km).toFixed(2)
        const perHour = +(income / duration).toFixed(2)
        const perKm = +(income / distance).toFixed(2)
        return {
          begin: data.day,
          duration,
          distance,
          income,
          per_hour: perHour < Infinity ? perHour : 0,
          per_km: perKm < Infinity ? perKm : 0,
          status: data.status
        }
      })

      console.log('FETCHED  ', this.data)
    }
  }
}

</script>
<style scoped>
.content-wrapper /deep/ h1 {
  margin-top: 1em;
  margin-bottom: 1em;
  text-transform: uppercase;
  line-height: 1.1;
  font-size: 6rem;
  font-weight: bolder;
}

.content-wrapper /deep/ h2 {
  text-transform: uppercase;
  font-size: 2.5rem;
  font-weight:bolder;
}

.content-wrapper /deep/ h2 {
  font-size: 2rem;
  font-weight:bolder;
}

.border-bottom {
  border-bottom: 3px solid #fff;
}

.wrapper {
  height: 100%;
  font-size: 1.5em;
  color: white;
  background-color: var(--v-primary-base) !important;
  word-break: break-word;
  border-bottom: white solid 1pt;
  padding-bottom: 6rem;
}
</style>

<template>
  <div class="wrapper">
    <VContainer class="content-wrapper">
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
      </section>
      <section id="income" class="mt-6">
        <h3 class="mb-3">
          Vos Revenus
        </h3>
      </section>
      <section id="time" class="mt-6">
        <h3 class="mb-3">
          Temps de connexion
        </h3>
      </section>
      <section id="km" class="mt-6">
        <h3 class="mb-3">
          Kilomètres parcourus
        </h3>
      </section>
    </VContainer>
  </div>
  </div>
</template>

<script>
import * as d3 from 'd3'
import mixinPage from '@/mixins/page'

export default {
  mixins: [mixinPage],
  data() {
    return {
      data: null
    }
  },
  mounted() {
    this.fetchData()
  },
  methods: {
    async fetchData() {
      this.data = await d3.dsv(';', '/data/test.csv', (data) => {
        return {
          begin: new Date(data.begin),
          end: new Date(data.end),
          distance: +data.distance_km,
          income: +data.uber_paid,
          status: data.status
        }
      })
      console.log(this.data)
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

<template>
  <div class="effective-work">
    <KpiTiles class="mt-3" :items="kpis" />

    <VRow class="mt-1">
      <VCol cols="12" md="6">
        <ViewCard :title="msg('jobsTitle')">
          <ApexChart
            v-if="categories.length"
            type="bar"
            :height="chartHeight"
            :options="chartOptions('jobs')"
            :series="series('jobs')"
          />
        </ViewCard>
      </VCol>
      <VCol cols="12" md="6">
        <ViewCard :title="msg('hoursTitle')">
          <ApexChart
            v-if="categories.length"
            type="bar"
            :height="chartHeight"
            :options="chartOptions('hours')"
            :series="series('hours')"
          />
        </ViewCard>
      </VCol>
    </VRow>

    <p class="text-caption text--secondary mt-2">
      {{ msg('definitions') }}
      <template v-if="total.jobsWithoutHours">
        {{ msg('withoutHours').replace('{n}', total.jobsWithoutHours) }}
      </template>
      <template v-if="total.jobsBookedCanceled">
        {{ msg('bookedCanceled').replace('{n}', total.jobsBookedCanceled) }}
      </template>
    </p>
  </div>
</template>

<script>
import VueApexCharts from 'vue-apexcharts'
import mixin from '@/components/chart/view/mixin'
import KpiTiles from '../shared/KpiTiles.vue'
import ViewCard from '../shared/ViewCard.vue'

const DEFAULT_MESSAGES = {
  jobsApplied: 'Jobs applied for',
  jobsBooked: 'Jobs booked',
  bookingRate: 'Booking rate',
  hoursApplied: 'Hours applied for',
  hoursBooked: 'Hours booked',
  jobsTitle: 'Jobs by category',
  hoursTitle: 'Hours by category',
  applied: 'Applied for',
  booked: 'Booked',
  uncategorised: 'No category',
  definitions: 'Every job in the export counts as applied for. A job counts as booked when the client booked it.',
  withoutHours: '{n} jobs have no number of hours and are left out of the hours.',
  bookedCanceled: '{n} booked jobs were cancelled afterwards; they still count as booked.'
}

// Yoojo's categories are in French; English labels for English readers
const ENGLISH_CATEGORIES = {
  Ménage: 'Cleaning',
  Animaux: 'Pets',
  Aménagement: 'Home improvement',
  Enfants: 'Children',
  'Aide à domicile': 'Home help',
  'Entretien de la pelouse': 'Lawn care',
  'Équipements extérieurs': 'Outdoor equipment',
  'Entretien des espaces verts': 'Garden maintenance',
  'Cours particuliers': 'Private lessons',
  Bricolage: 'DIY',
  Déménagement: 'Moving',
  Informatique: 'IT help',
  Jardinage: 'Gardening'
}

export default {
  name: 'YoojoEffectiveWork',
  components: { ApexChart: VueApexCharts, KpiTiles, ViewCard },
  mixins: [mixin],
  computed: {
    // pipeline rows: { scope, category, jobsApplied, jobsBooked, jobsBookedCanceled,
    //                  hoursApplied, hoursBooked, jobsWithoutHours, bookingRate }
    total() {
      return this.values.find(row => row.scope === 'total') || {}
    },
    categories() {
      return this.values.filter(row => row.scope === 'category')
    },
    english() {
      return (this.$i18n?.locale || 'en').startsWith('en')
    },
    kpis() {
      const number = value => (value ?? 0).toLocaleString(this.$i18n?.locale, { maximumFractionDigits: 1 })
      return [
        { label: this.msg('jobsApplied'), value: number(this.total.jobsApplied) },
        { label: this.msg('jobsBooked'), value: number(this.total.jobsBooked) },
        { label: this.msg('bookingRate'), value: `${Math.round((this.total.bookingRate || 0) * 100)} %` },
        { label: this.msg('hoursBooked'), value: `${number(this.total.hoursBooked)} h / ${number(this.total.hoursApplied)} h` }
      ]
    },
    chartHeight() {
      return Math.max(220, 40 * this.categories.length + 80)
    }
  },
  methods: {
    msg(key) {
      return this.messages?.[key] ?? DEFAULT_MESSAGES[key]
    },
    label(category) {
      if (!category) {
        return this.msg('uncategorised')
      }
      return this.english ? ENGLISH_CATEGORIES[category] || category : category
    },
    series(kind) {
      return [
        { name: this.msg('applied'), data: this.categories.map(row => row[`${kind}Applied`]) },
        { name: this.msg('booked'), data: this.categories.map(row => row[`${kind}Booked`]) }
      ]
    },
    chartOptions(kind) {
      const theme = this.$vuetify?.theme?.themes?.light || {}
      return {
        chart: { toolbar: { show: false }, animations: { enabled: false } },
        colors: ['#bdbbd9', theme.primary || '#58539e'],
        plotOptions: { bar: { horizontal: true, barHeight: '70%' } },
        dataLabels: { enabled: true, style: { fontSize: '11px' } },
        xaxis: {
          categories: this.categories.map(row => this.label(row.category)),
          title: { text: kind === 'hours' ? 'h' : '' }
        },
        legend: { position: 'top' }
      }
    }
  }
}
</script>

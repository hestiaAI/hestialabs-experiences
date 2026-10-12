<template>
  <div class="service-revenues-over-time">
    <KpiTiles class="mt-3" :items="kpis" />

    <ViewCard class="mt-3" :title="msg('title')">
      <template #actions>
        <VSelect
          v-if="currencies.length > 1"
          v-model="currency"
          class="currency-select mr-3"
          :items="currencies"
          outlined
          dense
          hide-details
        />
        <VBtnToggle
          v-model="granularity"
          mandatory
          dense
          color="primary"
        >
          <VBtn value="month" small>
            {{ msg('month') }}
          </VBtn>
          <VBtn value="week" small>
            {{ msg('week') }}
          </VBtn>
        </VBtnToggle>
      </template>

      <ApexChart
        v-if="rows.length"
        type="bar"
        height="380"
        :options="chartOptions"
        :series="series"
      />
      <p v-else class="text--secondary">
        {{ msg('noData') }}
      </p>
      <p class="text-caption text--secondary mt-2 mb-0">
        {{ msg('vatNote') }}
      </p>
    </ViewCard>
  </div>
</template>

<script>
import VueApexCharts from 'vue-apexcharts'
import mixin from '@/components/chart/view/mixin'
import KpiTiles from '../shared/KpiTiles.vue'
import ViewCard from '../shared/ViewCard.vue'

const DEFAULT_MESSAGES = {
  title: 'Service revenues over time',
  month: 'Month',
  week: 'Week',
  base: 'Base revenue',
  tips: 'Tips',
  vat: 'VAT (not included)',
  other: 'Other items',
  noData: 'No payments in this export.',
  vatNote: 'Bars show base revenue and tips, plus other items (fees, adjustments) when there are any. VAT is collected for the tax authorities, so it is shown apart and not added.'
}

export default {
  name: 'ServiceRevenuesOverTime',
  components: { ApexChart: VueApexCharts, KpiTiles, ViewCard },
  mixins: [mixin],
  data() {
    return { granularity: 'month', chosenCurrency: null }
  },
  computed: {
    // pipeline rows: { period, granularity, base, tips, vat, other, currency }
    allRows() {
      return this.values.filter(row => row.granularity)
    },
    currencies() {
      return [...new Set(this.allRows.map(row => row.currency))]
    },
    currency: {
      get() {
        return this.chosenCurrency ?? this.currencies[0]
      },
      set(value) {
        this.chosenCurrency = value
      }
    },
    rows() {
      return this.allRows.filter(
        row => row.granularity === this.granularity && row.currency === this.currency
      )
    },
    kpis() {
      // the monthly rows cover every payment once
      const months = this.allRows.filter(row => row.granularity === 'month' && row.currency === this.currency)
      const sum = key => months.reduce((total, row) => total + row[key], 0)
      const money = value => `${this.currency} ${value.toLocaleString(this.$i18n?.locale, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
      return [
        { label: this.msg('base'), value: money(sum('base')) },
        { label: this.msg('tips'), value: money(sum('tips')) },
        { label: this.msg('vat'), value: money(sum('vat')) }
      ]
    },
    hasOther() {
      return this.rows.some(row => row.other !== 0)
    },
    series() {
      const series = [
        { name: this.msg('base'), data: this.rows.map(row => row.base) },
        { name: this.msg('tips'), data: this.rows.map(row => row.tips) }
      ]
      if (this.hasOther) {
        series.push({ name: this.msg('other'), data: this.rows.map(row => row.other) })
      }
      return series
    },
    chartOptions() {
      const theme = this.$vuetify?.theme?.themes?.light || {}
      return {
        chart: { stacked: true, toolbar: { show: false }, animations: { enabled: false } },
        colors: [theme.primary || '#58539e', theme.success || '#388e3c', theme.secondary || '#f39506'],
        dataLabels: { enabled: false },
        plotOptions: { bar: { columnWidth: '70%' } },
        xaxis: { categories: this.rows.map(row => row.period), tickAmount: Math.min(this.rows.length, 12) },
        yaxis: { labels: { formatter: value => `${this.currency} ${Math.round(value)}` } },
        tooltip: { y: { formatter: value => `${this.currency} ${Number(value).toFixed(2)}` } },
        legend: { position: 'top' }
      }
    }
  },
  methods: {
    msg(key) {
      return this.messages?.[key] ?? DEFAULT_MESSAGES[key]
    }
  }
}
</script>

<style scoped>
.currency-select {
  max-width: 110px;
}
</style>

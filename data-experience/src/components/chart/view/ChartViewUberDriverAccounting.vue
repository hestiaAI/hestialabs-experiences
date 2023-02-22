<template>
  <div class="ma-0 pa-0">
  <VContainer>
    <VRow class="d-flex  align-stretch justify-center">
      <VCol v-for="(overview, index) in overviews" :key="index" :cols="2" class="pa-0">
        <VCard height="100%" flat>
            <VListItem two-line>
              <VListItemContent>
                <div class="text-overline mb-1">
                  {{overview.title}}
                </div>
                <VListItemTitle class="text-h4 text--primary font-weight-bold">
                    {{numberFormatter(overview.value)}}
                    <span class="caption">
                    {{overview.suffix}}
                  </span>
                </VListItemTitle>
              </VListItemContent>
          </VListItem>
        </VCard>
      </VCol>
      <VCol cols="2">
        <VBtn
          color="primary"
          outlined
          dark
          @click="drawer = true"
        >
          More Options
        </VBtn>
      </VCol>
    </VRow>
    <VRow>
      <VCol cols="12">
        <UnitFilterableTable v-bind="{ headers: header, items: results, viewBlockTranslationPrefix }" />
      </VCol>
    </VRow>
    <span class="caption">* Km Cost to be covered: This value is computed with the following formula: <strong>Km * Cost per kilometre</strong></span><br>
    <span class="caption">** Theoritical wage: This value is computed with the following formula: <strong>Time * Multiplying factor * Wage</strong></span>
  </VContainer>
  <VNavigationDrawer
      v-model="drawer"
      fixed
      width="280px"
      temporary
    >
      <div class="d-flex ma-3">
        <div class="text-h6">Options</div>
        <VSpacer/>
        <VIcon @click="drawer = false">$vuetify.icons.mdiClose</VIcon>
      </div>
      <VListItem>
        <VListItemContent>
          <VListItemTitle>Date range</VListItemTitle>
          <div class="caption">The date range to include.</div>
          <div class="d-flex">
            <BaseDateSelector v-model="form.startDate" label="From"></BaseDateSelector>
            <BaseDateSelector v-model="form.endDate" label="To"></BaseDateSelector>
          </div>
        </VListItemContent>
      </VListItem>
       <VListItem>
        <VListItemContent>
          <VListItemTitle>Kilometric cost</VListItemTitle>
          <div class="caption">
            The average cost per kilometre is at 0.70CHF in Switzerland according to the <a href="https://www.tcs.ch/fr/le-tcs/presse/communiques-de-presse-2021/couts-kilometriques-2021.php">TCS</a>.<br>
            <a href="https://www.tcs.ch/fr/tests-conseils/conseils/achat-vente-vehicule/recherche-auto-comparaison.php">Calculate yours according to your car.</a>
          </div>
          <VTextField
            label="Costs per kilometre"
            v-model="form.kmCost"
            :step="0.01"
            type="number"
            prefix="CHF"
          ></VTextField>
        </VListItemContent>
      </VListItem>
      <VListItem>
        <VListItemContent>
          <VListItemTitle>Wages</VListItemTitle>
          <div class="caption">
            The minimum wage salary in Geneva since 1 november 2020 is CHF 23.27. <br>
            <a href="https://www.eda.admin.ch/missions/mission-onu-geneve/en/home/manual-regime-privileges-and-immunities/introduction/manual-labour-law/Salaire-minimum-dans-le-canton-de-Geneve.html">eda.admin.ch</a>.<br>
          </div>
          <VTextField
            label="Costs per hour"
            v-model="form.wage"
            :step="0.1"
            type="number"
            prefix="CHF"
          ></VTextField>
        </VListItemContent>
      </VListItem>
      <VListItem>
        <VListItemContent>
          <VListItemTitle>Group by</VListItemTitle>
          <div class="caption">
            Decide on the temporal granularity at which you will group the data.
          </div>
          <VSelect
            :items="Object.keys(aggregations)"
            :menu-props="{ bottom: true, offsetY: true }"
            v-model="form.groupBy"
            label="Group by"
          ></VSelect>
        </VListItemContent>
      </VListItem>
      <VListItem>
        <VListItemContent>
          <VListItemTitle>Multiplying factor</VListItemTitle>
          <div class="caption">
            Depending on your situation, working at night or at weekends is not paid in the same way, please adapt the multipliers here.
          </div>
          <VRow dense>
            <VCol cols="4">
              <VSubheader>WeekDay</VSubheader>
            </VCol>
            <VCol cols="4">
              <VTextField
                v-model="form.c.weekday.day"
                label="Day"
                :step="0.1"
                type="number"
              ></VTextField>
            </VCol>
            <VCol cols="4">
              <VTextField
                v-model="form.c.weekday.night"
                label="Night"
                :step="0.1"
                type="number"
              ></VTextField>
            </VCol>
          </VRow>
          <VRow dense>
            <VCol cols="4">
              <VSubheader>WeekEnd</VSubheader>
            </VCol>
            <VCol cols="4">
              <VTextField
                v-model="form.c.weekend.day"
                label="Day"
                :step="0.1"
                type="number"
              ></VTextField>
            </VCol>
            <VCol cols="4">
              <VTextField
                v-model="form.c.weekend.night"
                label="Night"
                :step="0.1"
                type="number"
              ></VTextField>
            </VCol>
          </VRow>
        </VListItemContent>
      </VListItem>
  </VNavigationDrawer>
  </div>
</template>

<script>
import mixin from './mixin'
import UnitFilterableTable from '@/components/unit/filterable-table/UnitFilterableTable.vue'
import BaseDateSelector from '@/components/base/BaseDateSelector.vue'
import * as d3 from 'd3'
import { nest } from 'd3-collection'
import { sumBy, mapValues } from 'lodash'
export default {
  components: { UnitFilterableTable, BaseDateSelector },
  mixins: [mixin],
  props: {},
  data() {
    const timeParser = d3.timeParse('%s')
    const dateExtent = d3.extent(this.values, v => timeParser(v.begin_ts))
    return {
      drawer: false,
      timeParser,
      numberFormatter: d3.format('.2s'),
      aggregations: {
        Year: d3.timeFormat('%Y'),
        Month: d3.timeFormat('%Y/%m'),
        Week: d3.timeFormat('%Y week-%V'),
        Day: d3.timeFormat('%Y/%m/%d')
      },
      form: {
        startDate: dateExtent[0],
        endDate: dateExtent[1],
        groupBy: 'Year',
        kmCost: 0.7,
        wage: 23.27,
        c: {
          weekday: {
            day: 1,
            night: 1.2
          },
          weekend: {
            day: 1,
            night: 1.5
          }
        }
      },
      allValues: []
    }
  },
  computed: {
    results() {
      // GroupBy
      const rollup = nest()
        .key(d => d[this.form.groupBy])
        .sortKeys(d3.ascending)
        .key(d => d.status)
        .key(d => d.type)
        .key(d => d.period)
        .rollup((values) => {
          return {
            time: d3.sum(values, l => l.time),
            distance: d3.sum(values, l => l.distance),
            price: d3.sum(values, l => l.price)
          }
        })
        .entries(this.allValues.filter(v => v.date >= this.form.startDate && v.date <= this.form.endDate))

      // Flatten to array of object
      const results = rollup.flatMap((groupBy) => {
        const _groupBy = groupBy.key
        return groupBy.values.flatMap((status) => {
          const _status = status.key
          return status.values.flatMap((type) => {
            const _type = type.key
            return type.values.map(period => (
              {
                [this.form.groupBy]: _groupBy,
                Status: _status,
                Type: _type,
                Period: period.key,
                Km: period.value.distance,
                'Time (hr)': period.value.time,
                'Km Cost to be covered*': period.value.distance * this.form.kmCost,
                'Theoritical wage**': this.form.c[_type][period.key] * period.value.time * this.form.wage,
                'Uber Income': period.value.price
              }
            ))
          })
        })
      })
      return results
    },
    header() {
      if (this.results.length) {
        return Object.keys(this.results[0])
      } else {
        return []
      }
    },
    overviews() {
      return [
        {
          title: 'Kilometers',
          value: sumBy(this.results, 'Km'),
          suffix: 'km'
        },
        {
          title: 'Time',
          value: sumBy(this.results, 'Time (hr)'),
          suffix: 'hours'
        },
        {
          title: 'Km Expenses',
          value: sumBy(this.results, 'Km Cost to be covered*'),
          suffix: 'CHF'
        },
        {
          title: 'Estimated wages',
          value: sumBy(this.results, 'Theoritical wage**'),
          suffix: 'CHF'
        },
        {
          title: 'Uber Income',
          value: sumBy(this.results, 'Uber Income'),
          suffix: 'CHF'
        }
      ]
    }
  },
  methods: {
    drawViz() {
      // Precompute the agg values for better performances
      this.allValues = this.values.map((e) => {
        const time = Math.max(0, e.end_ts - e.begin_ts) / (1000 * 60 * 60)
        const date = this.timeParser(e.begin_ts)
        const type = date.getDay() > 4 ? 'weekend' : 'weekday'
        const period = date.getHours() > 22 || date.getHours() < 7 ? 'night' : 'day'
        return {
          date,
          type,
          period,
          time,
          status: e.status,
          distance: e.distance,
          price: e.price,
          ...mapValues(this.aggregations, formatAgg => formatAgg(date))
        }
      })
    }
  }
}
</script>

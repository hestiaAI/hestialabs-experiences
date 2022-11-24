<template>
  <VContainer>
    <VRow class="d-flex  align-stretch justify-center mb-3">
      <VCol v-for="(overview, index) in overviews" :key="index" :cols="2">
        <VCard height="100%" flat>
            <VListItem two-line>
              <VListItemContent>
                <div class="text-overline mb-1">
                  {{overview.title}}
                </div>
                <VListItemTitle class="text-h4 text--primary font-weight-bold">
                    {{overview.value}}
                    <span class="caption">
                    {{overview.suffix}}
                  </span>
                </VListItemTitle>
              </VListItemContent>
          </VListItem>
        </VCard>
      </VCol>
      <VCol cols="2">
        <VMenu top offset-y :close-on-content-click="false" max-width="400px">
          <template v-slot:activator="{ on, attrs }">
            <VBtn
              color="primary"
              dark
              v-bind="attrs"
              v-on="on"
            >
              CONFIGURE
            </VBtn>
          </template>
          <VExpansionPanels accordion>
            <VExpansionPanel>
              <VExpansionPanelHeader>
                <template v-slot:default="{ open }">
                  <VRow no-gutters align="center">
                    <VCol cols="6">
                      <h6 class="text-h6">Kilometric Cost</h6>
                    </VCol>
                    <VCol
                      cols="4"
                      offset="1"
                      class="text--secondary text-center"
                    >
                      <span
                        v-if="!open"
                      >
                        {{ form.kmCost }} CHF/km
                      </span>
                    </VCol>
                  </VRow>
                </template>
              </VExpansionPanelHeader>
              <VExpansionPanelContent>
                <span class="caption">The average cost per kilometre is at 0.70CHF in Switzerland according to the <a href="https://www.tcs.ch/fr/le-tcs/presse/communiques-de-presse-2021/couts-kilometriques-2021.php">TCS</a>.<br>
                <a href="https://www.tcs.ch/fr/tests-conseils/conseils/achat-vente-vehicule/recherche-auto-comparaison.php">Calculate yours according to your car.</a>
                </span>
                <VTextField
                  label="Costs per kilometre"
                  v-model="form.kmCost"
                  type="number"
                  prefix="CHF"
                ></VTextField>
              </VExpansionPanelContent>
            </VExpansionPanel>
            <VExpansionPanel>
              <VExpansionPanelHeader>
                <template v-slot:default="{ open }">
                  <VRow no-gutters align="center">
                    <VCol cols="6">
                      <h6 class="text-h6">Wage</h6>
                    </VCol>
                    <VCol
                      cols="4"
                       offset="1"
                      class="text--secondary text-center"
                    >
                      <span
                        v-if="!open"
                      >
                        {{ form.wage }} CHF/hour
                      </span>
                    </VCol>
                  </VRow>
                </template>
              </VExpansionPanelHeader>
              <VExpansionPanelContent>
                <span class="caption">The minimum wage salary in Geneva since 1 november 2020 is CHF 23.27. <br>
                <a href="https://www.eda.admin.ch/missions/mission-onu-geneve/en/home/manual-regime-privileges-and-immunities/introduction/manual-labour-law/Salaire-minimum-dans-le-canton-de-Geneve.html">eda.admin.ch</a>.<br>
                </span>
                <VTextField
                  label="Costs per hour"
                  v-model="form.wage"
                  type="number"
                  prefix="CHF"
                ></VTextField>
              </VExpansionPanelContent>
            </VExpansionPanel>
            <VExpansionPanel>
              <VExpansionPanelHeader>
                <template v-slot:default="{ open }">
                  <VRow no-gutters align="center">
                    <VCol cols="6">
                      <h6 class="text-h6">Group by</h6>
                    </VCol>
                    <VCol
                      cols="4"
                       offset="1"
                      class="text--secondary text-center"
                    >
                      <span
                        v-if="!open"
                      >
                        {{ form.groupBy }}
                      </span>
                    </VCol>
                  </VRow>
                </template>
              </VExpansionPanelHeader>
              <VExpansionPanelContent>
                <span class="caption">
                Decide on the temporal granularity at which you will group the data.
                </span>
                <VSelect
                  :items="['Weeks', 'Months', 'Year', 'All']"
                  :menu-props="{ bottom: true, offsetY: true }"
                  v-model="form.groupBy"
                  label="Group by"
                ></VSelect>
              </VExpansionPanelContent>
            </VExpansionPanel>
            <VExpansionPanel>
              <VExpansionPanelHeader>
                <template v-slot:default="{ open }">
                  <VRow no-gutters align="center">
                    <VCol cols="6">
                      <h6 class="text-h6">Multiplying factor</h6>
                    </VCol>
                    <VCol
                      cols="4"
                      offset="1"
                      class="text--secondary text-center"
                    >
                      <span
                        v-if="!open"
                      >
                        {{ form.c.wdd }} / {{ form.c.wdn }} / {{ form.c.wed }} / {{ form.c.wen }}
                      </span>
                    </VCol>
                  </VRow>
                </template>
              </VExpansionPanelHeader>
              <VExpansionPanelContent>
                <span class="caption">
                Depending on your situation, working at night or at weekends is not paid in the same way, please adapt the multipliers here.
                </span>
                <VRow dense>
                  <VCol cols="4">
                    <VSubheader>WeekDay</VSubheader>
                  </VCol>
                  <VCol cols="4">
                    <VTextField
                      label="Day"
                      :value="1"
                      type="number"
                    ></VTextField>
                  </VCol>
                  <VCol cols="4">
                    <VTextField
                      label="Night"
                      :value="1.2"
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
                      label="Day"
                      :value="1"
                      type="number"
                    ></VTextField>
                  </VCol>
                  <VCol cols="4">
                    <VTextField
                      label="Night"
                      :value="1.5"
                      type="number"
                    ></VTextField>
                  </VCol>
                </VRow>
              </VExpansionPanelContent>
            </VExpansionPanel>
          </VExpansionPanels>
        </VMenu>
      </VCol>
    </VRow>
    <VRow>
      <VCol cols="12">
        <UnitFilterableTable v-bind="{ headers: header, items: results }" />
      </VCol>
    </VRow>
    <span class="caption">* Km Cost to be covered: This value is computed with the following formula: <strong>Km * Cost per kilometre</strong></span><br>
    <span class="caption">** Theoritical wage: This value is computed with the following formula: <strong>Time * Multiplying factor * Wage</strong></span>
  </VContainer>
</template>

<script>
import mixin from './mixin'
import UnitFilterableTable from '@/components/unit/filterable-table/UnitFilterableTable.vue'
import { sumBy } from 'lodash'
export default {
  components: { UnitFilterableTable },
  mixins: [mixin],
  props: {},
  data() {
    return {
      form: {
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
      header: [
        { text: 'Year', value: 'year' },
        { text: 'Type', value: 'type' },
        { text: 'Period', value: 'period' },
        { text: 'Status', value: 'status' },
        { text: 'Km', value: 'distance' },
        { text: 'Time (hr)', value: 'time' },
        { text: 'Km Cost to be covered*', value: 'fareDistance' },
        { text: 'Theoritical wage**', value: 'fareTime' },
        { text: 'Theoritical Income', value: 'total' },
        { text: 'Uber Income', value: 'uberTotal' }
      ],
      results: [
        { year: '2020', type: 'weekday', period: 'day', distance: 8500, time: 200, status: 'On trip (P3)', uberTotal: '8623' },
        { year: '2020', type: 'weekday', period: 'night', distance: 11230, time: 200, status: 'En route (P2)', uberTotal: '8623' },
        { year: '2020', type: 'weekend', period: 'day', distance: 333, time: 200, status: 'Waiting (P1)', uberTotal: '8623' },
        { year: '2020', type: 'weekend', period: 'night', distance: 6590, time: 200, status: 'En route (P2)', uberTotal: '8623' },
        { year: '2019', type: 'weekday', period: 'day', distance: 5630, time: 200, status: 'Waiting (P1)', uberTotal: '8623' },
        { year: '2019', type: 'weekday', period: 'night', distance: 120, time: 200, status: 'Waiting (P1)', uberTotal: '8623' },
        { year: '2019', type: 'weekend', period: 'day', distance: 22000, time: 200, status: 'Waiting (P1)', uberTotal: '8623' },
        { year: '2019', type: 'weekend', period: 'night', distance: 56230, time: 200, status: 'Waiting (P1)', uberTotal: '8623' }
      ]
    }
  },
  computed: {
    overviews() {
      return [
        {
          title: 'Kilometers',
          // logo: '$vuetify.icons.mdiMapMarkerDistance',
          value: sumBy(this.results, 'distance'),
          suffix: 'km'
        },
        {
          title: 'Time',
          // logo: '$vuetify.icons.mdiClockOutline',
          value: sumBy(this.results, 'time'),
          suffix: 'hours'
        },
        {
          title: 'Km Expenses',
          value: sumBy(this.results, 'fareDistance'),
          suffix: 'CHF'
        },
        {
          title: 'Estimated wages',
          value: sumBy(this.results, 'fareTime'),
          suffix: 'CHF'
        },
        {
          title: 'Uber Income',
          value: sumBy(this.results, 'uberTotal'),
          suffix: 'CHF'
        }
      ]
    }
  },
  methods: {
    drawViz() {
      this.results = this.results.map((r) => {
        const time = Math.ceil(r.distance / 45)
        const fareDistance = Math.ceil(r.distance * this.form.kmCost)
        const fareTime = Math.ceil(this.form.c[r.type][r.period] * time * this.form.wage)
        return {
          ...r,
          time,
          fareDistance,
          fareTime,
          total: fareDistance + fareTime,
          uberTotal: fareDistance + fareTime - 2789
        }
      })
    }
  }
}
</script>

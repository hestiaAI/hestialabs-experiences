<template>
  <VContainer>
    <VRow>
      <VCol cols="3">
        <div class="text-h5">Statistics</div>
        <VBtn text small class="ma-3">
          <VIcon>$vuetify.icons.mdiPlus</VIcon> Add Statistic
        </VBtn>
       </VCol>
       <VCol cols="9">
        <VCard flat outlined class="pa-2">
          <div class="d-flex justify-space-between">
            <span>
              From {{ timeFormat(dateExtent[0]) }} to {{ timeFormat(dateExtent[1]) }} the <strong>sum</strong> of <strong>distance</strong> is: <strong>2657</strong>
            </span>
            <VIcon>$vuetify.icons.mdiLock</VIcon>
          </div>
        </VCard>
       </VCol>
    </VRow>
    <VRow>
       <VCol cols="3">
        <span class="text-h5">Status</span>
       </VCol>
       <VCol cols="9">
        <VRadioGroup v-model="options.groupBy" row label="Choose a time period" dense hide-details class="mt-1">
          <VRadio
            v-for="agg in Object.keys(aggregations)"
            :key="agg"
            :label="`${agg}`"
            :value="agg"
          ></VRadio>
        </VRadioGroup>
       </VCol>
    </VRow>
    <VRow>
      <VCol cols="3">
        <Draggable v-model="statuses">
           <TransitionGroup name="statuses">
            <div v-for="(status, idx) in statuses" :key="idx" class="d-flex justify-space-between align-center mt-3 mb-3">
              <VCheckbox
                v-model="options.statuses[status]"
                :label="status"
                :color="colorScale(status)"
                class="mt-2 mb-2"
                hide-details
              ></VCheckbox>
              <VIcon depressed small class="move">$vuetify.icons.mdiReorderVertical</VIcon>
            </div>
           </TransitionGroup>
        </Draggable>
        <VMenu
          v-model="menuAddStatus"
          :close-on-content-click="false"
          offset-x
        >
          <template v-slot:activator="{ on, attrs }">
            <VBtn text small class="ma-3" v-bind="attrs"
              v-on="on">
              <VIcon>$vuetify.icons.mdiPlus</VIcon> Add Status
            </VBtn>
          </template>
          <VCard max-width="450px">
            <VContainer>
              <VForm ref="form">
                <VRow align="center">
                  <VCol
                      cols="12"
                    >
                      <VTextField
                        v-model="formAddStatus['name']"
                        label="Name"
                        required
                        :rules="[v => !!v || 'Name is required']"
                      ></VTextField>
                  </VCol>
                  <VCol
                      class="d-flex"
                      cols="12"
                      md="4"
                    >
                      <VSelect
                        v-model="formAddStatus['status_1']"
                        :items="statuses"
                        label="Status 1"
                        required
                        :rules="[v => !!v || 'Status 1 is required']"
                      ></VSelect>
                  </VCol>
                  <VCol
                      class="d-flex"
                      cols="12"
                      sm="6"
                      md="4"
                    >
                      <VSelect
                         v-model="formAddStatus['operation']"
                        :items="['And', 'Or']"
                        label="Operation"
                        required
                        :rules="[v => !!v || 'Operation is required']"
                      ></VSelect>
                  </VCol>
                  <VCol
                      class="d-flex"
                      cols="12"
                      sm="6"
                      md="4"
                    >
                      <VSelect
                         v-model="formAddStatus['status_2']"
                        :items="statuses"
                        label="Status 2"
                        required
                        :rules="[v => !!v || 'Status 2 is required']"
                      ></VSelect>
                  </VCol>
                </VRow>
              </VForm>
            </VContainer>
             <VCardActions>
              <VSpacer></VSpacer>

              <VBtn
                text
                @click="menuAddStatus = false"
              >
                Cancel
              </VBtn>
              <VBtn
                color="primary"
                text
                @click="newStatus"
              >
                Save
              </VBtn>
            </VCardActions>
          </VCard>
        </VMenu>
      </VCol>
      <VCol cols="9">
        <GantDiagram v-bind="{activities: statuses, currentExtent, colorScale, values: allValues}" class="pa-3"></GantDiagram>
      </VCol>
    </VRow>
    <VRow>
      <VCol cols="12">
        <AreaDatePicker v-model="currentExtent" :values="allValues" dateAccessor="begin_ts"></AreaDatePicker>
      </VCol>
    </VRow>
    <VRow>
      <VCol cols="12">
        <UnitFilterableTable v-bind="{ headers: header, items: allValues }" />
      </VCol>
    </VRow>
  </VContainer>
</template>

<script>
import Draggable from 'vuedraggable'
import mixin from './mixin'
import UnitFilterableTable from '@/components/unit/filterable-table/UnitFilterableTable.vue'
import * as d3 from 'd3'
import AreaDatePicker from './base/AreaDatePicker.vue'
import GantDiagram from './base/GantDiagram.vue'
// import { nest } from 'd3-collection'
// import { sumBy, mapValues } from 'lodash'
export default {
  components: { UnitFilterableTable, AreaDatePicker, GantDiagram, Draggable },
  mixins: [mixin],
  props: {},
  data() {
    const timeParser = d3.timeParse('%s')
    const timeFormat = d3.timeFormat('%Y-%m-%d %H:%M:%S')
    const dateExtent = d3.extent(this.values, v => timeParser(v.begin_ts))
    const uniqueStatuses = [...new Set(this.values.map(d => d.status))]
    return {
      allValues: this.values.map((v) => {
        return {
          begin_ts: timeFormat(timeParser(v.begin_ts)),
          end_ts: timeFormat(timeParser(v.end_ts)),
          status: v.status
        }
      }),
      menuAddStatus: false,
      formAddStatus: {},
      timeParser,
      timeFormat,
      dateExtent,
      currentExtent: dateExtent,
      numberFormatter: d3.format('.2s'),
      aggregations: {
        Year: d3.timeFormat('%Y'),
        Month: d3.timeFormat('%Y/%m'),
        Week: d3.timeFormat('%Y week-%V'),
        Day: d3.timeFormat('%Y/%m/%d')
      },
      options: {
        statuses: uniqueStatuses.reduce((a, v) => ({ ...a, [v]: true }), {}),
        groupBy: 'Year'
      },
      colorScale: d3
        .scaleOrdinal()
        .domain(uniqueStatuses)
        .range(d3.schemeSet2)
    }
  },
  computed: {
    header() {
      if (this.allValues.length) {
        return Object.keys(this.allValues[0])
      } else {
        return []
      }
    },
    statuses() {
      return [...new Set(this.allValues.map(d => d.status))]
    }
  },
  methods: {
    drawViz() {},
    newStatus() {
      if (!this.$refs.form.validate()) return
      this.computeIntersection(this.formAddStatus.status_1, this.formAddStatus.status_2, this.formAddStatus.name)
      console.log(this.formAddStatus)
      // this.$refs.form.reset()
      this.menuAddStatus = false
    },
    computeIntersection(status1, status2, name) {
      const first = this.allValues
        .filter(v => v.status === status1)
        .map((v) => {
          return {
            ...v,
            begin_ts: new Date(v.begin_ts),
            end_ts: new Date(v.end_ts),
            status: name
          }
        })
        .sort((a, b) => b.begin_ts - a.begin_ts)
      const second = this.allValues
        .filter(v => v.status === status2)
        .map((v) => {
          return {
            ...v,
            begin_ts: new Date(v.begin_ts),
            end_ts: new Date(v.end_ts)
          }
        })
        .sort((a, b) => b.begin_ts - a.begin_ts)

      const events = []
      first.forEach((event1) => {
        second.every((event2) => {
          // console.log('Comparing: ', event1.begin_ts, event1.end_ts, 'with', event2.begin_ts, event2.end_ts)
          // break the second loop if no more interserctions possible
          if (event1.begin_ts > event2.end_ts) return false
          console.log('Event1: ', this.timeFormat(event1.begin_ts), this.timeFormat(event1.end_ts))
          console.log('Event2', this.timeFormat(event2.begin_ts), this.timeFormat(event2.end_ts))
          // if event2 start in event1
          if (event1.begin_ts <= event2.begin_ts && event2.begin_ts <= event1.end_ts) {
            console.log('Event2 start in Event1')
            events.push({
              begin_ts: event2.begin_ts,
              end_ts: new Date(Math.min(event2.end_ts, event1.end_ts)),
              status: name
            })
            return true
          }

          // if event2 end in event1
          if (event1.begin_ts <= event2.end_ts && event2.end_ts <= event1.end_ts) {
            console.log('Event2 end in Event1')
            events.push({
              begin_ts: new Date(Math.max(event2.begin_ts, event1.begin_ts)),
              end_ts: event2.end_ts,
              status: name
            })
            return true
          }

          // if event1 is included in event2
          if (event2.begin_ts < event1.begin_ts && event1.end_ts < event2.end_ts) {
            console.log('Event1 is included in Event2')
            events.push({
              begin_ts: event1.begin_ts,
              end_ts: event1.end_ts,
              status: name
            })
          }
          return true
        })
      })
      this.allValues.push(events)
      console.log(events, first)
    }
  }
}
</script>
<style scoped>
/* 1. declare transition */
.statuses-move,
.statuses-enter-active,
.statuses-leave-active {
  transition: all 0.5s cubic-bezier(0.55, 0, 0.1, 1);
}

/* 2. declare enter from and leave to state */
.statuses-enter-from,
.statuses-leave-to {
  opacity: 0;
  transform: scaleY(0.01) translate(30px, 0);
}

/* 3. ensure leaving items are taken out of layout flow so that moving
      animations can be calculated correctly. */
.statuses-leave-active {
  position: absolute;
}

.move {
  cursor: move;
}
</style>

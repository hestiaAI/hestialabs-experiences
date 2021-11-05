<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <v-tabs v-model="tab">
          <v-tab key="overview">Overview</v-tab>
          <v-tab key="details">Details</v-tab>
          <v-tab key="visualisation">Visualisation</v-tab>
        </v-tabs>
        <v-tabs-items v-model="tab">
          <v-tab-item key="overview">
            <p class="text-subtitle-1">
              <strong>{{ title }}</strong> knows about
              <strong>{{ total }}</strong> things that happened during this time
              period.
              <v-btn class="ma-2" outlined color="indigo"> See All </v-btn>
            </p>
            <v-list>
              <v-list-group
                v-for="item in items"
                :key="item.title"
                v-model="item.active"
                :prepend-icon="item.action"
                no-action
              >
                <template #activator>
                  <v-list-item-content>
                    <v-list-item-title>
                      <strong>{{ item.count }}</strong>
                      were regarding your
                      <strong>{{ item.title }}</strong>
                      activity.
                    </v-list-item-title>
                  </v-list-item-content>
                </template>

                <v-list-item v-for="child in item.items" :key="child.title">
                  <v-list-item-content>
                    <v-list-item-title>
                      <strong>{{ child.count }}</strong>
                      records of
                      <strong>{{ child.title }}</strong>
                      .
                    </v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
              </v-list-group>
            </v-list>
          </v-tab-item>
          <v-tab-item key="details">
            <unit-filterable-table
              v-bind="{ headers: header, items: results }"
            />
          </v-tab-item>
          <v-tab-item key="visualisation"></v-tab-item>
        </v-tabs-items>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12">
        <v-radio-group v-model="timeRange" row mandatory>
          <v-radio label="ALL" value="ALL"></v-radio>
          <v-radio label="1Y" value="1Y"></v-radio>
          <v-radio label="3M" value="3M"></v-radio>
          <v-radio label="1M" value="1M"></v-radio>
          <v-radio label="7D" value="7D"></v-radio>
          <v-radio label="1D" value="1D"></v-radio>
          <v-radio label="Custom" value="Custom"></v-radio>
        </v-radio-group>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import * as d3 from 'd3'
import * as dc from 'dc'
import crossfilter from 'crossfilter2'
import UnitFilterableTable from '~/components/UnitFilterableTable'

// Remove warning on default colorscheme, even if not used..
dc.config.defaultColors(d3.schemePaired)

export default {
  name: 'GenericDateViewer',
  components: { UnitFilterableTable },
  props: {
    values: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      title: 'Google My Activity',
      total: null,
      timeRange: null,
      tab: null,
      items: [],
      header: [
        { text: 'Date', value: 'date' },
        { text: 'Event type', value: 'event_type' },
        { text: 'Event value', value: 'event_value' }
      ],
      results: [
        {
          date: '2019-08-06T18:20:45.829Z',
          icon: '',
          event_source: 'Youtube',
          event_type: 'Search',
          event_value: 'patate'
        },
        {
          date: '2019-08-06T18:20:45.829Z',
          icon: '',
          event_source: 'Maps',
          event_type: 'View',
          event_value: 'link youtube'
        },
        {
          date: '2019-09-06T18:20:45.829Z',
          icon: '',
          event_source: 'Youtube',
          event_type: 'Search',
          event_value: 'patate'
        },
        {
          date: '2019-08-07T18:20:45.829Z',
          icon: '',
          event_source: 'Youtube',
          event_type: 'VIEW',
          event_value: 'patate2'
        }
      ]
    }
  },
  watch: {
    values(oldValues) {
      this.drawViz()
    }
  },
  mounted() {
    this.drawViz()
  },
  methods: {
    drawViz() {
      const ndx = crossfilter(this.results)
      const all = ndx.groupAll()
      const typeDimension = ndx.dimension(d => [
        d.event_source,
        d.event_type,
        d.icon
      ])
      const typeGroup = typeDimension.group().reduceCount()

      const counts = typeGroup.top(Infinity).reduce((p, c) => {
        if (!Object.prototype.hasOwnProperty.call(p, c.key[0])) {
          p[c.key[0]] = {}
          p[c.key[0]].count = 0
          p[c.key[0]].title = c.key[0]
          p[c.key[0]].action = c.key[2]
          p[c.key[0]].items = []
        }
        p[c.key[0]].count += c.value
        p[c.key[0]].items.push({ title: c.key[1], count: c.value })
        return p
      }, {})

      this.items = Object.values(counts)
      this.total = all.value()
    }
  }
}
</script>
<style></style>

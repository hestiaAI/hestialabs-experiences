<template>
  <VContainer>
    <VRow>
      <VCol>
        <VMenu
          ref="dateMenu"
          v-model="dateMenu"
          :close-on-content-click="false"
          :return-value.sync="datesIncluded"
          transition="scale-transition"
          offset-y
          min-width="auto"
        >
          <template #activator="{ on, attrs }">
            <VCombobox
              v-model="datesIncluded"
              multiple
              chips
              small-chips
              label="Select dates you want to include"
              prepend-icon="$vuetify.icon.mdiCalendar"
              readonly
              v-bind="attrs"
              v-on="on"
            >
              <template #selection="{ item, index }">
                <VChip v-if="index < 1" class="ma-1 pr-1">
                  <span
                    style="
                      overflow-x: hidden;
                      whitespace: nowrap;
                      text-overflow: ellipsis;
                    "
                  >
                    {{ item }}
                  </span>
                  <VBtn
                    icon
                    small
                    right
                    @click="datesIncluded.splice(index, 1)"
                  >
                    <VIcon small>$vuetify.icon.mdiCloseCircle</VIcon>
                  </VBtn>
                </VChip>
                <span v-if="index === 1" class="grey--text caption">
                  (+{{ datesIncluded.length - 1 }} others)
                </span>
              </template>
            </VCombobox>
          </template>
          <VDatePicker v-model="datesIncluded" multiple no-title scrollable>
            <VSpacer></VSpacer>
            <VBtn text color="primary" @click="dateMenu = false"> Cancel </VBtn>
            <VBtn
              text
              color="primary"
              @click="$refs.dateMenu.save(datesIncluded)"
            >
              OK
            </VBtn>
          </VDatePicker>
        </VMenu>
      </VCol>
    </VRow>
    <VRow>
      <VCol>
        <BaseSelectMultiple
          :items="weekDays"
          label="Select allowed week days"
        />
      </VCol>
    </VRow>
    <div class="d-flex justify-space-between align-end mt-5">
      <VBtn
        small
        text
        color="primary"
        class=""
        @click="reset"
        v-text="`Clear`"
      />
    </div>
  </VContainer>
</template>
<script>
import * as d3 from 'd3'
import _ from 'lodash'
import BaseSelectMultiple from '~/components/base/BaseSelectMultiple.vue'
export default {
  name: 'UnitFilter',
  components: { BaseSelectMultiple },
  props: {
    header: {
      type: Object,
      required: true
    },
    values: {
      type: Array,
      default: () => []
    }
  },
  data() {
    const extent = d3.extent(this.values, v => new Date(v))
    const dateFormatter = d3.timeFormat('%Y-%m-%d')
    const allDays = d3.timeDay
      .range(extent[0], extent[1])
      .map(d => dateFormatter(d))
    return {
      filter: [dateFormatter(extent[0]), dateFormatter(extent[1])],
      dateFormatter,
      allDays,
      datesIncluded: _.cloneDeep(allDays),
      dateMenu: false,
      weekDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    }
  },
  computed: {
    dates() {
      return this.values.map(v => new Date(v))
    },
    extent() {
      return d3.extent(this.dates).map(d => this.dateFormatter(d))
    },
    filterFunction() {
      if (this.filter === this.extent || this.filter === [null, null])
        return null
      else return value => value >= this.filter[0] && value <= this.filter[1]
    }
  },
  methods: {
    filterChange() {
      this.$emit('filter-change', this.filterFunction)
    },
    reset() {
      console.log(this.allDays.length, this.datesIncluded.length)
      this.datesIncluded = _.cloneDeep(this.allDays)
      this.filterChange()
    }
  }
}
</script>

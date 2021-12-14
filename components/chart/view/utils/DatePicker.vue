<template>
  <VBtnToggle v-model="selectedRange" mandatory rounded dense @change="change">
    <VBtn x-small value="1D"> 1D </VBtn>
    <VBtn x-small value="7D"> 7D </VBtn>
    <VBtn x-small value="1M"> 1M </VBtn>
    <VBtn x-small value="3M"> 3M </VBtn>
    <VBtn x-small value="1Y"> 1Y </VBtn>
    <VBtn x-small value="ALL"> ALL </VBtn>
    <VMenu
      ref="menu"
      v-model="menu"
      :close-on-content-click="false"
      :return-value.sync="dates"
      transition="scale-transition"
      offset-y
      min-width="auto"
    >
      <template #activator="{ on, attrs }">
        <VBtn x-small value="CUSTOM">
          <VIcon small v-bind="attrs" v-on="on"
            >$vuetify.icons.mdiCalendar</VIcon
          >
        </VBtn>
      </template>
      <VDatePicker
        v-model="dates"
        no-title
        scrollable
        range
        :max="formatDate(maxDate)"
        :min="formatDate(minDate)"
      >
        <VSpacer></VSpacer>
        <VBtn value="CUSTOM_CANCEL" text color="primary" @click="cancelDate">
          Cancel
        </VBtn>
        <VBtn value="CUSTOM_OK" text color="primary" @click="saveDate">
          OK
        </VBtn>
      </VDatePicker>
    </VMenu>
  </VBtnToggle>
</template>

<script>
import * as d3 from 'd3'
export default {
  name: 'DatePicker',
  props: {
    minDate: {
      type: Date,
      required: true
    },
    maxDate: {
      type: Date,
      default: () => new Date()
    }
  },
  data() {
    return {
      d3,
      formatDate: d3.timeFormat('%Y-%m-%d'),
      menu: false,
      selectedRange: '1D',
      prevSelectedRange: '1D',
      dates: []
    }
  },
  watch: {
    values() {
      this.init()
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    saveDate() {
      this.$refs.menu.save(this.dates)
      console.log(this.selectedRange, this.prevSelectedRange)
      this.selectedRange = 'CUSTOM'
    },
    cancelDate() {
      this.menu = false
      console.log(this.selectedRange, this.prevSelectedRange)
      // this.selectedRange = this.prevSelectedRange
    },
    init() {
      // console.log(this.dates)
    },
    change(btnID) {
      console.log(this.selectedRange, this.prevSelectedRange)
      switch (btnID) {
        case '1D':
          this.dates = [
            this.formatDate(d3.timeDay.offset(this.maxDate, -1)),
            this.formatDate(this.maxDate)
          ]
          break
        case '7D':
          this.dates = [
            this.formatDate(d3.timeDay.offset(this.maxDate, -7)),
            this.formatDate(this.maxDate)
          ]
          break
        case '1M':
          this.dates = [
            this.formatDate(d3.timeMonth.offset(this.maxDate, -1)),
            this.formatDate(this.maxDate)
          ]
          break
        case '3M':
          this.dates = [
            this.formatDate(d3.timeMonth.offset(this.maxDate, -3)),
            this.formatDate(this.maxDate)
          ]
          break
        case '1Y':
          this.dates = [
            this.formatDate(d3.timeYear.offset(this.maxDate, -1)),
            this.formatDate(this.maxDate)
          ]
          break
        case 'ALL':
          this.dates = [
            this.formatDate(this.minDate),
            this.formatDate(this.maxDate)
          ]
          break
        case 'CUSTOM_CANCEL':
          this.selectedRange = this.prevSelectedRange
          break
        case 'CUSTOM_OK':
          this.selectedRange = 'CUSTOM'
          break
        default:
          return
      }

      if (btnID !== 'CUSTOM_CANCEL' && btnID !== 'CUSTOM_OK')
        this.prevSelectedRange = btnID

      console.log(this.dates, btnID, this.selectedRange)

      // wait until the DOM has completely updated
      this.$nextTick(() => {
        // emit the current date range
        this.$emit('current-dates', this.dates)
      })
    }
  }
}
</script>
<style></style>

<template>
  <VMenu
    ref="menu"
    v-model="menu"
    :close-on-content-click="false"
    transition="scale-transition"
    offset-y
    max-width="290px"
    min-width="auto"
  >
    <template v-slot:activator="{ on, attrs }">
      <VTextField
        v-model="dateFormatted"
        v-bind="{label, hint, attrs}"
        v-on="on"
        persistent-hint
        prepend-icon="mdi-calendar"
      ></VTextField>
    </template>
    <VDatePicker
      v-model="date"
      no-title
      @input="handleInput"
    ></VDatePicker>
  </VMenu>
</template>
<script>
import * as d3 from 'd3'
export default {
  props: {
    value: {
      type: Date,
      default: () => new Date()
    },
    label: {
      type: String,
      default: 'Date'
    },
    hint: {
      type: String,
      default: ''
    },
    dateFormat: {
      type: String,
      default: '%d/%m/%Y'
    }
  },
  data() {
    const formatDateCustom = d3.timeFormat(this.dateFormat)
    const formatDate = d3.timeFormat('%Y-%m-%d')
    const parseDate = d3.timeParse('%Y-%m-%d')
    return {
      date: formatDate(this.value),
      dateFormatted: formatDateCustom(this.value),
      menu: false,
      formatDate,
      parseDate,
      formatDateCustom
    }
  },
  watch: {
    date() {
      this.dateFormatted = this.formatDateCustom(this.parseDate(this.date))
    }
  },
  methods: {
    handleInput() {
      this.menu = false
      this.$emit('input', this.parseDate(this.date))
    }
  }
}
</script>

<template>
  <VContainer>
    <span class="overline"> x-Axis </span>
    <VSelect
      v-model="xAccessor"
      :items="options"
      :rules="[v => !!v || 'Column is required']"
      label="Choose the column to plot on x-axis"
      item-text="text"
      item-value="value"
      @input="change()"
    ></VSelect>
    <span class="overline"> Y-Axis </span>
    <VCard
      v-for="(line, idx) in lines"
      :key="idx"
      class="mx-auto mt-3"
      width="100%"
    >
      <VCardText>
        <VSelect
          v-model="line.yAccessor"
          :items="options"
          :rules="[v => !!v || 'Column is required']"
          label="Choose the column to plot on y-axis"
          item-text="text"
          item-value="value"
          @input="change()"
        ></VSelect>
      </VCardText>

      <VCardActions>
        <VBtn icon @click="show = !show">
          <BaseIcon :icon="show ? 'mdiChevronUp' : 'mdiChevronDown'" />
        </VBtn>
        <small> Optional config </small>
        <VSpacer></VSpacer>
        <VBtn v-if="idx > 0" icon @click="deleteLine(idx)">
          <BaseIcon color="red" icon="mdiDelete" />
        </VBtn>
      </VCardActions>

      <VExpandTransition>
        <div v-show="show">
          <VDivider></VDivider>

          <VCardText>
            <VRow>
              <VCol cols="12" md="6">
                <span class="overline">Color</span>
                <ColorPicker v-model="line.color" />
              </VCol>
              <VCol cols="12" md="6">
                <span class="overline">Area</span>
                <VSwitch
                  v-model="line.area"
                  :label="`${line.area.toString()}`"
                  @change="change()"
                ></VSwitch>
              </VCol>
            </VRow>
            <VRow>
              <VCol cols="6">
                <span class="overline">Line Width</span>
                <VTextField
                  v-model="line.lineWidth"
                  label="Line Width"
                  hint="Choose the size of the line"
                  type="number"
                ></VTextField>
              </VCol>
              <VCol cols="6">
                <span class="overline">Data points</span>
                <VSwitch
                  v-model="line.datapoint"
                  :label="`${line.datapoint.toString()}`"
                  @change="change()"
                ></VSwitch>
              </VCol>
            </VRow>
          </VCardText>
        </div>
      </VExpandTransition>
    </VCard>
    <VBtn width="100%" class="mt-3" @click="addLine">
      <BaseIcon icon="mdiPlus" /> Add a Line
    </VBtn>
  </VContainer>
</template>

<script>
import ColorPicker from '../base/ColorPicker.vue'
import { Color, ColumnAccessor } from '../../view/utils/types'
import BaseIcon from '~/components/base/BaseIcon.vue'
export default {
  components: { BaseIcon, ColorPicker },
  props: {
    headers: {
      type: Array,
      required: true
    },
    values: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      lines: [],
      show: false,
      xAccessor: null,
      options: []
    }
  },
  mounted() {
    this.options = this.headers.map(h => {
      return { text: h.text, value: new ColumnAccessor(h.value) }
    })
    this.addLine()
  },
  methods: {
    addLine() {
      this.lines.push({
        yAccessor: null,
        color: new Color(),
        lineWidth: 2,
        area: false,
        datapoint: false
      })
    },
    deleteLine(idx) {
      this.lines.splice(idx, 1)
      this.change()
    },
    change() {
      console.log(this.lines)
    }
  }
}
</script>

<template>
  <VRow dense>
    <VCol cols="12">
      <span class="overline">{{ name }}</span>
    </VCol>
    <VCol cols="12">
      <VSelect
        v-if="type === 'select'"
        v-model="input"
        :items="options"
        :rules="rules"
        :label="placeHolder"
        item-text="text"
        item-value="value"
        @input="change()"
      ></VSelect>
      <VSwitch
        v-else-if="type === 'switch'"
        v-model="input"
        :label="`${input.toString()}`"
        @change="change()"
      ></VSwitch>
      <VTextField
        v-else-if="type === 'number' || type === 'text'"
        v-model="input"
        :rules="rules"
        :label="placeHolder"
        :type="type"
        @input="change()"
      ></VTextField>
      <ColorPicker
        v-else-if="type === 'color'"
        v-model="input"
        @input="change()"
      ></ColorPicker>
      <VRow v-else-if="type === 'object'" justify="center" dense>
        <VCol v-for="k in Object.keys(input)" :key="k" cols="3">
          <VTextField
            v-model="input[k]"
            :label="k"
            type="number"
            @input="change()"
          ></VTextField>
        </VCol>
      </VRow>
    </VCol>
  </VRow>
</template>

<script>
import { ColumnAccessor, Orientation, Color } from '../view/utils/types'
export default {
  prop: ['value'], // Used for v-model property
  props: {
    name: {
      type: String,
      required: true
    },
    propObject: {
      type: Object,
      required: true
    },
    headers: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      input: this.propObject.default ? this.propObject.default() : null,
      rules: [],
      options: [],
      type: 'text',
      placeHolder: this.propObject.placeHolder
        ? this.propObject.placeHolder
        : 'Input'
    }
  },
  mounted() {
    if (this.propObject.required) {
      this.rules.push(v => !!v || 'Field required')
    }
    if (this.propObject.validator) {
      this.rules.push(
        v => this.propObject.validator(v) || 'Wrong format for ' + this.name
      )
    }
    switch (this.propObject.type) {
      case Number:
        this.type = 'number'
        break
      case Object:
        this.type = 'object'
        break
      case Boolean:
        this.type = 'switch'
        break
      case Color:
        this.type = 'color'
        break
      case ColumnAccessor:
        this.type = 'select'
        this.options = this.headers.map(h => {
          return { text: h.text, value: new ColumnAccessor(h.value) }
        })
        break
      case Orientation:
        this.type = 'select'
        this.options = Orientation.enum.map(o => {
          return { text: o, value: new Orientation(o) }
        })
        break
      default:
        this.type = 'text'
    }
  },
  methods: {
    change() {
      console.log('Change FormInput', this.input)
      this.$emit('input', this.input)
    }
  }
}
</script>

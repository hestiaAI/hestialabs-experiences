<template>
  <VTextField v-model="color" hide-details class="ma-0 pa-0" solo>
    <template #append>
      <VMenu
        v-model="menu"
        top
        nudge-bottom="105"
        nudge-left="16"
        :close-on-content-click="false"
      >
        <template #activator="{ on }">
          <div :style="swatchStyle" v-on="on" />
        </template>
        <VCard>
          <VCardText class="pa-0">
            <VColorPicker v-model="color" flat @input="handleInput" />
          </VCardText>
        </VCard>
      </VMenu>
    </template>
  </VTextField>
</template>

<script>
import { Color } from '../../view/utils/types'
export default {
  props: {
    value: {
      type: Color,
      default: () => new Color('#000000')
    }
  },
  data() {
    return {
      color: this.value.color,
      menu: false
    }
  },
  computed: {
    swatchStyle() {
      const { color, menu } = this
      return {
        backgroundColor: color,
        cursor: 'pointer',
        height: '30px',
        width: '30px',
        borderRadius: menu ? '50%' : '4px',
        transition: 'border-radius 200ms ease-in-out'
      }
    }
  },
  watch: {
    color(newVal, oldVal) {
      console.log('color', newVal, oldVal)
    },
    value(newVal, oldVal) {
      console.log('value', newVal, oldVal)
      // this.color = newVal.color || oldVal
    }
  },
  mounted() {
    console.log(this.value)
    console.log(this.color)
  },
  methods: {
    handleInput() {
      console.log('res', this.color)
      this.$emit('input', new Color(this.color))
    }
  }
}
</script>

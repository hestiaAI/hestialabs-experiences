<template>
  <div>
    <div class="tab-radio__label">
      {{ label }}
    </div>
    <div :class="{'outlined': outlined}">
      <ul class="tab-radio">
        <li v-for="item in options"
          :key="item"
          :id="item"
          class="tab-radio__item"
          :class="{'tab-radio__item--selected': item === value}"
          @click="select($event)"
          >
            {{ $tc(k(item), 1) }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
  import TranslationMixin from '@/mixins/translation-mixin'

  export default {
    mixins: [TranslationMixin],
    props: {
      value: {
        type: String,
        required: true
      },
      options: {
        type: Array,
        required: true
      },
      label: {
        type: String,
        default: ''
      },
      textAccessor: {
        type: String,
        default: 'text'
      },
      valueAccessor: {
        type: String,
        default: 'value'
      },
      outlined: {
        type: Boolean,
        default: true
      }
    },
    data(){
      return {
        selected: this.value
      }
    },
    watch: {
      value(newValue){
        this.selected = newValue
      }
    },
    methods: {
      select(event) {
        this.selected = event.currentTarget.id
        this.$emit('input', this.selected)
        this.$emit('change')
      }
    }
  }

</script>
<style scoped>
.tab-radio {
  box-shadow: none;
  background: rgb(239, 242, 245);
  padding: 3px;
  border-radius: 8px;
  margin: 0px;
  display: flex;
  -webkit-box-align: center;
  align-items: center;
}

.tab-radio__item {
  padding: 7px 8px;
  white-space: nowrap;
  border-top: 1px solid transparent;
  border-right: 1px solid transparent;
  border-left: 1px solid transparent;
  border-image: initial;
  border-bottom: none;
  bottom: 0px;
  position: relative;
  list-style: none;
  cursor: pointer;
  color: rgb(34, 37, 49);
  border-radius: 8px;
  font-weight: 400;
  display: flex;
  flex: 1 1 0%;
  -webkit-box-align: center;
  align-items: center;
  -webkit-box-pack: center;
  justify-content: center;
  font-size: 10px;
  padding: 5px 10px;
}

.tab-radio__item--selected {
  background: rgb(255, 255, 255);
  color: rgb(34, 37, 49);
  box-shadow: rgb(239 242 245) 0px 1px 0px;
  font-weight: 400;
}

.outlined::v-deep .tab-radio {
  background: transparent;
  color: currentColor;
  border: 1px solid currentColor;
}

.outlined::v-deep .tab-radio__item {
  color: currentColor;
}

.outlined::v-deep .tab-radio__item--selected {
  background: transparent;
  color: currentColor;
  box-shadow: none;
  border: 1px solid currentColor;
}
</style>

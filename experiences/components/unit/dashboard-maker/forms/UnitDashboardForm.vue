<template>
  <VContainer>
    <div class="text-center">
      <VMenu offset-y>
        <template #activator="{ on, attrs }">
          <VBtn
            width="100%"
            class="mb-3"
            dark
            color="primary"
            v-bind="attrs"
            v-on="on"
          >
            Add Graph
            <VIcon dark>
              $vuetify.icons.mdiPlus
            </VIcon>
          </VBtn>
        </template>
        <VList>
          <VSubheader>Type of Graph</VSubheader>
          <VListItemGroup
            color="primary"
          >
            <VListItem
              v-for="(item, index) in items"
              :key="index"
              @click="newFormGraph(item)"
            >
              <VListItemTitle>
                <BaseIcon :icon="item.icon" />
                <span class="ml-3">{{ item.name }}</span>
              </VListItemTitle>
            </VListItem>
          </VListItemGroup>
        </VList>
      </VMenu>
    </div>
    <VForm ref="form" v-model="valid">
      <div v-for="(form, idx) in forms" :key="idx">
        <FormChart v-bind="{headers}" v-model="forms[idx]" />
      </div>
      <VSpacer />
      <div>
        <BaseButton color="error" @click="reset">
          Reset All
        </BaseButton>
        <BaseButton color="primary">
          Export Config
        </BaseButton>
        <BaseButton color="success" @click="createDashboard">
          Draw
        </BaseButton>
      </div>
    </VForm>
  </VContainer>
</template>

<script>
import { cloneDeep } from 'lodash-es'
import FormChart from './FormChart.vue'
export default {
  components: { FormChart },
  props: {
    headers: {
      type: Array,
      required: true
    }
  },
  data: () => ({
    forms: [],
    valid: false,
    items: [
      {
        name: 'Timeline Chart',
        icon: 'mdiChartLine',
        component: 'FormChartTimeline'
      },
      {
        name: 'Top Chart',
        icon: 'mdiChartBar',
        component: 'FormChartTop'
      },
      {
        name: 'Pie Chart',
        icon: 'mdiChartPie',
        component: 'FormChartPie'
      },
      {
        name: 'Hour Chart',
        icon: 'mdiClockOutline',
        component: 'FormChartHour'
      },
      {
        name: 'Week Chart',
        icon: 'mdiCalendarWeek',
        component: 'FormChartWeek'
      }
    ]
  }),
  methods: {
    newFormGraph(item) {
      this.forms.push({ ...item })
    },
    reset() {
      this.$refs.form.reset()
      this.$emit('submit', null)
    },
    createDashboard() {
      console.log(this.$refs.form.validate(), this.forms)
      if (this.$refs.form.validate()) {
        this.$emit('submit', cloneDeep(this.forms))
      }
    }
  }
}
</script>
<style scoped></style>

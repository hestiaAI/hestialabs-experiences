<template>
  <VContainer>
    <VExpansionPanels accordion>
      <VExpansionPanel v-for="{ name, values } in items" :key="name">
        <VExpansionPanelHeader v-slot="{ open }">
          <VRow no-gutters>
            <VCol cols="4">
              {{ name }}:
            </VCol>
            <VCol cols="8" class="text--secondary">
              <VFadeTransition leave-absolute>
                <div
                  v-if="!open"
                  class="d-flex flex-column flex-md-row flex-wrap"
                >
                  <div
                    v-for="(value, idx) in values"
                    :key="name + value + idx"
                  >
                    <VChip
                      v-if="idx < maxNbItems"
                      outlined
                      color="primary"
                      class="ma-1"
                    >
                      {{ value }}
                    </VChip>
                  </div>
                  <VChip
                    v-if="values.length > maxNbItems"
                    outlined
                    color="secondary"
                    class="ma-1"
                  >
                    {{ $tc('plusXOther', values.length - maxNbItems) }}
                  </VChip>
                </div>
              </VFadeTransition>
            </VCol>
          </VRow>
        </VExpansionPanelHeader>
        <VExpansionPanelContent>
          <div class="d-flex flex-column flex-md-row flex-wrap">
            <div
              v-for="(value, idx) in values"
              :key="name + value + idx"
            >
              <VChip outlined color="primary" class="ma-1">
                {{ value }}
              </VChip>
            </div>
          </div>
        </VExpansionPanelContent>
      </VExpansionPanel>
    </VExpansionPanels>
  </VContainer>
</template>

<script>
import mixin from './mixin'

export default {
  mixins: [mixin],
  data() {
    return {
      showAll: {},
      maxNbItems: 5
    }
  },
  computed: {
    items() {
      return Object.keys(this.values[0])
        .sort()
        .map((k) => {
          return {
            name: this.$tev(this.kViewBlock(k, 'names'), k),
            values: this.values[0][k].split('; ')
          }
        })
        .filter(i => i.values[0].length > 0)
    }
  }
}
</script>

<template>
  <VContainer>
    <VRow>
      <span class="overline"> Total inferences: {{ values.length }}</span>
      <VSpacer />
      <VAutocomplete
        v-model="categoriesSelected"
        multiple
        chips
        dense
        class="pa-4"
        label="Filter by Category"
        :items="categories"
        :menu-props="{ closeOnClick: false }"
      >
        <template #selection="{ item, index }">
          <VChip v-if="index < 3" class="ma-1">
            <span>
              {{ item }}
            </span>
          </VChip>
          <span v-if="index === 3" class="grey--text caption">
            (+{{ categoriesSelected.length - 3 }} others)
          </span>
        </template>
      </VAutocomplete>
      <VAutocomplete
        v-model="inferencesSelected"
        multiple
        chips
        dense
        class="pa-4"
        label="Filter by Inference"
        :items="inferenceTypes"
        :menu-props="{ closeOnClick: false }"
      >
        <template #selection="{ item, index }">
          <VChip v-if="index < 3" class="ma-1">
            <span>
              {{ item }}
            </span>
          </VChip>
          <span v-if="index === 3" class="grey--text caption">
            (+{{ inferencesSelected.length - 3 }} others)
          </span>
        </template>
      </VAutocomplete>
    </VRow>
    <VRow class="ma-6">
      <VCol
        v-for="(inference, i) in items"
        :key="i"
        cols="12"
        sm="6"
        md="4"
        lg="3"
        xl="2"
      >
        <VCard height="100%" class="d-flex flex-column">
          <VCardTitle>{{ inference.type }}</VCardTitle>
          <VCardSubtitle>{{ inference.category }}</VCardSubtitle>
          <VCardText>{{ inference.description }}</VCardText>
          <VSpacer />
          <VCardActions class="ma-3 overline d-flex justify-space-between">
            <div>Inferred</div>
            <div>
              <VAvatar size="16" :color="inference.color" class="mr-1" />
              {{ inference.inferenceValue }}
            </div>
          </VCardActions>
        </VCard>
      </VCol>
    </VRow>
  </VContainer>
</template>

<script>
import mixin from './mixin'

export default {
  mixins: [mixin],
  data() {
    return {
      categoriesSelected: [],
      inferencesSelected: [],
      inferenceTypes: ['True', 'False', 'Others']
    }
  },
  computed: {
    items() {
      return this.values
        .map((inference) => {
          const inferenceType =
            inference.Inference === 'true'
              ? 'True'
              : inference.Inference === 'No'
                ? 'False'
                : 'Others'
          let value = inferenceType
          if (value === 'Others') { value = parseFloat(inference.Inference).toFixed(2) }

          return {
            type: inference['Type of inference'],
            category: inference.Category,
            description: inference.Description,
            inferenceValue: value,
            inferenceType,
            color:
              inferenceType === 'True'
                ? '#29AA24'
                : inferenceType === 'False'
                  ? '#E52229'
                  : '#F2F2F2'
          }
        })
        .filter(
          inference =>
            this.categoriesSelected.length === 0 ||
            this.categoriesSelected.includes(inference.category)
        )
        .filter(
          inference =>
            this.inferencesSelected.length === 0 ||
            this.inferencesSelected.includes(inference.inferenceType)
        )
    },
    categories() {
      return this.values.map(inference => inference.Category)
    }
  },
  methods: {
    drawViz() {}
  }
}
</script>
<style>
.v-card__text,
.v-card__title {
  word-break: normal; /* maybe !important  */
}
</style>
<style scoped></style>

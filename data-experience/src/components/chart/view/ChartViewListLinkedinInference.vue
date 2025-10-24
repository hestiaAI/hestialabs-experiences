<template>
  <VContainer>
    <VRow>
      <div>
        <span v-t="{ path: kViewBlock('total-inferences'), args: { n: values.length } }" class="overline" />
        <br>
        <span v-if="totalProfiles" v-t="{ path: kViewBlock('total-profiles'), args: { n: totalProfiles } }" class="overline" />
      </div>
      <VSpacer />
      <VAutocomplete
        v-model="categoriesSelected"
        multiple
        chips
        dense
        class="pa-4"
        :label="messages['Filter by Category']"
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
            ({{ $tc('plusXOther', categoriesSelected.length - 3) }})
          </span>
        </template>
      </VAutocomplete>
      <VAutocomplete
        v-model="inferencesSelected"
        multiple
        chips
        dense
        class="pa-4"
        :label="messages['Filter by Inference']"
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
            ({{ $tc('plusXOther', inferencesSelected.length - 3) }})
          </span>
        </template>
      </VAutocomplete>
    </VRow>
    <VRow class="ma-6">
      <VCol
        v-for="(i, idx) in itemsFiltered"
        :key="idx"
        cols="12"
        sm="6"
        md="4"
        lg="3"
        xl="2"
      >
        <VCard height="100%" class="d-flex flex-column">
          <VCardTitle class="d-flex flex-nowrap align-start justify-space-between">
            <div>{{ i.typeOfInference }}</div>
            <div class="text-center ml-2" v-if="'_count' in i">
              <div class="text-subtitle-2">{{ i._count }}</div>
              <div class="text-caption">{{ $tc('profile', i._count) }}</div>
            </div>
          </VCardTitle>
          <VCardSubtitle>{{ i.category }}</VCardSubtitle>
          <VCardText>{{ i.description }}</VCardText>
          <VSpacer />
          <VCardActions class="ma-3 overline d-flex justify-space-between">
            <div v-text="messages['Inferred']" />
            <div>
              <VAvatar size="16" :color="i.color" class="mr-1" />
              {{ i.inferenceText }}
            </div>
          </VCardActions>
        </VCard>
      </VCol>
    </VRow>
  </VContainer>
</template>

<script>
import mixin from './mixin'
import { TYPE_FORMATTER, TRUE_VALUES } from '@/utils/type-check'

const getColor = (v) => {
  if (TYPE_FORMATTER.BOOLEAN.validator(v)) {
    if (TRUE_VALUES.test(v)) {
      // true
      return '#29AA24'
    }
    // false
    return '#E52229'
  }
  // other
  return '#F2F2F2'
}

export default {
  mixins: [mixin],
  props: {
    messages: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data() {
    const { BOOLEAN, FLOAT } = TYPE_FORMATTER
    const items = this.values.map(({ inference: v, category, ...rest }) => {
      // by default, the type is 'Other' and the value is unchanged
      let inferenceType = 'Other'
      let inferenceText = v
      if (BOOLEAN.validator(v)) {
        // the boolean formatter takes care of i18n localization
        inferenceText = BOOLEAN.formatter(v, this)
        inferenceType = inferenceText
      } else if (FLOAT.validator(v)) {
        inferenceText = FLOAT.formatter(v).toFixed(2)
        inferenceType = 'Numeric value'
      }
      return {
        inference: v,
        category: this.$tev(this.kViewBlock(category, 'categories'), category),
        inferenceText,
        inferenceType: this.$tev(
          // Keys sourced from view-block dictionary
          this.kViewBlock(inferenceType, 'inferenceTypes'),
          // Yes/No is already translated
          inferenceType
        ),
        color: getColor(v),
        ...rest
      }
    })
    return {
      items,
      categoriesSelected: [],
      inferencesSelected: [],
      categories: items.map(i => i.category),
      inferenceTypes: items.map(i => i.inferenceType)
    }
  },
  computed: {
    totalProfiles() {
      if (this.values.length && this.values[0]._total_profiles) {
        return this.values[0]._total_profiles
      } else {
        return 0
      }
    },
    itemsFiltered() {
      const { categoriesSelected: cs, inferencesSelected: is } = this
      return this.items
        .filter(
          ({ category, inferenceType }) =>
            (
              !cs.length ||
              cs.includes(category)
            ) &&
            (
              !is.length ||
              is.includes(inferenceType)
            )
        )
    }
  }
}
</script>

<style>
.v-card__text,
.v-card__title {
  word-break: normal; /* maybe !important  */
}
</style>

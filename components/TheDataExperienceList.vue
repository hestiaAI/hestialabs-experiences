<template>
  <div>
    <template v-if="enabledExperiences.length > 0">
      <h1>Public experiences</h1>
      <CardOrItemList :big="big" :experiences="enabledExperiences" />
    </template>
    <template v-if="big"> <br /><br /> </template>
    <template v-else> <br /> </template>
    <template v-if="disabledExperiences.length > 0">
      <h1>
        Available on-demand (<a href="mailto:contact@hestialabs.org"
          >Contact us</a
        >)
      </h1>
      <CardOrItemList :big="big" :experiences="disabledExperiences" />
    </template>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'TheDataExperienceList',
  props: {
    big: {
      type: Boolean,
      default: false
    }
  },
  computed: mapGetters(['enabledExperiences', 'disabledExperiences'])
}
</script>

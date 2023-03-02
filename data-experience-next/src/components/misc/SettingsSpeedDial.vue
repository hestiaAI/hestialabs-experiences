<template>
  <VSpeedDial
    v-model="fab"
    direction="top"
    transition="slide-y-reverse-transition"
    fixed
    style="z-index: 100; bottom: 8px; right: 8px;"
  >
    <template #activator>
      <BaseButton
        v-model="fab"
        color="primary"
        dark
        fab
        small
        :outlined="false"
        vbtn-class=""
      >
        <template #icon>
          <VIcon>
            {{ fab ? '$vuetify.icon.mdiClose' : '$vuetify.icon.mdiCog' }}
          </VIcon>
        </template>
      </BaseButton>
    </template>
    <BaseButton
      mdi-icon="mdiCancel"
      text=""
      fab
      dark
      small
      tooltip="Clear all"
      color="red"
      :outlined="false"
      vbtn-class=""
      @click="$store.commit('xp/clearStore')"
    />
    <BaseButtonShare
      fab
      dark
      small
      color="blue darken-2"
      button-text=""
      :outlined="false"
      tooltip="Share"
      vbtn-class=""
    />
    <slot name="lang" />
  </VSpeedDial>
</template>

<script>
import BaseButton from '@/components/base/button/BaseButton.vue'
import BaseButtonShare from '@/components/base/button/BaseButtonShare.vue'

export default {
  name: 'SettingsSpeedDial',
  components: { BaseButton, BaseButtonShare },
  data() {
    return {
      fab: false
    }
  }
}
</script>

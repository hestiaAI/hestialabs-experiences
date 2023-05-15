<template>
  <div class="d-flex align-center">
    <VTooltip bottom>
      <template #activator="{ on, attrs }">
        <VBtn
          icon
          v-bind="{ ...homeButtonProps, ...attrs }"
          class="mr-0"
          v-on="on"
        >
          <VIcon>$vuetify.icons.mdiHomeOutline</VIcon>
        </VBtn>
      </template>
      <span v-t="'Home Page'" />
    </VTooltip>
    <VMenu v-if="$i18n.locales.length > 1" offset-y>
      <template #activator="menu">
        <VTooltip bottom>
          <template #activator="tooltip">
            <VBtn
              icon
              v-bind="{ ...menu.attrs, ...tooltip.attrs }"
              v-on="{ ...menu.on, ...tooltip.on }"
            >
              <VIcon>$vuetify.icons.mdiTranslate</VIcon>
            </VBtn>
          </template>
          <span v-t="'Language'" />
        </VTooltip>
      </template>
      <VList>
        <VListItem
          v-for="({ code, name }) in $i18n.locales"
          :key="code"
          nuxt
          :to="switchLocalePath(code)"
        >
          <VListItemTitle>{{ name }}</VListItemTitle>
        </VListItem>
      </VList>
    </VMenu>

    <VTooltip bottom>
      <template #activator="{ on, attrs }">
        <VBtn
          icon
          :to="localePath({ name: 'tools' })"
          class="ml-0"
          v-bind="attrs"
          v-on="on"
        >
          <VIcon>$vuetify.icons.mdiTools</VIcon>
        </VBtn>
      </template>
      <span>{{ $tc('Tool', 2) }}</span>
    </VTooltip>
    <VTooltip bottom>
      <template #activator="{ on, attrs }">
        <VBtn
          icon
          :to="localePath({ name: 'experiences' })"
          class="ml-0"
          v-bind="attrs"
          v-on="on"
        >
          <VAvatar rounded size="30">
            <img src="/hestialabs-icon.png">
          </VAvatar>
        </VBtn>
      </template>
      <span>{{ $tc('Data Experience', 2) }}</span>
    </VTooltip>
    <VTooltip v-if="hasBubbles" bottom>
      <template #activator="{ on, attrs }">
        <VBtn
          icon
          :to="localePath({ name: 'spaces' })"
          v-bind="attrs"
          v-on="on"
        >
          <VAvatar rounded size="30">
            <img src="/data-space.png">
          </VAvatar>
        </VBtn>
      </template>
      <span>{{ $tc('Data Space', 2) }}</span>
    </VTooltip>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  computed: {
    ...mapState(['config']),
    hasBubbles() {
      const { bubbleConfig } = this.config
      return bubbleConfig && Object.keys(bubbleConfig).length > 0
    },
    homeButtonProps() {
      // check for an external home page
      const { homePath } = this.config
      if (homePath) {
        return {
          href: homePath,
          rel: 'noreferrer noopener'
        }
      }
      // if an external home page is not configured,
      // we link to the internal home page
      return {
        to: this.localePath('index')
      }
    }
  }
}
</script>

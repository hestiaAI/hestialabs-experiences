<template>
  <VApp v-if="$store.state.loaded">
    
  </VApp>
</template>

<script>
import { mapGetters } from 'vuex'
import TheDataExperience from './components/TheDataExperience.vue'

export default {
    async middleware({ store, isDev, $axios }) {
        if (!store.state.loaded) {
            await store.dispatch("loadExperiences", { isDev, $axios });
        }
    },
    computed: {
        ...mapGetters(["experience", "appName"]),
        collaborator() {
            const { collaborator = {} } = this.experience(this.$route);
            return collaborator;
        }
    },
    components: { TheDataExperience }
}
</script>

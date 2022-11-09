import { createNamespacedHelpers } from 'vuex'

export const MODULE_NAME = 'xp'
export const { mapState, mapGetters, mapActions, mapMutations } = createNamespacedHelpers(MODULE_NAME)

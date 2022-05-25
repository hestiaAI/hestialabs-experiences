<template>
  <div>
    <VForm @submit.prevent="userLogin">
      <VTextField v-model="login.username" label="Username" readonly />
      <VTextField v-model="login.password" label="Password" required />
      <VBtn type="submit">Submit</VBtn>
    </VForm>
  </div>
</template>

<script>
export default {
  auth: 'guest',
  beforeRouteEnter(to, from, next) {
    if (!from.params?.bubble) {
      return false
    }
    next(vm => {
      // access to component public instance via `vm`
      // -> set the username as the bubble name
      vm.login.username = from.params.bubble
    })
  },
  data() {
    return {
      login: {
        username: '',
        password: ''
      }
    }
  },
  methods: {
    async userLogin() {
      try {
        const { login } = this
        const response = await this.$auth.loginWith('local', {
          data: login
        })
        this.$auth.setUser({ username: login.username })
        console.log(response)
      } catch (err) {
        console.log(err)
      }
    }
  }
}
</script>
$router.options.history.state.back

<template>
  <VContainer fluid style="max-width: 400px" class="mt-16">
    <h1 class="text-h4 mb-6">Bubble Login</h1>
    <VForm @submit.prevent="login">
      <VTextField :value="username" label="Username" readonly />
      <VTextField
        v-model="password"
        label="Password"
        required
        :type="passwordType"
        :append-icon="passwordAppendIcon"
        @click:append="onClickAppend"
      />
      <BaseButton type="submit">Login</BaseButton>
    </VForm>
  </VContainer>
</template>

<script>
import { mdiEye, mdiEyeOff } from '@mdi/js'

export default {
  auth: 'guest',
  validate({ $auth, store }) {
    const { bubbles } = store.state.config
    const bubble = ($auth.state.redirect || '').split('/')[2]
    if (!bubbles.includes(bubble)) {
      return false
    }
    return true
  },
  data() {
    return {
      username: this.$auth.state.redirect.split('/')[2],
      password: '',
      passwordType: 'password',
      passwordAppendIcon: mdiEye
    }
  },
  methods: {
    onClickAppend() {
      if (this.passwordType === 'password') {
        this.passwordType = 'text'
        this.passwordAppendIcon = mdiEyeOff
      } else {
        this.passwordType = 'password'
        this.passwordAppendIcon = mdiEye
      }
    },
    async login() {
      try {
        const { username, password } = this
        const data = { username, password }
        console.log('data', data)
        const response = await this.$auth.loginWith('local', {
          data
        })
        this.$auth.setUser({ username })
        console.log(response)
      } catch (err) {
        console.log(err, this.$auth)
      }
    }
  }
}
</script>

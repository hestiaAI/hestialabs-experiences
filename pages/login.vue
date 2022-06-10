<template>
  <VContainer fluid style="max-width: 400px" class="mt-16">
    <h1 class="text-h4 mb-6">Bubble Login</h1>
    <VForm @submit.prevent="login">
      <VTextField :value="username" label="Username" readonly />
      <VTextField
        ref="password"
        v-model="password"
        label="Password"
        placeholder="Type..."
        required
        :type="passwordType"
        :append-icon="passwordAppendIcon"
        error-count="10"
        :error-messages="errorMessage"
        autofocus
        @click:append="onClickAppend"
      />
      <BaseButton type="submit">Login</BaseButton>
    </VForm>
  </VContainer>
</template>

<script>
import { mdiEye, mdiEyeOff } from '@mdi/js'

const extractBubbleParam = (path = '') => path.split('/')[2]

export default {
  auth: 'guest',
  middleware({ $auth, redirect, route, error }) {
    if (!route.query.redirect) {
      if ($auth.state.redirect) {
        // add query parameter
        return redirect({
          name: 'login',
          query: { redirect: $auth.state.redirect }
        })
      }
      // no way to know how to redirect the user after login
      return error({ statusCode: 404, message: 'Page Not Found' })
    } else if (!$auth.state.redirect) {
      // happens on refresh
      $auth.$storage.setState('redirect', route.query.redirect)
    }
  },
  validate({ $auth, store }) {
    const { bubbles } = store.state.config
    const bubble = extractBubbleParam($auth.state.redirect)
    if (!bubbles.includes(bubble)) {
      return false
    }
    return true
  },
  data() {
    return {
      password: '',
      passwordType: 'password',
      passwordAppendIcon: mdiEye,
      errorMessage: ''
    }
  },
  computed: {
    username() {
      const bubble = extractBubbleParam(this.$route.query.redirect)
      return bubble
    }
  },
  watch: {
    password() {
      this.errorMessage = ''
    },
    $route() {
      // focus password input on route change
      this.$refs.password.$refs.input.focus()
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
        if (!password) {
          this.errorMessage = 'Please enter the password'
          return
        }
        const response = await this.$auth.loginWith('local', {
          data: { username, password }
        })
        const bubble = this.$store.state.config.bubbleConfig[username]
        this.$auth.setUser({ username, password, bubble })
        console.info(response.statusText)
      } catch ({ response }) {
        if (response.status === 403) {
          this.errorMessage =
            'You entered an incorrect password, please try again'
        } else {
          this.errorMessage = [
            'An unknown error occurred, we apologize for the inconvenience.',
            'Please report the error via e-mail to contact@hestialabs.org)',
            `Status text: ${response.statusText}`
          ]
          console.error(response)
        }
      }
    }
  }
}
</script>

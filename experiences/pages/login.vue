<template>
  <VContainer fluid style="max-width: 400px" class="mt-16">
    <h1 class="text-h4 mb-6">
      Bubble Login
    </h1>
    <VForm @submit.prevent="login">
      <VTextField :value="username" label="Username" readonly />
      <BasePasswordField
        ref="password"
        :value.sync="password"
        :error-message="errorMessage"
        autofocus
      />
      <BaseButton type="submit">
        Login
      </BaseButton>
    </VForm>
  </VContainer>
</template>

<script>
import { vueMeta } from '@/utils/utils'

const extractBubbleParam = (path = '') => path.split('/').slice(-1)[0]

export default {
  auth: 'guest',
  middleware({ app, $auth, redirect, route, error }) {
    if (!route.query.redirect) {
      if ($auth.$state.redirect) {
        // add query parameter
        return redirect(app.localePath({
          name: 'login',
          query: { redirect: $auth.$state.redirect }
        }))
      }
      // no way to know how to redirect the user after login
      return error({ statusCode: 404, message: 'Page Not Found' })
    } else if (!$auth.$state.redirect) {
      // happens on refresh
      $auth.$storage.setState('redirect', route.query.redirect)
    }
  },
  validate({ $auth, store }) {
    const { bubbles } = store.state.config
    const bubble = extractBubbleParam($auth.$state.redirect)
    if (!bubbles.includes(bubble)) {
      return false
    }
    return true
  },
  data() {
    return {
      errorMessage: '',
      password: ''
    }
  },
  head() {
    return vueMeta(this, 'Login')
  },
  computed: {
    username() {
      const bubble = extractBubbleParam(this.$route.query.redirect)
      return bubble
    }
  },
  watch: {
    $route() {
      // focus password input on route change
      this.$refs.password.$children[0].$refs.input.focus()
    }
  },
  methods: {
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

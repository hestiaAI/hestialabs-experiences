<template>
  <VContainer fluid style="max-width: 400px" class="mt-16">
    <h1 class="text-h4 mb-6">
      Login
    </h1>
    <VForm @submit.prevent="login">
      <VTextField :value="id" label="ID" readonly />
      <BasePasswordField
        ref="codeword"
        :value.sync="codeword"
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
import mixin from '@/mixins/page'

const extractBubbleParam = (path = '') => {
  // 1. /bubble/:bubble
  // 2. /bubble/:bubble/experience/:experience
  const match = path.match(/\/bubble\/([^/]+)(?:\/|$)/)
  if (match && match.length === 2) {
    return match[1]
  }
  return null
}

export default {
  mixins: [mixin],
  auth: 'guest',
  middleware({ app, $auth, redirect, route, error, from }) {
    if (from && $auth.loggedIn) {
      // If user navigated back to the login page
      // with the browser's "back" function
      // then we need to handle it here
      // by going back again.
      // Otherwise we mess up the auth state,
      // plus it doesn't make sense to show
      // the login page in this scenario
      return app.router.go(-1)
    }

    if (route.query.redirect) {
      $auth.$storage.setState('redirect', route.query.redirect)
    } else if ($auth.$state.redirect) {
      // add query parameter
      return redirect(app.localePath({
        name: 'login',
        query: { redirect: $auth.$state.redirect }
      }))
    } else {
      // no way to know how to redirect the user after login
      return error({ statusCode: 404, message: 'Page Not Found' })
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
      codeword: ''
    }
  },
  head() {
    return this.vueMeta('Login')
  },
  computed: {
    id() {
      const bubble = extractBubbleParam(this.$route.query.redirect)
      return bubble
    }
  },
  watch: {
    $route() {
      // focus codeword input on route change
      this.$refs.codeword.$children[0].$refs.input.focus()
    }
  },
  methods: {
    async login() {
      try {
        const { id, codeword } = this
        if (!codeword) {
          this.errorMessage = 'Please enter the codeword'
          return
        }
        const response = await this.$auth.loginWith('local', {
          data: { id, codeword }
        })
        const bubble = this.$store.state.config.bubbleConfig[id]
        this.$auth.setUser({ id, codeword, bubble })
        console.info(response.statusText)
      } catch ({ response }) {
        if (response.status === 403) {
          this.errorMessage =
            'You entered an incorrect codeword, please try again'
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

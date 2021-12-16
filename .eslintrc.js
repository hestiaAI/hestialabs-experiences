module.exports = {
  root: true,
  env: {
    browser: true,
    node: true
  },
  parserOptions: {
    parser: '@babel/eslint-parser',
    requireConfigFile: false
  },
  extends: [
    '@nuxtjs',
    'plugin:prettier/recommended',
    'plugin:nuxt/recommended'
  ],
  plugins: ['prettier'],
  // add your custom rules here
  rules: {
    'no-console': [
      'warn',
      {
        allow: ['info', 'warn', 'error']
      }
    ],
    // https://stackoverflow.com/a/64609434/8238129
    'vue/valid-v-slot': [
      'error',
      {
        allowModifiers: true
      }
    ],
    // Turn off no-unregistered-components rule since
    // Nuxt auto-imports components
    'vue/no-unregistered-components': ['off', {}],
    // We like our pages import, default etc...
    'vue/multi-word-component-names': ['off', {}],
    // Enforce PascalCase component names
    // https://vuejs.org/v2/style-guide/#Component-name-casing-in-templates-strongly-recommended
    'vue/component-name-in-template-casing': [
      'error',
      'PascalCase',
      {
        registeredComponentsOnly: false,
        ignores: ['component', 'client-only', 'keep-alive']
      }
    ]
  }
}

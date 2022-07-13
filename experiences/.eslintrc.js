module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,
    jest: true
  },
  // https://eslint.vuejs.org/user-guide/#how-to-use-a-custom-parser
  parser: 'vue-eslint-parser',
  parserOptions: {
    parser: '@babel/eslint-parser',
    requireConfigFile: false
  },
  extends: ['@nuxtjs', 'plugin:nuxt/recommended'],
  // add your custom rules here
  rules: {
    'space-before-function-paren': ['error', 'never'],
    'arrow-parens': ['error', 'as-needed', { requireForBlockBody: true }],
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
    // Turn off no-undef-components rule since
    // Nuxt auto-imports components
    'vue/no-undef-components': ['off', {}],
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

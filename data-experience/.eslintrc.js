module.exports = {
  env: {
    browser: true,
    es2021: true
  },
  extends: [
    'plugin:vue/vue3-essential',
    'standard'
  ],
  overrides: [
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module'
  },
  plugins: [
    'vue'
  ],
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

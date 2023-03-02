// https://eslint.org/docs/latest/user-guide/configuring/configuration-files#configuration-file-formats
module.exports = {
  env: {
    browser: true,
    es2022: true,
    jest: true
  },
  extends: [
    'standard',
    'plugin:vue/recommended'
    // 'plugin:vue/vue3-recommended'
  ],
  parserOptions: {
    ecmaVersion: 2022,
    sourceType: 'module'
  },
  rules: {
    'vue/order-in-components': ['error', {}],
    'vue/no-undef-components': [
      'error', {
        ignorePatterns: [
          '^V(\\w+)$',
          'i18n',
          'RouterView',
          'RouterLink',
          'TheDataExperience'
        ]
      }
    ],
    'space-before-function-paren': ['error', 'never'],
    'arrow-parens': ['error', 'as-needed', { requireForBlockBody: true }],
    'no-console': [
      'warn',
      {
        allow: ['info', 'warn', 'error', 'time', 'timeEnd']
      }
    ],
    // https://stackoverflow.com/a/64609434/8238129
    'vue/valid-v-slot': [
      'error',
      {
        allowModifiers: true
      }
    ],
    // Enforce PascalCase component names
    // https://vuejs.org/v2/style-guide/#Component-name-casing-in-templates-strongly-recommended
    'vue/component-name-in-template-casing': [
      'error',
      'PascalCase',
      {
        registeredComponentsOnly: false,
        ignores: ['component', 'client-only', 'keep-alive', 'i18n']
      }
    ]
  }
}

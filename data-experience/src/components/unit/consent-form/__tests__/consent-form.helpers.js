export const testConsentForm = [
  {
    title: 'Test',
    description: 'Test form.'
  },
  {
    type: 'input',
    name: 'e-mail',
    value: ''
  },
  {
    title: 'Radio buttons',
    type: 'radio',
    options: ['A', 'B'],
    value: 'A'
  },
  {
    title: 'Checkboxes',
    type: 'checkbox',
    options: ['X', 'Y', 'Z'],
    value: []
  },
  {
    title: 'Data',
    type: 'data',
    required: true,
    value: []
  },
  {
    title: 'Multi-line',
    type: 'multiline',
    placeholder: '...',
    value: ''
  }
]

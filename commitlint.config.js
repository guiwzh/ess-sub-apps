export default {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'scope-enum': [2, 'always', ['operation', 'analysis', 'shared', 'config', 'deps']],
  },
}

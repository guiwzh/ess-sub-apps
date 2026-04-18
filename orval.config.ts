import { defineConfig } from 'orval'

export default defineConfig({
  'sub-operation': {
    input: {
      target: './swagger.json',
    },
    output: {
      target: './apps/sub-operation/src/api/generated',
      client: 'axios',
      override: {
        mutator: {
          path: './apps/sub-operation/src/utils/request.ts',
          name: 'default',
        },
      },
    },
  },
  'sub-analysis': {
    input: {
      target: './swagger.json',
    },
    output: {
      target: './apps/sub-analysis/src/api/generated',
      client: 'axios',
      override: {
        mutator: {
          path: './apps/sub-analysis/src/utils/request.ts',
          name: 'default',
        },
      },
    },
  },
})

import { configs } from 'eslint-config'
import { defineConfig } from 'eslint/config'

export default defineConfig({ ignores: ['dist'] }, configs.all)

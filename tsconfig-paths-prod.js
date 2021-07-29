// 產品模式時, 更改 path alias 之 baseURL
// https://github.com/dividab/tsconfig-paths#bootstrapping-with-explicit-params

const tsConfig = require('./tsconfig.json')
const tsConfigPaths = require('tsconfig-paths')

tsConfigPaths.register({
  baseUrl: './build',
  paths: tsConfig.compilerOptions.paths,
})


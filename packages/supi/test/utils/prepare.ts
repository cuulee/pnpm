import assertProject from '@pnpm/assert-project'
import mkdirp = require('mkdirp')
import path = require('path')
import {Test} from 'tape'
import tempy = require('tempy')
import writePkg = require('write-pkg')

export default function prepare (t: Test, pkg?: object) {
  process.env.NPM_CONFIG_REGISTRY = 'http://localhost:4873/'
  process.env.NPM_CONFIG_STORE_PATH = '../.store'
  process.env.NPM_CONFIG_SILENT = 'true'

  const pkgTmpPath = tempy.directory()
  let pkgJson = {name: 'project', version: '0.0.0', ...pkg}
  writePkg.sync(pkgTmpPath, pkgJson)
  process.chdir(pkgTmpPath)
  t.pass(`create testing package ${pkgTmpPath}`)

  return {
    ...assertProject(t, pkgTmpPath),
    async rewriteDependencies (deps: object) {
      pkgJson = Object.assign(pkgJson, { dependencies: deps })
      writePkg.sync(pkgTmpPath, pkgJson)
    },
  }
}

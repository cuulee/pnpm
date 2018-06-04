import assertProject from '@pnpm/assert-project'
import mkdirp = require('mkdirp')
import os = require('os')
import path = require('path')
import {Test} from 'tape'
import tempy = require('tempy')
import uniqueString = require('unique-string')
import writePkg = require('write-pkg')

export default function prepare (t: Test, pkg?: object) {
  process.env.NPM_CONFIG_REGISTRY = 'http://localhost:4873/'
  process.env.NPM_CONFIG_STORE_PATH = '../.store'
  process.env.NPM_CONFIG_SILENT = 'true'

  const tmpDir = path.join(process.env['APPVEYOR'] ? path.dirname(os.tmpdir()) : os.tmpdir(), uniqueString()) // tslint:disable-line
  const pkgTmpPath = path.join(tmpDir, '_')
  mkdirp.sync(pkgTmpPath)
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

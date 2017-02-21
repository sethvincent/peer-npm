#!/usr/bin/env node

var comandante = require('comandante')
var spawn = require('child_process').spawn
var createServer = require('../server')

if (process.argv.length === 2) {
  printUsage()
  return
}

switch (process.argv[2]) {
  case 'install':
  case 'i':
  case 'publish':  // TODO: output the package name /w public key
  case 'adduser':
    var args = ['--registry', 'http://localhost:9000']
    args = args.concat(process.argv.slice(2))
    spawn('npm', args, {stdio:'inherit'})
    break
  case 'daemon':
    createServer(function (err, server) {
      console.log('listening on http://0.0.0.0:9000')
    })
    break
  default:
    printUsage()
    break
}

function printUsage () {
  require('fs').createReadStream(__dirname + '/usage.txt').pipe(process.stdout)
}

#!/usr/bin/env node

var comandante = require('comandante')
var fs = require('fs')
var path = require('path')
var spawn = require('child_process').spawn
var config = require('application-config-path')
var createServer = require('../server')

if (process.argv.length === 2) {
  printUsage()
  return
}

switch (process.argv[2]) {
  case 'install':
  case 'i':
  case 'adduser':
    var args = ['--registry', 'http://localhost:9000']
    args = args.concat(process.argv.slice(2))
    spawn('npm', args, {stdio:'inherit'})
    break
  case 'publish':  // TODO: output the package name /w public key
    var args = ['--registry', 'http://localhost:9000']
    args = args.concat(process.argv.slice(2))
    var p = spawn('npm', args)
    p.stderr.pipe(process.stderr)
    var version = ''
    p.stdout.on('data', function (line) {
      line = line.toString()
      version = line.substring(line.indexOf('@')+1)
      version = version.replace('\n', '')
    })
    p.on('close', function (code) {
      if (code === 0) {
        var root = config('peer-npm')
        var pub = JSON.parse(fs.readFileSync(path.join(root, 'keys.json'), 'utf-8')).pub
        var name = JSON.parse(fs.readFileSync('package.json')).name
        console.log('+ ' + name + '_' + pub)
        console.log('Published ' + version)
      }
    })
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

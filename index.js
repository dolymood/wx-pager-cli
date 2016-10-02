// change from https://github.com/pugjs/pug-cli/

var fs = require('fs')
var path = require('path')
var mkdirp = require('mkdirp')
var chalk = require('chalk')
var pager = require('wx-pager')

var basename = path.basename
var dirname = path.dirname
var resolve = path.resolve
var normalize = path.normalize
var relative = path.relative

module.exports = function (program) {
  var options = {}

  var consoleLog = program.silent ? function () {} : console.log

  var files = program.args

  var watchList = {}

  // watch 模式
  var render = program.watch ? tryRender : renderFile

  consoleLog()
  if (program.watch) {
    process.on('SIGINT', function () {
      process.exit(1)
    })
  }

  files.forEach(function (file) {
    render(file)
  })

  function watchFile (path, rootPath) {
    path = normalize(path)

    var log = '  ' + chalk.gray('watching') + ' ' + chalk.cyan(path)
    var base = path

    if (watchList[path]) {
      if (watchList[path].indexOf(base) !== -1) {
        return
      }
      consoleLog(log)
      watchList[path].push(base)
      return
    }

    consoleLog(log)
    watchList[path] = [base]
    fs.watchFile(path, {
      persistent: true,
      interval: 200
    }, function (curr, prev) {
      // File doesn't exist anymore. Keep watching.
      if (curr.mtime.getTime() === 0) {
        return
      }
      if (curr.mtime.getTime() === prev.mtime.getTime()) {
        return
      }
      watchList[path].forEach(function (file) {
        tryRender(file, rootPath)
      })
    })
  }

  function errorToString (e) {
    return e.stack || (e.message || e)
  }

  function tryRender (path, rootPath) {
    try {
      renderFile(path, rootPath)
    } catch (e) {
      // keep watching when error occured.
      console.error(errorToString(e))
    }
  }

  function renderFile (path, rootPath) {
    var re = /\.(?:wx)$/
    var stat = fs.lstatSync(path)
    if (stat.isFile() && re.test(path)) {
      // 文件
      // Try to watch the file if needed. watchFile takes care of duplicates.
      if (program.watch) {
        watchFile(path, null, rootPath)
      }
      var output = path
      if (program.output) {
        // prepend output directory
        if (rootPath) {
          // replace the rootPath of the resolved path with output directory
          output = relative(rootPath, path)
        } else {
          // if no rootPath handling is needed
          output = basename(path)
        }
        output = resolve(program.output, output || path)
      }
      options.output = resolve(dirname(output))
      mkdirp.sync(options.output)
      pager.renderToFiles(path, options)
      consoleLog('  ' + chalk.gray('rendered') + ' ' + chalk.cyan('%s'),
        normalize(path) + ' ' + chalk.gray('to') + ' ' + normalize(options.output))
    // Found directory
    } else if (stat.isDirectory()) {
      var files = fs.readdirSync(path)
      files.map(function (filename) {
        return path + '/' + filename
      }).forEach(function (file) {
        render(file, rootPath || path)
      })
    }
  }
}

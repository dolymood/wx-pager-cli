var fs = require('fs')
var path = require('path')
var rimraf = require('rimraf')
var expect = require('chai').expect

var cliAction = require('../')

describe('wx-pager-cli', function () {

  var srcDir = path.resolve(__dirname, './src')
  var outputDir = path.resolve(__dirname, './output')

  function getFile (file, cb) {
    fs.readFile(path.resolve(outputDir, file), 'utf-8', function (err, data) {
      expect(err).to.not.exist
      cb(data)
    })
  }

  beforeEach(function (done) {
    rimraf(outputDir, done)
  })

  it('basic.wx', function (done) {
    // fake
    var program = {
      args: ['test/src/basic.wx'],
      output: 'test/output',
      silent: true
    }

    cliAction(program)

    var check = function (output) {
      expect(output.template.content).to.contain('<view class="view">\n  <text>content</text>\n</view>')
      expect(output.script.content).to.contain('Page({\n  onReady: function () {\n    console.log(\'ready\')\n  }\n})')
      expect(output.style.content).to.contain('.view {\n  color: red;\n}')
      expect(output.config.content).to.contain('{\n  "navigationBarTitleText": "画布"\n}')
    }
    var asyncOutput = {
      template: {},
      script: {},
      style: {},
      config: {}
    }
    var checkAll = function () {
      var allChecked = true
      for (var k in asyncOutput) {
        if (!asyncOutput[k].content) {
          allChecked = false
        }
      }
      if (allChecked) {
        check(asyncOutput)
        done()
        asyncOutput = null
      }
    }
    getFile('basic.wxml', function (content) {
      asyncOutput.template.content = content
      checkAll()
    })
    getFile('basic.js', function (content) {
      asyncOutput.script.content = content
      checkAll()
    })
    getFile('basic.wxss', function (content) {
      asyncOutput.style.content = content
      checkAll()
    })
    getFile('basic.json', function (content) {
      asyncOutput.config.content = content
      checkAll()
    })
  })

  it('src folder', function (done) {
    // fake
    var program = {
      args: ['test/src/'],
      output: 'test/output',
      silent: true
    }

    cliAction(program)

    var check = function (output) {
      expect(output.template.content).to.contain('<view class="view">\n  <text>content</text>\n</view>')
      expect(output.script.content).to.contain('Page({\n  onReady: function () {\n    console.log(\'ready\')\n  }\n})')
      expect(output.style.content).to.contain('.view {\n  color: red;\n}')
      expect(output.config.content).to.contain('{\n  "navigationBarTitleText": "画布"\n}')

      expect(output.subtemplate.content).to.contain('<view class="sub-view">\n  <text>sub content</text>\n</view>')
      expect(output.subscript.content).to.contain('Page({\n  onReady: function () {\n    console.log(\'sub ready\')\n  }\n})')
      expect(output.substyle.content).to.contain('.sub-view {\n  color: green;\n}')
      expect(output.subconfig.content).to.contain('{\n  "navigationBarTitleText": "画布sub"\n}')
    }
    var asyncOutput = {
      template: {},
      script: {},
      style: {},
      config: {},
      subtemplate: {},
      subscript: {},
      substyle: {},
      subconfig: {}
    }
    var checkAll = function () {
      var allChecked = true
      for (var k in asyncOutput) {
        if (!asyncOutput[k].content) {
          allChecked = false
        }
      }
      if (allChecked) {
        check(asyncOutput)
        done()
        asyncOutput = null
      }
    }
    getFile('basic.wxml', function (content) {
      asyncOutput.template.content = content
      checkAll()
    })
    getFile('basic.js', function (content) {
      asyncOutput.script.content = content
      checkAll()
    })
    getFile('basic.wxss', function (content) {
      asyncOutput.style.content = content
      checkAll()
    })
    getFile('basic.json', function (content) {
      asyncOutput.config.content = content
      checkAll()
    })
    getFile('sub/basic.wxml', function (content) {
      asyncOutput.subtemplate.content = content
      checkAll()
    })
    getFile('sub/basic.js', function (content) {
      asyncOutput.subscript.content = content
      checkAll()
    })
    getFile('sub/basic.wxss', function (content) {
      asyncOutput.substyle.content = content
      checkAll()
    })
    getFile('sub/basic.json', function (content) {
      asyncOutput.subconfig.content = content
      checkAll()
    })
  })

})

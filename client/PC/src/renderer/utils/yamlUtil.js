import { remote } from 'electron'
const yaml = require('write-yaml')
const readYaml = require('read-yaml')
var fs = require('fs')

export const writeYaml = (date, data) => {
  var baseFile = remote.app.getPath('userData') + '/data/' + date + '.yml'
  yaml.sync(baseFile, data)
}

export const appendYaml = (date, key, value) => {
  var baseFile = remote.app.getPath('userData') + '/data/' + date + '.yml'

  console.log('appendYaml:::', baseFile)

  if (!fs.existsSync(baseFile)) {
    writeYaml(date, null)
  }

  let data = readYaml.sync(baseFile)
  if (!data) {
    let tmpObj = {}
    tmpObj[key] = value
    yaml.sync(baseFile, tmpObj)
    return
  }
  if (data) {
    data[key] = value
    yaml.sync(baseFile, data)
  }
  // readYaml(baseFile, function (err, data) {
  //     if (err) {
  //         console.log("读yaml文件错误，" + err)
  //         let tmpObj = {}
  //         tmpObj[key] = value
  //         writeYaml(date, tmpObj)
  //         return ;
  //     }
  //     if (data) {
  //         data[key] = value
  //         writeYaml(date, data)
  //     } else {
  //         let tmpObj = {}
  //         tmpObj[key] = value
  //         writeYaml(date, tmpObj)
  //     }
  // });
}

export const readYamlInfoByKey = (date, key) => {
  var baseFile = remote.app.getPath('userData') + '/data/' + date + '.yml'

  console.log('readYamlInfoByKey:::', baseFile)

  if (!fs.existsSync(baseFile)) {
    writeYaml(date, null)
    return undefined
  }

  let data = readYaml.sync(baseFile)
  return data ? data[key] : undefined

  // readYaml(baseFile, function (err, data) {
  //     if (err) {
  //         console.log("读yaml文件错误，" + err)
  //     }
  //     let value = data ? data[key] : undefined
  //     callback(value)
  // });
}

export const readYamlInfo = (date, callback) => {
  var baseFile = remote.app.getPath('userData') + '/data/' + date + '.yml'
  readYaml(baseFile, function (err, data) {
    if (err) {
      console.log('读yaml文件错误，' + err)
    }
    if (data) {
      callback(data)
    }
  })
}

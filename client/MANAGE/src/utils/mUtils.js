/**
 * 存储localStorage
 */
export const setStore = (name, content) => {
  if (!name) return
  if (typeof content !== 'string') {
    content = JSON.stringify(content)
  }
  console.log('utils/mUtils.js  将' + content +'保存到localStorage(' + name + ')')
  window.sessionStorage.setItem(name, content)
}

/**
 * 获取localStorage
 */
export const getStore = name => {
  if (!name) return
  var value = window.sessionStorage.getItem(name)
  if (value !== null) {
    try {
      value = JSON.parse(value)
    } catch (e) { }
  }
  return value
}

/**
 * 删除localStorage
 */
export const removeStore = name => {
  if (!name) return
  window.sessionStorage.removeItem(name)
}

// /**
//  * @param {date} 标准时间格式:Fri Nov 17 2017 09:26:23 GMT+0800 (中国标准时间)
//  * @param {type} 类型
//  *   type == 1 ---> "yyyy-mm-dd hh:MM:ss.fff"
//  *   type == 2 ---> "yyyymmddhhMMss"
//  *   type == '' ---> "yyyy-mm-dd hh:MM:ss"
//  */
// export const formatDate = (date, type) => {
//   var year = date.getFullYear()// 年
//   var month = date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1// 月
//   var day = date.getDate() < 10 ? '0' + date.getDate() : date.getDate()// 日
//   var hour = date.getHours() < 10 ? '0' + date.getHours() : date.getHours()// 时
//   var minutes = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()// 分
//   var seconds = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds()// 秒
//   var milliseconds = date.getMilliseconds() < 10 ? '0' + date.getMilliseconds() : date.getMilliseconds() // 毫秒
//   if (type === 1) {
//     return year + '-' + month + '-' + day + ' ' + hour + ':' + minutes + ':' + seconds + '.' + milliseconds
//   } else if (type === 2) {
//     return year + '' + month + '' + day + '' + hour + '' + minutes + '' + seconds
//   } else if (type === 3) {
//     return year + '-' + month + '-' + day
//   } else {
//     return year + '-' + month + '-' + day + ' ' + hour + ':' + minutes + ':' + seconds
//   }
// }

/**
 * 日期格式化
 * @param date
 * @param fmt yyyy-mm-dd hh:MM:ss.fff
 *            yyyy-mm-dd hh:MM:ss
 *            yyyymmddhhMMss
 * @returns {*}
 */
export const formatDate = (date, fmt) => {
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length))
  }
  const o = {
    'M+': date.getMonth() + 1,
    'd+': date.getDate(),
    'h+': date.getHours(),
    'm+': date.getMinutes(),
    's+': date.getSeconds()
  }
  for (const k in o) {
    if (new RegExp(`(${k})`).test(fmt)) {
      const str = o[k] + ''
      fmt = fmt.replace(RegExp.$1, RegExp.$1.length === 1 ? str : padLeftZero(str))
    }
  }
  return fmt
}

function padLeftZero(str) {
  return ('00' + str).substr(str.length)
}

/**
 * 得到两个日期之间相差的天数
 * 参数是时间戳：1531497600000, 1531584000000
 */
export const getDiffDay = (startTime, endTime) => {
  var diff = endTime - startTime
  return Math.floor(diff / 1000 / 60 / 60 / 24) + 1
}

/**
 * 时间转换：20150101010101 --> '2015-01-01 01:01:01'
 */
export const parseToDate = (timeValue) => {
  var result = ''
  var year = timeValue.substr(0, 4)
  var month = timeValue.substr(4, 2)
  var date = timeValue.substr(6, 2)
  var hour = timeValue.substr(8, 2)
  var minute = timeValue.substr(10, 2)
  var second = timeValue.substr(12, 2)
  result = year + '-' + month + '-' + date + ' ' + hour + ':' + minute + ':' + second
  return result
}
/**
 * 判断空值
 */
export const isEmpty = (keys) => {
  if (typeof keys === 'string') {
    keys = keys.replace(/\"|&nbsp;|\\/g, '').replace(/(^\s*)|(\s*$)/g, '')
    if (keys === '' || keys == null || keys === 'null' || keys === 'undefined') {
      return true
    } else {
      return false
    }
  } else if (typeof keys === 'undefined') { // 未定义
    return true
  } else if (typeof keys === 'number') {
    return false
  } else if (typeof keys === 'boolean') {
    return false
  } else if (typeof keys === 'object') {
    if (JSON.stringify(keys) === '{}') {
      return true
    } else if (keys == null) { // null
      return true
    } else {
      return false
    }
  }

  if (keys instanceof Array && keys.length === 0) { // 数组
    return true
  }
}
/**
 * 金额格式化（千位符）
 * @param value
 * @returns {string}
 */
export const moneyFormat = (value) => {
  if (!value) return '0.00'
  value = value.toString()
  var intPart = Number(value).toFixed(0) // 获取整数部分
  var intPartFormat = intPart.toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,') // 将整数部分逢三一断

  var floatPart = '.00' // 预定义小数部分
  var value2Array = value.split('.')
  // =2表示数据有小数位
  if (value2Array.length === 2) {
    floatPart = value2Array[1].toString() // 拿到小数部分
    if (floatPart.length === 1) { // 补0,实际上用不着
      return intPartFormat + '.' + floatPart + '0'
    } else {
      return intPartFormat + '.' + floatPart
    }
  } else {
    return intPartFormat + floatPart
  }
}

/**
 * 返回两位的小数的字符串
 */
export const toFixedNum = (num) => {
  // const tonum = Number(num).toFixed(2);
  const tonum = Number(num)
  return tonum
}

export const showMessage = () => {
  this.$message({
    showClose: true,
    message: '对不起，您暂无此操作权限~',
    type: 'success'
  })
}

/**
 * 读取base64
 */
export const readFile = file => {
  console.log(file)
  // var file = this.files[0];
  // 判断是否是图片类型
  if (!/image\/\w+/.test(file.raw.type)) {
    alert('只能选择图片')
    return false
  }
  var reader = new FileReader()
  reader.readAsDataURL(file)
  reader.onload = function(e) {
    // var filedata = {
    //   filename: file.name,
    //   filebase64: e.target.result
    // }
    alert(e.target.result)
  }
}

export const idEncrypt = (idNum) => {
  if (!idNum || idNum == null) {
    return ''
  }
  if (idNum.length < 8) {
    return idNum
  }
  const idNumEnc = idNum.replace(/(\w)/g, function(a, b, c, d) {
    return ((c > 1 && c < 6) || c > (idNum.length - 5)) ? '*' : a
  })
  return idNumEnc
}

export const goodTime = (str) => {
  var now = new Date().getTime(),
    oldTime = new Date(str).getTime(),
    difference = now - oldTime,
    result = '',
    minute = 1000 * 60,
    hour = minute * 60,
    day = hour * 24,
    halfamonth = day * 15,
    month = day * 30,
    year = month * 12,

    _year = difference / year,
    _month = difference / month,
    _week = difference / (7 * day),
    _day = difference / day,
    _hour = difference / hour,
    _min = difference / minute
  if (_year >= 1) {
    result = '' + ~~(_year) + ' 年前'
  } else if (_month >= 1) {
    result = '' + ~~(_month) + ' 个月前'
  } else if (_week >= 1) {
    result = '' + ~~(_week) + ' 周前'
  } else if (_day >= 1) {
    result = '' + ~~(_day) + ' 天前'
  } else if (_hour >= 1) {
    result = '' + ~~(_hour) + ' 小时前'
  } else if (_min >= 1) {
    result = '' + ~~(_min) + ' 分钟前'
  } else result = '刚刚'
  return result
}

export const cloneObj = (data) => {
  if (Array.isArray(data)) {
    // 引用数据类型：Array
    const newArr = []
    for (const i in data) {
      newArr[i] = cloneObj(data[i])
    }
    return newArr
  } else if (data instanceof Object) {
    // 引用数据类型：Object
    const newObj = {}
    for (const key in data) {
      newObj[key] = cloneObj(data[key])
    }
    return newObj
  } else {
    // 基础数据类型
    return data
  }
}

export const GMTToStr = (time) => {
  if (!time) {
    return ''
  }
  var now = new Date(time)
  var year = now.getFullYear()
  var mon = now.getMonth() + 1
  var date = now.getDate()
  var hour = now.getHours()
  var minute = now.getMinutes()
  var second = now.getSeconds()
  if (mon < 10) {
    mon = '0' + mon
  }

  if (date < 10) {
    date = '0' + date
  }
  if (hour < 10) {
    hour = '0' + hour
  }
  if (minute < 10) {
    minute = '0' + minute
  }
  if (second < 10) {
    second = '0' + second
  }
  var postDate = year + '-' + mon + '-' + date + ' ' + hour + ':' + minute + ':' + second
  return postDate
}

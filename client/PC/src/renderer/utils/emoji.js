import data from '../../../static/js/emoji/emoji-data.js'
let emojiData = {}
Object.values(data).forEach(item => {
  emojiData = { ...emojiData, ...item }
})

/**
 *
 *
 * @export
 * @param {string} value
 * @returns {string}
 */

export function emoji (value) {
  if (!value) return
  Object.keys(emojiData).forEach(item => {
    value = value.replace(new RegExp(item, 'g'), createIcon(item))
  })
  return value
}

let emoajiPath = 'static/emoji/'

function createIcon (item) {
  const value = emojiData[item]
  return `<img src=${emoajiPath}${value} width="25px" height="25px" type="emoji">`
}

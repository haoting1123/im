// 验证空格
export function validatorSpace (rule, value, callback) {
  if (!value || !value.replace(/\s/g, '')) {
    callback(new Error('请输入有效字符!'))
    return
  }
  callback()
}

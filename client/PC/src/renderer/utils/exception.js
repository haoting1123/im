export function outputError (source, error) {
  console.log(error.response ? error.response : error.message)
  console.log(JSON.stringify(error))
  console.log(error)
  // source.$message({
  //   showClose: true,
  //   message: '出错了，请联系管理员。', // JSON.stringify(error),
  //   type: 'error'
  // })
}

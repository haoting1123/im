import {
  ipcMain,
  app
} from 'electron'
let Datastore = require('nedb')
let dbList = {}

const clearDb = function () {
  if (dbList.users) {
    dbList.users.persistence.compactDatafile()
  }
  if (dbList.messages) {
    dbList.messages.persistence.compactDatafile()
  }
}

const userTable = function () {
  // 用户登录成功后，加载当前用户的数据库
  let dbPath = app.getPath('appData')
  console.log(dbPath)
  ipcMain.on('loadUserTable', (event, userId, reqId) => {
    dbList.users = new Datastore({filename: dbPath + '/imData/user' + userId + '.db', timestampData: true})
    // 加载到内存中
    dbList.users.loadDatabase(function (err) {
      // Now commands will be executed
      console.log(err)
    })
    dbList.messages = new Datastore({filename: dbPath + '/imData/message' + userId + '.db', timestampData: true})
    // 加载到内存中
    dbList.messages.loadDatabase(function (err) {
      // Now commands will be executed
      console.log('加载完成', err)
      event.sender.send('loadUserTableReply' + reqId)
    })
    // 10分钟整理一下文档
    // dbList.messages.persistence.setAutocompactionInterval(1000 * 60 * 10)

    dbList.messages.ensureIndex({ fieldName: 'createTime' }, function (err) {
      // If there was an error, err is not null
      console.log(err)
    })
    dbList.messages.ensureIndex({ fieldName: 'channelId' }, function (err) {
      // If there was an error, err is not null
      console.log(err)
    })
  })

  ipcMain.on('clearDbMessage', (event) => {
    dbList.users.persistence.compactDatafile()
    dbList.messages.persistence.compactDatafile()
  })

  // 插入数据
  ipcMain.on('insertUserData', (event, reqId, userData) => {
    dbList.users.insert(userData, function (err, newDoc) { // Callback is optional
      // newDoc is the newly inserted document, including its _id
      // newDoc has no key called notToBeSaved since its value was undefined
      console.log(err, newDoc)
      event.sender.send('insertUserDataReply' + reqId, {err: err, newDoc: newDoc})
    })
  })

  // 更新数据
  ipcMain.on('updateUserData', (event, reqId, updateData) => {
    console.log(111, updateData.createTime)
    // 设定一个已存字段的值
    dbList.users.update({ _id: updateData._id }, updateData, {}, function (err, numReplaced) {
      // numReplaced = 3
      // Field 'system' on Mars, Earth, Jupiter now has value 'solar system'
      console.log(err, numReplaced)
      event.sender.send('updateUserDataReply' + reqId, {err: err, numReplaced: numReplaced})
    })
  })

  // 更新单个字段 根据channelId
  ipcMain.on('updateUserSingleProp', (event, reqId, userId, updateData) => {
    // 设定一个已存字段的值
    console.log(userId, updateData)
    dbList.users.update({ channelId: userId }, {$set: updateData}, {}, function (err, numReplaced, affectedDocuments) {
      // numReplaced = 3
      // Field 'system' on Mars, Earth, Jupiter now has value 'solar system'
      console.log(err, numReplaced)
      event.sender.send('updateUserSinglePropReply' + reqId, {err: err, numReplaced: numReplaced, userId: userId})
    })
  })

  // 同步更新单个字段 根据channelId
  ipcMain.on('SYNC_updateUserSingleProp', (event, userId, updateData) => {
    // 设定一个已存字段的值
    dbList.users.update({ channelId: userId }, {$set: updateData}, {}, function (err, numReplaced, affectedDocuments) {
      // numReplaced = 3
      // Field 'system' on Mars, Earth, Jupiter now has value 'solar system'
      console.log(err, numReplaced)
      event.returnValue = {err: err, numReplaced: numReplaced, userId: userId}
    })
  })

  // 删除数据
  ipcMain.on('deleteUserData', (event, reqId, userId) => {
    dbList.users.remove({ _id: userId }, {}, function (err, numRemoved) {
      // numRemoved = 1
      // console.log(err, numRemoved)
      event.sender.send('deleteUserDataReply' + reqId, {err: err, numRemoved: numRemoved})
    })
  })

  // 查询单个对象
  ipcMain.on('searchUserDataById', (event, reqId, userId) => {
    // 查询某一个文档
    dbList.users.findOne({ _id: userId }, function (err, doc) {
      // doc is the document Mars
      // If no document is found, doc is null
      // console.log(err, doc)
      event.sender.send('searchUserDataByIdReply' + reqId, {err: err, doc: doc})
    })
  })

  // 查询单个对象
  ipcMain.on('searchUserData', (event, reqId, jid) => {
    console.log('searchUserData', jid)
    // 查询某一个文档
    dbList.users.findOne({ jid: jid }, function (err, doc) {
      // doc is the document Mars
      // If no document is found, doc is null
      // console.log(err, doc)
      event.sender.send('searchUserDataReply' + reqId, {err: err, doc: doc})
    })
  })

  // 同步查询单个对象
  ipcMain.on('SYNC_searchUserData', (event, jid) => {
    console.log('SYNC_searchUserData', jid)
    // 查询某一个文档
    dbList.users.findOne({ jid: jid }, function (err, doc) {
      // doc is the document Mars
      // If no document is found, doc is null
      // console.log(err, doc)
      event.returnValue = {err: err, doc: doc}
    })
  })

  // 查询所有对象
  ipcMain.on('searchUserDataAll', (event, reqId) => {
    dbList.users.find({}, function (err, docs) {
      // console.log(err, docs)
      // if (err) {
      //   event.returnValue = err
      // } else {
      //   event.returnValue = docs
      // }
      event.sender.send('searchUserDataAllReply' + reqId, {err: err, docs: docs})
    })
  })

  // 分页查询对象列表
  ipcMain.on('searchUserDataPage', (event, userId) => {
    // No query used means all results are returned (before the Cursor modifiers)
    dbList.users.find({}).sort({ planet: 1 }).skip(1).limit(2).exec(function (err, docs) {
      // docs is [doc3, doc1]
      console.log(err)
    })

    // You can sort in reverse order like this
    // dbList.users.find({ system: 'solar' }).sort({ planet: -1 }).exec(function (err, docs) {
    //   // docs is [doc1, doc3, doc2]
    //   console.log(err, docs)
    // })
  })
}

const messageTable = function () {
  // 用户登录成功后，加载当前用户的数据库
  // ipcMain.on('loadMessageTable', (_, userId) => {
  //   dbList.messages = new Datastore('./data/message' + userId + '.db')
  //   // 加载到内存中
  //   dbList.messages.loadDatabase(function (err) {
  //     // Now commands will be executed
  //     console.log(err)
  //   })
  // })
  // 插入数据
  ipcMain.on('insertMessageData', (event, reqId, messageData) => {
    dbList.messages.insert(messageData, function (err, newDoc) { // Callback is optional
      // newDoc is the newly inserted document, including its _id
      // newDoc has no key called notToBeSaved since its value was undefined
      // console.log('插入数据成功', err, newDoc)
      // if (err) {
      //   event.returnValue = err
      // } else {
      //   event.returnValue = newDoc
      // }
      event.sender.send('insertMessageReply' + reqId, {err: err, newDoc: newDoc})
    })
  })

  // 更新数据 根据_id
  ipcMain.on('updateMessageDataSingleProp', (event, reqId, messageId, updateData) => {
    // 设定一个已存字段的值
    dbList.messages.update({ _id: messageId }, { $set: updateData }, {}, function (err, numReplaced) {
      // numReplaced = 3
      // Field 'system' on Mars, Earth, Jupiter now has value 'solar system'
      console.log(err, numReplaced)
      event.sender.send('updateMessageDataSinglePropReply' + reqId, {err: err, numReplaced: numReplaced})
    })
  })

  // // 更新数据 根据_id
  ipcMain.on('updateMessageIsReadBySignId', (event, reqId, channelId, signId) => {
    // 查出对应的数据
    dbList.messages.findOne({ signId: signId, channelId: channelId, isRead: { $ne: 'yes' } }, function (err, doc) {
      // doc is the document Mars
      // If no document is found, doc is null
      console.log(err, doc)
      if (doc) {
        let count = doc.readCount
        if (!count) {
          count = 0
        }
        count += 1
        // 设定一个已存字段的值
        dbList.messages.update({ _id: doc._id }, { $set: { isRead: 'yes', readCount: count } }, {}, function (err, numReplaced) {
          // numReplaced = 3
          // Field 'system' on Mars, Earth, Jupiter now has value 'solar system'
          console.log(err, numReplaced)
          event.sender.send('updateMessageIsReadBySignIdReply' + reqId, {err: err, numReplaced: numReplaced})
        })
      } else {
        event.sender.send('updateMessageIsReadBySignIdReply' + reqId, {err: err, numReplaced: 0})
      }
    })
  })

  // UPDATE tab_message SET isRead='yes',readCount=readCount+1 WHERE channelId = '${channelId}' AND signId = '${signId}' AND isRead != 'yes'

  ipcMain.on('updateMessageIsRead', (event, reqId, senderId, channelId, readTime) => {
    // 设定一个已存字段的值
    dbList.messages.update({ senderId: senderId, channelId: channelId, createTime: { $lte: readTime }, isRead: { $ne: 'yes' } }, { $set: {isRead: 'yes'} }, {multi: true}, function (err, numReplaced) {
      // numReplaced = 3
      // Field 'system' on Mars, Earth, Jupiter now has value 'solar system'
      console.log(err, numReplaced)
      event.sender.send('updateMessageIsReadReply' + reqId, {err: err, numReplaced: numReplaced})
    })
  })

  // 更新数据
  ipcMain.on('deleteMessageBySignId', (event, reqId, channelId, signId) => {
    // console.log(signId, channelId, 3333333)
    // 设定一个已存字段的值
    dbList.messages.remove({ channelId: channelId, signId: signId }, {}, function (err, numRemoved) {
      // numRemoved = 1
      console.log('删除结果', err, numRemoved)
      event.sender.send('deleteMessageBySignIdReply' + reqId, {err: err, numRemoved: numRemoved})
    })
  })

  // 更新数据
  ipcMain.on('updateMessageData', (event, reqId, updateData) => {
    // console.log(updateData._id, updateData, 3333333)
    // 设定一个已存字段的值
    dbList.messages.update({ _id: updateData._id }, updateData, {}, function (err, numReplaced) {
      // numReplaced = 3
      // Field 'system' on Mars, Earth, Jupiter now has value 'solar system'
      console.log(err, numReplaced)
      event.sender.send('updateMessageDataReply' + reqId, {err: err, numReplaced: numReplaced})
    })
  })

  // 删除数据
  ipcMain.on('deleteMessageData', (event, reqId, messageId) => {
    dbList.messages.remove({ _id: messageId }, {}, function (err, numRemoved) {
      // numRemoved = 1
      console.log(err, numRemoved)
      event.sender.send('deleteMessageDataReply' + reqId, {err: err, numRemoved: numRemoved})
    })
  })

  // 删除单个会话的所有数据
  ipcMain.on('deleteMessageBySessionId', (event, reqId, sessionId) => {
    dbList.messages.remove({ channelId: sessionId }, {multi: true}, function (err, numRemoved) {
      // numRemoved = 1
      console.log(err, numRemoved)
      event.sender.send('deleteMessageBySessionIdReply' + reqId, {err: err, numRemoved: numRemoved})
    })
  })

  // 删除所有消息
  ipcMain.on('deleteAllMessage', (event, reqId) => {
    dbList.messages.remove({}, {multi: true}, function (err, numRemoved) {
      // numRemoved = 1
      console.log(err, numRemoved)
      event.sender.send('deleteAllMessageReply' + reqId, {err: err, numRemoved: numRemoved})
    })
  })

  // 查询单个对象
  ipcMain.on('searchMessageData', (event, messageId) => {
    // 查询某一个文档
    dbList.messages.findOne({ _id: messageId }, function (err, doc) {
      // doc is the document Mars
      // If no document is found, doc is null
      console.log(err, doc)
    })
  })

  // 查询单个对象 根据reqId查询
  ipcMain.on('searchMessageDataByReqId', (event, reqId, searchId) => {
    // 查询某一个文档
    dbList.messages.findOne({ reqId: searchId }, function (err, doc) {
      // doc is the document Mars
      // If no document is found, doc is null
      console.log(err, doc)
      event.sender.send('searchMessageDataByReqIdReply' + reqId, {err: err, doc: doc})
    })
  })

  // 查询所有对象
  ipcMain.on('searchMessageDataAll', (event, reqId, channelId) => {
    dbList.messages.find({'channelId': channelId}).sort({ createTime: 1 }).exec(function (err, docs) {
      // doc is the document Mars
      // If no document is found, doc is null
      console.log(err, docs)
      event.sender.send('searchMessageDataAllReply' + reqId, {err: err, docs: docs})
    })
  })

  // 分页查询对象列表
  ipcMain.on('searchMessageDataPage', (event, reqId, channelId, maxCreateAt, limit, content, maxStartAt) => {
    // No query used means all results are returned (before the Cursor modifiers)
    let searchCondition = {'channelId': channelId}
    if (maxCreateAt && maxCreateAt > 0) {
      searchCondition.createTime = { $lt: maxCreateAt }
    }
    // 查询更多未读和@我的消息
    if (maxStartAt && maxStartAt > 0) {
      maxStartAt = parseInt(maxStartAt)
      searchCondition = { $and: [{ createTime: { $lt: maxCreateAt } }, { createTime: { $gte: maxStartAt } }] }
      limit = 1000 // 最大查询1000条
    }
    if (content) {
      searchCondition.content = new RegExp(content)
    }
    console.log(searchCondition, content)
    dbList.messages.find(searchCondition).sort({ createTime: -1 }).limit(limit).exec(function (err, docs) {
      // docs is [doc3, doc1]
      // console.log(err, docs)
      // if (err) {
      //   event.returnValue = err
      // } else {
      //   event.returnValue = docs
      // }
      event.sender.send('searchMessageDataPageReply' + reqId, {err: err, docs: docs})
    })

    // // You can sort in reverse order like this
    // dbList.messages.find({ system: 'solar' }).sort({ planet: -1 }).exec(function (err, docs) {
    //   // docs is [doc1, doc3, doc2]
    //   console.log(err, docs)
    // })
  })

  // 查询单个对象 根据channelId查询,倒叙查找最后一条
  ipcMain.on('searchMessageByChannelId', (event, reqId, searchId) => {
    // 查询某一个文档
    dbList.messages.findOne({ 'channelId': searchId }).sort({ createTime: -1 }).exec(function (err, doc) {
      // doc is the document Mars
      // If no document is found, doc is null
      console.log(err, doc)
      event.sender.send('searchMessageByChannelIdReply' + reqId, {err: err, doc: doc})
    })
  })
}

export const localDB = { userTable, messageTable, clearDb }

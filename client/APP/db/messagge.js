import LocalDb from './index.js'
let localDb = LocalDb.getInstance()

// 分页查询
export const getMessageByPageData = (channelId, maxCreateAt, limit, content, maxStartAt, orderBy) => {
    return new Promise((resolve, reject) => {
        // 查询数据
        let searchSql = `select * from tab_message where channelId = '${channelId}' `
        // 查看更多逻辑
        if (maxCreateAt && maxCreateAt > 0) {
            searchSql += ` AND createTime < ${maxCreateAt}`
        }
        // 查询更多未读和@我的消息
        if (maxStartAt && maxStartAt > 0) {
            searchSql += ` AND createTime < ${maxCreateAt} AND createTime >= ${maxStartAt} `
            limit = 1000 // 最大查询1000条
        }
        // 根据内容检索
        if (content) {
            searchSql += ` AND content like '%${content}%' AND (fileType = 'undefined' OR fileType = '' )`
        }
		if(!orderBy){
			orderBy = 'desc'
		}
        // ID倒叙分页
        searchSql += ` order by rowid ${orderBy} limit ${limit} `
        console.log('查询语句：' + searchSql)
        localDb.selectSQL(searchSql).then(data => {
            // console.log('返回结果：' + JSON.stringify(data))
            resolve(data)
        })
    })
}

export const getMessageByHistorySearch = (channelId, maxCreateAt) => {
    return new Promise((resolve, reject) => {
        // 查询数据
        let searchSql = `select * from tab_message where channelId = '${channelId}' AND createTime >= ${maxCreateAt} order by rowid desc limit 1000 `
        console.log('查询语句：' + searchSql)
        localDb.selectSQL(searchSql).then(data => {
            // console.log('返回结果：' + JSON.stringify(data))
            resolve(data)
        })
    })
}

// ID查询单条消息
export const getMessageById = (id) => {
    return new Promise((resolve, reject) => {
        // 查询数据
        let searchSql = `select * from tab_message where id = '${id}'`
        console.log('查询语句：' + searchSql)
        localDb.selectSQL(searchSql).then(data => {
            console.log('返回结果：' + JSON.stringify(data))
            resolve(data)
        })
    })
}
// channelId查询列表
export const getMessageByChannelId = (channelId) => {
    return new Promise((resolve, reject) => {
        // 查询数据
        let searchSql = `select * from tab_message where channelId = '${channelId}' order by createTime asc`
        console.log('查询语句：' + searchSql)
        localDb.selectSQL(searchSql).then(data => {
            console.log('返回结果：' + JSON.stringify(data))
            resolve(data)
        })
    })
}

// channelId查询最新的一条消息
export const getMessageByChannelIdLastOne = (channelId) => {
    return new Promise((resolve, reject) => {
        // 查询数据
        let searchSql = `select * from tab_message where channelId = '${channelId}' order by createTime desc limit 1`
        // console.log('查询语句：' + searchSql)
        localDb.selectSQL(searchSql).then(data => {
            // console.log('返回结果：' + JSON.stringify(data))
            resolve(data)
        })
    })
}

// TODO 增加消息
export const insertMessage = (message) => {
    return new Promise((resolve, reject) => {
        if(!message.id){
            let randId = Math.floor(Math.random () * 900) + 100
            message.id = new Date().getTime() + '' + randId
        }
		if(!message.fileType){
			message.content = message.content.replace(/\'/g, "&apos;") 
		}
		 
        // 查询数据
        let execSql =
            `INSERT INTO tab_message (id , signId, channelId , channelType , content , createTime , fileType , senderId, receive, user, chatType, isRead) 
										VALUES ( '${message.id }', '${message.signId }', '${message.channelId }', '${message.channelType }', '${message.content }', ${message.createTime }, '${message.fileType }', '${message.senderId }', '${message.receive }', '${message.user }', '${message.chatType }', '${message.isRead }');`
        console.log('语句：' + execSql)
        localDb.executeSQL(execSql).then(data => {
            console.log('插入返回结果：' + JSON.stringify(data))
			resolve(message)
            // 获取最新插入的row_Id
//             localDb.selectSQL('SELECT last_insert_rowid() as rowidnum from tab_message limit 1').then(data1 => {
//                 console.log('插入返回结果1：' + JSON.stringify(data1))
// 				if(data1 && data1.length > 0){
// 					let rowidnum = data1[0].rowidnum
// 					localDb.selectSQL('SELECT rowid,* from tab_message where rowid='+rowidnum).then(data2 => {
// 					    console.log('插入返回结果2：' + JSON.stringify(data2))
// 						if(data2 && data2.length > 0){
// 							resolve(data2[0])
// 						}else{
// 							resolve()
// 						}
// 					})
// 				}else{
// 					resolve()
// 				}
//             })
        })
    })
}


// 删除
export const deleteMessageById = (id) => {
    return new Promise((resolve, reject) => {
        // 查询数据
        let execSql = `DELETE FROM tab_message WHERE id = '${id}'`
        console.log('语句：' + execSql)
        localDb.executeSQL(execSql).then(data => {
            console.log('返回结果：' + JSON.stringify(data))
            resolve(data)
        })
    })
}

// 删除某条消息，按照signId5
export const deleteMessageBySignId = (channelId, signId) => {
    return new Promise((resolve, reject) => {
        // 查询数据
        let execSql = `DELETE FROM tab_message WHERE channelId = '${channelId}' AND signId = '${signId}'`
        console.log('语句：' + execSql)
        localDb.executeSQL(execSql).then(data => {
            console.log('返回结果：' + JSON.stringify(data))
            resolve(data)
        })
    })
}

// 删除密聊消息，按照chatType
export const deleteMessageByChatType = (channelId, chatType) => {
    return new Promise((resolve, reject) => {
        // 查询数据
        let execSql = `DELETE FROM tab_message WHERE channelId = '${channelId}' AND chatType = '${chatType}'`
        console.log('语句：' + execSql)
        localDb.executeSQL(execSql).then(data => {
            console.log('返回结果：' + JSON.stringify(data))
            resolve(data)
        })
    })
}

// 清空某人消息
export const deleteMessageBychannelId = (channelId) => {
    return new Promise((resolve, reject) => {
        // 查询数据
        let execSql = `DELETE FROM tab_message WHERE channelId = '${channelId}'`
        console.log('语句：' + execSql)
        localDb.executeSQL(execSql).then(data => {
            console.log('返回结果：' + JSON.stringify(data))
            resolve(data)
        })
    })
}
// 清空所有消息
export const deleteAllMessage = () => {
    return new Promise((resolve, reject) => {
        // 删除数据
        let execSql = 'DELETE FROM tab_message'
        console.log('语句：' + execSql)
        localDb.executeSQL(execSql).then(data => {
            console.log('返回结果：' + JSON.stringify(data))
            resolve(data)
        })
    })
}

// 修改消息状态为已读
export const updateMessageIsRead = (senderId, channelId, readTime) => {
    return new Promise((resolve, reject) => {
		let execSql = `UPDATE tab_message SET isRead='yes' WHERE channelId = '${channelId}' AND senderId = '${senderId}' AND isRead != 'yes' AND createTime <= ${readTime} `
        // 更新数据
        console.log('语句：' + execSql)
        localDb.executeSQL(execSql).then(data => {
            console.log('返回结果：' + JSON.stringify(data))
            resolve(data)
        })
    })
}

// 修改消息
export const updateMessage = (id, mess) => {
    return new Promise((resolve, reject) => {
		let messTemp = Object.assign({},mess)
        delete messTemp.id
		delete messTemp.createTimeStr
        let condition = entries(messTemp).map(([k, v]) => {
			let str = [k] + '='
			if (typeof(v)=='string') {
				let temp = v.replace(/\'/g, "\\'") 
				str += `'${temp}'`
			}else if(typeof(v) == "undefined"){
				str += `''`
			} else {
				str += `${v}`
			} 
			return str
		}) 
		let updateCondition = condition.join(',')
		let execSql = `UPDATE tab_message SET ${updateCondition} WHERE id = ${id}`
        // 更新数据
        console.log('语句：' + execSql)
        localDb.executeSQL(execSql).then(data => {
            console.log('返回结果：' + JSON.stringify(data))
            resolve(data)
        })
    })
}

// 更新某条消息已读状态，按照signId
export const updateMessageIsReadBySignId = (channelId, signId) => {
    return new Promise((resolve, reject) => {
        // 查询数据
        let execSql = `UPDATE tab_message SET isRead='yes',readCount=readCount+1 WHERE channelId = '${channelId}' AND signId = '${signId}' AND isRead != 'yes' `
        console.log('语句：' + execSql)
        localDb.executeSQL(execSql).then(data => {
            console.log('返回结果：' + JSON.stringify(data))
            resolve(data)
        })
    })
}

function entries(obj) {
	let arr = [];
	for (let key of Object.keys(obj)) {
		arr.push([key, obj[key]]);
	}
	return arr;
}

// 关闭数据库
export const closeDb = () => {
    localDb.closeDB().then(data => {
    })
}
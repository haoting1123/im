import LocalDb from './index.js'
// 获取数据库实例
let localDb = LocalDb.getInstance()

// 获取所有会话列表
export const getAllSessionDb = () => {
	return new Promise((resolve, reject) => {
		// 查询数据
		let searchSql = 'select * from tab_session'
		console.log('查询语句：' + searchSql)
		localDb.selectSQL(searchSql).then(data => {
			// console.log('返回结果：' + JSON.stringify(data))
			resolve(data)
		})
	})
}

// ID查询单条会话
export const getSessionById = (id) => {
	return new Promise((resolve, reject) => {
		// 查询数据
		let searchSql = `select * from tab_session where id = '${id}'`
		console.log('查询语句：' + searchSql)
		localDb.selectSQL(searchSql).then(data => {
			console.log('返回结果：' + JSON.stringify(data))
			resolve(data)
		})
	})
}
// channelId查询单个会话
export const getSessionByChannelId = (channelId) => {
	return new Promise((resolve, reject) => {
		// 查询数据
		let searchSql = `select * from tab_session where channelId = '${channelId}' limit 1`
		console.log('查询语句：' + searchSql)
		localDb.selectSQL(searchSql).then(data => {
			console.log('返回结果：' + JSON.stringify(data))
			resolve(data)
		})
	})
}

// TODO 增加会话
export const insertSession = (sess) => {
	return new Promise((resolve, reject) => {
        if(!sess.id){
            let randId = Math.floor(Math.random () * 900) + 100
            sess.id =  new Date().getTime() + '' + randId
        }
		// 过滤消息中的非法字符
		if(sess.lastMessage){
			sess.lastMessage = sess.lastMessage.replace(/\'/g, "&apos;") 
		}
		if(sess.lastName){
			sess.lastName = sess.lastName.replace(/\'/g, "\\'") 
		}
		if(sess.alias){
			sess.alias = sess.alias.replace(/\'/g, "\\'") 
		}
		if(sess.groupName){
			sess.groupName = sess.groupName.replace(/\'/g, "\\'") 
		}
		if(sess.name){
			sess.name = sess.name.replace(/\'/g, "\\'") 
		}
		// 查询数据
		let execSql =
			`INSERT INTO tab_session (id, userId, alias, atTime, createTime, headUrl , isAtMe , isTip , lastMessage , lastName , name, groupName, sex , sort , top , unreadMessageCount , jid , channelType , channelId) VALUES 
			( '${sess.id}', '${sess.userId}', '${sess.alias}', '${sess.atTime}', ${sess.createTime}, '${sess.headUrl}', '${sess.isAtMe}', '${sess.isTip}', '${sess.lastMessage}','${sess.lastName}', '${sess.name}', '${sess.groupName}', '${sess.sex}', ${sess.sort}, '${sess.top}', ${sess.unreadMessageCount}, '${sess.jid}', '${sess.channelType}', '${sess.channelId}' )`
		console.log('语句：' + execSql)
		localDb.executeSQL(execSql).then(data => {
			console.log('返回结果：' + JSON.stringify(data))
			resolve(sess)
// 			localDb.selectSQL('SELECT last_insert_rowid() as rowidnum from tab_session limit 1').then(data1 => {
// 			    console.log('插入返回结果1：' + JSON.stringify(data1))
// 				if(data1 && data1.length > 0){
// 					let rowidnum = data1[0].rowidnum
// 					localDb.selectSQL('SELECT rowid,* from tab_session where rowid='+rowidnum).then(data2 => {
// 					    console.log('插入返回结果2：' + JSON.stringify(data2))
// 					    if(data2 && data2.length > 0){
// 					    	resolve(data2[0])
// 					    }else{
// 					    	resolve()
// 					    }
// 					})
// 				}else{
// 					resolve()
// 				}
// 			})
		})
	})
}
// 删除会话
export const deleteSessionById = (id) => {
	return new Promise((resolve, reject) => {
		// 查询数据
		let execSql = `DELETE FROM tab_session WHERE id = '${id}'`
		console.log('语句：' + execSql)
		localDb.executeSQL(execSql).then(data => {
			console.log('返回结果：' + JSON.stringify(data))
			resolve(data)
		})
	})
}
// 清空
export const deleteSessionBychannelId = (channelId) => {
	return new Promise((resolve, reject) => {
		// 查询数据
		let execSql = `DELETE FROM tab_session WHERE channelId = '${channelId}'`
		console.log('语句：' + execSql)
		localDb.executeSQL(execSql).then(data => {
			console.log('返回结果：' + JSON.stringify(data))
			resolve(data)
		})
	})
}
// 清空所有会话
export const deleteAllSession = () => {
	return new Promise((resolve, reject) => {
		// 删除数据
		let execSql = 'DELETE FROM tab_session'
		console.log('语句：' + execSql)
		localDb.executeSQL(execSql).then(data => {
			console.log('返回结果：' + JSON.stringify(data))
			resolve(data)
		})
	})
}

// 修改会话
export const updateSession = (id, sess) => {
	return new Promise((resolve, reject) => {
		let sessTemp = Object.assign({},sess)
		delete sessTemp.id
		delete sessTemp.createTimeStr
        delete sessTemp.type
		let condition = entries(sessTemp).map(([k, v]) => {
			let str = [k] + '='
			if (typeof(v)=='string') {
				if([k] === 'lastMessage'){
					let temp = v.replace(/\'/g, "&apos;") 
					str += `'${temp}'`
				}else{
					str += `'${v}'`
				}
			}else if(typeof(v) == "undefined"){
				str += `''`
			} else {
				str += `${v}`
			} 
			return str
		}) 

		let updateCondition = condition.join(',')
		let execSql = `UPDATE tab_session SET ${updateCondition} WHERE id = '${id}'`
		// 更新数据
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

// 查询每个会话关键字的模糊查询
export const getSessionListByContentLike = (content) => {
	return new Promise((resolve, reject) => {
		// 查询数据
		let searchSql = `select *,t1.msgNum from tab_session join (select channelId,COUNT(*) msgNum from tab_message where content like '%${content}%' AND (fileType = 'undefined' OR fileType = '' ) GROUP BY channelId) t1 USING(channelId)`
		console.log('查询语句：' + searchSql)
		localDb.selectSQL(searchSql).then(data => {
			// console.log('返回结果：' + JSON.stringify(data))
			resolve(data)
		})
	})
}

// 清空会话消息最后的消息
export const resetSessionLastMessageDb = (channelId) => {
	return new Promise((resolve, reject) => {
		// 查询数据
		let execSql = `UPDATE tab_session set lastMessage='' WHERE channelId = '${channelId}'`
		console.log('语句：' + execSql)
		localDb.executeSQL(execSql).then(data => {
			console.log('返回结果：' + JSON.stringify(data))
			resolve(data)
		})
	})
}
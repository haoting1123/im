// 本地数据库 单例
export default class LocalDb {
	userId = null
	//获取单个实例
	static getInstance() {
		if (!this.instance) {
			// 创建数据库实例
			this.instance = new LocalDb();
		}
		return this.instance;
	}
	//构造函数方法
	constructor() {
		console.info("初始化数据库实例");
	}
	// 初始化数据库
	initDb(userId) {
		console.info("初始化数据库内容:" + userId);
		this.userId = userId
		// 尝试创建表，不存在则创建
		let sessionTable =
			'create table if not exists tab_session( id CHAR(100) PRIMARY KEY, userId CHAR(50), alias CHAR(100), atTime TEXT, createTime TEXT, headUrl BLOB, isAtMe CHAR(5), isTip CHAR(5), lastMessage TEXT, lastName CHAR(100), name CHAR(100), groupName CHAR(100), sex CHAR(2), sort INTEGER, top CHAR(5), unreadMessageCount INTEGER, jid CHAR(100) NOT NULL, channelType  CHAR(2), channelId CHAR(100) NOT NULL, ext1 CHAR(256), ext2 CHAR(256), ext3 CHAR(256), ext4 CHAR(256), ext5 CHAR(256))'
		let messageTable =
			'create table if not exists tab_message( id CHAR(100) PRIMARY KEY, signId CHAR(200) NOT NULL, channelId CHAR(100) NOT NULL, channelType CHAR(2), content TEXT, createTime TEXT, fileType CHAR(20), senderId CHAR(100), receive CHAR(100), user CHAR(20),chatType CHAR(10),isRead CHAR(5),readCount INTEGER DEFAULT 0,ext1 CHAR(256), ext2 CHAR(256), ext3 CHAR(256), ext4 CHAR(256), ext5 CHAR(256))'
		// 尝试openDB打开文件来创建
		return new Promise((resolve, reject) => { 
			try {
				this.openDB().then(() => {
					console.log('尝试创建会话表')
					return this.extExecuteSQL(sessionTable)
				}).then(() => {
					// 尝试创建聊天记录表
					console.log('尝试创建聊天记录表')
					return this.extExecuteSQL(messageTable)
				}).then(() => {
					console.log('初始化完成')
					resolve()
					// this.closeDB()
				}).catch(err => {
					console.log('初始化失败')
					// this.closeDB()
					reject()
				})
			} catch (e) {
				//TODO handle the exception
				console.log(JSON.stringify(e))
				this.closeDB()
				reject()
			}
		})
	}
	// 自己控制打开数据库
	extExecuteSQL(execSql) {
		return new Promise((resolve, reject) => {
			plus.sqlite.executeSql({
				name: 'syntoChat',
				sql: execSql,
				success: (e) => {
					console.log(JSON.stringify(e))
					resolve(e)
				},
				fail: (e) => {
					console.log(JSON.stringify(e))
					reject(e)
				}
			});
		})
	}

	// 打开数据库
	openDB() {
		console.log('打开数据库: ' + this.userId);
		return new Promise((resolve, reject) => {
			// 如果打开则跳过
			let isOpen = plus.sqlite.isOpenDatabase({
				name: 'syntoChat',
				path: '_doc/db/chat_' + this.userId + '.db'
			})
			console.log("是否已打开数据库：" + isOpen);
			if (!isOpen) {
				plus.sqlite.openDatabase({
					name: 'syntoChat',
					path: '_doc/db/chat_' + this.userId + '.db',
					success: function(e) {
						console.log("打开成功" + JSON.stringify(e));
						resolve(e)
					},
					fail: function(e) {
						console.log("打开失败" + JSON.stringify(e));
						reject(e)
					}
				})
			} else {
				resolve()
			}
		})
	}

	// 关闭数据库
	closeDB() {
		return new Promise((resolve, reject) => {
			console.log('关闭数据库: ');
			let isOpen = plus.sqlite.isOpenDatabase({
				name: 'syntoChat',
				path: '_doc/db/chat_' + this.userId + '.db'
			})
			if (isOpen) {
				plus.sqlite.closeDatabase({
					name: 'syntoChat',
					success: function(e) {
						console.log(JSON.stringify(e));
						resolve(e)
					},
					fail: function(e) {
						console.log(JSON.stringify(e));
						reject(e)
					}
				})
			}

		})


	}

	// 事务操作 begin（开始事务）、commit（提交）、rollback（回滚）
	transactionDB(transOpera) {
		return new Promise((resolve, reject) => {
			plus.sqlite.transaction({
				name: 'syntoChat',
				operation: transOpera,
				success: function(e) {
					console.log(JSON.stringify(e));
					resolve(e)
				},
				fail: function(e) {
					console.log(JSON.stringify(e));
					reject(e)
				}
			})
		})
	}

	// 执行SQL语句
	// create table if not exists database("where" CHAR(110),"location" CHAR(100),"age" INT(11))
	executeSQL(execSql) {
		return new Promise((resolve, reject) => {
			// this.openDB().then(() => {
				plus.sqlite.executeSql({
					name: 'syntoChat',
					sql: execSql,
					success: (e) => {
						console.log(JSON.stringify(e))
						// this.closeDB()
						resolve(e)
					},
					fail: (e) => {
						console.log(JSON.stringify(e))
						// this.closeDB()
						reject(e)
					}
				});
// 			}).catch(err => {
// 				reject(err)
// 				this.closeDB()
// 			})
		})
	}

	// 查询SQL语句
	selectSQL(searchSql) {
		return new Promise((resolve, reject) => {
			// this.openDB().then(() => {
				plus.sqlite.selectSql({
					name: 'syntoChat',
					sql: searchSql,
					success: (e) => {
						// console.log(JSON.stringify(e));
						// this.closeDB()
						resolve(e)
					},
					fail: (e) => {
						console.log(JSON.stringify(e));
						// this.closeDB()
						reject(e)
					}
				});
// 			}).catch(err => {
// 				reject(err)
// 				this.closeDB()
// 			})
		})
	}
}

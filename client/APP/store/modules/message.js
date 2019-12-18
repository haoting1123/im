import {
	sendPrivateMessage,
	sendGroupChatMessage,
	privateMessageListener,
	registerEventKey,
	listMessage,
	saveMessage,
	uploadFileMessage,
	removeMessageAll,
	qtMessagePlay,
	qtBackupsMessage,
	uploadImgFile,
	sendGroupOtherMessage,
	sendOtherMessage,
	getRemoteAreaInfo,
	resetRemoteMessageArea,
	resetRemoteFileArea
} from '@/api/message'
import {
	insertMessage,
	getMessageByPageData,
	getMessageByChannelIdLastOne,
	updateMessage,
	deleteMessageById,
	deleteMessageBychannelId,
	deleteAllMessage,
	getMessageByChannelId,
	deleteMessageBySignId,
	deleteMessageByChatType,
	updateMessageIsRead,
	updateMessageIsReadBySignId,
	getMessageByHistorySearch
} from '@/db/messagge'
import {
	getSessionByChannelId,
	getSessionListByContentLike
} from '@/db/session'
import {
	convertFriendlyTime
} from '../../common/util.js'
const xss = require('xss')

const message = {
	state: {
		avatarUrl: '',
		imClient: null,
		currentChannelId: '',
		currentChannel: null,
		homeWindowHeight: '',
		homeContentWidth: '',
		msgChannelListHeight: '',
		qunChannelInfoHeight: '',
		qunChannelInfoWidth: '',
		groupUserListHeight: '',
		noticeNew: '',
		sendFileSuffix: 'ofd',
		sendFileSize: '10',
		msgFontSize: 13,
		clientGUID: '',
		messageList: [],
		historyMessageList: [],
		isPlayAudio: '', // 用来控制声音播放是否被占用
		isPlaySound: false, // 用来控制全局是否播放声音
		sendHotKey: true, // Enter发送为true, Ctrl+Enter发送为false
		isNewMessage: 0, //收到消息的提醒
		messageChatType:'',
		isNewVideoMessage: '', // 收到语音消息和视频消息
		// 撤回消息的人员id
		recallMessageMember: '',
		recallMessageType: 'P',
		recallMessageGroup: '',
		recallMessageSignid: '',
		closeVideoMessage: '',
		closeVideoMessageList: '',
		currentVideoChannelId: '',
		remoteUseArea: {}, // 服务端文件占用情况
		searchCurrentChannel: null, // 搜索消息
	},
	mutations: {
		SET_REMOTE_USE_AREA: (state, data) => {
		  state.remoteUseArea = data
		},
		SET_SEARCH_CURRENT_CHANNEL: (state, data) => {
		  state.searchCurrentChannel = data
		},
		SET_MESSAGE_CHAT_TYPE: (state, data) => {
			state.messageChatType = data
		},
		SET_RECALL_MESSAGE_INFO: (state, data) => {
			// console.log(`重新赋值:${JSON.stringify(data)}`)
			state.recallMessageMember = {channelId: data.memberJid, timestamp: new Date().getTime()}
			state.recallMessageType = data.type
			state.recallMessageSignid = data.signId
			state.recallMessageGroup = data.groupJid
		},
		SET_NOTICE_NEW: (state, data) => {
			state.noticeNew = data
		},
		SET_IS_NEW_MESSAGE: (state, data) => {
			state.isNewMessage = data
		},
		SET_IS_NEW_VIDEO_MESSAGE: (state, data) => {
			state.isNewVideoMessage = data
		},
		SET_CLOSE_VIDEO_MESSAGE: (state, data) => {
			state.closeVideoMessage = data
		},
		// 实时会话更新单条
		UPDATE_MESSAGE_LIST_ONCE: (state, signId) => {
			// console.log(`state.messageList.length:${state.messageList.length}`)
			state.messageList.find(item => {
				if (signId === item.signId) {
					item.isRead = 'yes'
				}
			})
		},
		UPDATE_MESSAGE_LIST_ALL: (state) => {
			// console.log('更新啦啦啦')
			state.messageList.forEach(item => {
				if(!item.isRead || item.isRead === 'undefined' || item.isRead === 'no'){
					// console.log(JSON.stringify(item))
					item.isRead = 'yes'
				}
			})
		},
		SET_CLOSE_VIDEO_MESSAGE_LIST: (state, data) => {
			state.closeVideoMessageList = data
		},
		SET_CURRENT_VIDEO_CHANNELID: (state, data) => {
			state.currentVideoChannelId = data
		},

		// 替换数组对象
		REPLACE_MESSAGE_ITEM: (state, data) => {
			let index = state.messageList.findIndex(item => item.id === data.id)
			if (index > -1) {
				state.messageList.splice(index, 1, data)
			}
		},
		SET_SEND_HOT_KEY: (state, data) => {
			state.sendHotKey = data
		},
		SET_AVATAR_URL: (state, data) => {
			state.avatarUrl = data
		},
		SET_IM_CLIENT: (state, data) => {
			state.imClient = data
		},
		SET_CURRENT_CHANNEL_ID: (state, data) => {
			state.currentChannelId = data
		},
		SET_CURRENT_CHANNEL: (state, data) => {
			console.log(`当前会话:${JSON.stringify(data)}`)
			state.currentChannel = data
		},
		SET_IS_PLAY_AUDIO: (state, data) => {
			state.isPlayAudio = data
		},
		SET_IS_PLAY_SOUND: (state, data) => {
			state.isPlaySound = data
		},
		SET_HOME_WINDOW_HEIGHT: (state, data) => {
			state.homeWindowHeight = data
		},
		SET_HOME_CONTENT_WIDTH: (state, data) => {
			state.homeContentWidth = data
		},
		SET_MSG_CHANNEL_LIST_HEIGHT: (state, data) => {
			state.msgChannelListHeight = data
		},
		SET_QUN_CHANNEL_INFO_HEIGHT: (state, data) => {
			state.qunChannelInfoHeight = data
		},
		SET_QUN_CHANNEL_INFO_WIDTH: (state, data) => {
			state.qunChannelInfoWidth = data
		},
		SET_GROUP_USER_LIST_HEIGHT: (state, data) => {
			state.groupUserListHeight = data
		},
		SET_SEND_FILE_SUFFIX: (state, data) => {
			state.sendFileSuffix = data
		},
		SET_SEND_FILE_SIZE: (state, data) => {
			state.sendFileSize = data
		},
		SET_MSG_FONT_SIZE: (state, data) => {
			state.msgFontSize = data
		},
		CLIENT_GUID: (state, data) => {
			state.clientGUID = data
		},
		SET_MESSAGE_LIST: (state, data) => {
			state.messageList = data
		},
		PUSH_MESSAGE_LIST: (state, data) => {
			state.messageList.push(data)
		},
		// 把传入的数组追加到数组头部
		APPEND_FRONT_MESSAGE_LIST: (state, data) => {
			state.messageList = [...data, ...state.messageList]
		},
		DELETE_MESSAGE_BY_SIGNID: (state, signId) => {
			let index = state.messageList.findIndex(item => item.signId === signId)
			if (index > -1) {
				state.messageList.splice(index, 1)
			}
		},
		DELETE_MESSAGE_BY_ID: (state, messageId) => {
			let index = state.messageList.findIndex(item => item.id === messageId)
			if (index > -1) {
				state.messageList.splice(index, 1)
			}
		},
		CLEAR_MESSAGE_LIST: (state) => {
			state.messageList = []
		},
		SET_HISTORY_MESSAGE_LIST: (state, data) => {
			state.historyMessageList = data
		},
		PUSH_HISTORY_MESSAGE_LIST: (state, data) => {
			state.historyMessageList.push(data)
		},
		APPEND_HISTORY_MESSAGE_LIST: (state, data) => {
			state.historyMessageList = [...state.historyMessageList, ...data]
		},
		DELETE_HISTORY_MESSAGE_BY_ID: (state, messageId) => {
			let index = state.historyMessageList.findIndex(item => item.id === messageId)
			if (index > -1) {
				state.historyMessageList.splice(index, 1)
			}
		},
		CLEAR_HISTORY_MESSAGE_LIST: (state) => {
			state.historyMessageList = []
		}
	},
	actions: {
		sendPrivateMessage({
			commit
		}, data) {
			return new Promise((resolve, reject) => {
				sendPrivateMessage(data).then(data => {
					resolve(data)
				}).catch(error => {
					reject(error)
				})
			})
		},
		sendGroupChatMessage({
			commit
		}, data) {
			return new Promise((resolve, reject) => {
				sendGroupChatMessage(data).then(data => {
					resolve(data)
				}).catch(error => {
					reject(error)
				})
			})
		},
		privateMessageListener({
			commit
		}, jid, listener) {
			return new Promise((resolve, reject) => {
				privateMessageListener(jid, listener).then(data => {
					resolve(data)
				}).catch(error => {
					reject(error)
				})
			})
		},
		registerEventKey({
			commit
		}, eventKey) {
			return new Promise((resolve, reject) => {
				registerEventKey(eventKey).then(data => {
					resolve(data)
				}).catch(error => {
					reject(error)
				})
			})
		},
		listMessage({
			commit
		}, channelId, maxCreateAt, limit, searchMsg) {
			return new Promise((resolve, reject) => {
				listMessage(channelId, maxCreateAt, limit, searchMsg).then(data => {
					resolve(data)
				}).catch(error => {
					reject(error)
				})
			})
		},
        getRemoteAreaInfo ({commit}, userName) {
          return new Promise((resolve, reject) => {
            // 获取当前用户文件区域信息
            getRemoteAreaInfo(userName).then(data => {
              commit('SET_REMOTE_USE_AREA', data)
              resolve(data)
            })
          })
        },
        resetRemoteMessageArea ({commit}, userName) {
          return new Promise((resolve, reject) => {
            // 重置服务端的聊天区域
            resetRemoteMessageArea(userName).then(data => {
              resolve(data)
            })
          })
        },
        resetRemoteFileArea ({commit}, userName) {
          return new Promise((resolve, reject) => {
            // 重置服务端的文件区域
            resetRemoteFileArea(userName).then(data => {
              resolve(data)
            })
          })
        },
		// 更新消息
		updateMessage({
			commit,
			rootState
		}, {
			messageObj
		}) {
			return new Promise((resolve, reject) => {
				updateMessage(messageObj.id, messageObj).then(data => {
					commit('REPLACE_MESSAGE_ITEM', messageObj)
					resolve(messageObj)
				})
			})
		},
		saveMessage({
			dispatch,
			commit,
			rootState
		}, messageData) {
			messageData.status = 'no' // no：未发送 success：发送成功 fail：发送失败
			messageData.user = 'customer'
			messageData.isRead = 'no'
			// 先在页面显示，后台插入数据库和发送网络数据
			if (messageData.fileType) {
				if (messageData.fileType === 'file' || messageData.fileType === 'aac') {
					messageData.fileInfo = JSON.parse(messageData.content);
				}
			}
			// 生成全局ID
			let randId = Math.floor(Math.random() * 900) + 100
			messageData.id = new Date().getTime() + '' + randId
			let timeDifference = uni.getStorageSync('global_time_difference')
			// 计算服务器的时间差
			if(timeDifference){
				messageData.createTime = (messageData.createTime - parseInt(timeDifference))
			}
			messageData.createTimeStr = convertFriendlyTime(messageData.createTime)
			messageData.signId = messageData.senderId + messageData.id
			commit('PUSH_MESSAGE_LIST', messageData)
			//如果是普通聊天才进行入库保存，加密聊天不保存数据
			if (!messageData.chatType  || messageData.chatType === 'normalChat') {
				insertMessage(messageData).then(data => {
					if (data) {
						// console.log('成功插入：' + JSON.stringify(data))
					} else {
						console.log('插入数据失败')
					}
				})
			}

			// 更新会话列表
			let resp = rootState.session.sessionList.find(element => {
				return element.channelId === messageData.channelId
			})
			let lastMessage = messageData.content
			if (messageData.fileType) {
				if (messageData.fileType === 'file') {
					lastMessage = '[文件]'
				} else if (messageData.fileType === 'img') {
					lastMessage = '[图片]'
				} else if (messageData.fileType === 'aac') {
					lastMessage = '[语音]'
				} else if (messageData.fileType === 'position') {
					lastMessage = '[位置共享]'
				} else if (messageData.fileType === 'vcard') {
					lastMessage = '[个人名片]'
				}
			}
			if(messageData.chatType === 'secretChat'){
				lastMessage = ''
			}
			let html = xss(lastMessage, {
			  whiteList: [], // 白名单为空，表示过滤所有标签
			  stripIgnoreTag: true, // 过滤所有非白名单标签的HTML
			  stripIgnoreTagBody: ['script'] // script标签较特殊，需要过滤标签中间的内容
			})
			// console.log('html' + html)
			if (resp) {
				// console.log('存在会话：' + JSON.stringify(resp))
				// 当前会话是否被打开，如果被打开则为0
				resp.unreadMessageCount = 0

				resp.lastMessage = html
				resp.lastName = rootState.home.userInfo.name
				resp.createTime = messageData.createTime
				dispatch('updateSession', {
					sessionObj: resp
				}, {
					root: true
				})
			} else {
				// 新增 批量发送的时候会走此逻辑
				dispatch('addNewSession', {
					jid: messageData.channelId,
					lastMessage: html,
					createTime: messageData.createTime,
					unreadMessageCount: 0,
					channelType: messageData.channelType,
					lastName: rootState.home.userInfo.name,
					isAtMe: 'no',
					atTime: ''
				}, {
					root: true
				})
			}
			// 发送xmpp
			dispatch('sendXMPPMessage', messageData)

		},
		sendXMPPMessage({
			commit
		}, messageData) {
			return new Promise((resolve, reject) => {
				saveMessage(messageData).then(data => {
					// TODO 发送成功后更新发送状态
					// commit('PUSH_MESSAGE_LIST', messageData)
					resolve(data)
				}).catch(error => {
					reject(error)
					// TODO 发送失败后更新为失败状态
				})
			})
		},
		// 消息回执
		MessageReceipt ({ dispatch, rootState }, { senderId, signId }) {
			let obj = {
				channelId: rootState.home.userInfo.jid,
				senderId: senderId,
				signId: signId,
				readTime: Date.now()
			}
			dispatch('sendOtherMessage', {
				to: senderId,
				content: JSON.stringify(obj),
				type: 'MESSAGE_RECEIPT'
			})
		},
		// 群消息回执
		GroupMessageReceipt ({ dispatch, rootState }, { channelId, signId }) {
			let obj = {
				channelId: channelId,
				signId: signId,
			}
			dispatch('sendGroupOtherMessage', {
				to: channelId,
				content: JSON.stringify(obj),
				type: 'GROUP_MESSAGE_RECEIPT'
			})
		},
		receiveMessage({
			state,
			dispatch,
			commit,
			rootState
		}, data) {
			console.log('收到消息' + JSON.stringify(data))
			let msgType = data.type // 消息类型
			let fileType = data.fileType // 文件类型
			let insertTime = data.createTime
			if (!insertTime) {
				insertTime = new Date().getTime() // 插入时间
				let timeDifference = uni.getStorageSync('global_time_difference')
				// 计算服务器的时间差
				if(timeDifference){
					insertTime = (insertTime - parseInt(timeDifference))
				}
			} else {
				insertTime = parseInt(insertTime)
			}
			let signId = data.signId
			let chatType = data.chatType
			let isAtMe = '' // 是否有人@我
			let atTime = '' // @我的消息时间戳，用来定位消息
			if (data.delay) {
				if (msgType === 'G') {
					insertTime = data.delay
				} else {
					insertTime = new Date(data.delay).getTime()
				}
				// console.log('收到离线消息' + insertTime)
			}
			const newMessage = {
				channelId: data.from,
				channelType: msgType,
				content: data.message.replace(new RegExp('\\n', 'gm'), '<br />'),
				senderId: data.from,
				receive: 'me',
				createTime: insertTime,
				user: 'home',
				signId: signId,
				chatType: chatType
			}
			if (fileType) {
				newMessage.fileType = fileType
				// 				if (fileType === 'file') {
				// 					newMessage.fileInfo = JSON.parse(newMessage.content)
				// 				}
			} else {
				newMessage.fileType = ''
			}
			if (msgType === 'G') {
				// 群不存在则忽略消息
				let groupList = rootState.group.groupList
				// console.log(friendList)
				if (groupList && groupList.length > 0) {
					let group = groupList.find((value, index, arr) => {
						return value.jid === data.from
					})
					if (!group) {
						console.log('当前群不存在，消息忽略')
						return
					}
				}
				newMessage.senderId = data.sender
				 console.log(state.currentChannelId +'------------' + data.from)
				// 正在聊天中不提示@信息
				if (!state.currentChannelId || state.currentChannelId !== data.from) {
					// 处理消息是否有人@我
					let userName = rootState.home.userInfo.name
					// console.log(userName, isAtMe)
					let atIndex = newMessage.content.indexOf('@' + userName)
					if (atIndex > -1) {
						isAtMe = 'yes'
						// 记录@我的位置
						uni.setStorageSync('mes_at_' + data.from, 'yes')
						uni.setStorageSync('mes_atTime_' + data.from, insertTime)
					}
				}
			}
			let randId = Math.floor(Math.random() * 900) + 100
			newMessage.id = new Date().getTime() + '' + randId
			if (state.currentChannelId && state.currentChannelId === newMessage.channelId) {
				newMessage.isRead = 'yes'
				if (msgType === 'P') {
					// 发送消息回执(单个人)
					dispatch('MessageReceipt', {
						senderId: data.from,
						signId: signId
					})
				} else {
					// 发送回执消息(群组)
					dispatch('GroupMessageReceipt', {
						channelId: state.currentChannelId,
						signId: signId,
					})
				}
				newMessage.createTimeStr = convertFriendlyTime(newMessage.createTime)
				commit('PUSH_MESSAGE_LIST', newMessage)
				commit('SET_IS_NEW_MESSAGE', Math.random())
			}

			// 增加信息列表
			insertMessage(newMessage).then(data => {
				if (data) {
					console.log('插入数据成功')
				} else {
					console.log('插入数据失败')
				}
			})
			// 开始处理会话部分
			let isTip = 'yes' // 当前会话是否需要提醒
			let lastMessage = newMessage.content
			if (newMessage.fileType) {
				if (newMessage.fileType === 'file') {
					lastMessage = '[文件]'
				} else if (newMessage.fileType === 'img') {
					lastMessage = '[图片]'
				} else if (newMessage.fileType === 'aac') {
					lastMessage = '[语音]'
				} else if (newMessage.fileType === 'position') {
					lastMessage = '[位置共享]'
				} else if (newMessage.fileType === 'vcard') {
					lastMessage = '[个人名片]'
				}else{

				}
			}

			if(chatType === 'secretChat'){
				lastMessage = '[密聊]'
			}

			// 最后消息过滤HTML信息
			let html = xss(lastMessage, {
							whiteList: [], // 白名单为空，表示过滤所有标签
							stripIgnoreTag: true, // 过滤所有非白名单标签的HTML
							stripIgnoreTagBody: ['script'] // script标签较特殊，需要过滤标签中间的内容
			})
			lastMessage = html
			lastMessage = lastMessage.replace(/&nbsp;/gi,'')
			lastMessage = lastMessage.replace(/&apos;/gi,'')
			let resp = null
			// 离线走这里
			if(data.delay){
				// 同步查询会话是否存在
				let sessionList = rootState.session.sessionList;
				// 同步 不存在则插入
				if(sessionList && sessionList.length > 0){
					resp = sessionList.find(item => {
						return item.channelId === data.from
					})
				}
				if (resp) {
					console.log('存在会话')
					// 当前会话是否被打开，如果被打开则为0
					if (state.currentChannelId && state.currentChannelId === resp.jid) {
						resp.unreadMessageCount = 0
					} else {
						// 用来记录第一条未读消息的位置
						if (resp.unreadMessageCount === 0) {
							uni.setStorageSync('mes_noReadAt_' + resp.jid, insertTime)
						}
						resp.unreadMessageCount += 1
					}
					if (isAtMe) {
						resp.isAtMe = isAtMe
					}
					resp.lastMessage = lastMessage
					resp.createTime = insertTime
					isTip = (resp.isTip ? resp.isTip : 'yes')
					if (msgType === 'G') {
						resp.lastName = data.sender
					}
					console.log('resp', resp)
					dispatch('updateSession', {
						sessionObj: resp
					}, {
						root: true
					})
				} else {
					// 新增
					dispatch('addNewSession', {
						jid: data.from,
						lastMessage: lastMessage,
						createTime: insertTime,
						unreadMessageCount: 1,
						channelType: msgType,
						lastName: (data.sender ? data.sender : ''),
						isAtMe: isAtMe,
						atTime: atTime
					}, {
						root: true
					})
				}
				// 是否进行声音闪烁 离线消息不进行提示 @自己都提示
				if ((!state.currentChannelId || state.currentChannelId !== data.from) && ((!data.delay && isTip === 'yes' && !
						state.isPlaySound) || isAtMe === 'yes')) {
					// 播放声音\震动
					let data = {
						type:'message',
						value:true
					}
					commit('SET_IS_PLAY_AUDIO', data)
				}

			}else{
				// 不离线走这里
				// 更新会话列表
				getSessionByChannelId(data.from).then(response => {
					// console.log(JSON.stringify(response))
					if (response && response.length > 0) {
						resp = response[0] // 获取第一条
					}

					// 是否存在会话，不存在则插入，存在则更新
					if (resp) {
						console.log('存在会话')
						// 当前会话是否被打开，如果被打开则为0
						if (state.currentChannelId && state.currentChannelId === resp.jid) {
							resp.unreadMessageCount = 0
						} else {
							// 用来记录第一条未读消息的位置
							if (resp.unreadMessageCount === 0) {
								uni.setStorageSync('mes_noReadAt_' + resp.jid, insertTime)
							}
							resp.unreadMessageCount += 1
						}
						if (isAtMe) {
							resp.isAtMe = isAtMe
						}
						resp.lastMessage = lastMessage
						resp.createTime = insertTime
						isTip = (resp.isTip ? resp.isTip : 'yes')
						if (msgType === 'G') {
							resp.lastName = data.sender
						}
						console.log('resp', resp)
						dispatch('updateSession', {
							sessionObj: resp
						}, {
							root: true
						})
					} else {
						// 新增
						dispatch('addNewSession', {
							jid: data.from,
							lastMessage: lastMessage,
							createTime: insertTime,
							unreadMessageCount: 1,
							channelType: msgType,
							lastName: (data.sender ? data.sender : ''),
							isAtMe: isAtMe,
							atTime: atTime
						}, {
							root: true
						})
					}
					// 是否进行声音闪烁 离线消息不进行提示 @自己都提示
					if ((!state.currentChannelId || state.currentChannelId !== data.from) && ((!data.delay && isTip === 'yes' && !
							state.isPlaySound) || isAtMe === 'yes')) {
						// 播放声音\震动
						let data = {
							type:'message',
							value:true
						}
						commit('SET_IS_PLAY_AUDIO', data)
					}
				})
			}
		},
		uploadFileMessage({
			commit
		}, data, headers) {
			return new Promise((resolve, reject) => {
				uploadFileMessage(data, headers).then(data => {
					resolve(data)
				}).catch(error => {
					reject(error)
				})
			})
		},
		// 删除单条消息
		removeMessageByDb({
			commit
		}, messageId) {
			deleteMessageById(messageId).then(data => {
				commit('DELETE_MESSAGE_BY_ID', messageId)
				commit('DELETE_HISTORY_MESSAGE_BY_ID', messageId)
			})
		},
		// 清空单个会话消息数据
		removeMessageByDbSessionId({
			commit
		}, sessionId) {
			// console.log('清空单个会话消息数据')
			return new Promise((resolve, reject) => {
				deleteMessageBychannelId(sessionId).then(data => {
					console.log('清空消息记录')
					resolve()
					commit('CLEAR_HISTORY_MESSAGE_LIST')
					commit('CLEAR_MESSAGE_LIST')
				})
			})
		},
		// 清空所有消息数据
		removeAllMessageByDb({
			commit
		}) {
			deleteAllMessage().then(data => {
				commit('CLEAR_HISTORY_MESSAGE_LIST')
				commit('CLEAR_MESSAGE_LIST')
			})
		},
		removeMessageAll({
			commit
		}, channelId) {
			return new Promise((resolve, reject) => {
				removeMessageAll(channelId).then(data => {
					resolve(data)
				}).catch(error => {
					reject(error)
				})
			})
		},
		getAllMessage({
			dispatch,
			commit,
			rootState
		}, {
			channelId,
			maxCreateAt,
			limit,
			maxStartAt
		}) {
			return new Promise((resolve, reject) => {
				// 获取当前消息列表的第一页
				// console.log(channelId, maxCreateAt, limit, maxStartAt)
				getMessageByPageData(channelId, maxCreateAt, limit, null, maxStartAt).then(data => {
					if (data && data.length > 0) {
						let retMessageList = data.reverse()
						if (retMessageList && retMessageList.length > 0) {
							// console.log(`retMessageList:${JSON.stringify(retMessageList)}`)
							retMessageList.forEach(item => {
								item.createTimeStr = convertFriendlyTime(item.createTime)
								if ((item.isRead === 'no' || item.isRead === 'undefined') && item.senderId !== rootState.home.userInfo.jid) {
									// console.log(`++:${item.senderId + rootState.home.xmppDomain}`)
									dispatch('updateMessageIsReadToGroupBySignId', {
										channelId: channelId,
										signId: item.signId
									})
										.then(() => {
											let obj = {
												channelId: channelId,
												signId: item.signId
											}
											dispatch('sendGroupOtherMessage', {
												to: channelId,
												content: JSON.stringify(obj),
												type: 'GROUP_MESSAGE_RECEIPT'
											})
										})
								}
							})
						}
						if (maxCreateAt && maxCreateAt > 0) {
							commit('APPEND_FRONT_MESSAGE_LIST', retMessageList)
						} else {
							commit('SET_MESSAGE_LIST', retMessageList)
						}
						resolve(retMessageList)
					} else {
						resolve()
					}
				})
			})
		},
		getAllHistoryMessage({
			commit
		}, {
			channelId,
			maxCreateAt,
			limit,
			content
		}) {
			return new Promise((resolve, reject) => {
				getMessageByPageData(channelId, maxCreateAt, limit, content).then(data => {
					if (data && data.length > 0) {
						let retMessageList = data
						if (maxCreateAt && maxCreateAt > 0) {
							commit('APPEND_HISTORY_MESSAGE_LIST', retMessageList)
						} else {
							commit('SET_HISTORY_MESSAGE_LIST', retMessageList)
						}
						resolve(retMessageList)
					} else {
						resolve()
					}
				})
			})
		},
		getAllHistoryMessageBySearchKey({
			commit
		}, {
			channelId,
			maxCreateAt,
			limit,
			content
		}) {
			return new Promise((resolve, reject) => {
				getMessageByHistorySearch(channelId, maxCreateAt).then(data => {
					if (data && data.length > 0) {
						let retMessageList = data
						commit('SET_HISTORY_MESSAGE_LIST', retMessageList)
						resolve(retMessageList)
					} else {
						resolve()
					}
				})
			})
		},
		qtMessagePlay({
			commit
		}) {
			return new Promise((resolve, reject) => {
				qtMessagePlay().then(data => {
					resolve(data)
				}).catch(error => {
					reject(error)
				})
			})
		},
		qtBackupsMessage({
			commit
		}, exportPath, content) {
			return new Promise((resolve, reject) => {
				qtBackupsMessage(exportPath, content).then(data => {
					resolve(data)
				}).catch(error => {
					reject(error)
				})
			})
		},
		getAllMessageNoLimit({
			commit
		}, {
			channelId
		}) {
			return new Promise((resolve, reject) => {
				getMessageByChannelId(channelId).then(data => {
					resolve(data)
				})
			})
		},
		sendOtherMessage({
			commit
		}, messageData) {
			return new Promise((resolve, reject) => {
				sendOtherMessage(messageData).then(() => {
					resolve()
				}).catch(error => {
					reject(error)
				})
			})
		},
		sendGroupOtherMessage({
			commit
		}, messageData) {
			return new Promise((resolve, reject) => {
				sendGroupOtherMessage(messageData).then(() => {
					resolve()
				}).catch(error => {
					reject(error)
				})
			})
		},
		// 处理其他提醒消息
		receiveOtherMessage({
			state,
			dispatch,
			commit,
			rootState
		}, data) {
			// console.log(`接收到其他消息了:${JSON.stringify(data)}`)
			let jid = data.from // JID
			let messageType = data.messageType // 消息类型
			if (messageType === 'VIDEO_CONNECT') {
				// 视频连接请求
				commit('SET_IS_NEW_VIDEO_MESSAGE',data.message)
			}else if(messageType === 'AUDIO_CONNECT'){
				// 语音连接请求
				commit('SET_IS_NEW_VIDEO_MESSAGE',data.message)
			}else if(messageType === 'MEMBER_QUIT_MEIDA_MEET'){
				// 视频断开连接请求  判断当前正在视频的会话ID，防止其他回话干扰
				if(data.message){
					let closeData = JSON.parse(data.message)
					// console.log('视频断开连接请求:'+state.currentVideoChannelId + '//' + closeData.channelId)
					if(!state.currentVideoChannelId || closeData.channelId === state.currentVideoChannelId){
						// let busiType = uni.getStorageSync("videoBusyType");
						// console.log(busiType)
					// 	if(busiType === '1'){
							commit('SET_CLOSE_VIDEO_MESSAGE',closeData)
						// }else if(busiType === '2'){
							commit('SET_CLOSE_VIDEO_MESSAGE_LIST',closeData)
						// }
					}
				}
			}else if(messageType === 'MEMBER_QUIT_MEIDA_MEET'){
				// 语音断开连接请求  判断当前正在视频的会话ID，防止其他回话干扰
				
				if(data.message){
					let closeData = JSON.parse(data.message)
					// uni.showToast({
					// 	title: data.message,
					// 	icon: 'none',
					// 	duration: 10000
					// });
					// console.log('语音断开连接请求:'+state.currentVideoChannelId + '//' + closeData.channelId)
					if(!state.currentVideoChannelId || closeData.channelId === state.currentVideoChannelId){
						// let busiType = uni.getStorageSync("videoBusyType");
						// console.log(busiType)
						// if(busiType === '1'){
							commit('SET_CLOSE_VIDEO_MESSAGE',closeData)
						// }else if(busiType === '2'){
							commit('SET_CLOSE_VIDEO_MESSAGE_LIST',closeData)
						// }
					}
				}

			}else if(messageType === 'RECALL_MESSAGE') {
				// console.log(`接收到消息撤回通知:${JSON.stringify(data.message)}`)
				let body = JSON.parse(data.message)
				dispatch('RecallMessage', {
					channelId: data.from,
					signId: body.signId
				})
				.then(() => {
					commit('SET_RECALL_MESSAGE_INFO', {
						memberJid: data.from,
						type: data.type,
						signId: body.signId,
						groupJid: body.groupJid
					})
					// 清空会话消息最后的消息内容
					
				})
				dispatch('resetSessionLastMessage', data.from, {root: true})
			}else if(messageType === 'MESSAGE_RECEIPT') {
				// 消息回执
				// console.log(`接收到消息回执:${data.message}`)
				dispatch('updateMessageIsReadByReadTime', JSON.parse(data.message))
			} else if (messageType === 'PORT_SYNC') {
        // console.log(JSON.parse(data.message))
        // 多端同步
        let body = JSON.parse(data.message)
        if (body.type === 'createGroup' || body.type === 'addMemberToGroup' || body.type === 'deleteMemberToGroup' || body.type === 'updateGroupInfo') {
          // console.log('多端消息同步')
          dispatch('getGroupInfoByRoomId', { roomJid: body.roomId })
        }
      }
			// TODO 处理其他消息类型
		},
		// 处理群的其他提醒消息
		receiveGroupOtherMessage({
			state,
			dispatch,
			commit,
			rootState
		}, data) {
			// console.log('接收到群的其他消息了', data)
			let jid = data.from // 群JID
			let messageType = data.messageType // 消息类型
			if (messageType === 'notice') {
				// 准备提示群公告了
				commit('SET_NOTICE_NEW', Math.random())
				// 存储
				uni.setStorageSync('notice_' + jid, data.message)
				console.log(jid)
			} else if (messageType === 'newMember') {
				// 有新成员加入群
				// dispatch('GetGroupMember', {
				// 	groupJid: jid,
				// 	userJid: rootState.home.userInfo.jid
				// })
				dispatch('getGroupInfoByRoomId', {
					roomJid: jid
				})
			} else if (messageType === 'RECALL_MESSAGE') {
				// 撤回消息
				// console.log(`接收到消息撤回通知:${JSON.stringify(data.message)}`)
				let body = JSON.parse(data.message)
				dispatch('RecallMessage', {
					channelId: data.from,
					signId: body.signId
				})
				.then(() => {
					commit('SET_RECALL_MESSAGE_INFO', {
						memberJid: body.memberJid,
						type: data.type,
						signId: body.signId,
						groupJid: body.groupJid
					})
					// 清空会话消息最后的消息内容
					
				})
				dispatch('resetSessionLastMessage', data.from, {root: true})
			} else if (messageType === 'GROUP_NOTICE') {
				console.log(`新的群公告来啦`)
				commit('SET_GROUP_NOTICE_ID', JSON.parse(data.message))
			}else if (messageType === 'VIDEO_CONNECT') {
				// 视频连接请求
				commit('SET_IS_NEW_VIDEO_MESSAGE',data.message)
			}else if(messageType === 'AUDIO_CONNECT'){
				// 语音连接请求
				commit('SET_IS_NEW_VIDEO_MESSAGE',data.message)
			}
			// else if(messageType === 'VIDEO_DISCONNECT'){
			// 	// 视频断开连接请求  判断当前正在视频的会话ID，防止其他回话干扰
			// 	console.log('语音断开连接请求:'+state.currentVideoChannelId + '//' + jid)
			// 	if(data.message){
			// 		let closeData = JSON.parse(data.message)
			// 		// if(!state.currentVideoChannelId || closeData.channelId === state.currentVideoChannelId){
			// 		// 	let busiType = uni.getStorageSync("videoBusyType");
			// 		// 	if(busiType === '1'){
			// 				commit('SET_CLOSE_VIDEO_MESSAGE',closeData)
			// 			// }else if(busiType === '2'){
			// 				commit('SET_CLOSE_VIDEO_MESSAGE_LIST',closeData)
			// 			// }
			// 		// }
			// 	}
			// }else if(messageType === 'AUDIO_DISCONNECT'){
			// 	// 语音断开连接请求  判断当前正在视频的会话ID，防止其他回话干扰
			// 	console.log('语音断开连接请求:'+state.currentVideoChannelId + '//' + jid)
			// 	if(data.message){
			// 		let closeData = JSON.parse(data.message)
			// 		// if(!state.currentVideoChannelId || closeData.channelId === state.currentVideoChannelId){
			// 			// let busiType = uni.getStorageSync("videoBusyType");
			// 			// if(busiType === '1'){
			// 				commit('SET_CLOSE_VIDEO_MESSAGE',closeData)
			// 			// }else if(busiType === '2'){
			// 				commit('SET_CLOSE_VIDEO_MESSAGE_LIST',closeData)
			// 			// }
			// 		// }
			// 	}
			// }
			else if (messageType === 'GROUP_MESSAGE_RECEIPT') {
				console.log(`群消息回执:${data.message}`)
				dispatch('updateMessageIsReadToGroupBySignId', JSON.parse(data.message))
			} else if (messageType === 'UPDATE_GROUP_INFO') {
				console.log(`更新群组消息:${data.message}`)
				dispatch('getGroupInfoByRoomId', JSON.parse(data.message))
			}
		},
		// 获取当前会话最新的一条消息
		searchMessageByChannelId({
			commit
		}, channelId) {
			return new Promise((resolve, reject) => {
				getMessageByChannelIdLastOne(channelId).then(data => {
					resolve(data)
				})
			})
		},
		// 撤回消息
		RecallMessage ({ commit }, data) {
			return new Promise((resolve,reject) => {
				deleteMessageBySignId(data.channelId, data.signId)
					.then(() => {
						resolve()
					})
			})
		},
		//删除当前会话的密聊消息
		deleteMessageByChatType({
			commit, dispatch
		}, channelId) {
			return new Promise((resolve, reject) => {
				console.log('channelId:================================================='+channelId)
				deleteMessageByChatType(channelId,'secretChat').then(data => {
					dispatch('getSessionByJid',{channelId},{root: true}).then(resp => {
						if (resp.length > 0) {
							dispatch('lastMessageReset',resp[0].id,{root: true})
						}
					})
					resolve(data)
				})
			})
		},
		//更新当前消息已读状态
		updateMessageIsReadById({
			commit
		}, id) {
			return new Promise((resolve, reject) => {
				updateMessage(id,{isRead: 'yes'}).then(data => {
					resolve(data)
				})
			})
		},
		// 批量更新当前消息已读状态 senderId：当前登录用户的JID，channelId：要更新的会话channelId，readTime：小于等于此事件的消息都更新为已读
		updateMessageIsReadByReadTime({
			commit,
			rootState
		}, {senderId, channelId, readTime, signId}) {
			return new Promise((resolve, reject) => {
				updateMessageIsRead(senderId, channelId, readTime).then(data => {
					resolve(data)
					// 当前会话
					if (channelId !== rootState.message.currentChannelId) return
					if (signId) {
						commit('UPDATE_MESSAGE_LIST_ONCE', signId)
						return
					}
					commit('UPDATE_MESSAGE_LIST_ALL')

				})
			})
		},
		// 处理消息回执(群组)
		updateMessageIsReadToGroupBySignId({ commit, rootState }, { channelId, signId }) {
			return new Promise((resolve, reject) => {
				updateMessageIsReadBySignId(channelId, signId)
					.then(data => {
						resolve(data)
						// 当前会话
						if (channelId !== rootState.message.currentChannelId) return
						commit('UPDATE_MESSAGE_LIST_ONCE', signId)
					})
			})
		},
		//  查询消息搜索
		getSessionListByContentLike({ commit, rootState }, content) {
			return new Promise((resolve, reject) => {
				getSessionListByContentLike(content)
					.then(data => {
						// console.log('搜索结果：' + JSON.stringify(data))
						resolve(data)
					})
			})
		}
	}
}
export default message

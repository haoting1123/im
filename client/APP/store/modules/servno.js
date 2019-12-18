import {
	articleList,
	servnoList,
} from '../../api/servno'

const servno = {
	state: {
		list: [],
	},
	mutations: {
		SET_SERVNOLIST: (state, servno) => {
			state.list = servno
		}
	},
	actions: {
		GetServnoList({commit}, {groupCode, username}) {
			return new Promise((resolve, reject) => {
				servnoList(groupCode, username)
				.then(response => {
					commit('SET_SERVNOLIST', response)
				})
				.catch(err => reject(err))
			})
		},
		GetArticleList({commit}, servnoCode) {
			return new Promise((resolve, reject) => {
				articleList(servnoCode)
				.then(response=>resolve(response))
				.catch(err => reject(err))
			})
		}
	}
}

export default servno;

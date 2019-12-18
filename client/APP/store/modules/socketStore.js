

const state = {
    socketStore:'',
	currentChannelId:'',
	currentChannelMessage:{},
	sendChannelMessage:{},
	closeH5Message:{}
}

const getters = {

}

const mutations = {
    setSocketStore (state, data) {
        state.socketStore = data
    },
	setCurrentChannelId (state, data) {
		state.currentChannelId = data
	},
	setCurrentChannelMessage (state, data) {
		state.currentChannelMessage = data
	},
	setSendChannelMessage (state, data) {
		state.sendChannelMessage = data
	},
	setCloseH5Message (state, data) {
		state.closeH5Message = data
	},
}

const actions = {
    commitSocketStore:({ commit },data) => {
        commit('setSocketStore', data)
    },
	commitSocketStore:({ commit },data) => {
		commit('setCurrentChannelId', data)
	},
	commitSocketStore:({ commit },data) => {
		commit('setCurrentChannelMessage', data)
	},
	commitSocketStore:({ commit },data) => {
		commit('setSendChannelMessage', data)
	},
	commitSocketStore:({ commit },data) => {
		commit('setCloseH5Message', data)
	},
}

export default  {
    state,
    mutations,
    actions
}
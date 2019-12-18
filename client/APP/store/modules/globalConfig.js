

const state = {
    hostUrl:'',
	socketHostUrl:''
}

const mutations = {
    setHostUrl (state, data) {
        state.hostUrl = data
    },
	setSocketHostUrl (state, data) {
		state.socketHostUrl = data
	},
}

const actions = {
    commitHostUrl:({ commit },data) => {
        commit('setHostUrl', data)
    },
	commitSocketHostUrl:({ commit },data) => {
		commit('setSocketHostUrl', data)
	},
}

export default  {
    state,
    mutations,
    actions
}
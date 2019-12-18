

const state = {
    personList:'',
	friendList:'',
}

const getters = {

}

const mutations = {
    setPersonList (state, data) {
        state.personList = data
    },
	setFriendList (state, data) {
		state.friendList = data
	},
}

const actions = {
    commitPersonList:({ commit },data) => {
        commit('setPersonList', data)
    },
	commitFriendList:({ commit },data) => {
		commit('setFriendList', data)
	},
}

export default  {
    state,
    mutations,
    actions
}
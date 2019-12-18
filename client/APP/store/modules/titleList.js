

const state = {
    titleList:''
}

const getters = {

}

const mutations = {
    setTitleList (state, data) {
        state.titleList = data
    },
}

const actions = {
    commitTitleList:({ commit },data) => {
        commit('setTitleList', data)
    },
}

export default  {
    state,
    mutations,
    actions
}
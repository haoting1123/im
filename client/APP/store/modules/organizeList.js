

const state = {
    organizeList:''
}

const getters = {

}

const mutations = {
    setOrganizeList (state, data) {
        state.organizeList = data
    },
}

const actions = {
    commitOrganizeList:({ commit },data) => {
        commit('setOrganizeList', data)
    },
}

export default  {
    state,
    mutations,
    actions
}
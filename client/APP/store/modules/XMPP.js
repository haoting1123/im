const state = {
  xmppClient: null
}

const mutations = {
  UPDATE_XMPP_CLIENT (state, xmppClient) {
    state.xmppClient = xmppClient
  }
}

const actions = {
  updateXmppClient ({ commit }, xmppClient) {
    commit('UPDATE_XMPP_CLIENT', xmppClient)
  }
}

export default {
  state,
  mutations,
  actions
}

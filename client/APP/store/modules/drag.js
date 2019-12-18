const state = {
  homeWindowHeight: '',
  homeContentWidth: '',
  msgChannelListHeight: '',
  msgDialogWidth: '',
  dialogMessageListHeight: '',
  dialogContainerHeight: '',
  dialogContainerWidth: ''
}

const mutations = {
  SET_HOME_WINDOW_HEIGHT (state, data) {
    state.homeWindowHeight = data
  },
  SET_HOME_CONTENT_WIDTH (state, data) {
    state.homeContentWidth = data
  },
  SET_MSG_CHANNEL_LIST_HEIGHT (state, data) {
    state.msgChannelListHeight = data
  },
  SET_MSG_DIALOG_WIDTH (state, data) {
    state.msgDialogWidth = data
  },
  SET_DIALOG_MESSAGE_LIST_HEIGHT (state, data) {
    state.dialogMessageListHeight = data
  },
  SET_DIALOG_CONTAINER_HEIGHT (state, data) {
    state.dialogContainerHeight = data
  },
  SET_DIALOG_CONTAINER_WIDTH (state, data) {
    state.dialogContainerWidth = data
  }
}

const actions = {
  setHomeWindowHeight ({ commit }, data) {
    commit('SET_HOME_WINDOW_HEIGHT', data)
  },
  setHomeContentWidth ({ commit }, data) {
    commit('SET_HOME_CONTENT_WIDTH', data)
  },
  setMsgChannelListHeight ({ commit }, data) {
    commit('SET_MSG_CHANNEL_LIST_HEIGHT', data)
  },
  setMsgDialogWidth ({commit}, data) {
    commit('SET_MSG_DIALOG_WIDTH', data)
  },
  setDialogMessageListHeight ({commit}, data) {
    commit('SET_DIALOG_MESSAGE_LIST_HEIGHT', data)
  },
  setDialogContainerHeight ({commit}, data) {
    commit('SET_DIALOG_CONTAINER_HEIGHT', data)
  },
  setDialogContainerWidth ({commit}, data) {
    commit('SET_DIALOG_CONTAINER_WIDTH', data)
  }
}

export default {
  state,
  mutations,
  actions
}

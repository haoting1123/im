<template>
  <el-container class="friend-main-container">
    <el-aside class="aside-section">
      <search
        @showDialog="showNewFriendDialog"
        @onsearch="onSearchFriend"
      ></search>
      <!--搜索好友列表-->
      <friend-list
        v-if="searchFriendList.length"
        @selectFriend="selectFriend"
      ></friend-list>
      <div class="channel-container">
        <ul class="nav-channel">
          <li
            class="channel-item"
            v-for="friend in friendList"
            :key="friend.friendJid"
            :style="{ 'background-color': activeChatId === friend.friendJid ? '#e7f0f5' : 'white' }"
            @click="selectFriend(friend)"
            @click.right="operationUser($event, friend)"
          >
            <div class="user">
              <div class="has-close">
                <div class="status-wrapper">
                  <img v-if="friend.photo" class="status-wrapper-image" :src="friend.photo" alt="用户头像" />
                  <img v-else class="status-wrapper-image" src="../../../assets/images/boy.png"/>
                </div>
                <div class="channel-item-name">
                  <strong>{{ friend.alias ? friend.alias : friend.friendJid.split('@')[0] }}</strong>
                </div>
              </div>
            </div>
          </li>
        </ul>
      </div>
    </el-aside>
    <el-main class="content-section">
      <!--<newfriend-component v-if="!activeChatId"></newfriend-component>-->
      <userinfo-component :friendInfo="filterActiveFriend"></userinfo-component>
    </el-main>
  </el-container>
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex'

export default {
  data () {
    return {
      showDeleteChatDialog: false,
      // 当前会话id
      activeChatId: '',
      activeFriend: {},
      // 右键菜单的位置
      rightKeyMenuPosition: {
        x: 0,
        right: 0
      },
      // 新增好友 -> 暂时使用
      showDialog: false,
      // 设置备注
      updateAliasDialog: false,
      newAlias: '',
      addForm: {
        friendJid: '',
        alias: ''
      }
    }
  },
  components: {
    search: require('@/components/common/search').default,
    newfriendComponent: require('@/components/home/newFriend-component').default,
    userinfoComponent: require('@/components/home/userinfo-component').default,
    deletenoticeComponent: require('@/components/home/deleteNotice-component').default,
    friendList: require('@/components/home/friendList-component').default
  },
  computed: {
    ...mapState({
      friendList: state => state.home.friendList,
      rightKeyMenu: state => state.home.rightKeyMenu,
      userInfo: state => state.home.userInfo,
      searchFriendList: state => state.home.searchFriendList,
      xmppDomain: state => state.home.xmppDomain
    }),
    filterActiveFriend () {
      let friend = {}
      this.friendList.forEach(item => {
        if (this.activeChatId === item.friendJid) {
          friend = {...item}
        }
      })
      return friend
    }
  },
  watch: {
  },
  mounted () {},
  methods: {
    ...mapMutations([
      'SET_RIGHTKEYMENU',
      'CLEAR_SEARCHFRIENDLIST',
      'UPDATE_FRIENDINFO'
    ]),
    ...mapActions([
      'DeleteFriend',
      'GetFriendList',
      'GetFriendInfo',
      'AddFriend',
      'SearchFriend',
      'SetFriendAlias'
    ]),
    showNewFriendDialog () {
      this.showDialog = true
    },
    // 添加好友
    addFriend () {
      const data = {
        alias: this.addForm.alias,
        friendJid: `${this.addForm.friendJid}${this.xmppDomain}`,
        userName: this.userInfo.jid.split('@')[0]
      }
      this.AddFriend(data)
        .then(data => {
          this.getFriendList()
        })
        .catch(err => console.log(err))
    },
    // 获取好友列表
    getFriendList () {
      const from = this.userInfo.jid.split('@')[0]
      // 获取好友列表
      this.GetFriendList(from)
        .then(allFriend => {
          allFriend.forEach(item => {
            this.GetFriendInfo(item.friendJid)
          })
        })
        .catch(err => console.log(err))
    },
    // 显示好友请求界面
    showNewFriend () {
      this.activeChatId = ''
    },
    // 搜索好友
    onSearchFriend (value) {
      if (!value.replace(/\s/g, '')) return this.CLEAR_SEARCHFRIENDLIST()
      const data = {
        username: this.userInfo.jid.split('@')[0],
        key: value
      }
      this.SearchFriend(data)
    },
    // 将要删除好友
    startDeleteFriend (data) {
      this.showDeleteChatDialog = true
    },
    // 删除好友
    deleteFriend () {
      this.showDeleteChatDialog = false
      const data = {
        username: this.userInfo.jid.split('@')[0],
        friendname: this.activeFriend.friendJid
      }
      this.DeleteFriend(data)
        .then(data => {
          this.getFriendList()
        })
        .catch(err => console.log(err))
    },
    // 取消删除好友
    cancelDeleteFriend (data) {
      this.showDeleteChatDialog = false
    },
    // 设置好友备注
    startSetFriendAlias (data) {
      this.newAlias = data.alias
      this.updateAliasDialog = true
    },
    // 设置备注
    setFriendAlias () {
      this.updateAliasDialog = false
      const formData = {
        id: this.activeFriend.id,
        userName: this.activeFriend.userName,
        friendJid: this.activeFriend.friendJid,
        alias: this.newAlias
      }
      this.SetFriendAlias(formData)
        .then(data => {
          this.UPDATE_FRIENDINFO(data)
        })
        .catch(err => console.log(err))
    },
    // 选择好友
    selectFriend (user) {
      this.activeChatId = user.friendJid
      this.initChatList({ friendJid: '' })
    },
    // 操作用户
    operationUser (event, user) {
      this.rightKeyMenuPosition.x = `${event.x}px`
      this.rightKeyMenuPosition.y = `${event.y}px`
      this.activeFriend = JSON.parse(JSON.stringify(user))
      this.SET_RIGHTKEYMENU(true)
      this.initChatList(user)
    },
    // 初始化会话列表
    initChatList (user) {
      this.friendList.forEach(item => {
        if (item.friendJid === user.friendJid) {
          item.rightKeyMenu = true
          return
        }
        item.rightKeyMenu = false
      })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss">
  .friend-main-container {
    height: 100%;
    background-color: #e7f0f5;
    /*overflow: hidden;*/
    .aside-section {
      position: relative;
      width: 240px !important;
      padding: 0;
      border-right: 1px solid #dae6f2;
      background: white;
      overflow: visible;
      .channel-container {
        height: calc(100vh - 55px);
        padding: 0 6px;
        overflow: auto;
        .nav-channel {
          margin: 0;
          padding: 0;
          color: #999;
          list-style: none;
          .channel-item {
            position: relative;
            height: 48px;
            line-height: 48px;
            padding: 10px;
            border-bottom: 1px solid #dfdfdf;
            &:hover {
              background-color: #e7f0f5;
              /*border: 1px solid #e7f0f5;*/
            }
            .user {
              position: relative;
              display: block;
              -webkit-transition: none 1s;
              transition-delay: 0s;
              -moz-transition: none 1s;
              -o-transition: none 1s;
              transition: none 1s;
              text-align: left;
              line-height: 20px;
              font-size: 15px;
              overflow: hidden;
              white-space: nowrap;
              text-overflow: ellipsis;
              text-decoration: none;
              color: #000;
              cursor: pointer;
              .has-close {
                display: flex;
                .status-wrapper {
                  width: 48px;
                  height: 48px;
                  line-height: 40px;
                  border-radius: 3px;
                  text-align: center;
                  .status-wrapper-image {
                    width: 100%;
                    height: 100%;
                  }
                }
                .add-friend-icon {
                  width: 21px;
                  height: 21px;
                  margin-top: 8px;
                }
              }
              .channel-item-name {
                flex: 1;
                height: 40px;
                line-height: 40px;
                padding-left: 10px;
                overflow: hidden;
                text-overflow: ellipsis;
              }
              .message-status {
                position: absolute;
                bottom: 0;
                right: 0;
                font-size: 12px;
                color: #A4A5A7;
              }
            }
            .right-key-menu {
              position: fixed;
              border: 1px solid #E4E7ED;
              box-shadow: 0px 0px 3px #e4e7ed;
              font-size: 12px;
              font-weight: 500;
              color: #000000;
              background: white;
              border-radius: 2px;
              z-index: 9999;
              li {
                height: 30px;
                line-height: 30px;
                padding: 0 20px;
                cursor: pointer;
                &:hover {
                  background: #f2f2f2;
                }
              }
              li +li {
                /*border-top: 1px solid #adadad;*/
              }
            }
          }
        }
        ul, li {
          list-style: none;
        }
      }
    }
    .content-section {
      position: relative;
      padding: 0;
      background: white;
    }
  }
</style>

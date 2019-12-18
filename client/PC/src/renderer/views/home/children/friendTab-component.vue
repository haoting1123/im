<template>
  <el-container class="friend-main-container">
    <el-aside class="aside-section">
      <search
        @onsearch="onSearchFriend"
      ></search>
      <!--搜索好友列表-->
      <friend-list
        v-if="searchFriendList.length"
        @selectFriend="selectFriend"
      ></friend-list>
      <div class="channel-container">
        <ul class="nav-channel">
          <!--添加好友需要用户同意，暂且注释-->
          <!--<li-->
            <!--class="channel-item"-->
            <!--@click="showNewFriend"-->
            <!--:style="{ 'background-color': !activeFriendId ? '#e7f0f5' : 'white' }"-->
          <!--&gt;-->
            <!--<div class="user">-->
              <!--<div class="has-close">-->
                <!--<div class="status-wrapper" style="background: orange">-->
                  <!--<img class="add-friend-icon" src="../../../assets/images/tianjiahaoyou@2x-icon.png"/>-->
                <!--</div>-->
                <!--<div class="channel-item-name" style="line-height: 40px">-->
                  <!--<strong>新的朋友</strong>-->
                <!--</div>-->
              <!--</div>-->
            <!--</div>-->
          <!--</li>-->
          <li
            class="channel-item"
            v-for="friend in friendList"
            :key="friend.friendJid"
            :style="{ 'background-color': activeFriend.friendJid === friend.friendJid ? '#EBEBEC' : '' }"
            @click="selectFriend(friend)"
            @click.right="operationUser($event, friend)"
          >
            <div class="user">
              <div class="has-close">
                <div class="status-wrapper">
                  <img v-if="friend.photo" class="status-wrapper-image" :class="{'avatar-gray': friend.status !== 'online'}" :src="friend.photo" alt="用户头像" />
                  <img v-else class="status-wrapper-image" :class="{'avatar-gray': friend.status !== 'online'}" src="../../../assets/images/boy.png"/>
                </div>
                <div class="channel-item-name">
                  <p class="alias ellipsis" :style="{color: friend.status === 'online' ? '#000' : 'gray'}">{{ friend.alias ? friend.alias : friend.name }}</p>
                  <p class="name ellipsis" :style="{color: friend.status === 'online' ? '#000' : 'gray'}">{{ friend.name ? friend.name : friend.jid.split('@')[0]}}</p>
                </div>
              </div>
            </div>
            <!--右键菜单-->
            <div
              :style="{ left: rightKeyMenuPosition.x, top: rightKeyMenuPosition.y }"
              class="right-key-menu"
              v-if="friend.rightKeyMenu"
            >
              <ul>
                <li @click.stop="startDeleteFriend(friend)">移除联系人</li>
              </ul>
            </div>
          </li>
        </ul>
      </div>
    </el-aside>
    <el-main class="content-section">
      <!--<newfriend-component v-if="!activeFriendId"></newfriend-component>-->
      <userinfo-component
        :friendInfo="activeFriend"
        v-if="activeFriend.friendJid"
      >
      </userinfo-component>
    </el-main>

    <!--删除好友提示-->
    <deletenotice-component
      :showDeleteChatDialog="showDeleteChatDialog"
      :message="deleteFriendMessage"
      sureName="deleteFriend"
      cancelName="cancelDeleteFriend"
      @deleteFriend="deleteFriend"
      @cancelDeleteFriend="cancelDeleteFriend"
    >
    </deletenotice-component>
  </el-container>
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex'

export default {
  data () {
    return {
      showDeleteChatDialog: false,
      deleteFriendMessage: '常用联系人删除后，将清空所有消息记录',
      // 当前会话id
      activeFriendId: '',
      activeFriend: {},
      // 右键菜单的位置
      rightKeyMenuPosition: {
        x: 0,
        right: 0
      },
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
      searchFriendList: state => state.home.searchFriendList
    })
  },
  watch: {
    rightKeyMenu: function (val, oldval) {
      if (!val) {
        this.initChatList({ friendJid: '' })
      }
    }
  },
  mounted () {},
  methods: {
    ...mapMutations([
      'SET_RIGHTKEYMENU',
      'CLEAR_SEARCHFRIENDLIST',
      'UPDATE_FRIENDINFO',
      'DELETE_FRIEND',
      'SET_SEARCHFRIENDLIST',
      'SET_ACTIVE_MEMBER'
    ]),
    ...mapActions([
      'DeleteFriend',
      'GetFriendInfo',
      'SearchFriend',
      'GetMemberInfo'
      // 'GetFriendList',
    ]),
    // 搜索好友
    onSearchFriend (value) {
      if (!value.replace(/\s/g, '')) return this.CLEAR_SEARCHFRIENDLIST()
      this.SET_SEARCHFRIENDLIST(value)
      // const data = {
      //   username: this.userInfo.jid.split('@')[0],
      //   key: value
      // }
      // this.SearchFriend(data)
    },
    // 将要删除好友
    startDeleteFriend (data) {
      this.showDeleteChatDialog = true
      this.initChatList({})
    },
    // 删除好友
    deleteFriend () {
      this.showDeleteChatDialog = false
      const data = {
        username: this.userInfo.jid.split('@')[0],
        friendname: this.activeFriendId
      }
      this.DeleteFriend(data)
        .then(data => {
          if (this.activeFriendId === this.activeFriend.friendJid) this.activeFriend = {}
          // TODO:删除本地好友列表的对应成员
          this.DELETE_FRIEND(this.activeFriendId)
          // 置空当前操作成员信息
          this.SET_ACTIVE_MEMBER({})
        })
        .catch(err => console.log(err))
    },
    // 取消删除好友
    cancelDeleteFriend (data) {
      this.showDeleteChatDialog = false
    },
    // 选择好友
    selectFriend (user) {
      this.GetMemberInfo(user.account)
        .then(data => {
          user.sex = data.sex
          user.name = data.name
          user.photo = data.photo
          this.activeFriendId = user.friendJid
          this.activeFriend = {
            ...user
          }
          this.SET_ACTIVE_MEMBER({ ...user })
          this.UPDATE_MEMBER_INFO({ ...user })
          this.initChatList({ friendJid: '' })
        })
        .catch(err => {
          this.activeFriendId = user.friendJid
          this.activeFriend = user
          this.SET_ACTIVE_MEMBER(user)
          this.initChatList({ friendJid: '' })
          console.log(err)
        })
    },
    // 操作用户
    operationUser (event, user) {
      this.rightKeyMenuPosition.x = `${event.x}px`
      this.rightKeyMenuPosition.y = `${event.y}px`
      // this.activeFriend = JSON.parse(JSON.stringify(user))
      this.activeFriendId = user.friendJid
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
    // 获取好友列表
    // getFriendList () {
    //   const username = this.userInfo.jid.split('@')[0]
    //   this.GetFriendList(username)
    //     .then(data => {
    //       // 默认触发一次进群的操作
    //       this.GetGroupList()
    //     })
    //     .catch(err => console.log(err))
    // },
    // 显示好友请求界面
    // showNewFriend () {
    //   this.activeFriendId = ''
    // },
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
      width: 220px !important;
      padding: 0;
      border-right: 1px solid #ececec;
      background: white;
      overflow: visible;
      .channel-container {
        height: calc(100vh - 69px);
        padding-right: 6px;
        overflow: auto;
        .nav-channel {
          margin: 0;
          padding: 0;
          color: #999;
          list-style: none;
          .channel-item {
            position: relative;
            height: 40px;
            line-height: 40px;
            padding: 10px;
            border-bottom: 2px solid #FFFFFF;
            &:hover {
              background: #EBEBEC;
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
                align-items: center;
                .status-wrapper {
                  width: 40px;
                  height: 40px;
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
                /*height: 40px;*/
                /*line-height: 40px;*/
                padding-left: 10px;
                overflow: hidden;
                text-overflow: ellipsis;
                .alias {
                  font-size: 14px;
                }
                .name {
                  font-size: 12px;
                }
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
  .avatar-gray {
    filter: grayscale(100%);
    filter: gray;
  }
</style>

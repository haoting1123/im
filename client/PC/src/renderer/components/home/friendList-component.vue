<template>
  <div class="friend-list-component">
    <ul class="nav-channel">
      <li
        class="channel-item"
        v-for="friend in searchFriendList"
        :key="friend.id"
        @click="selectFriend(friend)"
      >
        <div class="user">
          <div class="has-close">
            <div class="status-wrapper">
              <img v-if="friend.photo" class="status-wrapper-image" :src="friend.photo" alt="用户头像" />
              <img v-else class="status-wrapper-image" src="../../assets/images/boy.png"/>
            </div>
            <div class="channel-item-name">
              <strong>{{ friend.alias ? friend.alias : friend.name }}</strong>
            </div>
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
  import { mapState } from 'vuex'
  export default {
    data () {
      return {}
    },
    computed: {
      ...mapState({
        searchFriendList: state => state.home.searchFriendList
      })
    },
    methods: {
      selectFriend (friend) {
        this.$emit('selectFriend', friend)
      }
    }
  }
</script>

<style lang="scss">
  .friend-list-component {
    position: absolute;
    top: 52px;
    left: 15px;
    width: 240px;
    border: 1px solid #2e6696;
    background: white;
    z-index: 9999;
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
        border-bottom: 1px solid #dfdfdf;
        &:hover {
          background-color: #e7f0f5;
        }
        .user {
          position: relative;
          display: block;
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
  }
</style>

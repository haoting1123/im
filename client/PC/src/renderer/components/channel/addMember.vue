<template>
  <div
    class="add-member-to-group-component-bg"
    v-show="dialogVisible"
    @click="dialogVisible = false"
  >
    <div class="add-member-to-group-component" @click.stop="">
      <h3 class="main-title">添加新成员</h3>
      <div class="list-container">
        <div class="user-list-container left-list">
          <div class="title">选择组成员</div>
          <div class="content add-member-box">
            <keep-alive>
              <tree-component type="treeForGroup" @onNodeClick="selectMember" :data="data"></tree-component>
            </keep-alive>
          </div>
        </div>
        <div class="user-list-container right-list">
          <div class="title">已选组成员</div>
          <ul>
            <li
              v-for="(item, index) in this.selectedUserList"
              @click="unselectUser(item, index)"
              class="member-list-item"
            >
              <img v-if="item.photo" class="member-avatar" :src="item.photo" alt="用户头像" style="width: 20px; height: 20px" />
              <img v-else class="member-avatar" src="../../assets/images/boy.png" alt="默认用户头像" style="width: 20px; height: 20px" />
              <strong class="member-name">{{item.name }}</strong>
              <span>-</span>
            </li>
          </ul>
        </div>
      </div>
      <div class="dialog-footer">
        <el-button size="small" @click="doCloseDialog()">取 消</el-button>
        <el-button type="primary" size="small" :disabled="!saveButtonEnable" @click="startAddGroupMember">确 定</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex'

export default {
  name: "add-member",
  props: ['channelId', 'data'],
  data() {
    return {
      dialogVisible: false,
      searchParams: {
        username: '',
        limit: 20,
        offset: 0
      },
      groupInfo: {},
      selectedUserList: [],
      userTotal: 0
    }
  },
  components: {
    treeComponent: require('@/components/tree/tree-component').default
  },
  methods: {
    ...mapMutations([
      'SET_UPDATE_GROUP_FLAG'
    ]),
    ...mapActions([
      'AddGroupMember'
    ]),
    doCloseDialog() {
      this.dialogVisible = false
      this.selectedUserList = []
    },
    // 选择添加的成员
    selectMember(member) {
      if (!member.jid) return
      console.log(this.groupInfo)
      if (this.groupInfo.members.some(item => { return item.jid === member.jid })) {
        this.$message({
          type: 'warning',
          message: '该成员已被添加!',
          duration: 500
        })
        return
      }
      if (this.selectedUserList.some(item => { return item.jid === member.jid })) {
        this.$message({
          type: 'warning',
          message: '请勿重复选择该成员!',
          duration: 500
        })
        return
      }
      this.selectedUserList.push(member)
    },
    unselectUser(user, index) {
      this.selectedUserList.splice(index, 1)
    },
    // 添加群成员
    startAddGroupMember() {
      this.dialogVisible = false
      this.AddGroupMember({
        groupJid: this.channelId,
        addList: this.selectedUserList
      })
      this.selectedUserList = []
    }
  },
  watch: {},
  computed: {
    ...mapState({
      friendList: state => state.home.friendList
    }),
    saveButtonEnable() {
      return this.selectedUserList.length > 0
    }
  },
  mounted: function() {
    this.$nextTick(() => {
      this.$on('openDialog', function(group) {
        this.groupInfo = group
        this.dialogVisible = true
      })
    })
  }
}
</script>

<style lang="scss">
  .add-member-to-group-component-bg {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 9998;
  }
  .add-member-to-group-component {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translateX(-50%) translateY(-50%);
    width: 400px;
    padding: 10px;
    background: white;
    border-radius: 4px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
    .main-title {
      font-size: 15px;
    }
    .list-container {
      margin-top: 20px;
      display: flex;
      .user-list-container {
        flex: 1;
        border: solid 1px #D4D1CC;
        border-radius: 4px;
        .title {
          height: 30px;
          line-height: 30px;
          font-size: 14px;
          text-align: center;
          background-color: #F0F0F0;
          border-bottom: solid 1px #F0F0F0;
          border-radius: 4px 4px 0 0;
        }
        ul {
          padding: 0;
          margin: 0;
          overflow-y: auto;
          margin: 0;
          list-style-type: none;
          .load-more {
            text-align: center;
            font-size: 11px;
          }
          li {
            display: list-item;
            padding-top: 2px;
            padding-bottom: 4px;
            padding-left: 5px;
            padding-right: 5px;
            margin: 0;
            span {
              font-weight: bold;
              float: right;
              display: none;
            }
          }
          li:hover {
            background-color: #F1EFEE;
            cursor: pointer;
          }
          li:hover span {
            display: block;
          }
        }
      }
      .left-list {
        .search-container {
          text-align: center;
          padding: 2px 1px;
          border-bottom: solid 1px #F0F0F0;
          input {
            margin: 0 0 0 4px;
            height: 23px;
            line-height: 23px;
            width: 166px;
            outline: 0;
            border: none;
            background-color: transparent;
            -webkit-appearance: textfield;
            -webkit-rtl-ordering: logical;
            cursor: text;
          }
          i {
            cursor: pointer;
            height: 23px;
            line-height: 23px;
          }
          input::-webkit-input-placeholder {
            color: #DDDBD7;
          }
          input::-moz-placeholder {   /* Mozilla Firefox 19+ */
            color: #DDDBD7;
          }
          input:-moz-placeholder {    /* Mozilla Firefox 4 to 18 */
            color: #DDDBD7;
          }
          input:-ms-input-placeholder {  /* Internet Explorer 10-11 */
            color: #DDDBD7;
          }
        }
        .content {
          height: 240px;
          overflow: auto;
        }
      }
      .right-list {
        margin-left: 10px;
        .member-list-item {
          display: flex;
          align-items: center;
          .member-avatar {}
          .member-name {
            flex: 1;
            margin-left: 10px;
            font-size: 14px;
            font-weight: normal;
          }
        }
        .content {
          height: 240px;
          overflow: auto;
        }
      }
    }
    .dialog-footer {
      margin-top: 20px;
      text-align: center;
    }
  }
</style>

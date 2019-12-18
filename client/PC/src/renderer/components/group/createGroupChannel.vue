<template>
  <el-dialog
    :visible.sync="dialogProps.visible"
    width="560px"
    v-loading="showLoading"
    title="创建群聊"
    @open="handleDialogOpen()"
  >
    <div class="create-group-channel">
      <!--<div slot="title" class="dialog-header"><h3>{{ dialogProps.title }}</h3></div>-->
      <el-form
        class="form"
        :model="groupModel"
        :rules="formRules"
        ref="channelForm"
        label-width="85px"
        label-position="right"
        size="small"
        @submit.native.prevent
      >
        <el-form-item label="群组名称" prop="name">
          <el-col :span="22"><el-input ref="channelName" size="small" :maxlength="64" v-model="groupModel.name" autofocus="autofocus" @focus="clearValidate"></el-input></el-col>
        </el-form-item>
        <!--<el-form-item label="群组用途" prop="purpose">-->
        <!--<el-col :span="22">-->
        <!--<el-input type="textarea" :rows="2" v-model="channelModel.purpose">-->
        <!--</el-input>-->
        <!--</el-col>-->
        <!--</el-form-item>-->
        <el-form-item label="成员">
          <el-col :span="22" style="display: flex">
            <div class="user-list-container left-list">
              <div class="title">选择组成员</div>
              <!--<div class="search-container">-->
              <!--<input type="text" placeholder="搜索" v-model="searchParams.username" @keyup="onSearchInputKeyUp">-->
              <!--<i slot="suffix" class="el-input__icon el-icon-search" @click="doSearchUser"></i>-->
              <!--</div>-->
              <ul>
                <li
                  v-for="(item, index) in this.userList"
                  @click="selectUser(item, index)"
                  class="member-list-item"
                  :key="index"
                >
                  <img :src="item.photo" alt="成员头像" style="width: 20px; height: 20px" >
                  <strong>{{ item.name }}</strong>
                  <span>+</span>
                </li>
                <!--<li class="load-more" v-show="searchParams.offset + searchParams.limit < userTotal" @click="loadMoreUser();">加载更多...</li>-->
              </ul>
            </div>
            <div class="user-list-container right-list">
              <div class="title">已选组成员</div>
              <ul>
                <li
                  v-for="(item, index) in selectMembers"
                  @click="unselectUser(item, index)"
                  class="member-list-item"
                  :key="index"
                >
                  <img :src="item.photo" alt="成员头像" style="width: 20px; height: 20px" >
                  <strong>{{ item.name }}</strong>
                  <span>x</span>
                </li>
              </ul>
            </div>
          </el-col>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="doCloseDialog()">取 消</el-button>
        <el-button type="primary" size="small" @click="doSaveChannel()">确 定</el-button>
      </span>
    </div>
  </el-dialog>
</template>

<script>
// import { outputError } from '@/utils/exception'
// import { createChannel } from '@/api/channel'
// import { listUser } from '@/api/user'
import { mapState } from 'vuex'

export default {
  name: 'create-group-channel',
  data () {
    return {
      myId: JSON.parse(sessionStorage.getItem('currentUser')).id,
      groupModel: {
        name: ''
      },
      showLoading: false,
      dialogProps: {
        visible: false,
        action: '',
        title: ''
      },
      selectMembers: [],
      searchParams: {
        username: '',
        limit: 20,
        offset: 0
      },
      userList: [],
      userTotal: 0,
      formRules: {
        name: [
          { required: true, message: '请输入群组名称', trigger: 'blur' },
          { min: 3, max: 64, message: '长度在 3 到 64 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    ...mapState({
      friendList: state => state.home.friendList
    })
  },
  methods: {
    doCloseDialog () {
      Object.assign(this.$data, this.$options.data())
      this.dialogProps.visible = false
    },
    clearValidate () {
      this.$refs['channelForm'].clearValidate()
    },
    handleDialogOpen () {
      this.$nextTick(() => {
        this.$refs['channelForm'].clearValidate()
        this.$refs['channelName'].focus()
      })
    },
    // getUserList () {
    //   this.showLoading = true
    //   listUser(this.searchParams.username, this.searchParams.limit, this.searchParams.offset, '')
    //     .then(response => {
    //       let users = []
    //       for(let user of response.data.rows) {
    //         if(user.id !== this.myId) {
    //           users.push({
    //             id: user.id,
    //             nickname: user.nickname
    //           })
    //         }
    //       }
    //       this.userList = [...this.userList, ...users]
    //       this.userTotal = response.data.total
    //       this.showLoading = false
    //     })
    //     .catch(error => {
    //       this.showLoading = false
    //       outputError(this, error)
    //     })
    // },
    // 选择成员
    selectUser (user, index) {
      this.selectMembers.push({
        index: index,
        ...user
      })
      this.userList.splice(index, 1)
    },
    // 取消选择成员
    unselectUser (user, index) {
      if (user.id !== this.myId) {
        this.userList.splice(user.index, 0, {
          id: user.id,
          ...user
        })
        this.selectMembers.splice(index, 1)
      }
    },
    loadMoreUser () {
      this.searchParams.offset += this.searchParams.limit
      // this.getUserList()
    },
    doSaveChannel () {
      // this.$refs['channelForm'].validate(valid => {
      //   if (valid) {
      //     this.showLoading = true
      //     createChannel(this.channelModel)
      //       .then(response => {
      //         this.$emit('onChannelCreated', response.data)
      //         this.showLoading = false
      //         Object.assign(this.$data, this.$options.data())
      //         this.dialogProps.visible = false
      //       })
      //       .catch(error => {
      //         this.showLoading = false
      //         this.dialogProps.visible = false
      //         outputError(this, error)
      //       })
      //   }
      // })
    },
    doSearchUser () {
      this.userList = []
      // this.getUserList()
    },
    onSearchInputKeyUp (event) {
      if (event.keyCode === 13) {
        this.userList = []
        // this.getUserList()
      }
    }
  },
  watch: {
    'searchParams.username': function (newVal, oldVal) {
      if (newVal.trim() === '') {
        this.doSearchUser()
      }
    }
  },
  mounted () {
    this.$nextTick(() => {
      this.$on('createEvent-event', function (action) {
        this.userList = this.friendList
        this.dialogProps.visible = true
        this.dialogProps.title = action === 'add' ? '添加群聊' : '修改群聊'
      })
    })
  }
}
</script>

<style lang="scss">
  .create-group-channel {
    .myheader{
      background-color: transparent;
      border-bottom: 1px solid #F0EEEA;
      color: #999;
      height: 60px;
      line-height: 60px;
      h3{
        padding-left: 20px;
      }
    }
    .form {
      padding: 2px 0 0 16px;
      border-bottom: solid 1px #F0EEEA;
      .user-list-container {
        border: solid 1px #dcdfe6;
        width: 48%;
        border-radius: 4px;
        .title {
          height: 32px;
          text-align: center;
          /*font-weight: bold;*/
          background-color: #F0F0F0;
          border-bottom: solid 1px #dcdfe6;
          border-radius: 4px 4px 0 0;
        }
        .search-container {
          text-align: center;
          padding: 0;
          margin: 0;
          border-bottom: solid 1px #F0F0F0;
          input {
            margin: 0 0 0 4px;
            height: 22px;
            line-height: 22px;
            width: 155px;
            outline: 0;
            border: none;
            background-color: transparent;
            -webkit-appearance: textfield;
            -webkit-rtl-ordering: logical;
            cursor: text;
          }
          i {
            cursor: pointer;
            height: 22px;
            line-height: 22px;
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
        ul {
          padding: 0;
          margin: 0;
          overflow-y: auto;
          list-style-type: none;
          .load-more {
            text-align: center;
            font-size: 11px;
          }
          .member-list-item {
            display: flex;
            align-items: center;
            padding: 0 5px;
            margin: 0;
            strong {
              flex: 1;
              margin-left: 10px;
              font-weight: normal;
            }
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
        ul {
          height: 200px;
          overflow: auto;
        }
      }
      .right-list {
        margin-left: 10px;
        ul {
          height: 200px;
          overflow: auto;
        }
      }
    }
  }
</style>

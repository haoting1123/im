<template>
  <el-dialog :modal-append-to-body="false" :visible.sync="dialogVisible" width="500px" v-loading="loadingVisible" @open="handleDialogOpen()">
    <div slot="title" class="dialog-header"><h3>编辑备注</h3></div>
    <el-form class="el-dialog-form" ref="form" :model="model" :rules="formRules"
      label-width="130px" label-position="right" size="small"  @submit.native.prevent>
      <el-form-item label="备注名称" prop="channelTitle">
        <el-col :span="16">
          <input ref="channelTitle" :maxlength="32" v-model="model.alias" type="text" class="custom-input" />
        </el-col>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button size="small" @click="dialogVisible = false">取 消</el-button>
      <el-button type="primary" size="small" @click="doSaveChannelTitle()">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex'

export default {
  name: 'edit-channel-title',
  data() {
    return {
      loadingVisible: false,
      dialogVisible: false,
      model: {
        alias: ''
      },
      memberInfo: {},
      formRules: {
        alias: [
          { required: true, message: '请输入备注名称', trigger: 'blur' },
          { min: 1, max: 32, message: '长度在 1 到 32 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    ...mapState({
      friendList: state => state.home.friendList,
      activeMember: state => state.home.activeMember
    })
  },
  methods: {
    ...mapMutations([
      'SET_ACTIVE_MEMBER'
    ]),
    ...mapActions([
      'SetFriendAlias'
    ]),
    handleDialogOpen() {
      this.$nextTick(() => {
        this.$refs['form'].clearValidate()
        this.$refs['channelTitle'].focus()
      })
    },
    // 设置备注
    setFriendAlias (value) {
      this.dialogVisible = false
      const formData = {
        id: this.memberInfo.id,
        userName: this.memberInfo.username,
        friendJid: this.memberInfo.friendJid,
        alias: this.model.alias
      }
      this.SetFriendAlias(formData)
        .then(data => {
          // 如果当前用户详情展示的是当前修改备注的好友，更新其信息，避免显示错误
          if (this.memberInfo.friendJid === this.activeMember.jid) {
            this.SET_ACTIVE_MEMBER({
              ...this.activeMember,
              alias: this.model.alias
            })
          }
        })
        .catch(err => console.log(err))
    },
    doSaveChannelTitle() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          this.setFriendAlias()
          // this.$emit('onEditTitleFinished', this.model.channelTitle)
        } else {
          return false
        }
      })
    }
  },
  mounted: function() {
    this.$nextTick(() => {
      this.$on('openDialog', function(data) {
        const member = this.friendList.filter(item => {
          return item.friendJid === data.channelId
        })[0]
        this.memberInfo = member
        this.model.alias = member.alias
        this.dialogVisible = true
      })
    })
  }
}
</script>


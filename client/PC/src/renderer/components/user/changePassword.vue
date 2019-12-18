<template>
  <el-dialog :visible.sync="changePasswordDialog" width="500px" v-loading="loadingVisible" @open="handleDialogOpen()" @close="onClose">
    <div class="change-password-component">
      <div slot="title" class="dialog-header"><h3>修改密码</h3></div>
      <form action="" class="form-list">
        <div class="form-list-item">
          <label for="old-password">原密码:</label>
          <input ref="oldPassword" id="old-password" type="password" :maxlength="16" v-model="changePwdModel.oldPassword" class="custom-input" />
        </div>
        <div class="form-list-item">
          <label for="new-password">新密码:</label>
          <input type="password"  id="new-password" :maxlength="16" v-model="changePwdModel.newPassword" class="custom-input" />
        </div>
        <div class="form-list-item">
          <label for="new-password2">新密码:</label>
          <input type="password" id="new-password2" :maxlength="16" v-model="changePwdModel.checkPassword" class="custom-input" />
        </div>
      </form>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="changePasswordDialog = false">取 消</el-button>
        <el-button type="primary" size="small" @click="doChangePassword">确 定</el-button>
      </div>
    </div>

  </el-dialog>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import { ipcRenderer } from 'electron'
// import { outputError } from '@/utils/exception'

export default {
  name: "change-password",
  data() {
    var validateOldPass = (rule, value, callback) => {
      if (!value.replace(/\s/g, '')) {
        callback(new Error('请输入原密码'))
      } else {
        callback()
      }
    }
    var validateNewPass = (rule, value, callback) => {
      if (!value.replace(/\s/g, '')) {
        callback(new Error('请输入新密码'))
      } else {
        if (this.changePwdModel.checkPassword !== '') {
          this.$refs.changePwdForm.validateField('checkPassword')
        }
        callback()
      }
    }
    var validatePass2 = (rule, value, callback) => {
      if (!value.replace(/\s/g, '')) {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.changePwdModel.newPassword) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    return {
      loadingVisible: false,
      dialogVisible: false,
      changePwdModel: {
        oldPassword: '',
        newPassword: '',
        checkPassword: ''
      }
    }
  },
  props: ['changePasswordDialog'],
  computed: {
    ...mapState({
      userInfo: state => state.home.userInfo
    })
  },
  methods: {
    ...mapActions(['ChangePassword']),
    onClose () {
      this.$emit('update:changePasswordDialog', false)
    },
    handleDialogOpen() {
      this.$nextTick(() => {
        this.$refs['oldPassword'].focus()
      })
    },
    doChangePassword() {
      if (!this.changePwdModel.oldPassword.replace(/\s/g, '')) return
      if (!this.changePwdModel.newPassword.replace(/\s/g, '')) return
      if (!this.changePwdModel.checkPassword.replace(/\s/g, '')) return
      if (this.changePwdModel.newPassword !== this.changePwdModel.checkPassword) {
        this.$message({
          type: 'warning',
          message: '两次输入新密码不一致!',
          duration: 500
        })
        return
      }
      this.loadingVisible = true
      this.changePasswordDialog = false
      // let currentUser = JSON.parse(sessionStorage.getItem('currentUser'))
      let data = {
        id: this.userInfo.id,
        plainPassword: this.changePwdModel.oldPassword,
        newPassword: this.changePwdModel.newPassword
      }
      this.ChangePassword(data)
        .then(response => {
          this.loadingVisible = false
          if(response.data === 1) {
            this.dialogVisible = false
            this.$message({
              type: 'success',
              message: '密码修改成功，请重新登录!',
              duration: 500
            })
            setTimeout(() => {
              // 隐藏内容窗口
              ipcRenderer.send('winHide')
              this.$router.push('/login')
              // 设置登录框大小
              ipcRenderer.send('setLoginWindowSize')
            }, 510)
          } else {
            this.$message({
              type: 'error',
              message: '密码修改失败!',
              duration: 500
            })
          }
        })
        .catch(error => {
          this.loadingVisible = false
          this.changePasswordDialog = false
          this.$message({
            type: 'error',
            message: '密码修改失败!',
            duration: 500
          })
          // outputError(this, error)
        })
      this.$refs['changePwdForm'].validate((valid) => {
        if (valid) {
          this.loadingVisible = true
          this.changePasswordDialog = false
          // let currentUser = JSON.parse(sessionStorage.getItem('currentUser'))
          let data = {
            id: this.userInfo.id,
            plainPassword: this.changePwdModel.oldPassword,
            newPassword: this.changePwdModel.newPassword
          }
          this.ChangePassword(data)
            .then(response => {
              this.loadingVisible = false
              if(response.data === 1) {
                this.dialogVisible = false
                this.$message({
                  type: 'success',
                  message: '密码修改成功，请重新登录!',
                  duration: 500
                })
                setTimeout(() => {
                  // 隐藏内容窗口
                  ipcRenderer.send('winHide')
                  this.$router.push('/login')
                  // 设置登录框大小
                  ipcRenderer.send('setLoginWindowSize')
                }, 510)
              } else {
                this.$message({
                  type: 'error',
                  message: '密码修改失败!',
                  duration: 500
                })
              }
            })
            .catch(error => {
              this.loadingVisible = false
              this.changePasswordDialog = false
              this.$message({
                type: 'error',
                message: '密码修改失败!',
                duration: 500
              })
              // outputError(this, error)
            })
        } else {
          return false
        }
      })
    }
  },
  mounted: function() {
    this.$nextTick(() => {
      this.$on('openDialog', function(action) {
        this.dialogVisible = true
      })
    })
  }
}
</script>

<style lang="scss">
  .change-password-component {
    .form-list {
      width: 350px;
      margin: 40px auto 0 auto;
      .form-list-item {
        display: flex;
        align-items: center;
        input {
          flex: 1;
          margin-left: 10px;
        }
      }
      .form-list-item + .form-list-item {
        margin-top: 10px;
      }
    }
    .dialog-footer {
      margin-top: 20px;
      text-align: right;
    }
    .vc {
      width: 70px;
      height: 30px;
      line-height: 30px;
      float: right;
      border: solid 1px #CECECE;
      background-color: #F0F0F0;
      text-align: center;
      color: #007ACC;
    }
    .vc:hover {
      cursor: pointer;
    }

  }
</style>

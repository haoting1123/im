<template>
  <el-dialog
    :close-on-click-modal="false"
    :visible.sync="resetPasswordVisible"
    :modal="false"
    title="密码重置"
    width="400px">
    <el-form ref="dataForm" :model="dataForm" :rules="dataRule" label-width="80px" @keyup.enter.native="dataFormSubmit()">
      <el-form-item label="用户账号" prop="username">
        <el-input v-model="dataForm.username" :maxlength="100" disabled placeholder="用户账号"></el-input>
      </el-form-item>
      <el-form-item label="真实姓名" prop="name">
        <el-input v-model="dataForm.name" :maxlength="50" disabled placeholder="真实姓名"></el-input>
      </el-form-item>
      <el-form-item :class="{ 'is-required': !dataForm.id }" label="新密码" prop="plainPassword">
        <el-input v-model="dataForm.plainPassword" :maxlength="16" type="password" placeholder="请输入新密码"></el-input>
      </el-form-item>
      <el-form-item :class="{ 'is-required': !dataForm.id }" label="确认密码" prop="comfirmPassword">
        <el-input v-model="dataForm.comfirmPassword" :maxlength="16" type="password" placeholder="请输入确认密码"></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="cancelHanel()">取消</el-button>
      <el-button type="primary" @click="resetPassword()">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  // eslint-disable-next-line vue/require-prop-types
  props: ['userItem', 'resetPasswordVisible'],
  data() {
    var validatePassword = (rule, value, callback) => {
      if (!this.dataForm.id && !/\S/.test(value)) {
        callback(new Error('密码不能为空'))
      } else {
        callback()
      }
    }
    var validateComfirmPassword = (rule, value, callback) => {
      if (!this.dataForm.id && !/\S/.test(value)) {
        callback(new Error('确认密码不能为空'))
      } else if (this.dataForm.plainPassword !== this.dataForm.comfirmPassword) {
        callback(new Error('确认密码与密码输入不一致'))
      } else {
        callback()
      }
    }
    return {
      treeSelectTag: 0,
      treeDefaultKey: [],
      treeData: [],
      dataForm: {
        id: '',
        username: '',
        name: '',
        plainPassword: '',
        encryptedPassword: '',
        comfirmPassword: '',
        sex: '男',
        groupCode: '',
        identity: '1',
        roleType: 'admin',
        storedKey: '',
        serverKey: '',
        salt: '',
        iterations: '',
        email: '',
        userCard: '',
        telephone: ''
      },
      dataRule: {
        plainPassword: [
          { validator: validatePassword, trigger: 'blur' }
        ],
        comfirmPassword: [
          { validator: validateComfirmPassword, trigger: 'blur' }
        ]
      }
    }
  },
  mounted() {
    this.dataForm = this.userItem
    this.dataForm.plainPassword = ''
    this.dataForm.comfirmPassword = ''
  },
  methods: {
    ...mapActions(['SaveUser','ResetUserPassword']),
    cancelHanel() {
      this.$emit('update:resetPasswordVisible', false)
      this.$refs.dataForm.resetFields()
    },
    resetPassword() {
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          this.ResetUserPassword(this.dataForm).then(data => {
            if (data) {
              this.$message({
                message: '密码重置成功',
                type: 'success'
              })
              this.cancelHanel()
            } else {
              this.$message.error('操作失败')
            }
          })
        }
      })
    }
  }

}
</script>

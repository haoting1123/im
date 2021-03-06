<template>
  <el-dialog :visible.sync="dialogVisible" width="500px" v-loading="loadingVisible" @open="handleDialogOpen()">
    <div slot="title" class="dialog-header"><h3>注册用户</h3></div>
    <el-form :model="userModel" :rules="formRules" class="el-dialog-form"
      ref="userForm" label-width="80px" label-position="right" size="small">
      <el-form-item label="用户名" prop="name">
        <el-col :span="16"><el-input ref="username" :maxlength="16" v-model="userModel.name"></el-input></el-col>
      </el-form-item>
      <el-form-item label="姓名" prop="nickname">
        <el-col :span="16"><el-input ref="nickname" :maxlength="16" v-model="userModel.nickname" autofocus></el-input></el-col>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-col :span="16"><el-input type="password" :maxlength="16" v-model="userModel.password" auto-complete="off"></el-input></el-col>
      </el-form-item>
      <el-form-item label="确认密码" prop="checkPassword">
        <el-col :span="16"><el-input type="password" :maxlength="16" v-model="userModel.checkPassword" auto-complete="off"></el-input></el-col>
      </el-form-item>
      <el-form-item label="单位" prop="organization">
        <el-col :span="16"><el-input ref="organization" :maxlength="32" v-model="userModel.organization"></el-input></el-col>
      </el-form-item>
      <el-form-item label="部门" prop="department">
        <el-col :span="16"><el-input ref="department" :maxlength="32" v-model="userModel.department"></el-input></el-col>
      </el-form-item>
      <el-form-item label="等级" prop="ulevel">
        <el-col :span="16"><el-input ref="ulevel" :maxlength="16" v-model="userModel.ulevel"></el-input></el-col>
      </el-form-item>
      <el-form-item label="性别" prop="sex">
        <el-col :span="16">
          <template>
            <el-radio v-model="userModel.sex" label="男">男</el-radio>
            <el-radio v-model="userModel.sex" label="女">女</el-radio>
          </template>
        </el-col>
      </el-form-item>
      <el-form-item label="验证码" prop="verificationCode">
        <el-col :span="16">
          <el-input class="vc-input" v-model="userModel.verificationCode" placeholder="请输入验证码"></el-input>
          <div class="vc" @click="getVerificationCode()">{{ this.verificationCode }}</div>
        </el-col>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button size="small" @click="dialogVisible = false">取 消</el-button>
      <el-button type="primary" size="small" @click="doRegister()">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
// import { getVerificationCode } from '@/api/auth'
// import { registerUser } from '@/api/user'
import { outputError } from '@/utils/exception'

export default {
  name: "register-user",
  data() {
    var validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'))
      } else {
        if (this.userModel.checkPassword !== '') {
          this.$refs.userForm.validateField('checkPassword')
        }
        callback()
      }
    }
    var validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.userModel.password) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    var validateVerificationCode = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入验证码'))
      } else if (value !== this.verificationCode) {
        callback(new Error('验证码不正确!'))
      } else {
        callback()
      }
    }
    return {
      loadingVisible: false,
      dialogVisible: false,
      userModel: {
        name: '',
        nickname: '',
        password: '',
        checkPassword: '',
        verificationCode: '',
        organization:'',
        department:'',
        ulevel:'',
        sex:'男'
      },
      verificationCode: '',
      formRules: {
        name: [
          { required: true, message: '请输入用户名称', trigger: 'blur' },
          { min: 3, max: 32, message: '长度在 3 到 16 个字符', trigger: 'blur' }
        ],
        nickname: [
          { required: true, message: '请输入姓名', trigger: 'blur' },
          { min: 3, max: 32, message: '长度在 3 到 16 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { validator: validatePass, trigger: 'blur' }
        ],
        checkPassword: [
          { validator: validatePass2, trigger: 'blur' }
        ],
        verificationCode: [
          { validator: validateVerificationCode, trigger: 'blur' }
        ],
        organization: [
          { required: true, message: '请输入单位', trigger: 'blur' },
          { min: 2, max: 32, message: '长度在 2 到 16 个字符', trigger: 'blur' }
        ],
        department: [
          { required: true, message: '请输入部门', trigger: 'blur' },
          { min: 2, max: 32, message: '长度在 2 到 16 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    handleDialogOpen() {
      this.getVerificationCode()
      this.$nextTick(() => {
        this.$refs['username'].focus()
      })
    },
    doRegister() {
      this.$refs['userForm'].validate((valid) => {
        if (valid) {
          this.loadingVisible = true
          registerUser(this.userModel)
          .then(response => {
            this.loadingVisible = false
            this.dialogVisible = false
            this.$emit('onRegisterSuccessed',
              this.userModel.name,
              this.userModel.password
            )
          })
          .catch(error => {
            this.loadingVisible = false
            outputError(this, error)
          })
        } else {
          return false
        }
      })
    },
    getVerificationCode() {
      this.loadingVisible = true
      getVerificationCode()
      .then(response => {
        this.verificationCode = response.data
        this.loadingVisible = false
      })
      .catch(error => {
        this.loadingVisible = false
        outputError(this, error)
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

<style lang="scss" scoped>
.vc-input {
  float: left;
  width: 190px;
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
</style>


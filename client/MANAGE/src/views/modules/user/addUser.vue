<template>
  <div>
    <el-form
      ref="dataForm"
      :model="dataForm"
      :rules="dataRule"
      label-width="180px"
    >
      <el-form-item label="用户名" class="formItem" prop="username">
        <el-input v-model="dataForm.username" :maxlength="100" placeholder="用户账号" @blur="validateUserName"></el-input>
      </el-form-item>
      <el-form-item label="真实姓名" class="formItem" prop="name">
        <el-input v-model="dataForm.name" :maxlength="50" placeholder="真实姓名"></el-input>
      </el-form-item>
      <el-form-item class="formItem" label="密码" prop="plainPassword">
        <el-input
          v-model="dataForm.plainPassword"
          :maxlength="16"
          type="password"
          placeholder="密码"
        ></el-input>
      </el-form-item>
      <el-form-item class="formItem" label="确认密码" prop="comfirmPassword">
        <el-input
          v-model="dataForm.comfirmPassword"
          :maxlength="16"
          type="password"
          placeholder="确认密码"
        ></el-input>
      </el-form-item>
      <el-form-item label="联系电话" class="formItem" prop="telephone">
        <el-input v-model="dataForm.telephone" :maxlength="50" placeholder="联系电话"></el-input>
      </el-form-item>
      <el-form-item label="邮箱" class="formItem" prop="email">
        <el-input v-model="dataForm.email" :maxlength="50" placeholder="邮箱"></el-input>
      </el-form-item>
      <el-form-item label="身份证号" class="formItem" prop="userCard">
        <el-input v-model="dataForm.userCard" :maxlength="50" placeholder="身份证号"></el-input>
      </el-form-item>
      <el-form-item label="性别" size="mini" prop="sex">
        <el-radio-group v-model="dataForm.sex">
          <template>
            <el-radio v-model="dataForm.sex" label="男">男</el-radio>
            <el-radio v-model="dataForm.sex" label="女">女</el-radio>
          </template>
        </el-radio-group>
      </el-form-item>
      <el-form-item class="formItem" label="所属机构">
        <el-input
          v-model="organizeInfo.groupName"
          disabled
          placeholder="所属机构"
        ></el-input>
        <el-button size="mini" @click="changeOrganize">选择机构</el-button>
      </el-form-item>
    </el-form>
    <div class="footer">
      <el-button @click="reSetting">重置</el-button>
      <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
    </div>
    <organize-tree-dialog ref="organizeDialog" :organize-info.sync="organizeInfo"/>
  </div>
</template>
<script>
import { mapActions } from 'vuex'
import { getStore } from '@/utils/mUtils.js'
import organizeTreeDialog from '@/components/organize/organizeTreeDialog'
import {validatePhoneTwo, validateEmail, validateId} from '@/utils/validate'
export default {
  components: {
    organizeTreeDialog
  },
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
      } else if (this.dataForm.plainPassword !== value) {
        callback(new Error('确认密码与密码输入不一致'))
      } else {
        callback()
      }
    }
    return {
      organizeVisible: false,
      treeSelectTag: 0,
      treeDefaultKey: [],
      organizeInfo: {
        groupCode: '',
        groupName: ''
      },
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
        storedKey: '',
        serverKey: '',
        salt: '',
        iterations: '',
        email: '',
        roleType: 'admin',
        userCard: '',
        telephone: '',
        groupRootCode: getStore('userinfo').groupCode
      },
      dataRule: {
        username: [
          { required: true, message: '用户名不能为空', trigger: 'blur' }
        ],
        name: [{ required: true, message: '真实姓名不能为空', trigger: 'blur' }],
        groupCode: [{ required: true, message: '请选择组织', trigger: 'blur' }],
        plainPassword: [{ required: true, validator: validatePassword, trigger: 'blur' }],
        comfirmPassword: [
          { required: true, validator: validateComfirmPassword, trigger: 'blur' }
        ],
        telephone: [{ validator: validatePhoneTwo , trigger : 'blur'}],
        email: [{ validator: validateEmail , trigger : 'blur'}],
        userCard: [{ validator: validateId , trigger : 'blur'}]
      },
      userCount: 0
    }
  },
  mounted() {
    this.initTree()
  },
  methods: {
    // return this.$store.dispatch(this.$store, true) 异步请求
    //dispatch：含有异步操作，数据提交至 actions ，可用于向后台提交数据
    //commit：同步操作，数据提交至 mutations ，可用于登录成功后读取用户信息写到缓存里
    ...mapActions(['GetUserCount', 'getTree', 'SaveUser']),
    validateUserName() {
      if (this.dataForm.username !== '') {
        this.GetUserCount(this.dataForm.username).then(response => {
          this.userCount = response
          if (response > 0) {
            this.$message({
              message: '该用户名已存在，请重新输入',
              type: 'warning'
            })
            return false
          } else {
            return true
          }
        }).catch(error => { console.log(error) })
      }
    },
    validateOrganize() {
      if (this.organizeInfo.groupName === '') {
        this.$message({
          message: '请选择所属机构',
          type: 'warning'
        })
        return false
      }
      return true
    },
    reSetting() {
      this.$refs['dataForm'].resetFields()
    },
    changeOrganize() {
      console.log('选择树')
      this.$refs.organizeDialog.organizeVisible = true
    },
    initTree() {
      const userinfo = getStore('userinfo')
      this.getTree(userinfo.groupCode)
        .then(data => {
          this.treeData = data
        })
        .catch(() => {})
    },
    // 表单提交
    dataFormSubmit() {
      console.log('提交用户')
      if (this.userCount > 0) {
        this.$message({
          message: '该用户名已存在，请重新输入',
          type: 'warning'
        })
        return
      }
      if (this.organizeInfo.groupName === '') {
        this.$message({
          message: '请选择所属机构',
          type: 'warning'
        })
        return
      }
      this.dataForm.groupCode = this.organizeInfo.groupCode
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          //保存用户
          this.SaveUser(this.dataForm).then(data => {
            if (data) {
              this.$message({
                message: '操作成功',
                type: 'success'
              })
              this.$router.push('/index')
            } else {
              this.$message.error('操作失败')
            }
          })
        }
      })
    },
    treeCheckChange(data, checked, indeterminate) {
      this.treeSelectTag++
      if (this.treeSelectTag % 2 === 0) {
        if (checked) {
          this.$refs.groupTree.setCheckedNodes([])
          this.$refs.groupTree.setCheckedNodes([data])
        } else {
          this.$refs.groupTree.setCheckedNodes([])
        }
      }
      const currentNode = this.$refs.groupTree.getCheckedNodes()
      console.log(currentNode)
      if (currentNode.length > 0) {
        this.dataForm.groupCode = currentNode[0].id
        let groupName = currentNode[0].label
        if (groupName.indexOf('-') > 0) {
          groupName = groupName.substr(0, groupName.indexOf('-'))
        }
        this.dataForm.groupName = groupName
      } else {
        this.dataForm.groupCode = ''
        this.dataForm.groupName = ''
      }
    }
  }
}
</script>

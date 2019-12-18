<template>
  <div>
    <el-form
      ref="dataForm"
      :model="dataForm"
      :rules="dataRule"
      label-width="80px"
    >
      <el-form-item label="用户名" class="formItem" prop="username">
        <el-input v-model="dataForm.username" :maxlength="100" disabled placeholder="用户名"/>
      </el-form-item>
      <el-form-item label="真实姓名" class="formItem" prop="name">
        <el-input v-model="dataForm.name" :maxlength="50" placeholder="真实姓名"/>
      </el-form-item>
      <el-form-item class="formItem" label="密码" prop="plainPassword">
        <el-input
          v-model="dataForm.plainPassword"
          :maxlength="16"
          type="password"
          placeholder="密码"
        />
      </el-form-item>
      <el-form-item class="formItem" label="确认密码" prop="comfirmPassword">
        <el-input
          v-model="dataForm.comfirmPassword"
          :maxlength="16"
          type="password"
          placeholder="确认密码"
        />
      </el-form-item>
      <el-form-item label="联系电话" class="formItem" prop="telephone">
        <el-input v-model="dataForm.telephone" :maxlength="50" placeholder="联系电话"/>
      </el-form-item>
      <el-form-item label="邮箱" class="formItem" prop="email">
        <el-input v-model="dataForm.email" :maxlength="50" placeholder="邮箱"/>
      </el-form-item>
      <el-form-item label="身份证号" class="formItem" prop="userCard">
        <el-input v-model="dataForm.userCard" :maxlength="50" placeholder="身份证号"/>
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
        />
        <el-button size="mini" @click="changeOrganize">选择机构</el-button>
      </el-form-item>
    </el-form>
    <div class="footer">
      <el-button @click="reSetting">重置</el-button>
      <el-button type="primary" @click="onSubmit()">确定</el-button>
    </div>
    <organize-tree-dialog ref="organizeDialog" :checked-group="checkedGroup" :organize-info.sync="organizeInfo"/>
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
      // console.log('password======', this.dataForm.comfirmPassword)
      if (!this.dataForm.id && !/\S/.test(this.dataForm.comfirmPassword)) {
        callback(new Error('确认密码不能为空'))
      } else if (this.dataForm.plainPassword !== this.dataForm.comfirmPassword) {
        // console.log('plainPassword And password', this.dataForm.plainPassword, this.dataForm.comfirmPassword)
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
      organizeInfoBak:{},
      checkedGroup: [],
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
        roleType: 'admin',
        salt: '',
        iterations: '',
        email: '',
        userCard: '',
        telephone: ''
      },
      dataFormBak: {},
      dataRule: {
        username: [{ required: true, message: '用户名不能为空', trigger: 'blur' }],
        name: [{ required: true, message: '真实姓名不能为空', trigger: 'blur' }],
        groupCode: [{ required: true, message: '请选择组织', trigger: 'blur' }],
        plainPassword: [{ required: true, validator: validatePassword, trigger: 'blur' }],
        comfirmPassword: [{ required: true ,validator: validateComfirmPassword, trigger: 'blur' }],
        telephone: [{ validator: validatePhoneTwo , trigger : 'blur'}],
        email: [{ validator: validateEmail , trigger : 'blur'}],
        userCard: [{ validator: validateId , trigger : 'blur'}]
      }
    }
  },
  created() {
    //this.initData()
  },
  mounted() {
    this.initData()
    this.getOrganizeInfo()
    this.initTree()
  },
  methods: {
    ...mapActions(['GetUserCount', 'getTree', 'SaveUser', 'GetGroupMessage']),
    onSubmit() {
      this.GetUserCount(this.dataForm.username).then(response => {
        if (response >= 2) {
          this.$message({
            message: '该用户名已存在，请重新填写',
            type: 'warning'
          })
        } else {
          this.dataFormSubmit()
        }
      }).catch(error => { console.log(error) })
    },
    getOrganizeInfo() {
      console.log('groupCode===', this.dataForm.groupCode)
      this.GetGroupMessage(this.dataForm.groupCode).then(response => {
        this.organizeInfo.groupName = response.groupName
        this.organizeInfo.groupCode = response.code
        if (this.organizeInfo.groupCode) {
          this.checkedGroup.push(this.organizeInfo.groupCode)
        }

        Object.assign(this.organizeInfoBak, this.organizeInfo)

      }).catch(error => { console.log(error) })
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
    //重置文本框信息
    reSetting() {
      this.$refs.dataForm.resetFields(); 
      //Object.assign(目标对象，源对象)  将源对象的数据复制到目标对象中，并返回目标对象
      Object.assign(this.dataForm, this.dataFormBak)
      Object.assign(this.organizeInfo, this.organizeInfoBak)
      //console.log("确认密码：" + this.dataForm.comfirmPassword)
      this.checkedGroup = []
      this.checkedGroup.push(this.organizeInfo.groupCode)
    },
    changeOrganize() {
      console.log('选择树')
      this.$refs.organizeDialog.organizeVisible = true
    },
    initData() {
      //接收参数
      this.dataForm = this.$route.query.params
      console.log(JSON.stringify(this.dataForm ))
      Object.assign(this.dataFormBak, this.dataForm)
    },
    initTree() {
      const userinfo = getStore('userinfo')
      this.getTree(userinfo.groupCode)
        .then(data => {
          this.treeData = data
        })
        .catch(() => {})
    },
    // 表单提交  修改用户信息
    dataFormSubmit() {
      if (this.validateOrganize()) {
        this.dataForm.groupCode = this.organizeInfo.groupCode
        this.$refs['dataForm'].validate(valid => {
          if (valid) {
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
      }
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

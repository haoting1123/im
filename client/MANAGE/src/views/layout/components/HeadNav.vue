<template>
  <div id="header_container" class="head-nav">
    <el-row style="margin:0 10px; height: 70px;" center="true">
      <el-col :span="7" class="logo-container">
        <!-- <img src="../../../assets/logo.png" class="logo" alt=""> -->
        <span class="title">即时通管理平台</span>
      </el-col>
      <div class="userinfo">
        <!-- <img src="../../../assets/logo.png" class="avatar" alt=""> -->
        <div class="welcome">
          <span class="name comename">欢迎您，{{ userinfo.username }}</span>
          <span class="name comename"/>
        </div>
        <span class="username">
          <el-dropdown trigger="click">
            <span class="el-dropdown-link">
              <i class="el-icon-caret-bottom el-icon--right"/>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item>
                <span style="display:block;" @click="onEditPassword">修改密码</span>
              </el-dropdown-item>
              <el-dropdown-item divided>
                <span style="display:block;" @click="confirmLogout">注销</span>
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </span>
        <i class="fa fa-sign-out logout" @click="confirmLogout"/>
      </div>
      <div class="notify-row">
        <ul class="top-menu">
          <li class="li-badge">
            <el-tooltip effect="light" content="全屏" placement="bottom">
              <!--<screenfull class="screenfull right-menu-item"></screenfull>-->
            </el-tooltip>
          </li>
          <li class="li-badge" style="display: none;">
            <a href="#/index">
              <el-badge :value="6" class="item one">
                <i class="fa fa-tasks"/>
              </el-badge>
            </a>
          </li>
          <li class="li-badge" style="display: none;">
            <a href="#/index">
              <el-badge :value="12" class="item two">
                <i class="fa fa-envelope-o"/>
              </el-badge>
            </a>
          </li>
          <li class="li-badge" style="display: none;">
            <a href="#/index">
              <el-badge :value="34" class="item three">
                <i class="fa fa-bell-o"/>
              </el-badge>
            </a>
          </li>
        </ul>
      </div>
    </el-row>
    <div>
      <el-dialog :visible.sync="dialog.show" :modal-append-to-body="false" title="修改用户信息" width="400px">

        <el-form ref="form" :model="form" :rules="form_rules" :label-width="dialog.formLabelWidth" >
          <el-form-item prop="oldPass" label="原密码:" width="150px;" >
            <el-input v-model="form.oldPass" placeholder="请输入原密码" @blur="validataPwdInfo"/>
          </el-form-item>
          <el-form-item prop="plainPassword" label="新密码:">
            <el-input v-model="form.plainPassword" placeholder="请输入新密码"/>
          </el-form-item>
          <el-form-item prop="confirmPass" label="确认密码:">
            <el-input v-model="form.confirmPass" placeholder="请再输入一次新密码"/>
          </el-form-item>
          <el-form-item prop="telephone" label="联系电话:" width="150px;" >
            <el-input v-model="form.telephone" placeholder="请输入联系电话"/>
          </el-form-item>
          <el-form-item class="text_right">
            <el-button @click="dialog.show = false">取 消</el-button>
            <el-button type="primary" @click="onSubmit(&quot;form&quot;)">提 交</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>
    </div>
  </div>

</template>

<script>
import { mapActions } from 'vuex'
import { getStore, removeStore } from '@/utils/mUtils.js'
import { removeToken } from '@/utils/auth' // 验权
export default {
  name: 'HeadNav',
  components: {
    // Screenfull
  },
  data() {
    // eslint-disable-next-line no-unused-vars
    var validatePassword = (rule, value, callback) => {
      if (!this.dataForm.id && !/\S/.test(value)) {
        callback(new Error('密码不能为空'))
      } else {
        callback()
      }
    }
    // eslint-disable-next-line no-unused-vars
    var validateComfirmPassword = (rule, value, callback) => {
      if (!this.dataForm.id && !/\S/.test(value)) {
        callback(new Error('确认密码不能为空'))
      } else if (this.dataForm.plainPassword !== value) {
        callback(new Error('确认密码与新密码输入不一致'))
      } else {
        callback()
      }
    }
    return {
      userinfo: {},
      serverName: '',
      // isShowService:false,
      dialogFormVisible: false,
      form: {
        oldPass: '',
        plainPassword: '',
        comfirmPassword: '',
        telephone: ''
      },
      // 详情弹框信息
      dialog: {
        width: '400px',
        show: false,
        title: '修改密码',
        formLabelWidth: '100px'
      },
      form_rules: {
        oldPass: [
          { required: true, message: '原密码不能为空！', trigger: 'blur' }
        ],
        telephone: [{ required: true, message: '请输入联系电话', trigger: 'blur' }],
        plainPassword: [
          { required: true, message: '新密码不能为空！', trigger: 'blur' }
        ],
        confirmPass: [
          { required: true, message: '确认密码不能为空！', trigger: 'blur' }
        ]
      },
      checkPwd: ''
    }
  },
  created() {

  },
  mounted() {
    // 获取详细信息
    this.userinfo = getStore('userinfo')
    console.log('this.userinfo=======', this.userinfo)
  },
  methods: {
    ...mapActions(['LogOut', 'ValidataPwd', 'AddUserAdmin', 'EditUserAdmin']),
    validataPwdInfo() {
      if (this.form.oldPass === '') {
        return
      }
      const dataParam = {
        id: this.userinfo.id,
        oldPwd: this.form.oldPass
      }
      this.ValidataPwd(dataParam).then(response => {
        this.checkPwd = response
        if (!response) {
          this.$message({
            message: '原密码输入错误，请重新输入',
            type: 'warning'
          })
        }
      }).catch(error => { console.log(error) })
    },
    onSubmit(el) {
      console.log('this.checkPwd.id===', this.checkPwd.id)
      if (!this.checkPwd.id) {
        this.$message({
          message: '原密码输入错误,请重新输入',
          type: 'warning'
        })
        return
      }
      this.$refs['form'].validate(valid => {
        if (valid) {
          this.checkPwd.plainPassword = this.form.plainPassword
          this.checkPwd.telephone = this.form.telephone
          console.log('校验成功', this.checkPwd)
          this.AddUserAdmin(this.checkPwd).then(res => {
            this.$message({
              message: '操作成功',
              type: 'success'
            })
            this.dialog.show = false
          })
            .catch(() => {})
        }
      })
    },
    confirmLogout() {
      this.$confirm('确认注销当前用户?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.removeStore() // 删除缓存
          this.logout()
        })
        .catch(() => {})
    },
    onEditPassword() {
      this.dialog.show = true
    },
    // 删除缓存
    removeStore() {
      removeToken()
      removeStore('addRouFlag')
      removeStore('token')
      removeStore('userId')
      // this.$router.push({ path: this.redirect || '/login' })
    },
    logout() {
      if (this.userinfo) {
        this.LogOut(this.userinfo)
          .then(() => {
            // this.loading = false
            // removeStore('userinfo')
          })
          .catch(() => {
            // this.loading = false
          })
      }
    }
  }
}
</script>

<style scoped lang='less'>
.logo-container {
  line-height: 70px;
  min-width: 940px;
  margin-right: 15px;
  height: 70px;

  .logo {
    height: 47px;
    width: 47px;
    margin-right: 5px;
    vertical-align: middle;
    display: inline-block;
  }

  .title {
    vertical-align: middle;
    font-size: 30px;
    font-family: "华文隶书";
    letter-spacing: 3px;
    font-weight: bold;
    color: #ffffff;
  }
}
.right-menu-item {
  display: inline-block;
  margin: 0 8px;
}

.screenfull {
  padding-top: 15px;
  height: 20px;
}

.fa-user {
  position: relative;
  top: -2px;
  margin-right: 4px;
}

.head-nav {
  width: 100%;
  height: 70px;
  min-width: 600px;
  /*padding: 5px;*/
  background: #0481f7;
  position: fixed;
  top: 0px;
  left: 0px;
  z-index: 100;
  color: #fff;
  border-bottom: 1px solid #1f2d3d;

  .logout {
    vertical-align: middle;
    cursor: pointer;
  }
}

.checkDepart {
  width: 120px;
  height: 40px;
  font-size: 15px;
  margin-left: 35px;
  vertical-align: bottom;
  display: inline-block;
}

.userinfo {
  line-height: 60px;
  text-align: right;
  float: right;
}

.avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  vertical-align: middle;
  display: inline-block;
}

.welcome {
  display: inline-block;
  width: auto;
  vertical-align: middle;
  padding: 0 5px;

  .name {
    line-height: 20px;
    text-align: center;
    font-size: 14px;
  }

  .comename {
    font-size: 12px;
  }

  .avatarname {
    color: #a9d86e;
    font-weight: bolder;
  }
}

.username {
  cursor: pointer;
  margin-right: 5px;

  .el-dropdown {
    color: #fff;
  }
}

.border {
  border: 1px solid;
}

.notify-row {
  line-height: 60px;
  float: right;
  width: 50px;
  margin-right: 20px;
  margin-top: 5px;
}

ul.top-menu > li {
  float: left;
  margin-right: 20px;
}

ul.top-menu > li > a {
  color: #3bc5ff;
  font-size: 16px;
  border-radius: 4px;
  -webkit-border-radius: 4px;
  border: 1px solid #f0f0f8 !important;
  padding: 2px 6px 4px 6px;
}
</style>

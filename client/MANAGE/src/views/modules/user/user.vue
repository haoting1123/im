<template>
  <div class="mod-user">
    <el-form :inline="true" :model="dataForm">
      <el-form-item>
        <el-input v-model="dataForm.userName" placeholder="用户账号" clearable/>
      </el-form-item>
      <el-form-item>
        <el-button @click="getDataList()">查询</el-button>
        <el-button :disabled="addDisabled" type="primary" @click="addUser()">新增</el-button>
      </el-form-item>
    </el-form>
    <div style="text-align: right;">
      <el-form :inline="true">
        <el-form-item>
          <div style="padding-left: 50px">
            License有效截止日期：
            <el-tag >{{ licenseItem.expiredDate | formatDate }}</el-tag>
          </div>
        </el-form-item>
        <el-form-item>
          <div>
            可注册用户数量：
            <el-tag v-if="licenseItem.userCount > -1" type="success">{{ licenseItem.userCount }}个</el-tag>
          </div>
        </el-form-item>
        <el-form-item>
          <div>
            已注册用户数量：
            <el-tag v-if="registerUserCount > -1" type="warning">{{ registerUserCount }}个</el-tag>
          </div>
        </el-form-item>
        <el-form-item>
          <div>
            剩余注册用户数量：
            <el-tag v-if="surplusUserCount > -1" type="danger">{{ surplusUserCount }}个</el-tag>
          </div>
        </el-form-item>
      </el-form>
    </div>
    <el-table
      v-loading="dataListLoading"
      :data="dataList"
      border
      stripe
      row-key="id"
      style="width: 100%;">
      <el-table-column
        :index="typeIndex"
        type="index"
        label="序号"
        align="center"
        width="60"/>
      <el-table-column
        prop="username"
        align="center"
        label="用户账号"/>
      <el-table-column
        prop="name"
        align="center"
        label="真实姓名"/>
      <el-table-column
        prop="sex"
        align="center"
        width="100"
        label="性别"/>
      <el-table-column
        prop="email"
        align="center"
        width="200"
        label="邮箱"/>
      <el-table-column
        prop="telephone"
        align="center"
        width="200"
        label="联系电话"/>
      <el-table-column
        prop="userCard"
        align="center"
        width="200"
        label="身份证号码"/>
      <el-table-column
        prop="groupName"
        align="center"
        label="所属机构"/>
      <el-table-column
        prop="modificationDate"
        align="center"
        width="200"
        label="修改时间"/>
      <el-table-column
        prop="createDate"
        align="center"
        width="200"
        label="创建时间"/>
      <el-table-column
        fixed="right"
        header-align="center"
        align="center"
        width="150"
        label="操作">
        <template slot-scope="scope">
          <el-tooltip content="编辑用户" placement="bottom">
            <i class="optionIcon iconfont icon-xiugai" style="cursor: pointer;" @click="updateHandle(scope.row)"/>
          </el-tooltip>
          <el-tooltip content="删除用户" placement="bottom">
            <i
              class="optionIcon iconfont icon-shanchu"
              style="cursor: pointer;"
              @click="deleteHandle(scope.row.id)"/>
          </el-tooltip>
          <el-tooltip content="重置密码" placement="bottom">
            <i
              class="optionIcon iconfont icon-caidanbushu"
              style="cursor: pointer;"
              @click="resetPasswordHandle(scope.row)"/>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <div style="text-align: right;">
      <el-pagination
        :current-page="pageIndex"
        :page-sizes="[10, 20, 50, 100]"
        :page-size="pageSize"
        :total="totalPage"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="sizeChangeHandle"
        @current-change="currentChangeHandle"/>
    </div>

    <!-- 重置密码 -->
    <reset-password v-if="resetPasswordVisible" ref="resetPasswordDialog" :reset-password-visible.sync="resetPasswordVisible" :user-item="resetPasswordItem"/>
  </div>
</template>

<script>

import resetPassword from './resetPassword'
import moment from 'moment'
import { mapActions } from 'vuex'
import { getStore } from '@/utils/mUtils.js'

export default {
  // filters: {
  //   formatDate(time) {
  //     if (time === undefined || time === '') {
  //       return '无'
  //     }
  //     return moment(time).format('LL')
  //   }
  // },
  components: {
    resetPassword
  },
  data() {
    return {
      dataForm: {
        userName: ''
      },
      dataList: [],
      pageIndex: 1,
      pageSize: 10,
      totalPage: 0,
      dataListLoading: false,
      addOrUpdateVisible: false,
      resetPasswordVisible: false,
      resetPasswordItem: '',
      userinfo: '',
      licenseItem: '',
      registerUserCount: 0,
      surplusUserCount: 0,
      addDisabled: true,
      userCount: 0
    }
  },
  created() {
    this.userinfo = getStore('userinfo')
    this.getLicenseInfo()
    this.getDataList()
  },
  mounted() {

  },
  methods: {
    ...mapActions(['GetUserPage', 'DelUserById', 'GetLicense']),
    getLicenseInfo() {
      this.GetLicense(this.userinfo.groupCode).then(response => {
        this.licenseItem = response
        if (this.licenseItem.userCount > 0) {
          // 显示新增按钮
          this.addDisabled = false
        } else {
          // 隐藏新增按钮
          this.addDisabled = true
        }
      })
    },
    compputedUser() {
      this.surplusUserCount = this.licenseItem.userCount - this.registerUserCount
      if(!this.surplusUserCount){
        this.surplusUserCount = 0
      }
      this.userCount = this.licenseItem.userCount
      // 如果已注册用户数大于或等于申请的用户数，则禁用新增按钮
      if (this.registerUserCount >= this.userCount) {
        this.addDisabled = true
      } else {
        this.addDisabled = false
      }
    },
    resetPasswordHandle(item) {
      this.resetPasswordVisible = true
      this.resetPasswordItem = item
    },
    updateHandle(item) {
      //给item添加数据，方便设置初始值
      this.$set(item, "comfirmPassword", item.plainPassword)
      //console.info(JSON.stringify(item))
      //query更加类似于我们ajax中get传参，params则类似于post。给url：/updateUser 传值query{}
      this.$router.push({ path: '/updateUser', query: { params: item }})
    },
    formatDate(time) {
      return moment(time).format('YYYY-MM-DD')
    },
    addUser() {
      this.$router.push('/addUser')
    },
    // 获取数据列表
    getDataList() {
      this.dataListLoading = true
      this.resetPasswordVisible = false
      const params = {
        'page': this.pageIndex,
        'size': this.pageSize,
        'userName': this.dataForm.userName,
        'rootGroupCode': this.userinfo.groupCode
      }
      this.GetUserPage(params)
        .then((data) => {
          if (data) {
            this.dataList = data.content
            this.totalPage = data.totalElements
            this.registerUserCount = data.totalElements
            this.compputedUser()// 获取License信息
          } else {
            this.dataList = []
            this.totalPage = 0
          }
          this.dataListLoading = false
        })
    },
    // 每页数
    sizeChangeHandle(val) {
      this.pageSize = val
      this.pageIndex = 1
      this.getDataList()
    },
    // 当前页
    currentChangeHandle(val) {
      this.pageIndex = val
      this.getDataList()
    },
    // 新增 / 修改
    addOrUpdateHandle(id) {
      this.addOrUpdateVisible = true
      this.$nextTick(() => {
        this.$refs.addOrUpdate.init(id)
      })
    },
    typeIndex(index) {
      // 自增序号
      return index + (this.pageIndex - 1) * 10 + 1
    },
    // 删除
    deleteHandle(id, username) {
      this.$confirm(`确定要删除该用户吗?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.DelUserById(id)
          .then((data) => {
            if (data) {
              this.$message({
                message: '操作成功',
                type: 'success',
                duration: 1500,
                onClose: () => {
                  this.dataForm.userName = ''
                  this.getDataList()
                }
              })
            } else {
              this.$message.error('操作失败')
            }
          })
          .catch((error) => { console.log(error) })
      }).catch(() => {})
    }
  }
}
</script>

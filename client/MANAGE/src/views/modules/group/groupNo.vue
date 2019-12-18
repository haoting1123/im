// 2019/12/6 修改
<template>
  <div>
    <el-form :inline="true">
      <el-form-item>
        <!-- <el-autocomplete :fetch-suggestions="querySearchAsync" v-model="organizeName" placeholder="机构名称" clearable/> -->
        <el-select v-model="organizeName" clearable filterable placeholder="请选择机构名称" @change="getGroupNoList">  
          <el-option
            v-for="item in groupNoList"
            :key="item.id"
            :label="item.groupName"
            :value="item.groupName"/>
        </el-select>
      </el-form-item>
      <el-collapse-transition>
        <el-form-item  v-show="show">  
          <el-input v-model="superOrgCode" placeholder="请输入上级机构编码"></el-input>
        </el-form-item>
      </el-collapse-transition>
      <el-collapse-transition>
        <el-form-item  v-show="show">
          <el-input v-model="orgCode" placeholder="请输入机构编码"></el-input>
        </el-form-item>
      </el-collapse-transition>
      <el-form-item>
        <el-button @click="getDataList()">查询</el-button>
        <el-button type="primary" @click="addGroupNo()">新增</el-button>
      </el-form-item>
      <el-form-item>
        <a ref="a1" @click="show = !show"><span>{{!show?'展开':'收起'}}</span><i ref="i1" :class="!show?'el-icon-arrow-right':'el-icon-arrow-left'"></i></a>
      </el-form-item>
    </el-form>

    <!-- 机构信息表 -->
    <el-table
      v-loading="dataListLoading"
      :data="dataList"
      border
      stripe
      style="width: 100%;"
    >
      <el-table-column
        type="index"
        :index="typeIndex"
        align="center"
        width="60"
        label="序号"></el-table-column>
      <el-table-column
        prop="groupName"
        header-align="center"
        align="center"
        label="机构名称"></el-table-column>
      <el-table-column
        prop="code"
        align="center"
        label="机构编码"></el-table-column>
      <el-table-column
        prop="superiorName"
        header-align="center"
        align="center"
        label="上级机构名称"></el-table-column>
      <el-table-column
        prop="superiorCode"
        align="center"
        label="上级机构编码"></el-table-column>
      <el-table-column
        prop="imLicense.releaseDate"
        align="center"
        label="授权文件生成日期"></el-table-column>
      <el-table-column
        prop="imLicense.userCount"
        align="center"
        label="授权用户数量"></el-table-column>>
      <el-table-column
        prop="imLicense.expiredDate"
        align="center"
        label="授权截止有效日期"></el-table-column>
      <el-table-column
        prop="imLicense.serviceLicense"
        align="center"
        label="服务号开关">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.serviceLicense"
            active-color="#13ce66"
            inactive-color="#dcdfe6"
            active-value="y"
            inactive-value="n"
          @change="updateServiceLisence(scope.row)">
          </el-switch>
        </template>
      </el-table-column>
      <el-table-column
        fixed="right"
        align="center"
        width="160"
        label="操作">
        <template slot-scope="scope">
          <el-tooltip content="编辑机构" placement="bottom">
            <i class="optionIcon iconfont icon-xiugai" style="cursor: pointer;" @click="updateHandle(scope.row)"></i>
          </el-tooltip>
          <el-tooltip content="删除机构" placement="bottom">
            <i
              class="optionIcon iconfont icon-shanchu"
              style="cursor: pointer;"
              @click="deleteHandle(scope.row.code)"></i>
          </el-tooltip>
          <!--<el-tooltip content="管理员维护" placement="bottom">-->
          <!--<i-->
          <!--class="optionIcon iconfont icon-guanliyuan"-->
          <!--style="cursor: pointer;"-->
          <!--@click="userManage(scope.row)"/>-->
          <!--</el-tooltip>-->
          <el-tooltip content="重置密码" placement="bottom">
            <i
              class="optionIcon iconfont icon-caidanbushu"
              style="cursor: pointer;"
              @click="resetPasswordHandle(scope.row)"></i>
          </el-tooltip>
          <el-tooltip content="生成授权文件" placement="bottom">
            <i
              class="optionIcon iconfont icon-shouquanbiaoshu"
              style="cursor: pointer;"
              @click="createLicenseFile(scope.row)"></i>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <div style="text-align: right; padding-top: 5px;">
      <el-pagination
        :current-page="pageIndex"
        :page-sizes="[10, 20, 50, 100]"
        :page-size="pageSize"
        :total="totalPage"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="sizeChangeHandle"
        @current-change="currentChangeHandle"></el-pagination>
    </div>

    <!-- 子组件  添加或修改非直属机构  执行完成后调用getDataList方法-->
    <add-or-update-group-no v-if="groupNoVisible" :group-no-item="groupNoItem" :title="title"
                            :group-no-visible.sync="groupNoVisible" @refreshDataList="getDataList"/>
    <!-- 添加或修改非直属机构对话框  -->
    <el-dialog
      :modal="false"
      :close-on-click-modal="false"
      :visible.sync="userVisible"
      title="管理员维护"
      width="500px"
      @close="cancelHanel"
    >
      <el-form
        ref="userForm"
        :model="userForm"
        :rules="dataRule"
        label-width="120px">
        <el-form-item label="管理员账号" prop="username">
          <el-input v-model="userForm.username" :maxlength="50" placeholder="请输入管理员账号" @blur="getUserCount"></el-input>
        </el-form-item>
        <el-form-item label="管理员密码" prop="plainPassword">
          <el-input v-model="userForm.plainPassword" :maxlength="60" type="password" placeholder="请输入管理员密码"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancelHanel()">取消</el-button>
        <el-button type="primary" @click="sumitUserAdmin()">确定</el-button>
      </span>
    </el-dialog>

    <!-- 生成授权文件对话框 -->
    <el-dialog
      :close-on-click-modal="false"
      :visible.sync="licenseVisible"
      :modal="false"
      title="生成授权文件"
      width="500px"
      @close="cancelLicenseHanel"
    >
      <el-form
        ref="licenseForm"
        :model="licenseForm"
        :rules="licenseRule"
        label-width="130px">
        <el-form-item label="机构名称" prop="groupName">
          {{ licenseForm.groupName }}
        </el-form-item>
        <el-form-item label="用户数量" prop="userCount">
          <el-input v-model="licenseForm.userCount" controls-position="right" style="width : 175px;"/>
        </el-form-item>
        <el-form-item label="有效期限(年)" prop="period">
          <el-input v-model="licenseForm.period" controls-position="right" style="width : 175px;">
            <template slot="append">年</template>
          </el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancelLicenseHanel()">取消</el-button>
        <el-button type="primary" @click="submitLicense()">确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import {mapActions} from 'vuex'
  import addOrUpdateGroupNo from './addOrUpdateGroupNo'
  import {numberLimits1,numberLimits2} from '@/utils/validate'
  export default {
    components: {
      addOrUpdateGroupNo
    },
    data() {
      return {
        msg: "展开",
        show: false,
        userForm: {
          id: '',
          username: '',
          plainPassword: '',
          groupCode: '',
          roleType: 'admin'
        },
        licenseForm: {
          userCount: 1,
          groupName: '',
          groupCode: '',
          period: 1
        },
        organizeName: '',
        superOrgCode: '', //上级机构编码
        orgCode: '', //机构编码
        superiorCode: '-1',
        dataList: [],
        pageIndex: 1,
        pageSize: 10,
        totalPage: 0,
        dataListLoading: false,
        dataListSelections: [],
        addOrUpdateVisible: false,
        groupNoVisible: false,
        userVisible: false,
        licenseVisible: false,
        groupNoList: [],
        groupNoItem: '',
        title: '',
        userAdmin: '',
        userCount: 0,
        dataRule: {
          userName: [
            {required: true, message: '管理员账号不能为空', trigger: 'blur'}
          ],
          plainPassword: [
            {required: true, message: '管理员密码不能为空', trigger: 'blur'}
          ]
        },
        licenseRule: {
          userCount: [
            //required代表必填项
            {required: true, message: '用户数量不能为空', trigger: 'blur'}, {validator : numberLimits1 , trigger : 'blur'}
          ],
          period: [
            {required: true, message: '有效期限不能为空', trigger: 'blur'}, {validator : numberLimits2 , trigger : 'blur'}
          ]
        }
      }
    },
    mounted() {
      this.getDataList()
      //this.getGroupNoList()
    },
    methods: {
      ...mapActions(['GetGroupNo', 'ResetAdminPassword', 'GetGroupNoList', 'delTreeNode', 'GetUserAdminByGroupCode',
        'AddUserAdmin', 'GetUserAdminCount', 'CreateLicense', 'UpdateServiceLisence']),

      show(){
        this.msg = "收起"
        this.$refs['i1'].className = "el-icon-arrow-left"
      },

      hide(){
        this.msg = "展开"
        this.$refs['i1'].className = "el-icon-arrow-right"
      },
      resetPasswordHandle(item) {
        console.log('重置密码', item)
        this.ResetAdminPassword(item.code).then(response => {
          this.$message({
            message: '密码重置成功，默认为6个1',
            type: 'success',
            duration: 3000
          })
        })
      },
      getUserAdmin(row) {
        this.GetUserAdminByGroupCode(row.code).then(data => {
          if (data && data.length > 0) {
            this.userAdmin = data
            this.userForm = this.userAdmin[0]
          } else {
            this.userForm.groupCode = row.code
          }
        }).catch(error => {
          console.log(error)
        })
      },
      getUserCount() {
        this.GetUserAdminCount(this.userForm.username).then(data => {
          this.userCount = data
        }).catch(error => {
          console.log(error)
        })
      },
      sumitUserAdmin() {
        if (this.userForm.id === '') {
          if (this.userCount >= 1) {
            this.$message({
              message: '该账号已存在，请重新填写账号',
              type: 'warning',
              duration: 1000
            })
            return
          }
        } else {
          if (this.userCount >= 2) {
            this.$message({
              message: '该账号已存在，请重新填写账号',
              type: 'warning',
              duration: 1000
            })
            return
          }
        }
        this.$refs['userForm'].validate(valid => {
          if (valid) {
            this.AddUserAdmin(this.userForm).then(data => {
              this.$message({
                message: '操作成功',
                type: 'success',
                duration: 1000,
                onClose: () => {
                  this.getDataList()
                  //this.getGroupNoList()
                }
              })
              this.userVisible = false
            }).catch(error => {
              console.log(error)
            })
          }
        })
      },
      userManage(row) {
        this.userVisible = true

        this.getUserAdmin(row)
      },
      cancelHanel() {
        this.userVisible = false
      },
      createLicenseFile(row) {
        this.licenseForm.groupCode = row.code
        this.licenseForm.groupName = row.groupName
        this.licenseVisible = true
      },
      //生成授权文件 
      submitLicense() {
        console.log("生成授权文件：" + this.licenseForm)
        this.$refs['licenseForm'].validate(valid =>{
          if(valid){
            this.CreateLicense(this.licenseForm)
            .then((data) => {
              console.log(data)
              this.$message({
                message: '操作成功，稍后自动下载授权文件',
                type: 'success',
                duration: 1000,
                onClose: () => {
                  this.cancelLicenseHanel()
                }
              })
              window.location.href = process.env.BASE_API + 'im/license/download/' + data.licenseId
              this.getDataList()
            })
            .catch((error) => {
              console.log(error)
            })
          }
        })
      },
      cancelLicenseHanel() {
        this.licenseVisible = false
      },
      dataFormSubmit() {

      },
      updateHandle(item) {
        this.title = '编辑'
        this.groupNoItem = item
        this.groupNoVisible = true
      },

      //删除组织机构 并删除其子机构、管理员信息、授权文件信息。并删除机构下用户信息
      deleteHandle(code) {
        console.log("deleteHandle()方法，删除机构号：" + code)
        this.$confirm(`确定要删除该组织机构吗?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.delTreeNode(code) //删除成功后继续删除管理员和授权文件和用户信息
            .then((data) => {
              this.$message({
                message: '操作成功',
                type: 'success',
                duration: 1000,
                onClose: () => {
                  this.organizeName = ''
                  this.getDataList()
                }
              })
            })
            .catch((error) => {
              console.log(error)
            })
        }).catch(() => {
        })
      },
      //开启新增组织机构对话框
      addGroupNo() {
        this.title = '新增'
        this.groupNoVisible = true
        this.groupNoItem = ''
      },
      querySearchAsync(queryString, cb) {
        var restaurants = this.groupNoList
        var results = queryString ? restaurants.filter(this.createStateFilter(queryString)) : restaurants
        clearTimeout(this.timeout)
        this.timeout = setTimeout(() => {
          cb(results)
        }, 3000 * Math.random())
      },
      createStateFilter(queryString) {
        return (state) => {
          return (state.groupName.indexOf(queryString) === 0)
        }
      },
      //获得组织机构编码
      getGroupNoList() {
        console.log("getGroupNoList()方法，下拉框组织机构查询，组织名：" + this.organizeName)
        const params = {
          groupName: this.organizeName
        }
        this.GetGroupNoList(params).then(data => {
          this.groupNoList = data
          console.log("getGroupNoList()方法，下拉框组织机构获得数据为：" + data)
          this.groupNoList.forEach(item => {
            item.value = item.groupName
          })
        }).catch(error => {
          console.log(error)
        })
      },
      // 获取数据列表
      getDataList() {
        console.log("getDataList()方法，查询的组织机构名为：" + this.organizeName)
        this.groupNoVisible = false
        this.dataListLoading = true
        const params = {
          page: this.pageIndex,
          size: this.pageSize,
          groupName: this.organizeName,
          superOrgCode: this.superOrgCode,
          orgCode: this.orgCode
        }
        console.log("getDataList()方法获得参数为：" + params.groupName)
        this.GetGroupNo(params).then(data => {
          if (data) {
            this.dataList = data.content;
            this.totalPage = data.totalElements
            //每次加载数据列表后  更新下拉框
            this.getGroupNoList()
          } else {
            this.dataList = [];
            this.totalPage = 0
          }
          this.dataListLoading = false
        }).catch(error => {
          console.log(error)
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
      // 多选
      selectionChangeHandle(val) {
        this.dataListSelections = val
      },
      // 新增 / 修改
      addOrUpdateHandle(id) {
        this.addOrUpdateVisible = true
        this.$nextTick(() => {
          this.$refs.addOrUpdateDlg.init(id)
        })
      },
      addCityHandle() {
        this.addCityVisible = true
        this.$nextTick(() => {
          this.$refs.addCityDlg.init(0)
        })
      },
      typeIndex(index) {
        //自增序号
        return index + (this.pageIndex - 1) * 10 + 1;
      },
      selectable(row, index) {
        return true
        // if (row.superiorCode === this.superiorCode) {
        //   return false
        // } else {
        //   return true
        // }
      },

      //服务号开关修改
      updateServiceLisence(row){
        let data = {
          code: row.code,
          yn: row.serviceLicense
        }
        this.UpdateServiceLisence(data)
          .then(data => {
            this.$message({
              message: '操作成功',
              type: 'success',
              duration: 1000,
              onClose: () => { }
            })
          }).catch(error => {
            console.log(error)
          })
      }
    }
  }
</script>


<style scoped>
a{
  color:
#1890ff;
  text-decoration: none;
  background-color:
  transparent;
  outline: 0;
  cursor: pointer;
  transition: color .3s;
  font-size: 14px;
  font-variant: tabular-nums;
  line-height: 1.5;
  list-style: none;
  font-feature-settings: "tnum";
}
</style>
<template>
  <div>
    <el-form :inline="true" :model="searchForm">
      <el-form-item>
        <el-input v-model="searchForm.name" placeholder="服务号名称" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="getDataList()">查询</el-button>
        <el-button type="primary" @click="addServiceNo()" :disabled="!serviceLisence">新增</el-button>
      </el-form-item>
    </el-form>
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
        prop="name"
        header-align="center"
        align="center"
        label="服务号名称"></el-table-column>
      <el-table-column
        prop="code"
        align="center"
        label="服务号编码"></el-table-column>
      <el-table-column
        prop="remark"
        header-align="center"
        align="center"
        label="描述"></el-table-column>
      <el-table-column
        fixed="right"
        align="center"
        width="160"
        label="操作">
        <template slot-scope="scope">
          <el-tooltip v-if="serviceLisence" content="选取人员" placement="bottom">
            <i class="optionIcon iconfont icon-renyuan" style="cursor: pointer;" @click="selectUserHandle(scope.row)"></i>
          </el-tooltip>
          <el-tooltip v-if="serviceLisence" content="编辑服务号" placement="bottom">
            <i class="optionIcon iconfont icon-xiugai" style="cursor: pointer;" @click="updateHandle(scope.row)"></i>
          </el-tooltip>
          <el-tooltip content="删除服务号" placement="bottom">
            <i
              class="optionIcon iconfont icon-shanchu"
              style="cursor: pointer;"
              @click="deleteHandle(scope.row.id)"></i>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
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
    <el-dialog
      :title="dialogTitle"
      :modal="false"
      :close-on-click-modal="false"
      width="500px"
      :visible.sync="addVisible">
      <el-form ref="dataForm" :model="dataForm" :rules="dataRule" label-width="100px">
        <el-form-item label="服务号编码" prop="code">
          <el-input v-model="dataForm.code" :maxlength="32" placeholder="服务号编码" ></el-input>
        </el-form-item>
        <el-form-item label="服务号名称" prop="name">
          <el-input v-model="dataForm.name" :maxlength="20" placeholder="服务号名称"></el-input>
        </el-form-item>
        <el-form-item label="服务号简述" prop="remark">
          <el-input type="textarea" v-model="dataForm.remark" :maxlength="666" placeholder="服务号简述"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addVisible = false">取消</el-button>
      <el-button type="primary" @click="saveServiceNo()">确定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="选取人员"
      :modal="false"
      :close-on-click-modal="false"
      width="500px"
      :visible.sync="selectUserVisible">
      <el-tree
        ref="groupTreeAndUser"
        :data="treeUserData"
        :default-expanded-keys="treeCheckUser"
        :expand-on-click-node="false"
        show-checkbox
        node-key="id"
        accordion
        @check-change="treeCheckChange"
      ></el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="selectUserVisible = false">取消</el-button>
        <el-button type="primary" @click="saveServiceNoUser()">确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import {mapActions} from 'vuex'
  import { getStore } from '@/utils/mUtils.js'

  export default {

    components: {
    },
    data() {
      return {
        searchForm: {
          name: ''
        },
        dataForm: {
          id: '',
          groupRootCode: '',
          name: '',
          code: '',
          remark: ''
        },
        dialogTitle: '新增',
        dataList: [],
        treeUserData: [],
        treeCheckUser: [],
        currenServiceCode: '',
        serviceLisence: false,
        pageIndex: 1,
        pageSize: 10,
        totalPage: 0,
        addVisible: false,
        selectUserVisible: false,
        dataListLoading: false,
        userinfo: {},
        dataRule: {
          name: [
            {required: true, message: '请输入服务号名称', trigger: 'blur'}
          ],
          code: [
            {required: true, message: '请输入服务号编码', trigger: 'blur'}
          ]
        }
      }
    },
    mounted() {
      this.userinfo = getStore('userinfo')
      this.dataForm.groupRootCode = this.userinfo.groupCode
      this.getServiceLisence(this.userinfo.groupCode)
      this.getDataList()
      this.getTreeAndUserData()
    },
    methods: {
      ...mapActions(['GetServiceNoListPage', 'AddServiceNo', 'UpdateServiceNoById', 'DelServiceNo', 'GetGroupTreeAndUser',
        'SavaServiceNoUser', 'GetServiceNoUser', 'GetServiceLisence']),

      deleteHandle(id) {
        this.$confirm(`确定要删除服务号吗?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.DelServiceNo(id)
            .then((data) => {
              this.$message({
                message: '操作成功',
                type: 'success',
                duration: 1000,
                onClose: () => {
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
      selectUserHandle(row){
        this.selectUserVisible = true
        this.currenServiceCode = row.code
        this.GetServiceNoUser(row.code)
          .then((data) => {
            this.treeCheckUser = []
            for(let item of data){
              this.treeCheckUser.push(item.username)
            }
            this.$refs.groupTreeAndUser.setCheckedKeys(this.treeCheckUser)
          })
          .catch((error) => {
            console.log(error)
          })
      },
      treeCheckChange(data, checked, indeterminate) {
        const currentNode = this.$refs.groupTreeAndUser.getCheckedNodes()
        this.treeCheckUser = []
        for(let item of currentNode){
          if(item.sign == 'user'){
            this.treeCheckUser.push(item.id)
          }
        }
      },
      saveServiceNoUser(){
        let data = {
          serviceCode: this.currenServiceCode,
          usernames: this.treeCheckUser
        }
        this.SavaServiceNoUser(data)
          .then((data) => {
            this.$message({
              message: '操作成功',
              type: 'success',
              duration: 1000,
              onClose: () => {
                this.selectUserVisible = false
              }
            })
          })
          .catch((error) => {
            console.log(error)
          })
      },
      addServiceNo() {
        this.dialogTitle = '新增'
        this.addVisible = true
        this.resetFields()
      },
      updateHandle(row){
        this.dialogTitle = '修改'
        this.addVisible = true
        this.dataForm = JSON.parse(JSON.stringify(row))
      },
      saveServiceNo(){
        if(this.dataForm.id){
          // 修改
          this.UpdateServiceNoById(this.dataForm)
            .then((data) => {
              this.$message({
                message: '操作成功',
                type: 'success',
                duration: 1000,
                onClose: () => {
                  this.getDataList()
                  this.addVisible = false
                }
              })
            })
            .catch((error) => {
              console.log(error)
            })
          return ;
        }
        // 新增
        this.AddServiceNo(this.dataForm)
          .then((data) => {
            if(data){
              this.$message({
                message: '操作成功',
                type: 'success',
                duration: 1000,
                onClose: () => {
                  this.getDataList()
                  this.addVisible = false
                }
              })
            }else{
              this.$message({
                message: '编码已存在',
                type: 'warning',
                duration: 1000,
                onClose: () => {
                }
              })
            }
          })
          .catch((error) => {
            console.log(error)
          })
      },
      getTreeAndUserData(){
        this.GetGroupTreeAndUser(this.userinfo.groupCode)
        .then(data => {
          this.treeUserData = data
        }).catch(error => {
          console.log(error)
        })
      },
      // 获取数据列表
      getDataList() {
        this.dataListLoading = true
        const params = {
          page: this.pageIndex - 1,
          size: this.pageSize,
          groupRootCode: this.dataForm.groupRootCode
        }
        if(this.searchForm.name != ''){
          params.name = this.searchForm.name
        }
        this.GetServiceNoListPage(params).then(data => {
          if (data) {
            this.dataList = data.content
            this.totalPage = data.totalElements
          } else {
            this.dataList = []
            this.totalPage = 0
          }
          this.dataListLoading = false
        }).catch(error => {
          console.log(error)
        })
      },
      getServiceLisence(code){
        this.GetServiceLisence(code)
          .then(data => {
            this.serviceLisence = data == 'y' ? true : false
          }).catch(error => {
            console.log(error)
          })
      },
      resetFields(){
        // if(this.$refs['dataForm'] != undefined){
        //   this.$refs['dataForm'].resetFields()
        // }
        this.dataForm.id = ''
        this.dataForm.name = ''
        this.dataForm.code = ''
        this.dataForm.remark = ''
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
      typeIndex(index) {
        //自增序号
        return index + (this.pageIndex - 1) * 10 + 1;
      }
    }
  }
</script>

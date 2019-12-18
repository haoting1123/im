<template>
  <div>
    <el-form :inline="true" :model="searchForm">
      <el-form-item>
        <el-input v-model="searchForm.name" placeholder="小程序名称" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="getDataList()">查询</el-button>
        <el-button type="primary" @click="addHandler()">新增</el-button>
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
        label="小程序名称"></el-table-column>
      <el-table-column
        prop="code"
        align="center"
        label="小程序编码"></el-table-column>
      <el-table-column
        prop="url"
        align="center"
        label="小程序地址"></el-table-column>
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
          <el-tooltip content="编辑小程序" placement="bottom">
            <i class="optionIcon iconfont icon-xiugai" style="cursor: pointer;" @click="updateHandle(scope.row)"></i>
          </el-tooltip>
          <el-tooltip content="删除小程序" placement="bottom">
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
        <el-form-item label="小程序编码" prop="code">
          <el-input v-model="dataForm.code" :maxlength="32" placeholder="小程序编码" ></el-input>
        </el-form-item>
        <el-form-item label="小程序名称" prop="name">
          <el-input v-model="dataForm.name" :maxlength="20" placeholder="小程序名称"></el-input>
        </el-form-item>
        <el-form-item label="小程序地址" prop="url">
          <el-input v-model="dataForm.url" :maxlength="400" placeholder="小程序地址"></el-input>
        </el-form-item>
        <el-form-item label="服务号简述" prop="remark">
          <el-input type="textarea" v-model="dataForm.remark" :maxlength="666" placeholder="小程序简述"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addVisible = false">取消</el-button>
      <el-button type="primary" @click="saveHandler()">确定</el-button>
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
          url: '',
          name: '',
          code: '',
          remark: ''
        },
        dialogTitle: '新增',
        dataList: [],
        pageIndex: 1,
        pageSize: 10,
        totalPage: 0,
        addVisible: false,
        dataListLoading: false,
        userinfo: {},
        dataRule: {
          name: [
            {required: true, message: '请输入小程序名称', trigger: 'blur'}
          ],
          code: [
            {required: true, message: '请输入小程序编码', trigger: 'blur'}
          ],
          url: [
            {required: true, message: '请输入小程序地址', trigger: 'blur'}
          ]
        }
      }
    },
    mounted() {
      this.userinfo = getStore('userinfo')
      this.getDataList()
    },
    methods: {
      ...mapActions(['GetMiniProgramList', 'AddMiniProgram', 'UpdateMiniProgram', 'DelMiniProgram']),

      deleteHandle(id) {
        this.$confirm(`确定要删除服务号吗?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.DelMiniProgram(id)
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
      addHandler() {
        this.dialogTitle = '新增'
        this.addVisible = true
        this.resetFields()
      },
      updateHandle(row){
        this.dialogTitle = '修改'
        this.addVisible = true
        this.dataForm = JSON.parse(JSON.stringify(row))
      },
      //新增小程序
      saveHandler(){
        this.$refs['dataForm'].validate(valid => {
          if(valid){
            if(this.dataForm.id){
            // 修改
            this.UpdateMiniProgram(this.dataForm)
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
          this.AddMiniProgram(this.dataForm)
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
          }
        })
      },
      // 获取数据列表
      getDataList() {
        this.dataListLoading = true
        const params = {
          page: this.pageIndex - 1,
          size: this.pageSize
        }
        if(this.searchForm.name != ''){
          params.name = this.searchForm.name
        }
        this.GetMiniProgramList(params).then(data => {
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
      resetFields(){
        // if(this.$refs['dataForm'] != undefined){
        //   this.$refs['dataForm'].resetFields()
        // }
        this.dataForm.id = ''
        this.dataForm.name = ''
        this.dataForm.code = ''
        this.dataForm.url = ''
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

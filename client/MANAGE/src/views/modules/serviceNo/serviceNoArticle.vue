<template>
  <div>
    <el-form :inline="true" :model="searchForm">
      <el-form-item>
        <el-input v-model="searchForm.title" placeholder="文章标题" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="getDataList()">查询</el-button>
        <el-button type="primary" @click="addServiceNoArticle()" :disabled="!serviceLisence">新增</el-button>
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
        prop="serviceName"
        header-align="center"
        align="center"
        label="服务号名称"></el-table-column>
      <el-table-column
        prop="title"
        align="center"
        label="文章标题"></el-table-column>
      <el-table-column
        prop="url"
        align="center"
        label="文章地址"></el-table-column>
      <el-table-column
        prop="remark"
        header-align="center"
        align="center"
        label="简述"></el-table-column>
      <el-table-column
        fixed="right"
        align="center"
        width="160"
        label="操作">
        <template slot-scope="scope">
          <el-tooltip content="删除文章" placement="bottom">
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
        <el-form-item label="选择服务号" prop="serviceCode">
          <el-select v-model="dataForm.serviceCode" clearable filterable placeholder="请选择服务号">
            <el-option
              v-for="item in serviceNoList"
              :key="item.code"
              :label="item.name"
              :value="item.code"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="文章标题" prop="title">
          <el-input v-model="dataForm.title" :maxlength="80" placeholder="文章标题" ></el-input>
        </el-form-item>
        <el-form-item label="文章地址" prop="url">
          <el-input v-model="dataForm.url" :maxlength="450" placeholder="文章地址"></el-input>
        </el-form-item>
        <el-form-item label="文章简述" prop="remark">
          <el-input type="textarea" v-model="dataForm.remark" :maxlength="666" placeholder="文章简述"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addVisible = false">取消</el-button>
      <el-button type="primary" @click="saveServiceNoArticle()">确定</el-button>
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
          title: ''
        },
        dataForm: {
          id: '',
          serviceCode: '',
          title: '',
          url: '',
          remark: ''
        },
        groupRootCode: '',
        dialogTitle: '新增',
        dataList: [],
        serviceNoList: [],
        pageIndex: 1,
        pageSize: 10,
        totalPage: 0,
        addVisible: false,
        dataListLoading: false,
        serviceLisence: false,
        userinfo: {},
        dataRule: {
          serviceCode: [
            {required: true, message: '请选择服务号', trigger: 'blur'}
          ],
          title: [
            {required: true, message: '请输入文章标题', trigger: 'blur'}
          ],
          url: [
            {required: true, message: '请输入文章地址', trigger: 'blur'}
          ]
        }
      }
    },
    mounted() {
      this.userinfo = getStore('userinfo')
      this.groupRootCode = this.userinfo.groupCode
      this.getServiceLisence(this.userinfo.groupCode)
      this.getDataList()
      this.getServiceNoList()
    },
    methods: {
      ...mapActions(['GetServiceNoListByGcode', 'GetServiceNoArticleListPage', 'AddServiceNoArticle', 'DelServiceNoArticle', 'GetServiceLisence']),


      getServiceLisence(code){
        this.GetServiceLisence(code)
          .then(data => {
            this.serviceLisence = data == 'y' ? true : false
          }).catch(error => {
          console.log(error)
        })
      },
      deleteHandle(id) {
        this.$confirm(`确定要删除文章吗?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.DelServiceNoArticle(id)
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
      addServiceNoArticle() {
        this.dialogTitle = '新增'
        this.addVisible = true
        this.resetFields()
      },
      saveServiceNoArticle(){
        // 新增
        this.AddServiceNoArticle(this.dataForm)
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
      },
      // 获取数据列表
      getDataList() {
        this.dataListLoading = true
        const params = {
          page: this.pageIndex,
          size: this.pageSize,
          gcode: this.groupRootCode
        }
        if(this.searchForm.title != ''){
          params.title = this.searchForm.title
        }
        this.GetServiceNoArticleListPage(params).then(data => {
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
      getServiceNoList(){
        this.GetServiceNoListByGcode(this.groupRootCode).then(data => {
          if (data) {
            this.serviceNoList = data
          }
        }).catch(error => {
          console.log(error)
        })
      },
      resetFields(){
        // if(this.$refs['dataForm'] != undefined){
        //   this.$refs['dataForm'].resetFields()
        // }
        this.dataForm.id = ''
        this.dataForm.serviceCode = ''
        this.dataForm.title = ''
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

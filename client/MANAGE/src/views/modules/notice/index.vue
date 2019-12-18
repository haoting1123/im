<template>
  <div class="mod-user">
    <el-form :inline="true" :model="searchForm" @keyup.enter.native="getDataList()">
      <el-form-item label="标题">
        <el-input v-model="searchForm.title" placeholder="标题" clearable/>
      </el-form-item>
      <el-form-item label="公告内容">
        <el-input v-model="searchForm.content" placeholder="公告内容" clearable/>
      </el-form-item>
      <!-- <el-form-item label="开始时间">
        <el-input type="date" v-model="searchForm.startTime" placeholder="开始时间" clearable/>
      </el-form-item>
      <el-form-item label="结束时间">
        <el-input type="date" v-model="searchForm.endTime" placeholder="结束时间" clearable/>
      </el-form-item> -->
      <el-form-item label="日期区间">
        <el-date-picker
        v-model="searchForm.time"
        type="datetimerange"
        format="yyyy-MM-dd HH:mm:ss"
        value-format="yyyy-MM-dd HH:mm:ss"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        :default-time="['00:00:00']"
      ></el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button @click="getDataList()">查询</el-button>
        <el-button v-if="superAdmin" type="success" @click="addRootNotice()">发布公告</el-button>
        <el-button v-else type="success" @click="addNoNotice()">发布公告</el-button>
      </el-form-item>
    </el-form>
    <el-table
      v-loading="dataListLoading"
      :data="dataList"
      border
      style="width: 100%;"
      @selection-change="selectionChangeHandle">
      <el-table-column
        :index="typeIndex"
        type="index"
        header-align="center"
        align="center"
        width="80"
        label="序号"/>
      <el-table-column
        prop="title"
        header-align="center"
        align="center"
        width="380"
        label="标题"/>
      <el-table-column
        prop="content"
        header-align="center"
        align="center"
        label="公告内容"/>
      <el-table-column
        :formatter="formatDate"
        prop="createTime"
        header-align="center"
        align="center"
        width="180"
        label="发布时间"/>
      <el-table-column
        fixed="right"
        header-align="center"
        align="center"
        width="120"
        label="操作">
        <template slot-scope="scope">
          <!--<el-tooltip content="编辑公告" placement="bottom">-->
          <!--<i class="optionIcon iconfont icon-xiugai" style="cursor: pointer;" @click="updateHandle(scope.row)"/>-->
          <!--</el-tooltip>-->
          <!--<el-tooltip content="发布公告" placement="bottom">-->
          <!--<i class="optionIcon iconfont icon-send-line" style="cursor: pointer;" @click="sendNotice(scope.row)"/>-->
          <!--</el-tooltip>-->
          <el-tooltip content="删除公告" placement="bottom">
            <i
              class="optionIcon iconfont icon-shanchu"
              style="cursor: pointer;"
              @click="deleteHandle(scope.row.id)"/>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <div style="text-align:right; padding-top:5px;">
      <el-pagination
        :current-page="pageIndex"
        :page-sizes="[10, 20, 50, 100]"
        :page-size="pageSize"
        :total="totalPage"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="sizeChangeHandle"
        @current-change="currentChangeHandle"/>
    </div>

    <!-- 弹窗, 新增 / 修改 -->
    <el-dialog
      :title="title"
      :modal="false"
      :close-on-click-modal="false"
      :width="'30%'"
      :visible.sync="dialogVisible">
      <el-form ref="dataForm" :rules="dataRule" :model="dataForm" label-width="80px">
        <el-form-item label="标题" prop="title">
          <el-input v-model="dataForm.title" :maxlength="16" placeholder="请填写标题"/>
        </el-form-item>
        <el-form-item label="内容" prop="content">
          <el-input :rows="4" v-model="dataForm.content" type="textarea" placeholder="请填写公告内容"/>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancelHandle()">取消</el-button>
        <el-button :loading="btnloading" type="primary" @click="onSubmit()">确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import moment from 'moment'
import { mapActions } from 'vuex'
import { getStore } from '@/utils/mUtils.js'
export default {
  // filters: {
  //   formatDate(time) {
  //     return moment(time).format('YYYY-MM-DD HH:mm:ss')
  //   }
  // },
  data() {
    return {
      adminCode: '00000000000000000000000000000000',
      dataList: [],
      pageIndex: 1,
      pageSize: 10,
      totalPage: 0,
      dataListLoading: false,
      dataListSelections: [],
      addOrUpdateVisible: false,
      title: '',
      superAdmin: false,
      dialogVisible: false,
      btnloading: false,
      displayRange: '-1',
      treeData: [],
      searchForm: {
        title: '',
        content: '',
        time: ''
        // startTime: '',
        // endTime:''
      },
      dataForm: {
        id: '',
        title: '',
        content: '',
        createTime: new Date()
      },
      dataRule: {
        title: [
          { required: true, message: '公告标题不能为空', trigger: 'blur' },
          { min: 2, max: 100, message: '长度在 2 到 100 个字符', trigger: 'blur' }
        ],
        content: [
          { required: true, message: '公告内容不能为空', trigger: 'blur' },
          { min: 2, max: 200, message: '长度在 2 到 200 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  mounted() {
    const userinfo = getStore('userinfo')
    const username = userinfo.username
    if (username === 'superAdmin') {
      this.superAdmin = true
    }
    console.log('userinfo=============', userinfo)
    this.getDataList()
  },
  methods: {
    ...mapActions(['AddNotice', 'DeleteNotice', 'UpdateNotice', 'GetNoticeList', 'SendNotice']),
    addRootNotice() {
      this.$router.push('/addNotice')
    },
    addNoNotice() {
      this.$router.push('/addNoticeNo')
    },
    updateHandle(data) {
      this.dialogVisible = true
      this.dataForm = data
      this.title = '修改'
    },
    typeIndex(index) {
      // 自增序号
      return index + (this.pageIndex - 1) * 10 + 1
    },
    formatDate(row, column, cellValue) {
      return moment(row.createTime).format('YYYY-MM-DD HH:mm:ss')
    },
    onSubmit: function() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          if (this.dataForm.id) {
            this.updateNotice()
          } else {
            this.addNotice()
          }
        }
      })
    },
    //发布公告
    addNotice: function() {
      this.btnloading = true
      this.AddNotice(this.dataForm).then(response => {
        if (response.id) {
          this.SendNotice(response.id).then(data => {
            this.$message({
              message: '发布成功',
              type: 'success',
              duration: 3000
            })
          }).catch(error => { console.log(error) })
        }
        this.dialogVisible = false
        this.btnloading = false
        this.getDataList()
      }).catch(error => { console.log(error) })
    },
    //修改公告
    updateNotice: function() {
      this.btnloading = true
      this.UpdateNotice(this.dataForm).then(response => {
        this.$message({
          message: '修改成功',
          type: 'success',
          duration: 1000
        })
        this.dialogVisible = false
        this.btnloading = false
        this.getDataList()
      }).catch(error => { console.log(error) })
    },
    sendNotice: function(row) {
      this.$confirm(`确定发布公告[${row.title}]吗?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.SendNotice(row.id).then(response => {
          this.$message({
            message: '发布成功',
            type: 'success',
            duration: 1000
          })
        }).catch(error => { console.log(error) })
      }).catch(() => {})
    },
    cancelHandle() {
      this.dialogVisible = false
      // this.reSet()
    },
    addHandle: function() {
      this.reSet()
      this.dialogVisible = true
      this.title = '新增'
    },
    reSet: function() {
      // this.$refs['dataForm'].resetFields()
      this.dataForm.title = ''
      this.dataForm.content = ''
    },
    // 获取数据列表
    getDataList() {
      console.info(this.searchForm.time)
      this.dataListLoading = true
      const params = {
        'page': this.pageIndex,
        'size': this.pageSize,
        'title': this.searchForm.title,
        'content': this.searchForm.content,
        'codes': getStore('userinfo').groupCode,
        'startTime': this.searchForm.time[0],
        'endTime': this.searchForm.time[1],
        //'time': this.searchForm.time
      }
      this.GetNoticeList(params)
        .then((data) => {
          console.log(params.time)
          if (data) {
            this.dataList = data.content
            this.totalPage = data.totalElements
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
    // 多选
    selectionChangeHandle(val) {
      this.dataListSelections = val
    },
    // 新增 / 修改
    addOrUpdateHandle(id) {
      this.addOrUpdateVisible = true
      this.$nextTick(() => {
        this.$refs.addOrUpdate.init(id)
      })
    },
    // 删除
    deleteHandle(id) {
      console.log('删除====', id)
      this.$confirm(`确定要删除该公告吗?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.DeleteNotice(id).then(response => {
          if (response) {
            this.$message({
              message: '操作成功',
              type: 'success',
              duration: 1000,
              onClose: () => {
                this.searchForm.title = ''
                this.getDataList()
              }
            })
          } else {
            this.$message.error('操作失败')
          }
        })
      })
    }
  }
}
</script>

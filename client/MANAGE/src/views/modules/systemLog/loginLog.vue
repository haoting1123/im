<template>
  <div class="mod-user">
    <div>

      <el-form :inline="true" :model="searchForm" @keyup.enter.native="getDataList()">
        <el-form-item label="时间范围">
          <el-date-picker
            v-model="dateRange"
            type="daterange"
            align="right"
            unlink-panels
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :picker-options="pickerOptions2"
            value-format="yyyy-MM-dd">
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button @click="getDataList()">查询</el-button>
        </el-form-item>
      </el-form>
    </div>
    <el-table
      v-loading="dataListLoading"
      :data="dataList"
      border
      style="width: 100%;"
    >
      <el-table-column
        type="index"
        :index="typeIndex"
        header-align="center"
        align="center"
        width="80"
        label="序号"></el-table-column>
      <el-table-column
        prop="groupName"
        header-align="center"
        align="center"
        width="380"
        label="机构名称"></el-table-column>
      <el-table-column
        prop="username"
        header-align="center"
        align="center"
        label="登录账号"></el-table-column>
      <el-table-column
        :formatter="formatDate"
        prop="loginTime"
        header-align="center"
        align="center"
        width="180"
        label="登陆时间"></el-table-column>
      <el-table-column
        prop="operation"
        header-align="center"
        align="center"
        label="操作事件"></el-table-column>
    </el-table>
    <div style="text-align:right; padding-top:5px;">
      <el-pagination
        :current-page="pageIndex"
        :page-sizes="[10, 20, 50, 100]"
        :page-size="pageSize"
        :total="totalPage"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="sizeChangeHandle"
        @current-change="currentChangeHandle"></el-pagination>
    </div>
  </div>
</template>

<script>
  import moment from 'moment'
  import {mapActions} from 'vuex'
  import { getStore } from '@/utils/mUtils.js'
  export default {

    data() {
      return {
        dataList: [],
        pageIndex: 1,
        pageSize: 10,
        totalPage: 0,
        dataListLoading: false,
        dataListSelections: [],
        addOrUpdateVisible: false,
        title: '',
        dialogVisible: false,
        btnloading: false,
        displayRange: '-1',
        treeData: [],
        searchForm: {
          userName: ''
        },
        dateRange: [],
        startTime: '',
        endTime:'',
        userinfo:'',
        pickerOptions2: {
          shortcuts: [{
            text: '最近一周',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近三个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit('pick', [start, end]);
            }
          }]
        },
      }
    },
    mounted() {
      this.userinfo = getStore('userinfo');
      this.getDataList()

    },
    methods: {
      ...mapActions(['GetLoginLogList']),

      typeIndex(index) {
        //自增序号
        return index + (this.pageIndex - 1) * 10 + 1;
      },
      formatDate(row, column, cellValue) {
        return moment(row.time).format('YYYY-MM-DD HH:mm:ss')
      },
      // // 获取数据列表
      getDataList() {
        if(this.dateRange == null){
          this.dateRange = []
        }
        const params = {
          'page': this.pageIndex,
          'size': this.pageSize,
          'groupRootCode': this.userinfo.groupCode,
          'startTime': this.dateRange[0],
          'endTime': this.dateRange[1]
        }
        this.GetLoginLogList(params)
          .then((data) => {
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
    }
  }
</script>

<template>
  <div>
    <el-card shadow="never">
      <div slot="header">
        <span>{{title}}</span>
      </div>
      <el-col :span="12">
        <el-form :model="dataForm" :rules="dataRule" ref="dataForm" label-width="80px">
          <el-form-item label="版本号" prop="clientVersion">
            <el-input v-model="dataForm.clientVersion" placeholder="版本号"></el-input>
          </el-form-item>
          <!--<el-form-item v-if="bitDisplay" label="系统位数" prop="bit">-->
            <!--<el-radio-group v-model="dataForm.bit" size="small">-->
              <!--<el-radio label="64" border>64位</el-radio>-->
              <!--<el-radio label="32" border>32位</el-radio>-->
            <!--</el-radio-group>-->
          <!--</el-form-item>-->
          <el-form-item v-if="networkDisplay" label="网络环境" prop="network">
            <el-radio-group v-model="dataForm.network" size="small">
              <el-radio label="内网" border>内网</el-radio>
              <el-radio label="外网" border>外网</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="描述" prop="remark">
            <el-input type="textarea" :rows="3" v-model="dataForm.remark" placeholder="描述"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button @click="resetForm()">重置</el-button>
            <el-button type="primary" @click="dataFormSubmit()">保存</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-card>
    <br/>
    <el-card shadow="never">
      <div slot="header">
        <span>版本列表</span>
      </div>
      <el-table
        :data="dataList"
        border
        style="width: 100%;">
        <el-table-column
          type="index"
          :index="typeIndex"
          header-align="center"
          align="center"
          width="60"
          label="序号">
        </el-table-column>
        <el-table-column
          prop="clientVersion"
          header-align="center"
          width="180"
          align="center"
          label="版本号">
        </el-table-column>
        <!--<el-table-column-->
          <!--prop="bit"-->
          <!--header-align="center"-->
          <!--width="180"-->
          <!--align="center"-->
          <!--label="系统位数">-->
          <!--<template slot-scope="scope">-->
            <!--{{scope.row.bit | formatBit}}-->
          <!--</template>-->
        <!--</el-table-column>-->
        <el-table-column
          prop="network"
          header-align="center"
          width="180"
          align="center"
          label="网络环境">
        </el-table-column>
        <el-table-column
          prop="remark"
          header-align="center"
          align="center"
          label="描述">
        </el-table-column>
        <el-table-column
          prop="createdTime"
          header-align="center"
          align="center"
          width="190"
          label="创建时间">
          <template slot-scope="scope">
            {{scope.row.createdTime | formatDate}}
          </template>
        </el-table-column>
        <el-table-column
          fixed="right"
          header-align="center"
          align="center"
          width="150"
          label="操作">
          <template slot-scope="scope">
            <el-button type="danger" size="small" @click="deleteHandle(scope.row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div style="text-align: right; padding-top: 5px">
        <el-pagination
          @size-change="sizeChangeHandle"
          @current-change="currentChangeHandle"
          :current-page="pageIndex"
          :page-sizes="[10, 20, 50, 100]"
          :page-size="pageSize"
          :total="totalPage"
          layout="total, sizes, prev, pager, next, jumper">
        </el-pagination>
      </div>

    </el-card>
  </div>
</template>

<script>
  import moment from 'moment'
  import { mapActions } from 'vuex'
  export default {
    data () {
      return {
        bitDisplay: true,
        networkDisplay: true,
        dataForm: {
          clientType: '',
          clientVersion: '',
          remark: '',
          network: '',
          createdTime: new Date()
        },
        dataRule: {
          clientVersion: [
            { required: true, message: '版本号不能为空', trigger: 'blur' }
          ],
          remark: [
            { required: true, message: '描述不能为空', trigger: 'blur' }
          ],
          network: [
            { required: true, message: '请选择网络环境', trigger: 'blur' }
          ]
        },
        dataList: [],
        pageIndex: 1,
        pageSize: 10,
        totalPage: 0,
        title:''
      }
    },
    props: ['clientType'],
    watch: {
      clientType: function (newVal, oldVal) {
        console.log('clientType===========',this.clientType)
        this.resetForm()
        this.initHandle()
        this.initList()
      }
    },
    filters: {
      formatDate (time) {
        let date = new Date(time)
        return moment(date).format('YYYY-MM-DD hh:mm')
      },
      formatNetwork (value) {
        if (value === 'gov') {
          return '内网'
        } else if (value === 'intenal') {
          return '外网'
        }
        return '-'
      },
      formatBit (value) {
        return value !== '' && value !== null ? value : '-'
      }
    },
    mounted () {
      this.initHandle()
      this.initList()
    },
    methods: {
      ...mapActions(['AddVersion','UpdateVersion','DeleteVersion','GetVersionList']),
      initList () {
        let dataParam = {
          'page': this.pageIndex - 1,
          'size': this.pageSize,
          'clientType': this.clientType
        }
        console.log('dataParam======',dataParam)
        this.GetVersionList(dataParam).then(response => {
          if (response) {
            this.dataList = response.content
            this.totalPage = response.totalElements
          } else {
            this.dataList = []
            this.totalPage = 0
          }
        }).catch(error => {
          console.log(error)
        })
      },
      typeIndex(index) {
        //自增序号
        return index + (this.pageIndex - 1) * 10 + 1;
      },
      deleteHandle (id) {
        console.log('删除id===',id)
        this.$confirm(`确定要删除该版本信息吗?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.DeleteVersion(id).then(response => {
            this.$message({
              message: '删除成功',
              type: 'success',
              duration: 1000,
              onClose: () => {
                this.initList()
              }
            })
          })
        }).catch((error) => {console.log(error)})
      },
      dataFormSubmit () {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.dataForm.clientType = this.clientType
            let param = this.dataForm

            this.AddVersion(param).then(response => {
              this.$message({
                message: '操作成功',
                type: 'success',
                duration: 1000,
                onClose: () => {
                  this.resetForm()
                  this.initList()
                }
              })
            }).catch(error => {console.log(error)})
          }
        })
      },
      initHandle () {
        if (this.clientType === 'windows'||this.clientType === 'mips') {
          this.networkDisplay = true
        } else {
          this.networkDisplay = false
        }
        if(this.clientType === 'windows'){
          this.title = '添加windows客户端版本信息'
        }else if(this.clientType === 'mips'){
          this.title = '添加mips客户端版本信息'
        }else if(this.clientType === 'ios'){
          this.title = '添加ios客户端版本信息'
        }else if(this.clientType === 'android'){
          this.title = '添加android客户端版本信息'
        }
      },
      resetForm () {
        this.$refs['dataForm'].resetFields()
      },
      // 每页数
      sizeChangeHandle (val) {
        this.pageSize = val
        this.pageIndex = 1
        this.initList()
      },
      // 当前页
      currentChangeHandle (val) {
        this.pageIndex = val
        this.initList()
      }
    }
  }
</script>

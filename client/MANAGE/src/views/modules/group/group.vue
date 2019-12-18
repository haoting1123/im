<template>
  <div class="show-scroll">
    <div>
      <div style="text-align: center;">
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
      <el-row>
        <el-col :span="8">
          &nbsp;
        </el-col>
        <el-col :span="6" style="text-align: center">
          <div>
            <el-card class="treeCard">
              <div style="padding-bottom: 10px;">
                <el-input
                  v-model="filterText"
                  placeholder="输入关键字进行过滤"
                />
              </div>
              <el-tree
                ref="tree"
                :data="treeData"
                :filter-node-method="filterNode"
                :expand-on-click-node="false"
                :allow-drop="allowDrop"
                class="filter-tree"
                node-key="id"
                draggable
                default-expand-all
                @node-drop="handleDrop">
                <span slot-scope="{ node, data }" class="custom-tree-node">
                  <span>{{ node.label }}</span>
                  <span>
                    <el-tooltip v-if="node.level == 1" content="导入授权文件" placement="bottom">
                      <i
                        class="optionIcon iconfont icon-shouquanbiaoshu"
                        style="cursor: pointer;"
                        @click="() => uploadLicense(node, data)"/>
                    </el-tooltip>
                    <el-tooltip content="添加子机构" placement="bottom">
                      <i class="optionIcon iconfont icon-xinzeng" style="cursor: pointer;" @click="() => append(node, data)"/>
                    </el-tooltip>
                    <el-tooltip v-if="node.level == 1" content="选择小程序" placement="bottom">
                      <i
                        class="optionIcon iconfont icon-xiaochengxu"
                        style="cursor: pointer;"
                        @click="() => miniProgramHandle(node, data)"/>
                    </el-tooltip>
                    <el-tooltip v-if="node.level > 1" content="删除子机构" placement="bottom">
                      <i
                        class="optionIcon iconfont icon-shanchu"
                        style="cursor: pointer;"
                        @click="() => remove(node, data)"/>
                    </el-tooltip>
                    <el-tooltip content="配置可见机构" placement="bottom">
                      <i class="optionIcon iconfont icon-kejian" style="cursor: pointer;" @click="() => appendConfig(node, data)"/>
                    </el-tooltip>
                  </span>
                </span>
              </el-tree>
            </el-card>
          </div>
        </el-col>
        <el-col :span="8">
          &nbsp;
        </el-col>
      </el-row>

    </div>
    <el-dialog
      :modal="false"
      :close-on-click-modal="false"
      :visible.sync="addVisible"
      title="新增"
      width="500px">
      <add ref="add" :add-tree-dialog.sync="addVisible" @refreshDataList="initTree"/>
    </el-dialog>
    <el-dialog
      :modal="false"
      :close-on-click-modal="false"
      :visible.sync="uplaodLicenseVisible"
      title="导入授权文件"
      width="500px">
      <el-form label-width="20px">
        <el-form-item label="">
          <el-upload
            ref="upload"
            :action="uploadUrl()"
            :file-list="fileList"
            :on-success="onSuccess"
            :headers="uploadRequestHeaders"
            :with-credentials="true"
            :on-error="onError"
            :limit="1"
            :auto-upload="false"
            accept=".txt">
            <el-button slot="trigger" size="small" type="primary">选择授权文件</el-button>
            <el-button style="margin-left: 10px;" size="small" type="success" @click="submitUpload">导入授权文件</el-button>
            <div slot="tip" class="el-upload__tip"/>
          </el-upload>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="uplaodLicenseVisible = false">取消</el-button>
      </span>
    </el-dialog>
    <el-dialog
      :modal="false"
      :close-on-click-modal="false"
      :visible.sync="addVisible"
      title="新增"
      width="500px">
      <add ref="add" :add-tree-dialog.sync="addVisible" @refreshDataList="initTree"/>
    </el-dialog>
    <el-dialog
      :modal="false"
      :close-on-click-modal="false"
      :visible.sync="miniProgramVisible"
      title="选择小程序"
      width="500px">
      <el-checkbox :indeterminate="isIndeterminate" v-model="miniProgramCheckAll" @change="handleMiniProgramCheckAllChange">全选</el-checkbox>
      <div style="margin: 15px 0;"/>
      <el-checkbox-group v-model="miniProgramChecked" @change="handleMiniProgramCheckedChange">
        <el-checkbox v-for="item in miniProgramList" :label="item.code" :key="item.code">{{ item.name }}</el-checkbox>
      </el-checkbox-group>
      <span slot="footer" class="dialog-footer">
        <el-button @click="miniProgramVisible = false">关闭</el-button>
      </span>
    </el-dialog>
    <organize-visible-config
      v-if="groupVisible"
      ref="organizeDialog"
      :config-organize-code="configOrganizeCode"
      :group-visible.sync="groupVisible"/>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import moment from 'moment'
import { getStore } from '@/utils/mUtils.js'
import add from '@/views/modules/group/group-add'
import organizeVisibleConfig from '@/components/organize/organizeVisibleConfig'

export default {
  filters: {
    formatDate(time) {
      if (time === undefined || time === '') {
        return '无'
      }
      return moment(time).format('LL')
    }
  },
  components: {
    add, organizeVisibleConfig
  },
  data() {
    return {
      addVisible: false,
      miniProgramVisible: false,
      uplaodLicenseVisible: false,
      isIndeterminate: true,
      miniProgramCheckAll: false,
      miniProgramChecked: [],
      miniProgramList: [],
      miniProgramListCode: [],
      fileList: [],
      treeData: [],
      filterText: '',
      userinfo: [],
      groupVisible: false,
      configOrganizeCode: '',
      importDisable: false,
      licenseItem: '',
      registerUserCount: 0,
      surplusUserCount: 0,
      userCount: 0,
      totalPage: 0,
      uploadRequestHeaders: {
        'X-Token': getStore('token')
      }
    }
  },
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val)
    }
  },
  created() {
    this.userinfo = getStore('userinfo')
    this.initTree()
    this.getLicenseInfo()
    this.getDataList()
    this.getMiniProgramListAll()
    this.getMiniProgramByGcode()
  },
  mounted() {

  },
  methods: {
    ...mapActions(['getTree', 'delTreeNode', 'SequenceTree', 'GetUserPage', 'GetLicense', 'GetMiniProgramListAll', 'GetMiniProgramByGcode', 'SaveMiniprogram']),
    // 获取数据列表
    getDataList() {
      const params = {
        'page': '1',
        'size': '10',
        'userName': '',
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
    getLicenseInfo() {
      this.GetLicense(this.userinfo.groupCode).then(response => {
        this.licenseItem = response
      })
    },
    compputedUser() {
      this.surplusUserCount = this.licenseItem.userCount - this.registerUserCount
      if(!this.surplusUserCount){
        this.surplusUserCount = 0
      }
      this.userCount = this.licenseItem.userCount
    },
    filterNode(value, data) {
      if (!value) return true
      return data.label.indexOf(value) !== -1
    },
    initTree() {
      this.addVisible = false
      this.getTree(this.userinfo.groupCode)
        .then((data) => {
          this.treeData = data
        })
        .catch(() => {
        })
    },
    append(node, data) {
      this.addVisible = true
      //异步更新
      this.$nextTick(() => {
        // 调用add 即group-add组件
        this.$refs.add.init(0, data.id)
      })
    },
    // 显示导入授权文件对话框
    uploadLicense(node, data) {
      this.fileList = []
      this.uplaodLicenseVisible = true
    },
    appendConfig(node, data) {
      console.log('this.groupVisible==', this.groupVisible)
      this.groupVisible = true
      this.configOrganizeCode = data.id
      // this.groupVisible = this.$refs.organizeDialog.organizeVisible
      // this.$nextTick(() => {
      //   this.$refs.add.init(0, data.id)
      // })
    },
    allowDrop(draggingNode, dropNode, type) {
      return type !== 'inner' && draggingNode.level === dropNode.level
    },
    handleDrop(draggingNode, dropNode, dropType, ev) {
      const param = {
        'dragCode': draggingNode.data.id,
        'dropCode': dropNode.data.id,
        'parentCode': dropNode.parent.data.id,
        'dropType': dropType
      }
      console.log('param=====', param)
      this.SequenceTree(param).then(response => {
        console.log('排序成功===', response)
      }).catch((error) => {
        console.log(error)
      })
    },
    remove(node, data) {
      this.$confirm(`确定要删除该机构吗?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.delTreeNode(data.id)
          .then((res) => {
            if (res) {
              this.$message({
                message: '操作成功',
                type: 'success',
                duration: 1000,
                onClose: () => {
                  this.initTree()
                }
              })
            } else {
              this.$message.error('操作失败')
            }
          })
          .catch(() => {
          })
      }).catch(() => {
      })
    },
    uploadUrl() {
      return process.env.BASE_API + 'im/license/upload'
    },
    //导入授权文件
    submitUpload() {
      console.log(this.$refs.upload.action)
      this.$refs.upload.submit()
    },
    onSuccess(response, file, fileList) {
      console.log('导入成功', response, file, fileList)
      this.$message({
        message: '导入成功',
        type: 'success',
        duration: 1000,
        onClose: () => {
          this.getLicenseInfo()
          this.getDataList()
          this.uplaodLicenseVisible = false
        }
      })
    },
    onError(err, file, fileList) {
      console.log('导入失败', err, file, fileList)
      this.$message.error('导入失败，请检查授权文件是否正确')
    },
    miniProgramHandle() {
      this.miniProgramVisible = true
    },
    getMiniProgramListAll() {
      this.GetMiniProgramListAll()
        .then((data) => {
          this.miniProgramList = data
          for (const item of data) {
            this.miniProgramListCode.push(item.code)
          }
        })
        .catch(() => {
        })
    },
    getMiniProgramByGcode() {
      this.GetMiniProgramByGcode(this.userinfo.groupCode)
        .then((data) => {
          const checked = []
          for (const item of data) {
            checked.push(item.code)
          }
          this.miniProgramChecked = checked
        })
        .catch(() => {
        })
    },
    handleMiniProgramCheckAllChange(val) {
      this.miniProgramChecked = val ? this.miniProgramListCode : []
      this.isIndeterminate = false
      this.saveMiniprogram()
    },
    handleMiniProgramCheckedChange(value) {
      const checkedCount = value.length
      this.miniProgramCheckAll = checkedCount === this.miniProgramListCode.length
      this.isIndeterminate = checkedCount > 0 && checkedCount < this.miniProgramListCode.length
      this.saveMiniprogram()
    },
    saveMiniprogram() {
      const data = {
        groupCode: this.userinfo.groupCode,
        programCode: this.miniProgramChecked
      }
      this.SaveMiniprogram(data)
        .then((data) => {
        })
        .catch(() => {
        })
    }
  }
}
</script>
<style scoped>
  .custom-tree-node {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    padding-right: 8px;
  }

  .block {
    margin: 0 150px;

  }

  .treeCard {
    width: 500px;
    max-height: 700px;
    overflow: auto;
    overflow-x: hidden;
  }
</style>

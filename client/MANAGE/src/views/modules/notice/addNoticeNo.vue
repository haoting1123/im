<template>
  <div class="app-search-container">
    <el-form ref="dataForm" :rules="dataRule" :model="dataForm" label-width="130px">
      <el-form-item label="标题" prop="title">
        <el-input v-model="dataForm.title" :maxlength="16" placeholder="请填写标题" style="width: 510px;"/>
      </el-form-item>
      <el-form-item label="内容" prop="content">
        <el-input :rows="4" v-model="dataForm.content" type="textarea" placeholder="请填写公告内容" style="width: 510px;"/>
      </el-form-item>
      <el-form-item label="机构范围" style="width: 100%;" prop="group">
        <div style="text-align: left">
          <div class="treePanel">
            <!-- 卡片布局 -->
            <el-card>
              <div style="padding-bottom: 10px;">
                <el-input
                  v-model="filterText"
                  placeholder="输入关键字进行过滤"
                />
              </div>
              <el-tree
                ref="groupTree"
                :data="treeData"
                :default-checked-keys="treeDefaultKey"
                :default-expanded-keys="treeDefaultKey"
                :expand-on-click-node="false"
                :filter-node-method="filterNode"
                show-checkbox
                node-key="id"
                accordion
                default-expand-all
                @check-change="treeCheckChange"
              />
            </el-card>
          </div>
      </div></el-form-item>
    </el-form>
    <div style="width: 710px;text-align: center;">
      <el-button :loading="btnloading" type="primary" @click="onSubmit">确定</el-button>
      <el-button type="primary" @click="reSet">重置</el-button>
    </div>
  </div>
</template>
<script>

import CusTransfer from '@/components/transfer/main'
import { mapActions } from 'vuex'
import { getStore } from '@/utils/mUtils.js'
export default {
  components: { CusTransfer },
  data() {
    return {
      dataForm: {
        id: '',
        title: '',
        content: '',
        createTime: new Date(),
        codes: getStore('userinfo').groupCode
      },
      treeDefaultKey: [],
      chargerList: [],
      organizeOptions: '',
      organizeValue: '',
      isChargerVisible: false,
      btnloading: false,
      treeData: '',
      dataRule: {
        title: [
          { required: true, message: '公告标题不能为空', trigger: 'blur' },
          { min: 2, max: 100, message: '长度在 2 到 100 个字符', trigger: 'blur' }
        ],
        content: [
          { required: true, message: '公告内容不能为空', trigger: 'blur' },
          { min: 2, max: 200, message: '长度在 2 到 200 个字符', trigger: 'blur' }
        ]
      },
      groupData: '',
      filterText: ''
    }
  },
  watch: {
    filterText(val) {
      this.$refs.groupTree.filter(val)
    }
  },
  mounted() {
    this.initTree()
  },
  methods: {
    ...mapActions(['GetGroupNoList', 'AddNoticeOrg', 'SendNotice', 'getTree']),
    filterNode(value, data) {
      if (!value) return true
      return data.label.indexOf(value) !== -1
    },
    reSet: function() {
      // this.form.groupName = "";
      this.dataForm.title = ''
      this.dataForm.content = ''
    },
    initTree() {
      // eslint-disable-next-line no-undef
      const userinfo = getStore('userinfo')
      this.getTree(userinfo.groupCode)
        .then(data => {
          console.log('获取机构树', data)
          this.treeData = data
        })
        .catch(() => {})
    },
    getInitData() {
      // 获取机构addUserPre
      this.GetGroupNoList().then(data => {
        this.treeData = data
      }).catch(error => {
        console.log(error)
      })
    },
    onSubmit: function() {
      this.organizeValue = this.organizeValue.substring(0, this.organizeValue.length - 1)
      this.dataForm.organizeInfo = this.organizeOptions
      console.log('机构范围========', this.dataForm)
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          //检查组织机构是否选择
          if(this.organizeValue === ''){
            console.log("判断组织机构是否为空")
            this.$message({
              message: '组织机构未选择',
              type: 'error',
              duration: 3000
            })
            return ;
          }
          this.addNotice()
        }
      })
    },
    addNotice: function() {
      this.btnloading = true
      this.AddNoticeOrg(this.dataForm).then(response => {
        if (response.id) {
          this.SendNotice(response.id).then(data => {
            this.$message({
              message: '发布成功',
              type: 'success',
              duration: 3000
            })
            this.$router.push('/notice')
          }).catch(error => { console.log(error) })
        }
        this.btnloading = false
      }).catch(error => { console.log(error) })
    },
    treeCheckChange(data, checked, indeterminate) {
      const currentNode = this.$refs.groupTree.getCheckedKeys()
      const rootCode = getStore('userinfo').groupCode
      // eslint-disable-next-line no-empty
      if (currentNode.indexOf(rootCode) === -1) {
        currentNode.push(rootCode)
      }
      this.organizeOptions = currentNode.join(',')
    }
  }
}

</script>
<style>
  .app-search-container {
    height: 100%;
    padding-top: 20px;
    padding-left: 10px;
    padding-right: 10px;
  }
  .treePanel {
    width: 510px;
    max-height: 500px;
    overflow: auto;
    overflow-x:hidden;
  }
</style>

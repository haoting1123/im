<template>
  <el-dialog
    :modal="false"
    :close-on-click-modal="false"
    :width="'30%'"
    :visible.sync="groupVisible"
    title="选择可见机构"
    class="show-scroll"
    @close="cancel()"
  >
    <div class="treePanel">
      <el-card>
        <div style="padding-bottom: 10px;">
          <el-input
            v-model="filterText"
            placeholder="输入关键字进行过滤"
          ></el-input>
        </div>
        <div style="margin-bottom: 10px">
          <el-button size="mini" type="primary" plain @click="selectAll()">选择全部</el-button>
          <el-button size="mini"  plain @click="cancelSelectAll()">取消全部</el-button>
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
          check-strictly
          accordion
          default-expand-all
          @check-change="treeCheckChange"
        ></el-tree>
      </el-card>
    </div>
    <div style="text-align: right;">
      <el-button type="infor" @click="cancel()">取消</el-button>
      <el-button :loading="subLoad" type="primary" @click="onSubmit">确定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { mapActions } from 'vuex'
import { getStore } from '@/utils/mUtils.js'

export default {
  // eslint-disable-next-line vue/require-prop-types
  props: ['groupVisible', 'configOrganizeCode'],
  data() {
    return {
      treeSelectTag: 0,
      treeDefaultKey: [],
      treeData: [],
      treeDataKeys: [],
      filterText: '',
      subLoad: false,
      dataForm: {
        groupCode: '',
        groupName: ''
      },
      checkNodes: [],
      resultNodes: [],
      initCheckNodes: []
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
    ...mapActions(['getTree', 'GroupVisible', 'GetGroupVisible']),
    filterNode(value, data) {
      if (!value) return true
      return data.label.indexOf(value) !== -1
    },
    initGroupVisible() {
      console.log('initGroupVisible', this.configOrganizeCode)
      this.GetGroupVisible(this.configOrganizeCode).then(response => {
        this.initCheckNodes = response
        console.log('initCheckNodes', this.initCheckNodes)
        this.$refs.groupTree.setCheckedKeys(this.initCheckNodes)
      }).catch(error => { console.log(error) })

    },
    initTree() {
      const userinfo = getStore('userinfo')
      this.getTree(userinfo.groupCode)
        .then(data => {
          this.treeData = data
          this.initGroupVisible()
          this.getTreeDataKeys(data)
        })
        .catch(() => {})
    },
    getTreeDataKeys(data){
      for(let item of data){
        this.treeDataKeys.push(item.id)
        this.getTreeDataKeys(item.children)
      }
    },
    cancel() {
      this.groupVisible = false
      this.$emit('update:groupVisible', false)
    },
    onSubmit() {
      // console.log('group=', this.dataForm)
      // this.$emit('update:organizeInfo', this.dataForm)
      this.subLoad = true
      this.checkNodes.forEach(item => {
        this.resultNodes.push(item.id)
      })
      const dataParam = {
        groupCode: this.configOrganizeCode,
        visibleCodes: this.resultNodes
      }
      this.GroupVisible(dataParam).then(response => {
        this.subLoad = false
        this.$message({
          message: '保存成功',
          type: 'success'
        })
      }).catch(error => { console.log(error) })
      this.groupVisible = false
      this.$emit('update:groupVisible', false)
    },
    treeCheckChange(data, checked, indeterminate) {
      const currentNode = this.$refs.groupTree.getCheckedNodes()
      this.checkNodes = currentNode
      console.log('所选机构===', currentNode)
    },
    cancelSelectAll(){
      this.$refs.groupTree.setCheckedKeys([])
    },
    selectAll(){
      this.$refs.groupTree.setCheckedKeys(this.treeDataKeys)
    }
  }
}
</script>
<style>
.treePanel {
  height: 500px;
  overflow: auto;
  overflow-x:hidden;
}
</style>

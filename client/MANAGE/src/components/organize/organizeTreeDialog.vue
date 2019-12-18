<template>
  <el-dialog
    :modal="false"
    :close-on-click-modal="false"
    :width="'30%'"
    :visible.sync="organizeVisible"
    title="请选择所属机构"
    class="show-scroll"
  >
    <div class="treePanel">
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
          check-strictly
          accordion
          default-expand-all
          @check-change="treeCheckChange"
        />
      </el-card>
    </div>
    <div style="text-align: right;">
      <el-button type="infor" @click="organizeVisible=false">取消</el-button>
      <el-button type="primary" @click="onSubmit">确定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { mapActions } from 'vuex'
import { getStore } from '@/utils/mUtils.js'

export default {
  // eslint-disable-next-line vue/require-prop-types
  props: ['checkedGroup'],
  data() {
    return {
      treeSelectTag: 0,
      organizeVisible: false,
      treeDefaultKey: [],
      treeData: [],
      filterText: '',
      dataForm: {
        groupCode: '',
        groupName: ''
      }
    }
  },
  watch: {
    filterText(val) {
      this.$refs.groupTree.filter(val)
    },
    checkedGroup(val){
      this.treeDefaultKey = val
    }
  },
  mounted() {
    this.initTree()
  },
  methods: {
    ...mapActions(['getTree']),
    filterNode(value, data) {
      if (!value) return true
      return data.label.indexOf(value) !== -1
    },
    initTree() {
      const userinfo = getStore('userinfo')
      this.getTree(userinfo.groupCode)
        .then(data => {
          this.treeData = data
          if (this.checkedGroup) {
            this.treeDefaultKey = this.checkedGroup
            this.treeSelectTag = this.treeDefaultKey.length
          }
        })
        .catch(() => {})
    },
    onSubmit() {
      console.log('group=', this.dataForm)
      this.$emit('update:organizeInfo', this.dataForm)
      this.organizeVisible = false
    },
    treeCheckChange(data, checked, indeterminate) {
      this.treeSelectTag++
      if (this.treeSelectTag % 2 === 0) {
        if (checked) {
          this.$refs.groupTree.setCheckedNodes([])
          this.$refs.groupTree.setCheckedNodes([data])
        } else {
          this.$refs.groupTree.setCheckedNodes([])
        }
      }
      const currentNode = this.$refs.groupTree.getCheckedNodes()
      if (currentNode.length > 0) {
        this.dataForm.groupCode = currentNode[0].id
        let groupName = currentNode[0].label
        if (groupName.indexOf('-') > 0) {
          groupName = groupName.substr(0, groupName.indexOf('-'))
        }
        this.dataForm.groupName = groupName
      } else {
        this.dataForm.groupCode = ''
        this.dataForm.groupName = ''
      }
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

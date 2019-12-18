<template>
  <div class="add-tree-component">
    <search @onsearch="searchMember" v-if="type === 'tree'"></search>
    <!--组织机构树-->
    <el-tree
      :data="data"
      :props="organizationProps"
      node-key="id"
      :render-after-expand="false"
      :filter-node-method="filterNodeMethod"
      @node-expand="onNodeExpand"
      @node-click="nodeClick"
      class="organization-tree"
      :ref="type"
    >
    </el-tree>
  </div>
</template>

<script>
  import { mapState, mapActions } from 'vuex'
  // const path = require('path')

  export default {
    name: 'tree-component',
    props: ['type', 'data'],
    data () {
      return {
        searchContent: '',
        organizationProps: {
          children: 'children',
          label: 'label'
        },
        nodeInfo: {}
      }
    },
    components: {
      search: require('@/components/common/search').default
    },
    computed: {
      ...mapState({
        treeData: state => state.tree.treeData,
        treeName: state => state.tree.treeName,
        activeTab: state => state.home.activeTab
      })
    },
    watch: {
      treeData: {
        handler (val, oldval) {
          console.log(val)
          if (val.length > 0) {
            console.log('组织树重新渲染')
            // DOM更新完成，插入icon
            this.$nextTick(this.initPage)
          }
        },
        deep: true
      }
    },
    created () {},
    mounted () {
      this.initPage()
    },
    methods: {
      ...mapActions([
        'GetNodeMember',
        'SearchTreeMember'
      ]),
      // 初始化页面样式(插入icon和头像)
      initPage () {
        const nodeList = $(`.el-tree>.el-tree-node`)
        let self = this
        console.log(nodeList)
        nodeList.each(function (i, ele) {
          self.forEachNode($(ele), self.treeData)
        })
        // 主目录删除左侧三角icon
        // $('.tree-main-container .el-tree>.el-tree-node>.el-tree-node__content .expanded').removeClass('el-icon-caret-right')
      },
      // 递归遍历节点(插入icon)
      forEachNode (nodeList, data) {
        let self = this
        let iconPath = 'static/icon/'
        // if (process.env.NODE_ENV !== 'development') {
        //   iconPath = path.join(__static, '/icon/')
        // } else {
        //   iconPath = '../../../static/icon/'
        // }
        nodeList.each(function (i) {
          // $(this).find('>.el-tree-node__children').children().length > 0 ||
          if (Object.prototype.toString.call(data[i].children) === '[object Array]') {
            if ($(this).find('>.el-tree-node__content').children().length === 2) {
              $(this).find('>.el-tree-node__content>.el-tree-node__label').before(`<img src="${iconPath}/class-tree.png" alt="icon" style="width: 20px; height: 20px;" />`)
            }
            const nodeList = $(this).find('>.el-tree-node__children>.el-tree-node')
            self.forEachNode(nodeList, data[i].children)
          } else {
            // 初始化渲染
            if ($(this).find('>.el-tree-node__content').children().length === 2 && data[i].photo) {
              // console.log(data)
              if (data[i].status !== 'online') {
                $(this).find('>.el-tree-node__content>.el-tree-node__label').before(`<img src=${data[i].photo}  class="avatar-gray" alt="icon" style="width: 20px; height: 20px;" />`)
              } else {
                $(this).find('>.el-tree-node__content>.el-tree-node__label').before(`<img src=${data[i].photo} alt="icon" style="width: 20px; height: 20px;" />`)
              }
            } else if ($(this).find('>.el-tree-node__content').children().length === 2) {
              if (data[i].status !== 'online') {
                $(this).find('>.el-tree-node__content>.el-tree-node__label').before(`<img src="${iconPath}/normal-member-icon.png" class="avatar-gray" alt="icon" style="width: 20px; height: 20px;" />`)
              } else {
                $(this).find('>.el-tree-node__content>.el-tree-node__label').before(`<img src="${iconPath}/normal-member-icon.png" alt="icon" style="width: 20px; height: 20px;" />`)
              }
            }
            // 好友上下线渲染
            if ($(this).find('>.el-tree-node__content').children().length === 3 && data[i].photo) {
              $(this).find('>.el-tree-node__content').find('img').remove()
              if (data[i].status !== 'online') {
                $(this).find('>.el-tree-node__content>.el-tree-node__label').before(`<img src=${data[i].photo}  class="avatar-gray" alt="icon" style="width: 20px; height: 20px;" />`)
              } else {
                $(this).find('>.el-tree-node__content>.el-tree-node__label').before(`<img src=${data[i].photo} alt="icon" style="width: 20px; height: 20px;" />`)
              }
            } else if ($(this).find('>.el-tree-node__content').children().length === 3) {
              $(this).find('>.el-tree-node__content').find('img').remove()
              if (data[i].status !== 'online') {
                $(this).find('>.el-tree-node__content>.el-tree-node__label').before(`<img src="${iconPath}/normal-member-icon.png" class="avatar-gray" alt="icon" style="width: 20px; height: 20px;" />`)
              } else {
                console.log('------------------------嘿嘿')
                $(this).find('>.el-tree-node__content>.el-tree-node__label').before(`<img src="${iconPath}/normal-member-icon.png" alt="icon" style="width: 20px; height: 20px;" />`)
              }
            }
          }
        })
      },
      // 搜索节点
      filterNodeMethod (value, data, node) {
        if (!value) return true
        return (data.label && data.label.indexOf(value) !== -1) || (data.jid ? data.jid.split('@')[0].indexOf(value) !== -1 : '')
      },
      // 节点展开时触发
      onNodeExpand (node) {
        this.getNodeMember({
          id: node.id,
          groupName: node.label
        })
      },
      // 点击节点
      nodeClick (node) {
        if (node.children) {
          this.nodeInfo = {
            treeName: this.treeName,
            label: node.label
          }
          this.$emit('onNodeClick', this.nodeInfo)
          this.getNodeMember({
            id: node.id,
            groupName: node.label
          })
          return
        }
        this.$emit('onNodeClick', node)
      },
      // 获取子节点成员
      getNodeMember (data) {
        this.GetNodeMember(data)
      },
      // 模糊查询组织成员
      searchMember (value) {
        console.log(this.treeData)
        if (!value.replace(/\s/g, '')) return this.$refs[this.type].filter(value)
        const data = {
          key: value,
          groupRootCode: this.treeData[0].id
        }
        console.log(this.treeData)
        this.SearchTreeMember(data)
          .then(() => {
            console.log(this.treeData)
            this.$refs[this.type].filter(value)
          })
          .catch()
      }
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss">
  .add-tree-component {
    .organization-tree {
      height: calc(100vh - 68px);
      overflow: auto;
    }
    img {
      margin-right: 5px;
    }
    .avatar-gray {
      filter: grayscale(100%);
      filter: gray;
    }
  }
</style>

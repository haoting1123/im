<template>
  <el-container class="tree-main-container">
    <el-aside class="aside-section">
      <!--组织机构树-->
      <tree-component type="tree" @onNodeClick="onNodeClick" :data="treeData"></tree-component>
    </el-aside>
    <el-main class="main-section">
      <userinfo-component v-if="activeMember.jid" :friendInfo="nodeInfo" @updateNodeInfo="updateNodeInfo"></userinfo-component>
      <agencyinfo-component v-else :agencyInfo="nodeInfo"></agencyinfo-component>
    </el-main>
  </el-container>
</template>

<script>
  import { mapState, mapMutations } from 'vuex'

  export default {
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
      search: require('@/components/common/search').default,
      userinfoComponent: require('@/components/home/userinfo-component').default,
      agencyinfoComponent: require('@/components/home/agencyInfo-component').default,
      treeComponent: require('@/components/tree/tree-component').default
    },
    computed: {
      ...mapState({
        treeData: state => state.tree.treeData,
        treeName: state => state.tree.treeName,
        localMemberData: state => state.home.localMemberData,
        activeMember: state => state.home.activeMember
      })
    },
    watch: {
      localMemberData: {
        handler: function (val, oldval) {
          this.localMemberData.forEach(item => {
            if (item.jid === this.nodeInfo.jid) {
              this.nodeInfo = item
            }
          })
        },
        deep: true
      }
    },
    created () {},
    mounted () {
      // 默认显示顶层节点
      this.nodeInfo = {
        treeName: this.treeName,
        label: this.treeData[0].label
      }
    },
    methods: {
      ...mapMutations([
        'SET_ACTIVE_MEMBER'
      ]),
      onNodeClick (node) {
        console.log('lalal')
        this.nodeInfo = node
        this.SET_ACTIVE_MEMBER(node)
      },
      // 更新当前节点
      updateNodeInfo (node) {
        this.nodeInfo = node
      }
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss">
  .tree-main-container {
    height: 100%;
    min-height: 300px;
    overflow: hidden;
    background: white;
    .aside-section {
      width: 220px !important;
      border-right: 1px solid #ececec;
    }
  }
</style>

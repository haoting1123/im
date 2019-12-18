<template>
  <!--<el-container>-->
  <!--<el-header style="line-height: 70px; height: 70px;">-->
  <!--<head-nav></head-nav>-->
  <!--</el-header>-->
  <!--<el-container>-->
  <!--&lt;!&ndash;<el-aside width="180px" >&ndash;&gt;-->
  <!--<sidebar class="sidebar-container"/>-->
  <!--&lt;!&ndash;</el-aside>&ndash;&gt;-->
  <!--<el-main style="padding: 0;">-->
  <!--<navbar/>-->
  <!--<app-main/>-->
  <!--</el-main>-->
  <!--</el-container>-->
  <!--</el-container>-->
  <div class="home">
    <head-nav/>
    <div class="left-fixed-right-auto">
      <sidebar class="sidebar-container"/>
      <!--<left-menu></left-menu>-->
      <div :style="{'width':winWidth+'px','height':winHeight+'px'}" class="content_page">
        <div class="content">
          <navbar/>
          <app-main/>
          <!--页面渲染入口-->
        </div>
      </div>
    </div>
  </div>
  <!--<div style="height: 130px; width: 100%; background-color: #00b4aa;"></div>-->
  <!--<div :class="classObj" class="app-wrapper">-->
  <!--<div v-if="device==='mobile'&&sidebar.opened" class="drawer-bg" @click="handleClickOutside"/>-->
  <!---->
  <!--<div class="main-container">-->
  <!---->
  <!--</div>-->
  <!--</div>-->
</template>

<script>
import { Navbar, Sidebar, AppMain, HeadNav } from './components'
import ResizeMixin from './mixin/ResizeHandler'

export default {
  name: 'Layout',
  components: {
    Navbar,
    Sidebar,
    AppMain,
    HeadNav
  },
  winWidth: '',
  winHeight: '',
  mixins: [ResizeMixin],
  computed: {
    sidebar() {
      return this.$store.state.app.sidebar
    },
    device() {
      return this.$store.state.app.device
    },
    classObj() {
      return {
        hideSidebar: !this.sidebar.opened,
        openSidebar: this.sidebar.opened,
        withoutAnimation: this.sidebar.withoutAnimation,
        mobile: this.device === 'mobile'
      }
    }
  },
  created() {
    this.winWidth = this.$$lib_$(window).width() - 180
    this.winHeight = this.$$lib_$(window).height() - 70
  },
  mounted() {
    this.$$lib_$('.sidebar-container').height(this.$$lib_$(document).height() - 70)
  },
  methods: {
    handleClickOutside() {
      this.$store.dispatch('CloseSideBar', { withoutAnimation: false })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  @import "src/styles/mixin.scss";

  .app-wrapper {
  @include clearfix;
    position: relative;
    height: 100%;
    width: 100%;

  &
  .mobile.openSidebar {
    position: fixed;
    top: 0;
  }

  }
  .drawer-bg {
    background: #000;
    opacity: 0.3;
    width: 100%;
    top: 0;
    height: 100%;
    position: absolute;
    z-index: 999;
  }
  .el-header{

    line-height:90px;
  }
  .content_page {
    position: fixed;
    top: 71px;
    background: #fff;
    overflow: auto;
    margin-left: 180px;
  }
  .content {
    width: 100%;
    height: 100%;
  }
</style>

<template>
  <div v-if="systemNotice.title">
    <el-dialog
      :visible.sync="showSystemNoticeFlag"
      title="系统公告"
      width="450px"
    >
      <div class="system-notice-component">
        <h2 class="title">{{ systemNotice.title }}</h2>
        <p class="content">{{ systemNotice.content }}</p>
        <div class="button-box">
          <el-button @click="showSystemNoticeFlag = false" type="primary">知道了</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import { mapState } from 'vuex'
  export default {
    data () {
      return {
        showSystemNoticeFlag: false
      }
    },
    computed: {
      ...mapState({
        systemNotice: state => state.home.systemNotice
      })
    },
    mounted () {
      this.$nextTick(() => {
        this.$on('openDialog', () => {
          this.showSystemNoticeFlag = true
        })
      })
    }
  }
</script>

<style lang="scss">
  .system-notice-component {
    .title {
      font-size: 20px;
      font-weight: normal;
      text-align: center;
    }
    .content {
      margin-top: 20px;
      font-size: 14px;
      text-indent: 2em;
    }
    .button-box {
      margin-top: 40px;
      text-align: center;
      .el-button {
        width: 140px;
        height: 30px;
        padding: 0;
      }
    }
  }
</style>

<template>
  <div style="width:100%; height:150px; text-align:center;">
    <div style="margin-top:100px;">
      <img src="../../../../static/icon/icon_x64.png"  style="margin-bottom:10px;">
      <div v-if="badgeShow" style="margin-left:40px;">
        <el-badge value="new" class="item">
          <span style="height: 40px; line-height: 40px;">{{version}}</span>
        </el-badge>
      </div>
      <div v-else>
        <span>{{version}}</span>
      </div>
    </div>
  </div>
</template>

<script>
    import pkg from '../../../../package.json'

export default {
      name: 'about-info',
      data () {
        return {
          // loadingVisible: false,
          // dialogVisible: false,
          version: '',
          releaseDate: ''
        }
      },
      props: ['badgeShow'],
      methods: {
        handleDialogOpen () {
          this.version = '即时通 ' + pkg.version // + ' / ' + aboutInfo.releaseDate
          this.releaseDate = '' // '星图海辉公司版权所有 Copyright © 2018 Startway. All right reserved.' //aboutInfo.releaseDate
        }
      },
      mounted: function () {
        this.$nextTick(() => {
          this.handleDialogOpen()
        })
      }
    }
</script>

<style lang="scss" scoped>
    .about {
        padding-top: 50px;
        padding-left: 80px;
    }

    .item {
        margin-bottom: 10px;
        margin-right: 40px;
    }
</style>


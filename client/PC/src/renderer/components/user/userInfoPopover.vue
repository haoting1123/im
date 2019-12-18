<template>
  <div class="friendInfoPage">
    <div class="top">
      <div class="nickname">
        <div>
          {{selectedFriend.name ? selectedFriend.name : selectedFriend.name}}
          <template v-if="selectedFriend.channelType === 'G'">
            <span style="font-size: 12px">(群组)</span>
          </template>
          <template v-else>
            <i v-if="selectedFriend.sex === '男'" class="iconfont icon-nan nan"></i>
            <i v-else class="iconfont icon-nv nv"></i>
          </template>
        </div>
      </div>
      <div v-if="selectedFriend.photo || selectedFriend.headUrl" class="imgage">
        <img :src="selectedFriend.photo || selectedFriend.headUrl" alt="用户头像" style="width: 50px; height: 50px" />
      </div>
      <template v-else>
        <div class="imgage" v-if="selectedFriend.channelType === 'G'">
          <img class="status-wrapper-image" src="../../assets/images/qun.png" alt="">
        </div>
        <div class="imgage" v-else>
          <img v-if="selectedFriend.sex === 'man'" class="status-wrapper-image" src="../../assets/images/boy.png"/>
          <img v-else class="status-wrapper-image" src="../../assets/images/girl.png"/>
        </div>
      </template>
    </div>
    <div class="infoItem">
      <el-row>
        <el-col :span="4"><span class="title">姓名</span></el-col>
        <el-col :span="20">{{selectedFriend.name}}</el-col>
      </el-row>
      <el-row>
        <el-col :span="4"><span class="title">账号</span></el-col>
        <el-col :span="20">{{selectedFriend.jid}}</el-col>
      </el-row>
    </div>
    <!--<div class="btn">-->
      <!--<el-button type="success">发消息</el-button>-->
    <!--</div>-->
  </div>
</template>

<script>
  import { outputError } from '@/utils/exception'
  // import { getUserInfo } from '@/api/user'
  import { baseUrl } from '@/utils/url'

export default {
  name: 'user-info-popover',
  data() {
    return {
      selectedFriend: {}
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.$on('openDialog', function(userInfo) {
        this.selectedFriend = userInfo
      })
    })
  },
  methods: {}
}
</script>

<style lang="scss" scoped>
  .friendInfoPage {
    width: 240px;
    height: 200px;
    margin: 0 auto;
    .top {
      padding-top: 5px;
      height: 85px;
      border-bottom: 1px solid #DBD9D6;
      .nickname {
        font-size: 16px;
        float: left;
        i{
          font-size: 14px;
          margin-left: 5px;
        }
        .nv{
          color: #F37E7D;
        }
        .nan{
          color: #46B6EF;
        }
      }
      .status-wrapper-image {
        border-radius: 100%;
        width: 100%;
        height: 100%;
        background-color: #DDDEE0;
      }
      .imgage {
        width: 64px;
        height: 64px;
        float: right;
        border-radius: 32px;
      }
    }
    .infoItem {
      padding-top: 15px;
      height: 80px;
      line-height: 35px;
      font-size: 12px;
      .title {
        color: #888;
      }
    }
    .btn {
      height: 30px;
      text-align: center;
      padding: 20px 0 0 0;
      button {
        padding: 12px 50px;
      }
    }
  }
</style>


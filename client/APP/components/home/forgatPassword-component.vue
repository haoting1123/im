<template>
  <view class="forgat-password-main-component">
    <!--忘记密码-->
    <view class="cu-modal" :class="showForgatPasswordModalFlag ? 'show' : ''">
      <view class="cu-dialog">
        <view class="cu-bar bg-white justify-end">
          <view class="content">忘记密码</view>
          <view class="action" @tap="hideModal">
            <text class="cuIcon-close text-red"></text>
          </view>
        </view>
        <view class="padding-xl">
          <input
            type="text"
            v-model="account"
            placeholder="请输入用户名!"
            placeholder-style="margin-top: 10upx;"
            style="width: 100%; height: 70upx; line-height: 70upx; text-align: left; padding: 0 20upx;" />
        </view>
        <view class="cu-bar bg-white justify-end">
          <view class="action">
            <button class="cu-btn cancel-btn" @tap="hideModal">取消</button>
            <button class="cu-btn margin-left sure-btn" @tap="forgatPassword">确定</button>
          </view>
        </view>
      </view>
    </view>
    <!--解决方案-->
    <view class="cu-modal" :class="showSolutionModalFlag ? 'show' : ''">
      <view class="cu-dialog">
        <view class="cu-bar bg-white justify-end">
          <view class="content">解决方案</view>
          <view class="action" @tap="hideSolutionModal">
            <text class="cuIcon-close text-red"></text>
          </view>
        </view>
        <view v-if="solution.phone" class="padding-xl solution">
          联系管理员:{{ solution.phone }}!
        </view>
        <view v-else  class="padding-xl solution">管理员尚未保留联系方式，请尽快通过其他途径联系管理员恢复使用!</view>
      </view>
    </view>
  </view>
</template>

<script>
  import { mapActions } from 'vuex'
  export default {
    data () {
      return {
        showForgatPasswordModalFlag: false,
        showSolutionModalFlag: false,
        // 解决方案
        solution: {},
        account: ''
      }
    },
    onLoad () {},
    onShow () {},
    onReady () {
      this.$on('showModal', function () {
        this.showForgatPasswordModalFlag = true
      })
    },
    methods: {
      ...mapActions([
        'ForgetPassword'
      ]),
      hideModal () {
        this.showForgatPasswordModalFlag = false
      },
      hideSolutionModal () {
        this.showSolutionModalFlag = false
      },
      // 忘记密码
      forgatPassword () {
        if (!this.account.replace(/\s/g, '')) {
          uni.showToast({
            title: '请输入有效的用户名!',
            icon: 'none'
          })
          return
        }
        this.ForgetPassword(this.account)
          .then(data => {
            console.log(`data:${JSON.stringify(data)}`)
            this.showForgatPasswordModalFlag = false
            this.solution = data
            setTimeout(() => {
              this.showSolutionModalFlag = true
            }, 1000)
          })
          .catch(err => {
            // console.log(`err:${JSON.stringify(err)}`)
            uni.showToast({
              title: '请输入有效的用户名!',
              icon: 'none'
            })
          })
      }
    }
  }
</script>

<style lang="scss">
.forgat-password-main-component {
  .cancel-btn {
    border: 1px solid #77B3D7;
    color: #77B3D7;
    background: white;
  }
  .sure-btn {
    color: white;
    background: #77B3D7
  }
  .solution {
    text-align: left
  }
}
</style>

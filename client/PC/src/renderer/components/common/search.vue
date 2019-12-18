<template>
  <div class="channel-search-component drag">
    <div class="search no-drag">
      <i class="el-icon-search"></i>
      <input
        type="text"
        v-model="searchContent"
        ref="searchInput"
        @click.stop=""
        @input="onSearch($event)"
        @focus.stop="onSearch($event)"
        @blur="endSearch"
        placeholder="搜索"
      />
      <i v-if="isFocus && searchContent" class="el-icon-circle-close" @click="emptySearchContent"></i>
    </div>
    <el-button
      v-if="activeTab === 'message' || activeTab === 'group'"
      size="mini"
      icon="el-icon-plus"
      title="创建群聊"
      @click="startCreateGroup"
      class="create-group-button"
    ></el-button>
    <!--创建群聊-->
    <create-group ref="createGroupDialog"></create-group>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
// 上一次执行该函数的时间
let lastTime = 0
export default {
  data () {
    return {
      isFocus: false,
      searchContent: '',
      isCreateGroupDialog: false,
      addGroupForm: {
        name: ''
      }
    }
  },
  components: {
    createGroup: require('@/components/group/createGroup-component.vue').default
    // createGroup: require('@/components/group/createGroupChannel.vue').default
  },
  computed: {
    ...mapState({
      userInfo: state => state.home.userInfo,
      activeTab: state => state.home.activeTab
    })
  },
  methods: {
    ...mapActions([
      'CreateGroup',
      'SaveGroup'
    ]),
    // 清空搜索内容
    emptySearchContent () {
      this.searchContent = ''
      this.$nextTick(() => {
        this.$refs.searchInput.focus()
      })
    },
    // 显示创建群聊的
    startCreateGroup () {
      this.$refs.createGroupDialog.$emit('createEvent-event')
    },
    // 节流函数
    startSearch (event) {
      if (!this.isFocus) this.isFocus = true
      setInterval(this.throttle(this.onSearch)(event, 100))
    },
    onSearch (event) {
      if (!this.isFocus) this.isFocus = true
      let iUserAgent = navigator.userAgent
      if (iUserAgent.indexOf('Linux') !== -1) {
        this.$nextTick(() => {
          this.$refs.searchInput.focus()
        })
      }
      console.log(event.target.value)
      this.$emit('onsearch', event.target.value)
    },
    // 节流
    throttle (func, wait = 50) {
      return function (...args) {
        // 当前时间
        let now = +new Date()
        // 将当前时间和上一次执行函数时间对比
        // 如果差值大于设置的等待时间就执行函数
        if (now - lastTime > wait) {
          lastTime = now
          func.apply(this, args)
        }
      }
    },
    // 结束搜索
    endSearch () {
      this.$emit('onendsearch')
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss">
  .channel-search-component{
    display: flex;
    padding: 15px;
    margin-top: 12px;
    .search {
      flex: 1;
      display: flex;
      align-items: center;
      border-radius: 3px;
      background-color: #f7f7f7;
      i {
        padding: 0 5px;
        font-size: 14px;
        color: #999999;
        cursor: pointer;
      }
      input {
        width: 100%;
        height: 26px;
        border: none;
        font-size: 12px;
        font-family: '微软雅黑';
        background-color: transparent;
        -webkit-appearance: textfield;
        -webkit-rtl-ordering: logical;
        color: #000;
        outline: none;
      }
      input::-webkit-input-placeholder {
        color: #999;
      }
      input::-moz-placeholder {   /* Mozilla Firefox 19+ */
        color: #999;
      }
      input:-moz-placeholder {    /* Mozilla Firefox 4 to 18 */
        color: #999;
      }
      input:-ms-input-placeholder {  /* Internet Explorer 10-11 */
        color: #999;
      }
    }
    .create-group-button {
      width: 28px;
      padding: 0px;
      border: 0px;
      font-size: 18px;
      text-align: center;
      color: #8FB3CC;
      background: #fff;
      &:hover {
        color: #8FB3CC;
        background: #fff;
      }
    }
  }
</style>

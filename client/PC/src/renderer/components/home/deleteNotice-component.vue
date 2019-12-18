<template>
  <div class="notice-dialog-component">
    <!--删除会话弹窗-->
    <div class="delete-chat-dialog" v-if="showDeleteChatDialog">
      <p class="notice-message">{{ message }}</p>
      <div class="button-group">
        <button class="sure-delete" @click="deleteInfo">确定</button>
        <button class="cancel-delete" @click="cancelDelete">取消</button>
      </div>
    </div>
    <div class="delete-chat-dialog-bg" v-if="showDeleteChatDialog"></div>
  </div>
</template>

<script>
  export default {
    props: ['showDeleteChatDialog', 'message', 'sureName', 'cancelName'],
    data () {
      return {}
    },
    methods: {
      deleteInfo () {
        this.$emit(this.sureName)
      },
      cancelDelete () {
        this.$emit(this.cancelName)
      }
    }
  }
</script>

<style lang="scss">
  .notice-dialog-component {
    .delete-chat-dialog-bg {
      position: fixed;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      color: #171717;
      background: rgba(0, 0, 0, .2);
      z-index: 9998;
    }
    .delete-chat-dialog {
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translateX(-50%) translateY(-50%);
      font-size: 14px;
      background: white;
      z-index: 9999;
      border-radius: 14px;
      .notice-message {
        height: 80px;
        line-height: 80px;
        padding: 0 20px;
      }
      .button-group {
        display: flex;
        border-top: 1px solid #dfdfdf;
        button {
          flex: 1;
          height: 40px;
          line-height: 40px;
          border: none;
          font-size: 14px;
          font-family: '微软雅黑';
          background: none;
          cursor: pointer;
          outline: none;
        }
        .sure-delete {
          color: #EE1111;
        }
        .cancel-delete {
          border-left: 1px solid #dfdfdf;
        }
      }
    }
  }
</style>

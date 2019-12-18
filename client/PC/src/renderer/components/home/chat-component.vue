<template>
  <div class="chat-component">
    <header class="title-section">
      <h2>张三</h2>
    </header>
    <section class="content-section">
      <div class="message-box"></div>
      <div class="operation-box">
        <div class="toolbar">
          <div class="icon-group">
            <img src="../../assets/images/chat/biaoqing.png" alt="icon" />
            <img src="../../assets/images/chat/caijianweijihuo.png" alt="icon" />
            <img src="../../assets/images/chat/tupian-2.png" alt="icon" />
            <img src="../../assets/images/chat/wenjian.png" alt="icon" />
            <img src="../../assets/images/chat/shoucang.png" alt="icon" />
            <img src="../../assets/images/chat/tel.png" alt="icon" />
          </div>
          <div class="message-record">消息记录</div>
        </div>
        <div class="content"></div>
        <div class="submit">
          <!--<button>发送</button>-->
        </div>
      </div>
    </section>
  </div>
</template>

<script>
  export default {
    data () {
      return {}
    }
  }
</script>

<style lang="scss">
  .chat-component {
    .title-section {
      h2 {
        height: 55px;
        line-height: 55px;
        margin: 0;
        padding-left: 20px;
        border-bottom: 1px solid #dfdfdf;
        font-size: 16px;
      }
    }
    .content-section {
      .message-box {
        height: 200px;
      }
      .operation-box {
        border-top: 1px solid #dfdfdf;
        .toolbar {
          display: flex;
          justify-content: space-between;
          height: 30px;
          line-height: 30px;
          font-size: 0;
          .icon-group {
            img {
              vertical-align: middle;
              width: 15px;
              height: 15px;
              margin-left: 20px;
              cursor: pointer;
            }
          }
          .message-record {
            padding-right: 15px;
            font-size: 14px;
            color: #6E7882;
            cursor: pointer;
          }
        }
        .submit {}
      }
    }
  }
</style>

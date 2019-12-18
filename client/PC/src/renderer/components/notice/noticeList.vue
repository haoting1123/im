<template>
  <div class="content" >
    <div class="notice-btn">
      <el-button type="primary" size="mini" @click="addNotice" :disabled="!isAdmin">发布公告</el-button>
    </div>
    <div class="notice-list-panel" :style="'height:' + (dialogContainerHeight - 50) + 'px'">
      <div class="notice-panel" v-for="item in groupNoticeList" :key="item.id">
        <h2 class="title">{{item.title}}</h2>
        <el-row>
          <el-col>
            <div class="notice-content">{{item.content}}</div>
          </el-col>
          <el-col :span="24">

            <div style="display: inline">
              <div style="float: left;padding-left: 15px;"><el-button type="text" @click="deleteNotice(item)" :disabled="!isAdmin">删除</el-button></div>
              <div class="notice-panel-foot">{{item.userName}} 发表于 {{item.createTime | formatDate}}</div>
            </div>
          </el-col>
        </el-row>
      </div>
    </div>
    <el-dialog
      :close-on-click-modal="false"
      @close="hiddenNotice"
      width="400px"
      :modal="modalVisible"
      :visible.sync="noticeDialog">
      <div slot="title"><h3>发布公告</h3></div>
      <div style="max-height: 320px;overflow-y:auto;" >
        <notice-add v-if="addNoticeVisible" @getList="getParentGroupNotice" @modalVisible="hiddenNotice" :roomJid="roomJid"></notice-add>
        <notice-update v-if="updateNoticeVisible"  @modalVisible="hiddenNotice" :updateItem="updateItem"></notice-update>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { mapState, mapActions } from 'vuex'
import * as myDate from '@/utils/date'
import noticeAdd from '@/components/notice/noticeAdd'
import noticeUpdate from '@/components/notice/noticeUpdate'
export default {
  data () {
    return {
      noticeDialog: false,
      modalVisible: false,
      addNoticeVisible: true,
      updateNoticeVisible: true,
      updateItem: '',
      updateNotice: true,
      isGroupOwner: false
    }
  },
  props: ['roomJid', 'userChannel', 'groupNoticeList', 'getGroupNotice', 'isAdmin'],
  components: {
    noticeAdd, noticeUpdate
  },
  mounted () {
    // this.getGroupNotice()
    // this.getGroupOwner()
  },
  filters: {
    formatDate: function (time) {
      return myDate.formatDate(new Date(time), 'yyyy-MM-dd hh:mm:ss')
    }
  },
  computed: {
    ...mapState({
      userInfo: state => state.home.userInfo,
      groupList: state => state.group.groupList,
      dialogContainerHeight: state => state.drag.dialogContainerHeight
    })
  },
  methods: {
    ...mapActions(['GetGroupNotice', 'DeleteGroupNotice']),
    deleteNotice (item) {
      this.$confirm('确定要删除该公告吗？', '提示', {
        type: 'warning'
      })
        .then(() => {
          this.DeleteGroupNotice(item.id).then(() => {
            this.getParentGroupNotice()
          })
        })
        .catch(error => {
          // eslint-disable-next-line no-undef
          outputError(this, error)
        })
    },
    hiddenNotice () {
      this.noticeDialog = false
      this.addNoticeVisible = false
      this.updateNoticeVisible = false
    },
    addNotice () {
      this.addNoticeVisible = true
      this.updateNoticeVisible = false
      this.noticeDialog = true
    },
    getParentGroupNotice () {
      this.$emit('getGroupNotice')
    },
    // getGroupNotice () {
    //   let dataParam = {
    //     roomJid: this.roomJid,
    //     page: '1',
    //     size: '100'
    //   }
    //   this.GetGroupNotice(dataParam).then(data => {
    //     console.log('群公告列表')
    //     this.groupNoticeList = data.data.content
    //     this.$emit('mostNewGroupNotice', data.data.content.length && data.data.content[0])
    //     // console.log(this.groupNoticeList)
    //   }).catch(error => {
    //     console.log(error)
    //   })
    // },
    handleUpdate (item) {
      this.noticeDialog = true
      this.addNoticeVisible = false
      this.updateNoticeVisible = true
      this.updateItem = item
    }

  }
}
</script>
<style lang="scss" scoped>
.notice-list-panel{
  overflow: scroll;
}
.toolBtn {
  font-size: 16px;
  padding-left: 10px;
}
.content {
  padding: 8px 10px 8px 10px;
}
.notice-btn {
  text-align: right;
  padding: 5px 10px 5px 0px;
  background-color: #ffffff;
}
.notice-panel-foot {
  float: right;
  text-align: right;
  padding: 5px 10px 0px 0px;
  color: #909399;
  font-size: 12px;
}
.notice-panel {
  padding: 5px 10px 0px 0px;
  background-color: #ffffff;
  margin-top: 10px;
  overflow: scroll;
}
.title {
  color: #4b4a4a;
  padding: 5px 0px 10px 10px;
}
.notice-content{
  color: #909399;
  margin-left:11px;
  font-size: 13px;
  word-wrap: break-word;
}
</style>


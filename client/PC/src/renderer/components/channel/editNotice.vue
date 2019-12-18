<template>
  <el-dialog :modal-append-to-body="false" :visible.sync="dialogVisible" width="500px" v-loading="loadingVisible" @open="handleDialogOpen()">
    <div slot="title" class="dialog-header"><h3>编辑公告</h3></div>
    <el-form ref="form" :model="model" style="border-bottom: solid 1px #EFEEEC;"  @submit.native.prevent>
      <el-form-item label="" prop="content" style="margin-left: 20px">
        <el-col :span="23">
          <input ref="content" type="text" :rows="5" v-model="model.content" placeholder="请输入公告..." />
        </el-col>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button size="small" @click="dialogVisible = false">取 消</el-button>
      <el-button type="primary" size="small" :disabled="!saveButtonEnable" @click="doSaveChannelName()">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
// import { saveNotice,updateNotice } from '@/api/channel'
import { outputError } from '@/utils/exception'

export default {
  name: 'edit-notice',
  data() {
    return {
      loadingVisible: false,
      dialogVisible: false,
      oldContent: '',
      model: {
        id: '',
        channelId: '',
        content: ''
      }
    }
  },
  methods: {
    handleDialogOpen() {
      this.$nextTick(() => {
        this.$refs['content'].focus()
      })
    },
    doSaveChannelName() {
      this.loadingVisible = true;
      if(this.model.id){
        updateNotice(this.model.id, this.model)
        .then(response => {
          this.$emit('onRefreshNoticeContent', this.model.content)
          this.loadingVisible = false
          this.dialogVisible = false
        })
        .catch(error => {
          this.loadingVisible = false
          outputError(this, error)
        })
      }else{
        saveNotice(this.model.channelId, this.model)
        .then(response => {
          this.loadingVisible = false
          this.dialogVisible = false
          this.$emit('onRefreshNoticeContent', this.model.content)
        })
        .catch(error => {
          this.loadingVisible = false
          outputError(this, error)
        })
      }

    }
  },
  computed: {
    saveButtonEnable() {
      return this.oldContent !== this.model.content && (this.model.content !== '' || this.model.id)
    }
  },
  mounted: function() {
    this.$nextTick(() => {
      this.$on('openDialog', function(userChannel) {
        this.model.id = userChannel.noticeId
        this.model.channelId = userChannel.channelId
        this.oldContent = this.model.content = userChannel.noticeContent
        this.dialogVisible = true
      })
    })
  }
}
</script>


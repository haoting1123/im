<template>
  <el-dialog :visible="changePasswordDialog" width="500px" v-loading="loadingVisible" @open="handleDialogOpen()" @close="onClose">
    <div slot="title" class="dialog-header"><h3>重置密码</h3></div>
    联系电话：010-2132321321321
  </el-dialog>
</template>

<script>
import { mapActions } from 'vuex'
import { outputError } from '@/utils/exception'

export default {
  name: "change-password",
  data() {
    return {
      loadingVisible: false,
      dialogVisible: false,
    }
  },
  methods: {
    ...mapActions([]),
    onClose () {
    },
    doChangePassword() {
    }
  },
  mounted: function() {
    this.$nextTick(() => {
      this.$on('openDialog', function(action) {
        this.dialogVisible = true
      })
    })
  }
}
</script>

<style lang="scss" scoped>
.vc-input {
  float: left;
  width: 190px;
}
.vc {
  width: 70px;
  height: 30px;
  line-height: 30px;
  float: right;
  border: solid 1px #CECECE;
  background-color: #F0F0F0;
  text-align: center;
  color: #007ACC;
}
.vc:hover {
  cursor: pointer;
}
</style>


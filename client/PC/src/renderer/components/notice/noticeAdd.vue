<template>
  <div>
    <el-form ref="form" :model="form" label-width="50px" :rules="formRules"  @submit.native.prevent>
      <el-form-item label="标题" prop="title">
        <input v-model="form.title" type="text" class="custom-input" style="width:90%"/>
      </el-form-item>
      <el-form-item label="正文" prop="content">
        <el-input v-model="form.content" type="textarea"></el-input>
      </el-form-item>
      <div class="footer">
        <el-button size="small" @click="onReseting">取消</el-button>
        <el-button size="small" type="primary" @click="onSubmit">发布</el-button>
      </div>
    </el-form>
  </div>
</template>
<script>
import { mapState, mapActions } from 'vuex'
export default {
  data () {
    return {
      form: {
        id: 0,
        title: '',
        content: '',
        createTime: '',
        roomJid: '',
        userName: ''
      },
      formRules: {
        title: [
          { required: true, message: '请输入公告标题', trigger: 'blur' },
          { min: 1, max: 32, message: '长度在 1 到 32 个字符', trigger: 'blur' }
        ],
        content: [
          { required: true, message: '请输入公告正文', trigger: 'blur' },
          { min: 1, max: 500, message: '长度在 1 到 500 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    ...mapState({
      userInfo: state => state.home.userInfo
    })
  },
  mounted () {

  },
  props: ['modalVisible', 'roomJid'],
  methods: {
    ...mapActions(['AddGroupNotice', 'sendGroupOtherMessage']),
    onSubmit () {
      this.addHandle()
    },
    onReseting () {
      this.$refs.form.resetFields()
      this.$emit('modalVisible')
    },
    addHandle () {
      this.$refs['form'].validate(valid => {
        if (valid) {
          this.form.roomJid = this.roomJid
          this.form.userName = this.userInfo.name
          this.form.createTime = new Date()
          console.log('新增公告', this.form)
          this.AddGroupNotice(this.form).then((data) => {
            this.form.id = data.data.id
            let message = {
              to: this.roomJid,
              content: JSON.stringify(this.form),
              type: 'GROUP_NOTICE'
            }
            this.sendGroupOtherMessage(message)
            this.$emit('getList')
            this.onReseting()
            this.$message({
              message: '公告发布成功',
              type: 'success'
            })
          }).catch(error => { console.log('新增公告失败', error) })
        } else {
          return false
        }
      })
    }
  }
}
</script>
<style>
  .footer{
      text-align: right;
  }
  .custom-input{
    height:30px;
    line-height: 30px;
    border:1px solid #EBEEF5;
    padding:2px 5px;
    width: 100%;
    border-radius: 5px;
  }
</style>


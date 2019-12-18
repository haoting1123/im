<template>
  <div>
    <el-form ref="form" :model="form" label-width="50px" :rules="formRules"  @submit.native.prevent>
      <el-form-item label="标题" prop="title">
        <input type="text" :rows="5" v-model="form.title" class="custom-input" />
      </el-form-item>
      <el-form-item label="正文" prop="content">
        <input type="text" :rows="5" v-model="form.content" class="custom-input" />
      </el-form-item>
      <div class="footer">
        <el-button size="small" @click="onReseting">取消</el-button>
        <el-button size="small" @click="onSubmit">发布公告</el-button>
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
        title: '',
        content: '',
        createTime: '',
        roomJid: '1111',
        userName: ''
      },
      formRules: {
        title: [
          { required: true, message: '请输入公告标题', trigger: 'blur' },
          { min: 1, max: 32, message: '长度在 1 到 32 个字符', trigger: 'blur' }
        ],
        content: [
          { required: true, message: '请输入公告正文', trigger: 'blur' },
          { min: 1, max: 32, message: '长度在 1 到 500 个字符', trigger: 'blur' }
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
    this.form = this.updateItem
  },
  props: ['modalVisible', 'updateItem'],
  methods: {
    ...mapActions(['UpdateGroupNotice']),
    onSubmit () {
      this.updateHandle()
    },
    onReseting () {
      this.$refs.form.resetFields()
      this.$emit('modalVisible')
    },
    updateHandle () {
      this.form.createTime = new Date()
      this.form.id = this.updateItem.id
      console.log('this.updateItem=', this.form)
      this.$refs['form'].validate(valid => {
        if (valid) {
          this.UpdateGroupNotice(this.form).then(data => {
            this.$emit('getList')
            this.onReseting()
            this.$message({
              message: '公告发布成功',
              type: 'success'
            })
          }).catch(error => { console.log(error) })
        } else {
          return false
        }
      })
    }

  }
}
</script>
<style lang="scss">
    .footer{
        text-align: right;
    }
</style>


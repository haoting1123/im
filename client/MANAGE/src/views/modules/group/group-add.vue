<template>
  <div>
    <el-form ref="dataForm" :model="dataForm" :rules="dataRule" label-width="80px">
      <el-form-item label="机构编码" prop="code">
        <el-input v-model="dataForm.code" :maxlength="32" placeholder="机构编码" ></el-input>
      </el-form-item>
      <el-form-item label="机构名称" prop="groupName">
        <el-input v-model="dataForm.groupName" :maxlength="62" placeholder="机构名称"></el-input>
      </el-form-item>
    </el-form>
    <div style="text-align:right;">
      <el-button type="plain" @click="cancel()">取消</el-button>
      <el-button type="primary" @click="groupCount()">确定</el-button>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
export default {
  data() {
    return {
      dataForm: {
        id: 0,
        code: '',
        groupName: '',
        parentCode: ''
      },
      validataCode: true,
      dataRule: {
        code: [
          { required: true, message: '机构编码', trigger: 'blur' }
        ],
        groupName: [
          { required: true, message: '机构名称', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    ...mapActions(['addTreeNode','GetGroupCount']),
    groupCount(){
      this.GetGroupCount(this.dataForm.code).then(response => {
        console.log('response=========>',response)
        if(response > 0 ){
          this.validataCode = false;
          this.$message({
            message: '机构编码已存在',
            type: 'warning',
          })
        }else{
          this.dataFormSubmit();
        }
      })
    },
    init(id, parentCode) {
      this.dataForm.id = id || 0
      this.dataForm.parentCode = parentCode
      this.$nextTick(() => {
        this.$refs['dataForm'].resetFields()
      })
    },
    cancel() {
      this.dataForm.groupName = ''
      this.dataForm.parentCode = ''
      this.$emit('update:addTreeDialog', false)
    },
    // 表单提交
    dataFormSubmit() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.addTreeNode(this.dataForm)
            .then((res) => {
              if (res) {
                this.$message({
                  message: '操作成功',
                  type: 'success',
                  duration: 1500,
                  onClose: () => {
                    this.$emit('refreshDataList')
                  }
                })
              } else {
                this.$message.error('操作失败')
              }
            })
            .catch(() => {})
        }
      })
    }
  }
}
</script>

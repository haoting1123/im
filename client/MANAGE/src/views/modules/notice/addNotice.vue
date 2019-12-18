<template>
  <div class="app-search-container">
    <el-form ref="dataForm" :rules="dataRule" :model="dataForm" label-width="130px">
      <el-form-item label="标题" prop="title">
        <el-input v-model="dataForm.title" :maxlength="16" placeholder="请填写标题" style="width: 510px;"/>
      </el-form-item>
      <el-form-item label="内容" prop="content">
        <el-input :rows="4" v-model="dataForm.content" type="textarea" placeholder="请填写公告内容" style="width: 510px;"/>
      </el-form-item>
      <el-form-item label="机构范围" style="width: 100%;">
        <div style="text-align: left">
          <cus-transfer :titles="['机构列表', '已选机构']" v-model="organizeValue" :data="organizeOptions" filterable filter-placeholder="请输入搜索项" />
        </div>
      </el-form-item>
    </el-form>
    <div style="width: 100%;text-align: center;">
      <el-button :loading="btnloading" type="primary" @click="onSubmit">确定</el-button>
      <el-button type="primary" @click="reSet">重置</el-button>
    </div>
  </div>
</template>
<script>

import CusTransfer from '@/components/transfer/main'
import { mapActions } from 'vuex'
import { getStore } from '@/utils/mUtils.js'
export default {
  components: { CusTransfer },
  data() {
    return {
      dataForm: {
        id: '',
        title: '',
        content: '',
        createTime: new Date(),
        codes: getStore('userinfo').groupCode
      },
      chargerList: [],
      organizeOptions: [],
      organizeValue: '',
      isChargerVisible: false,
      btnloading: false,
      dataRule: {
        title: [
          { required: true, message: '公告标题不能为空', trigger: 'blur' },
          { min: 2, max: 100, message: '长度在 2 到 100 个字符', trigger: 'blur' }
        ],
        content: [
          { required: true, message: '公告内容不能为空', trigger: 'blur' },
          { min: 2, max: 200, message: '长度在 2 到 200 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  mounted() {
    // this.getChargerList(); //获取公司列表
    this.getInitData()
  },
  methods: {
    ...mapActions(['GetGroupNoList', 'AddNotice', 'SendNotice']),
    reSet: function() {
      // this.form.groupName = "";
      this.dataForm.title = ''
      this.dataForm.content = ''
    },
    getInitData() {
      // 获取机构addUserPre
      this.GetGroupNoList().then(data => {
        for (let i = 0; i < data.length; i++) {
          var obj = {
            key: data[i].code + ',',
            label: data[i].groupName
          }
          this.organizeOptions.push(obj)
        }
      }).catch(error => {
        console.log(error)
      })
    },
    //超级管理员发布公告
    onSubmit: function() {
      //this.organizeValue = this.organizeValue.substring(0, this.organizeValue.length - 1)
      this.dataForm.organizeInfo = this.organizeValue.substring(0, this.organizeValue.length - 1)
      console.log('机构范围========', this.dataForm)
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          //检查组织机构是否选择
          if(this.organizeValue === ''){
            console.log("判断组织机构是否为空")
            this.$message({
              message: '组织机构未选择',
              type: 'error',
              duration: 3000
            })
            return ;
          }
          this.addNotice()
        }
      })
    },
    addNotice: function() {
      this.btnloading = true
      this.AddNotice(this.dataForm).then(response => {
        if (response.id) {
          this.SendNotice(response.id).then(data => {
            this.$message({
              message: '发布成功',
              type: 'success',
              duration: 3000
            })
            this.$router.push('/notice')
          }).catch(error => { console.log(error) })
        }
        this.btnloading = false
      }).catch(error => { console.log(error) })
    }
  }
}
</script>
<style>
  .app-search-container {
    height: 100%;
    margin: 0 10px;
    padding-top: 20px;
    padding-left: 10px;
    padding-right: 10px;
  }
</style>

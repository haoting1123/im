<template>
  <div style="width:500px;">
    <el-form ref="dataForm" :model="dataForm" :rules="dataRule" label-width="150px">
      <el-form-item label="发送文件后缀" prop="sendFileSuffix">
        <el-input v-model="dataForm.sendFileSuffix" placeholder="发送文件的后缀"/>
        <span style="color: #999999">例如: ofd,doc 中间用英文逗号分隔</span>
      </el-form-item>
      <el-form-item label="单文件大小上限" prop="sendFileSize">
        <el-input
          v-model="dataForm.sendFileSize"
          :maxlength="3"
          :max="120"
          :min="0"
          type="number"
          placeholder="单文件大小上限"
        >
          <template slot="append">MB</template>
        </el-input>
        <span style="color: #999999">最大不能超过120MB</span>
      </el-form-item>
      <el-form-item label="服务器存储文件上限" prop="storageFileSize">
        <el-input
          v-model="dataForm.storageFileSize"
          :maxlength="5"
          :max="99999"
          :min="0"
          type="number"
          placeholder="服务器存储文件上限"
        >
          <template slot="append">MB</template>
        </el-input>
      </el-form-item>
      <el-form-item label="服务器存储消息上限" prop="storageMsgSize">
        <el-input
          v-model="dataForm.storageMsgSize"
          :maxlength="3"
          :max="100"
          :min="0"
          type="number"
          placeholder="服务器存储消息上限"
        >
          <template slot="append">万条</template>
        </el-input>
      </el-form-item>
      <el-form-item label>
        <el-button type="plain" @click="checkPwd()">重置</el-button>
        <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import { getStore } from '@/utils/mUtils.js'
export default {
  data() {
    var validateSendFileSize = (rule, value, callback) => {
      if (this.dataForm.sendFileSize > 120) {
        callback(new Error('文件大小上限不能大于120MB'))
      } else {
        callback()
      }
    }
    var validateStorageFileSize = (rule, value, callback) => {
      if (this.dataForm.storageFileSize > 9999) {
        callback(new Error('服务器存储文件上限不能大于9999MB'))
      } else {
        callback()
      }
    }
    var validateStorageMsgSize = (rule, value, callback) => {
      if (this.dataForm.storageMsgSize > 100) {
        callback(new Error('服务器存储消息上限不能大于100万条'))
      } else {
        callback()
      }
    }
    return {
      dataForm: {
        id: '',
        sendFileSuffix: '',
        sendFileSize: '',
        storageFileSize: '',
        storageMsgSize: '',
        kbMsgNumber: 10000
      },
      dataRule: {
        sendFileSuffix: [
          { required: true, message: '发送文件后缀不能为空', trigger: 'blur' }
        ],
        sendFileSize: [
          { required: true, message: '单文件大小上限不能为空', trigger: 'blur' },
          { validator: validateSendFileSize, trigger: 'blur' }
        ],
        storageFileSize: [
          { required: true, message: '服务器存储文件上限不能为空', trigger: 'blur' },
          { validator: validateStorageFileSize, trigger: 'blur' }
        ],
        storageMsgSize: [
          { required: true, message: '服务器存储消息上限不能为空', trigger: 'blur' },
          { validator: validateStorageMsgSize, trigger: 'blur' }
        ]
      }
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    ...mapActions(['CheckPwd', 'AddClientSet', 'UpdateClientSet', 'GetClientSet','ReNewClientSet','Login']),
    init() {
      console.log("获得客户端设置信息")
      this.GetClientSet().then(response => {
        console.log("客户端设置信息：" + JSON.stringify(response))
        if (response.length > 0) {
          const item = response[0]
          this.dataForm.id = item.id
          this.dataForm.sendFileSuffix = item.sendFileSuffix
          this.dataForm.sendFileSize = item.sendFileSize
          this.dataForm.storageFileSize = item.storageFileSize
          this.dataForm.storageMsgSize = item.storageMsgSize
        }
      }).catch(error => {
        console.log(error)
      })
    },
    //还原验证
    checkPwd() {
      //校验：输入用户密码二次确认，避免误操作
      this.$prompt('请输入密码确认初始化', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputType: 'password'
      }).then(({ value }) => {
        //重写验证方法  不可以使用登录方法来验证密码
        let userinfo = {
          username: getStore('userinfo').username,
          password: value
        }
        this.CheckPwd(userinfo)
          .then((data) => {
            console.log(data.msg)
            if (data.msg === 'success') {
              this.$message({
                type: 'success',
                message: '验证成功'
              });
              this.onResetting()
            }else{
              this.$message({
                type: 'warning',
                message: '密码错误,初始化失败'
              })
            }
          }).catch(() => {
            this.$message({
              type: 'error',
              message: '请求失败,初始化失败'
            })
          });
      }).catch(() => {
        this.$message({
          type: 'warning',
          message: '操作错误'
        });       
      });
    },
    // 还原初始设置
    onResetting() {
      //原代码：移除校验结果并重置字段值
      //this.$refs.dataForm.resetFields()
      //要还原初始设置
      console.log("还原初始设置开始")
      this.ReNewClientSet(this.dataForm).then(response => {
         console.log("初始化客户端信息：" + JSON.stringify(response))
         this.dataForm = response
        this.$message({
          message: '操作成功',
          type: 'success'
        })
      }).catch(error => { console.log(error) })
    },

    // 表单提交
    dataFormSubmit() {
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          if (this.dataForm.id) {
            console.log("修改客户端设置 id：" + this.dataForm.id)
            this.updateClient(this.dataForm)
          } else {
            this.addClient(this.dataForm)
          }
        }
      })
    },

    updateClient(data) {
      this.UpdateClientSet(data).then(response => {
        this.$message({
          message: '操作成功',
          type: 'success'
        })
      }).catch(error => { console.log(error) })
    },

    addClient(data) {
      this.AddClientSet(data).then(response => {
        this.$message({
          message: '操作成功',
          type: 'success'
        })
      }).catch(error => { console.log(error) })
    }
  }
}
</script>

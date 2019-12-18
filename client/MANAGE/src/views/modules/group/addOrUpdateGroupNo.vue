<template>
  <el-dialog
    :close-on-click-modal="false"
    :visible.sync="groupNoVisible"
    :title="title"
    :modal="false"
    width="500px"
    @close="cancelHanel"
  >
    <el-form
      ref="form"
      :model="form"
      :rules="dataRule"
      label-width="120px">
      <el-form-item label="上级机构" prop="superiorCode">
        <el-select v-model="superiorCode" clearable filterable placeholder="请选择机构名称">
          <el-option
            v-for="item in groupNoList"
            :key="item.code"
            :label="item.groupName"
            :value="item.code"
          ></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="机构编码" prop="code">
        <el-input v-model="form.code" :disabled="groupCodeVisible" :maxlength="50" placeholder="请输入机构编码" ></el-input>
      </el-form-item>
      <el-form-item label="机构名称" prop="groupName">
        <el-input v-model="form.groupName" :maxlength="60" placeholder="请输入机构名称"></el-input>
      </el-form-item>
      <el-form-item label="管理员账号" prop="code">
        <el-input v-model="form.code" disabled :maxlength="50" placeholder="管理员账号"></el-input>
      </el-form-item>
    </el-form>
    <div style="padding-left: 50px">
      管理员初始密码默认为：111111
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="cancelHanel()">取消</el-button>
      <el-button type="primary" @click="groupCount()">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
  import {mapActions} from 'vuex'

  export default {
    // eslint-disable-next-line vue/require-prop-types
    props: ['groupNoItem', 'groupNoVisible', 'title'],
    data() {
      return {
        groupNoList: [],
        organizeName: '',
        form: {
          id: '',
          groupName: '',
          code: '',
          parentCode: '-1',
          superiorCode: '',
          roleType: 'admin'
        },
        userName: '',
        superiorCode: '',
        groupCodeVisible:false,
        validataCode:true,
        dataRule: {
          code: [
            {required: true, message: '机构编码不能为空', trigger: 'blur'}
          ],
          groupName: [
            {required: true, message: '机构名称不能为空', trigger: 'blur'}
          ],
          userName: [
            {required: true, message: '管理员账号不能为空', trigger: 'blur'}
          ],
          password: [
            {required: true, message: '管理员密码不能为空', trigger: 'blur'}
          ]
        }
      }
    },
    mounted() {
      this.getGroupNoList()
      if (this.groupNoItem) {
        this.form = this.groupNoItem
        this.superiorCode = this.groupNoItem.superiorCode
        this.groupCodeVisible=true;
        console.log('this.superiorCode===', this.superiorCode)
      }else{
        this.groupCodeVisible=false;
      }
      // this.form = this.groupNoItem
    },
    methods: {
      ...mapActions(['GetGroupNoList', 'addTreeNode', 'AddUserAdmin','GetGroupCount']),
      // 新增组织机构
      groupCount(){
        console.log("addOrUpdateGroupNo.vue 判断机构是否存在")
        if(this.form.code=="") {
          return;
        }
        //判断新增组织机构代码是否已存在
        this.GetGroupCount(this.form.code).then(response => {
          console.log( "新增组织机构代码ID：" + this.form.id )
          if(this.form.id != ""){ //问题
            if(response > 1 ){
              this.validataCode = false;
              this.$message({
                message: '机构编码已存在',
                type: 'warning',
              })
            }else{
              this.dataFormSubmit(); 
            }
          }else if(this.form.id == ""){ //问题
            if(response > 0 ){
              this.validataCode = false;
              this.$message({
                message: '机构编码已存在',
                type: 'warning',
              })
            }else {
              this.dataFormSubmit()
            }
          }
        })
      },
      // 表单提交 新增组织机构信息
      dataFormSubmit() {
        console.log('addOrUpdateGroupNo.vue  新增组织', this.form)
        this.form.superiorCode = this.superiorCode
        this.$refs['form'].validate(valid => {
          if (valid) {
            //
            this.addTreeNode(this.form)
              .then(res => {
                if (res) {
                  //新增管理员
                  this.sumitUserAdmin();
                  this.$message({
                    message: '操作成功',
                    type: 'success',
                    duration: 1000,
                    onClose: () => {
                      console.log("addOrUpdateGroupNo.vue 通知父组件更新数据列表")
                      this.$emit('refreshDataList')
                    }
                  })
                } else {
                  this.$message.error('操作失败')
                }
              })
              .catch(() => {
              })
          }
        })
      },
      sumitUserAdmin() {
        console.log('addOrUpdateGroupNo.vue  新增管理员')
        let user = {
          username: this.form.code,
          plainPassword: '111111',
          groupCode: this.form.code,
          roleType: 'admin'
        }
        this.AddUserAdmin(user).then(data => {
          
        })
      },
      cancelHanel() {
        this.$emit('update:groupNoVisible', false)
        this.$refs.form.resetFields()
      },
      //获取组织机构信息 加载到选择框中
      getGroupNoList() {
        const params = {
          groupName: this.organizeName
        }
        this.GetGroupNoList(params)
          .then(data => {
            this.groupNoList = data
            console.log('this.groupNoList===', this.groupNoList)
          })
          .catch(error => {
            console.log(error)
          })
      }
    }
  }
</script>

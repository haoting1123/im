<template>
  <div>
    <div v-if="showVisible">
      <el-tabs v-model="activeName">
        <el-tab-pane label="国产客户端" name="mips"></el-tab-pane>
        <el-tab-pane label="微软客户端" name="windows"></el-tab-pane>
        <el-tab-pane label="安卓手机端" name="android"></el-tab-pane>
        <el-tab-pane label="苹果手机端" name="ios"></el-tab-pane>
      </el-tabs>
      <version :clientType="activeName"></version>
    </div>
    <div v-else>
      开心每一天&nbsp;^&nbsp;^
    </div>
  </div>
</template>

<script>
  import version from '@/components/version/version'

  export default {
    data () {
      return {
        activeName: 'mips',
        showVisible: true
      }
    },
    components: {
      version
    },
    mounted () {

    }
  }
</script>

<template>
  <div class="mod-home">
    <div class="four-grids">
      <el-row :gutter="20" align="middle" style="margin: 0px;">
        <el-col :span="6" :offset="6" class="four-grid">
          <a @click="toMenuHandle(path)">
            <div class="four-agileinfo">
              <div class="icon">
                <svg-icon icon-class="tree" style="color: #fff;height: 70px;width:70px" aria-hidden="true"></svg-icon>
              </div>
              <div class="four-text">
                <h3>机构管理</h3>
              </div>
            </div>
          </a>
        </el-col>
        <el-col :span="6" class="four-grid">
          <a @click="toMenuHandle('/user')" v-if="path=='/group'">
            <div class="four-w3ls">
              <div class="icon">
                <svg-icon icon-class="user" style="color: #fff; height: 70px;width:70px" aria-hidden="true"></svg-icon>
              </div>
              <div class="four-text">
                <h3>用户管理</h3>
              </div>
            </div>
          </a>
          <a @click="toMenuHandle('/notice')" v-else>
            <div class="four-w3ls">
              <div class="icon">
                <svg-icon icon-class="form" style="color: #fff;height: 70px;width:70px" aria-hidden="true"></svg-icon>
              </div>
              <div class="four-text">
                <h3>系统公告</h3>
              </div>
            </div>
          </a>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
  import { getStore } from '@/utils/mUtils.js'
  export default {
    data () {
      return {
        userinfo: '',
        path:''
      }
    },
    mounted () {
      this.userinfo = getStore('userinfo')
      if(this.userinfo.username == 'superAdmin'){
        this.path = '/groupNo';
      }else{
        this.path = '/group';
      }
    },
    methods: {
      toMenuHandle (path) {
        //跳转，这个方法会向history栈添加一个记录，点击后退会返回到上一个页面
        this.$router.push({path: path})
      }
    }
  }
</script>

<style>
  .mod-home {
    line-height: 1.5;
  }

  .four-agileinfo {
    background: #22beef;
    padding: 2em 0;
    text-align: center;
    cursor: pointer;

    box-shadow: 10px 10px 5px #888888;
    -moz-box-shadow: 10px 10px 5px #888888;
    -webkit-box-shadow: 10px 10px 5px #888888;
    -ms-box-shadow: 10px 10px 5px #888888;
    transition: background-color .2s ease-in;
    -moz-transition: background-color .2s ease-in;
    -webkit-transition: background-color .2s ease-in;
    -ms-transition: background-color .2s ease-in;
  }

  .four-agileinfo:hover {
    background-color: #0c0abb;

  }

  .four-w3ls {
    background: #a2d200;
    padding: 2em 0;
    text-align: center;
    cursor: pointer;
    box-shadow: 10px 10px 5px #888888;
    -moz-box-shadow: 10px 10px 5px #888888;
    -webkit-box-shadow: 10px 10px 5px #888888;
    -ms-box-shadow: 10px 10px 5px #888888;

    transition: background-color .2s ease-in;
    -moz-transition: background-color .2s ease-in;
    -webkit-transition: background-color .2s ease-in;
    -ms-transition: background-color .2s ease-in;
  }

  .four-w3ls:hover {
    background-color: #bb7909;
  }

  .four-grids {
    margin: 2em 0;
    width: 100%;
    padding-top: 100px;
  }

  .four-grid h3 {
    font-size: 20px;
    color: #fff;
    margin: 14px 0;
  }
</style>


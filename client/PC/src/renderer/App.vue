<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<style>
  /* CSS */
  body {
      font-family: "微软雅黑", "Microsoft YaHei","Arial","黑体","宋体",sans-serif;
  }
  #app {
    height: 100%;
    font-family: "微软雅黑", "Microsoft YaHei","Arial","黑体","宋体",sans-serif;
  }

  .no-drag {
      -webkit-app-region: no-drag;
  }


.atwho-view {
    position: absolute;
    top: 0;
    left: 0;
    display: none;
    margin-top: 18px;
    background: white;
    color: black;
    border: 1px solid #DDD;
    border-radius: 3px;
    box-shadow: 0 0 5px rgba(0,0,0,0.1);
    width: 120px;
    z-index: 11110 !important;
}

.atwho-view .atwho-header {
    padding: 5px;
    margin: 5px;
    cursor: pointer;
    border-bottom: solid 1px #eaeff1;
    color: #6f8092;
    font-size: 11px;
    font-weight: bold;
}

.atwho-view .atwho-header .small {
    color: #6f8092;
    float: right;
    padding-top: 2px;
    margin-right: -5px;
    font-size: 12px;
    font-weight: normal;
}

.atwho-view .atwho-header:hover {
    cursor: default;
}

.atwho-view .cur {
    background: #DCDFE6;
    color: #000;
}
.atwho-view .cur small {
    color: #000;
}
.atwho-view strong {
    color: #000;
}
.atwho-view .cur strong {
    color: #000;
    font:bold;
}
.atwho-view ul {
    /* width: 100px; */
    list-style:none;
    padding:5px 0;
    margin:auto;
    max-height: 200px;
    overflow-y: auto;
}
.atwho-view ul li {
    display: block;
    padding: 5px 15px;
    cursor: pointer;
    font-size: 12px;
    font-family: "微软雅黑", "Microsoft YaHei","Arial","黑体","宋体",sans-serif;
}
.atwho-view small {
    font-size: smaller;
    color: #777;
    font-weight: normal;
}
</style>

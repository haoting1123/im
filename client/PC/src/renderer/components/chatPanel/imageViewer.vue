<template>
  <el-dialog class="img-viewer-dlg" :visible.sync="dialogVisible" width="800px" top="5vh" center>
    <div class="closeWin" @click="closeWin">&nbsp;</div>
    <div class="image-container">
      <!-- <img :src="imageUrl">
      <div class="tool">
        <el-button icon="el-icon-download" size="mini" circle title="下载" @click="imageDownload"></el-button>
      </div>-->
      <div class="layout-mgt-30">
        <div class="tip" v-show="tip1">不能再放大了哦！</div>
        <div class="tip" v-show="tip2">不能再缩小了哦！</div>
        <div v-if="largeContainer" class="largeContainer">
          <div class="box-image-wrapper fl">
            <img
              :src="imageUrl"
              class="mainImg"
              :style="{maxWidth: mWidth,width: widthImg}"
              :class="{rotate90:rotate==1,rotate180:rotate==2,rotate270:rotate==3,rotate0:rotate==0}"
            >
            <br>
          </div>
        </div>
        <div class="bottom" v-if="largeContainer">
          <img src="../../assets/images/large.png" class="rotate controlImg" @click="largeImg">
          <img src="../../assets/images/small.png" class="rotate controlImg" @click="smallImg">
          <img src="../../assets/images/circle.png" class="rotate controlImg" @click="rotateImg">
          <img
            src="../../assets/images/circle1.png"
            class="rotate controlImg"
            @click="rotateImgBack"
          >
          <img
            src="../../assets/images/download_img.png"
            class="rotate controlImg"
            @click="imageDownload"
          >
        </div>
      </div>
    </div>
  </el-dialog>
</template>

<script>
import Cookie from "@/utils/cookie";
import { ipcRenderer } from "electron";

export default {
  name: "image-viewer",
  props: ["imageUrl", "imageWidth", "imageHeight", "downloadUrl"],
  data() {
    return {
      dialogVisible: false,
      largeContainer: true,
      imageIndex: "",
      rotate: 0,
      tip1: false,
      tip2: false,
      mWidth: "50%",
      widthImg: "50%"
    };
  },
  mounted: function() {
    this.$nextTick(() => {
      this.$on("openDialog", function(data) {
        this.dialogVisible = true;
        this.rotate = 0;
        this.mWidth = "50%";
        this.widthImg = "50%";

      });
    });
  },
  methods: {
    closeWin() {
      this.dialogVisible = false;
    },
    imageDownload() {
      //默认保存路径
      let path = Cookie.getDownloadPath();
      if (path) {
        //选择下载目录
        // ipcRenderer.send('choiceDownloadFolder', this.imageUrl, {count:1, directory: path})
        // ipcRenderer.once("choiceDownloadFolderReply", (event, arg) => {
          // console.log("choiceDownloadFolderReply", arg)
          // if (arg != null) {
            // let savePath = arg[0] + "\\"
            let savePath = path
            console.log('选择的保存路径========',savePath)
            if(this.imageUrl){
              ipcRenderer.send('downloadImage', this.imageUrl + ',' + savePath)
            }
          // }
        // });
        // console.log('选择下载目录,并打开默认保存路径==============',path)
        // ipcRenderer.send("choiceDownloadFolder",path);
      }
    },
    rotateImg() {
      if (this.rotate == 0) {
        this.rotate = 1;
      } else if (this.rotate == 1) {
        this.rotate = 2;
      } else if (this.rotate == 2) {
        this.rotate = 3;
      } else {
        this.rotate = 0;
      }
    },
    rotateImgBack() {
      if (this.rotate == 0) {
        this.rotate = 3;
      } else if (this.rotate == 1) {
        this.rotate = 0;
      } else if (this.rotate == 2) {
        this.rotate = 1;
      } else {
        this.rotate = 2;
      }
    },
    largeImg() {
      if (this.mWidth == "100.0%") {
        this.tip1 = true;
        setTimeout(() => {
          this.tip1 = false;
        }, 1500);
      } else {
        this.mWidth = parseFloat(this.mWidth) + 10;
        this.widthImg = parseFloat(this.widthImg) + 10;
        this.mWidth = Number(this.mWidth).toFixed(1);
        this.mWidth += "%";
        this.widthImg = Number(this.widthImg).toFixed(1);
        this.widthImg += "%";
      }
    },
    smallImg() {
      if (this.mWidth == "10.0%") {
        this.tip2 = true;
        setTimeout(() => {
          this.tip2 = false;
        }, 1500);
      } else {
        this.mWidth = parseFloat(this.mWidth) - 10;
        this.widthImg = parseFloat(this.widthImg) - 10;
        this.mWidth = Number(this.mWidth).toFixed(1);
        this.mWidth += "%";
        this.widthImg = Number(this.widthImg).toFixed(1);
        this.widthImg += "%";
      }
    }
  }
};
</script>

<style scoped>
.closeWin {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 100;
  background: url("../../assets/images/close_win.png");
  width: 25px;
  height: 25px;
  cursor: pointer;
}
.controlImg {
  width: 30px;
  height: 25px;
  margin-left: 10px;
}
.largeContainer {
  top: 0;
  right: 0;
  left: 0;
  position: fixed;
  width: 100%;
  height: -webkit-fill-available;
  height: fill-available;
  background-color: rgba(55, 55, 55, 0.9);
  z-index: 22;
  overflow: auto;
  box-sizing: border-box;
}
.box-image-wrapper {
  top: 0;
  position: fixed;
  width: 100%;
  height: -webkit-fill-available;
  height: fill-available;
  z-index: 33;
  text-align: center;
  overflow-y: auto;
  display: flex;
  padding-bottom: 60px;
}
.layout-mgt-30 {
}
.mainImg {
  cursor: pointer;
  position: relative;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  margin: auto;
}
.largeImg60 {
  max-width: 60%;
  width: 60%;
}
.largeImg70 {
  max-width: 70%;
  width: 70%;
}
.largeImg80 {
  max-width: 80%;
  width: 80%;
}
.largeImg90 {
  max-width: 90%;
  width: 90%;
}
.largeImg100 {
  max-width: 100%;
  width: 100%;
}
.smallImg {
  height: 80px;
  width: 80px;
  float: left;
  margin-left: 20px;
  cursor: pointer;
}
.sideClick {
  height: 100%;
  width: 6%;
  cursor: pointer;
}
.sideClickR {
  height: 100%;
  width: 6%;
  cursor: pointer;
}
.sideClick div {
  position: fixed;
  z-index: 44;
  background-color: rgba(40, 40, 40, 0.8);
  height: 75px;
  width: 60px;
  top: 0;
  bottom: 0;
  margin: auto;
  margin-left: 20px;
}
.sideClickR div {
  position: fixed;
  z-index: 44;
  background-color: rgba(40, 40, 40, 0.8);
  height: 75px;
  width: 60px;
  top: 0;
  bottom: 0;
  margin: auto;
  right: 20px;
}
.clickArrow {
  width: 50%;
  margin-top: 10px;
}
.rotate0 {
  transform: rotate(0deg);
}
.rotate90 {
  transform: rotate(90deg);
}
.rotate180 {
  transform: rotate(180deg);
}
.rotate270 {
  transform: rotate(270deg);
}
.fr {
  float: right;
}
.fl {
  float: left;
}
.rotate {
  height: 30px;
  cursor: pointer;
}
.rotateR {
  height: 30px;
  cursor: pointer;
  transform: rotateY(180deg);
}
.bottom {
  width: 100%;
  position: fixed;
  z-index: 55;
  bottom: 0;
  left: 0;
  padding: 15px 0;
  border: 1px solid;
}
.tip {
  position: fixed;
  top: 200px;
  margin: auto;
  left: 0;
  right: 0;
  background-color: #888;
  color: #fff;
  height: 30px;
  font-size: 14px;
  line-height: 30px;
  width: 150px;
  text-align: center;
  padding: 0 5px;
  border-radius: 6px;
  z-index: 100;
}
</style>


<style lang="scss" scoped>
.img-viewer-dlg {
  margin: 0;
  padding: 0;
}

.image-container {
  width: 800px;
  height: 470px;
  text-align: center;
  .tool {
    position: fixed;
    top: 540px;
    right: 75px;
    button {
      background: rgba(255, 255, 255, 0);
      color: #999;
      border: 1px solid #999;
    }
  }
}
</style>

<template>
  <div :style="{ left: (mousePosition[0] > (dialogContainerWidth+350) ? (dialogContainerWidth+350) : mousePosition[0]) + 'px', top: (mousePosition[1] > (dialogContainerHeight-80) ? (dialogContainerHeight-80) : mousePosition[1]) + 'px'}" class="right-key-menu1" v-if="showMenu" ref="menu">
    <ul>
      <li
        v-for="(item,index) in items"
        @click="itemClickList(index)"
        v-show="!item.hide"
        :key="index"
      >{{ item.menuName}}</li>
    </ul>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  data () {
    return {
      menuStyle: '',
      showMenu: false
    }
  },
  props: ['menuItems', 'mousePosition', 'busiObj'],
  methods: {
    itemClickList (index) {
      let that = this
      that.$emit('itemClickList', index, this.busiObj)
    }
  },
  watch: {
    mousePosition () {
      let x = this.mousePosition[0]
      if (x === 'close') {
        this.showMenu = false
      } else {
        this.showMenu = true
        if (!this.$refs.menu) {
          this.$nextTick(() => {
            const { menu } = this.$refs
            this.menu = menu
            document.body.appendChild(menu)
          })
        }
      }
    }
  },
  computed: {
    ...mapState({
      dialogContainerWidth: state => state.drag.dialogContainerWidth,
      dialogContainerHeight: state => state.drag.dialogContainerHeight
    }),
    items () {
      console.log(this.menuItems)
      return this.menuItems
    }
  },
  destroyed () {
    this.menu &&
      this.menu.parentNode === document.body &&
      document.body.removeChild(this.menu)
  }
}
</script>

<style rel="stylesheet/scss" lang="scss">
 .right-key-menu1 {
   font-family: "Arial","Microsoft YaHei","黑体","宋体",sans-serif;
  padding:10px 0 10px 0;
  min-width: 45px;
  position: fixed;
  border: 1px solid #E4E7ED;
  font-size: 12px;
  color: #303133;
  background: white;
  border-radius: 2px;
  z-index: 9999;
  box-shadow: 0px 0px 3px #e4e7ed;
  li {
    height: 30px;
    line-height: 30px;
    padding: 0 20px;
    cursor: pointer;
    &:hover {
      background: #f2f2f2;
    }
  }
  li + li {
    /*border-top: 1px solid #adadad;*/
  }
}
</style>

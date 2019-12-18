<template>
  <div class="select-main-component">
    <div class="select-input" @click.stop="showSelectList">
      <p>{{ selectContent ? selectContent : normalContent }}</p>
      <i class="el-icon-arrow-down"></i>
    </div>
    <ul class="select-list" v-if="showSelectListFlag">
      <li class="select-list-item" v-for="item in selectList" @click="selectElement(item)">{{ item.name ? item.name : item }}</li>
    </ul>
  </div>
</template>

<script>
  import { mapState, mapMutations } from 'vuex'
  export default {
    props: ['selectList', 'normalContent'],
    data () {
      return {
        list: [
          {
            name: '机密'
          },
          {
            name: '秘密'
          }
        ],
        selectContent: '',
        showSelectListFlag: false
      }
    },
    computed: {
      ...mapState({
        selectFlag: state => state.home.selectFlag
      })
    },
    watch: {
      selectFlag: function (val, oldval) {
        if (!val) this.showSelectListFlag = false
      }
    },
    methods: {
      ...mapMutations([
        'SET_SELECTLIST_STATUS'
      ]),
      showSelectList () {
        this.showSelectListFlag = true
        this.SET_SELECTLIST_STATUS(true)
      },
      selectElement (item) {
        this.selectContent = item.name ? item.name : item
        this.$emit('selectListener', item.name ? item.name : item)
      }
    }
  }
</script>

<style lang="scss">
  .select-main-component {
    .select-input {
      /*width: 100%;*/
      display: flex;
      align-items: center;
      height: 24px;
      border: 1px solid gray;
      border-radius: 4px;
      p {
        flex: 1;
        border: 0;
        font-size: 14px;
        text-align: center;
      }
    }
    .select-list {
      z-index: 99999;
      position: relative;
      background: #ffffff;
      border: 1px solid #959FA9;
      border-radius: 2px;
      box-shadow: 0px 0px 3px #333333;
      .select-list-item {
        height: 24px;
        line-height: 24px;
        font-size: 14px;
        text-align: center;
        cursor: pointer;
        &:hover {
          background: #f7f7f7;
        }
      }
    }
  }
</style>


<template>
  <div id="ceshi">
    <span>测试</span>
    <!-- <i class="iconi"></i> -->
    <div class="icondiv">
      <div class="semi-circle"></div>

      <div class="arrow"></div>
    </div>
    <img src="../../assets/pointh.png" alt />
    <el-button @click="huanse">换色</el-button>
  </div>
</template>

<script>
export default {
  name: "ceshi",
  data() {
    return {};
  },
  created() {},
  methods: {
    huanse() {
      
    }
  }
};
</script>

<style lang="less" scoped>
#ceshi {
  // .iconi {
  //   display: inline-block;
  //   height: 100px;
  //   width: 100px;
  //   background: pink;
  //   border: 1px solid black;
  //   border-radius: 100px 100px 0 0;
  //   border-color: red transparent transparent transparent;
  // }
  .icondiv {
    display: inline-block;
    .semi-circle {
      display: inline-block;
      width: 30px;
      height: 30px;
      margin-bottom: 30px;
      // line-height: 100px;
      // text-align: center;
      // margin: 100px;
      // background-color: red;
      border: 1px solid black;
      box-sizing: border-box;
      border-radius: 30px 30px 0 0;
      height: 20px;
    }
    .arrow {
      display: inline-block;
      background: none; /*为了清除前面div设置的背景颜色*/
      border: 15px solid red;
      margin-left: -30px;
      // width: 0;
      // height: 0;
      border-color: red transparent transparent transparent;
    }
  }
}
</style>

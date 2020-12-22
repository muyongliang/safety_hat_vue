// 欢迎默认页
<template>
  <div id="weImg">
    <img src="../../assets/images/we.png" alt />
  </div>
</template>

<script>
// import * as socketApi from "../../plugins/websocket";
export default {
  mounted() {},
  methods: {
    // getConfigResult(res) {
    //   // 接收回调函数返回数据的方法
    //   (res);
    // },
    // websocketToLogin() {
    //   // 【agentData：发送的参数；this.getConfigResult：回调方法】
    //   socketApi.sendSock("", this.getConfigResult);
    // }
  },
  activated() {
    // (socketApi)
  }
};
</script>
<style lang="less" scoped>
#weImg {
  width: 100%;
  height: 100%;
  text-align: center;
  vertical-align: middle;
  img {
    z-index: 100000;
    display: inline-block;
    margin-top: 170px;
  }
}
</style>

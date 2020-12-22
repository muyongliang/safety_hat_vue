// 服务状态
<template>
  <div id="serve">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>服务状态</span>
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item>系统配置</el-breadcrumb-item>
          <el-breadcrumb-item>服务状态</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <el-form ref="form" :model="form" label-width="120px">
        <el-form-item label="终端账号数量:">
          <span>{{curNum}}/{{allNum}}</span>
        </el-form-item>
        <el-form-item label="服务到期时间:">
          <span>{{time}}</span>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import { createNamespacedHelpers } from "vuex";
const { mapState, mapActions } = createNamespacedHelpers("system");
export default {
  data() {
    return {
      form: {
        name: ""
      },
      time:"",
      curNum:"",
      allNum:""
    };
  },
  mounted() {
    this.getContent();
  },
  methods: {
    ...mapActions(["serveStatusAsync"]),
    async getContent() {
      const data = await this.serveStatusAsync();
      this.time=data.data.validityTime;
      this.curNum=data.data.clientNum;
      this.allNum=data.data.deviceNumLimit;
    }
  }
};
</script>

<style lang="less">
#serve {
  .el-breadcrumb {
    margin-top: 20px;
  }
}
</style>

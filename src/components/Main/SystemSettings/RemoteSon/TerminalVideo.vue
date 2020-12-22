// 终端视频参数设置页面
<template>
  <div id="tervideo">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>终端视频参数设置</span>
        <el-row>
          <el-col :span="2">
            <el-button type="primary" @click="backGo">返回</el-button>
          </el-col>
          <el-col :span="8">
            <el-breadcrumb
              separator-class="el-icon-arrow-right"
              style="height: 40px;line-height: 40px;"
            >
              <el-breadcrumb-item>系统配置</el-breadcrumb-item>
              <el-breadcrumb-item>远程控制</el-breadcrumb-item>
              <el-breadcrumb-item>终端视频参数设置</el-breadcrumb-item>
            </el-breadcrumb>
          </el-col>
        </el-row>
      </div>

      <el-form ref="form" :model="form" label-width="140px">
        <el-form-item label="视频分辨率：">
          <el-select v-model="rid" placeholder="请选择分辨率">
            <el-option
              :options="resolute"
              v-for="item in resolute"
              :key="item.rid"
              :label="item.type"
              :value="item.rid"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="视频码率：">
          <span>{{videoValue}}</span>
          <!-- <el-slider v-model="videoValue" :max="videoMax" :step="videoStep"></el-slider> -->
        </el-form-item>
      </el-form>
      <el-divider></el-divider>

      <el-button type="primary" @click="getOked">保存修改</el-button>
    </el-card>
  </div>
</template>
<script>
import { createNamespacedHelpers } from "vuex";
const { mapState, mapActions } = createNamespacedHelpers("remote");
export default {
  data() {
    return {
      form: {
        name: "",
        region: ""
      },
      videoValue: 1024,
      videoMax: 600,
      videoStep: 10,
      resolute: [],
      rid: ""
    };
  },
  mounted() {
    this.getREsolute();
  },
  methods: {
    ...mapActions(["resolutionAsync", "setResoluteAsync"]),
    // 返回上一页
    backGo() {
      this.$router.push("/Remote");
    },
    // 保存修改
    async getOked() {
      let rid = this.rid;
      let videoValue = this.videoValue;
      const data = await this.setResoluteAsync({
        type: rid,
        bitRate: videoValue
      });
      
      if (data.code == 200) {
        this.$message("设置成功");
      }else{
        this.$message("设置失败");
      }
    },
    async getREsolute() {
      const data = await this.resolutionAsync();
      this.resolute = [...this.resolute, ...data.data];
    }
  }
};
</script>
<style lang="less" >
#tervideo {
  .el-card {
    .el-row {
      margin-top: 20px;
    }
    .el-slider__runway {
      width: 300px;
    }
  }
}
</style>
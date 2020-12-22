// 终端app更新
<template>
  <div id="appu">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>终端app更新</span>
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item>系统配置</el-breadcrumb-item>
          <el-breadcrumb-item>终端app更新</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <!-- 主体区域 -->
      <el-form ref="form" :model="form" label-width="140px">
        <el-form-item label="平台终端最新版本">
          <span>{{lastVersion}}</span>
        </el-form-item>
        <el-form-item label="企业终端使用版本">
          <span>{{currentVersion}}</span>
        </el-form-item>
        <el-divider></el-divider>
        <el-form-item label="版本更新设置">
          <el-radio-group v-model="radio">
            <el-radio :label="1">自动使用平台最新版</el-radio>
            <el-radio :label="2">手动更新</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-divider></el-divider>
        <el-form-item>
          <el-button type="primary" @click="autoUpdate" v-show="roleList.indexOf(118) !== -1">保存修改</el-button>
          <el-button type="success" @click="selfUpdate" v-show="roleList.indexOf(119) !== -1">更新</el-button>
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
      radio: 1,
      lastVersion: "",
      currentVersion: "",
      roleList: []
    };
  },
  mounted() {
    this.getCurrent();
    this.getRoleBtnData();
  },
  methods: {
    // 功能权限
    async getRoleBtnData() {
      let dataR = {
        parentId: 23,
        userName: null
      };
      const { data: res } = await this.$http.get("menu/getButtonMenus", {
        params: dataR
      });
      // ("获取数据页面功能权限", res);
      let arr = [];
      res.data.forEach(item => {
        arr.push(item.mid);
      });
      this.roleList = arr;
      ("获取数据页面功能权限", this.roleList);
      //  v-show="roleList.indexOf(35) !== -1"
    },

    ...mapActions(["appTerminalAsync", "updateAppAsync", "updateByHandAsync"]),
    //获取当前版本信息
    async getCurrent() {
      const data = await this.appTerminalAsync();
      this.currentVersion = data.currentVersion;
      this.lastVersion = data.lastVersion;
    },
    //更新
    async autoUpdate() {
      let type = this.radio;
      const data = await this.updateAppAsync({
        updateSet: type
      });
      if (data.code == 200) {
        this.$message("修改成功");
      } else {
        this.$message("修改失败，请联系管理员");
      }
    },
    //手动更新
    async selfUpdate() {
      const data = await this.updateByHandAsync();
      if (data.code == 200) {
        this.$message("更新成功");
      } else {
        this.$message("更新失败，请联系管理员");
      }
    }
  }
};
</script>

<style lang="less">
#appu {
  .el-breadcrumb {
    margin-top: 20px;
  }
  .el-form-item__label {
    margin-right: 60px;
  }
}
</style>

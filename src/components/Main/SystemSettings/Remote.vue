// 远程控制页面
<template>
  <div id="rem">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>远程控制</span>
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item>系统配置</el-breadcrumb-item>
          <el-breadcrumb-item>远程控制</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <!-- 主体区域 -->
      <el-form ref="form" :model="form" label-width="140px">
        <el-form-item label="终端视频参数控制">
          <span>分辨率：{{resolutionStr}} 码率：{{maxKps}}</span>
          <br />
          <div style="margin-top:20px;margin-left:60px;">
            <el-button type="primary" @click="pushviode" v-show="roleList.indexOf(110) !== -1">设置</el-button>
            <el-button
              type="success"
              @click="dialogVisible = true"
              v-show="roleList.indexOf(111) !== -1"
            >同步参数</el-button>
            <el-dialog title="终端视频参数同步" :visible.sync="dialogVisible" width="40%">
              <span>该同步是指，将终端设置了自定义视频参数的终端，同步为跟随系统设定，即本处的视频参数设置。确认同步？</span>
              <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="dialogVisible = false;confirm()">确 定</el-button>
              </span>
            </el-dialog>
          </div>
        </el-form-item>
        <el-divider></el-divider>
        <el-form-item label="变更终端账号">
          <el-button type="primary" @click="pushChanges" v-show="roleList.indexOf(112) !== -1">控制</el-button>
        </el-form-item>
        <el-divider></el-divider>
        <el-form-item label="销毁终端数据">
          <el-button type="danger" @click="pushDelete" v-show="roleList.indexOf(113) !== -1">控制</el-button>
        </el-form-item>
        <el-divider></el-divider>
      </el-form>
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
        name: ""
      },
      dialogVisible: false,
      maxKps: 1024,
      resolutionStr: "",
      roleList: []
    };
  },
  mounted() {
    this.getSetting();
    this.getRoleBtnData();
  },
  methods: {
    // 功能权限
    async getRoleBtnData() {
      let dataR = {
        parentId: 21,
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

    ...mapActions(["queryResoluteAsync", "synchronizeAsync"]),
    // 跳向终端视频参数设置
    pushviode() {
      this.$router.push("/TerminalVideo");
    },
    // 跳向变更终端账号页面
    pushChanges() {
      this.$router.push("/ChangeTerminal");
    },
    // 跳向销毁终端数据
    pushDelete() {
      this.$router.push("/DeleTminal");
    },
    //终端视频参数
    async getSetting() {
      const data = await this.queryResoluteAsync();
      this.maxKps = data.maxKps;
      this.resolutionStr = data.resolutionStr;
    },
    //同步参数
    async confirm() {
      const data = await this.synchronizeAsync();
      if (data.code == 200) {
        this.$message("同步成功");
      } else {
        this.$message(data.message);
      }
    }
  }
};
</script>



<style lang="less">
#rem {
  .el-breadcrumb {
    margin-top: 20px;
  }
  .el-form-item__label {
    margin-right: 60px;
  }
}
</style>

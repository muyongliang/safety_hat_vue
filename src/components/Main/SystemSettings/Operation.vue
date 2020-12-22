// 操作日志
<template>
  <div id="oper">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>操作日志</span>
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item>系统配置</el-breadcrumb-item>
          <el-breadcrumb-item>操作日志</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <!-- 搜索框 label-width="100px"-->
      <el-form ref="pushTabformRef" :model="pushTabform">
        <el-row>
          <el-col :span="5">
            <el-form-item label="账号类型">
              <el-select v-model="pushTabform.accountType" placeholder @change="findAccountType">
                <el-option label="全部" value></el-option>
                <el-option label="企业管理员" value="0"></el-option>
                <el-option label="调度员" value="1"></el-option>
                <el-option label="终端账号" value="2"></el-option>
                <el-option label="其他管理员账号" value="3"></el-option>
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :span="5">
            <el-form-item label="操作类型">
              <el-select v-model="pushTabform.actionType" placeholder @change="findActionType">
                <!-- <el-option label="全部" value></el-option>
                <el-option label="增加" value="1"></el-option>
                <el-option label="删除" value="2"></el-option>
                <el-option label="更新" value="3"></el-option>-->
                <el-option
                  v-for="item in optionsss"
                  :key="item.type"
                  :label="item.name"
                  :value="item.type"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :span="6">
            <el-form-item label="时间段 ">
              <el-date-picker
                v-model="value1"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                @change="findTime"
                value-format="yyyy-MM-dd HH:mm:ss"
              ></el-date-picker>
            </el-form-item>
          </el-col>

          <el-col :span="8">
            <el-form-item label="检索">
              <el-row :gutter="10">
                <el-col :span="18">
                  <el-input v-model="pushTabform.executor" placeholder="请输入操作人姓名"></el-input>
                </el-col>
                <el-col :span="4">
                  <el-button
                    type="primary"
                    @click="findEXE"
                    v-show="roleList.indexOf(120) !== -1"
                  >查询</el-button>
                </el-col>
              </el-row>
            </el-form-item>
          </el-col>

          <!-- <el-col :span="2">
            <el-form-item>
              <el-button type="primary" @click="outData">导出记录</el-button>
            </el-form-item>
          </el-col>-->
        </el-row>
        <el-form-item class="butnsa">
          <el-button type="primary" @click="outData" v-show="roleList.indexOf(121) !== -1">导出记录</el-button>
        </el-form-item>
      </el-form>

      <!-- 表格区域 -->
      <el-table :data="TableData" style="width: 100%" border>
        <el-table-column label="账号类型" width="280">
          <template slot-scope="scope">
            <span v-if="scope.row.account_type == 0">企业管理员</span>
            <span v-if="scope.row.account_type == 1">调度员</span>
            <span v-if="scope.row.account_type == 2">终端账号</span>
            <span v-if="scope.row.account_type == 3">其他管理员账号</span>
          </template>
        </el-table-column>
        <el-table-column prop="executor" label="操作者"></el-table-column>
        <el-table-column label="操作类型">
          <template slot-scope="scope">
            <span v-if="scope.row.action_type == 1">添加</span>
            <span v-if="scope.row.action_type == 2">删除</span>
            <span v-if="scope.row.action_type == 3">更新</span>
          </template>
        </el-table-column>
        <el-table-column prop="action" label="操作行为"></el-table-column>
        <el-table-column prop="detail" label="相关数据"></el-table-column>
        <el-table-column prop="time" label="时间" sortable></el-table-column>s
      </el-table>

      <!-- 分页 -->
      <el-pagination
        @current-change="handleCurrentChange"
        :current-page="pushTabform.pageNum"
        :page-size="pushTabform.pageSize"
        layout="total, prev, pager, next"
        :total="total"
      ></el-pagination>
    </el-card>
  </div>
</template>

<script>
import qs from "qs";
export default {
  data() {
    return {
      pushTabform: {
        name: "",
        region: "",
        pageNum: 1,
        pageSize: 5,
        accountType: "", //账号类型
        actionType: "", //操作类型
        startTime: "",
        endTime: "",
        executor: "" //操作人姓名
      },
      // 时间
      value1: "",
      TableData: [],
      logIdsss: {
        logIds: []
      }, //导出日志数据
      total: 0, //总条数
      optionsss: [],
      roleList: []
    };
  },
  created() {
    this.getTableData();
    this.getLEIdata();
    this.getRoleBtnData();
  },
  methods: {
    // 功能权限
    async getRoleBtnData() {
      let dataR = {
        parentId: 24,
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

    async getTableData() {
      const { data: res } = await this.$http.post(
        "system/handleSelectLogByCondition",
        qs.stringify(this.pushTabform)
      );
      // ("操作日志数据", res);
      this.TableData = res.data.list;
      this.total = res.data.total;
    },
    // 分页
    handleCurrentChange(val) {
      // (`当前页: ${val}`);
      this.pushTabform.pageNum = val;
      this.getTableData();
    },
    // 根据账号状态查询
    findAccountType() {
      // (this.pushTabform);
      this.getTableData();
    },
    // 获取操作类型
    async getLEIdata() {
      const { data: res } = await this.$http.get("system/getLogType");
      ("操作类型res", res);
      this.optionsss = res.data;
    },
    // 根据操作类型查询
    findActionType() {
      (this.pushTabform);
      this.getTableData();
    },
    // 根据时间查询
    findTime() {
      // (this.value1);
      this.pushTabform.startTime = this.value1[0];
      this.pushTabform.endTime = this.value1[1];
      (this.pushTabform);
      this.getTableData();
    },
    // 根据操作人姓名查询
    findEXE() {
      this.getTableData();
    },
    // 导出日志
    async outData() {
      const { data: res } = await this.$http.post(
        "system/handleExportLog",
        qs.stringify(this.logIdsss),
        {
          responseType: "blob"
        }
      );
      (res);
      const link = document.createElement("a");
      let blob = new Blob([res], { type: "application/vnd.ms-excel" });
      link.style.display = "none";
      link.href = URL.createObjectURL(blob);
      let num = "";
      for (let i = 0; i < 10; i++) {
        num += Math.ceil(Math.random() * 10);
      }
      link.setAttribute("download", "操作日志_" + num + ".xlsx");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }
};
</script>

<style lang="less">
#oper {
  .el-breadcrumb {
    margin-top: 20px;
  }
  .el-pagination {
    margin-top: 30px;
  }
  .butnsa {
    float: right;
  }
}
</style>

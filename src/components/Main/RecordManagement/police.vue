// 报警记录
<template>
  <div id="pol">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>报警记录</span>
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item>记录管理</el-breadcrumb-item>
          <el-breadcrumb-item>报警记录</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <!-- 内容主题 -->
      <!-- 检索按钮区 -->
      <div>
        <el-form ref="tabDataRef" :model="tabData" label-width="100px">
          <el-row>
            <el-col :span="4">
              <div class="grid-content bg-purple">
                <el-form-item label="项目">
                  <el-select v-model="tabData.pid" placeholder="全部" @change="getNameList">
                    <el-option
                      v-for="item in inputName"
                      :key="item.pid"
                      :label="item.projectName"
                      :value="item.pid"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </div>
            </el-col>

            <el-col :span="4">
              <div class="grid-content bg-purple">
                <el-form-item label="账号类型">
                  <el-select v-model="tabData.aid" placeholder @change="getUserName">
                    <el-option label="全部" value></el-option>
                    <el-option label="SOS报警" value="1"></el-option>
                    <el-option label="围栏报警" value="2"></el-option>
                    <el-option label="跌落报警" value="3"></el-option>
                    <el-option label="脱离报警" value="4"></el-option>
                    <el-option label="高空报警" value="5"></el-option>
                  </el-select>
                </el-form-item>
              </div>
            </el-col>

            <el-col :span="7">
              <el-form-item label="活动时间">
                <!--  HH:mm:ss -->
                <el-date-picker
                  v-model="Timevalue"
                  value-format="yyyy-MM-dd"
                  type="daterange"
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  @change="inputTimeData"
                ></el-date-picker>
              </el-form-item>
            </el-col>

            <el-col :span="7">
              <div class="grid-content bg-purple">
                <el-form-item label="检索">
                  <el-row :gutter="0">
                    <el-col :span="8">
                      <div class="grid-content bg-purple">
                        <el-select v-model="tabDataList.type" placeholder>
                          <el-option label="姓名" value="0"></el-option>
                          <el-option label="账号" value="1"></el-option>
                        </el-select>
                      </div>
                    </el-col>
                    <el-col :span="14">
                      <div class="grid-content bg-purple">
                        <el-input v-model="tabDataList.param" placeholder="请输入内容"></el-input>
                      </div>
                    </el-col>
                    <el-col :span="2">
                      <el-button type="primary" class="se-btn" @click="inputquery" style="margin-left:10px;" v-show="roleList.indexOf(68) !== -1">查询</el-button>
                    </el-col>
                  </el-row>
                </el-form-item>
              </div>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <!-- 功能按钮区 -->
      <div class="row-btn">
        <el-row>
          <el-button type="primary" @click="Alldaga" v-show="roleList.indexOf(68) !== -1">查询全部</el-button>
          <el-button type="success" @click="AllDelete" v-show="roleList.indexOf(69) !== -1">清空</el-button>
          <el-button type="danger" @click="deleteData" v-show="roleList.indexOf(70) !== -1">删除</el-button>
          <el-button type="primary" @click="getOutList" v-show="roleList.indexOf(71) !== -1">导出</el-button>
        </el-row>
      </div>

      <!-- 主体表单部分 -->
      <el-table
        ref="multipleTable"
        :data="tableData"
        tooltip-effect="dark"
        style="width: 100%"
        @selection-change="handleSelectionChange"
        :default-sort="{prop: 'date', order: 'descending'}"
        border
      >
        <el-table-column type="selection" width="55"></el-table-column>

        <el-table-column label="项目名称" width="250" prop="projectName"></el-table-column>

        <el-table-column label="报警类型" width="150">
          <template slot-scope="scope">
            <span v-if="scope.row.aid ==1">SOS报警</span>
            <span v-if="scope.row.aid ==2">围栏报警</span>
            <span v-if="scope.row.aid ==3">跌落报警</span>
            <span v-if="scope.row.aid ==4">脱离报警</span>
            <span v-if="scope.row.aid ==5">高空报警</span>
          </template>
        </el-table-column>

        <el-table-column prop="name" label="发送人姓名" show-overflow-tooltip></el-table-column>
        <el-table-column prop="account" label="账号" show-overflow-tooltip></el-table-column>
        <el-table-column prop="content" label="内容" show-overflow-tooltip></el-table-column>

        <!-- 排序日期 -->
        <el-table-column prop="recordTime" label="日期" sortable width="180"></el-table-column>
      </el-table>

      <el-pagination
        @current-change="handleCurrentChange"
        :current-page="tabData.page"
        :page-size="tabData.limit"
        layout="total, prev, pager, next"
        :total="total"
      ></el-pagination>
    </el-card>
  </div>
</template>

<script>
import qs from "qs";
export default {
  inject: ["reload"],
  data() {
    return {
      // 检索按钮区绑定数据
      tabData: {
        // 查询页数及显示条数
        limit: 5,
        page: 1,
        // 开始时间
        startTime: null,
        // 结束时间
        endTime: null,
        pid: null, //项目id
        param: null,
        userName: null, //账号名
        aid: null //报警类型
      },
      tabDataList: {
        param: "",
        type: ""
      },
      // 日期设置
      Timevalue: "",
      // 主体表单绑定数据
      tableData: [
        // account: "superadmin"
        // aid: null
        // bid: 1
        // bids: null
        // content: null
        // endTime: null
        // id: 5
        // message: null
        // name: "习大大"
        // pid: 1
        // projectName: "银川市金凤区鼎极大院"
        // recordTime: "2019-12-19 14:36:09"
        // sendName: null
        // startTime: null
        // view: null
      ],
      // 表单数据获取上传数据
      // tabData: {
      //   page: 1,
      //   limit: 3,
      //   aid: "",
      //   pid: "" //项目id
      // },
      total: 0,
      inputName: [],
      // 主体表单多选框绑定
      multipleSelection: [],
      idss: {
        ids: []
      },
      roleList: []
      // roleBTNData: {
      //   parentId: 14,
      //   userName: null
      // }
    };
  },
  created() {
    // this.getDataList();
    this.getNameList();
    // 获取名称数据
    this.getNamePro();
    this.getRoleBtnData();
  },
  methods: {
    // 功能权限
    async getRoleBtnData() {
      let dataR = {
        parentId: 14,
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
      //  v-show="this.roleList.indexOf(35) !== -1"
    },
    // 主体表单多选框绑定,将选中的数据已对象形式发过来
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    // 查询全部
    async Alldaga() {
      this.tabData.page = 1;
      this.tabData.aid = null;
      this.Timevalue = [];
      this.tabData.startTime = null;
      this.tabData.endTime = null;
      this.tabData.userName = null;
      this.tabData.name = null;
      this.tabDataList.param = null;
      this.tabDataList.type = null;
      this.tabData.pid = null;
      // this.getDataList();
      const { data: res } = await this.$http.get("alarmRecord/list", {
        params: this.tabData
      });
      if (res.code !== 200) {
        this.$message(res.message);
        return;
      }
      if (localStorage.ddyDatas !== "null") {
        return;
      } else {
        this.total = res.data.total;
        this.tableData = res.data.list;
      }
      // this.tableData = res.data.list;
      // this.total = res.data.total;
    },
    // 获取表单数据
    async getDataList() {
      // this.tabData.page = 1;
      this.tabData.aid = null;
      this.Timevalue = [];
      this.tabData.startTime = null;
      this.tabData.endTime = null;
      this.tabData.userName = null;
      this.tabData.name = null;
      this.tabDataList.param = null;
      this.tabDataList.type = null;
      this.tabData.pid = null;
      const { data: res } = await this.$http.get("alarmRecord/list", {
        params: this.tabData
      });
      if (res.code !== 200) {
        this.$message(res.message);
        return;
      }

      this.tableData = res.data.list;
      this.total = res.data.total;
    },
    // 分页
    async handleCurrentChange(val) {
      this.tabData.page = val;
      // this.getDataList();
      const { data: res } = await this.$http.get("alarmRecord/list", {
        params: this.tabData
      });
      if (res.code !== 200) {
        this.$message(res.message);
        return;
      }

      this.tableData = res.data.list;
      this.total = res.data.total;
    },
    async getNamePro() {
      const { data: res } = await this.$http.get("project/getProjectList");
      let all = {
        pid: null,
        projectName: "全部"
      };
      let NEWarr = res.data.concat(all);
      this.inputName = NEWarr;
    },
    // 项目名称查询
    async getNameList() {
      this.tabData.page = 1;
      // this.tabData.aid = null;
      // this.Timevalue = [];
      if (this.Timevalue == null) {
        this.tabData.beginTime = null;
        this.tabData.endTime = null;
      }
      // this.tabData.startTime = null;
      // this.tabData.endTime = null;
      // this.tabData.userName = null;
      // this.tabData.name = null;
      // this.tabDataList.param = null;
      // this.tabDataList.type = null;
      const { data: res } = await this.$http.get("alarmRecord/list", {
        params: this.tabData
      });
      if (res.code !== 200) {
        this.$message(res.message);
        return;
      }
      if (localStorage.ddyDatas !== "null") {
        return;
      } else {
        this.total = res.data.total;
        this.tableData = res.data.list;
      }
    },
    // 账号类型查询
    async getUserName() {
      this.tabData.page = 1;
      // this.tabData.pid = null;
      // this.tabData.startTime = null;
      // this.tabData.endTime = null;
      // this.tabData.userName = null;
      // this.tabDataList.param = null;
      // this.tabDataList.type = null;
      if (this.Timevalue == null) {
        this.tabData.beginTime = null;
        this.tabData.endTime = null;
      }

      // this.tabData.aid = this.tabData.aid * 1;
      const { data: res } = await this.$http.get("alarmRecord/list", {
        params: this.tabData
      });
      if (res.code !== 200) {
        this.$message(res.message);
        return;
      }
      if (localStorage.ddyDatas !== "null") {
        return;
      } else {
        this.total = res.data.total;
        this.tableData = res.data.list;
      }

      // this.total = res.data.total;
      // this.tableData = res.data.list;
    },
    //时间查询
    async inputTimeData() {
      // this.tabData.aid = null;
      this.tabData.page = 1;
      this.tabData.startTime = this.Timevalue[0];
      this.tabData.endTime = this.Timevalue[1];
      // this.tabData.pid = null;
      // this.tabData.userName = null;
      // this.tabData.name = null;
      // this.tabDataList.param = null;
      // this.tabDataList.type = null;
      const { data: res } = await this.$http.get("alarmRecord/list", {
        params: this.tabData
      });
      if (res.code !== 200) {
        this.$message(res.message);
        return;
      }

      if (localStorage.ddyDatas !== "null") {
        return;
      } else {
        this.total = res.data.total;
        this.tableData = res.data.list;
      }
      // this.total = res.data.total;
      // this.tableData = res.data.list;
    },
    // 检索查询
    async inputquery() {
      let params = JSON.parse(JSON.stringify(this.tabData));
      params.page = 1;
      if (this.Timevalue == null) {
        params.beginTime = null;
        params.endTime = null;
      }
      // this.tabData.pid = null;
      // this.tabData.aid = null;
      // this.Timevalue = [];
      // this.tabData.startTime = null;
      // this.tabData.endTime = null;
      this.tabDataList.param = this.tabDataList.param.trim();
      if (this.tabDataList.type == 0) {
        params.userName = null;
        params.name = this.tabDataList.param;
      } else if (this.tabDataList.type == 1) {
        params.name = null;
        params.userName = this.tabDataList.param;
      }
      if (this.tabDataList.param == "") {
        return this.$message("请选取查询条件与输入查询内容");
      }
      // this.getDataList();
      const { data: res } = await this.$http.get("alarmRecord/list", {
        params: params
      });
      this.tabDataList.param = "";
      if (res.code !== 200) {
        this.$message(res.message);
        return;
      }
      if (localStorage.ddyDatas !== "null") {
        return;
      } else {
        this.total = res.data.total;
        this.tableData = res.data.list;
      }
      // this.total = res.data.total;
      // this.tableData = res.data.list;
    },
    // 导出数据
    async getOutList() {
      // const arr = [];
      // for (let i = 0; i < this.multipleSelection.length; i++) {
      //   arr.push(this.multipleSelection[i].id);
      // }
      // // (arr);
      // // (res);
      // this.idss.ids = arr;
      // this.idss.ids = JSON.stringify(this.idss.ids);
      // if (this.idss.ids == "[]") {
      //   this.idss.ids = "";
      // }
      // const { data: res } = await this.$http.post(
      //   "alarmRecord/exportExcel",
      //   qs.stringify(this.idss),
      //   { responseType: "blob" }
      // );
      // this.tabData.page = null;
      // this.tabData.limit = null;

      let datas = {};
      if (this.tabData.pid == null) {
      } else if (this.tabData.pid !== null) {
        datas.pid = this.tabData.pid;
      }
      if (this.tabData.aid == null) {
      } else if (this.tabData.aid !== null) {
        datas.aid = this.tabData.aid * 1;
      }

      if (this.Timevalue.length == 0) {
        // datas.startTime = null;
        // datas.endTime = null;
      } else if (this.Timevalue.length !== 0) {
        datas.startTime = this.tabData.startTime;
        datas.endTime = this.tabData.endTime;
      }
      if (this.tabData.userName !== null) {
        datas.userName = this.tabData.userName;
      }

      if (this.tabData.name !== null) {
        datas.name = this.tabData.name;
      }
      // if (this.cooperateValue == 0) {
      //   datas.name = this.tabData.name;
      // } else if (this.cooperateValue == 1) {
      //   datas.userName = this.tabData.userName;
      // }
      // (this.tabData.pid == null);
      const { data: res } = await this.$http.post("alarmRecord/export", qs.stringify(datas), { responseType: "blob" });
      // 将数据变成a标签
      const link = document.createElement("a");
      let blob = new Blob([res], { type: "application/vnd.ms-excel" });
      link.style.display = "none";
      link.href = URL.createObjectURL(blob);
      let num = "";
      for (let i = 0; i < 10; i++) {
        num += Math.ceil(Math.random() * 10);
      }
      link.setAttribute("download", "报警记录_" + num + ".xls");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      // this.reload();
    },
    // 删除数据
    async deleteData() {
      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          const arr = [];
          for (let i = 0; i < this.multipleSelection.length; i++) {
            arr.push(this.multipleSelection[i].id);
          }
          if (arr == []) {
            return this.$message("请选择删除数据");
          }
          let one = arr.toString();
          let ddis = {ids: one};
          const { data: res } = await this.$http.post("alarmRecord/delete", qs.stringify(ddis));
          if (res.code !== 200) {
            return this.$message("删除失败");
          }
          this.$message.success("删除成功");
          this.getNameList();
        }).catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });

      // const arr = [];
      // for (let i = 0; i < this.multipleSelection.length; i++) {
      //   arr.push(this.multipleSelection[i].id);
      // }
      // if (arr == []) {
      //   return this.$message("请选择删除数据");
      // }
      // let one = arr.toString();
      // let ddis = {
      //   ids: one
      // };
      // const { data: res } = await this.$http.post(
      //   "alarmRecord/delete",
      //   qs.stringify(ddis)
      // );
      // if (res.code !== 200) {
      //   return this.$message("删除失败");
      // }
      // this.$message.success("删除成功");
      // this.getNameList();
    },
    // 清空数据
    async AllDelete() {
      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(async () => {
          const { data: res } = await this.$http.post("alarmRecord/deleteAll");
          if (res.code !== 200) {
            return this.$message("清空失败");
          }
          this.$message.success("清空成功");
          this.getNameList();
        }).catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
      // const { data: res } = await this.$http.post("alarmRecord/deleteAll");
      // if (res.code !== 200) {
      //   return this.$message("清空失败");
      // }
      // this.$message.success("清空成功");
      // this.getNameList();
    }
  }
};
</script>

<style lang="less">
#pol {
  .el-card {
    .el-breadcrumb {
      margin-top: 30px;
    }
    .row-btn {
      float: right;
      margin-bottom: 20px;
    }
    .el-pagination {
      margin-top: 20px;
    }
  }
}
</style>

// 巡查报告
<template>
  <div id="pat">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>巡检报告</span>
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item>记录管理</el-breadcrumb-item>
          <el-breadcrumb-item>巡检报告</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <!-- 内容主体 -->
      <!-- 搜索栏 label-width="90px"-->

      <el-form ref="FormRef" :model="Form" label-width="100px">
        <el-row :gutter="10">
          <el-col :span="5">
            <div class="grid-content bg-purple">
              <el-form-item label="项目">
                <el-select @change="chooseProject" v-model="pid" placeholder="全部">
                  <el-option
                    v-for="item in options"
                    :key="item.pid"
                    :label="item.projectName"
                    :value="item.pid"
                  ></el-option>
                </el-select>
              </el-form-item>
            </div>
          </el-col>

          <el-col :span="6">
            <el-form-item label="时间">
              <el-date-picker
                v-model="timeBetween"
                value-format="yyyy-MM-dd"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                @change="changeTime"
              ></el-date-picker>
            </el-form-item>
          </el-col>

          <el-col :span="7">
            <div class="grid-content bg-purple">
              <el-form-item label="检索">
                <el-row>
                  <el-col :span="8">
                    <div class="grid-content bg-purple">
                      <el-select v-model="typeValue" placeholder>
                        <el-option
                          v-for="item in typeOption"
                          :key="item.typeValue"
                          :label="item.name"
                          :value="item.typeValue"
                        ></el-option>
                      </el-select>
                    </div>
                  </el-col>
                  <el-col :span="14">
                    <div class="grid-content bg-purple">
                      <el-input v-model="content" placeholder="请输入内容"></el-input>
                    </div>
                  </el-col>
                  <el-col :span="2">
                    <el-button
                      type="primary"
                      class="se-btn"
                      @click="queryData"
                      style="margin-left:10px;"
                      v-show="roleList.indexOf(90) !== -1"
                    >查询</el-button>
                  </el-col>
                </el-row>
              </el-form-item>
            </div>
          </el-col>

          <el-col :span="5" style="float:right">
            <el-button type="primary" @click="fingAlldata" v-show="roleList.indexOf(90) !== -1">查询全部</el-button>
            <el-button type="warning" @click="emptyDALLda" v-show="roleList.indexOf(91) !== -1">清空</el-button>
            <el-button type="success" @click="outData" v-show="roleList.indexOf(93) !== -1">导出</el-button>
            <el-dialog title="删除" :visible.sync="deleteDialog" width="30%" append-to-body>
              <span>确认删除？删除后不可恢复</span>
              <span slot="footer" class="dialog-footer">
                <el-button @click="deleteDialog = false">取 消</el-button>
                <el-button type="primary" @click="deleteDialog = false;deleteRecord()">确 定</el-button>
              </span>
            </el-dialog>
            <el-dialog title="清空" :visible.sync="emptyDialog" width="30%" append-to-body>
              <span>确认清空？清空后不可恢复</span>
              <span slot="footer" class="dialog-footer">
                <el-button @click="emptyDialog = false">取 消</el-button>
                <el-button type="primary" @click="emptyDialog = false;deleteAll()">确 定</el-button>
              </span>
            </el-dialog>
          </el-col>
        </el-row>
      </el-form>

      <!-- 表格区域 -->
      <el-table
        ref="multipleTable"
        :data="listData"
        tooltip-effect="dark"
        style="width: 100%"
        @selection-change="handleSelectionChange"
        :default-sort="{prop: 'date', order: 'descending'}"
        border
      >
        <el-table-column type="selection" width="55" prop="id"></el-table-column>
        <el-table-column prop="projectName" label="项目名称"></el-table-column>
        <el-table-column prop="sendName" label="发送人姓名"></el-table-column>
        <el-table-column prop="account" label="账号"></el-table-column>
        <el-table-column prop="title" label="标题"></el-table-column>
        <el-table-column prop="recordTime" label="日期" sortable></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              type="primary"
              @click="viewText(scope.row)"
              v-show="roleList.indexOf(94) !== -1"
            >查看</el-button>
            <el-button
              type="danger"
              @click="deleteDial(scope.row)"
              v-show="roleList.indexOf(92) !== -1"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <el-pagination
        :total="totals"
        :page-size="formData.limit"
        :current-page="formData.page"
        @current-change="currentPage"
        layout="prev, pager, next"
      ></el-pagination>
    </el-card>

    <!-- 查看弹框 -->
    <el-dialog title="查看明细" :visible.sync="viewTextVisible" width="60%" :modal="false">
      <el-form ref="form" :model="Form" label-width="80px">
        <el-form-item label="标题:">
          <span>{{allDetails.title}}</span>
        </el-form-item>
        <el-form-item label="事件:">
          <el-input
            type="textarea"
            :autosize="{ minRows: 2, maxRows: 4}"
            :disabled="true"
            v-model="allDetails.event"
          ></el-input>
        </el-form-item>
        <el-form-item label="内容:">
          <el-input
            type="textarea"
            :autosize="{ minRows: 2, maxRows: 4}"
            :disabled="true"
            v-model="allDetails.content"
          ></el-input>
        </el-form-item>
        <el-form-item label="结果:">
          <el-input
            type="textarea"
            :autosize="{ minRows: 2, maxRows: 4}"
            :disabled="true"
            v-model="allDetails.result"
          ></el-input>
        </el-form-item>
        <el-form-item label="图片:">
          <div class="allImages">
            <viewer :images="imagesUrl">
              <img
                :src="imagesUrl[index]"
                alt
                v-for="(item,index) in imagesUrl"
                :key="index"
                :onerror="errorImg"
              />
            </viewer>
          </div>
        </el-form-item>
        <el-form-item label="提交时间:">
          <span>{{allData.recordTime}}</span>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import qs from "qs";
import { createNamespacedHelpers } from "vuex";
const { mapState, mapActions } = createNamespacedHelpers("patrolReport");
export default {
  data() {
    return {
      // 检索按钮区绑定数据
      Form: {
        // 查询页数及显示条数
        pageSize: "5",
        pageNum: "1",
        // 开始时间
        beginTime: "",
        // 结束时间
        endTime: "",
        // 传递设备状态
        status: "",
        // 设备类型
        type: "",
        // 日期设置
        valueData: "",
        names:
          "文本内容，显示全部，自动换行；文本内容，显示全部，自动换行；文本内容，显示全部，自动换行；文本内容，显示全部，自动换行、"
      },
      // 多选框保存选中数据
      multipleSelection: [],
      viewTextVisible: false,
      options: [
        {
          pid: "",
          projectName: ""
        }
      ],
      pid: "",
      timeBetween: "",
      typeValue: "",
      typeOption: [
        {
          name: "姓名",
          typeValue: 0
        },
        {
          name: "账号",
          typeValue: 1
        }
      ],
      content: "",
      deleteDialog: false,
      emptyDialog: false,
      allDetails: {},
      imagesUrl: [],
      allData: {},
      idss: {
        ids: []
      },
      listData: [],
      formData: {
        page: 1,
        limit: 5,
        startTime: null,
        endTime: null,
        name: null,
        userName: null,
        projectId: null
      },
      totals: 0,
      roleList: []
    };
  },
  mounted() {
    this.getid();
    // this.getReportAsync();
  },
  computed: {
    ...mapState(["pageNum", "pageSize", "list", "total"])
  },
  created() {
    this.chooseProject();
    this.getDataList();
    this.getRoleBtnData();
  },
  methods: {
    // 功能权限
    async getRoleBtnData() {
      let dataR = {
        parentId: 18,
        userName: null
      };
      const { data: res } = await this.$http.get("menu/getButtonMenus", {
        params: dataR
      });
      ("获取数据页面功能权限", res);
      let arr = [];
      res.data.forEach(item => {
        arr.push(item.mid);
      });
      ("处理去权限mid", arr);

      this.roleList = arr;
      ("获取数据页面功能权限", this.roleList);
      //  v-show="this.roleList.indexOf(35) !== -1"
    },

    ...mapActions([
      "getProjectAsync",
      "getReportAsync",
      "deleteReportAsync",
      "emptyAsync",
      "detailsAsync"
    ]),
    // 查询全部
    async fingAlldata() {
      this.pid = null;
      this.timeBetween = null;
      this.typeValue = null;
      this.content = null;
      this.formData.page = 1;
      this.formData.startTime = null;
      this.formData.endTime = null;
      this.formData.name = null;
      this.formData.userName = null;
      this.formData.projectId = null;
      ("获取数据", this.formData);

      const { data: res } = await this.$http.get("patrolRecord/list", {
        params: this.formData
      });
      ("获取数据res", res);
      if (res.code !== 200) {
        this.$message(res.message);
        return;
      }
      if (localStorage.ddyDatas !== "null") {
        return;
      } else {
        this.listData = res.data.list;
        this.totals = res.data.total;
      }

      // this.listData = res.data.list;
      // this.totals = res.data.total;
    },
    // 获取数据
    async getDataList() {
      this.pid = null;
      this.timeBetween = null;
      this.typeValue = null;
      this.content = null;
      this.formData.page = 1;
      this.formData.startTime = null;
      this.formData.endTime = null;
      this.formData.name = null;
      this.formData.userName = null;
      this.formData.projectId = null;
      ("获取数据", this.formData);

      const { data: res } = await this.$http.get("patrolRecord/list", {
        params: this.formData
      });
      ("获取数据res", res);
      if (res.code !== 200) {
        this.$message(res.message);
        return;
      }
      ("调度员身份ddy", localStorage.ddyDatas);
      ("调度员身份ddy", typeof localStorage.ddyDatas);
      if (localStorage.ddyDatas !== "null") {
        return;
      } else {
        this.listData = res.data.list;
        this.totals = res.data.total;
      }

      // this.listData = res.data.list;
      // this.totals = res.data.total;
    },
    // 将选中的框中的数据[{}，{}]形式保存
    handleSelectionChange(val) {
      this.multipleSelection = val;
      this.str = val.map(v => v.id).join(",");
    },
    // 查看弹框
    async viewText(prop) {
      let detailId = prop.id;
      const data = await this.detailsAsync(detailId);
      this.allData = data.data;
      this.allDetails = JSON.parse(data.data.message);
      this.imagesUrl = this.allDetails.imgUrls.split(",");
      if (data.code == 200) {
        this.viewTextVisible = true;
      }
    },
    //获取项目列表
    async getid() {
      const data = await this.getProjectAsync();
      this.options = [...this.options, ...data.data];
      this.options.shift();
      let all = {
        pid: null,
        projectName: "全部"
      };
      let NEWarr = this.options.concat(all);
      this.options = NEWarr;
    },
    // 触发事件
    async chooseProject() {
      // ("项目id", this.pid);
      // this.formData.name = null;
      // this.formData.userName = null;
      // this.formData.projectId = null;
      // this.formData.startTime = null;
      // this.formData.endTime = null;
      this.formData.page = 1;
      if (this.timeBetween == null) {
        this.formData.startTime = null;
        this.formData.endTime = null;
      }
      // this.timeBetween = [];
      // this.typeValue = "";
      // this.content = null;
      this.formData.projectId = this.pid;
      ("类型查询数据", this.formData);

      const { data: res } = await this.$http.get("patrolRecord/list", {
        params: this.formData
      });
      ("类型查询res", res);
      if (res.code !== 200) {
        this.$message(res.message);
        return;
      }

      if (localStorage.ddyDatas !== "null") {
        return;
      } else {
        this.listData = res.data.list;
        this.totals = res.data.total;
      }

      // this.listData = res.data.list;
      // this.totals = res.data.total;

      // this.$store.commit("patrolReport/initPid", this.pid);
      // this.getReportAsync().then(val => {
      //   ("列表数据", this.list);
      //   ("页码", this.pageNum);
      //   this.listData = this.list;
      // });
    },
    // 点击日期查询
    async changeTime() {
      // this.pid = null;
      // this.formData.projectId = null;
      // this.typeValue = null;
      // this.content = null;
      // this.formData.name = null;
      // this.formData.userName = null;
      // this.formData.projectId = null;
      this.formData.page = 1;
      // ("选择日期", this.timeBetween);
      this.formData.startTime = this.timeBetween[0];
      this.formData.endTime = this.timeBetween[1];
      ("时间查询数据", this.formData);
      const { data: res } = await this.$http.get("patrolRecord/list", {
        params: this.formData
      });
      ("日期查询数据", res);
      if (res.code !== 200) {
        this.$message(res.message);
        return;
      }

      if (localStorage.ddyDatas !== "null") {
        return;
      } else {
        this.listData = res.data.list;
        this.totals = res.data.total;
      }

      // this.listData = res.data.list;
      // this.totals = res.data.total;
    },
    // 杜条件检索
    async queryData() {
      // this.pid = null;
      // this.timeBetween = null;
      this.formData.page = 1;
      // this.formData.startTime = null;
      // this.formData.endTime = null;
      // this.formData.name = null;
      // this.formData.userName = null;
      // this.formData.projectId = null;
      if (this.timeBetween == null) {
        this.formData.startTime = null;
        this.formData.endTime = null;
      }

      // ("检索条件", this.typeValue);
      if (this.content == "") {
        return this.$message("请选择查询条件与输入查询内容");
      }
      this.content = this.content.trim();
      if (this.typeValue == 0) {
        this.formData.userName = null;
        this.formData.name = this.content;
      } else if (this.typeValue == 1) {
        this.formData.userName = this.content;
        this.formData.name = null;
      }
      ("检索数据", this.formData);
      const { data: res } = await this.$http.get("patrolRecord/list", {
        params: this.formData
      });
      if (res.code !== 200) {
        this.$message(res.message);
        return;
      }

      if (localStorage.ddyDatas !== "null") {
        return;
      } else {
        this.listData = res.data.list;
        this.totals = res.data.total;
      }

      // this.listData = res.data.list;
      // this.totals = res.data.total;
    },
    //巡查报告列表
    //查询
    query() {
      let start = this.timeBetween[0];
      let end = this.timeBetween[1];
      this.$store.commit("patrolReport/initStart", start);
      this.$store.commit("patrolReport/initEnd", end);

      if (this.typeValue == 0) {
        this.sendName = this.content;
        this.sendAccount = "";
      } else if (this.typeValue == 1) {
        this.sendName = "";
        this.sendAccount = this.content;
      }
      (this.typeValue);
      this.$store.commit("patrolReport/initSendName", this.sendName);
      this.$store.commit("patrolReport/initSendAccount", this.sendAccount);
      if (this.sendName == "") {
        return this.$message("请选择查询条件与输入查询内容");
      }
      this.getReportAsync().then(val => {
        ("this.list", this.list);
        this.listData = this.list;
      });
    },
    //分页
    async currentPage(val) {
      // this.$store.commit("patrolReport/changePage", val);
      // this.getReportAsync().then(val => {
      //   ("this.list", this.list);
      //   this.listData = this.list;
      // });log
      this.formData.page = val;
      // ("分页数据", this.formData);

      // this.pid = null;
      // this.timeBetween = null;
      // this.typeValue = null;
      // this.content = null;
      // // this.formData.page = 1;
      // this.formData.startTime = null;
      // this.formData.endTime = null;
      // this.formData.name = null;
      // this.formData.userName = null;
      // this.formData.projectId = null;
      ("分页数据", this.formData);

      const { data: res } = await this.$http.get("patrolRecord/list", {
        params: this.formData
      });
      ("分页数据res", res);
      if (res.code !== 200) {
        this.$message(res.message);
        return;
      }

      if (localStorage.ddyDatas !== "null") {
        return;
      } else {
        this.listData = res.data.list;
        this.totals = res.data.total;
      }

      // this.listData = res.data.list;
      // this.totals = res.data.total;

      // const { data: res } = await this.$http.get("patrolRecord/list", {
      //   params: this.formData
      // });
      // ("分页数据res", res);
      // this.listData = this.list;
    },
    //删除
    async deleteRecord() {
      let str = this.str;
      const data = await this.deleteReportAsync({
        ids: str
      });
      if (data.code == 200) {
        this.getReportAsync();
        this.$message("删除成功");
      } else {
        this.$message(res.message);
      }
    },
    //清空
    async deleteAll() {
      const data = await this.emptyAsync();
      if (data.code == 200) {
        this.getReportAsync();
        this.$message("清空成功");
      } else {
        this.$message(res.message);
      }
    },
    // 导出数据
    async outData() {
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
      // (this.idss);
      ("上传数据", this.formData);

      const {
        data: res
      } = await this.$http.post(
        "patrolRecord/exportPatrolRecord",
        qs.stringify(this.formData),
        { responseType: "blob" }
      );

      // 将数据变成a标签
      const link = document.createElement("a");
      let blob = new Blob([res], { type: "application/vnd.ms-excel" });
      link.style.display = "none";
      link.href = URL.createObjectURL(blob);
      let num = "";
      for (let i = 0; i < 10; i++) {
        num += Math.ceil(Math.random() * 10);
      }
      link.setAttribute("download", "巡查_" + num + ".xls");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    },
    // 杜删除
    async deleteDial(row) {
      ("删除数据", row);

      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          let id = {
            ids: row.id
          };
          const { data: res } = await this.$http.post(
            "patrolRecord/delete",
            qs.stringify(id)
          );
          ("删除数据res", res);
          if (res.code !== 200) {
            this.$message(res.message);
            return;
          }
          this.$message.success("删除成功");
          this.fingAlldata();
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });

      // let id = {
      //   ids: row.id
      // };
      // const { data: res } = await this.$http.post(
      //   "patrolRecord/delete",
      //   qs.stringify(id)
      // );
      // ("删除数据res", res);
      // if (res.code !== 200) {
      //   return this.$message(res.message);
      // }
      // this.$message.success("删除成功");
      // this.fingAlldata();
    },
    // 杜清空
    async emptyDALLda() {
      this.$confirm("此操作将永久清空所有文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          const { data: res } = await this.$http.post("patrolRecord/deleteAll");
          if (res.code !== 200) {
            return this.$message(res.message);
          }
          this.$message.success("清空成功");
          this.fingAlldata();
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消清空"
          });
        });
    }
  }
};
</script>

<style lang="less">
#pat {
  .el-breadcrumb {
    margin-top: 30px;
  }
  .el-pagination {
    margin-top: 30px;
  }
}
</style>

<style scoped>
.allImages {
  width: 880px;
  height: 220px;
  display: flex;
  overflow-x: auto;
}
.allImages img {
  z-index: 9999999;
  width: 200px !important;
  height: 200px;
  margin-left: 10px;
}
</style>

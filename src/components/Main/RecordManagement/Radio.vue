// 广播记录
<template>
  <div id="rad">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>广播记录</span>
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item>记录管理</el-breadcrumb-item>
          <el-breadcrumb-item>广播记录</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <!-- 内容主题 -->
      <!-- 检索按钮区 -->
      <div>
        <el-form ref="FormRef" :model="Form" label-width="80px">
          <el-row :gutter="40">
            <el-col :span="6">
              <div class="grid-content bg-purple">
                <el-form-item label="时间">
                  <!--  HH:mm:ss -->
                  <el-date-picker
                    v-model="dateValue"
                    type="daterange"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    value-format="yyyy-MM-dd"
                    @change="dateTime"
                  ></el-date-picker>
                </el-form-item>
              </div>
            </el-col>

            <el-col :span="10">
              <div class="grid-content bg-purple">
                <el-form-item label="检索">
                  <el-row :gutter="0">
                    <el-col :span="8">
                      <el-select v-model="type" placeholder>
                        <el-option label="姓名" value="0"></el-option>
                        <el-option label="账号" value="1"></el-option>
                      </el-select>
                    </el-col>
                    <el-col :span="14">
                      <el-input v-model="inpValue" placeholder="请输入内容"></el-input>
                    </el-col>
                    <el-col :span="2">
                      <el-button
                        type="primary"
                        class="se-btn"
                        @click="searchRaidoFind"
                        style="margin-left:10px;"
                        v-show="roleList.indexOf(72) !== -1"
                      >查询</el-button>
                    </el-col>
                  </el-row>
                </el-form-item>
              </div>
            </el-col>

            <el-col :span="6" style="float:right">
              <el-button type="primary" @click="ALLdatra" v-show="roleList.indexOf(72) !== -1">查询全部</el-button>
              <el-button
                type="danger"
                @click="deleteAllRadio"
                v-show="roleList.indexOf(73) !== -1"
              >清空</el-button>
              <!-- <el-button type="warning" @click="deleteRadio">删除</el-button> -->
              <el-button type="success" @click="exportExcel" v-show="roleList.indexOf(75) !== -1">导出</el-button>
            </el-col>
          </el-row>
        </el-form>
      </div>

      <!-- 表格区域 -->
      <el-table
        ref="multipleTable"
        :data="tableListData"
        tooltip-effect="dark"
        style="width: 100%"
        @selection-change="handleSelectionChange"
        :default-sort="{prop: 'date', order: 'descending'}"
        border
      >
        <el-table-column type="selection" width="100"></el-table-column>
        <el-table-column prop="sendName" label="发送人姓名" width="200"></el-table-column>
        <el-table-column prop="account" label="账号" show-overflow-tooltip></el-table-column>
        <el-table-column label="发送方式" show-overflow-tooltip>
          <template slot-scope="scope">
            <span v-if="scope.row.messageType ==1">文字</span>
            <span v-if="scope.row.messageType ==2">语音</span>
          </template>
        </el-table-column>
        <el-table-column prop="recordTime" label="发送时间" sortable width="200"></el-table-column>
        <el-table-column label="操作" show-overflow-tooltip>
          <template slot-scope="scope">
            <el-button
              type="primary"
              size="mini"
              @click="getVisible(scope.row)"
              v-show="roleList.indexOf(76) !== -1"
            >查看</el-button>
            <el-button
              type="warning"
              size="mini"
              @click="deleteRadio(scope.row)"
              v-show="roleList.indexOf(74) !== -1"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->

      <el-pagination
        @current-change="handleCurrentChange"
        :current-page="Form.page"
        :page-size="Form.limit"
        layout="total, prev, pager, next"
        :total="total"
      ></el-pagination>
    </el-card>

    <!-- 语音查看对话框 -->
    <el-dialog
      title="查看明细"
      :visible.sync="VoiceDialogVisible"
      width="500px"
      :modal="false"
      destroy-on-close
      id="audios"
    >
      <el-form ref="form" :model="detailList" label-width="100px">
        <el-form-item label="接收人：">
          <el-input v-model="detailList.sendName" type="text" disabled></el-input>
        </el-form-item>
        <el-form-item label="内容：">
          <!-- <video src="detailList.message" controls="controls"> -->
          <!-- <video-player
            class="video-player vjs-custom-skin"
            ref="videoPlayer"
            :playsinline="true"
            :options="playerOptions"
          ></video-player>-->
          <audio :src="detailListMess" controls="controls"></audio>
        </el-form-item>
      </el-form>
    </el-dialog>

    <!-- 文字对话框 -->
    <el-dialog title="查看明细" :visible.sync="TextDialogVisible" width="30%" :modal="false">
      <el-form class="textform" ref="form" :model="detailList" label-width="80px">
        <el-form-item label="接收人：">
          <el-input v-model="detailList.sendName" type="text" disabled></el-input>
        </el-form-item>
        <el-form-item label="内容：">
          <el-input
            type="textarea"
            v-model="detailList.message"
            :autosize="{ minRows: 4, maxRows: 6}"
            disabled
          ></el-input>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import qs from "qs";
import { createNamespacedHelpers } from "vuex";
const { mapState, mapActions } = createNamespacedHelpers("radio");
export default {
  data() {
    return {
      // 检索按钮区绑定数据
      Form: {
        // 查询页数及显示条数
        // pageSize: 5,
        page: 1,
        limit: 5,
        // pageNum: 1,
        // 开始时间
        beginTime: "",
        // 结束时间
        endTime: ""
        // 检索方式
        // type: ""
      },
      // 输入框信息
      inpValue: "",
      // 时间
      dateValue: [],
      // 查看对话框绑定数据
      viewMode: {
        mode: "",
        name: ""
      },
      // 多选表格存储数据，以[{},{}]形式存储
      multipleSelection: [],
      // 语音查看对话框
      VoiceDialogVisible: false,
      // 文字查看对话框
      TextDialogVisible: false,
      // 分页总条数
      total: 0,
      idss: {
        ids: []
      },
      // 视频数据
      detailListMess: "",
      tableListData: [],
      type: "",
      roleList: []
    };
  },
  computed: {
    ...mapState(["tableList", "detailList", "AllDataList"])
  },
  mounted() {
    this.searchRaido();
  },
  created() {
    this.getDataList();
    this.getRoleBtnData();
  },
  methods: {
    // 功能权限
    async getRoleBtnData() {
      let dataR = {
        parentId: 15,
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
      //  v-show="this.roleList.indexOf(35) !== -1"
    },

    ...mapActions([
      "listAsync",
      "detailAsync",
      "deleteAsync",
      "exportExcelAsync"
    ]),
    handleClose() {
      // ("点击了关闭");
      // var music = document.getElementById("music");
      // music.play();    //播放
      // music.pause(); //暂停
      let audio = document.querySelector("#audios");
      audio.pause();
      // this.audio.pause();
      // this.$refs.audio.pause();
    },
    // 获取页面数据
    async getDataList() {
      ("上传数据", this.Form);

      const { data: res } = await this.$http.get("broadcastRecord/list", {
        params: this.Form
      });
      ("查询数据", res);
      if (res.code !== 200) {
        this.$message(res.message);
        return;
      }

      // ("调度员身份ddy", localStorage.ddyDatas);
      // ("调度员身份ddy", typeof localStorage.ddyDatas);
      // if (localStorage.ddyDatas !== "null") {
      //   return;
      // } else {
      //   this.tableList = res.data.list;
      //   this.tableListData = res.data.list;
      //   this.total = res.data.total;
      // }
      this.tableListData = res.data.list;
      this.total = res.data.total;
      // this.tableList = res.data.list;
    },
    // 查询全部
    ALLdatra() {
      this.Form.page = 1;
      this.Form.beginTime = null;
      this.Form.endTime = null;
      this.Form.name = null;
      this.Form.userName = null;
      this.type = null;
      this.dateValue = null;
      this.inpValue = null;
      this.getDataList();
    },
    // 监听多选框选中值，以[{},{}]形式存储
    handleSelectionChange(val) {
      this.multipleSelection = val;
      (this.multipleSelection);
    },
    // 点击查看相应内容,拿到数据类型分为语音和文字，需要进行判断
    async getVisible(row) {
      // ("当前行数据", row);

      if (row.messageType == 2) {
        this.VoiceDialogVisible = true;
      } else {
        this.TextDialogVisible = true;
      }
      // (1);

      await this.detailAsync(row.id);
      const { data: res } = await this.$http.get(
        `/broadcastRecord/detail/` + row.id
      );
      // (sessionStorage.detailListMess);
      // qiye.ytha-hd.com
      // let mess = sessionStorage.detailListMess;
      let mess = res.data.message;
      // let mess =
      // "https://118.190.38.198:8080/safety-hat/test1/2020-2-28/broadcast/1582856710196.wav ";
      let MESS = "";
      mess = mess.replace(/\\/g, "/");

      ("获取原始数据", mess);
      if (window.location.protocol == "http:") {
        if (mess.indexOf("http") == -1) {
          ("不含有http");
          if (mess.indexOf("/") == -1) {
            return;
          }
          MESS = window.location.protocol + "//" + mess;
        } else if (mess.indexOf("http") !== -1) {
          ("有http");
          MESS = mess;
        }
      }
      if (window.location.protocol == "https:") {
        let one = mess.split("//");
        let two = one[1].split("/");
        two[0] = window.location.host;
        // two[0] = "qiye.ytha-hd.com";
        let three = "";
        for (let i = 0; i < two.length; i++) {
          three += two[i] + "/";
        }
        three = three.substr(0, three.length - 1);
        MESS = window.location.protocol + "//" + three;
      }
      // ("处理数据", MESSs);
      ("处理好后数据", MESS);
      this.detailListMess = MESS;
      // setTimeout(item => {
      //   this.$refs.audio.src = MESS;
      // });
      // indexof==-1没有找到
      // if (mess.indexOf("http") == -1) {
      //   // ("不含有http");
      //   if (mess.indexOf("/") == -1) {
      //     // ("中文");
      //     return;
      //   }
      //   MESS = "http://" + mess;
      // } else {
      //   // let ai = mess.split("//");
      //   // MESS = window.location.protocol + "//" + ai[1];
      //   MESS = mess;
      // }
      // // indexof==-1没有找到
      // if (mess.indexOf("https") !== -1) {
      //   ("找到https");
      //   let one = mess.split("//");
      //   let two = one[1].split("/");
      //   // two[0] = window.location.host;
      //   two[0] = "qiye.ytha-hd.com";
      //   let three = "";
      //   for (let i = 0; i < two.length; i++) {
      //     three += two[i] + "/";
      //   }
      //   three = three.substr(0, three.length - 1);
      //   MESS = "https://" + three;
      // }
    },
    //选择时间
    async dateTime() {
      // this.type = null;
      // this.Form.name = null;
      // this.Form.userName = null;
      this.Form.page = 1;
      // this.inpValue = "";
      ("时间", this.dateValue);
      this.Form.beginTime = this.dateValue[0];
      this.Form.endTime = this.dateValue[1];

      // if (this.dateValue[0] == this.dateValue[1]) {
      //   let ar = this.dateValue[1].split(" ");
      //   // ("ar", ar);
      //   ar[1] = "23:59:59";
      //   this.dateValue[1] = ar[0] + " " + ar[1];
      // }
      // ("处理后时间", this.dateValue);
      // this.Form.beginTime = this.dateValue[0];
      // this.Form.endTime = this.dateValue[1];
      ("时间上传数据", this.Form);
      const { data: res } = await this.$http.get("broadcastRecord/list", {
        params: this.Form
      });
      ("查询结果", res);
      if (res.code !== 200) {
        this.$message(res.message);
        return;
      }

      if (localStorage.ddyDatas !== "null") {
        return;
      } else {
        this.tableList = res.data.list;
        this.tableListData = res.data.list;
        this.total = res.data.total;
      }

      // this.tableListData = res.data.list;
      // this.tableList = res.data.list;
      // this.total = res.data.total;
    },
    // 检索查询
    async searchRaido() {
      // ("传递查询数据", this.Form);
      this.Form.page = 1;
      this.Form.beginTime = null;
      this.Form.endTime = null;
      // this.Form.name = null;
      // this.Form.userName = null;
      // if (this.Form.type == 0) {
      //   this.Form.userName = null;
      //   this.Form.name = this.inpValue;
      // }

      await this.listAsync(this.Form);
      ("查询所有数据", this.AllDataList);
      this.total = this.AllDataList.total;
      this.Form.page = this.AllDataList.pageNum;
      this.tableListData = this.tableList;

      this.Form.limit = this.AllDataList.pageSize;
      ("获取总数据", this.tableList);
    },
    // 杜检索
    async searchRaidoFind() {
      if (this.inpValue == "") {
        return this.$message("请选取查询条件与输入查询内容");
      }
      this.inpValue = this.inpValue.trim();
      // ("传递查询数据", this.Form);
      // ("时间数据", this.dateValue);
      // ("this.dateValue ==null", this.dateValue == null);
      if (this.dateValue == null) {
        this.Form.beginTime = null;
        this.Form.endTime = null;
      }
      // this.Form.beginTime = null;
      // this.Form.endTime = null;
      // this.dateValue = null;
      this.Form.page = 1;

      // await this.listAsync(this.Form);
      // ("查询所有数据", this.AllDataList);
      // this.tableListData = this.tableList;
      // this.total = this.AllDataList.total;
      // this.Form.page = this.AllDataList.pageNum;

      // this.Form.limit = this.AllDataList.pageSize;
      // ("获取总数据", this.tableList);
      if (this.type == 0) {
        this.Form.userName = null;
        this.Form.name = this.inpValue;
      } else if (this.type == 1) {
        this.Form.name = null;
        this.Form.userName = this.inpValue;
      }
      // this.Form.page = 1;
      ("检索查询数据", this.Form);
      const { data: res } = await this.$http.get("broadcastRecord/list", {
        params: this.Form
      });
      ("查询结果res", res);
      if (res.code !== 200) {
        this.$message(res.message);
        return;
      }

      this.tableListData = res.data.list;
      this.tableList = res.data.list;
      this.total = res.data.total;
    },

    // 删除指定记录
    deleteRadio(row) {
      (row.id);

      this.$confirm("确认删除？删除后不可恢复, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          // let ids = "";
          // this.multipleSelection.forEach(el => {
          //   ids += el.id + ",";
          // });
          ("删除数据", this.multipleSelection);
          let ids = row.id;
          this.deleteAsync(ids);
          this.$message({
            type: "success",
            message: "删除成功!"
          });
          this.getDataList();
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
      this.getDataList();
    },
    // 清空记录
    deleteAllRadio() {
      // (this.AllDataList.list);
      // let arr = [];
      // this.AllDataList.list.forEach(item => {
      //   arr.push(item.id);
      // });
      // let data = {
      //   ids: arr.toString()
      // };
      // (data);

      this.$confirm("确认清空？清空后不可恢复, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          // this.deleteAllAsync();
          const { data: res } = await this.$http.post(
            "broadcastRecord/deleteAll"
          );
          if (res.code !== 200) {
            return this.$message.error("删除失败");
          }

          this.$message({
            type: "success",
            message: "删除成功!"
          });
          this.getDataList();
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    // 导出excel
    async exportExcel() {
      // let parmasList = [];
      // this.tableList.forEach(el => {
      //   let parmas = {
      //     name: el.sendName,
      //     userName: el.account,
      //     startTime: el.type,
      //     endtTime: el.recordTime
      //   };
      //   parmasList.push(parmas);
      // });
      // let data = await this.exportExcelAsync(parmasList);

      // const arr = [];
      // for (let i = 0; i < this.multipleSelection.length; i++) {
      //   arr.push(this.multipleSelection[i].id);
      // }
      // // (arr);
      // this.idss.ids = arr;
      // this.idss.ids = JSON.stringify(this.idss.ids);
      // if (this.idss.ids == "[]") {
      //   this.idss.ids = "";
      // }
      // (this.idss);
      // const {
      //   data: res
      // } = await this.$http.post(
      //   "broadcastRecord/exportBroadcastRecordExcel",
      //   qs.stringify(this.idss),
      //   { responseType: "blob" }
      // );
      // (res);
      ("导出数据", this.Form);
      const {
        data: res
      } = await this.$http.post(
        "broadcastRecord/exportBroadcastRecord",
        qs.stringify(this.Form),
        { responseType: "blob" }
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
      link.setAttribute("download", "广播记录_" + num + ".xls");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    },
    // 分页触发
    async handleCurrentChange(val) {
      (val);
      this.Form.page = val;
      ("分页数据", this.Form);
      // this.searchRaido();
      const { data: res } = await this.$http.get("broadcastRecord/list", {
        params: this.Form
      });
      ("查询结果", res);
      if (res.code !== 200) {
        this.$message(res.message);
        return;
      }

      this.tableListData = res.data.list;
      this.tableList = res.data.list;
      this.total = res.data.total;
    }
  }
};
</script>

<style lang="less" >
#rad {
  .el-breadcrumb {
    margin-top: 30px;
  }
  .el-pagination {
    margin-top: 20px;
  }
  .textform {
    .el-form-item {
      display: flex;
      justify-content: flex-start;
      margin-bottom: 0px;
      margin-left: 15px;
      .el-form-item__content {
        .is-disabled {
          .el-input__inner,
          .el-textarea__inner {
            background-color: #ffffff;
            border: none;
            color: #606266;
            cursor: default;
          }
        }
        .el-form-item__content {
          margin-left: 0px !important;
        }
        .el-form-item__label {
          flex: none;
          text-align: left;
          width: 100px !important;
        }
      }
    }
  }
}
</style>

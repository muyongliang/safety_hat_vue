// 电话录音记录
<template>
  <div id="sou">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>电话录音记录</span>
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item>记录管理</el-breadcrumb-item>
          <el-breadcrumb-item>电话录音记录</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <!-- 内容主题 -->
      <!-- 检索按钮区 -->
      <div>
        <el-form ref="FormRef" :model="Form" label-width="100px">
          <el-row :gutter="10">
            <el-col :span="6">
              <div class="grid-content bg-purple">
                <el-form-item label="录音时间">
                  <!--  HH:mm:ss -->
                  <el-date-picker
                    v-model="dateValue"
                    type="daterange"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    value-format="yyyy-MM-dd"
                    @blur="dateTime"
                  ></el-date-picker>
                </el-form-item>
              </div>
            </el-col>

            <el-col :span="10">
              <div class="grid-content bg-purple">
                <el-form-item label="检索">
                  <el-row :gutter="0">
                    <el-col :span="8">
                      <el-select v-model="cooperateValue" placeholder>
                        <el-option
                          :options="cooperate"
                          v-for="item in cooperate"
                          :key="item.cooperateValue"
                          :label="item.label"
                          :value="item.cooperateValue"
                        ></el-option>
                      </el-select>
                    </el-col>
                    <el-col :span="14">
                      <el-input v-model="content"></el-input>
                    </el-col>
                    <el-col :span="2">
                      <el-button
                        type="primary"
                        class="se-btn"
                        @click="query"
                        style="margin-left:10px;"
                        v-show="roleList.indexOf(84) !== -1"
                      >查询</el-button>
                    </el-col>
                  </el-row>
                </el-form-item>
              </div>
            </el-col>

            <el-col :span="6" style="float:right">
              <el-button type="primary" @click="allDARTA">查询全部</el-button>
              <el-button type="warning" @click="deleteAllsd" v-show="roleList.indexOf(86) !== -1">清空</el-button>
              <el-button type="success" @click="outExLData" v-show="roleList.indexOf(88) !== -1">导出</el-button>
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
      </div>

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
        <el-table-column prop="id" type="selection"></el-table-column>
        <el-table-column prop="sendName" label="呼叫人姓名"></el-table-column>
        <el-table-column prop="callerAccount" label="呼叫人账号"></el-table-column>
        <el-table-column prop="sendToName" label="被叫人姓名"></el-table-column>
        <el-table-column prop="calledAccount" label="被叫人账号"></el-table-column>
        <el-table-column prop="recordBy" label="录音方"></el-table-column>
        <el-table-column prop="title" label="录音时长"></el-table-column>
        <el-table-column prop="recordTime" label="录音时间" sortable></el-table-column>
        <el-table-column label="操作" width="300px">
          <template slot-scope="scope">
            <el-button
              type="primary"
              size="mini"
              @click="getVisible(scope.row)"
              v-show="roleList.indexOf(89) !== -1"
            >查看</el-button>
            <el-button
              type="primary"
              size="mini"
              @click="dangload(scope.row)"
              v-show="roleList.indexOf(85) !== -1"
            >下载</el-button>
            <el-button
              type="danger"
              size="mini"
              @click="deletaSD(scope.row)"
              v-show="roleList.indexOf(87) !== -1"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <el-pagination
        small
        layout="prev, pager, next"
        :total="totals"
        :page-size="errData.limit"
        :current-page="errData.page"
        @current-change="handleCurrentChange"
      ></el-pagination>
    </el-card>

    <!-- 语音查看对话框 -->
    <el-dialog title="查看录音" :visible.sync="VoiceDialogVisible" width="500px" :modal="false">
      <el-form ref="form" :model="viewMode" label-width="80px">
        <el-form-item>
          <audio :src="voiceUrl" controls preload></audio>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import qs from "qs";
import { createNamespacedHelpers } from "vuex";
const { mapState, mapActions } = createNamespacedHelpers("cellRecord");
export default {
  inject: ["reload"],
  data() {
    return {
      // 检索按钮区绑定数据
      Form: {
        // 查询页数及显示条数
        pageSize: 5,
        pageNum: 1,
        // limit: 5,
        // page: 1,
        // 开始时间
        beginTime: "",
        // 结束时间
        endTime: "",
        // 传递设备状态
        status: "",
        // 设备类型
        type: "",
        // 日期设置
        valueData: ""
      },
      // 查看对话框绑定数据
      viewMode: {
        mode: "",
        name: ""
      },
      // 搜索时间
      timeBetween: "",
      // 多选表格存储数据，以[{},{}]形式存储
      multipleSelection: [],
      // 语音查看对话框
      VoiceDialogVisible: false,
      cooperate: [
        {
          cooperateValue: 0,
          label: "呼叫人姓名"
        },
        {
          cooperateValue: 1,
          label: "呼叫人账号"
        },
        {
          cooperateValue: 2,
          label: "被叫人姓名"
        },
        {
          cooperateValue: 3,
          label: "被叫人账号"
        }
      ],
      cooperateValue: "",
      content: "",
      deleteDialog: false,
      emptyDialog: false,
      voiceUrl: "",
      idss: {
        ids: []
      },
      dateValue: [],
      totals: 0,
      listData: [],
      errData: {
        page: 1,
        limit: 5
      },
      roleList: []
    };
  },
  mounted() {
    // this.cellRecordFormAsync().then(val => {
    //   this.listData = this.list;
    // });
  },
  computed: {
    ...mapState(["pageNum", "pageSize", "list", "total"])
  },
  created() {
    this.findDatas();
    this.getRoleBtnData();
  },
  methods: {
    // 功能权限
    async getRoleBtnData() {
      let dataR = {
        parentId: 17,
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
      "cellRecordFormAsync",
      "searchFormAsync",
      "deleteRecordAsync",
      "emptyAsync",
      "voiceUrlAsync"
    ]),
    // 进入页面查询
    async findDatas() {
      this.errData.page = 1;
      const { data: res } = await this.$http.get("phoneRecord/list", {
        params: this.errData
      });
      ("获取数据", res);
      if (res.code !== 200) {
        this.$message(res.message);
        return;
      }

      this.listData = res.data.list;
      this.totals = res.data.total;
    },
    // 时间查询
    async dateTime() {
      ("时间", this.dateValue);
      // if (this.dateValue[0] == this.dateValue[1]) {
      //   let ar = this.dateValue[1].split(" ");
      //   // ("ar", ar);
      //   ar[1] = "23:59:59";
      //   this.dateValue[1] = ar[0] + " " + ar[1];
      // }

      // ("处理后时间", this.dateValue);
      // this.errData.name = null;
      // this.errData.userName = null;
      // this.errData.toUserName = null;
      // this.errData.toName = null;

      this.errData.page = 1;
      this.errData.status = null;
      this.errData.type = null;
      this.errData.valueData = null;
      this.cooperateValue = null;
      this.content = null;
      this.errData.startTime = this.dateValue[0];
      this.errData.endTime = this.dateValue[1];
      // ("上传数据", this.Form);
      // this.errData.status = null;
      // this.errData.type = null;
      // this.errData.valueData = null;
      ("上传数据", this.errData);
      // this.findDatas();
      const { data: res } = await this.$http.get("phoneRecord/list", {
        params: this.errData
      });
      ("获取数据", res);
      if (res.code !== 200) {
        this.$message(res.message);
        return;
      }

      this.listData = res.data.list;
      this.totals = res.data.total;
    },
    // 监听多选框选中值，以[{},{}]形式存储
    handleSelectionChange(val) {
      this.multipleSelection = val;
      this.str = val.map(v => v.id).join(",");
    },
    // 详情语音
    async getVisible(prop) {
      this.VoiceDialogVisible = true;
      ("当前行", prop);
      const { data: res } = await this.$http.get(
        `phoneRecord/detail/` + prop.id
      );
      ("res", res);
      // if (res.code !== 200) {
      //   return this.$message(res.message);
      // }

      // let voiceId = prop.id;
      // const data = await this.voiceUrlAsync(voiceId);
      // let allDetail = JSON.parse(data.message);
      // this.voiceUrl = allDetail.imgUrls;
      // let mess =
      //   "https://qiye.ytha-hd.com/safety-hat/c31/phoneRecord/2020-2-29/%E8%AF%AD%E9%9F%B3%E9%80%9A%E8%AF%9D%E5%BD%95%E5%88%B6%EF%BC%9A01ed83cd-7d03-44bf-aa69-391fc7ea15de.mp3";
      let mess = res.message;
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
      this.voiceUrl = MESS;
    },
    //分页
    async handleCurrentChange(val) {
      this.errData.page = val;
      this.errData.beginTime = null;
      this.errData.endTime = null;
      this.errData.status = null;
      this.errData.type = null;
      this.errData.valueData = null;

      // this.findDatas();
      ("分页数据", this.errData);

      const { data: res } = await this.$http.get("phoneRecord/list", {
        params: this.errData
      });
      ("f分页数据res", res);
      if (res.code !== 200) {
        this.$message(res.message);
        return;
      }

      this.listData = res.data.list;
      this.totals = res.data.total;

      // this.$store.commit("cellRecord/changePage", val);
      // this.cellRecordFormAsync();
      // this.searchFormAsync().then(val => {
      //   this.listData = this.list;
      // });
    },
    //查询
    async query() {
      // let start = this.timeBetween[0];
      // let end = this.timeBetween[1];
      // if (this.cooperateValue == 0) {
      //   this.sendName = this.content;
      //   this.sendAccount = "";
      //   this.acceptName = "";
      //   this.acceptAccount = "";
      // } else if (this.cooperateValue == 1) {
      //   this.sendName = "";
      //   this.sendAccount = this.content;
      //   this.acceptName = "";
      //   this.acceptAccount = "";
      // } else if (this.cooperateValue == 2) {
      //   this.sendName = "";
      //   this.sendAccount = "";
      //   this.acceptName = this.content;
      //   this.acceptAccount = "";
      // } else if (this.cooperateValue == 3) {
      //   this.sendName = "";
      //   this.sendAccount = "";
      //   this.acceptName = "";
      //   this.acceptAccount = this.content;
      // }
      // this.$store.commit("cellRecord/initStart", start);
      // this.$store.commit("cellRecord/initEnd", end);
      // this.$store.commit("cellRecord/initSendName", this.sendName);
      // this.$store.commit("cellRecord/initSendAccount", this.sendAccount);
      // this.$store.commit("cellRecord/initAcceptName", this.acceptName);
      // this.$store.commit("cellRecord/initAcceptAccount", this.acceptAccount);
      if (this.content == "") {
        return this.$message("请选择查询条件与输入查询内容");
      }
      // this.dateValue = null;
      // this.errData.startTime = null;
      // this.errData.endTime = null;
      if (this.dateValue == null) {
        this.errData.startTime = null;
        this.errData.endTime = null;
      }

      // if (this.dateValue == null) {
      //   this.errData.startTime = null;
      //   this.errData.startTime = null;
      // }
      this.content = this.content.trim();
      this.errData.page = 1;
      // let dataFind = {
      //   page: 1,
      //   limit: 5
      // };
      if (this.cooperateValue == 0) {
        this.errData.name = this.content;
        this.errData.userName = null;
        this.errData.toUserName = null;
        this.errData.toName = null;
      } else if (this.cooperateValue == 1) {
        this.errData.name = null;
        this.errData.userName = this.content;
        this.errData.toUserName = null;
        this.errData.toName = null;
      } else if (this.cooperateValue == 2) {
        this.errData.name = null;
        this.errData.userName = null;
        this.errData.toName = this.content;
        this.errData.toUserName = null;
      } else if (this.cooperateValue == 3) {
        this.errData.name = null;
        this.errData.userName = null;
        this.errData.toUserName = this.content;
        this.errData.toName = null;
      }
      ("检索数据", this.errData);
      const { data: res } = await this.$http.get("phoneRecord/list", {
        params: this.errData
      });
      ("检索res", res);
      if (res.code !== 200) {
        return this.$message(res.message);
      }
      this.listData = res.data.list;
      this.totals = res.data.total;
    },
    //删除
    async deleteRecord() {
      let str = this.str;
      const data = await this.deleteRecordAsync({
        ids: str
      });
      if (data.code == 200) {
        this.cellRecordFormAsync();
        this.$message("删除成功");
      } else {
        this.$message(res.message);
      }
    },
    //清空
    async deleteAll() {
      const data = await this.emptyAsync();
      if (data.code == 200) {
        this.cellRecordFormAsync();
        this.$message("清空成功");
      } else {
        this.$message(res.message);
      }
    },
    // 导出数据
    async outExLData() {
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
      // } this.errData
      // (this.idss);
      // let datas = {};

      // datas.startTime = this.errData.startTime;
      // if (datas.startTime == undefined) {
      //   datas.startTime == null;
      // }

      // datas.endTime = this.errData.endTime;
      // datas.name = this.errData.name;
      // datas.userName = this.errData.userName;
      // datas.toUserName = this.errData.toUserName;
      // datas.toName = this.errData.toName;
      ("导出查询", this.errData);

      // let datas = this.errData;
      let datas = {};
      ("时间", this.dateValue);

      if (this.dateValue.length == 0) {
        datas.startTime = null;
        datas.endTime = null;
      } else if (this.dateValue.length !== 0) {
        datas.startTime = this.errData.startTime;
        datas.endTime = this.errData.endTime;
      }
      ("检索条件", this.cooperateValue);
      if (this.cooperateValue == 0) {
        datas.name = this.errData.name;
      } else if (this.cooperateValue == 1) {
        datas.userName = this.errData.userName;
      } else if (this.cooperateValue == 2) {
        datas.toName = this.errData.toName;
      } else if (this.cooperateValue == 3) {
        datas.toUserName = this.errData.toUserName;
      }

      ("导出查询datas", datas);

      const {
        data: res
      } = await this.$http.post(
        "phoneRecord/exportPhoneRecord",
        qs.stringify(datas),
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
      link.setAttribute("download", "电话录音记录_" + num + ".xls");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      this.reload();
    },
    // 查询全部
    async allDARTA() {
      this.errData.name = null;
      this.errData.userName = null;
      this.errData.toUserName = null;
      this.errData.toName = null;
      this.dateValue = null;
      this.errData.page = 1;
      this.errData.limit = 5;
      this.cooperateValue = null;
      this.content = null;
      this.errData.beginTime = null;
      this.errData.endTime = null;
      this.errData.status = null;
      this.errData.type = null;
      this.errData.valueData = null;
      ("查询全部", this.errData);

      const { data: res } = await this.$http.get("phoneRecord/list", {
        params: this.errData
      });
      ("查询全部", res);
      if (res.code !== 200) {
        this.$message(res.message);
        return;
      }

      this.listData = res.data.list;
      this.totals = res.data.total;
    },
    // 下载
    async dangload(row) {
      ("下载行数据", row);

      // const {data:res} = await this.$http.get()
      // /phoneRecord/download/{id}
      // ("下载文件id", dataArr);
      let a = document.createElement("a");
      a.href = this.$src + "phoneRecord/download/" + row.id;
      a.click();
    },
    // 删除
    async deletaSD(row) {
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
            "phoneRecord/delete",
            qs.stringify(id)
          );
          ("删除数据res", res);
          if (res.code !== 200) {
            return this.$message(res.message);
          }
          this.$message.success("删除成功");
          this.allDARTA();
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
      //   "phoneRecord/delete",
      //   qs.stringify(id)
      // );
      // ("删除数据res", res);
      // if (res.code !== 200) {
      //   return this.$message(res.message);
      // }
      // this.$message.success("删除成功");
      // this.allDARTA();
    },
    // 清空
    async deleteAllsd() {
      // this.errData.name = null;
      // this.errData.userName = null;
      // this.errData.toUserName = null;
      // this.errData.toName = null;
      // this.dateValue = null;
      // this.errData.page = 1;
      // this.errData.limit = 10000;
      // this.cooperateValue = null;
      // this.content = null;
      // this.errData.beginTime = null;
      // this.errData.endTime = null;
      // this.errData.status = null;
      // this.errData.type = null;
      // this.errData.valueData = null;
      this.$confirm("此操作将永久清空所有文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          let datas = {
            page: 1,
            limit: 10000
          };
          ("清空全部", datas);

          const { data: res } = await this.$http.get("phoneRecord/list", {
            params: datas
          });
          ("清空全部res", res);
          let arr = [];
          res.data.list.forEach(item => {
            return arr.push(item.id);
          });
          arr = arr.toString();
          ("清空id", arr);
          let id = {
            ids: arr
          };
          const { data: ress } = await this.$http.post(
            "phoneRecord/delete",
            qs.stringify(id)
          );
          ("清空数据res", ress);
          if (ress.code !== 200) {
            return this.$message(ress.message);
          }
          this.$message.success("清空成功");
          this.allDARTA();
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消清空"
          });
        });

      // let datas = {
      //   page: 1,
      //   limit: 10000
      // };
      // ("清空全部", datas);

      // const { data: res } = await this.$http.get("phoneRecord/list", {
      //   params: datas
      // });
      // ("清空全部res", res);
      // let arr = [];
      // res.data.list.forEach(item => {
      //   return arr.push(item.id);
      // });
      // arr = arr.toString();
      // ("清空id", arr);
      // let id = {
      //   ids: arr
      // };
      // const { data: ress } = await this.$http.post(
      //   "phoneRecord/delete",
      //   qs.stringify(id)
      // );
      // ("清空数据res", ress);
      // if (ress.code !== 200) {
      //   return this.$message(ress.message);
      // }
      // this.$message.success("清空成功");
      // this.allDARTA();
    }
  }
};
</script>

<style lang="less" >
#sou {
  .el-breadcrumb {
    margin-top: 30px;
  }
  .el-pagination {
    margin-top: 20px;
  }
}
</style>

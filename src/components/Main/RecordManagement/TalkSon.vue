// 对讲记录明细页面
<template>
  <div id="taks">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>对讲记录明细</span>
        <el-row :gutter="40" style="margin-top:10px;">
          <el-col :span="1">
            <el-button type="primary" size="mini" @click="backPush">返回</el-button>
          </el-col>
          <el-col :span="6">
            <el-breadcrumb separator-class="el-icon-arrow-right">
              <el-breadcrumb-item>记录管理</el-breadcrumb-item>
              <el-breadcrumb-item>对讲记录</el-breadcrumb-item>
              <el-breadcrumb-item>对讲记录明细</el-breadcrumb-item>
            </el-breadcrumb>
          </el-col>
        </el-row>
      </div>
      <!-- 主题内容区 -->
      <!-- 搜索框 -->
      <el-form ref="FormRef" :model="Form" label-width="100px">
        <el-row :gutter="10">
          <el-col :span="5">
            <div class="grid-content bg-purple">
              <el-form-item label="账号类型">
                <el-select v-model="Form.userType" placeholder="全部" @change="findTypeData">
                  <el-option label="全部" value="0"></el-option>
                  <el-option label="调度员" value="1"></el-option>
                  <el-option label="终端" value="2"></el-option>
                </el-select>
              </el-form-item>
            </div>
          </el-col>
          <!--  HH:mm:ss -->
          <el-col :span="6">
            <el-form-item label="时间">
              <el-date-picker
                v-model="valueData"
                value-format="yyyy-MM-dd"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                @change="getTimeFind"
              ></el-date-picker>
            </el-form-item>
          </el-col>

          <el-col :span="7">
            <div class="grid-content bg-purple">
              <el-form-item label="检索">
                <el-row :gutter="0">
                  <el-col :span="8">
                    <div class="grid-content bg-purple">
                      <el-select v-model="typesa" placeholder>
                        <el-option label="姓名" value="0"></el-option>
                        <el-option label="账号" value="1"></el-option>
                      </el-select>
                    </div>
                  </el-col>
                  <el-col :span="14">
                    <div class="grid-content bg-purple">
                      <el-input v-model="namesa" placeholder="请输入内容"></el-input>
                    </div>
                  </el-col>
                  <el-col :span="2">
                    <el-button
                      type="primary"
                      class="se-btn"
                      @click="getFind"
                      v-show="roleList.indexOf(81) !== -1"
                    >查询</el-button>
                  </el-col>
                </el-row>
              </el-form-item>
            </div>
          </el-col>

          <el-col :span="6" style="padding-left:50px">
            <el-button type="primary" @click="dalDATAS" v-show="roleList.indexOf(82) !== -1">查询全部</el-button>
            <!-- <el-button type="warning" @click="delALLdas">清空</el-button> -->
            <el-button type="primary" @click="outData">导出</el-button>
          </el-col>
        </el-row>
      </el-form>

      <!-- 表格区域 -->
      <el-table
        :data="detailListData"
        style="width: 100%"
        :default-sort="{prop: 'date', order: 'descending'}"
        border
      >
        <el-table-column label="账号类型">
          <template slot-scope="scope">
            <span v-if="scope.row.userType == 1">调度员</span>
            <span v-if="scope.row.userType == 2">终端</span>
          </template>
        </el-table-column>
        <el-table-column prop="sendName" label="发送人姓名"></el-table-column>
        <el-table-column prop="account" label="账号"></el-table-column>
        <el-table-column prop="recordTime" label="时间" sortable></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              type="primary"
              @click="viewData(scope.row)"
              v-show="roleList.indexOf(80) !== -1"
            >查看</el-button>
            <el-button
              type="danger"
              @click="deleData(scope.row)"
              v-show="roleList.indexOf(79) !== -1"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <!-- <el-pagination :page-size="5"  :current-page="1" layout="total,prev, pager, next" :total="10"></el-pagination> -->

      <el-pagination
        @current-change="handleCurrentChange"
        :current-page="Form.page"
        :page-size="Form.limit"
        layout="total,prev, pager, next"
        :total="total"
      ></el-pagination>
    </el-card>

    <!-- 查看详情 -->
    <el-dialog title="查看对讲记录" :visible.sync="viewVisible" width="350px" destroy-on-close>
      <!-- <audio :src="detailListMess" controls="true"></audio> -->
      <el-form ref="form">
        <el-form-item>
          <!-- <audio controls="controls" ref="audio" :src="detailListMess"></audio>label="内容：" -->
          <audio :src="detailListMess" controls="controls" ref="audio" style="width:300px"></audio>
        </el-form-item>
      </el-form>
      <!-- <div class="Playback-bar">
        <el-row :gutter="10">
          <el-col :span="2">
            <img src="../../../assets/images/组 2057.png" alt class="imgOne" />
          </el-col>
          <el-col :span="14">
            <el-slider v-model="value" range :marks="marks" :max="60"></el-slider>
          </el-col>
          <el-col :span="2">
            <img src="../../../assets/images/组 2058.png" alt class="imgOne" />
          </el-col>
          <el-col :span="4">
            <el-slider v-model="value1"></el-slider>
          </el-col>
        </el-row>
      </div>-->
    </el-dialog>
  </div>
</template>
<script>
import qs from "qs";
import { createNamespacedHelpers } from "vuex";
import { async } from "q";
const { mapState, mapActions } = createNamespacedHelpers("talk");
export default {
  data() {
    return {
      // 检索按钮区绑定数据
      Form: {
        // 查询页数及显示条数
        limit: 5,
        page: 1
        // // 开始时间
        // beginTime: "",
        // // 结束时间
        // endTime: "",
        // // 传递设备状态
        // status: "",
        // // 设备类型
        // type: "",
        // // 日期设置
        // valueData: ""
      },
      //   表格绑定数据
      tableData: [
        {
          one: "终端",
          date: "2016-05-02",
          name: "王小虎",
          num: "sxlc_001"
        },
        {
          one: "调度员",
          date: "2016-05-04",
          name: "王2虎",
          num: "sxlc_002"
        }
      ],
      viewVisible: false,
      // 语音播放条数据
      value: [0, 20],
      marks: {
        0: "00:00"
      },
      value1: 30,
      // idss: {
      //   ids: [""]
      // },
      idss: {
        ids: ""
      },

      ids: [""],
      humanId: 0,
      detailListData: [],
      total: 0,
      detailListMsesss: [],
      detailListMess: "",
      formm: {
        messageType: ""
      },
      valueData: [],
      namesa: "",
      typesa: "",
      roleList: []
    };
  },
  computed: {
    ...mapState(["detailList"])
  },
  mounted() {},
  created() {
    this.getTabLIst();
    this.getRoleBtnData();
  },
  methods: {
    // 功能权限
    async getRoleBtnData() {
      let dataR = {
        parentId: 16,
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

    ...mapActions(["detailAsync"]),
    // 根据id获取对讲记录详情
    getDetailList() {},
    // 查询全部
    async dalDATAS() {
      this.typesa = null;
      this.namesa = null;
      this.Form.page = 1;
      this.Form.userType = null;
      this.valueData = null;
      this.Form.startTime = null;
      this.Form.endTime = null;
      this.Form.name = null;
      this.Form.userName = null;
      // this.Form.userType = null;
      ("上传数据", this.Form);
      const { data: res } = await this.$http.post(
        "talkBackRecord/listDetail",
        qs.stringify(this.Form)
      );
      ("查询全部res", res);
      if (res.code !== 200) {
        this.$message(res.message);
        return;
      }

      this.detailListData = res.data.list;
      this.total = res.data.total;
      this.Form.page = res.data.pageNum;
      this.Form.page = 1;
    },
    async getTabLIst() {
      this.humanId = this.$route.query.id;
      this.Form.pid = this.$route.query.id;
      this.Form.groupId = this.$route.query.groupId;
      // this.Form.page = 1;
      ("数据", this.Form);
      const { data: res } = await this.$http.post(
        "talkBackRecord/listDetail",
        qs.stringify(this.Form)
      );
      ("根据id查询详细数据", res);
      if (res.code !== 200) {
        this.$message(res.message);
        return;
      }

      this.detailListData = res.data.list;
      this.total = res.data.total;
    },
    //   返回上一页面
    backPush() {
      this.$router.go("-1");
    },
    // 查看明细
    async viewData(row) {
      // ("12", row);
      const { data: res } = await this.$http.get(
        `talkBackRecord/detail/` + row.id
      );
      // ("12", res);
      let mess = res.data.message;
      let MESS = "";
      mess = mess.replace(/\\/g, "/");

      // ("获取原始数据", mess);没有http
      if (window.location.protocol == "http:") {
        if (mess.indexOf("http") == -1) {
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
      ("处理好后数据MESS", MESS);
      this.detailListMess = MESS;
      setTimeout(item => {
        this.$refs.audio.src = MESS;
      });
      // this.$refs.audio1.src = MESS;
      // ("处理好后数据ref", this.$refs.audio.src);
      this.viewVisible = true;
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
      // if (mess.indexOf("https") !== -1) {
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
    // 导出
    async outData() {
      // const arr = this.$route.query.id;
      // (arr);
      // this.idss.ids = arr;
      // this.idss.ids = JSON.stringify(this.idss.ids);
      // if (this.idss.ids == "[]") {
      //   this.idss.ids = "";
      // }

      // (this.idss);
      // // let :
      // const {
      //   data: res
      // } = await this.$http.post(
      //   "talkBackRecord/exportTalkBackExcel",
      //   qs.stringify(this.idss),
      //   { responseType: "blob" }
      // );
      ("导出上传数据", this.Form);
      const {
        data: res
      } = await this.$http.post(
        "talkBackRecord/exportTalkBackDetail",
        qs.stringify(this.Form),
        { responseType: "blob" }
      );

      // // 将数据变成a标签
      const link = document.createElement("a");
      let blob = new Blob([res], { type: "application/vnd.ms-excel" });
      link.style.display = "none";
      link.href = URL.createObjectURL(blob);
      let num = "";
      for (let i = 0; i < 10; i++) {
        num += Math.ceil(Math.random() * 10);
      }
      link.setAttribute("download", "对讲记录_" + num + ".xls");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    },
    // 分页处理
    async handleCurrentChange(val) {
      this.Form.page = val;
      ("分页", val);

      // this.getTabLIst();
      ("数据", this.Form);
      const { data: res } = await this.$http.post(
        "talkBackRecord/listDetail",
        qs.stringify(this.Form)
      );
      ("根据id查询详细数据", res);
      if (res.code !== 200) {
        this.$message(res.message);
        return;
      }

      this.detailListData = res.data.list;
      this.total = res.data.total;
    },
    // 根据类型查询
    async findTypeData() {
      if (this.Form.userType == 0) {
        this.typesa = null;
        this.namesa = null;
        // if (this.valueData == null) {
        //   this.Form.beginTime = null;
        //   this.Form.endTime = null;
        // }
        this.Form.page = 1;
        this.dalDATAS();
      } else {
        // this.typesa = null;
        // this.namesa = null;
        this.Form.page = 1;
        // this.Form.name = null;
        // this.Form.userName = null;
        // this.Form.userType = this.formm.userType * 1;
        if (this.valueData == null) {
          this.Form.beginTime = null;
          this.Form.endTime = null;
        }
        // this.Form.endTime = null;
        // this.Form.startTime = null;
        this.valueData = null;
        // this.Form.page == 1;
        ("类型查询上传数据", this.Form);
        const { data: res } = await this.$http.post(
          "talkBackRecord/listDetail",
          qs.stringify(this.Form)
        );
        ("类型查询", res);
        if (res.code !== 200) {
          this.$message(res.message);
          return;
        }

        this.Form.page == 1;
        this.detailListData = res.data.list;
        this.total = res.data.total;
      }
      // (this.Form);
    },
    // 时间查询
    async getTimeFind() {
      ("选择时间", this.valueData);

      // this.typesa = null;
      // this.namesa = null;
      // this.Form.name = null;
      // this.Form.userName = null;
      // this.Form.messageType = null;
      // this.Form.userType = null;

      // this.formm.userType = null;
      this.Form.startTime = this.valueData[0];
      this.Form.endTime = this.valueData[1];
      // this.valueData = null;
      this.Form.page = 1;
      ("时间查询数据", this.Form);
      const { data: res } = await this.$http.post(
        "talkBackRecord/listDetail",
        qs.stringify(this.Form)
      );
      ("时间查询", res);
      if (res.code !== 200) {
        this.$message(res.message);
        return;
      }

      this.detailListData = res.data.list;
      this.total = res.data.total;
      // this.Form.page == 1;
      // }
    },
    // 条件检索
    async getFind() {
      this.namesa = this.namesa.trim();
      if (this.typesa == 0) {
        // this.valueData = null;
        // this.Form.userName = null;
        // this.Form.userType = null;
        // this.Form.messageType = null;
        // this.Form.endTime = null;
        // this.Form.startTime = null;
        if (this.valueData == null) {
          this.Form.beginTime = null;
          this.Form.endTime = null;
        }

        this.Form.name = this.namesa;
        // this.valueData = null;
        this.Form.page = 1;
        ("名字查询", this.Form);
        const { data: res } = await this.$http.post(
          "talkBackRecord/listDetail",
          qs.stringify(this.Form)
        );
        ("类型查询", res);
        if (res.code !== 200) {
          this.$message(res.message);
          return;
        }

        this.detailListData = res.data.list;
        this.total = res.data.total;
      }
      if (this.typesa == 1) {
        // this.valueData = null;
        // this.Form.userType = null;
        this.Form.userName = this.namesa;
        // this.Form.name = null;
        // this.Form.valueData = null;
        // this.Form.messageType = null;
        // this.Form.endTime = null;
        // this.Form.startTime = null;
        if (this.valueData == null) {
          this.Form.beginTime = null;
          this.Form.endTime = null;
        }
        this.Form.page = 1;
        ("账号查询", this.Form);
        const { data: res } = await this.$http.post(
          "talkBackRecord/listDetail",
          qs.stringify(this.Form)
        );
        ("类型查询", res);
        if (res.code !== 200) {
          this.$message(res.message);
          return;
        }

        this.detailListData = res.data.list;
        this.total = res.data.total;
      }
    },
    // 删除
    async deleData(row) {
      ("删除", row);

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
            "talkBackRecord/delete",
            qs.stringify(id)
          );
          ("删除rres", res);
          if (res.code !== 200) {
            return this.$message(res.message);
          }
          this.$message.success("删除成功");
          this.dalDATAS();
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    }
  }
};
</script>
<style lang="less">
#taks {
  .el-card {
    // display: flex;
    .el-breadcrumb {
      margin-top: 12px;
    }
    .el-pagination {
      margin-top: 20px;
    }
  }
  .Playback-bar {
    height: 50px;
    width: 100%;
    padding: 10px 20px;
    box-sizing: border-box;
    background-color: pink;
    .el-slider {
      margin-top: -8px;
      // margin-left: 15px;
    }
    .imgOne {
      display: inline-block;
    }
  }
}
</style>

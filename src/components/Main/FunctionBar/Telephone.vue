// 未接来电
<template>
  <div id="telephone">
    <el-card class="box-card">
      <div slot="header">
        <span>未接来电记录</span>
      </div>
      <!-- 主体部分 -->
      <!-- 功能input区 -->
      <el-form ref="form" :model="form" label-width="80px">
        <el-row :gutter="20">
          <el-col :span="5">
            <el-form-item label="通话类型">
              <el-select v-model="typeValue" placeholder="全部" @change="currentType">
                <el-option
                  v-for="item in options"
                  :key="item.typeValue"
                  :label="item.typeName"
                  :value="item.typeValue"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="时间">
              <el-date-picker
                v-model="timeBetween"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                value-format="yyyy-MM-dd"
                unlink-panels
              ></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="2">
            <el-form-item>
              <el-button type="primary" @click="query">查询</el-button>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item class="col4">
              <el-button type="primary" @click="emptyDialog = true">清空</el-button>
              <el-button type="primary" @click="deleteDialog = true;">删除</el-button>
              <el-button type="primary" @click="outData">导出</el-button>
              <el-dialog title="提示" :visible.sync="deleteDialog" width="30%">
                <span>确认删除？删除后不可恢复</span>
                <span slot="footer" class="dialog-footer">
                  <el-button @click="deleteDialog = false">取 消</el-button>
                  <el-button type="primary" @click="deleteDialog = false;sureDelete()">确 定</el-button>
                </span>
              </el-dialog>

              <el-dialog title="提示" :visible.sync="emptyDialog" width="30%" append-to-body>
                <span>确认清空？清空后不可恢复</span>
                <span slot="footer" class="dialog-footer">
                  <el-button @click="emptyDialog = false">取 消</el-button>
                  <el-button type="primary" @click="emptyDialog = false;emptyBtn()">确 定</el-button>
                </span>
              </el-dialog>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>

      <!-- table表格区域 -->
      <el-table
        ref="multipleTable"
        :data="list"
        tooltip-effect="dark"
        style="width: 100%"
        border
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="40" prop="missId"></el-table-column>
        <el-table-column label="通话类型" width="400" prop="type" :formatter="changeStatus"></el-table-column>
        <!-- prop="caller" -->
        <el-table-column label="呼叫人" width="650">
          <template slot-scope="scope">
            <span @click="viewData(scope.row)">{{scope.row.caller}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="time" label="时间" show-overflow-tooltip></el-table-column>
      </el-table>

      <!-- 分页栏 -->
      <el-pagination
        :total="total"
        :page-size="pageSize"
        :current-page="pageNum"
        @current-change="currentPage"
        layout="prev, pager, next"
      ></el-pagination>
    </el-card>
    <!-- 终端成员信息弹框 -->
    <div class="dia-1">
      <el-dialog title="成员信息" :visible.sync="MemberDialogVisible" width="30%" :modal="false">
        <!-- 主体信息区 -->
        <el-form
          class="findDetliatRef"
          ref="findDetliatRef"
          :model="findDetliat"
          label-width="120px"
          style="width:90%"
        >
          <el-form-item label="姓名：">
            <el-input v-model="findDetliat.name" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="账号类型：">
            <el-input v-model="findDetliat.userType" :disabled="true">
              <!-- <span v-if="findDetliat.userType == 0">调度员</span>
              <span v-if="findDetliat.userType == 1">终端用户</span>-->
            </el-input>
          </el-form-item>
          <el-form-item v-show="this.findDetliat.userType == '终端'" label="工种：">
            <el-input v-model="findDetliat.workType" :disabled="true"></el-input>
          </el-form-item>
          <div v-show="this.findDetliat.userType ==  '终端'">
            <el-divider></el-divider>
            <el-form-item label="电池电量：">
              <el-input v-model="findDetliat.power" :disabled="true"></el-input>
            </el-form-item>
            <el-form-item label="主板温度：">
              <el-input v-model="findDetliat.mainTemperature" :disabled="true"></el-input>
            </el-form-item>
            <el-form-item label="环境温度：">
              <el-input v-model="findDetliat.environmentTemperature" :disabled="true"></el-input>
            </el-form-item>
            <el-form-item label="气压：">
              <el-input v-model="findDetliat.pressure" :disabled="true"></el-input>
            </el-form-item>
            <el-form-item label="网络：">
              <el-input v-model="findDetliat.network" :disabled="true"></el-input>
            </el-form-item>
          </div>
          <el-divider></el-divider>
          <el-form-item label="时间：">
            <el-input v-model="findDetliat.time" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="经度：">
            <el-input v-model="findDetliat.latitude" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="纬度：">
            <el-input v-model="findDetliat.longitude" :disabled="true"></el-input>
          </el-form-item>
        </el-form>
        <!-- 底部功能区 -->
        <div class="fn">
          <ul>
            <li>
              <img src="../../../assets/images/2018.png" alt />
              <p>语音电话</p>
            </li>
            <li>
              <img src="../../../assets/images/2019.png" alt />
              <p>视频电话</p>
            </li>
            <!-- <li @click="VoiceBroadcast">
                <img src="../../assets/images/2020.png" alt />
                <p>语音广播</p>
            </li>-->
            <!-- 定位 -->
            <li>
              <img src="../../../assets/images/2042.png" alt />
              <p>定位</p>
            </li>
            <li v-show="this.findDetliat.userType ==  '终端'">
              <img src="../../../assets/images/2021.png" alt />
              <p>轨迹</p>
            </li>
            <!-- getDetection -->
            <li v-show="this.findDetliat.userType ==  '终端'">
              <img src="../../../assets/images/2022.png" alt />
              <p>无声侦护</p>
            </li>
          </ul>
        </div>
      </el-dialog>
    </div>

    <!-- 调度员成员信息框 -->
    <!-- <div class="dia-1 dia-2">
      <el-dialog
        title="成员信息-调度员"
        :visible.sync="DispatcherDialogVisible"
        width="30%"
        :modal="false"
      >
        <el-form
          style="margin-top:10px;"
          class="dispatcher"
          ref="dispatcher"
          :model="terminal"
          label-width="80px"
        >
          <el-form-item label="姓名：">
            <el-input v-model="dispatcher.name" disabled></el-input>
          </el-form-item>
          <el-form-item label="账号类型：">
            <el-input v-model="dispatcher.accountType" disabled></el-input>
          </el-form-item>
          <el-form-item label="电话：">
            <el-input v-model="dispatcher.phone" disabled></el-input>
          </el-form-item>
          <el-divider></el-divider>
          <el-form-item label="时间：">
            <el-input v-model="dispatcher.date" disabled></el-input>
          </el-form-item>
          <el-form-item label="经度：">
            <el-input v-model="dispatcher.longitude" disabled></el-input>
          </el-form-item>
          <el-form-item label="纬度：">
            <el-input v-model="dispatcher.latitude" disabled></el-input>
          </el-form-item>
        </el-form>
        <div class="fn">
          <ul>
            <li>
              <img src="../../assets/images/2018.png" alt />
              <p>语音电话</p>
            </li>
            <li>
              <img src="../../assets/images/2019.png" alt />
              <p>视频电话</p>
            </li>
            <li>
              <img src="../../assets/images/2048.png" alt />
              <p>定位</p>
            </li>
          </ul>
        </div>
      </el-dialog>
    </div>-->
  </div>
</template>

<script>
import qs from "qs";
import { createNamespacedHelpers } from "vuex";
const { mapState, mapActions } = createNamespacedHelpers("phone");
export default {
  data() {
    return {
      // input框绑定数据
      form: {
        region: "",
        date1: "",
        date2: ""
      },
      typeValue: "",
      options: [
        {
          typeName: "全部",
          typeValue: 0
        },
        {
          typeName: "语音通话",
          typeValue: 1
        },
        {
          typeName: "语音会议",
          typeValue: 2
        },
        {
          typeName: "视频通话",
          typeValue: 3
        },
        {
          typeName: "视频会议",
          typeValue: 4
        }
      ],
      timeBetween: "",
      deleteDialog: false,
      emptyDialog: false,
      valData: [], //表单选择数据
      middddds: { missIds: [] },
      MemberDialogVisible: false,
      DispatcherDialogVisible: false,
      findDetliat: {},
      dispatcher: {},
      diduyuan: true,
      zhongduan: true,
      findDetliat: {}
    };
  },
  async mounted() {
    if (window.location.href.indexOf("#reloaded") == -1) {
      window.location.href = window.location.href + "#reloaded";
      window.location.reload();
    }
    this.byTypeAsync(); //按类型查询
    await this.getSts(); //获取状态
    this.changeSts(); //改变已读状态
  },
  computed: {
    ...mapState(["pageNum", "pageSize", "list", "total"])
  },
  methods: {
    // 点击查看弹框
    async viewData(row) {
      ("整行数据row", row);
      // 查询所有通讯录名单
      let darta = {
        pageSize: 100000,
        pageNum: 1
      };
      const { data: res } = await this.$http.post(
        "contact/findContact",
        qs.stringify(darta)
      );
      let idata = {};
      // 没有部署数据有问题4.17
      for (let i = 0; i < res.data.list.length; i++) {
        // (); row.caller
        if (res.data.list[i].fullName == row.caller) {
          idata = res.data.list[i];
        }
      }
      ("idata", idata);

      let twodata = {
        clientId: idata.id,
        type: idata.type
      };
      const { data: ress } = await this.$http.post(
        "contact/findContactDetail",
        qs.stringify(twodata)
      );
      ("ress", ress);
      this.findDetliat = ress.data;
      if (this.findDetliat.userType == 1) {
        // 账号是调度员
        ("调度员");
        this.findDetliat.userType = "调度员";
      } else if (this.findDetliat.userType == 2) {
        // 账号是终端
        ("终端");
        this.findDetliat.userType = "终端";
      }
      ("this.findDetliat", this.findDetliat);

      this.MemberDialogVisible = true;
    },
    ...mapActions([
      "byTypeAsync",
      "byTimeAsync",
      "deleteItemAsync",
      "emptyItemAsync",
      "getStatusAsync",
      "changeStatusAsync"
    ]),
    currentType() {
      this.$store.commit("phone/initType", this.typeValue);
      this.byTypeAsync(); //按类型查询
    },
    currentPage(val) {
      this.$store.commit("phone/changePage", val);
      this.byTypeAsync(); //按类型查询
    },
    //获取状态
    async getSts() {
      const data = await this.getStatusAsync(); //获取状态
      this.ids = data;
    },
    changeSts() {
      let arr = JSON.stringify(this.ids);
      this.changeStatusAsync({
        ids: arr
      }); //改变已读状态
    },
    //修改状态
    changeStatus(row, column) {
      switch (row.type) {
        case 1:
          return "语音通话";
          break;
        case 2:
          return "语音会议";
          break;
        case 3:
          return "视频通话";
          break;
        case 4:
          return "视频会议";
          break;
      }
    },
    //时间段查询
    query() {
      (this.timeBetween);
      let start = this.timeBetween[0];
      let end = this.timeBetween[1];
      this.$store.commit("phone/initStart", start);
      this.$store.commit("phone/initEnd", end);
      this.byTimeAsync();
    },
    handleSelectionChange(val) {
      this.valData = val;
      ("表单数据", this.valData);
      this.str = val.map(v => v.missId).join(",");
    },
    //删除
    async sureDelete() {
      let id = this.str;
      if (id.length == 0) {
        this.$message("请选择需要删除项");
      } else if (id.length > 1) {
        this.$message("一次只能删除一项");
      } else if (id.length == 1) {
        const data = await this.deleteItemAsync({
          missId: id
        });
        if (data.code == 200) {
          this.$message("删除成功");
          this.byTypeAsync(); //按类型查询
        } else {
          this.$message("删除失败");
        }
      }
    },
    //清空
    async emptyBtn() {
      const data = await this.emptyItemAsync();
      if (data.code == 200) {
        this.$message("清空成功");
        this.byTypeAsync(); //按类型查询
      } else {
        this.$message("清空失败");
      }
    },
    // 导出设备
    async outData() {
      const arr = [];
      for (let i = 0; i < this.valData.length; i++) {
        arr.push(this.valData[i].missId);
      }
      // (arr);
      this.middddds.missIds = arr;
      this.middddds.missIds = JSON.stringify(this.middddds.missIds);
      // this.missIds = JSON.stringify(this.missIds);
      // this.mids = JSON.stringify(this.mids);
      (this.middddds);
      const { data: res } = await this.$http.post(
        "missedCall/export",
        qs.stringify(this.middddds),
        { responseType: "blob" }
      );
      (res);
      // // 将数据变成a标签
      const link = document.createElement("a");
      let blob = new Blob([res], { type: "application/vnd.ms-excel" });
      link.style.display = "none";
      link.href = URL.createObjectURL(blob);
      let num = "";
      for (let i = 0; i < 10; i++) {
        num += Math.ceil(Math.random() * 10);
      }
      link.setAttribute("download", "未接来电记录_" + num + ".xlsx");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }
};
</script>

<style lang="less" >
#telephone {
  .el-card {
    margin: 10px;
    box-shadow: 0 1px 1px rgba(0, 0, 0, 0.15);
    .el-form {
      .col4 {
        float: right;
      }
    }
    .el-pagination {
      margin: 30px 0 0 20px;
    }
  }
  .findDetliatRef {
    margin-left: 20px;
  }
  .findDetliatRef {
    // margin-left: 20px;
    .el-form-item {
      display: flex;
      justify-content: flex-start;
      margin-bottom: 0px;
      // margin-left: 20px;
      .is-disabled {
        .el-input__inner {
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
        width: 90px !important;
      }
    }
    .el-divider--horizontal {
      margin: 0px;
    }
  }

  /deep/.dia-1 {
    .el-dialog__body {
      padding: 0;
      .fn {
        height: 80px;
        width: 100%;
        ul {
          margin: 0;
          padding: 0;
          width: 100%;
          height: 100%;
          list-style: none;
          background-color: #1596ff;
          li {
            // float: left;
            display: inline-block;
            height: 80px;
            width: 20%;
            vertical-align: middle;
            text-align: center;

            font-size: 14px;
            color: #1596ff;
            img {
              vertical-align: middle;
              margin-top: 5px;
            }
            p {
              margin-top: 6px;
              color: #fff;
            }
          }
        }
      }
    }
  }
  .dia-2 {
    li {
      width: 33.33333% !important;
    }
  }
}
</style>
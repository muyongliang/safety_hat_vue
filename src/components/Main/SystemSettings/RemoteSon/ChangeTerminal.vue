// 变更终端账号
<template>
  <div id="change-ter">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>变更终端账号</span>

        <el-row class="row-one">
          <el-col :span="2">
            <el-button type="primary" @click="backpush">返回</el-button>
          </el-col>
          <el-col :span="6">
            <el-breadcrumb separator-class="el-icon-arrow-right">
              <el-breadcrumb-item>系统配置</el-breadcrumb-item>
              <el-breadcrumb-item>远程控制</el-breadcrumb-item>
              <el-breadcrumb-item>变更终端账号</el-breadcrumb-item>
            </el-breadcrumb>
          </el-col>
        </el-row>
      </div>
      <span style="font-size:14px;">提示：该操作仅对当前终端账号在线时有效，如果当前终端账号不在线，操作将失败</span>
      <el-form ref="form" :model="form" label-width="120px" class="form-el">
        <el-form-item label="当前终端账号：">
          <el-row :gutter="20">
            <el-col :span="8">
              <el-input v-model="currentValue"></el-input>
            </el-col>
            <el-col :span="8">
              <el-button type="primary" @click="getNewData">查询</el-button>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item label="替换终端账号：">
          <el-row :gutter="20">
            <el-col :span="8">
              <el-input v-model="replaceValue"></el-input>
            </el-col>
            <el-col :span="8">
              <el-button type="primary" @click="getEditData">查询</el-button>
            </el-col>
          </el-row>
        </el-form-item>
      </el-form>

      <el-divider></el-divider>

      <el-button type="primary" @click="sureChange">确认变更</el-button>
    </el-card>

    <!-- 查询当前终端账号 -->
    <el-dialog title="查询终端账号" :visible.sync="getNewDialogVisible" width="60%" center>
      <!-- 主体区域 -->
      <!-- 检索区 -->
      <el-form ref="FormRef" :model="Form" label-width="70px">
        <el-row :gutter="20">
          <el-col :span="6">
            <div class="grid-content bg-purple">
              <el-form-item label="在线状态">
                <el-select v-model="onlineStatus" placeholder="全部" @change="changeOnline">
                  <el-option
                    :options="onLine"
                    v-for="item in onLine"
                    :key="item.onlineStatus"
                    :label="item.label"
                    :value="item.onlineStatus"
                  ></el-option>
                </el-select>
              </el-form-item>
            </div>
          </el-col>

          <el-col :span="6">
            <div class="grid-content bg-purple">
              <el-form-item label="账号状态">
                <el-select v-model="status" placeholder="全部" @change="accountStatus">
                  <el-option
                    :options="statusOption"
                    v-for="item in statusOption"
                    :key="item.status"
                    :label="item.label"
                    :value="item.status"
                  ></el-option>
                </el-select>
              </el-form-item>
            </div>
          </el-col>

          <el-col :span="11">
            <div class="grid-content bg-purple">
              <el-form-item label="检索">
                <el-row :gutter="0">
                  <el-col :span="8">
                    <div class="grid-content bg-purple">
                      <el-select v-model="type" placeholder>
                        <el-option
                          :options="typeOption"
                          v-for="item in typeOption"
                          :key="item.type"
                          :label="item.label"
                          :value="item.type"
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
                    <el-button type="primary" class="se-btn" @click="query">查询</el-button>
                  </el-col>
                </el-row>
              </el-form-item>
            </div>
          </el-col>
        </el-row>
      </el-form>
      <!-- tab区域 -->
      <el-table
        ref="multipleTable"
        :data="list"
        tooltip-effect="dark"
        style="width: 100%"
        @selection-change="currentChange"
        :default-sort="{prop: 'date', order: 'descending'}"
        border
      >
        <el-table-column type="selection" width="55" prop="bid"></el-table-column>
        <el-table-column prop="online_status" label="在线状态" width="120" :formatter="formateOnline"></el-table-column>
        <el-table-column prop="name" label="姓名" width="120"></el-table-column>
        <el-table-column prop="account" label="账号" show-overflow-tooltip></el-table-column>
        <el-table-column prop="tel" label="电话" show-overflow-tooltip></el-table-column>
        <el-table-column prop="workType" label="工种" show-overflow-tooltip></el-table-column>
        <el-table-column prop="number" label="绑定设备编号" sortable width="180"></el-table-column>
        <el-table-column prop="status" label="账号状态" show-overflow-tooltip :formatter="changeStatus"></el-table-column>
      </el-table>

      <el-pagination
        background
        layout="prev, pager, next"
        :total="total"
        :page-size="pageSize"
        :current-page="pageNum"
        @current-change="handleCurrentChange"
      ></el-pagination>
      <el-divider></el-divider>
      <span slot="footer" class="dialog-footer">
        <el-button @click="getNewDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="getNewDialogVisible = false;currentBtn()">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 查询替换终端账号 -->
    <el-dialog title="查询终端账号" :visible.sync="getEditDialogVisible" width="60%" center>
      <!-- 主体区域 -->
      <!-- 检索区 -->
      <el-form ref="FormRef" :model="Form" label-width="70px">
        <el-row :gutter="20">
          <el-col :span="6">
            <div class="grid-content bg-purple">
              <el-form-item label="在线状态">
                <el-select v-model="onlineStatus" placeholder="全部" @change="changeOnline">
                  <el-option
                    :options="onLine"
                    v-for="item in onLine"
                    :key="item.onlineStatus"
                    :label="item.label"
                    :value="item.onlineStatus"
                  ></el-option>
                </el-select>
              </el-form-item>
            </div>
          </el-col>

          <el-col :span="6">
            <div class="grid-content bg-purple">
              <el-form-item label="账号状态">
                <el-select v-model="status" placeholder="全部" @change="accountStatus">
                  <el-option
                    :options="statusOption"
                    v-for="item in statusOption"
                    :key="item.status"
                    :label="item.label"
                    :value="item.status"
                  ></el-option>
                </el-select>
              </el-form-item>
            </div>
          </el-col>

          <el-col :span="11">
            <div class="grid-content bg-purple">
              <el-form-item label="检索">
                <el-row :gutter="0">
                  <el-col :span="8">
                    <div class="grid-content bg-purple">
                      <el-select v-model="type" placeholder>
                        <el-option
                          :options="typeOption"
                          v-for="item in typeOption"
                          :key="item.type"
                          :label="item.label"
                          :value="item.type"
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
                    <el-button type="primary" class="se-btn" @click="query">查询</el-button>
                  </el-col>
                </el-row>
              </el-form-item>
            </div>
          </el-col>
        </el-row>
      </el-form>
      <!-- tab区域 -->
      <el-table
        ref="multipleTable"
        :data="list"
        tooltip-effect="dark"
        style="width: 100%"
        @selection-change="replaceChange"
        :default-sort="{prop: 'date', order: 'descending'}"
        border
      >
        <el-table-column type="selection" width="55" prop="bid"></el-table-column>
        <el-table-column prop="online_status" label="在线状态" width="120" :formatter="formateOnline"></el-table-column>
        <el-table-column prop="name" label="姓名" width="120"></el-table-column>
        <el-table-column prop="account" label="账号" show-overflow-tooltip></el-table-column>
        <el-table-column prop="tel" label="电话" show-overflow-tooltip></el-table-column>
        <el-table-column prop="workType" label="工种" show-overflow-tooltip></el-table-column>
        <el-table-column prop="number" label="绑定设备编号" sortable width="180"></el-table-column>
        <el-table-column prop="status" label="账号状态" show-overflow-tooltip :formatter="changeStatus"></el-table-column>
      </el-table>

      <el-pagination
        background
        layout="prev, pager, next"
        :total="total"
        :page-size="pageSize"
        :current-page="pageNum"
        @current-change="handleCurrentChange"
      ></el-pagination>
      <el-divider></el-divider>
      <span slot="footer" class="dialog-footer">
        <el-button @click="getEditDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="getEditDialogVisible = false;replaceBtn()">确 定</el-button>
      </span>
    </el-dialog>
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
      // 查询当前账号绑定数据
      Form: {
        // 查询页数及显示条数
        pageSize: "10",
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
        valueData: ""
      },
      // 查询当前终端账号弹框
      getNewDialogVisible: false,
      // 查询替换终端账号弹框
      getEditDialogVisible: false,
      multipleSelection: [],
      onLine: [
        {
          onlineStatus: "",
          label: "全部"
        },
        {
          onlineStatus: 0,
          label: "离线"
        },
        {
          onlineStatus: 1,
          label: "在线"
        }
      ],
      onlineStatus: "",
      statusOption: [
        {
          status: "",
          label: "全部"
        },
        {
          status: 0,
          label: "启用"
        },
        {
          status: 1,
          label: "禁用"
        }
      ],
      status: "",
      typeOption: [
        {
          type: 0,
          label: "姓名"
        },
        {
          type: 1,
          label: "账号"
        },
        {
          type: 2,
          label: "电话"
        },
        {
          type: 3,
          label: "设备编码"
        }
      ],
      type: "",
      content: "",
      currentValue: "",
      replaceValue: ""
    };
  },
  mounted() {
    this.getTerFormAsync();
  },
  computed: {
    ...mapState(["pageNum", "pageSize", "list", "total"])
  },
  methods: {
    ...mapActions([
      "getTerFormAsync",
      "getStatusFormAsync",
      "getTypeFormAsync",
      "changeAccountAsync"
    ]),
    // 点击当前终端账号查询
    getNewData() {
      this.getNewDialogVisible = true;
    },
    // 点击替换终端账号查询
    getEditData() {
      this.getEditDialogVisible = true;
    },
    // 点击返回上一级页面
    backpush() {
      this.$router.push("/Remote");
    },
    //根据状态查询终端表单
    changeOnline() {
      let status = this.onlineStatus;
      this.$store.commit("remote/initOnlineStatus", status);
      this.getTerFormAsync();
    },
    //分页
    handleCurrentChange(val) {
      this.$store.commit("remote/changePage", val);
      this.getTerFormAsync();
      this.getStatusFormAsync();
    },
    //改状态
    formateOnline(row, column) {
      switch (row.online_status) {
        case 0:
          return "离线";
          break;
        case 1:
          return "在线";
          break;
      }
    },
    changeStatus(row, column) {
      switch (row.status) {
        case 1:
          return "启用";
          break;
        case 0:
          return "禁用";
          break;
      }
    },
    //根据状态查询
    accountStatus() {
      let status = this.status;      
      this.$store.commit("remote/initStatus", status);
      this.getStatusFormAsync();
      // this.status = "";
    },
    //根据类型查询
    query() {
      let type = this.type;
      let content = this.content;
      this.$store.commit("remote/initType", type);
      this.$store.commit("remote/initContent", content);
      this.getTypeFormAsync();
      this.type = "";
      this.content = "";
    },
    //变更终端账号
    currentChange(val) {
      (val);
      if (val.length==1) {
        this.currentAccount = val[0].account;
        this.currentID = val[0].clientId;
      }else if (val.length>1) {
        this.$message("只能选择一个账号，请重新选择");
        this.getTerFormAsync();
      }
    },
    currentBtn() {
      this.currentValue = this.currentAccount;
      this.getTerFormAsync();
    },
    replaceChange(val) {
      if (val.length==1 && val[0].number==null) {
        this.replaceAccount = val[0].account;
        this.replaceID = val[0].clientId;
      }else if (val.length>1) {
        this.$message("只能选择一个账号，请重新选择");
        this.getTerFormAsync();
      }else if (val[0].number !=null) {        
        this.$message("该账号已绑定设备，请重新选择");
        this.getTerFormAsync();
      }
    },
    replaceBtn() {
      this.replaceValue = this.replaceAccount;
      this.getTerFormAsync();
    },
    async sureChange() {
      let currentID = this.currentID;
      let replaceID = this.replaceID;      
      const data = await this.changeAccountAsync({
        beforeClientId: currentID,
        afterClientId: replaceID
      });      
      if (data.code==200) {
       this.$message("变更成功");
     }else {
       this.$message("变更失败，请检查终端账号状态或联系管理员");
     }
    }
  }
};
</script>
<style lang="less">
#change-ter {
  .el-card {
    margin: 10px;
    .row-one {
      margin-top: 20px;
    }
    .el-breadcrumb {
      line-height: 40px;
      height: 40px;
    }
    .form-el {
      margin-top: 20px;
    }
  }
  .el-pagination {
    margin-top: 20px;
  }
}
</style>
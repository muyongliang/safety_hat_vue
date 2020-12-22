// 对讲记录
<template>
  <div id="talk">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>对讲记录</span>
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item>记录管理</el-breadcrumb-item>
          <el-breadcrumb-item>对讲记录</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <!-- 内容主题 -->
      <!-- 检索按钮区 -->

      <el-form ref="FormRef" :model="Form" label-width="100px">
        <el-row :gutter="20">
          <el-col :span="6">
            <el-form-item label="项目：">
              <el-select v-model="Form.pid" placeholder="全部" @change="changeList">
                <el-option
                  v-for="(item, index) of proData"
                  :key="index"
                  :label="item.projectName"
                  :value="item.pid"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="对讲组：">
              <el-select
                v-model="Form.groupId"
                placeholder="全部"
                @change="changeGruopList"
                :disabled="disabledT"
              >
                <!-- <el-option label="默认组" value="shanghai"></el-option>
                <el-option label="施工组" value="beijing"></el-option>-->
                <el-option
                  v-for="item of groupIdList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>

          <!-- <el-col :span="10">
            <el-button type="primary" @click="searchTalkBtn">查询</el-button>
          </el-col>-->

          <el-col :span="6" style>
            <el-button
              type="primary"
              @click="searchTalkBtn"
              :disabled="btnTrun"
              v-show="roleList.indexOf(77) !== -1"
            >查询全部</el-button>
            <el-button type="warning" @click="deleteAll" v-show="roleList.indexOf(78) !== -1">清空</el-button>
            <!-- <el-button type="danger" @click="deleteTalk">删除</el-button> -->
          </el-col>
        </el-row>
      </el-form>

      <!-- 表格区域 -->
      <el-table
        ref="multipleTable"
        :data="talkListDataes"
        tooltip-effect="dark"
        style="width: 100%"
        @selection-change="handleSelectionChange"
        :default-sort="{prop: 'date', order: 'descending'}"
        border
      >
        <el-table-column type="selection" width="100"></el-table-column>
        <el-table-column prop="projectName" label="项目名称"></el-table-column>
        <el-table-column prop="groupName" label="对讲组名称"></el-table-column>
        <el-table-column prop="countNum" label="记录数" show-overflow-tooltip></el-table-column>
        <el-table-column prop="recordTime" label="最新记录时间" sortable></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              type="primary"
              size="mini"
              @click="getNewPush(scope.row)"
              v-show="roleList.indexOf(80) !== -1"
            >查看</el-button>
            <el-button
              type="danger"
              size="mini"
              @click="deleteTalk(scope.row)"
              v-show="roleList.indexOf(79) !== -1"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <!-- <el-pagination
        :page-size="Form.limit"
        layout="prev, pager, next"
        :total="total"
        @current-change="currentChange"
      ></el-pagination>-->

      <el-pagination
        @current-change="currentChange"
        :current-page="Form.page"
        :page-size="Form.limit"
        layout="total,prev, pager, next"
        :total="total"
      ></el-pagination>
    </el-card>
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
        page: 1,
        groupId: "",
        pid: ""
      },
      total: 0,
      proData: [], //项目名称及id
      // talkList: [], //表单数据
      // 查看对话框绑定数据
      viewMode: {
        mode: "",
        name: ""
      },
      // 搜索时间
      value1: "",
      // 多选表格存储数据，以[{},{}]形式存储
      multipleSelection: [],
      // 语音查看对话框
      VoiceDialogVisible: false,
      // 文字查看对话框
      TextDialogVisible: false,
      groupIdList: [],
      talkListDataes: [], //表格绑定数据
      btnTrun: true,
      disabledT: true,
      deleteDs: {},
      par: { ids: 0 },
      roleList: []
    };
  },
  computed: {
    ...mapState(["talkList", "pid", "groupIdList", "detailList"]),
  },
  mounted() {
    // this.searchTalk();
    // this.searchPid();
  },
  created() {
    // // 查询对讲组
    // this.GruopListData();
    // 查寻项目名称
    this.getProName();
    this.changeList();
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

    ...mapActions([
      "getTalkListAsync",
      "getPidAsync",
      "getIdTalkListAsync",
      "getGroupIdAsync",
      "deleteTalkAsync",
      "detailAsync"
    ]),
    // 查询项目名称
    async getProName() {
      const { data: res } = await this.$http.get("project/findByStatus");
      ("对讲记录项目名称", res);
      let all = {
        pid: null,
        projectName: "全部"
      };
      let NEWarr = res.data.concat(all);
      this.proData = NEWarr;
      this.Form.pid = NEWarr[0].pid
    },
    // 监听多选框选中值，以[{},{}]形式存储
    handleSelectionChange(val) {
      this.multipleSelection = val;
      (this.multipleSelection);
    },
    // 跳转到对讲明细页面
    async getNewPush(row) {
      ("记录id", row);
      // this.Form.groupId = row.groupId;
      this.$router.push({
        path: "/TalkSon",
        query: { id: row.pid, groupId: row.groupId }
      });
      // await this.getIdTalkListAsync(row.pid);
      await this.getIdTalkListAsync(row.id);
    },
    // 查询对讲记录
    async searchTalk() {
      // let data = await this.getTalkListAsync(this.Form);
      // ("查询数据", this.talkList);
      // this.total = this.talkList.total;
      // this.Form.limit = this.talkList.pageSize;
      // this.Form.page = this.talkList.pageNum;
    },
    // 查询全部按钮事件
    async searchTalkBtn() {
      // this.Form.pid = null;
      this.Form.projectId = null;
      // this.Form.groupId = null;
      this.Form.page = 1;
      // let allData = {
      //   limit: 5,
      //   page: 1
      // };
      // ("提交数据", this.Form);
      const { data: res } = await this.$http.get("talkBackRecord/list", {
        params: this.Form
      });
      // (res);
      if (res.code !== 200) {
        this.$message(res.message);
        return;
      }

      this.talkListDataes = res.data.list;
      this.total = res.data.total;
      // this.Form.limit = this.talkList.pageSize;
      // this.Form.page = this.talkList.pageNum;
    },
    async searchPid() {
      // let parmas = {
      //   status: 1
      // };
      // let data = await this.getPidAsync(parmas);
    },
    // 选择项目，获取项目下的对讲组
    async changeList() {
      // ("项目id", this.Form.pid);
      // let data = await this.getGroupIdAsync(this.Form.pid);
      // this.searchTalk();
      // this.getTalkZun();
      // this.Form.pid = null;
      // this.Form.projectId = null;
      // this.Form.groupId = null;
      this.Form.page = 1;
      this.Form.groupId = null;
      ("查询数据", this.Form);

      const { data: res } = await this.$http.get("talkBackRecord/list", {
        params: this.Form
      });
      ("选择项目查找该项目下记录res", res);
      if (res.code !== 200) {
        this.$message(res.message);
        return;
      }

      this.talkListDataes = res.data.list;
      this.total = res.data.total;
      this.btnTrun = false;
      this.disabledT = false;
      // 查询对讲组
      this.GruopListData();
    },
    // 获取对讲组,选择项目后获取对讲组
    async getTalkZun() {
      // // ("4546", this.Form);
      // this.Form.projectId = this.Form.pid;
      // this.Form.pageSize = this.Form.limit;
      // this.Form.pageNum = this.Form.page;
      // const { data: res } = await this.$http.get("talkBack/findTalkBack", {
      //   params: this.Form
      // });
      // // ("对讲组", res);
      // const arr = [];
      // for (let i = 0; i < res.data.list.length; i++) {
      //   arr.push({
      //     id: res.data.list[i].id,
      //     name: res.data.list[i].name
      //   });
      // }
      // this.groupIdList = arr;
    },
    // 查寻对讲组
    async GruopListData() {
      let pid = { projectId: this.Form.pid };
      ("projectId", pid);
      this.Form.page = 1;
      const { data: res } = await this.$http.get("talkBack/findTalkBackList", {
        params: pid
      });
      ("查询对讲组", res);
      if (res.code !== 200) {
        this.$message(res.message);
        return;
      }

      this.groupIdList = res.data;
    },
    // 选择对讲组
    async changeGruopList() {
      this.Form.page = 1;
      ("对讲组id", this.Form);
      // const {data:res} = await this.$http.get('talkBack/findTalkBackList')
      // ('查询对讲组',res);
      // ("根据项目id和对讲组id 查询对讲记录", res);
      const { data: res } = await this.$http.get("talkBackRecord/list", {
        params: this.Form
      });
      ("选择对讲组查记录", res);
      if (res.code !== 200) {
        this.$message(res.message);
        return;
      }

      this.talkListDataes = res.data.list;
      this.total = res.data.total;
    },
    // 删除对讲组
    async deleteTalk(row) {
      ("删除信息", row);
      this.deleteDs = {
        groupId: row.groupId,
        pid: row.pid
      };
      ("删除数据", this.deleteDs);

      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          const { data: res } = await this.$http.post(
            "talkBackRecord/deleteByGroupIdAndPid",
            qs.stringify(this.deleteDs)
          );
          ("删除返回", res);

          if (res.code !== 200) {
            return this.$message.error(res.message);
          }
          this.$message({
            type: "success",
            message: "删除成功!"
          });
          this.searchTalkBtn();
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });

      // this.par.ids = row.id;
      // (this.par);
      // const { data: res } = await this.$http.post(
      //   "talkBackRecord/deleteByGroupIdAndPid",
      //   qs.stringify(this.deleteDs)
      // );
      // ("删除返回", res);

      // if (res.code !== 200) {
      //   return this.$message.error("删除失败");
      // }
      // this.$message({
      //   type: "success",
      //   message: "删除成功!"
      // });
      // this.searchTalkBtn();
    },
    // 清空对讲组
    deleteAll() {
      this.$confirm("确认清空？清空后不可恢复, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          // this.deleteAllAsync();
          this.Form.pid = null;
          this.Form.projectId = null;
          this.Form.limit = 1000000;
          ("清空数据", this.Form);

          const { data: res } = await this.$http.get("talkBackRecord/list", {
            params: this.Form
          });
          ("所有消息", res);

          let delDate = res.data.list;
          let arr = [];
          for (let i = 0; i < delDate.length; i++) {
            arr.push({
              pid: delDate[i].pid,
              groupId: delDate[i].groupId
            });
          }
          // arr = arr.join(",");
          // arr = arr.toString();
          ("删除数据集合", arr);
          for (let i = 0; i < arr.length; i++) {
            let par = arr[i];
            ("par", par);

            const { data: ress } = await this.$http.post(
              "talkBackRecord/deleteByGroupIdAndPid",
              qs.stringify(par)
            );
            // ("清空数据res", res);
          }
          // this.par.ids = arr;
          // this.par.ids = item;
          // ("清空所有数据", this.par);
          // ("清空所有数据", this.par);
          // const { data: ress } = await this.$http.post(
          //   "talkBackRecord/deleteByGroupIdAndPid",
          //   qs.stringify(this.par)
          // );
          // ("清空数据res", res);
          // if (ress.code !== 200) {
          //   return this.$message.error("清空失败");
          // }
          this.$message({
            type: "success",
            message: "清空成功!"
          });
          this.searchTalkBtn();
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消清空"
          });
        });
    },
    // 当前页
    async currentChange(val) {
      this.Form.page = val;
      // (this.Form);
      // this.searchTalk();
      // this.searchTalkBtn();
      // this.Form.pid = null;
      // this.Form.projectId = null;
      // this.Form.groupId = null;
      // let allData = {
      //   limit: 5,
      //   page: 1
      // };
      // allData.page = val;

      // ("提交数据", this.Form);
      const { data: res } = await this.$http.get("talkBackRecord/list", {
        params: this.Form
      });
      ("分页查询res", res);
      if (res.code !== 200) {
        this.$message(res.message);
        return;
      }

      this.talkListDataes = res.data.list;
      this.total = res.data.total;
    }
  }
};
</script>

<style lang="less">
#talk {
  .el-breadcrumb {
    margin-top: 30px;
  }
  .el-pagination {
    margin-top: 20px;
  }
}
</style>

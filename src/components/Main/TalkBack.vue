// 对讲组页面
<template>
  <div id="talk">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>对讲组</span>
      </div>
      <!-- 功能框 -->
      <el-form ref="formRef" :model="Pages" label-width="80px" :inline="true">
        <el-row>
          <el-col :span="6">
            <el-form-item label="检索">
              <el-input v-model="Pages.name" placeholder="输入对讲组的名字"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item>
              <el-button type="primary" @click="getTalkName" v-show="roleList.indexOf(27) !== -1">查询</el-button>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item style="float:right">
              <el-button type="primary" @click="addTalk" v-show="roleList.indexOf(28) !== -1">添加对讲组</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <!-- 下半表格区 -->

      <el-table :data="TalktableData" style="width: 100%" border>
        <el-table-column>
          <template slot-scope="scope">
            <i class="success" v-if="scope.row.isActivate==1"></i>
            <i class="nonon" v-if="scope.row.isActivate==0"></i>
          </template>
        </el-table-column>
        <el-table-column prop="name" label="对讲组名称"></el-table-column>
        <el-table-column prop="memberNum" label="成员数"></el-table-column>
        <el-table-column label="对讲记录">
          <template slot-scope="scope">{{scope.row.isRecording == 0?'关':'开'}}</template>
        </el-table-column>
        <el-table-column label="操作" width="480">
          <template slot-scope="scope">
            <el-button
              type="primary"
              @click="getMember(scope.row)"
              v-show="roleList.indexOf(32) !== -1"
            >成员管理</el-button>
            <!-- <el-button
              type="primary"
              @click="getMember(scope.row)"
              v-else-if="scope.row.name.indexOf('默认') == -1 "
              v-show="roleList.indexOf(32) !== -1"
            >成员管理</el-button>-->

            <el-button
              type="success"
              @click="getEditListView(scope.row)"
              v-show="roleList.indexOf(29) !== -1"
            >编辑</el-button>
            <!-- <el-button type="danger" v-if="scope.row.isActivate == 1" style="display:none">删除</el-button> -->
            <!-- || scope.row.name.indeOf('默认') == -1    v-show="roleList.indexOf(30) !== -1"-->
            <el-button
              type="danger"
              v-if="scope.row.isActivate == 1"
              style="display:none"
              @click="getDeleteData(scope.row)"
            >删除</el-button>
            <el-button
              type="danger"
              v-else-if="scope.row.name.indexOf('默认') !== -1 "
              style="display:none"
              @click="getDeleteData(scope.row)"
            >删除</el-button>
            <el-button
              type="danger"
              v-else-if="scope.row.isActivate == 0 "
              @click="getDeleteData(scope.row)"
            >删除</el-button>

            <el-button
              type="warning"
              @click="changeSwitch(scope.row)"
              v-if="scope.row.isActivate == 1"
              disabled
              v-show="roleList.indexOf(31) !== -1"
            >切换</el-button>
            <el-button
              type="warning"
              @click="changeSwitch(scope.row)"
              v-else-if="scope.row.isActivate == 0"
              v-show="roleList.indexOf(31) !== -1"
            >切换</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页效果 -->
      <el-pagination
        @current-change="handleCurrentChange"
        :current-page="this.Pages.pageNum"
        :page-size="this.Pages.pageSize"
        layout="total, prev, pager, next"
        :total="Total"
      ></el-pagination>
    </el-card>

    <!-- 添加对讲组弹框 -->
    <el-dialog title="添加对讲组" :visible.sync="addTalkDialogVisible" width="30%" center :modal="false">
      <!-- 主体 -->
      <el-form :model="PageDataList" :rules="addrules" ref="addrulesRef" label-width="110px" class="demo-ruleForm">
        <el-form-item label="对讲组名称" prop="name">
          <el-input v-model="PageDataList.name" placeholder="限10字，不可命名为“默认分组”"></el-input>
        </el-form-item>
        <el-form-item label="对讲记录开关" prop="isRecording">
          <el-radio v-model="PageDataList.isRecording" label="0">关</el-radio>
          <el-radio v-model="PageDataList.isRecording" label="1">开</el-radio>
        </el-form-item>
      </el-form>

      <!-- 底部 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeTalkData">取 消</el-button>
        <el-button type="primary" @click="AddTalkData">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 编辑对讲组弹框 -->
    <el-dialog title="编辑对讲组" :visible.sync="editTalkDialogVisible" width="30%" center :modal="false">
      <!-- 主体 -->
      <el-form
        :model="EditDataListEs"
        :rules="editrules"
        ref="EditDataListRef"
        label-width="130px"
        class="demo-ruleForm"
      >
        <el-form-item label="对讲组名称" prop="name">
          <el-input
            v-model="EditDataListEs.name"
            placeholder="限10字，不可命名为“默认组”"
            @input="chanEvent($event)"
          ></el-input>
        </el-form-item>
        <el-form-item label="对讲记录开关">
          <!-- <el-radio v-model="EditDataListEs.isRecording" :label="0">关</el-radio>
          <el-radio v-model="EditDataListEs.isRecording" :label="1">开</el-radio>-->
          <el-radio v-model="EditDataListEs.isRecording" :label="0" @change="changbtn($event)">关</el-radio>
          <el-radio v-model="EditDataListEs.isRecording" :label="1" @change="changbtn($event)">开</el-radio>
        </el-form-item>
      </el-form>

      <!-- 底部 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="editTalkDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="getEditList">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 成员管理弹框 -->
    <el-dialog title="成员管理" :visible.sync="getMemberDialogVisible" width="33%" center :modal="false">
      <!-- 主体 -->
      <!-- 穿梭框 -->
      <span>说明：调度员必须在对讲组中</span>
      <el-transfer v-model="transRigData" :data="transferData" :titles="['未添加', '已添加']" @change="handleChange"></el-transfer>
      <!-- 底部 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="getMemberDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleChangePush">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import qs from "qs";
import { createNamespacedHelpers } from "vuex";
const { mapState, mapActions } = createNamespacedHelpers("talk");
export default {
  data() {
    return {
      // 调用成员管理穿梭框数据
      // memberdata: generateData(),
      value: [1, 4],
      // 已添加成员数据
      memberData: [],
      // 未添加成员数据
      memberValue: [],
      //Transfer 的数据源	array[{ key, label, disabled }]
      transferData: [],
      // 左边未添加数据
      transferDataON: [],
      // 右边数据栏,里面装的是由id组成数组，纯数字
      transRigData: [],
      // 检索表单数据
      TalkForm: {
        name: "",
      },
      // 查询对讲组信息数据
      Pages: {
        name: "",
        isRecording: "", //是否记录对讲{1:开;0：关}
        pageSize: 5,
        pageNum: 1,
        groupId: "", //切换激活状态参数
        projectId: "",
      },
      PageDataList: {
        name: "",
        isRecording: "",
      },
      // 编辑框绑定数据
      EditDataList: {
        // name: "",
        groupId: "",
        // isRecording: ""
      },
      EditDataListEs: {},
      editrules: {
        name: [
          {
            required: true,
            message: "限10字，不可命名为“默认组",
            trigger: "blur",
          },
          {
            min: 3,
            max: 20,
            message: "长度在 3 到 10 个字符",
            trigger: "blur",
          },
        ],
      },

      // 删除绑定数据
      DELETEId: {},
      groupId: "0",
      // 显示总条数
      Total: 0,
      // tab表格绑定渲染数据
      TalktableData: [
        //  {id: 12
        // isActivate: 0
        // isRecording: 1
        // memberNum: 0
        // name: "测试主键12"
        // userName: null}
      ],
      // 添加对讲组数据
      addruleForm: {
        name: "",
      },
      // 添加对讲组数据验证规则
      addrules: {
        name: [
          {
            required: true,
            message: "限10字，不可命名为“默认组",
            trigger: "blur",
          },
          {
            min: 3,
            max: 20,
            message: "长度在 3 到 10 个字符",
            trigger: "blur",
          },
        ],
        isRecording: [
          {
            required: true,
            message: "必须选择开关",
            trigger: "blur",
          },
          { min: 1, max: 20, message: "", trigger: "blur" },
        ],
      },
      // 添加对讲组弹框显示
      addTalkDialogVisible: false,
      // 单选框默认开关
      radio: "1",
      // 成员管理弹框显示
      getMemberDialogVisible: false,
      editTalkDialogVisible: false,
      // members: [],
      mem: [],
      // 成员管理上传数据
      pushData: {
        groupId: "",
        params: {
          members: [],
        },
      },
      // 成员管理数据
      pushData_members: [],
      roleList: [],
    };
  },
  created() {
    this.getTableList();
    this.getRoleBtnData();
    window.addEventListener("onTalkBack2", this.onChangeSwitch);
  },
  mounted(){

  },
  methods: {
    ...mapActions(["getGroupIdAsync"]),
    // 功能权限
    async getRoleBtnData() {
      let dataR = {
        parentId: 5,
        userName: null,
      };
      const { data: res } = await this.$http.get("menu/getButtonMenus", {
        params: dataR,
      });

      let arr = [];
      res.data.forEach((item) => {
        arr.push(item.mid);
      });
      this.roleList = arr;
      //  v-show="roleList.indexOf(35) !== -1"
    },

    // 通讯录显示第几页
    handleCurrentChange(val) {
      // 改变默认的页数
      this.Pages.pageNum = val;
      this.getTableList();
    },

    // 成员管理事件
    // 成员管理弹框控制
    // 已添加成员数据获取
    async getMember(row) {
      if (row.name.indexOf("默认") !== -1) {
        return this.$message("此分组禁止成员管理");
      }
      this.EditDataList.groupId = row.id;
      // // 已添加成员
      const { data: res } = await this.$http.get(
        "talkBack/findTalkBackMemBer",
        {
          params: this.EditDataList,
        }
      );
      this.memberData = res.data;
      const { data: ress } = await this.$http.get(
        "talkBack/findNotInTalkBackMemBer",
        {
          params: this.EditDataList,
        }
      );
      this.memberValue = ress.data;

      // 将所有数据合并，并处理成穿梭框组件需要的格式
      const transMEMData = this.memberData.concat(this.memberValue);
      // 将数组中是调度员的人id单独取出
      const arrWorkName = [];
      for (let i = 0; i < transMEMData.length; i++) {
        if (transMEMData[i].workName == "调度员") {
          arrWorkName.push(transMEMData[i].id);
        }
      }
      // ("是调度员的id", arrWorkName);

      // (transMEMData);
      const arr = [];
      for (let i = 0; i < transMEMData.length; i++) {
        arr.push({
          key: transMEMData[i].id,
          label: transMEMData[i].fullName,
          name: transMEMData[i].workName,
          // disabled: arrWorkName.filter(item => {
          //   return item == transMEMData[i].id;
          // })
          disabled: transMEMData[i].workName == "调度员",
        });
      }
      this.transferData = arr; //将所有处理好的总数据赋值出去

      // // 将已添加数据处理好放出来
      const arrOk = [];
      for (let i = 0; i < this.memberData.length; i++) {
        arrOk.push(this.memberData[i].id);
      }
      this.transRigData = arrOk;
      // 将查询到的已添加数据与查到的调度员数据进行合并去重，保证调度员全在
      // let a = []; let  b=[];
      this.transRigData.map((v, index) => {
        if (v !== "") {
          let idx = arrWorkName.indexOf(v);
          if (idx > -1) {
            arrWorkName.splice(idx, 1);
          }
        }
      });
      const a = this.transRigData.concat(arrWorkName);
      this.transRigData = a;
      this.pushData_members = a;
      this.getMemberDialogVisible = true;
    },

    // 穿梭框切换数据事件
    handleChange(value, direction, movedKeys) {
      this.pushData.params.members = value;
    },

    // 上传更改事件
    async handleChangePush() {
      this.pushData.groupId = this.EditDataList.groupId;
      // if (this.pushData.params == '{"members":[]}') {
      if (this.pushData.params.members == this.pushData_members) {
        this.$message("没有更改成员");
        this.getMemberDialogVisible = false;
        this.getTableList();
        return;
      }
      this.pushData.params = JSON.stringify(this.pushData.params); //按照格式要求将在这个key值装换成json字符串
      const { data: res } = await this.$http.post(
        "talkBack/updateMember",
        qs.stringify(this.pushData)
      );
      // (res);
      if (res.code !== 200) return this.$message.error("更改成员名单失败");
      this.$message.success("更改成员名单成功");
      this.getMemberDialogVisible = false;
      this.pushData.params = JSON.parse(this.pushData.params);
      // this.pushData.params.members = [];
      this.getTableList();
    },
    // 成员管理事件end

    // 添加对讲组弹框
    addTalk() {
      this.addTalkDialogVisible = true;
    },
    // 查询对蒋祖获取表单数据并渲染
    async getTableList() {
      let pid = sessionStorage.ProjectId;
      this.Pages.projectId = pid;
      const { data: res } = await this.$http.get("talkBack/findTalkBack", {
        params: this.Pages,
      });
      this.Total = res.data.total;
      this.TalktableData = res.data.list;
    },
    // 对讲组名称查询
    async getTalkName() {
      // 进行判断，如果为空就重新获取所用信息
      if (this.Pages.name == "") {
        return this.getTableList();
      }
      this.Pages.name = this.Pages.name.trim();
      const { data: res } = await this.$http.post(
        "talkBack/findTalkBackByName",
        qs.stringify(this.Pages)
      );
      // (res);

      this.Total = res.data.total;
      this.TalktableData = res.data.list;
      // this.getTableList();
    },
    // 添加对讲组事件
    async AddTalkData() {
      // this.$refs.addrulesRef.validate(async valid => {
      //   if (!valid) return;
      if (this.PageDataList.name == "") {
        return this.$message("请输入对讲组名称");
      }
      if (this.PageDataList.name.indexOf("默认") != -1) {
        return this.$message("请更换对讲组名称");
      }
      // this.PageDataList.isRecording = this.PageDataList.isRecording * 1;

      const { data: res } = await this.$http.post("talkBack/addTalkBack",
        qs.stringify(this.PageDataList)
      );
      if (res.code !== 200) {
        return this.$message.error("添加失败");
      }
      if (res.code == 200) {
        this.$message.success("添加数据成功");
        this.addTalkDialogVisible = false;
        this.$refs.addrulesRef.resetFields();

        if (localStorage.getItem("ProjectIdtalkback")) {
          var id = localStorage.getItem("ProjectIdtalkback");
          let pid = {
            pageSize: 999,
            pageNum: 1,
            projectId: id,
          };
          this.getGroupIdAsync({params: pid})
        }

        // this.PageDataList.isRecording = "";
        this.getTableList();
      }
    },
    closeTalkData() {
      this.PageDataList.name = "";
      this.PageDataList.isRecording = "";
      this.addTalkDialogVisible = false;
    },
    // 切换激活状态开关事件
    async changeSwitch(row) {
      this.Pages.groupId = row.id;
      const { data: res } = await this.$http.get(
        "talkBack/switchActivateStatus",
        {
          params: this.Pages,
        }
      );
      if (res.code !== 200) return this.$message.error("切换状态失败");
      this.$message.success("切换状态成功");
      await this.getTableList();

      // 触发对讲组件的下拉框默认显示的对讲组
      window.dispatchEvent(
        new CustomEvent("sendTalkBack", {
          detail: {
            name: row.name,
            gid: row.id,
          },
        })
      );
      // this.getRoleBtnData();
    },
    // 切换激活状态开关事件
    async onChangeSwitch(e) {
      this.Pages.groupId = e.detail.gid;
      // const { data: res } = await this.$http.get(
      //   "talkBack/switchActivateStatus",
      //   {
      //     params: this.Pages
      //   }
      // );
      // if (res.code !== 200) return this.$message.error("切换状态失败");
      // this.$message.success("切换状态成功");
      this.getTableList();
      // this.getRoleBtnData();
    },
    // 删除事件，
    async getDeleteData(row) {
      if (this.roleList.indexOf(30) !== -1) {
        return this.$message("您没有删除功能权限");
      }
      this.DELETEId.groupId = row.id;
      const confirmResult = await this.$confirm(
        "此操作将永久删除该对讲组, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      ).catch((err) => err);
      if (confirmResult !== "confirm") {
        return this.$message.info("已取消删除");
      }
      const { data: res } = await this.$http.get("talkBack/deleteTalkBack", {
        params: this.DELETEId,
      });
      if (res.code !== 200) return this.$message.error("删除失败");
      this.$message.success("删除数据成功");
      this.getTableList();
    },
    chanEvent(e) {
      this.$forceUpdate();
    },
    changbtn() {
      this.$forceUpdate();
    },
    //编辑事件
    getEditListView(row) {
      this.EditDataListEs.name = row.name;
      this.EditDataListEs.groupId = row.id;
      this.EditDataListEs.isRecording = row.isRecording;
      this.editTalkDialogVisible = true;
      (this.EditDataListEs);
    },
    async getEditList() {

      const { data: res } = await this.$http.post(
        "talkBack/updateTalkBack",
        qs.stringify(this.EditDataListEs)
      );

      if (res.code !== 200) {
        return this.$message.error(res.message);
      }
      this.$message.success("编辑成功");
      this.editTalkDialogVisible = false;
      this.getTableList();
    },
    //编辑事件end
  },
};
</script>

<style lang="less" scoped>
#talk {
  margin: 8px;
  .el-pagination {
    margin-top: 30px;
  }
  .success {
    display: inline-block;
    height: 20px;
    width: 20px;
    border-radius: 50%;
    background-color: green;
  }
  .nonon {
    display: inline-block;
    height: 20px;
    width: 20px;
    border-radius: 50%;
    background-color: red;
  }
}
</style>

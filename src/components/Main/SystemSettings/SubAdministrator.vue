// 子管理员配置页面
<template>
  <div id="sunadmin">
    <!-- 主体列表 -->
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>子管理员配置</span>
        <!-- 面包屑导航 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item>系统配置</el-breadcrumb-item>
          <el-breadcrumb-item>子管理员配置</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <!-- 列表内容主体区 -->
      <!-- 状态选择框 ref表单验证规则-->
      <el-form ref="findDataRef" :model="findData" label-width="100px">
        <el-row>
          <el-col :span="6">
            <el-form-item label="账号状态">
              <el-select v-model="findData.state" placeholder @change="SubManagerStatus">
                <el-option label="全部" value></el-option>
                <el-option label="启用" value="1"></el-option>
                <el-option label="禁用" value="0"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="14">
            <el-form-item label="检索">
              <el-row>
                <el-col :span="4">
                  <el-select v-model="findData.region" placeholder>
                    <el-option label="账号" value="0"></el-option>
                    <el-option label="姓名" value="1"></el-option>
                    <el-option label="电话" value="2"></el-option>
                  </el-select>
                </el-col>
                <el-col :span="8">
                  <el-input v-model="findData.data"></el-input>
                </el-col>
                <el-col :span="4">
                  <el-button
                    type="primary"
                    @click="sunSelectByCondition"
                    style="margin-left:10px;"
                    v-show="roleList.indexOf(102) !== -1"
                  >查询</el-button>
                </el-col>
              </el-row>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-button type="primary" @click="addSub" v-show="roleList.indexOf(104) !== -1">添加子管理员</el-button>
          </el-col>
        </el-row>
      </el-form>

      <!-- 数据列表栏 -->
      <el-table :data="sunTableData" border>
        <el-table-column prop="username" label="账号"></el-table-column>
        <el-table-column prop="name" label="姓名"></el-table-column>
        <el-table-column prop="mobile" label="电话"></el-table-column>
        <el-table-column label="角色">
          <!-- <span >1</span> -->
          <!-- {{this.sunTableData.arr[1].name}} -->
          <template slot-scope="scope">
            <!-- <span
              v-if="scope.row.bid == this.sunTableData.arr[index].bid"
            ></span>-->
            {{scope.row.roleList.name}}
          </template>
        </el-table-column>
        <el-table-column label="账号状态">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.status == 1">启用</el-tag>
            <el-tag v-if="scope.row.status == 0" type="danger">禁用</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="500px">
          <template slot-scope="scope">
            <el-button
              type="primary"
              size="mini"
              @click="detailed(scope.row.bid)"
              v-show="roleList.indexOf(103) !== -1"
            >查看</el-button>
            <el-button
              type="success"
              size="mini"
              @click="editsun(scope.row)"
              v-show="roleList.indexOf(105) !== -1"
            >编辑</el-button>
            <el-button
              type="danger"
              size="mini"
              @click="ResetPassword(scope.row)"
              v-show="roleList.indexOf(106) !== -1"
            >重置密码</el-button>
            <el-button
              type="warning"
              size="mini"
              v-if="scope.row.status == 0"
              @click="editStatus(scope.row)"
              v-show="roleList.indexOf(107) !== -1"
            >启用</el-button>
            <el-button
              type="danger"
              size="mini"
              v-if="scope.row.status == 1"
              @click="editStatus(scope.row)"
              v-show="roleList.indexOf(107) !== -1"
            >禁用</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页符 -->
      <el-pagination
        @current-change="sunhandleCurrentChange"
        :current-page="findData.pageNum"
        :page-size="findData.pageSize"
        layout="total, prev, pager, next"
        :total="total"
      ></el-pagination>
    </el-card>
    <!-- 卡片主体完成 -->
    <!-- 添加子管理员对话框 -->
    <el-dialog title="添加子管理员" :visible.sync="addDialogVisible" width="40%" destroy-on-close>
      <!-- 内容主体 -->
      <div class="add-main">
        <el-form
          :model="addRuleForm"
          :rules="addRules"
          ref="addRuleFormRef"
          label-width="100px"
          class="demo-ruleForm"
        >
          <el-form-item label="账号：" prop="username">
            <el-col :gutter="5">
              <el-col :span="5">
                <div class="grid-content bg-purple">{{username}}_</div>
              </el-col>
              <el-col :span="19">
                <div class="grid-content bg-purple">
                  <el-input
                    v-model="addRuleForm.username"
                    placeholder="3-10位数字、字母、字符"
                    @input="inppwd"
                  ></el-input>
                </div>
              </el-col>
            </el-col>
          </el-form-item>

          <el-form-item label="密码：">
            <!-- <span class="sx">sxlc_</span> -->

            <el-input placeholder="初始密码与账号相同" v-model="addRuleForm.pwd" show-password></el-input>
          </el-form-item>

          <el-form-item label="姓名：" prop="name">
            <!-- <span class="sx">sxlc_</span> -->
            <el-input v-model="addRuleForm.name" placeholder="限20字"></el-input>
          </el-form-item>

          <el-form-item label="电话：" prop="mobile">
            <el-input v-model="addRuleForm.mobile"></el-input>
          </el-form-item>

          <el-form-item label="绑定角色：">
            <template>
              <el-transfer
                v-model="transferValue"
                :data="AllTransferdata"
                :titles="['未选择', '已选择']"
                @change="addTransferChange"
              ></el-transfer>
            </template>
          </el-form-item>
        </el-form>
      </div>
      <!-- 底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addSubDataclose">取 消</el-button>
        <el-button type="primary" @click="addSubData">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 查看详情页面对话框 -->
    <el-dialog title="子管理员明细" :visible.sync="LookDialogVisible" width="30%">
      <!-- 内容主体 -->
      <div class="details">
        <!-- <div label="企业信息" name="first" class="first">
          <div>
            <i>账号：</i>
            <span>sxic_001</span>
          </div>
          <div>
            <i>姓名：</i>
            <span>张三</span>
          </div>
          <div>
            <i>电话：</i>
            <span>12345678678</span>
          </div>
          <div>
            <i>绑定角色：</i>
            <span>角色名称</span>
            <span>角色名称</span>
            <span>角色名称</span>
            <span>。。。</span>
          </div>
          <br />
          <div>
            <i>创建人：</i>
            <span>admin</span>
          </div>
          <div>
            <i>创建时间：</i>
            <span>2019-12-12</span>
          </div>
          <div>
            <i>更新人：</i>
            <span>admin002</span>
          </div>
          <div>
            <i>更新时间：</i>
            <span>yyyy-mm-dd hh:mm</span>
          </div>
        </div>-->
        <el-form ref="ByIdDataref" :model="ByIdData" label-width="100px">
          <el-form-item label="账号：">
            <el-input v-model="ByIdData.username" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="姓名：">
            <el-input v-model="ByIdData.name" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="电话：">
            <el-input v-model="ByIdData.mobile" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="绑定角色：">
            <el-input v-model="ByIdData.viewNm" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="创建人：">
            <el-input v-model="ByIdData.name" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="创建时间：">
            <el-input v-model="ByIdData.name" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="更新人：">
            <el-input v-model="ByIdData.name" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="更新时间：">
            <el-input v-model="ByIdData.name" :disabled="true"></el-input>
          </el-form-item>
        </el-form>
      </div>
    </el-dialog>

    <!-- 编辑子管理员对话框 -->
    <el-dialog title="编辑子管理员" :visible.sync="editDialogVisible" width="40%">
      <!-- 内容主体 -->
      <div class="add-main">
        <el-form
          :model="editRuleForm"
          :rules="addRules"
          ref="editRuleFormRef"
          label-width="100px"
          class="demo-ruleForm"
        >
          <el-form-item label="账号：" prop="name">
            <div class="grid-content bg-purple">
              <el-input v-model="editRuleForm.username" placeholder="3-10位数字、字母、字符"></el-input>
            </div>
          </el-form-item>

          <el-form-item label="密码：">
            <!-- <span class="sx">sxlc_</span> -->
            初始密码与账号相同
          </el-form-item>

          <el-form-item label="姓名：" prop="phone">
            <!-- <span class="sx">sxlc_</span> -->
            <el-input v-model="editRuleForm.name" placeholder="限20字"></el-input>
          </el-form-item>

          <el-form-item label="电话：" prop="mobile">
            <el-input v-model="editRuleForm.mobile"></el-input>
          </el-form-item>

          <el-form-item label="绑定角色：">
            <template>
              <el-transfer
                v-model="editTransferValue"
                :data="AllTransferdata"
                :titles="['未选择', '已选择']"
                @change="editTransferChange"
              ></el-transfer>
            </template>
          </el-form-item>
        </el-form>
      </div>
      <!-- 底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="editSubDataCLOse">取 消</el-button>
        <el-button type="primary" @click="editSubData">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import qs from "qs";
import { log } from 'util';
export default {
  inject: ["reload"],
  data() {
    // 添加管理员，绑定角色数据
    return {
      // 加载页面获取数据上传数据
      findData: {
        state: "", //状态
        pageNum: 1,
        pageSize: 5,
        region: "",
        username: "",
        name: "",
        mobile: "",
        data: ""
      },

      total: 0, //总条数
      BBid: {
        bid: ""
      }, // 查看详情的用户id数据
      ByIdData: {},
      editStatusData: {
        bid: "",
        status: ""
      }, //改变状态上传数据
      options: [
        {
          value: "选项1",
          label: "全部"
        },
        {
          value: "选项2",
          label: "启用"
        },
        {
          value: "选项3",
          label: "禁用"
        }
      ],
      value: "",
      optionsTwo: [
        {
          value: "选项1",
          label: "账号"
        },
        {
          value: "选项2",
          label: "姓名"
        },
        {
          value: "选项3",
          label: "电话"
        }
      ],
      // 表格绑定数据
      sunTableData: [],
      // 添加子管理员对话框显示与隐藏
      addDialogVisible: false,
      // 查看详情页面对话框
      LookDialogVisible: false,
      // 添加管理员数据对象
      addRuleForm: {
        name: "", //子管理员账号
        username: "", //姓名
        mobile: "",
        roles: {
          role: []
        } //{"role":[1,3]}角色id 列表
      },
      sunTableDataTwo: [], //穿梭框专用数据
      AllTransferdata: [],
      // 添加管理员，绑定角色数据
      transferValue: [],

      ruleForm: {
        phone: ""
      },
      // 验证规则
      addRules: {
        name: [
          { required: true, message: "账号", trigger: "blur" },
          { min: 2, max: 15, message: "长度在 3 到 10 个字符", trigger: "blur" }
        ],
        username: [
          { required: true, message: "输入姓名", trigger: "blur" },
          { min: 3, max: 20, message: "长度20个字符", trigger: "blur" }
        ],
        mobile: [
          { required: true, message: "输入电话", trigger: "blur" },
          { min: 10, max: 11, message: "长度11个数字", trigger: "blur" }
        ]
      },
      editDialogVisible: false,
      editRuleForm: {},
      editRuleFormData: {
        username:'',
        name:'',
        mobile:'',
        bid:'',
        bid:'',
        bid:'',
        roles: {
          role: []
        }
      },
      editTransferValue: [], //编辑显示已经有的角色
      username: "",
      roleList: []
    };
  },
  created() {
    this.getSubManager();
    this.getRoleBtnData();
  },
  methods: {
    // 功能权限
    async getRoleBtnData() {
      let dataR = {
        parentId: 19,
        userName: null
      };
      const { data: res } = await this.$http.get("menu/getButtonMenus", {
        params: dataR
      });
      let arr = [];
      res.data.forEach(item => {
        arr.push(item.mid);
      });
      this.roleList = arr;
      //  v-show="roleList.indexOf(35) !== -1"
    },

    // 加载页面获取数据
    async getSubManager() {
      const { data: res } = await this.$http.get(
        "subManager/handleSelectByState",
        {
          params: this.findData
        }
      );
      ('获取列表数据',res);
      this.sunTableData = res.data.subManager.list;
      this.sunTableDataTwo = res.data.subManager.list;
      this.total = res.data.subManager.total;
      this.findData.pageSize = res.data.subManager.pageSize;
      this.findData.pageNum = res.data.subManager.pageNum;
      const arr = [];
      var roleNames = "";
      var bbid = "";
      for (let i = 0; i < this.sunTableData.length; i++) {
        for (let j = 0; j < this.sunTableData[i].roleList.length; j++) {
          roleNames += this.sunTableData[i].roleList[j].roleName + "/";
          // bbid = this.sunTableData[i].roleList[j].bid;
        }
        arr.push({
          name: roleNames
          // bid: this.sunTableData[i].bid
        });
        roleNames = "";
        // bbid = "";
        this.sunTableData[i].roleList = arr[i];
        // this.sunTableData[i].roleList = JSON.stringify(
        //   this.sunTableData[i].roleList
        // );
      }
    },
    // 通过状态查询子账号
    async SubManagerStatus() {
      this.findData.region = "";
      this.findData.data = "";
      this.getSubManager();
    },
    // 检索查询
    async sunSelectByCondition() {
      if (this.findData.data == "") {
        return this.$message("请选择查询条件与输入查询内容");
      }
      if (this.findData.region == 0) {
        this.findData.username = this.findData.data;
        this.findData.name = "";
        this.findData.mobile = "";
      } else if (this.findData.region == 1) {
        this.findData.name = this.findData.data;
        this.findData.username = "";
        this.findData.mobile = "";
      } else if (this.findData.region == 2) {
        this.findData.mobile = this.findData.data;
        this.findData.name = "";
        this.findData.username = "";
      }
      const { data: res } = await this.$http.get(
        "subManager/handleSelectByCondition",
        {
          params: this.findData
        }
      );
      this.sunTableData = res.data.subManager.list;
      const arr = [];
      let roleNames = "";
      let bbid = "";
      for (let i = 0; i < this.sunTableData.length; i++) {
        for (let j = 0; j < this.sunTableData[i].roleList.length; j++) {
          roleNames += this.sunTableData[i].roleList[j].roleName + "/";
          // bbid = this.sunTableData[i].roleList[j].bid;
        }
        arr.push({
          name: roleNames
          // bid: this.sunTableData[i].bid
        });
        roleNames = "";
        // bbid = "";
        this.sunTableData[i].roleList = arr[i];
      }
    },
    // 分页方法，监听页数变化
    sunhandleCurrentChange(val) {
      // if (this.findData.state !== "") {
      //   this.findData.state = "";
      // }
      this.findData.pageNum = val;
      this.getSubManager();
    },
    // 点击查看明细
    async detailed(id) {
      this.BBid.bid = id;

      const { data: res } = await this.$http.get(
        "subManager/handleSelectById",
        { params: this.BBid }
      );
      // (res);

      this.ByIdData = res.data.subManager[0];
      var viewNm = "";
      for (let i = 0; i < this.ByIdData.roleList.length; i++) {
        // viewNm += this.ByIdData.roleList[i].roleName;
        viewNm += this.ByIdData.roleList[i].roleName + "/";
      }
      this.ByIdData.viewNm = viewNm;
      this.LookDialogVisible = true;
    },
    // 改变状态
    async editStatus(row) {
      // 0禁用 1启用
      this.editStatusData.bid = row.bid;
      if (row.status == 0) {
        this.editStatusData.status = 1;
      } else if (row.status == 1) {
        this.editStatusData.status = 0;
      }
      const { data: res } = await this.$http.get(
        "subManager/handleUpdateStatus",
        {
          params: this.editStatusData
        }
      );
      if (res.code !== 200) return this.$message.error("更改状态失败");
      this.$message.success("更改状态成功");
      this.getSubManager();
    },
    // 重置密码操作
    async ResetPassword(row) {
      this.id.bid = row.subId;
      const { data: res } = await this.$http.get("subManager/handleResetPwd", {
        params: this.id
      });
      if (res.code !== 200) return this.$message.error("重置密码失败");
      this.$message.success("重置密码成功");
    },
    // 点击添加子管理员
    async addSub() {
      this.addDialogVisible = true;
      const arr = [];
      // 获取到所有角色信息
      const { data: res } = await this.$http.get(
        "subManager/handleSelectAllRole"
      );
      for (let i = 0; i < res.data.length; i++) {
        arr.push({
          key: res.data[i].role_id,
          label: res.data[i].role_name
        });
      }
      this.AllTransferdata = arr;
      this.username = sessionStorage.UserName;
      ("用户名", this.username);

      // this.addSubd();
    },
    async addSubd() {},
    inppwd() {
      this.addRuleForm.pwd = this.username + "_" + this.addRuleForm.username;
    },
    // 添加穿梭栏处理数据
    addTransferChange(value, direction, movedKeys) {
      this.addRuleForm.roles.role = [];
      if (value.length == 0) {
        this.addRuleForm.roles = {};
      }
      this.addRuleForm.roles.role = value;
    },
    // 确定添加管理员
    async addSubData() {
      if (this.addRuleForm.username.indexOf(this.username + "_") !== -1) {
        this.addRuleForm.username = this.addRuleForm.username;
      } else if (this.addRuleForm.username.indexOf(this.username + "_") == -1) {
        this.addRuleForm.username =
          this.username + "_" + this.addRuleForm.username;
      }
      this.addRuleForm.roles = JSON.stringify(this.addRuleForm.roles);
      const { data: res } = await this.$http.post(
        "subManager/handleAddSubManager",
        qs.stringify(this.addRuleForm)
      );
      if (res.code !== 200) {
        this.$message.error(res.message);
        this.transferValue = [];
        this.editRuleFormData.roles = {};
        this.transferValue = [];
        // this.addDialogVisible = false;
        return;
      }
      this.$message.success("添加子管理员成功");
      // this.$refs.addRuleFormRef.resetFields();
      this.addRuleForm.pwd = "";
      this.transferValue = [];
      this.editRuleFormData.roles = {};
      this.addDialogVisible = false;
      this.getSubManager();
    },
    // 关闭添加框
    addSubDataclose() {
      this.addRuleForm.username = "";
      this.addRuleForm.pwd = "";
      this.addRuleForm.name = "";
      this.addRuleForm.mobile = "";
      this.editRuleFormData.roles = {};
      this.transferValue = [];
      // this.addRuleForm.roles = [];
      this.addDialogVisible = false;
      // this.reload();
    },
    // 点击编辑按钮
    async editsun(row) {
      this.editDialogVisible = true;
      // 获取数据

      this.BBid.bid = row.bid;
      const { data: res } = await this.$http.get(
        "subManager/handleSelectById",
        { params: this.BBid }
      );
      this.editRuleForm = res.data.subManager[0];


      // 获取所有角色信息数据
      const arr = [];
      // 获取到所有角色信息
      const { data: ress } = await this.$http.get(
        "subManager/handleSelectAllRole"
      );

      for (let i = 0; i < ress.data.length; i++) {
        arr.push({
          key: ress.data[i].role_id,
          label: ress.data[i].role_name
        });
      }
      this.AllTransferdata = arr;
      //将用户已经拥有的数据处理出来
      const arrOne = [];
      for (let i = 0; i < this.editRuleForm.roleList.length; i++) {
        arrOne.push(this.editRuleForm.roleList[i].roleId);
      }


      // 用总数据将已添加数据去除·
      this.editTransferValue = arrOne;
      // 对已选择数据进行操作
    },
    // 修改角色名称
    editTransferChange(value, direction, movedKeys) {
      this.editRuleFormData.roles.role = value;
    },
    // 编辑数据确定
    async editSubData() {
      this.editRuleFormData.username = this.editRuleForm.username;
      this.editRuleFormData.name = this.editRuleForm.name;
      this.editRuleFormData.mobile = this.editRuleForm.mobile;
      this.editRuleFormData.bid = this.editRuleForm.bid;
      this.editRuleFormData.roles = JSON.stringify(this.editRuleFormData.roles);
      ('编辑上传数据',this.editRuleFormData);
      const { data: res } = await this.$http.post(
        "subManager/handleEditSubManager",
        qs.stringify(this.editRuleFormData)
      );
      if (res.code !== 200) {
        this.$message.error(res.message);
        return;
      }
      ('编辑res',res);
      this.$message.success("编辑数据成功");
      this.editDialogVisible = false;
      this.editRuleFormData.username = "";
      this.editRuleFormData.name = "";
      this.editRuleFormData.mobile = "";
      this.editRuleFormData.bid = "";
      this.editRuleFormData.roles = {role: []};
      this.editTransferValue = [];
      this.AllTransferdata = [];
      this.getSubManager();
    },
    editSubDataCLOse() {
      this.editDialogVisible = false;
      this.editRuleFormData.username = "";
      this.editRuleFormData.name = "";
      this.editRuleFormData.mobile = "";
      this.editRuleFormData.bid = "";
      this.editRuleFormData.roles = {};
      this.editTransferValue = [];
      this.AllTransferdata = [];
    }
  }
};
</script>

<style lang="less" scoped>
#sunadmin {
  .box-card {
    margin-top: 8px;
    margin-left: 5px;
    box-shadow: 0 1px 1px rgba(0, 0, 0, 0.15);
    .clearfix {
      .el-breadcrumb {
        margin-top: 20px;
      }
    }
    .el-pagination {
      margin-top: 20px;
    }
    .el-table {
      margin-top: 20px;
    }
  }
  // 对话框样式
  .add-main {
    .el-form-item {
      // text-align: left !important;
      span {
        margin-left: 5px;
      }
    }
  }
  .details .first {
    width: 100%;
    height: 500px;
    overflow-y: auto;
  }
  .first div {
    margin-bottom: 20px;
    font-size: 14px;
  }
  .first div:nth-child(4) {
    span {
      float: right;
      display: block;
    }
  }
  .first i {
    font-style: normal;
    display: inline-block;
    width: 200px;
    margin-right: 40px;
  }
}
</style>
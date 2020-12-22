// 设备管理
<template>
  <div class="man">
    <!-- card卡片区 -->
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>设备管理</span>
      </div>
      <!-- 检索按钮区 -->
      <div>
        <el-form ref="InputStateFormRef" :model="InputStateForm" label-width="100px">
          <el-row>
            <el-col :span="4">
              <div class="grid-content bg-purple">
                <el-form-item label="设备状态">
                  <el-select v-model="InputStateForm.status" placeholder="全部" @change="findStatus">
                    <el-option label="全部" value="2"></el-option>
                    <el-option label="空闲中" value="0"></el-option>
                    <el-option label="使用中" value="1"></el-option>
                  </el-select>
                </el-form-item>
              </div>
            </el-col>

            <el-col :span="4">
              <div class="grid-content bg-purple">
                <el-form-item label="设备型号">
                  <el-select v-model="TYPE.type" placeholder @change="findType">
                    <el-option
                      v-for="item in mentData"
                      :key="item.id"
                      :label="item.type"
                      :value="item.id"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </div>
            </el-col>

            <el-col :span="7">
              <el-form-item label="活动时间">
                <el-date-picker
                  v-model="InputStateForm.valueData"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  type="daterange"
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  @change="findTime"
                ></el-date-picker>
              </el-form-item>
            </el-col>

            <el-col :span="7">
              <div class="grid-content bg-purple">
                <el-form-item label="检索">
                  <el-row :gutter="0">
                    <el-col :span="8">
                      <div class="grid-content bg-purple">
                        <el-select v-model="InputStateForm.type" placeholder>
                          <el-option label="设备编号" value="0"></el-option>
                          <el-option label="设备IMEI" value="1"></el-option>
                          <el-option label="使用终端账号" value="2"></el-option>
                          <el-option label="使用终端姓名" value="3"></el-option>
                        </el-select>
                      </div>
                    </el-col>
                    <el-col :span="14">
                      <div class="grid-content bg-purple">
                        <el-input v-model="InputStateForm.param" placeholder="请输入内容"></el-input>
                      </div>
                    </el-col>
                    <el-col :span="2">
                      <el-button
                        type="primary"
                        class="se-btn"
                        @click="findBy"
                        v-show="roleList.indexOf(42) !== -1"
                      >查询</el-button>
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
          <el-button type="primary" @click="fondAlldata" v-show="roleList.indexOf(42) !== -1">查询全部</el-button>
          <el-button type="primary" @click="ImportText" v-show="roleList.indexOf(43) !== -1">导入</el-button>
          <el-button type="success" @click="exportData" v-show="roleList.indexOf(44) !== -1">导出</el-button>
          <!-- <el-button type="danger" @click="DeleData">删除</el-button> -->
          <el-button type="primary" @click="addDD" v-show="roleList.indexOf(46) !== -1">添加设备</el-button>
        </el-row>
      </div>

      <!-- 数据表单区 -->
      <el-table
        :data="tableData"
        border
        ref="multipleTable"
        tooltip-effect="dark"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column prop="number" label="设备编号"></el-table-column>
        <el-table-column prop="type" label="设备型号"></el-table-column>
        <el-table-column prop="imei" label="设备IMEI"></el-table-column>
        <el-table-column prop="account" label="使用终端账号"></el-table-column>
        <el-table-column prop="name" label="使用终端姓名"></el-table-column>
        <el-table-column prop="recordTime" label="录入时间" :formatter="dateFormat"></el-table-column>
        <el-table-column label="设备状态">
          <template slot-scope="scope">
            <span type="success" v-if="scope.row.status == 0">空闲中</span>
            <span type="danger" v-else-if="scope.row.status == 1">使用中</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="350">
          <template slot-scope="scope">
            <el-button
              type="primary"
              size="mini"
              @click="ViewDevice(scope.row)"
              v-show="roleList.indexOf(48) !== -1"
            >查看</el-button>
            <el-button
              type="warning"
              size="mini"
              @click="editTabData(scope.row)"
              v-show="roleList.indexOf(47) !== -1"
            >编辑</el-button>
            <el-button
              type="danger"
              size="mini"
              @click="DeleData(scope.row)"
              v-show="roleList.indexOf(45) !== -1"
            >删除</el-button>
            <!-- <svg-icon iconClass="test" class="icons"></svg-icon> -->
            <svg-icon icon-class="test" class="icons"></svg-icon>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页栏 -->
      <el-pagination
        @current-change="handleCurrentChange"
        :current-page="tabGetFormData.pageNum"
        :page-size="tabGetFormData.pageSize"
        layout="total, prev, pager, next"
        :total="total"
      ></el-pagination>
    </el-card>

    <!-- 添加设备对话框 -->
    <div>
      <el-dialog title="添加设备" :visible.sync="addDialogVisible" width="35%" center :modal="false">
        <!-- 主体 -->
        <el-form
          :model="addruleForm"
          :rules="addruleFormRules"
          ref="addruleFormRef"
          label-width="120px"
          class="demo-ruleForm"
        >
          <el-form-item label="设备编号" prop="deviceNum">
            <el-input v-model="addruleForm.deviceNum" placeholder="限制20个字符" @blur="getDeviceNum"></el-input>
          </el-form-item>

          <el-form-item label="设备型号" prop="type">
            <el-select v-model="addruleForm.type" style="width:100%" placeholder>
              <el-option
                v-for="item in mentData"
                :key="item.id"
                :label="item.type"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="设备IMEI" prop="IMEI">
            <el-input v-model="addruleForm.IMEI" placeholder="限15~17位字符"></el-input>
          </el-form-item>
          <el-form-item label>
            <el-input v-model="addMessage" placeholder="提示信息" :disabled="true"></el-input>
          </el-form-item>
        </el-form>
        <!-- 底部 -->
        <span slot="footer" class="dialog-footer">
          <el-button @click="addDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addGetform">确 定</el-button>
        </span>
      </el-dialog>
    </div>

    <!-- 编辑设备对话框 -->
    <div>
      <el-dialog title="编辑设备" :visible.sync="editDialogVisible" width="35%" center :modal="false">
        <!-- 主体 -->
        <el-form
          :model="editruleForm"
          :rules="editRuleFormRules"
          ref="editruleFormRef"
          label-width="120px"
          class="demo-ruleForm"
        >
          <el-form-item label="设备编号" prop="deviceNum">
            <el-input v-model="editruleForm.deviceNum" placeholder="限制20个字符"></el-input>
          </el-form-item>

          <el-form-item label="设备型号" prop="type">
            <el-select
              v-model="editruleForm.type"
              style="width:100%"
              placeholder
              @change="changTypeId"
            >
              <el-option
                v-for="item in mentData"
                :key="item.id"
                :label="item.type"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="设备IMEI" prop="IMEI">
            <el-input v-model="editruleForm.IMEI" placeholder="限15~17位字符"></el-input>
          </el-form-item>
        </el-form>
        <!-- 底部 -->
        <span slot="footer" class="dialog-footer">
          <el-button @click="editDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="editGetformList">确 定</el-button>
        </span>
      </el-dialog>
    </div>

    <!-- 导入设备列表 -->
    <el-dialog title="导入设备列表" :visible.sync="importDialogVisible" width="412px" center>
      <!-- 头部 -->

      <!-- 上传框 -->
      <el-upload
        class="upload-demo"
        drag
        :action="GetUpLoad"
        multiple
        :with-credentials="true"
        :on-success="upSuccess"
      >
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">
          将文件拖到此处，或
          <em>点击上传</em>
        </div>
        <div class="el-upload__tip" slot="tip">
          1、须采用提供的模版进行填写并上传，全部数据格式正确成功上传
          <br />2、设备编号不可重复
          <br />3、大小不超过50M
          <br />
          <a :href="DownUpLoad">点击下载导入【设备模板】</a>
        </div>
      </el-upload>

      <!-- 底部 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="importDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="iVisible">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 查看设备弹框 -->
    <el-dialog title="查看设备" :visible.sync="viewDialogVisible" width="30%" :modal="false">
      <!-- 主体信息区 -->

      <el-form ref="ViewDeviceDataRef" :model="ViewDeviceDataForm" label-width="80px">
        <el-form-item label="设备编号">
          <el-input v-model="ViewDeviceDataForm.number" readonly></el-input>
        </el-form-item>
        <el-form-item label="设备型号">
          <el-input v-model="ViewDeviceDataForm.type" readonly>
            <!-- {{type == 0? 'T1':'T2' }} -->
          </el-input>
          <!-- <el-select v-model="ViewDeviceDataForm.type" placeholder=" ">
            <el-option label="T1" value="0"></el-option>
            <el-option label="T2" value="1"></el-option>
          </el-select>-->
        </el-form-item>
        <el-form-item label="设备IMEI">
          <el-input v-model="ViewDeviceDataForm.imei" readonly></el-input>
        </el-form-item>
        <el-form-item label="录入人">
          <el-input v-model="ViewDeviceDataForm.recordPerson" readonly></el-input>
        </el-form-item>
        <el-form-item label="录入时间">
          <el-input v-model="ViewDeviceDataForm.recordTime" readonly></el-input>
        </el-form-item>
        <el-form-item label="更新人">
          <el-input v-model="ViewDeviceDataForm.updatePerson" readonly></el-input>
        </el-form-item>
        <el-form-item label="更新时间">
          <el-input v-model="ViewDeviceDataForm.updateTime" readonly></el-input>
        </el-form-item>
      </el-form>
    </el-dialog>

    <!-- 删除弹框 -->
    <el-dialog title="是否删除" :visible.sync="DeleDialogVisible" width="30%" :modal="false">
      <span>是否要删除这段数据</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="DeleDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="OkDeleteData">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import qs from "qs";
import moment from "moment";
export default {
  data() {
    return {
      // 检索按钮区绑定数据
      InputStateForm: {
        // 查询页数及显示条数
        pageSize: 5,
        pageNum: 1,
        // 开始时间
        beginTime: "",
        // 结束时间
        endTime: "",
        // 传递设备状态
        status: "",
        // 设备类型
        type: "", //也是条件检索数据
        param: "",
        // 日期设置
        valueData: ""
      },
      // 检索数据单独
      InputType: {},
      // 根据设备类型查询数据
      TYPE: {
        type: ""
      },
      // 功能框检索栏数据
      FindData: {
        // 查询条件输入内容
        param: "",
        // 检索条件类型
        type: ""
      },

      // 日期传递对象
      getDataForm: {},

      // tab栏获取数据提交数据栏
      tabGetFormData: {
        // 每页显示条数
        pageSize: 5,
        // 当前页
        pageNum: 1
      },
      // tab表绑定数据
      tableData: [],
      // 分页栏总页数
      total: 0,
      // 添加设备对话框
      addDialogVisible: false,
      // 导入设备对话框
      importDialogVisible: false,
      // 查看设备弹框
      viewDialogVisible: false,
      // 添加设备对话框添加绑定数据
      addruleForm: {
        // 设备编号
        deviceNum: "",
        // 设备型号
        type: "",
        IMEI: ""
      },
      // 添加设备对话框表单验证规则
      addruleFormRules: {
        deviceNum: [
          { required: true, message: "限制20个字符", trigger: "blur" },
          { min: 2, max: 20, message: "限制20个字符", trigger: "blur" }
        ],
        account: [
          { required: true, message: "限制20个字符", trigger: "blur" },
          { min: 2, max: 20, message: "限制20个字符", trigger: "blur" }
        ],
        type: [
          { required: true, message: "请选择设备型号", trigger: "change" }
        ],
        IMEI: [
          { required: true, message: "限15~17位字符", trigger: "blur" },
          { min: 15, max: 17, message: "IMEI号需为15~17位", trigger: "blur" }
        ]
      },
      // 编辑设备对话框
      editDialogVisible: false,
      // 编辑设备对话框绑定数据
      editruleForm: {
        // 设备id
        deviceId: "",
        // 设备编号
        deviceNum: "",
        // 设备型号
        type: "",
        IMEI: ""
        // tid: ""
      },
      // 编辑设备对话框表单验证规则
      editRuleFormRules: {
        deviceNum: [
          { required: true, message: "限制20个字符", trigger: "blur" },
          { min: 2, max: 20, message: "限制20个字符", trigger: "blur" }
        ],
        type: [
          { required: true, message: "请选择设备型号", trigger: "change" }
        ],
        IMEI: [
          { required: true, message: "限15~17位字符", trigger: "blur" },
          { min: 15, max: 17, message: "IMEI号需为15~17位", trigger: "blur" }
        ]
      },
      // 查看数据传递id
      ViewDeviceData: {
        deviceId: ""
      },
      // 获取查看数据
      ViewDeviceDataForm: {},
      // tab选择框保存数据
      multipleSelection: [],
      // DeleteIdInfo: {},
      // 删除表单需要传递id
      DeleteId: {
        // 设备id
        deviceId: ""
      },
      // 导出表格使用数据
      didds: {
        dids: []
      },
      DeleDialogVisible: false,
      Test: {
        status: 1
      },
      GetUpLoad: this.$src + "device/handleImportDeviceList",
      DownUpLoad: this.$src + "device/downLoadDemo",
      // 获取设备型号
      mentData: [],
      mentValue: "",
      // 添加查重提示信息
      addMessage: "",
      roleList: []
    };
  },
  created() {
    this.tabGetForm();
    this.getRoleBtnData();
  },
  methods: {
    // 功能权限
    async getRoleBtnData() {
      let dataR = {
        parentId: 8,
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
    },

    iVisible() {
      this.importDialogVisible = false;
      this.tabGetForm();
    },
    // 编写日期格式化方法
    dateFormat: function(row, column) {
      // (row, column);
      const date = row[column.property];
      if (date === undefined) {
        return "";
      }
      // # 这里的格式根据需求修改
      return moment(date).format("YYYY-MM-DD HH:mm:ss");
    },
    // 获取表单数据，并渲染到页面上
    async tabGetForm() {
      const { data: res } = await this.$http.get("device/findDevices", {
        params: this.tabGetFormData
      });
      ("获取设备管理数据", res);
      this.tableData = res.data.list;
      this.total = res.data.total;
      this.getMentData();
    },
    // 清空所有查找数据，重新获取页面
    fondAlldata() {
      this.InputStateForm.beginTime = "";
      this.InputStateForm.endTime = "";
      this.InputStateForm.status = "";
      this.InputStateForm.type = "";
      this.InputStateForm.valueData = "";
      this.InputStateForm.param = "";
      this.TYPE.type = "";
      this.tabGetFormData.pageNum = 1;

      this.tabGetForm();
    },
    // 处理时间

    onSubmit() {
      ("submit!");
    },
    // 点击显示添加设备对话框按钮
    addDD() {
      this.addDialogVisible = true;
    },
    // 点击确认添加添加设备表单预验证，清空(未添加)
    addGetform() {
      // 表单预验证
      this.$refs.addruleFormRef.validate(async valid => {
        if (!valid) return;
        const { data: res } = await this.$http.post(
          "device/addDeviceInfo",
          qs.stringify(this.addruleForm)
        );
        // 清空表单
        if (res.code !== 200)
          return this.$message.error(res.message);
        this.$message.success("添加数据成功");
        this.tableData = res;
        this.$refs.addruleFormRef.resetFields();
        this.addDialogVisible = false;
        this.tabGetForm();
      });
    },
    // 验证是否有重复设备编号
    async getDeviceNum() {
      let a = this.addruleForm.deviceNum;
      let b = { number: a };
      const { data: res } = await this.$http.get("device/checkDeviceNum", {
        params: b
      });
      if (res.data == false) {
        this.addMessage = "设备编号重复，请更换成未使用的编号";
        return this.$message.error("设备编号重复，请更换成未使用的编号");
      }
      this.$message.success("该设备编号未重复，可以使用");
      this.addMessage = "该设备编号未重复，可以使用";
    },
    // 点击弹出编辑对话框
    editTabData(scope) {
      this.editDialogVisible = true;
      // ("打印的当前行数据");
      // (scope);
      this.editruleForm.deviceId = scope.did; //设备id  16
      this.editruleForm.deviceNum = scope.number; //设备编号
      this.editruleForm.type = scope.type; //设备型号"T1"
      this.editruleForm.IMEI = scope.imei;
      let one = {};
      for (let i = 0; i < this.mentData.length; i++) {
        if (this.editruleForm.type == this.mentData[i].type) {
          one.id = this.mentData[i].id;
        }
      }
      this.editruleForm.tid = one.id;

      // (this.editruleForm);
    },
    // 编辑设备信号状态框
    changTypeId(val) {
      this.editruleForm.tid = val;
    },
    // 点击上传编辑数据，并重新获取页面数据
    async editGetformList() {
      this.editruleForm.type = this.editruleForm.tid;
      const { data: res } = await this.$http.post(
        "device/editDeviceInfo",
        qs.stringify(this.editruleForm)
      );
      if (res.code !== 200) {
        this.$message.error(res.message + ",更改无效");
        this.editDialogVisible = false;
        this.tabGetForm();
        return;
      }
      this.$message.success("编辑成功");
      this.editDialogVisible = false;
      this.tabGetForm();
    },
    // 导入文件列表
    ImportText() {
      this.importDialogVisible = true;
    },
    // 查看设备按钮
    async ViewDevice(scope) {
      this.viewDialogVisible = true;
      this.ViewDeviceData.deviceId = scope.did;
      const { data: res } = await this.$http.get("device/findDetailById", {
        params: this.ViewDeviceData
      });
      this.ViewDeviceDataForm = res.data;
      if ((this.ViewDeviceDataForm.type = 1)) {
        return (this.ViewDeviceDataForm.type = "T1");
      } else {
        return (this.ViewDeviceDataForm.type = "T2");
      }
      this.tabGetForm();
    },
    // 表单选择更改时，会触发这个
    handleSelectionChange(val) {
      // val是个整个选中的数组，如果选中多个就是【{}，{}】数组包含对象
      this.multipleSelection = val;
      //clearSelection：用于多选表格，清空用户的选择
      //此时所有的checkbox处于未勾选，当用户第一次点击的时候，selectio为一个数组，里面存放的为当前这一行的数据
      // this.$refs.multipleTable.clearSelection();
      //此时selection仍然有值 ，只是勾选状态不显示了。
      // if (selection.length === 0) {
      //   return;
      // }
      //这这里将这行的状态又变为了勾选
      // this.$refs.multipleTable.toggleRowSelection(row, true);
      //用于多选表格，切换某一行的选中状态，如果使用了第二个参数，则是设置这一行选中与否（selected 为 true 则选中）
      // (selection, row);
      // this.DeleteId.deviceId = row.did;
      // (this.DeleteId);
    },
    // 显示删除对话框
    DeleData(row) {
      this.DeleteId.deviceId = row.did;
      this.DeleDialogVisible = true;
    },
    // 点击删除按钮删除一条数据
    async OkDeleteData() {
      // (this.DeleteId);
      const { data: res } = await this.$http.get("device/deleteDevice", {
        params: this.DeleteId
      });
      if (res.code !== 200) return this.$message.error("删除失败");
      this.$message.success("删除成功");
      // 将数据清空
      this.DeleDialogVisible = false;
      // 重新获取
      this.tabGetForm();
    },
    // 选择根据状态查询
    async findStatus() {
      if (this.InputStateForm.status == 2) {
        this.InputStateForm.status = null;
        this.InputStateForm.beginTime = "";
        this.InputStateForm.endTime = "";
        this.InputStateForm.type = "";
        this.InputStateForm.param = "";
        this.InputStateForm.valueData = "";
        this.TYPE.type = "";
      }
      // (this.InputStateForm.status);
      this.InputStateForm.beginTime = "";
      this.InputStateForm.endTime = "";
      this.InputStateForm.type = "";
      this.InputStateForm.param = "";
      this.InputStateForm.valueData = "";
      this.TYPE.type = "";
      const { data: res } = await this.$http.get("device/findDevicesByStatus", {
        params: this.InputStateForm
      });
      this.tableData = res.data.list;
      this.total = res.data.total;
    },
    // 选择设备类型查询，后台还未处理数据
    async findType() {
      this.InputStateForm.status = null;
      this.InputStateForm.valueData = null;
      this.InputStateForm.beginTime = null;
      this.InputStateForm.endTime = null;
      this.TYPE.pageSize = this.InputStateForm.pageSize;
      this.TYPE.pageNum = this.InputStateForm.pageNum;
      ("类型查询", this.TYPE);

      const { data: res } = await this.$http.get("device/findDevicesByType", {
        params: this.TYPE
      });
      ("类型查询res", res);
      this.tableData = res.data.list;
      this.total = res.data.total;
    },
    // 选择日期查询，后台还未处理数据
    async findTime() {
      // (this.InputStateForm.valueData);
      // 先将获取到的日期数据传给要发送的位置
      this.InputStateForm.beginTime = this.InputStateForm.valueData[0];
      this.InputStateForm.endTime = this.InputStateForm.valueData[1];
      (this.InputStateForm.beginTime);
      (this.InputStateForm.endTime);
      this.TYPE.type = "";
      // this.InputStateForm.status = null;
      this.InputStateForm.type = "";
      this.InputStateForm.param = "";
      // this.InputStateForm.valueData = "";

      this.getDataForm = {
        beginTime: this.InputStateForm.beginTime,
        endTime: this.InputStateForm.endTime,
        pageSize: this.InputStateForm.pageSize,
        pageNum: this.InputStateForm.pageNum
      };
      const { data: res } = await this.$http.get("device/findDevicesByTime", {
        params: this.getDataForm
      });
      // // (res);
      this.tableData = res.data.list;
      this.total = res.data.total;
    },
    // 检索查询
    async findBy() {
      // const returnedTarget = Object.assign(this.FindData, this.tabGetFormData);
      // (returnedTarget);
      this.InputStateForm.status = "";
      this.InputStateForm.valueData = "";
      this.InputStateForm.beginTime = "";
      this.InputStateForm.endTime = "";
      this.TYPE.type = "";

      this.InputStateForm.param = this.InputStateForm.param.trim();
      const { data: res } = await this.$http.get("device/findDevicesBy", {
        params: this.InputStateForm
      });
      // (res);
      this.tableData = res.data.list;
      this.total = res.data.total;
    },
    // 分页处理函数
    handleCurrentChange(val) {
      this.tabGetFormData.pageNum = val;
      this.tabGetForm();
    },
    // 导出导入表单，导入表单成功的钩子函数
    upSuccess(response, file, fileList) {
      (response.code);
      if (response.code !== 200) return this.$message.error(response.message);
      this.$message(response.message);
    },
    // 导出表格数据
    async exportData() {
      if (this.multipleSelection.length == 0) {
        return this.$message.error("请在表单选择框中选择需要导出设备信息");
      } else {
        const arr = [];
        for (let i = 0; i < this.multipleSelection.length; i++) {
          arr.push(this.multipleSelection[i].did);
        }
        // (arr);
        this.didds.dids = arr;
        this.didds.dids = JSON.stringify(this.didds.dids);
        if (this.didds.dids == "[]") {
          this.didds.dids = "";
        }
        (this.didds);

        const {
          data: res
        } = await this.$http.post(
          "device/handleExportDeviceList",
          qs.stringify(this.didds),
          { responseType: "blob" }
        );

        const link = document.createElement("a");
        let blob = new Blob([res], { type: "application/vnd.ms-excel" });
        link.style.display = "none";
        link.href = URL.createObjectURL(blob);
        let num = "";
        for (let i = 0; i < 10; i++) {
          num += Math.ceil(Math.random() * 10);
        }
        link.setAttribute("download", "设备管理_" + num + ".xls");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    },
    // 获取设备型号
    async getMentData() {
      const { data: res } = await this.$http.get("device/getDeviceType");
      // ("设备型号", res);
      const arr = [];
      for (let i = 0; i < res.data.length; i++) {
        arr.push({
          id: res.data[i].id,
          type: res.data[i].type
        });
      }
      // (arr);
      this.mentData = arr;
      this.mentData.type = JSON.stringify(this.mentData.type);
      // (this.mentData);
    }
  }
};
</script>

<style lang="less" scoped>
.el-card {
  margin: 10px 0 10px 0;
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.15);
  .se {
    width: 150px;
  }
  .se-btn {
    margin-left: 30px;
  }
  .row-btn {
    float: right;
    margin-bottom: 20px;
  }
  .el-pagination {
    margin-top: 20px;
  }
  .el-input__inner {
    width: 426px !important;
  }
}
.el-upload {
  text-align: center;
}
.tabs {
  div {
    margin-bottom: 20px;
    font-size: 14px;
  }
  i {
    font-style: normal;
    display: inline-block;
    width: 200px;
    margin-right: 10px;
  }
  span {
    width: 200px;
    display: inline-block;
  }
}
.icons {
  width: 100px;
  height: 100px;
  color: red;
}
</style>

// 字典配置
<template>
  <div>
    <el-card class="box-card">
      <!-- 首部 -->
      <div slot="header" class="clearfix">
        <span>字典配置</span>
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item>系统配置</el-breadcrumb-item>
          <el-breadcrumb-item>字典配置</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <!-- 主体 -->
      <!-- 查询框 -->
      <div class="main-dic">
        <!-- <div class="main-left">
          <div>终端工种</div>
          <div>...</div>
          <div>...</div>
        </div>-->
        <!-- <div class="main-right"> -->
        <!-- 如需还原将下方div删掉，将上方div解开 -->
        <div>
          <el-row :gutter="20">
            <el-col :span="22">
              <span>终端工种</span>
            </el-col>
            <el-col :span="2">
              <el-button type="primary" @click="addHuman" v-show="roleList.indexOf(114) !== -1">添加</el-button>
            </el-col>
          </el-row>

          <!-- 查询表 -->
          <div class="tab">
            <el-table :data="tableListFrom" border style="width: 100%">
              <el-table-column width="100">
                <template slot-scope="scope" v-if="scope.row.status !==1">
                  <img
                    src="../../../assets/images/2029.png"
                    v-if="scope.row.orderNum !==firstData"
                    @click="downlevel(scope.row)"
                    v-show="roleList.indexOf(117) !== -1"
                    alt
                  />
                  <img
                    v-show="roleList.indexOf(117) !== -1"
                    v-if="scope.row.orderNum !==maxOrderNums"
                    src="../../../assets/images/2030.png"
                    @click="uplevel(scope.row)"
                    alt
                  />
                </template>
              </el-table-column>
              <el-table-column width label="排序">
                <template slot-scope="scope">{{scope.row.orderNum}}</template>
              </el-table-column>
              <el-table-column prop="name" label="选项名称" width></el-table-column>
              <el-table-column label="选择图标" width>
                <template slot-scope="scope">
                  <img src="../../../assets/dw/29714.png" alt v-if="scope.row.color == '#9B5718'" />
                  <img
                    src="../../../assets/dw/29716.png"
                    alt
                    v-else-if="scope.row.color == '#2DD787'"
                  />
                  <img
                    src="../../../assets/dw/29719.png"
                    alt
                    v-else-if="scope.row.color == '#011C31'"
                  />
                  <img
                    src="../../../assets/dw/29720.png"
                    alt
                    v-else-if="scope.row.color == '#1596FF'"
                  />
                  <img
                    src="../../../assets/dw/29721.png"
                    alt
                    v-else-if="scope.row.color == '#FFB142'"
                  />
                  <img
                    src="../../../assets/dw/29722.png"
                    alt
                    v-else-if="scope.row.color == '#FF3E59'"
                  />
                  <img
                    src="../../../assets/dw/29723.png"
                    alt
                    v-else-if="scope.row.color == '#009721'"
                  />
                  <img
                    src="../../../assets/dw/29724.png"
                    alt
                    v-else-if="scope.row.color == '#F8EA38'"
                  />
                  <img
                    src="../../../assets/dw/29725.png"
                    alt
                    v-else-if="scope.row.color == '#814A94'"
                  />
                  <img
                    src="../../../assets/dw/29726.png"
                    alt
                    v-else-if="scope.row.color == '#0C468E'"
                  />
                  <img
                    src="../../../assets/dw/29727.png"
                    alt
                    v-else-if="scope.row.color == '#3FE5F2'"
                  />
                  <img
                    src="../../../assets/dw/29728.png"
                    alt
                    v-else-if="scope.row.color == '#68E122'"
                  />
                  <img
                    src="../../../assets/dw/29729.png"
                    alt
                    v-else-if="scope.row.color == '#5C4DC6'"
                  />
                  <img
                    src="../../../assets/dw/29730.png"
                    alt
                    v-else-if="scope.row.color == '#D32084'"
                  />
                  <img
                    src="../../../assets/dw/29715.png"
                    alt
                    v-else-if="scope.row.color == '#C3C3C3'"
                  />
                </template>
              </el-table-column>
              <el-table-column label="状态" width>
                <template slot-scope="scope">
                  <!-- 拿到当前行内所有数据 -->
                  <!-- {{scope.row}} -->
                  <span v-if="scope.row.status ==0">已启用</span>
                  <span v-else>禁用</span>
                </template>
              </el-table-column>
              <el-table-column prop="operation" label="操作" width>
                <template slot-scope="scope">
                  <el-button
                    type="primary"
                    size="mini"
                    @click="viewDataEdit(scope.row)"
                    v-show="roleList.indexOf(115) !== -1"
                  >编辑</el-button>
                  <el-button
                    v-if="scope.row.status ==0"
                    type="danger"
                    size="mini"
                    @click="getProhibit(scope.row)"
                    v-show="roleList.indexOf(116) !== -1"
                  >禁用</el-button>
                  <el-button
                    v-else
                    size="mini"
                    type="primary"
                    @click="getEnable(scope.row)"
                    v-show="roleList.indexOf(116) !== -1"
                  >启用</el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>

          <!-- 分页标签 -->
          <div class="page">
            <el-pagination
              @current-change="handleCurrentChange"
              :current-page="this.tableListData.pageNum"
              :page-size="this.tableListData.pageSize"
              layout="total, prev, pager, next"
              :total="total"
            ></el-pagination>
          </div>
        </div>
      </div>
    </el-card>

    <!-- 禁用弹出框 -->
    <!-- <el-dialog title="提示" :visible.sync="centerDialogVisible" width="30%" center>
      <span>是否真的要禁用</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="centerDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="centerDialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>-->
    <el-dialog title="是否禁用" :visible.sync="outerVisible">
      <el-dialog width="30%" title="真的要禁用吗" :visible.sync="innerVisible" append-to-body>
        <!-- 内层 -->
        <el-button @click="innerVisible = false">取 消</el-button>
        <el-button type="primary" @click="changeStatusSub">确定禁用</el-button>
        <!-- 内层结束 -->
      </el-dialog>
      <div slot="footer" class="dialog-footer">
        <el-button @click="outerVisible = false">取 消</el-button>
        <el-button type="primary" @click="innerVisible = true">确定禁用</el-button>
      </div>
    </el-dialog>

    <!-- 启用弹出框 -->
    <el-dialog title="是否启用" :visible.sync="okOuterVisible">
      <el-dialog width="30%" title="真的要启用吗" :visible.sync="okinnerVisible" append-to-body>
        <!-- 内层 -->
        <el-button @click="okinnerVisible = false">取 消</el-button>
        <el-button type="primary" @click="changeStatusAdd">确定启用</el-button>

        <!-- 内层结束 -->
      </el-dialog>
      <div slot="footer" class="dialog-footer">
        <el-button @click="okOuterVisible = false">取 消</el-button>
        <el-button type="primary" @click="okinnerVisible = true">确定启用</el-button>
      </div>
    </el-dialog>

    <!-- 添加工种弹框 -->
    <el-dialog title="添加工种" :visible.sync="addDialogVisible" width="35%" center>
      <!-- 表单主体 -->
      <el-form ref="addFormRef" :model="addFormData" label-width="120px" :rules="rules">
        <el-form-item label="工种名称:" prop="workName">
          <el-input v-model="addFormData.workName" placeholder="限20字"></el-input>
        </el-form-item>
        <el-form-item label="状态:" prop="status">
          <el-select v-model="addFormData.status" placeholder="请选择" style="width:100%">
            <el-option label="启用" value="0"></el-option>
            <el-option label="禁用" value="1"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="显示色值:" prop="color">
          <el-row>
            <el-col :span="20">
              <el-input v-model="addFormData.color"></el-input>
            </el-col>
            <el-col :span="2">
              <!-- <el-color-picker v-model="color1" @change="ChangeColor"></el-color-picker> -->
              <el-button type="primary" size="mini" @click="btnDW">选择图标</el-button>
            </el-col>
          </el-row>
        </el-form-item>
      </el-form>
      <!-- 表单主体end -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addGetHuman">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 编辑工种弹框 -->
    <el-dialog title="编辑工种" :visible.sync="editDialogVisible" width="35%" center>
      <!-- 表单主体 -->
      <el-form ref="editFormRef" :model="editFormData" label-width="120px">
        <el-form-item label="选项名称：">
          <el-input v-model="editFormData.workName" placeholder="限20字"></el-input>
        </el-form-item>
        <el-form-item label="状态：">
          <!-- <el-select v-model="editFormData.status" placeholder="请选择活动区域" style="width:100%">
            <el-option label="启用" value="0"></el-option>
            <el-option label="禁用" value="1"></el-option>
          </el-select>-->
          <span v-if="editFormData.status == 0">启用</span>
          <span v-if="editFormData.status == 1">禁用</span>
        </el-form-item>
        <el-form-item label="显示色值：">
          <el-row>
            <el-col :span="20">
              <el-input v-model="editFormData.color"></el-input>
            </el-col>
            <el-col :span="2">
              <!-- <el-color-picker v-model="color1" @change="editChangeColor"></el-color-picker> -->
              <el-button type="primary" size="mini" @click="btnDW">选择图标</el-button>
            </el-col>
          </el-row>
        </el-form-item>
      </el-form>
      <!-- 表单主体end -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editGetHuman">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 定位图标logo -->
    <el-dialog title="定位图标" :visible.sync="dsdadialogVisible" width="30%" class="dwdialog">
      <el-select v-model="dwValue" placeholder="请选择图标" @change="dwChangeEvent">
        <!-- <el-option value="#FFB142">
          <el-row>
            <el-col :span="12">
              <img src="../../../assets/dw/29710.png" alt />
            </el-col>
            <el-col :span="6">
              <span>#FFB142</span>
            </el-col>
          </el-row>
        </el-option>-->

        <!-- <el-option value="#1596FF">
          <el-row>
            <el-col :span="12">
              <img src="../../../assets/dw/29711.png" alt />
            </el-col>
            <el-col :span="6">
              <span>#1596FF</span>
            </el-col>
          </el-row>
        </el-option>-->

        <el-option value="#9B5718">
          <el-row>
            <el-col :span="12">
              <img src="../../../assets/dw/29714.png" alt />
            </el-col>
            <el-col :span="6">
              <span>#9B5718</span>
            </el-col>
          </el-row>
        </el-option>
        <!-- #C3C3C3这个颜色设置成未在线颜色 -->
        <!-- <el-option value="#C3C3C3">
          <el-row>
            <el-col :span="12">
              <img src="../../../assets/dw/29715.png" alt />
            </el-col>
            <el-col :span="6">
              <span>#C3C3C3</span>
            </el-col>
          </el-row>
        </el-option>-->

        <el-option value="#2DD787">
          <el-row>
            <el-col :span="12">
              <img src="../../../assets/dw/29716.png" alt />
            </el-col>
            <el-col :span="6">
              <span>#2DD787</span>
            </el-col>
          </el-row>
        </el-option>

        <el-option value="#011C31">
          <el-row>
            <el-col :span="12">
              <img src="../../../assets/dw/29719.png" alt />
            </el-col>
            <el-col :span="6">
              <span>#011C31</span>
            </el-col>
          </el-row>
        </el-option>

        <el-option value="#1596FF">
          <el-row>
            <el-col :span="12">
              <img src="../../../assets/dw/29720.png" alt />
            </el-col>
            <el-col :span="6">
              <span>#1596FF</span>
            </el-col>
          </el-row>
        </el-option>

        <el-option value="#FFB142">
          <el-row>
            <el-col :span="12">
              <img src="../../../assets/dw/29721.png" alt />
            </el-col>
            <el-col :span="6">
              <span>#FFB142</span>
            </el-col>
          </el-row>
        </el-option>

        <el-option value="#FF3E59">
          <el-row>
            <el-col :span="12">
              <img src="../../../assets/dw/29722.png" alt />
            </el-col>
            <el-col :span="6">
              <span>#FF3E59</span>
            </el-col>
          </el-row>
        </el-option>

        <el-option value="#009721">
          <el-row>
            <el-col :span="12">
              <img src="../../../assets/dw/29723.png" alt />
            </el-col>
            <el-col :span="6">
              <span>#009721</span>
            </el-col>
          </el-row>
        </el-option>

        <el-option value="#F8EA38">
          <el-row>
            <el-col :span="12">
              <img src="../../../assets/dw/29724.png" alt />
            </el-col>
            <el-col :span="6">
              <span>#F8EA38</span>
            </el-col>
          </el-row>
        </el-option>

        <el-option value="#814A94">
          <el-row>
            <el-col :span="12">
              <img src="../../../assets/dw/29725.png" alt />
            </el-col>
            <el-col :span="6">
              <span>#814A94</span>
            </el-col>
          </el-row>
        </el-option>

        <el-option value="#0C468E">
          <el-row>
            <el-col :span="12">
              <img src="../../../assets/dw/29726.png" alt />
            </el-col>
            <el-col :span="6">
              <span>#0C468E</span>
            </el-col>
          </el-row>
        </el-option>

        <el-option value="#3FE5F2">
          <el-row>
            <el-col :span="12">
              <img src="../../../assets/dw/29727.png" alt />
            </el-col>
            <el-col :span="6">
              <span>#3FE5F2</span>
            </el-col>
          </el-row>
        </el-option>

        <el-option value="#68E122">
          <el-row>
            <el-col :span="12">
              <img src="../../../assets/dw/29728.png" alt />
            </el-col>
            <el-col :span="6">
              <span>#68E122</span>
            </el-col>
          </el-row>
        </el-option>

        <el-option value="#5C4DC6">
          <el-row>
            <el-col :span="12">
              <img src="../../../assets/dw/29729.png" alt />
            </el-col>
            <el-col :span="6">
              <span>#5C4DC6</span>
            </el-col>
          </el-row>
        </el-option>

        <el-option value="#D32084">
          <el-row>
            <el-col :span="12">
              <img src="../../../assets/dw/29730.png" alt />
            </el-col>
            <el-col :span="6">
              <span>#D32084</span>
            </el-col>
          </el-row>
        </el-option>
      </el-select>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dsdadialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="btnDWOk">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 模板底部 -->
  </div>
</template>

<script>
import qs from "qs";
export default {
  data() {
    return {
      // 查询表绑定数据
      tableListData: {
        // 请求时必须带的参数
        // 字典类型，0：终端工种
        zidianType: 0,
        // 每页显示数目
        pageSize: 5,
        // 当前页
        pageNum: 1
      },
      // 总页数(请求回来的数据中包含页数，将他赋值给本地数据，好直接使用)
      total: 0,
      // 保存请求回来的表单数据
      tableListFrom: [],
      tableListFromS: [],
      // 添加工种绑定数据
      addFormData: {
        zidianType: 0,
        workName: "",
        status: "",
        color: ""
      },
      // 编辑工种数据
      editFormData: {
        zid: "",
        workName: "",
        status: "",
        color: ""
      },
      // // 分页标签默认页码
      // currentPage1: 1,
      // 详情页码对框框
      ViewDialogVisible: false,
      // 权限对话框
      JurisdictionDialogVisible: false,
      // 禁用对话框
      centerDialogVisible: false,
      outerVisible: false,
      innerVisible: false,
      // 启用对话框
      okOuterVisible: false,
      okinnerVisible: false,
      addDialogVisible: false,
      editDialogVisible: false,
      // 点击禁止或者启用按钮获取到的当前数据
      scopeData: {},
      // 默认选择颜色
      color1: null,
      rules: {
        workName: [
          { required: true, message: "请输入工种名称", trigger: "blur" },
          { min: 2, max: 20, message: "长度在 2 到 20 个字符", trigger: "blur" }
        ],
        status: [
          { required: true, message: "请选择状态 ", trigger: "blur" }
          // { min: 3, max: 5, message: "长度在 3 到 5 个字符", trigger: "blur" }
        ],
        color: [
          { required: true, message: "请选择颜色", trigger: "blur" }
          // { min: 3, max: 5, message: "长度在 3 到 5 个字符", trigger: "blur" }
        ]
      },
      maxOrderNums: "",
      firstData: 0,
      roleList: [],
      dsdadialogVisible: false,
      dwValue: "",
      dwtableData: []
    };
  },
  created() {
    // 获取表单数据
    this.getTableListFrom();
    this.getBTNFD();
    this.getRoleBtnData();
  },
  methods: {
    // 分页操作
    // 每页显示条数
    // handleSizeChange(val) {
    //   // 改变每页显示的条数
    //   this.tableListData.pageSize = val;
    //   // 注意：在改变每页显示的条数时，要将页码显示到第一页
    //   this.getTableListFrom();
    // },
    // 选择定位图标
    btnDW() {
      this.dsdadialogVisible = true;
    },
    btnDWOk() {
      this.addFormData.color = this.dwValue;
      // if (this.editFormData.color == "") {
      this.editFormData.color = this.dwValue;
      // }
      this.dsdadialogVisible = false;
    },
    // 选择颜色
    dwChangeEvent() {
      ("选择图标颜色", this.dwValue);
    },
    // 功能权限
    async getRoleBtnData() {
      let dataR = {
        parentId: 22,
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
      //  v-show="roleList.indexOf(35) !== -1"
    },

    // 显示第几页
    handleCurrentChange(val) {
      // 改变默认的页数
      (val);

      this.tableListData.pageNum = val;

      this.getTableListFrom();
    },
    // 获取列表数据
    async getTableListFrom() {
      // (this.tableListData);

      const { data: res } = await this.$http.post(
        `system/zidian/getZidianInfo`,
        qs.stringify(this.tableListData)
      );
      ("字典管理res", res);
      this.total = res.data.total;
      this.tableListFrom = res.data.list;
      this.tableListFromS = res.data.list;
      this.maxOrderNums = res.data.list[0].maxOrderNum;
      // this.firstData = res.data.list[0].orderNum;
      ("启动最终项", this.maxOrderNums);
      // for (let i = 0; i < this.tableListFromS.length; i++) {
      //   if (this.tableListFromS[i].color == "#9B5718") {
      //     this.tableListFromS[i].img = "../../../assets/dw/29714.png";
      //   } else if (this.tableListFromS[i].color == "#2DD787") {
      //     this.tableListFromS[i].img = "../../../assets/dw/29716.png";
      //   } else if (this.tableListFromS[i].color == "#011C31") {
      //     this.tableListFromS[i].img = "../../../assets/dw/29719.png";
      //   } else if (this.tableListFromS[i].color == "#1596FF") {
      //     this.tableListFromS[i].img = "../../../assets/dw/29720.png";
      //   } else if (this.tableListFromS[i].color == "#FFB142") {
      //     this.tableListFromS[i].img = "../../../assets/dw/29721.png";
      //   } else if (this.tableListFromS[i].color == "#FF3E59") {
      //     this.tableListFromS[i].img = "../../../assets/dw/29722.png";
      //   } else if (this.tableListFromS[i].color == "#009721") {
      //     this.tableListFromS[i].img = "../../../assets/dw/29723.png";
      //   } else if (this.tableListFromS[i].color == "#F8EA38") {
      //     this.tableListFromS[i].img = "../../../assets/dw/29724.png";
      //   } else if (this.tableListFromS[i].color == "#814A94") {
      //     this.tableListFromS[i].img = "../../../assets/dw/29725.png";
      //   } else if (this.tableListFromS[i].color == "#0C468E") {
      //     this.tableListFromS[i].img = "../../../assets/dw/29726.png";
      //   } else if (this.tableListFromS[i].color == "#3FE5F2") {
      //     this.tableListFromS[i].img = "../../../assets/dw/29727.png";
      //   } else if (this.tableListFromS[i].color == "#68E122") {
      //     this.tableListFromS[i].img = "../../../assets/dw/29728.png";
      //   } else if (this.tableListFromS[i].color == "#5C4DC6") {
      //     this.tableListFromS[i].img = "../../../assets/dw/29729.png";
      //   } else if (this.tableListFromS[i].color == "#D32084") {
      //     this.tableListFromS[i].img = "../../../assets/dw/29730.png";
      //   } else if (this.tableListFromS[i].color == "#C3C3C3") {
      //     this.tableListFromS[i].img = "../../../assets/dw/29715.png";
      //   }
      // }
      // ("this.tableListFromS", this.tableListFromS);
    },
    async getBTNFD() {
      let tabdata = {
        zidianType: 0,
        pageSize: 100000,
        pageNum: 1
      };
      const { data: res } = await this.$http.post(
        `system/zidian/getZidianInfo`,
        qs.stringify(tabdata)
      );
      ("字典管理12", res);
      this.firstData = res.data.list[0].orderNum;
      // this.total = res.data.total;
      // this.tableListFrom = res.data.list;
      // this.maxOrderNums = res.data.list[0].maxOrderNum;
    },
    // 禁用按钮，将状态改成禁用
    getProhibit(scope) {
      this.centerDialogVisible = true;
      this.outerVisible = true;
      // (scope);
      this.scopeData = scope;
      // (this.scopeData);
    },
    // 改变状态,将启用状态变成禁用
    async changeStatusSub() {
      this.scopeData.status = 1;
      // (this.scopeData.status);
      // ("更改状态后,本地数据对象");
      // (this.scopeData);

      // 发送请求将更改后的状态数据发送上去，之后再重新获取页面数据并渲染
      const { data: res } = await this.$http.post(
        "system/zidian/updateWorkType",
        qs.stringify(this.scopeData)
      );
      if (res.code !== 200) return this.$message.error("更改状态失败");
      this.$message.success("更改状态成功");
      // this.scopeData = {};
      this.outerVisible = false;
      this.innerVisible = false;

      this.getTableListFrom();
    },
    // 点击启用，并将状态更改成启用
    getEnable(scope) {
      this.okOuterVisible = true;
      // this.okinnerVisible = true;
      this.scopeData = scope;
    },
    // 改变状态，将禁用状态变成启用
    async changeStatusAdd() {
      this.scopeData.status = 0;
      // (this.scopeData.status);
      // ("更改状态后,本地数据对象");
      // (this.scopeData);
      const { data: res } = await this.$http.post(
        "system/zidian/updateWorkType",
        qs.stringify(this.scopeData)
      );
      if (res.code !== 200) return this.$message.error("更改状态失败");
      this.$message.success("更改状态成功");
      // (res);
      // this.scopeData = {};
      this.okOuterVisible = false;
      this.okinnerVisible = false;
      this.getTableListFrom();
    },
    // 获取表格数据索引值
    getTabListIndex() {},
    // 添加工种对话框显示
    addHuman() {
      this.addDialogVisible = true;
    },
    // 添加工种对话框确定添加
    addGetHuman() {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) return;
        // if (this.addFormData.workName == "") {
        //   return this.$message("请输入工种名称");
        // }
        // if(this.addFormData.color == ''){return this.message('请选择颜色')}
        const { data: res } = await this.$http.post(
          "system/zidian/addWorkType",
          qs.stringify(this.addFormData)
        );
        ("打印结果", res);
        // if (res.code == 500) {
        //   this.$message.error("工种已存在,请更换工种");
        // }
        if (res.code !== 200) {
          return this.$message(res.message);
        }
        if (res.code == 200) {
          this.$message.success("添加工种数据成功");
          this.addDialogVisible = false;
          this.addFormData.workName = "";
          this.addFormData.status = "";
          this.addFormData.color = "";
          this.editFormData.color = "";
          this.addFormData.color = "";
          this.dwValue = "";
          this.getTableListFrom();
        }
      });
    },
    addGetHumanedd() {
      this.addDialogVisible = false;
      this.addFormData.workName = "";
      this.addFormData.status = "";
      this.addFormData.color = "";
    },
    // 选择颜色时发生事情
    ChangeColor() {
      (this.color1);
      this.addFormData.color = this.color1;
    },
    editChangeColor() {
      (this.color1);
      this.editFormData.color = this.color1;
    },
    // 点击查看编辑框
    viewDataEdit(row) {
      ("行数据", row);

      this.editFormData.zid = row.zid;
      this.editFormData.workName = row.name;
      this.editFormData.status = row.status;
      this.color1 = row.color;
      this.editFormData.color = row.color;
      this.editDialogVisible = true;
    },
    // 上传编辑数据
    async editGetHuman() {
      (this.editFormData);
      const { data: res } = await this.$http.post(
        "system/zidian/updateWorkType",
        qs.stringify(this.editFormData)
      );
      (res);
      if (res.code !== 200) return this.$message.error(res.message);
      this.$message.success("编辑成功");
      this.editDialogVisible = false;
      this.editFormData.color = "";
      this.addFormData.color = "";
      this.dwValue = "";
      this.getTableListFrom();
    },
    // 点击上升
    async uplevel(row) {
      ("上升当前用户row", row);
      let updata = {
        zid: row.zid,
        orderNum: row.orderNum,
        moveType: 0
      };
      ("上升当前用户数据", updata);
      const { data: res } = await this.$http.post(
        "system/zidian/changeZidianOrderNum",
        qs.stringify(updata)
      );
      ("上升用户res", res);
      if (res.code !== 200) {
        return this.$message(res.message);
      }
      this.$message.success("操作成功");
      this.getTableListFrom();
    },
    // 点击下降
    async downlevel(row) {
      ("下降当前用户row", row);
      let downdata = {
        zid: row.zid,
        orderNum: row.orderNum,
        moveType: 1
      };
      ("下降当前用户数据", downdata);
      const { data: res } = await this.$http.post(
        "system/zidian/changeZidianOrderNum",
        qs.stringify(downdata)
      );
      ("下降用户res", res);
      if (res.code !== 200) {
        return this.$message(res.message);
      }
      this.$message.success("操作成功");
      this.getTableListFrom();
    }
  }
};
</script>

<style lang="less" scoped>
.el-card {
  margin: 10px 0 10px 0;
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.15);
}
.el-breadcrumb {
  margin-top: 20px;
}
.el-card .el-row .el-col:nth-child(4) .el-button {
  float: right;
}
.el-table .el-table-column {
  text-align: center;
}
.el-table .el-table-column .el-button {
  font-size: 12px;
}
.page {
  margin-left: 20px;
  margin-top: 30px;
}
.tab {
  margin-top: 20px;
}
.main-dic {
  .main-left {
    width: 200px;
    height: 150px;
    background-color: pink;
    float: left;
    text-align: center;
    font-size: 16px;
    border: 1px solid black;

    div {
      width: 100%;
      height: 49px;
      line-height: 49px;
      border: 1px soild black !important;
    }
  }
  .main-right {
    float: right;
    width: 1400px;
  }
}
.dwdialog {
  img {
    width: 30px;
    height: 30px;
  }
}
</style>

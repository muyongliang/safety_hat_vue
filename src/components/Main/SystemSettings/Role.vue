// 角色权限配置
<template>
  <div id="human">
    <el-card class="box-card">
      <!-- 首部 -->
      <div slot="header" class="clearfix">
        <span>角色权限配置</span>
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item>系统配置</el-breadcrumb-item>
          <el-breadcrumb-item>角色权限配置</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <!-- 主体 -->
      <!-- 查询框 -->
      <el-row :gutter="20">
        <el-col :span="2">
          <span>检索</span>
        </el-col>
        <el-col :span="4">
          <el-input placeholder="请输入角色名称" v-model="findRolesData.roleName"></el-input>
        </el-col>
        <el-col :span="14">
          <el-button type="primary" @click="findName" v-show="roleList.indexOf(108) !== -1">查询</el-button>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="addData" v-show="roleList.indexOf(109) !== -1">添加角色</el-button>
        </el-col>
      </el-row>

      <!-- 查询表 -->
      <div class="tab">
        <el-table :data="RolesDataLiat" border style="width: 100%">
          <el-table-column prop="role_name" label="角色名称" width></el-table-column>
          <el-table-column prop="description" label="描述"></el-table-column>
          <el-table-column prop="num" label="绑定子管理员数" width></el-table-column>
          <el-table-column prop="operation" label="操作" width="400">
            <template slot-scope="scope">
              <el-button
                type="primary"
                size="mini"
                @click="ViewDetails(scope.row)"
                v-show="roleList.indexOf(123) !== -1"
              >查看</el-button>
              <el-button
                type="success"
                size="mini"
                @click="editdata(scope.row)"
                v-show="roleList.indexOf(124) !== -1"
              >编辑</el-button>
              <el-button
                type="warning"
                size="mini"
                @click="JurisdictionDetails(scope.row)"
                v-if="scope.row.role_name == '企业管理员'"
                v-show="roleList.indexOf(125) !== -1"
                disabled
              >权限</el-button>
              <el-button
                type="warning"
                size="mini"
                @click="JurisdictionDetails(scope.row)"
                v-else-if="scope.row.role_name == '调度员'"
                v-show="roleList.indexOf(125) !== -1"
                disabled
              >权限</el-button>

              <el-button
                type="warning"
                size="mini"
                @click="JurisdictionDetails(scope.row)"
                v-else-if="scope.row.role_name == '终端用户'"
                v-show="roleList.indexOf(125) !== -1"
                disabled
              >权限</el-button>
              <el-button
                type="warning"
                size="mini"
                @click="JurisdictionDetails(scope.row)"
                v-else-if="scope.row.role_name == '子管理员'"
                v-show="roleList.indexOf(125) !== -1"
                disabled
              >权限</el-button>

              <el-button
                type="warning"
                size="mini"
                @click="JurisdictionDetails(scope.row)"
                v-else
                v-show="roleList.indexOf(125) !== -1"
              >权限</el-button>

              <el-button
                type="danger"
                size="mini"
                @click="deleteData(scope.row)"
                v-if="scope.row.role_name == '企业管理员'"
                v-show="roleList.indexOf(127) !== -1"
                disabled
              >删除</el-button>
              <el-button
                type="danger"
                size="mini"
                @click="deleteData(scope.row)"
                v-else-if="scope.row.role_name == '调度员'"
                v-show="roleList.indexOf(127) !== -1"
                disabled
              >删除</el-button>
              <el-button
                type="danger"
                size="mini"
                @click="deleteData(scope.row)"
                v-else-if="scope.row.role_name == '终端用户'"
                v-show="roleList.indexOf(127) !== -1"
                disabled
              >删除</el-button>
              <el-button
                type="danger"
                size="mini"
                @click="deleteData(scope.row)"
                v-else-if="scope.row.role_name == '子管理员'"
                v-show="roleList.indexOf(127) !== -1"
                disabled
              >删除</el-button>
              <el-button
                type="danger"
                size="mini"
                @click="deleteData(scope.row)"
                v-else
                v-show="roleList.indexOf(127) !== -1"
              >删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <!-- 分页标签 -->
      <div class="page">
        <el-pagination
          @current-change="handleCurrentChange"
          :current-page="findRolesData.pageNum"
          :page-size="findRolesData.pageSize"
          layout="total,  prev, pager, next"
          :total="total"
        ></el-pagination>
      </div>
    </el-card>

    <!-- 查看详情页弹出框 -->
    <div class="view-dialog">
      <el-dialog title="角色明细" :visible.sync="ViewDialogVisible" width="40%">
        <!-- 主体 -->
        <!-- 内容主体 -->
        <el-form ref="form" :model="roleViewData" label-width="100px">
          <el-form-item label="角色名称：">
            <el-input v-model="roleViewData.roleName" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="描述：">
            <el-input type="textarea" v-model="roleViewData.description" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="创建人：">
            <el-input v-model="roleViewData.createBy" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="创建时间：">
            <el-input v-model="roleViewData.createTime" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="更新人：">
            <el-input v-model="roleViewData.updateBy" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="更新时间：">
            <el-input v-model="roleViewData.modifyTime" :disabled="true"></el-input>
          </el-form-item>
        </el-form>
        <!-- <div class="details">
          <div label="角色明细" name="first" class="first">
            <div>
              <i>角色名称：</i>
              <span>管理员</span>
            </div>
            <div class="texts">
              <i>描述：</i>
              <div class="two">
                <span
                  class="two"
                >文本内容，自动换行显示全部文本内容，自动换行显示全部文本内容，自动换行显示全部文本内容，自动换行显示全部文本内容，自动换行显示全部,文本内容，自动换行显示全部文本内容，自动换行显示全部文本内容，自动换行显示全部文本内容，自动换行显示全部文本内容，自动换行显示全部,</span>
              </div>
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
          </div>
        </div>-->
      </el-dialog>
    </div>

    <!-- 权限对话框 -->
    <div class="jurisdiction-dialog">
      <el-dialog
        title="权限设置"
        :visible.sync="JurisdictionDialogVisible"
        width="45%"
        center
        :modal="false"
        class="roleDia"
      >
        <!-- 主体 -->
        <!-- <el-transfer v-model="jurvalue" :data="jurdata"></el-transfer> -->
        <!-- :default-checked-keys="checkChanges"默认选中属性 handleCheckChange   ref="tree" :default-expanded-keys="[10, 11]"  @check-change=""              @node-click=""
        -->
        <div class="dia-left">
          <span>菜单权限设置</span>
          <el-tree
            :data="roleEditData"
            show-checkbox
            node-key="mid"
            :props="defaultProps"
            :default-checked-keys="checkChanges"
            @current-change="handleCheckChange"
            @check="handleCheckChange"
            ref="tree"
          ></el-tree>
        </div>
        <div class="dia-right">
          <span>功能权限设置</span>
          <div class="dia-right-rig">
            <el-checkbox-group v-model="checkedCities" @change="handleCheckedCitiesChange">
              <el-checkbox v-for="city in cities" :label="city.name" :key="city.mid"></el-checkbox>
            </el-checkbox-group>
            <el-button
              type="primary"
              class="roleBtn"
              @click="roleBtns"
              :disabled="btnsdwo"
              v-show="roleList.indexOf(126) !== -1"
            >按钮功能保存</el-button>
          </div>
        </div>
        <!-- 底部 -->
        <!-- <br />
        <br />
        <hr />-->
        <!-- <el-divider></el-divider> -->
        <span slot="footer" class="dialog-footer">
          <el-divider></el-divider>
          <el-button @click="roleIsDown">关闭弹框</el-button>
          <el-button type="primary" @click="roleIsOk" v-show="roleList.indexOf(126) !== -1">页面权限保存</el-button>
        </span>
      </el-dialog>
    </div>
    <!-- 模板底部 -->
    <!-- 添加角色框 -->
    <el-dialog title="添加角色" :visible.sync="adddialogVisible" width="30%">
      <el-form ref="form" :model="addPushData" label-width="100px">
        <el-form-item label="角色名称：">
          <el-input v-model="addPushData.roleName" placeholder="限20字" @blur="blurName"></el-input>
        </el-form-item>
        <el-form-item label="描述：">
          <el-input type="textarea" v-model="addPushData.description" placeholder="限50字"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="adddialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addDataOk">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 编辑对话框 -->
    <el-dialog title="编辑角色" :visible.sync="editdialogVisible" width="30%">
      <el-form ref="form" :model="editPushData" label-width="100px">
        <el-form-item label="角色名称：">
          <el-input v-model="editPushData.roleName" placeholder="限20字"></el-input>
        </el-form-item>
        <el-form-item label="描述：">
          <el-input type="textarea" v-model="editPushData.description" placeholder="限50字"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editdialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="eidtDataOk">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 删除对话框 -->
    <el-dialog title="提示" :visible.sync="deledialogVisible" width="30%">
      <span>真的要删除这条数据吗</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="deledialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="deleteDataOK">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import qs from "qs";
export default {
  inject: ["reload"],
  data() {
    // 权限对话框数据
    const generateData = _ => {
      const jurdata = [];
      for (let i = 1; i <= 15; i++) {
        jurdata.push({
          key: i,
          label: `备选项 ${i}`,
          disabled: i % 4 === 0
        });
      }
      return jurdata;
    };
    return {
      // 权限数据
      jurdata: generateData(),
      jurvalue: [1, 4],
      // 查询表数据
      tableData: [
        {
          date: "文本描述，显示1行，超出显示为短省略号【…】",
          name: "设备管理员",
          num: "10",
          operation: "上海市普陀区金沙江路 1518 弄"
        },
        {
          date: "文本描述，显示1行，超出显示为短省略号【…】",
          name: "设备管理员",
          num: "10",
          operation: "上海市普陀区金沙江路 1518 弄"
        },
        {
          date: "文本描述，显示1行，超出显示为短省略号【…】",
          name: "设备管理员",
          num: "10",
          operation: "上海市普陀区金沙江路 1518 弄"
        },
        {
          date: "文本描述，显示1行，超出显示为短省略号【…】",
          name: "设备管理员",
          num: "10",
          operation: "上海市普陀区金沙江路 1518 弄"
        }
      ],
      total: 0,
      // 详情页码对框框
      ViewDialogVisible: false,
      // 权限对话框
      JurisdictionDialogVisible: false,
      form: {
        name: "",
        desc: ""
      },
      adddialogVisible: false,
      editdialogVisible: false,
      deledialogVisible: false,
      // 分页查询角色信息/根据角色名称查询数据
      findRolesData: {
        pageNum: 1,
        pageSize: 5
        // roleName: "" //角色名称 调度员
      },
      RolesDataLiat: [], //表单绑定数据
      addPushData: {
        roleName: "",
        description: ""
      },
      editPushData: {
        roleName: "",
        description: ""
        // roleId: ""
      },
      blurNameData: {},
      // 查询角色详情
      roleIdd: {
        roleId: 0
      },
      roleViewData: [],
      // 权限框数据
      tableData: [
        {
          id: "12987122",
          name: "好滋好味鸡蛋仔",
          category: "江浙小吃、小吃零食",
          desc: "荷兰优质淡奶，奶香浓而不腻",
          address: "上海市普陀区真北路",
          shop: "王小虎夫妻店",
          shopId: "10333"
        }
      ],
      // 权限数据
      roleEditData: [],
      // 权限树被选中数据（数组）
      checkChanges: [],
      // 权限树设置
      defaultProps: {
        children: "children",
        label: "label"
      },
      findAllD: {
        mid: 0, //权限ID
        roleId: 0, //角色ID
        type: 0 //类型 0菜单 1按钮
      },
      findPermissions: {
        mid: 0, //权限ID
        roleId: 0, //角色ID
        type: 0 //类型 0菜单 1按钮
      }, //检索权限数据
      // 更新权限数据
      postRoleData: [{ parentId: 0, mid: 0, isAllowed: true }],
      // 获取当前页面按钮权限上传数据
      roleNamePid: {
        parentId: 0,
        userName: null
      },
      // 权限多选框按钮功能显示绑定数据
      checkedCities: [], //已经选中
      cities: [], //循环数据体
      SelectionValue: [], //多选框选中值
      disabled: false,
      forit: ["企业管理员", "调度员"],
      oneTuchData: {},
      ALLRoleData: [], //用户所有的页面显示数据
      allRoleData: [], //将页面权限处理好
      // 页面按钮功能数据
      pidbtnData: {
        mid: 0,
        roleId: 0,
        type: 1
      },
      // 功能权限按钮消失
      btnsdwo: true,
      // 记录管理默认数据
      recordData: [
        { mid: 14, label: "报警记录" },
        { mid: 15, label: "广播记录" },
        { mid: 16, label: "对讲记录" },
        { mid: 17, label: "电话录音记录" },
        { mid: 18, label: "巡检报告" }
      ],
      systemData: [
        { mid: 19, label: "子管理员配置" },
        { mid: 21, label: "远程控制" },
        { mid: 22, label: "字典设置" },
        { mid: 23, label: "终端app更新" },
        { mid: 24, label: "操作日志" },
        { mid: 25, label: "页面设置" },
        { mid: 26, label: "服务状态" }
      ],
      threeData: [], //记录管理选择mid
      threeDatas: [], //系统设置选择mid
      roleList: []
    };
  },
  created() {
    this.findRoles();
    this.getRoleBtnData();
  },
  methods: {
    // naemw(item) {
    //   return "企业管理员" && "调度员";
    // },
    // 功能权限
    async getRoleBtnData() {
      let dataR = {
        parentId: 20,
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

    // 数据查询
    async findRoles() {
      const { data: res } = await this.$http.get("role/findRoles", {
        params: this.findRolesData
      });
      ("列表数据", res);
      this.total = res.data.total;
      this.RolesDataLiat = res.data.list;

      // (this.RolesDataLiat);
    },
    // 分页标签
    handleCurrentChange(val) {
      // (`当前页: ${val}`);
      this.findRolesData.pageNum = val;
      this.findRoles();
    },
    // 根据用户名称查询
    findName() {
      // (this.findRolesData);
      if (this.findRolesData.roleName == "") {
        this.findRolesData.roleName = null;
      }
      this.findRoles();
    },
    // 查看按钮的点击事件
    async ViewDetails(row) {
      // (row.role_id);
      this.roleIdd.roleId = row.role_id;
      const { data: res } = await this.$http.get("role/findDetailById", {
        params: this.roleIdd
      });
      this.roleViewData = res.data;
      // (this.roleViewData);

      this.ViewDialogVisible = true;
    },
    // nodeClick() {
    //   this.$nextTick().then(() => {
    //     const firstNode = document.querySelector(".el-tree-node");

    //     firstNode.click();
    //     ("触发了");
    //     ("1", 1);
    //   });
    // },
    // 权限对话框(获取权限)
    async JurisdictionDetails(row) {
      // 这里是配置当前用户在每个页面内能实现的功能的权限
      ("权限配置时当前行数据", row);
      // 点击权限按钮获取所有权限数据
      const { data: res } = await this.$http.get("menu/findPermissions", {
        params: this.findAllD
      });
      // ("所有菜单权限", res);
      this.ALLRoleData = res.data;
      // //这是使用穿梭框组件的方法
      const arrAll = [];
      for (let i = 0; i < res.data.length; i++) {
        arrAll.push({
          mid: res.data[i].mid,
          label: res.data[i].name
        });
      }
      this.roleEditData = arrAll;
      // ("所有权限", this.roleEditData);
      // 将选取角色的id传入获取当前id已经有的权限
      this.findPermissions.roleId = row.role_id;
      // ("当前用户菜单权限上传数据", this.findPermissions);

      const { data: ress } = await this.$http.get("menu/findPermissions", {
        params: this.findPermissions
      });
      // ("当前用户菜单权限数据", ress);

      // 先将isAllowed== false的数组除开，剩下的才是已经有的
      let arrDEL = [];
      for (let i = 0; i < ress.data.length; i++) {
        arrDEL = ress.data.filter(item => {
          return item.isAllowed !== false;
        });
      }
      // ("已拥有权限数据", arrDEL);
      const arr = [];
      for (let i = 0; i < arrDEL.length; i++) {
        arr.push(arrDEL[i].mid);
      }
      // ("当前角色以有的权限", arr);
      this.checkChanges = arr;

      // 将获取到的数据加入进总数据中
      // ("记录管理总数据", this.recordData);

      for (let i = 0; i < this.roleEditData.length; i++) {
        if (this.roleEditData[i].label == "记录管理") {
          // ("i", i);
          this.roleEditData[i].children = this.recordData;
        }
      }
      for (let i = 0; i < this.roleEditData.length; i++) {
        if (this.roleEditData[i].label == "系统设置") {
          // ("i", i);
          this.roleEditData[i].children = this.systemData;
        }
      }
      this.roleNamePid.userName = row.role_name;
      // this.$nextTick(function() {
      //   this.findSonData();
      // });
      // this.$nextTick(function() {
      //   this.findSonsYS();
      // });
      // 获取记录管理与系统设置子页面数据
      let findSonONE = {
        mid: 10,
        roleId: this.findPermissions.roleId,
        type: 0
      };
      // ("当前用户rid", findSonONE);
      const { data: rec } = await this.$http.get("menu/findPermissions", {
        params: findSonONE
      });
      // ("当前用户记录管理二级菜单ress", ress);
      // 将isAllowed== false的数组除开，剩下的才是已经有的
      let two = [];
      for (let i = 0; i < rec.data.length; i++) {
        two = rec.data.filter(item => {
          return item.isAllowed !== false;
        });
      }
      // ("用户已经有的记录管理权限two", two);
      let three = [];
      for (let i = 0; i < two.length; i++) {
        three.push(two[i].mid);
      }
      this.checkChanges = this.checkChanges.concat(three);
      // ("已经获取到记录管理二级three", three);
      // ("记录管理添加已经拥有数据", this.checkChanges);

      this.threeData = three;

      let findSonONEes = {
        mid: 11,
        roleId: this.findPermissions.roleId,
        type: 0
      };
      // ("当前用户rid", findSonONE);
      const { data: resses } = await this.$http.get("menu/findPermissions", {
        params: findSonONEes
      });
      // ("当前用户记录管理二级菜单ress", ress);
      // 将isAllowed== false的数组除开，剩下的才是已经有的
      let twoes = [];
      for (let i = 0; i < resses.data.length; i++) {
        twoes = resses.data.filter(item => {
          return item.isAllowed !== false;
        });
      }
      // ("用户已经有的系统设置权限two", two);
      let threees = [];
      for (let i = 0; i < twoes.length; i++) {
        threees.push(twoes[i].mid);
      }
      this.checkChanges = this.checkChanges.concat(threees);
      this.threeDatas = threees;

      // 获取记录管理与系统设置子页面数据end

      // this.checkChanges.splice(5, 1);
      // this.checkChanges.splice(5, 1);
      // ("记录管理选择mid", this.threeData);
      // ("系统设置选择mid", this.threeDatas);
      if (this.threeData.length !== 0) {
        for (let i = 0; i < this.checkChanges.length; i++) {
          if (this.checkChanges[i] == 10) {
            this.checkChanges.splice(i, 1);
          }
        }
      }
      if (this.threeDatas.length !== 0) {
        for (let i = 0; i < this.checkChanges.length; i++) {
          if (this.checkChanges[i] == 11) {
            this.checkChanges.splice(i, 1);
          }
        }
      }

      // ("已选择", this.checkChanges);
      // ("总数据", this.roleEditData);
      this.JurisdictionDialogVisible = true;

      //这是使用tree组件的方法
      // 获取记录管理与系统设置二级菜单
      // this.findSonData().then(item => {
      //   this.findSonsYS().then(item => {
      //     this.JurisdictionDialogVisible = true;
      //     ("总数据", this.roleEditData);
      //   });
      // });
      // this.JurisdictionDialogVisible = true;
      // ("总数据", this.roleEditData);
      // this.JurisdictionDialogVisible = true;
    },
    // 获取记录管理二级菜单
    async findSonData() {
      // 先获取记录管理
      // let findSondata = {
      //   mid: 10,
      //   roleId: 0,
      //   type: 0
      // };
      // const { data: res } = await this.$http.get("menu/findPermissions", {
      //   params: findSondata
      // });
      // // ("记录管理二级菜单res", res);
      // let one = [];
      // for (let i = 0; i < res.data.length; i++) {
      //   one.push({
      //     mid: res.data[i].mid,
      //     label: res.data[i].name
      //   });
      // }
      // // ("所有记录管理二级菜单one", one);
      // // ("处理后二级菜单one", one);
      // //将所有的耳机菜单加入到总数据中的children
      // // ("总数据", this.roleEditData);
      // for (let i = 0; i < this.roleEditData.length; i++) {
      //   if (this.roleEditData[i].label == "记录管理") {
      //     // ("i", i);
      //     this.roleEditData[i].children = one;
      //   }
      // }
      // ("记录管理二级菜单数据", this.roleEditData);

      let findSonONE = {
        mid: 10,
        roleId: this.findPermissions.roleId,
        type: 0
      };
      // ("当前用户rid", findSonONE);
      const { data: ress } = await this.$http.get("menu/findPermissions", {
        params: findSonONE
      });
      // ("当前用户记录管理二级菜单ress", ress);
      // 将isAllowed== false的数组除开，剩下的才是已经有的
      let two = [];
      for (let i = 0; i < ress.data.length; i++) {
        two = ress.data.filter(item => {
          return item.isAllowed !== false;
        });
      }
      // ("用户已经有的记录管理权限two", two);
      let three = [];
      for (let i = 0; i < two.length; i++) {
        three.push(two[i].mid);
      }
      this.checkChanges = this.checkChanges.concat(three);
      ("已经获取到记录管理二级three", three);
      // ("记录管理添加已经拥有数据", this.checkChanges);

      this.threeData = three;
      // if (three.length !== 0) {
      //   ("有选择记录");
      //   for (let i = 0; i < this.checkChanges.length; i++) {
      //     if (this.checkChanges[i] == 10) {
      //       ("i", i);
      //       this.checkChanges.splice(i, 1);
      //     }
      //   }
      //   // this.checkChanges.splice(10, 1);
      // }
      // ("记录管理已经拥有权限", this.checkChanges);

      // ("记录管理二级菜单ok");
    },
    // 系统设置二级菜单
    async findSonsYS() {
      // let findSondata = {
      //   mid: 11,
      //   roleId: 0,
      //   type: 0
      // };
      // const { data: res } = await this.$http.get("menu/findPermissions", {
      //   params: findSondata
      // });
      // // ("系统二级菜单res", res);
      // let one = [];
      // for (let i = 0; i < res.data.length; i++) {
      //   one.push({
      //     mid: res.data[i].mid,
      //     label: res.data[i].name
      //   });
      // }
      // // ("处理后系统二级菜单one", one);
      // for (let i = 0; i < this.roleEditData.length; i++) {
      //   if (this.roleEditData[i].label == "系统设置") {
      //     // ("i", i);
      //     this.roleEditData[i].children = one;
      //   }
      // }
      // ("系统设置二级菜单", this.roleEditData);
      let findSonONE = {
        mid: 11,
        roleId: this.findPermissions.roleId,
        type: 0
      };
      // ("当前用户rid", findSonONE);
      const { data: ress } = await this.$http.get("menu/findPermissions", {
        params: findSonONE
      });
      // ("当前用户记录管理二级菜单ress", ress);
      // 将isAllowed== false的数组除开，剩下的才是已经有的
      let two = [];
      for (let i = 0; i < ress.data.length; i++) {
        two = ress.data.filter(item => {
          return item.isAllowed !== false;
        });
      }
      // ("用户已经有的系统设置权限two", two);
      let three = [];
      for (let i = 0; i < two.length; i++) {
        three.push(two[i].mid);
      }
      this.checkChanges = this.checkChanges.concat(three);
      this.threeDatas = three;
      // ("已经获取到系统设置二级three", three);
      // ("系统设置已经拥有权限", this.checkChanges);
      // ("系统设置二级菜单ok");
    },
    // 权限控制树选择的，点击tree控件选择框实现获取数据
    async handleCheckChange(data, checked, node) {
      ("选择数据", data);
      // 右边获取所有选择页面的数据
      let one = this.$refs.tree.getCheckedNodes(data);
      this.oneTuchData = data;
      let two = [];
      one.forEach(item => {
        two.push(item);
      });
      // ("多选页面two", two);
      // 1、将允许页面的数据查询并显示到页面上
      // 将转换出来的数组进行精简[{"parentId":3,"mid":6,"isAllowed":true}]
      let three = [];
      for (let i = 0; i < two.length; i++) {
        three.push({
          parentId: 0,
          mid: two[i].mid,
          isAllowed: true
        });
      }
      // ("允许显示页面", three);
      // ("所有页面数据", this.ALLRoleData);
      let four = [];
      for (let i = 0; i < this.ALLRoleData.length; i++) {
        four.push(this.ALLRoleData[i].mid);
      }
      // ("所有页面数据four", four);
      let twos = [];
      two.forEach(item => {
        twos.push(item.mid);
      });
      // ("选取允许", twos);
      // 根据选中的页面将不显示页面一并选择
      for (let i = 0; i < twos.length; i++) {
        four = four.filter(item => {
          return item !== twos[i];
        });
      }
      // ("未被选择权限4", four);
      // 转换为选取页面
      let five = [];
      for (let i = 0; i < four.length; i++) {
        five.push({
          parentId: 0,
          mid: four[i],
          isAllowed: false
        });
      }
      // ("未被选择权限5", five);
      // 将允许与不允许的数据合并在一起
      three = three.concat(five);
      // ("合并权限", three);
      this.allRoleData = three;

      // ("允许处理后数据", this.allRoleData);

      // 获取选中页面的功能权限
      this.roleLeft();
      // 获取选中页面的功能权限end

      // this.cities = []; //清空数据
      // if (checked) {
      // this.$refs.tree.setCheckedNodes([data]);
      // 首先获取当前页面的说有功能权限
      // let pidData = {
      //   parentId: data.mid,
      //   userName: null
      // };
      // // ("当前选取", pidData);
      // const { data: res } = await this.$http.get("menu/getButtonMenus", {
      //   params: pidData
      // });
      // // ("页面所有功能", res.data);
      // // 将功能权限展示到页面上
      // this.cities = res.data;
      // // ("页面所有功能", this.cities);
      // this.roleNamePid.parentId = data.mid;
      // // ("当前选取", data);
      // // // 获取当前页面已经拥有的功能权限
      // const { data: ress } = await this.$http.get("menu/getButtonMenus", {
      //   params: this.roleNamePid
      // });
      // // ("获取当前页面已经拥有的功能权限", ress);
      // let arr = [];
      // ress.data.forEach(item => {
      //   return arr.push(item.name);
      // });
      // ("处理后数据", arr);
      // this.checkedCities = arr;
    },
    // 获取右边页面功能权限
    async roleLeft() {
      this.cities = []; //清空数据
      this.checkedCities = [];
      // if (checked) {
      // this.$refs.tree.setCheckedNodes([data]);
      // 首先获取当前页面的说有功能权限
      this.pidbtnData.mid = this.oneTuchData.mid;
      this.pidbtnData.roleId = this.findPermissions.roleId;
      // ("当前选取按钮功能", this.pidbtnData);
      const { data: res } = await this.$http.get("menu/findPermissions", {
        params: this.pidbtnData
      });
      // ("当前选取页面所有按钮功能", res.data);
      if (res.data.length == 0) {
        // ("数据为空");
        this.btnsdwo = true;
        // ("按钮显示", this.btnsdwo);
      } else {
        this.btnsdwo = false;
      }
      // // 将功能权限展示到页面上
      // for (let i = 0; i < res.data.length; i++) {
      //   this.cities.push({
      //     name: res.data[i].name,
      //     mid: res.data[i].mid
      //   });
      // }
      this.cities = res.data;
      // 给重复的名称加上数字标记
      for (let i = 0; i < this.cities.length; i++) {
        //(ary[i]);返回数组中的每一项
        let cur = this.cities[i];
        for (let j = i + 1; j < this.cities.length; j++) {
          if (cur.name == this.cities[j].name) {
            this.cities[j].name = this.cities[j].name + i;
            // this.cities.splice(j, 1);
            // j--;
          }
        }
      }

      // 给重复的名称加上数字标记end

      ("页面所有功能", this.cities);
      this.roleNamePid.parentId = this.oneTuchData.mid;

      // 将当前页面的按钮功能is == false排除开，剩下的就是上次操作成功
      let arrDEL = [];
      for (let i = 0; i < res.data.length; i++) {
        arrDEL = res.data.filter(item => {
          return item.isAllowed !== false;
        });
      }
      // ("已拥有权限数据", arrDEL);

      // ("当前选取", data);
      let arr = [];
      arrDEL.forEach(item => {
        return arr.push(item.name);
      });
      this.checkedCities = arr;
      ("处理后数据", this.checkedCities);
    },
    // 多选框.选中数据
    handleCheckedCitiesChange(value) {
      ("多选框.选中数据", value);
      this.SelectionValue = value;
    },
    // 点击确定更改功能权限
    async roleBtns() {
      // (this.SelectionValue);
      // if (this.SelectionValue.length == 0) {
      //   return this.$message("您没有更改权限");
      // }
      let arr = this.cities.filter(
        item => this.SelectionValue.indexOf(item.name) > -1
      );
      // ("查询数据", arr);
      let arrTwo = this.cities.filter(
        item => this.SelectionValue.indexOf(item.name) == -1
      );
      // ("不允许的值", arrTwo);
      // 将转换出来的数组进行精简[{"parentId":3,"mid":6,"isAllowed":true}]
      let arrOne = [];
      for (let i = 0; i < arr.length; i++) {
        arrOne.push({
          parentId: arr[i].parentId,
          mid: arr[i].mid,
          isAllowed: true
        });
      }
      for (let i = 0; i < arrTwo.length; i++) {
        arrOne.push({
          parentId: arrTwo[i].parentId,
          mid: arrTwo[i].mid,
          isAllowed: false
        });
      }
      // ("上传数据", arrOne);
      // ("角色id", this.findPermissions.roleId);
      let idd = {
        roleId: this.findPermissions.roleId
      };
      ("功能权限数据", arrOne);
      ("上传权限数据id", idd);
      const { data: res } = await this.$http.post(
        "menu/updatePermissions",
        arrOne,
        { params: idd }
      );
      // ("功能权限", res);
      if (res.code !== 200) {
        return this.$message.error(res.message);
      }
      this.$message.success("权限更改成功");
    },
    // 菜单显示权限
    async roleIsOk(down) {
      let idd = {
        roleId: this.findPermissions.roleId
      };
      // // 确认数据中的记录管理与系统设置二级菜单是否有true
      let one = [];
      for (let i = 0; i < this.recordData.length; i++) {
        one.push(this.recordData[i].mid);
      }
      let two = [];
      for (let i = 0; i < this.systemData.length; i++) {
        two.push(this.systemData[i].mid);
      }
      // ("记录管理权限数据one", one);
      // ("系统设置权限数据two", two);
      let allDS = [];
      for (let i = 0; i < this.allRoleData.length; i++) {
        allDS.push(this.allRoleData[i].mid);
      }
      // ("所有选取mid", allDS);
      // 思路：1.循环本地数据，查找最终数据中是否包含选中的二级菜单，2.找到了就循环总数据，将相应二级菜单那一项改成开始
      for (let i = 0; i < one.length; i++) {
        if (allDS.indexOf(one[i]) !== -1) {
          // ("找到有的了", one[i]);
          this.allRoleData.forEach(item => {
            if (item.mid == 10) {
              item.isAllowed = true;
              // ("item", item);
            }
          });
        }
      }
      for (let i = 0; i < two.length; i++) {
        if (allDS.indexOf(two[i]) !== -1) {
          // ("找到有的了", two[i]);
          this.allRoleData.forEach(item => {
            if (item.mid == 11) {
              item.isAllowed = true;
              ("item", item);
            }
          });
        }
      }
      //再次循环将处理总数与全部数据将子页面没有显示的数据找出来
      // 有组件不会把没有选择的二级菜单算进去，所以我们要循环并处理成false加进数组start
      // ("记录管理选择mid", this.threeData);
      // ("系统设置选择mid", this.threeDatas);
      // let jone = [];
      // for(let i=0;i<one.length;i++){
      //   for(let j =0;j<this.threeData.length;j++){

      //   }
      // }
      let three = one.concat(two);
      // ("记录管理与系统设置总mid", three);
      let dyData = [];
      // for (let i = 0; i < allDS.length; i++) {
      //   dyData = three.filter(item => allDS.indexOf(three[i]) == -1);
      // }
      dyData = three.filter(item => allDS.indexOf(item) == -1);
      // ("二级菜单没有选中数据", dyData);
      let dyends = [];
      for (let i = 0; i < dyData.length; i++) {
        dyends.push({
          parentId: 0,
          mid: dyData[i],
          isAllowed: false
        });
      }
      // ("二级菜单没有选中处理数据", dyends);

      // tree组件不会把没有选择的二级菜单算进去，所以我们要循环并处理成false加进数组end
      this.allRoleData = this.allRoleData.concat(dyends);
      // ("当前用户页面权限数据", this.allRoleData);
      // ("用户权限id", idd);
      const { data: res } = await this.$http.post(
        "menu/updatePermissions",
        this.allRoleData,
        { params: idd }
      );
      // ("菜单显示权限", res);
      if (res.code !== 200) {
        return this.$message.error("更改失败");
      }
      this.$message.success("权限更改成功");
      // 关闭弹框
      this.JurisdictionDialogVisible = false;
      this.roleEditData = [];
      this.checkChanges = [];
      // location.reload();
      this.reload();
    },
    // 取消权限弹框
    roleIsDown() {
      this.JurisdictionDialogVisible = false;
      // this.roleEditData = [];
      // this.checkChanges = [];
      this.reload();
    },
    // 添加角色
    addData() {
      this.adddialogVisible = true;
    },
    // 确认添加数据
    async addDataOk() {
      const { data: res } = await this.$http.post(
        "role/addRole",
        qs.stringify(this.addPushData)
      );
      (res);

      if (res.code !== 200) return this.$message.error(res.message);
      this.$message.success("添加成功");
      this.adddialogVisible = false;
      this.findRoles();
    },
    // 写好角色名后验证是否重复
    async blurName() {
      // (this.addPushData.roleName);
      this.blurNameData.roleName = this.addPushData.roleName;
      // (this.blurNameData);

      const { data: res } = await this.$http.get("role/checkRoleName", {
        params: this.blurNameData
      });
      (res);
      if (res.code == 500) {
        this.addPushData.roleName = "";

        return this.$message.error("角色名称已存在，请更换名称");
      }
    },
    // 编辑信息
    editdata(row) {
      ("row", row);
      this.editPushData.roleName = row.role_name;
      this.editPushData.roleId = row.role_id;
      this.editPushData.description = row.description;
      ("this.editPushData", this.editPushData);

      this.editdialogVisible = true;
    },
    async eidtDataOk() {
      const { data: res } = await this.$http.post(
        "role/editRole",
        qs.stringify(this.editPushData)
      );
      (res);
      if (res.code !== 200) return this.$message.error(res.message);
      this.$message.success("编辑成功");
      this.editdialogVisible = false;

      this.findRoles();
    },
    // 删除
    deleteData(row) {
      ("row", row);
      this.roleIdd.roleId = row.role_id;
      this.deledialogVisible = true;
    },
    async deleteDataOK() {
      // (this.roleIdd);
      const { data: res } = await this.$http.post(
        "role/delete",
        qs.stringify(this.roleIdd)
      );
      // ("res", res);
      if (res.code !== 200) {
        this.$message.error(res.message);
        this.deledialogVisible = false;
        return;
      }
      this.$message.success("删除成功");
      this.deledialogVisible = false;
      this.findRoles();
    } //确认删除
  }
};
</script>

<style lang="less" scoped>
#human {
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
  .view-dialog {
    .details .first {
      width: 100%;
      height: 500px;
      overflow-y: auto;
    }
    .first div {
      margin-bottom: 20px;
      font-size: 14px;
    }
    // .first div:nth-child(2) {
    //   div:nth-child(1){
    //     float: left;
    //   }
    //   div:nth-child(2){
    //     float: right;
    //   }
    // }
    // .texts {
    //   // margin-bottom: 20px;
    //   // .one{
    //   //  float: left;
    //   //   width: 80px;
    //   // }
    //   .two {
    //     // display: inline-block;
    //     width: 481px;
    //     height: 50px;
    //     overflow: hidden;
    //     text-overflow: ellipsis;
    //     white-space: nowrap;
    //     float: right;
    //   }
    // }
    // .first div:nth-child(3) {
    //   margin-top: 10px;
    // }

    .first i {
      font-style: normal;
      display: inline-block;
      width: 200px;
      margin-right: 40px;
    }
  }
  .el-dialog__footer {
    text-align: center !important;
  }
  .jurisdiction-dialog {
    .el-dialog {
      .el-dialog__body {
        .dia-left {
          float: left;
          width: 44%;
          text-align: center;
          .el-tree {
            overflow: scroll;
            height: 250px;
          }
          // height: 400px;
          // background-color: pink;
        }
        .dia-right {
          text-align: center;
          .dia-right-rig {
            position: relative;
            float: right;
            width: 50%;
            height: 238px;
            padding-top: 10px;
            padding-left: 10px;
            border: 1px solid #aaa;
            .el-checkbox {
              float: left;
              text-align: left;
              // margin-left: 0 !important;
              width: 120px;
            }

            // background-color: pink;
            .roleBtn {
              position: absolute;
              right: 10px;
              bottom: 10px;
              display: inline-block;
            }
          }
        }
      }
      // /deep/.dialog-footer {
      //   margin-top: 100px;
      // }
    }
  }
  /deep/.roleDia {
    .el-dialog__body {
      height: 200px;
    }
  }
}
</style>

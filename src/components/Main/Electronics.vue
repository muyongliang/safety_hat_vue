// 电子围栏
<template>
  <div id="mapss">
    <!-- 百度地图 -->
    <baidu-map
        :center="center"
        :zoom="zoom"
        @ready="handler"
        class="baiduMap"
        @click="getClickInfo"
        :scroll-wheel-zoom="true"
    >
      <bm-local-search
        :keyword="addForm.projectAddress"
        :auto-viewport="true"
        :panel="false"
        @searchcomplete="getGps"
      ></bm-local-search>
      <div v-for="(item, index) of tableData" :key="index">
        <!-- 圆形围栏 -->
        <bm-circle
            v-if="item.circlePath"
            :center="item.circlePath.center"
            :radius="item.circlePath.radius"
            fillColor="red"
            :fillOpacity="0.2"
            stroke-color="gray"
            strokeStyle="dashed"
            :stroke-opacity="1"
            :stroke-weight="2"
            :editing="item.isedit"
            @lineupdate="updateCirclePath"
        ></bm-circle>
        <!-- 矩形围栏 -->
        <bm-polygon
            v-if="item.polygonPath"
            :path="item.polygonPath.center"
            fillColor="red"
            :fillOpacity="0.2"
            stroke-color="gray"
            strokeStyle="dashed"
            :stroke-opacity="1"
            :stroke-weight="2"
            :editing="item.isedit"
            @lineupdate="updatePolygonPath"
        ></bm-polygon>
        <!-- 多边形围栏 -->
      </div>

      <el-card class="map-box-card" v-show="isdrawing">
        <div slot="header" class="clearfix">
          <span>绘制中...</span>
        </div>
        <el-button type="primary" @click="finishDraw" :disabled="isdrawed">完成绘制</el-button>
        <el-button style="float:right" type="primary" :disabled="iseidt" @click="cancelDraw">取消绘制</el-button>
      </el-card>

      <!-- 终端定位点 -->
      <bm-marker
          v-for="(marker,index) in addEntityPoints"
          :key="'maker'+index"
          :position="marker.center" >
        <bm-label :content="marker.name" :labelStyle="{color: 'red', fontSize : '12px'}" :offset="{width: -17, height: 30}"/>
      </bm-marker>

      <!-- 在线终端定位点 -->
      <bm-marker
          v-if="onlineCenter != null"
          :position="onlineCenter" >
        <bm-label :content="onlineName" :labelStyle="{color: 'red', fontSize : '12px'}" :offset="{width: -17, height: 30}"/>
      </bm-marker>

    </baidu-map>
    <div class="tab" v-show="TabShow">
      <el-card class="box-card">
        <!-- 上半部分 -->
        <div slot="header" class="clearfix">
          <span>电子围栏</span>
          <el-form ref="form" :model="dataNameForm" label-width="80px">
            <el-form-item label="项目名称">
              <el-select v-model="dataNameForm.projectid" @change="project">
                <!-- <el-option label="四川北区一期项目" value="1"></el-option>
                <el-option label="四川北区二期项目" value="2"></el-option>-->
                <el-option
                    v-for="(item, index) in projectData"
                    :key="index"
                    :label="item.projectName"
                    :value="item.pid"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-form>
        </div>
        <!-- 下半部分 -->
        <!-- 列表内容主体区 -->
        <el-form ref="form" :model="dataNameForm" label-width="80px">
          <el-row :gutter="20">
            <el-col :span="4">
              <el-form-item label="类型">
                <el-select v-model="dataNameForm.type" @change="seachType">
                  <el-option label="全部" value="2"></el-option>
                  <el-option label="禁止进入" value="0"></el-option>
                  <el-option label="禁止离开" value="1"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="检索">
                <el-col :span="16">
                  <el-input v-model="dataNameForm.name" placeholder="输入电子围栏名称"></el-input>
                </el-col>
                <el-col :span="4">
                  <el-button type="primary" @click="seachName" :disabled="isaddFence">查询</el-button>
                </el-col>
              </el-form-item>
            </el-col>
            <el-col :span="4" style="float:right;">
              <el-form-item>
                <el-button
                    type="primary"
                    style="float:right;"
                    @click="getAdd"
                    :disabled="isaddFence"
                    v-show="roleList.indexOf(38) !== -1"
                >添加电子围栏</el-button>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>

        <!-- 电子围栏表格数据栏 -->
        <el-table :data="tableData" style="width: 100%" border @row-click="rowClick">

          <el-table-column prop="name" label="电ss子围栏名称" width></el-table-column>
          <el-table-column prop="type" label="类型" width></el-table-column>
          <el-table-column label="当前在线终端">

            <template slot-scope="scope">
              <el-link @click="getCurrent(scope.row)" type="primary">{{ scope.row.onlineClientNum }}</el-link>
              <!-- <span
                @click="getCurrent(scope.row)"
                style="cursor: pointer;"
              >{{ tableData.onlineClientNum }}</span>-->
            </template>
          </el-table-column>
          <el-table-column prop="totalClientNum" label="已添加终端">
            <!--            <template slot-scope="scope">-->
            <!--              <el-link @click="getCurrent(scope.row)" type="primary">{{ scope.row.totalClientNum }}</el-link>-->
            <!--            </template>-->
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button type="primary" size="mini" @click="editAdd(scope.$index, scope.row)" :disabled="isaddFence" v-show="roleList.indexOf(39) !== -1">编辑</el-button>
              <el-button type="primary" size="mini" @click="getQuipMent(scope.row)" :disabled="isaddFence" v-show="roleList.indexOf(41) !== -1">终端管理</el-button>
              <el-button type="primary" size="mini" @click="deletRow(scope.$index, scope.row)" :disabled="isaddFence" v-show="roleList.indexOf(40) !== -1">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
            :page-size="conditions.pageSize"
            @current-change="handleCurrentChange"
            :pager-count="11"
            layout="prev, pager, next"
            :total="total"
            style="margin-top:30px;"
            v-show="hasPages"
        ></el-pagination>
      </el-card>
    </div>

    <!-- 添加、编辑电子围栏（逻辑是点击添加和编辑就隐藏表格，显示这个侧边栏，侧边栏保存或者返回就隐藏这个，显示tab） -->
    <el-drawer
        :visible.sync="drawer"
        direction="ltr"
        @closed="getTableDdata"
        :modal="false"
        :wrapperClosable="false"
    >
      <el-form ref="form" :model="addForm" :rules="rules" label-width="135px">
        <el-row class="row-header">
          <el-col :span="4">
            <el-button type="primary" v-show="!iseidt" @click="backpush">返回</el-button>
            <el-button type="primary" v-show="iseidt" @click="editBackPush">返回</el-button>
          </el-col>
          <el-col :span="16" v-show="!iseidt" style="text-align:center;">添加电子围栏</el-col>
          <el-col :span="16" v-show="iseidt" style="text-align:center;">编辑电子围栏</el-col>
          <el-col :span="4">
            <el-button type="primary" v-show="!iseidt" @click="getPreservation('form')">保存</el-button>
            <el-button type="primary" v-show="iseidt" @click="getEidtPreservation('form')">保存</el-button>
          </el-col>
        </el-row>
        <br />

        <el-form-item label="电子围栏名称：" prop="name">
          <el-input v-model="addForm.name" placeholder="限20字"></el-input>
        </el-form-item>

        <el-form-item label="类型：" prop="type">
          <el-radio v-model="addForm.type" label="0">禁止进入</el-radio>
          <el-radio v-model="addForm.type" label="1">禁止离开</el-radio>
        </el-form-item>

        <el-form-item label="警报提示语：" prop="desc">
          <el-input type="textarea" v-model="addForm.desc" placeholder="限40字" :rows="6"></el-input>
        </el-form-item>
        <!-- <span style="color:red" class="spanxinxin">*</span> -->
        <el-form-item label="围栏设置方式：" prop="range_typ">
          <el-radio
              :disabled="iseidt"
              v-model="addForm.range_typ"
              label="1"
              @change="getCursorDialog"
          >鼠标手绘</el-radio>
          <el-radio
              :disabled="iseidt"
              v-model="addForm.range_typ"
              label="2"
              @change="getfourDialog"
          >输入4角坐标</el-radio>
        </el-form-item>
      </el-form>
    </el-drawer>

    <!-- 终端管理页面对话框 -->
    <el-dialog title="终端管理" :visible.sync="mentDialogVisible" width="35%" :modal="false">
      <el-transfer
          v-model="QuipMentvalue"
          :data="QuipMentdata"
          :titles="['未选择', '已选择']"
          @change="putQuitMent"
      ></el-transfer>

      <span slot="footer" class="dialog-footer">
        <el-button @click="mentDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="mentDia">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 在线终端设备管理对话框 -->
    <el-dialog title="当前在线终端" :visible.sync="currentDialogVisible" width="40%" :modal="false">
      <!-- <el-button type="primary">导出</el-button> -->

      <el-table :data="cliData.list" style="width: 100%" border @row-click="onlineClick">
        <!-- <el-table-column label="在线状态" width="100">
          <template slot-scope="scope" >
            <span class="yuan" v-if="scope.row.onlineStatus != 0"></span>
            <span class="yuan , hui" v-else></span>
          </template>
        </el-table-column>-->
        <el-table-column prop="user_name" label="姓名"></el-table-column>
        <el-table-column prop="mobile" label="电话" width="120"></el-table-column>
        <el-table-column prop="work_Type" label="工种"></el-table-column>
        <el-table-column prop="first_into_time" width="140" label="今日首次进入时间"></el-table-column>
        <el-table-column prop="last_leave_time" width="140" label="今日最后离开时间"></el-table-column>
      </el-table>
      <!-- <el-pagination
        :page-size="cliData.pageSize"
        layout="prev, pager, next"
        :total="cliData.total"

        >
      </el-pagination>-->
    </el-dialog>

    <!-- 点击输入4角坐标单选框弹出对话框-->
    <el-dialog
        title="提示"
        :visible.sync="fourDialogVisible"
        width="20%"
        :before-close="handleClose"
        :modal="false"
    >
      <el-form ref="form" :model="enterPoint" label-width="80px">
        <span>左上角坐标</span>
        <el-form-item label="经度：">
          <el-input v-model="enterPoint.ltlng"></el-input>
        </el-form-item>
        <el-form-item label="维度：">
          <el-input v-model="enterPoint.ltlat"></el-input>
        </el-form-item>

        <span>右上角坐标</span>
        <el-form-item label="经度：">
          <el-input v-model="enterPoint.rtlng"></el-input>
        </el-form-item>
        <el-form-item label="维度：">
          <el-input v-model="enterPoint.rtlat"></el-input>
        </el-form-item>

        <span>左下角坐标</span>
        <el-form-item label="经度：">
          <el-input v-model="enterPoint.lblng"></el-input>
        </el-form-item>
        <el-form-item label="维度：">
          <el-input v-model="enterPoint.lblat"></el-input>
        </el-form-item>

        <span>右下角坐标</span>
        <el-form-item label="经度：">
          <el-input v-model="enterPoint.rblng"></el-input>
        </el-form-item>
        <el-form-item label="维度：">
          <el-input v-model="enterPoint.rblng"></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="fourDialogVisible = false">生成围栏</el-button>
      </span>
    </el-dialog>
    <!-- 点击鼠标手绘单选框弹出对话框 -->
    <el-dialog title="提示" :visible.sync="CursorDalogVisible" width="20%" :before-close="handleClose" :modal="false">

      <div style="margin-top: -20px;margin-bottom: 15px">
        <span>选择城市：</span>
        <el-cascader v-model="area" size="mini" :options="areaOption" @change="handleChange" clearable></el-cascader>
      </div>

      <el-radio v-model="addForm.handShape" label="1">圆形</el-radio>
      <el-radio v-model="addForm.handShape" label="2">矩形</el-radio>
      <el-radio v-model="addForm.handShape" label="3">多边形</el-radio>

      <span slot="footer" class="dialog-footer">
        <el-button type="primary" size="mini" @click="chooseDraw">确 认</el-button>
        <el-button type="primary" size="mini" @click="handleClose">清 除</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
// import { log } from "util";
import axios from "axios";
import qs from "qs";
import { createNamespacedHelpers } from "vuex";
import { async } from "q";
import {CodeToText, regionData} from "element-china-area-data";
const { mapState, mapActions } = createNamespacedHelpers("electronics");
export default {
  data() {
    // 终端管理穿梭框
    const generateData = _ => {
      const QuipMentdata = [];
      for (let i = 1; i <= 15; i++) {
        QuipMentdata.push({
          key: i,
          label: `备选项 ${i}`,
          disabled: i % 4 === 0
        });
      }
      return QuipMentdata;
    };
    return {
      // 项目名称列表
      dataNameForm: {
        name: "",
        projectid: "",
        type: "2"
      },
      // 当前编辑的电子围栏的索引
      currentIndex: null,
      // 输入4点坐标
      enterPoint: {
        rtlng: "",
        rtlat: "",
        rblng: "",
        rblat: "",
        ltlng: "",
        ltlat: "",
        lblng: "",
        lblat: ""
      },
      // 添加电子围栏侧边框绑定数据
      addForm: {
        name: "",
        type: "",
        desc: "",
        range_typ: "",
        handShape: "",
        gpsRange: [],
        radius: null,
        fenceId: null
      },
      // 表单验证
      rules: {
        name: [
          { required: true, message: "请输入活动名称", trigger: "blur" },
          { max: 20, message: "长度不超过20个字符", trigger: "blur" }
        ],
        desc: [
          { required: true, message: "请输入警报语", trigger: "blur" },
          { max: 40, message: "长度不超过40个字符", trigger: "blur" }
        ],
        type: [
          { required: true, message: "请选择一种方式", trigger: "blur" }
          // { max: 5, message: "", trigger: "blur" }
        ],
        range_typ: [
          { required: true, message: "请选择一种方式", trigger: "blur" }
          // { max: 5, message: "", trigger: "blur" }
        ]
      },
      // 终端管理页面
      mentDialogVisible: false,
      // 在线终端设备管理对话框
      currentDialogVisible: false,
      // 表格栏是否显示
      TabShow: true,
      // 侧边栏默认显示
      drawer: false,
      // 添加单选框默认值
      radio: "",
      // 围栏设置方式单选框值
      // radioes: "",
      // 鼠标手绘弹出单选框选择绘制形状
      radi: "",
      // 点击输入4角坐标单选框弹出对话框
      fourDialogVisible: false,
      // 点击鼠标手绘单选框弹出对话框
      CursorDalogVisible: false,
      center: { lng: 104, lat: 30 },
      zoom: 13,
      // 绘制圆形的中心经纬度
      circlePath: {
        center: {
          lng: 104.081548,
          lat: 30.652613
        },
        radius: 500
      },
      fenceData: {},
      // 是否正在绘制围栏
      isdrawing: false,
      // 是否可以点击完成绘制
      isdrawed: true,
      // 绘制完毕弹出信息
      infocenter: { lng: 104, lat: 30 },
      infoWindowShow: false,
      // 是否正在编辑
      iseidt: false,
      // 查询围栏条件
      conditions: {
        projectId: null,
        rangeName: null,
        type: null,
        pageSize: 3,
        pageNum: 1
      },
      //穿梭栏数据
      RangeId: {
        rid: ""
        // projectId: ""
      }, //发送更改请求的id
      QuipMentAll: {
        // rid: 13,
        // name: null,
        // fenceId: null,
        // waitAdd: [
        //   {
        //     id: 4,
        //     userName: "sxlc_155644",
        //     fullName: "张三",
        //     mobile: "15636548695",
        //     status: 1,
        //     type: 2,
        //     workName: "施工",
        //     color: "#266445"
        //   }
        // ],
        // add: []
      }, //总数据
      QuipMentAllTwo: {},
      // 添加总数据
      quitAllData: [],
      QuipMentAdd: [], //已经添加数据进行数据还原
      QuipMentdata: [], //处理后所有数据
      QuipMentvalue: [],
      QuipEditData: {}, //修改后所有处理数据
      //穿梭栏数据end
      rowFenceId: "",
      ppputVal: "",
      tableDataEss: [],
      // 当前编辑的围栏数据
      tableDataEdit: [],
      roleList: [],
      hasPages: false,
      addEntity: 0,
      addEntityUserName: [],
      addEntityPoints: [],
      // 查询通讯录成员提交数据
      postmaildata: {
        pageSize: 10000,
        pageNum: 1
      },
      //终端成员列表
      cliUserList: [],
      onlineCenter: null,
      onlineName: '',
      area: "",
      areaOption: regionData,
      // cliData: []
    };
  },
  mounted() {
    // this.fenceListData(this.conditions); // 查询
    this.getProjectListData(); // 获取项目列表
    this.showPages();
  },
  destroyed() {
    this.deleteAllFence();
  },
  computed: {
    ...mapState(["tableList", "projectList", "total", "cliData"]),
    tableData() {
      let tList = "";

      if (this.tableList) {
        tList = JSON.parse(JSON.stringify(this.tableList));
        tList.forEach(element => {
          if (element.type == 0) {
            element.type = "禁止进入";
          } else {
            element.type = "禁止离开";
          }
        });
      }
      // this.tableDataEss = this.tableList;
      return tList;
    },
    projectData() {
      let pList = "";
      if (this.projectList) {
        pList = JSON.parse(JSON.stringify(this.projectList));
        if (this.projectList.length == 1) {
          this.dataNameForm.projectid = this.projectList[0].pid
          this.project();
        }
      }
      return pList;
    },
    isaddFence() {
      if (this.conditions.projectId !== null) {
        this.hasPages = true;
        return false;
      } else {
        this.hasPages = false;
        return true;
      }
    }
  },
  created() {
    this.getRoleBtnData();
  },

  methods: {
    // 功能权限
    async getRoleBtnData() {
      let dataR = {
        parentId: 7,
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
    },
    //页码显示
    showPages() {
      if (this.conditions.projectId == null) {
        this.hasPages = false;
      } else {
        this.hasPages = true;
      }
    },
    ...mapActions([
      // "electronicsData",
      "circleFenceData",
      "ploygonFenceData",
      "fenceListData",
      // "fenceNameData",
      // "fenceTypeData",
      "deleteFenceData",
      "getProjectListData",
      "updateCircleFenceData",
      "updatePolgonFenceData",
      "deleteAllFence",
      "getOnlineClientListAsync",
      // "updateEntity"
    ]),
    // 项目查询
    project() {
      // this.conditions.rangeName = null;
      // this.conditions.type = Number(this.dataNameForm.type);
      this.conditions.pageNum = 1;
      this.conditions.projectId = this.dataNameForm.projectid;
      this.fenceListData(this.conditions);
    },
    // 类型查询
    seachType() {
      if (Number(this.dataNameForm.type) == 2) {
        this.conditions.type = null;
      } else {
        this.conditions.type = Number(this.dataNameForm.type);
      }
      this.conditions.pageNum = 1;
      this.conditions.rangeName = null;
      this.fenceListData(this.conditions);
    },
    // 名称查询
    seachName() {
      this.conditions.pageNum = 1;
      this.conditions.rangeName = this.dataNameForm.name;
      this.conditions.type = null;
      this.fenceListData(this.conditions);
    },
    // 分页
    handleCurrentChange(val) {
      this.conditions.pageNum = val;
      this.fenceListData(this.conditions);
    },
    // 获取在线终端
    async getCurrent(row) {
      this.getOnlineClientListAsync(row.fence_id);
      //  this.getOnlineClientListAsync(row.rangeId);
      this.currentDialogVisible = true;
      // let params = {
      //   projectId: this.conditions.projectId,
      //   pageSize: 999,
      //   pageNum: 1,
      //   status: 1
      // };
      // const { data: res2 } = await this.$http.get("/client/findByStatus", {
      //   params
      // });
      // this.cliData = [];
      // res2.data.list.forEach(element => {
      //   this.cliData.push(element);
      // });
    },
    // 点击添加电子围栏
    getAdd() {
      this.TabShow = false;
      this.drawer = true;
      this.iseidt = false;
    },
    // 点击编辑电子围栏
    async editAdd(index, row) {
      let params = {
        rid: row.rangeId
      };
      let data = await this.$http.get("/alarmRange/getFenceRangeInfoByRid", {
        params: params
      });
      this.TabShow = false;
      // this.drawer = true;
      this.isdrawing = true;
      this.isdrawed = false;
      this.addForm.name = this.tableData[index].name;
      this.addForm.type = String(data.data.data.type);
      this.addForm.desc = data.data.data.tipInfo;
      this.currentIndex = index;
      this.tableData[index].isedit = true;
      if (this.tableData[index].polygonPath) {
        this.addForm.range_typ = "1";
      } else {
        this.addForm.range_typ = "2";
      }
      this.iseidt = true; //禁止选择方式
      this.tableDataEdit = JSON.stringify(this.tableData[index]);
    },
    // 点击返回，显示表格
    backpush() {
      this.drawer = false;
      this.TabShow = true;
      // if (this.tableData.isedit == true) {
      //   this.tableData.pop();
      // }
      this.fenceListData(this.conditions);
    },
    // 点击编辑返回
    editBackPush() {
      this.drawer = false;
      this.TabShow = true;
      // this.tableDataEdit = this.tableData
      let lastTableData = JSON.parse(this.tableDataEdit);
      this.tableData[this.currentIndex] = lastTableData;
      this.cancelEdit();
    },
    // 取消编辑操作
    cancelEdit() {
      if (this.currentIndex !== null) {
        this.tableData[this.currentIndex].isedit = false;
        this.currentIndex = null;
      }
    },
    // 点击保存数据
    async getPreservation(formName) {
      this.$refs[formName].validate(async valid => {
        if (valid) {
          this.drawer = false;
          this.TabShow = true;
          var currentTableData = this.tableData.slice(-1)[0];
          // 发送数据到鹰眼轨迹
          if (currentTableData.circlePath) {
            const paramsCircle = {
              yingyian: {
                ak: "VMDTdzBD360GHN3yarevFr4fQ48z7q1Y",
                service_id: 217504,
                // monitored_person: '',
                fence_name: this.addForm.name,
                longitude: currentTableData.circlePath.center.lng,
                latitude: currentTableData.circlePath.center.lat,
                radius: currentTableData.circlePath.radius,
                coord_type: "bd09ll"
              },
              houtai: {
                type: this.addForm.type,
                tipInfo: this.addForm.desc,
                projectId: this.dataNameForm.projectid,
                fence_name: this.addForm.name
              }
            };
            let data = await this.circleFenceData(paramsCircle);
            if (data.data.code === 200) {
              this.$message({
                type: "success",
                message: "成功!"
              });
              this.fenceListData(this.conditions);
            } else {
              this.$message({
                type: "info",
                message: "失败！"
              });
              this.tableData.pop();
            }
            // this.$message('这是一条消息提示');
          } else {
            let data = JSON.parse(
                JSON.stringify(currentTableData.polygonPath.center).replace(
                    /lng/g,
                    "longitude"
                )
            );
            let vertexes = JSON.parse(
                JSON.stringify(data).replace(/lat/g, "latitude")
            );
            const paramsPolygon = {
              yingyian: {
                ak: "VMDTdzBD360GHN3yarevFr4fQ48z7q1Y",
                service_id: 217504,
                fence_name: this.addForm.name,
                vertexes: vertexes,
                coord_type: "bd09ll"
              },
              houtai: {
                type: this.addForm.type,
                tipInfo: this.addForm.desc,
                projectId: this.dataNameForm.projectid,
                fence_name: this.addForm.name
              }
            };
            let data2 = await this.ploygonFenceData(paramsPolygon);
            if (data2.data.code === 200) {
              this.$message({
                type: "success",
                message: "成功!"
              });
              // 保存成功重新查询
              this.fenceListData(this.conditions);
            } else {
              this.$message({
                type: "info",
                message: "失败！"
              });
              this.tableData.pop();
            }
            // this.$message('这是一条消息提示');
          }
        } else {
          return false;
        }
      });
      this.cancelEdit();
      this.addForm.handShape = "";
      this.addForm.range_typ = "";
      this.addForm.name = "";
      this.addForm.type = "";
      this.addForm.desc = "";
    },
    // 点击编辑保存数据
    async getEidtPreservation(formName) {
      this.$refs[formName].validate(async valid => {
        if (valid) {
          this.drawer = false;
          this.TabShow = true;
          var currentTableDataEdit = this.tableData[this.currentIndex]; // 当前编辑的电子围栏
          console.log(currentTableDataEdit)
          // 发送数据到鹰眼轨迹
          if (currentTableDataEdit.circlePath) {
            const paramsCircle = {
              yingyian: {
                ak: "VMDTdzBD360GHN3yarevFr4fQ48z7q1Y",
                service_id: 217504,
                // fence_name: this.addForm.name,
                // monitored_person: '',
                longitude: currentTableDataEdit.circlePath.center.lng,
                latitude: currentTableDataEdit.circlePath.center.lat,
                radius: currentTableDataEdit.circlePath.radius,
                coord_type: "bd09ll",
                fence_id: currentTableDataEdit.fence_id
              },
              houtai: {
                type: this.addForm.type,
                tipInfo: this.addForm.desc,
                projectId: this.dataNameForm.projectid,
                rid: currentTableDataEdit.rangeId,
                fence_name: this.addForm.name
              }
            };
            let data2 = await this.updateCircleFenceData(paramsCircle);
            if (data2.data.code === 200) {
              this.$message({
                type: "success",
                message: "修改成功!"
              });
              // 保存成功重新查询
              this.fenceListData(this.conditions);
            } else {
              this.$message({
                type: "info",
                message: "修改失败！"
              });
              this.editBackPush();
            }
            // this.$message('这是一条消息提示');
          } else {
            let data = JSON.parse(
                JSON.stringify(currentTableDataEdit.polygonPath.center).replace(
                    /lng/g,
                    "longitude"
                )
            );
            let vertexes = JSON.parse(
                JSON.stringify(data).replace(/lat/g, "latitude")
            );
            const paramsPolygon = {
              yingyian: {
                ak: "VMDTdzBD360GHN3yarevFr4fQ48z7q1Y",
                service_id: 217504,
                // fence_name: this.addForm.name,
                vertexes: vertexes,
                coord_type: "bd09ll",
                fence_id: currentTableDataEdit.fence_id
              },
              houtai: {
                type: Number(this.addForm.type),
                tipInfo: this.addForm.desc,
                projectId: this.dataNameForm.projectid,
                gpsRange: currentTableDataEdit.polygonPath.center,
                rid: currentTableDataEdit.rangeId,
                fence_name: this.addForm.name
              }
            };
            let data2 = await this.updatePolgonFenceData(paramsPolygon);
            // 保存成功重新查询
            if (data2.data.code === 200) {
              this.$message({
                type: "success",
                message: "修改成功!"
              });
              // 保存成功重新查询
              this.fenceListData(this.conditions);
            } else {
              this.$message({
                type: "info",
                message: "修改失败！"
              });
              this.editBackPush();
            }
            this.fenceListData(this.conditions);
            // this.$message('这是一条消息提示');
          }
          this.cancelEdit();
          this.addForm.handShape = "";
          this.addForm.range_typ = "";
          this.addForm.name = "";
          this.addForm.type = "";
          this.addForm.desc = "";
        } else {
          return false;
        }
      });
      // this.cancelEdit();
    },
    // 侧边栏取消将会重新显示表格，也重新获取数据
    getTableDdata() {
      if (this.addForm.range_typ === "") {
        this.TabShow = true;
        this.iseidt = false;
      }
      this.cancelEdit();
    },
    // 点击输入4角坐标单选框弹出对话框
    getfourDialog() {
      this.fourDialogVisible = true;
    },
    // 点击鼠标手绘单选框弹出对话框
    getCursorDialog() {
      this.CursorDalogVisible = true;
    },
    // 关闭弹出框执行的操作
    handleClose(done) {
      this.CursorDalogVisible = false;
      this.addForm.range_typ = "";
      this.addForm.handShape = "";
      done();
    },
    // 选择绘制方式之后只留地图
    chooseDraw() {
      this.isdrawing = true;
      if (this.addForm.handShape !== "") {
        this.drawer = false;
        this.TabShow = false;
        this.CursorDalogVisible = false;
      } else {
        this.$confirm("请选择绘制方式");
      }
    },
    //百度地图
    handler({ BMap, map }) {
      var point = new BMap.Point(104.081548, 30.652613);
      map.centerAndZoom(point, 15);
      map.addOverlay(point);
      // let mapStyle = { style: "midnight" };
      // map.setMapStyle(mapStyle);
    },
    getClickInfo(e) {
      this.addElectronics(e);
    },
    // 添加电子围栏
    addElectronics(c) {
      let isadd = true;
      this.tableData.forEach((element, index) => {
        if (element.isedit === true) {
          isadd = false;
        }
      });
      if (isadd === true && this.addForm.handShape !== "") {
        this.isdrawed = false;
        switch (this.addForm.handShape) {
          case "1":
            let circle = {
              name: "某某电子围栏",
              type: this.addForm.type === 1 ? "禁止进入" : "禁止离开",
              address: "上海市普陀区金沙江路 1518 弄",
              etotal: 0,
              circlePath: {
                center: {
                  lng: c.point.lng,
                  lat: c.point.lat
                },
                radius: 300
              },
              isedit: true
            };
            this.tableData.push(circle);
            break;
          case "2":
            let polygon = {
              name: "某某电子围栏",
              type: this.addForm.type === 1 ? "禁止进入" : "禁止离开",
              address: "上海市普陀区金沙江路 1518 弄",
              etotal: 0,
              polygonPath: {
                center: [
                  {
                    lng: c.point.lng + 0.003,
                    lat: c.point.lat + 0.003
                  },
                  {
                    lng: c.point.lng - 0.003,
                    lat: c.point.lat + 0.003
                  },
                  {
                    lng: c.point.lng - 0.003,
                    lat: c.point.lat - 0.003
                  },
                  {
                    lng: c.point.lng + 0.003,
                    lat: c.point.lat - 0.003
                  }
                ]
              },
              isedit: true
            };
            this.tableData.push(polygon);
            break;
          case "3":
            let polygons = {
              name: "某某电子围栏",
              type: this.addForm.type === 1 ? "禁止进入" : "禁止离开",
              address: "上海市普陀区金沙江路 1518 弄",
              etotal: 0,
              polygonPath: {
                center: [
                  {
                    lng: c.point.lng + 0.003,
                    lat: c.point.lat + 0.003
                  },
                  {
                    lng: c.point.lng - 0.003,
                    lat: c.point.lat + 0.003
                  },
                  {
                    lng: c.point.lng - 0.003,
                    lat: c.point.lat - 0.003
                  }
                ]
              },
              isedit: true
            };
            this.tableData.push(polygons);
            break;
        }
      }
    },
    // 删除列表数据，同时删除电子围栏
    deletRow(index, row) {
      let params = {
        rangeId: this.tableData[index].rangeId,
        fence_ids: this.tableData[index].fence_id || null
      };
      this.$confirm("此操作将永久删除, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(async () => {
            let isSuccess = await this.deleteFenceData(params);
            if (isSuccess == true) {
              this.$message({
                type: "success",
                message: "删除成功!"
              });
              // 删除成功重新查询
              this.fenceListData(this.conditions);
            } else {
              this.$message({
                type: "info",
                message: "删除失败！"
              });
            }
          })
          .catch(() => {
            this.$message({
              type: "info",
              message: "已取消删除"
            });
          });
    },
    // 绘制圆形
    updateCirclePath(e) {
      // e.target.getCenter(); //圆心经纬度
      // e.target.getRadius(); //半径
      if (
          this.tableData.slice(-1)[0].circlePath &&
          this.tableData.slice(-1)[0].circlePath !== null &&
          this.currentIndex === null
      ) {
        this.tableData.slice(-1)[0].circlePath.center = e.target.getCenter();
        this.tableData.slice(-1)[0].circlePath.radius = e.target.getRadius();
      } else if (this.currentIndex !== null) {
        this.tableData[
            this.currentIndex
            ].circlePath.radius = e.target.getRadius();
        this.tableData[
            this.currentIndex
            ].circlePath.center = e.target.getCenter();
      }
    },
    // 绘制多边形
    updatePolygonPath(e) {
      if (
          this.tableData.slice(-1)[0].polygonPath !== null &&
          this.tableData.slice(-1)[0].polygonPath &&
          this.currentIndex == null
      ) {
        this.tableData.slice(-1)[0].polygonPath.center = e.target.getPath();
      } else if (this.currentIndex !== null) {
        this.tableData[
            this.currentIndex
            ].polygonPath.center = e.target.getPath();
      }
    },
    // 绘制完成
    finishDraw() {
      this.addForm.handShape = "";
      // this.TabShow = true;
      // this.addForm.range_typ = '';
      // this.addForm.name = ""
      // this.addForm.type = ""
      // this.addForm.desc = ""
      this.drawer = true;
      this.isdrawing = false;
      if (this.tableData.slice(-1)[0].isedit == true) {
        this.tableData.slice(-1)[0].isedit = false;
      } else {
        // 编辑
        this.tableData[this.currentIndex].isedit = false;
      }
      this.isdrawed = true;
    },
    // 绘制取消
    cancelDraw() {
      if (this.currentIndex === null) {
        this.tableData.pop();
      } else {
        this.tableData[this.currentIndex].isedit = false;
      }
      this.addForm.handShape = "";
      this.addForm.range_typ = "";
      this.addForm.name = "";
      this.addForm.type = "";
      this.addForm.desc = "";
      this.isdrawing = false;
      this.drawer = true;
      this.isdrawed = true;
      // this.tableData.pop();

    },
    // 终端管理页面获取
    async getQuipMent(row) {
      this.rowFenceId = row.fence_id;
      this.RangeId.rid = row.rangeId;
      this.RangeId.projectId = this.dataNameForm.projectid;
      // 1、获取角色数据
      const { data: res } = await this.$http.get("alarmRange/getMemberList", {
        params: this.RangeId
      });

      this.addEntity = res.data.add.length;
      this.QuipMentAll = res.data;
      this.QuipMentAllTwo = res.data;
      // 所有数据未添加处理
      const quitAll = [];
      this.quitAllData = this.QuipMentAll.waitAdd.concat(this.QuipMentAll.add); //将所有数据合在一起

      for (let i = 0; i < this.quitAllData.length; i++) {
        quitAll.push({
          key: this.quitAllData[i].id,
          label: this.quitAllData[i].fullName
        });
      }
      this.QuipMentdata = quitAll;

      // // 处理已添加数据
      const quitAdd = [];
      for (let i = 0; i < res.data.add.length; i++) {
        quitAdd.push(res.data.add[i].id);
      }
      this.QuipMentvalue = quitAdd;

      this.mentDialogVisible = true;
    },
    // 点击选择角色添加事件
    putQuitMent(value, direction, movedKeys) {
      this.ppputVal = value;
      // for (let i = 0; i < value.length; i++) {
      //   const arrAdd = this.quitAllData.filter(item => {
      //     return item.id == value[i];
      //   });

      //   this.QuipMentAdd = this.QuipMentAdd.concat(arrAdd);
      // }

      //计算了一天加数据
    },
    // 提交终端管理数据事件
    async mentDia() {
      for (let i = 0; i < this.ppputVal.length; i++) {
        const arrAdd = this.quitAllData.filter(item => {
          return item.id == this.ppputVal[i];
        });
        this.QuipMentAdd = this.QuipMentAdd.concat(arrAdd);
      }

      // 将添加处理出来的数据从总数据取出来
      const addData = this.QuipMentAdd;
      const AllDATA = this.quitAllData;

      for (let i = 0; i < addData.length; i++) {
        let index = AllDATA.indexOf(addData[i]);
        if (index != -1);
        AllDATA.splice(index, 1);
      }
      this.QuipEditData.waitAdd = AllDATA;
      this.QuipEditData.add = this.QuipMentAdd;
      this.QuipEditData.rid = this.QuipMentAllTwo.rid;
      this.QuipEditData.name = this.QuipMentAllTwo.name;
      this.QuipEditData.fenceId = this.QuipMentAllTwo.fenceId;
      this.QuipEditData.projectId = this.dataNameForm.projectid;

      const { data: res } = await this.$http.post(
          "alarmRange/managerClient",
          this.QuipEditData
      );

      // 向鹰眼更新监控终端
      let addEntityLength = this.QuipEditData.add.length;
      let addArray = [];
      let arr = []
      if (this.addEntity > addEntityLength) { // 删除
        arr = this.QuipMentAll.add.concat(this.QuipMentAdd).filter(function(v, i, arr) {
          return arr.indexOf(v) === arr.lastIndexOf(v);
        });
        arr.forEach(el => {
          addArray.push(el.userName);
        });
        let dataObj = {
          ak: "VMDTdzBD360GHN3yarevFr4fQ48z7q1Y",
          service_id: 217504,
          fence_id: this.rowFenceId,
          monitored_person: addArray.join(",")
        };
        axios.defaults.baseURL = "";
        if (dataObj.fence_id !== "") {
          const { data: ress } = await this.$http.post(
              "api/v3/fence/deletemonitoredperson",
              qs.stringify(dataObj)
          );
          // this.updateEntity()
        } else {
          this.$message.error("没有ID");
        }
        axios.defaults.baseURL = "http://118.190.38.198:8080/";
      } else { // 增加
        // this.QuipEditData.add.forEach(el => {
        //   addArray.push(el.userName);
        // });
        arr = this.QuipMentAdd.concat(this.QuipMentAll.add).filter(function(v, i, arr) {
          return arr.indexOf(v) === arr.lastIndexOf(v);
        });
        arr.forEach(el => {
          addArray.push(el.userName);
        });
        let dataObj = {
          ak: "VMDTdzBD360GHN3yarevFr4fQ48z7q1Y",
          service_id: 217504,
          fence_id: this.rowFenceId,
          monitored_person: addArray.join(",")
        };
        axios.defaults.baseURL = "";
        if (dataObj.fence_id !== "") {
          const { data: ress } = await this.$http.post(
              "api/v3/fence/addmonitoredperson",
              qs.stringify(dataObj)
          );
          // this.updateEntity()
        } else {
          this.$message.error("没有ID");
        }
        axios.defaults.baseURL = "http://118.190.38.198:8080/";
      }



      // 地图
      if (res.code !== 200) return this.$message.error("管理成员失败");
      this.$message.success("管理成员成功");
      this.mentDialogVisible = false;
      this.quitAllData = [];
      this.QuipMentAdd = [];
      this.QuipMentdata = [];
      this.QuipMentvalue = [];
      this.QuipEditData = {};
      this.fenceListData(this.conditions);
    },
    // 点击表格行
    async rowClick(row) {
      //------ 查询已添加的终端-----
      this.rowFenceId = row.fence_id;
      this.RangeId.rid = row.rangeId;
      this.RangeId.projectId = this.dataNameForm.projectid;
      // 1、获取角色数据
      const { data: res } = await this.$http.get("alarmRange/getMemberList", {
        params: this.RangeId
      });
      this.QuipMentAll = res.data;
      // // 处理已添加数据
      const addUserName = [];
      for (let i = 0; i < res.data.add.length; i++) {
        addUserName.push(res.data.add[i].userName)
      }
      this.addEntityUserName = addUserName;
      // ------------查询鹰眼，获取终端的定位-----------------

      // 请求筛选终端成员
      const { data: res2 } = await this.$http.post(
          "contact/findContact",
          qs.stringify({
            pageSize: 9999,
            pageNum: 1
          })
      );
      let multipleData = [];
      res2.data.list.forEach(element => {
        if (element.type === 2) {
          multipleData.push(element);
        }
      });
      this.cliUserList = multipleData
      this.addEntityPoints = []
      for (let i = 0; i < multipleData.length; i++) {
        for (let j = 0; j < this.addEntityUserName.length; j++) {
          if (multipleData[i].userName == this.addEntityUserName[j]) {
            let location = {
              center: {
                lat: multipleData[i].latitude,
                lng: multipleData[i].longitude
              },
              name: multipleData[i].userName
            }
            this.addEntityPoints.push(location)
          }
        }
      }
      // --------------------------------------------------
      if (row.polygonPath) {
        this.center.lat = row.polygonPath.center[0].lat - 0.0007;
        this.center.lng = row.polygonPath.center[0].lng;
      } else {
        this.center.lat = row.circlePath.center.lat - 0.0007;
        this.center.lng = row.circlePath.center.lng;
      }
      this.zoom = 20;
    },
    onlineClick(row) {
      // this.onlineCenter = null;
      this.cliUserList.forEach(element => {
        if (element.userName == row.user_name) {
          this.center.lat = element.latitude - 0.0004;
          this.center.lng = element.longitude + 0.0006;
          this.onlineCenter = {lng: element.longitude, lat: element.latitude}
        }
      });
    },
    // 省市级联动
    handleChange(value) {

      let province = CodeToText[value[0]];
      let city = CodeToText[value[1]] ? CodeToText[value[1]] : '';
      let area = CodeToText[value[2]] ? CodeToText[value[2]] : '';
      if(province){
        this.areaPosition = province + city + area;
        this.addForm.projectAddress = this.areaPosition;
      }

      // this.location = province + city + area;
      // this.site = value;
      // this.area=province + city + area;

      // this.activePlace=province + city + area;


    },
    getGps(results) {
      // this.gpsLocation = results.Br[0].point;
      if(results){
        this.gpsLocation = results.Hr[0].point;
      }
    },
  }
};
</script>

<style>
/* 去除百度地图标志 */
.BMap_cpyCtrl {
  display: none;
}
.anchorBL {
  display: none;
}
</style>

<style lang="less" scoped>
#mapss {
  .baiduMap {
    width: 100%;
    height: 100%;
    margin-top: 0px;
    position: absolute;
  }
  .map-box-card {
    width: 480px;
    position: absolute;
    top: 20px;
    left: 20px;
    .text {
      font-size: 14px;
    }
    .clearfix:before,
    .clearfix:after {
      display: table;
      content: "";
    }
    .clearfix:after {
      clear: both;
    }
  }
  .map {
    height: 50%;
  }
  .tab {
    .box-card {
      width: 1675px;
      position: fixed;
      bottom: 0;
      .clearfix {
        .el-form {
          float: right;
          margin-right: 30px;
          width: 380px;
          .el-select {
            width: 300px;
          }
        }
      }
    }
  }
  .yuan {
    display: inline-block;
    height: 10px;
    width: 10px;
    background-color: #67c23a;
    border-radius: 50%;
    margin-right: 20px;
    margin-left: 10px;
  }
  .hui {
    background-color: #909399;
  }
}
.el-drawer.ltr {
  margin-left: 12.7%;
  //width: 22% !important;
  margin-top: 4.3%;
  height: 91.2%;
  .el-drawer__header {
    display: none;
  }
  .row-header {
    background-color: #33a7ff;
    color: #fff;
    height: 45px;
    line-height: 45px;
    font-size: 20px;
    font-weight: 700;
    .el-col {
      margin: 0;
      padding: 0;
    }
  }
  .el-input,
  .el-textarea {
    width: 90%;
  }
  .el-form-item__label {
    width: 130px !important;
  }
  .el-form-item {
    margin-bottom: 30px;
  }
}
</style>

<template>
  <el-container class="homeContainer">
    <!-- <my-video ref="myVideo"></my-video> -->
    <!-- 头部区域 -->
    <el-header>
      <!-- 标题框 -->
      <div class="logo">
        <span class="lo">
          <img :src="logoImg.logoImg || picLogo" />
        </span>
        <span class="mi">{{logoImg.systemName}}</span>
      </div>
      <!-- 右边功能栏 -->
      <div class="header-right">
        <div @click="openDetection">
          <img src="../assets/images/2047@2x.png" alt />
        </div>
        <div @click="getWelcome">
          <img src="../assets/images/2009@2x.png" alt />
        </div>
        <div class="hr-two" v-if="roleList.indexOf(12) > -1">
          <el-badge :is-dot="hasPhone" class="item">
            <div @click="getTelephone">
              <img src="../assets/images/2074@2x.png" alt />
            </div>
          </el-badge>
        </div>
        <div class="hr-three" v-if="roleList.indexOf(13) > -1">
          <el-badge :is-dot="hasNews" class="item">
            <div @click="getNews">
              <img src="../assets/images/2075@2x.png" alt />
            </div>
          </el-badge>
        </div>
        <div class="hr-four" @click="getSetUp">
          <img src="../assets/images/2073@2x.png" alt />
        </div>
        <div class="hr-five">
          <img src="../assets/images/p@2x.png" alt />
          <span>{{message}}</span>
        </div>
      </div>
    </el-header>
    <!-- 页面主体 -->
    <div class="centerContainer">
      <!-- 百度地图 -->
      <baidu-map
        :center="center"
        :zoom="zoom"
        @ready="handler"
        class="baiduMap"
        @click="getClickInfo"
        :scroll-wheel-zoom="true"
      >
        <bml-marker-clusterer :averageCenter="true">
          <!-- 进行中 -->
          <bm-marker
            v-for="(marker,index) in markers"
            :position="{lng: marker.lng, lat: marker.lat}"
            :key="index"
            :title="marker.projectAddress"
            ref="changeStytle"
            :icon="{url: greenIcon, size: {width: 25, height: 32}}"
          >
            <bm-label
              :content="marker.projectName+'——'+marker.projectAddress"
              :position="{lng: marker.lng, lat: marker.lat}"
              :labelStyle="{color: 'white', fontSize : '16px',marginLeft:'40px',backgroundColor:'rgba(21,150,255,0.8)',padding:'15px',border:' 1px solid rgba(1, 28, 49, 0.5)',marginTop:'-20px'}"
              v-if="marker.showla"
            />
          </bm-marker>
          <!-- 已结束 -->
          <bm-marker
            v-for="(endMarker, index) in endMarkers"
            :position="{lng: endMarker.lng, lat: endMarker.lat}"
            :key="index +'1'"
            :title="endMarker.projectAddress"
            ref="changeStytle"
            :icon="{url: greyIcon, size: {width: 25, height: 32}}"
          >
            <bm-label
              :content="endMarker.projectName+'——'+endMarker.projectAddress"
              :position="{lng: endMarker.lng, lat: endMarker.lat}"
              :labelStyle="{color: 'white', fontSize : '16px',marginLeft:'40px',backgroundColor:'rgba(21,150,255,0.8)',padding:'15px',border:' 1px solid rgba(1, 28, 49, 0.5)',marginTop:'-20px'}"
              v-if="endMarker.showla2"
            />
          </bm-marker>
        </bml-marker-clusterer>
      </baidu-map>
      <div class="leftForm">
        <div class="left-top">
          <div>
            <div class="title-left">项目概况</div>
            <div class="title-right">全部：{{companyTotal}}</div>
          </div>
          <div id="chartOne" :style="{ height: '165px',width: '350px' }"></div>
        </div>
        <div class="left-middle">
          <div class="middle-t">
            <div>项目列表</div>
            <div>
              <el-radio-group v-model="radio" fill="#ffffff" text-color="#ffffff" @change="radioValue">
                <el-radio :label="''" checked>全部</el-radio>
                <el-radio :label="0">进行中</el-radio>
                <el-radio :label="1">已结束</el-radio>
              </el-radio-group>
            </div>
          </div>
          <div class="">
            <el-input size="small" placeholder="搜索" v-model="queryContent"  class="input-with-select">
              <el-button slot="append" icon="el-icon-search" @click="searchName"></el-button>
            </el-input>
          </div>
          <div class="middle-b">
            <div>
              <el-table :data="list"  :show-header="hiddenHeader">
                <el-table-column prop="pid" label="id" v-if="showID"></el-table-column>
                <el-table-column prop="project_name" label="项目名称，1行显示" width="200" v-if="showName"></el-table-column>
                <el-table-column prop="introduction" label="id" v-if="showIntorduction"></el-table-column>
                <el-table-column fixed="right" label="操作">
                  <template slot-scope="scope">
                    <div @click="detail(scope.row,scope.$index); bttn(scope.row)" :plain="isplain" style="height: 0.6rem;line-height: 0.6rem">{{scope.row.project_name}}</div>
                  </template>
                </el-table-column>
              </el-table>
              <el-pagination
                small
                layout="prev, pager, next"
                :total="total"
                :page-size="pageSize"
                :current-page="pageNum"
                @current-change="handleCurrentChange"
              ></el-pagination>
            </div>
          </div>
        </div>
        <div class="left-bottom" v-if="showAll">
          <div>
            <div class="title-left">终端概况</div>
            <div class="title-right">全部：{{terCount}}</div>
          </div>
          <div id="chartTwo"></div>
        </div>
      </div>
      <div class="rightForm" v-if="showAll">
        <div class="right">
          <div class="right-top">
            <div class="title-left">项目概况</div>
          </div>
          <div class="right-bottom">
            <div>
              <span>负责人：</span>
              <span>{{person}}</span>
            </div>
            <div>
              <span>电话：</span>
              <span>{{phone}}</span>
            </div>
            <div>
              <span>项目简介：</span>
              <div class="introduction">{{introduction}}</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- <div
      :class="['drawerBtn', DetectionDrawer == false?'' : 'drawerBtn-change' ]"
      @click="changeVde"
    >
      <span v-if="DetectionDrawer == false">展开</span>
      <span v-else>收起</span>
    </div>-->
    <!-- 无声侦查对话框 -->
    <!-- <el-drawer
      title="无声侦查"
      center
      :visible.sync="DetectionDrawer"
      direction="rtl"
      class="homeContainer-drawerHome"
      size="460px"
      :modal="false"
    >
      <div class="rtl-header">
        <span>无声侦护</span>
        <img src="../assets/images/组 2008.png" alt @click="setUpHum" />
      </div>
      <div class="rtl-main">
        <div class="rtl-main-top">
          <div class="rtl-main-top-header">
            <div style="float:left;">
              <span class="yuan"></span>
              <span>调度员</span>
            </div>
            <div class="rtl-main-top-header-icon">
              <ul>
                <el-row>
                  <el-col :span="4">
                    <li>
                      <el-switch
                        v-model="StatusValue"
                        active-color="#13ce66"
                        inactive-color="#ff4949"
                      ></el-switch>
                    </li>
                  </el-col>
                  <el-col :span="20">
                    <li>
                      <img src="../assets/images/组 2102.png" alt />
                    </li>
                    <li>
                      <img src="../assets/images/组 2103.png" alt />
                    </li>
                    <li>
                      <img src="../assets/images/组 2104.png" alt />
                    </li>
                    <li>
                      <img src="../assets/images/组 2053.png" alt />
                    </li>
                  </el-col>
                </el-row>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <div class="rtl-vio"></div>
      <div class="rtl-main" style="margin-top:10px;">
        <div class="rtl-main-top">
          <div class="rtl-main-top-header">
            <div style="float:left;">
              <span class="yuan"></span>
              <span>调度员</span>
            </div>
            <div class="rtl-main-top-header-icon">
              <ul>
                <el-row>
                  <el-col :span="4">
                    <li>
                      <el-switch
                        v-model="StatusValue"
                        active-color="#13ce66"
                        inactive-color="#ff4949"
                      ></el-switch>
                    </li>
                  </el-col>
                  <el-col :span="20">
                    <li>
                      <img src="../assets/images/组 2102.png" alt />
                    </li>
                    <li>
                      <img src="../assets/images/组 2103.png" alt />
                    </li>
                    <li>
                      <img src="../assets/images/组 2104.png" alt />
                    </li>
                    <li>
                      <img src="../assets/images/组 2053.png" alt />
                    </li>
                  </el-col>
                </el-row>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <div class="rtl-vio" style="margin-top:35px;"></div>
    </el-drawer>-->

    <!-- 设置无声侦查人员 -->
    <!-- <div class="home-dialoges">
      <el-dialog title="设置默认无声侦护（最多2个）" :visible.sync="SetUpVisible" width="50%" center>
        <el-form ref="SetUpFormRef" :model="SetUpForm" label-width="80px">
          <el-row>
            <el-col :span="8">
              <el-form-item label="检索">
                <el-select v-model="SetUpForm.region" placeholder>
                  <el-option label="姓名" value="shanghai"></el-option>
                  <el-option label="账号" value="beijing"></el-option>
                  <el-option label="电话" value="beijing"></el-option>
                  <el-option label="设备编号" value="beijing"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-input></el-input>
            </el-col>
            <el-col :span="2">
              <el-button type="primary">查询</el-button>
            </el-col>
          </el-row>
        </el-form>

        <el-table
          ref="multipleTable"
          :data="tableData"
          tooltip-effect="dark"
          style="width: 100%"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" width="55"></el-table-column>
          <el-table-column prop="name" label="姓名" width="120"></el-table-column>
          <el-table-column prop="address" label="账号" show-overflow-tooltip></el-table-column>
          <el-table-column prop="num" label="电话" show-overflow-tooltip></el-table-column>
          <el-table-column prop="type" label="工种" show-overflow-tooltip></el-table-column>
          <el-table-column prop="number" label="设备编号" show-overflow-tooltip></el-table-column>
        </el-table>

        <el-pagination :page-size="20" :pager-count="11" layout="prev, pager, next" :total="1000"></el-pagination>
        <span slot="footer" class="dialog-footer">
          <el-button @click="SetUpVisible = false">取 消</el-button>
          <el-button type="primary" @click="SetUpVisible = false">确 定</el-button>
        </span>
      </el-dialog>
    </div>-->

    <!-- 无声侦护终端列表 -->
    <!-- MailTableData -->
    <el-dialog :visible.sync="DetectionDrawer" width="30%" center :modal="false" title="无声侦护">
      <el-table style="width: 100%" @selection-change="handleSelectionChange" :data="multipleSelectionZ">
        <el-table-column type="selection"></el-table-column>
        <el-table-column label="在线状态">
          <template slot-scope="scope">
            <span class="yuan" v-if="scope.row.onlineStatus != 0"></span>
            <span class="yuan , hui" v-else></span>
          </template>
        </el-table-column>
        <el-table-column label="账号类型">
          <span>终端用户</span>
        </el-table-column>
        <el-table-column label="姓名" prop="name"></el-table-column>
        <el-table-column label="工种名称" prop="workType"></el-table-column>
      </el-table>
      <el-pagination
        @current-change="MailhandleCurrentChange"
        :current-page="this.postmaildata.pageNum"
        :page-size="this.postmaildata.pageSize"
        layout="total, prev, pager, next"
        :total="postmaildata.mailTotal"
      ></el-pagination>
      <span slot="footer" class="dialog-footer">
        <el-button @click="DetectionDrawer = false">取 消</el-button>
        <el-button type="warning" @click="inviteVideoOnoToOne(5)">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 设置弹框 -->
    <el-dialog title="设置" :visible.sync="SetUpDialogVisible" width="20%" class="dialog-setup">
      <div @click="editName">修改姓名</div>
      <div @click="editPassword">修改密码</div>
      <div @click="LogoutEvent">退出登录</div>
    </el-dialog>
    <!-- 更改姓名弹框 -->
    <el-dialog title="修改姓名" :visible.sync="editNameVisible" width="30%" center>
      <el-form ref="form" :model="form" label-width="80px">
        <el-form-item label="姓名：">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editNameVisible = false">取 消</el-button>
        <el-button @click="editNameTrue">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 修改密码弹框 -->
    <el-dialog title="修改密码" :visible.sync="editPassVisible" width="30%" center>
      <el-form ref="form" :model="form" label-width="20%">
        <el-form-item label="原密码：">
          <el-input v-model="form.oldPassword" placeholder="请输入原密码"></el-input>
        </el-form-item>
        <el-form-item label="新密码：">
          <el-input v-model="form.newPassword" placeholder="请输入新密码，6-20位，数字、字母、字符组成"></el-input>
        </el-form-item>
        <el-form-item label="重复密码：">
          <el-input v-model="form.Passwordes" placeholder="再次输入密码"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editPassVisible = false">取 消</el-button>
        <el-button @click="editPasswordTrue">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 退出登录 -->
    <el-dialog title="提示" :visible.sync="SignOutVisible" width="30%">
      <span>真的要退出登录吗</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="SignOutVisible = false">取 消</el-button>
        <el-button type="primary" @click="SignOutVisible = false">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 视频通话接听 -->
    <!-- <el-dialog
      class="calldialog"
      title="username"
      :visible.sync="iscall"
      :close-on-click-modal="false"
      width="30%"
      :center="true"
    >
      <span style="text-align:center;display:inline-block;width:100%;">视频等待接通中。。。</span>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="isVideo">接 听</el-button>
        <el-button type="primary" @click="iscall = false">挂 断</el-button>
      </span>
    </el-dialog>-->
  </el-container>
</template>

<script>
import picLogo from "../assets/indexlogo.png";
import qs from "qs";
import { BmlMarkerClusterer } from "vue-baidu-map";
import chart1 from "../echarts/chart1.js";
import chart2 from "../echarts/chart2.js";
import greyIcon from "../assets/grey.png";
import greenIcon from "../assets/green.png";
import { createNamespacedHelpers } from "vuex";
// import { createSocket, sendWSPush, closeWS } from "../plugins/socket";
const { mapState, mapActions } = createNamespacedHelpers("home");
const { mapState: logoState } = createNamespacedHelpers("login");
export default {
  inject: ["reload"],
  data() {
    return {
      center: { lng: 104, lat: 30 },
      zoom: 6,
      markers: [],
      projectList: [],
      endMarkers: [],
      endList: [],
      radio: "",
      queryContent: "",
      showID: false,
      showIntorduction: false,
      companyTotal: "",
      showAll: false,
      person: "",
      phone: "",
      introduction: "",
      terCount: "",
      // 无声侦查对话框
      DetectionDrawer: false,
      drawerButton: false,
      // 视频状态按钮
      StatusValue: true,
      SetUpVisible: false,
      // 无声侦查弹框查询数据
      SetUpForm: {
        name: "",
        region: ""
      },
      // 无声侦查弹框表单数据
      tableData: [
        {
          date: "2016-05-03",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄",
          num: "",
          type: "",
          number: ""
        },
        {
          date: "2016-05-03",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄",
          num: "",
          type: "",
          number: ""
        },
        {
          date: "2016-05-03",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄",
          num: "",
          type: "",
          number: ""
        }
      ],
      multipleSelection: [],
      // 设置弹框
      SetUpDialogVisible: false,
      // 更改姓名弹框
      editNameVisible: false,
      editPassVisible: false,
      SignOutVisible: false,
      form: {
        name: "",
        oldPassword: "",
        newPassword: "",
        Passwordes: ""
      },
      message: "", //用户名称,
      hasNews: false,
      picLogo: picLogo,
      hasPhone: false,
      iscall: false,
      videoParams: "",
      roomId: 0,
      showName: false,
      isplain: true,
      hiddenHeader: false,
      dataList: {
        type: "",
        param: "",
        pageSize: 3,
        pageNum: 1
      },
      roleList: [],
      greyIcon: greyIcon,
      greenIcon: greenIcon,
      multipleSelectionZ: [],
      projectId: null,
      sxdata: true,
      postmaildata: {
        pageSize: 6,
        pageNum: 1,
        mailTotal:0
      },
    };
  },
  mounted() {
    // window.location.reload();
    // (sessionStorage.getItem("isclose"));
    // if (sessionStorage.getItem("isclose") == "true") {
    //   window.location.reload();
    //   sessionStorage.setItem("isclose", false);
    // }
    let chartOne = this.$echarts.init(document.getElementById('chartOne'))
    chartOne.resize();
    this.projectFormAsync();
    this.drawChart1();
    this.getState();
    this.getPhoneState();
    this.getRoleData();
    // this.initSocket(); //初始化websocket
    // window.addEventListener("onmessageWS", this.getDataFunc); //监听数据接收事件
    // this.closeVideo(); // 挂断
    // this.getClientList();
  },
  // onshow() {
  //   this.reload();
  // },
  activated() {
    // this.getDataFunc()
  },
  computed: {
    ...mapState(["pageNum", "pageSize", "status", "list", "total"]),
    ...logoState(["logoImg"])
  },
  created() {
    // this.getData();
    this.getMessage();
    this.getRoleData();
    this.sxym();
    // this.createLink();
  },
  methods: {
    // 定时刷新页面
    sxym() {
      // if (this.sxdata == true) {
      //   this.reload();
      //   this.sxdata = false;
      // }
    },

    //获取登录时保存在session中的权限数据,在加载百度地图时加载
    getRoleData() {
      ("触发home页面");

      ("home权限数据", localStorage.roleData);
      // ("获取权限");

      let arr = localStorage.roleData.split(",");
      arr = arr.map(Number);
      // arr = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13];
      this.roleList = arr;
      // ("sessionStorage.isReL", sessionStorage.isReL);
      // (sessionStorage.isReL == undefined);
      // if (sessionStorage.isReL == undefined) {
      //   this.reload();
      //   sessionStorage.isReL = false;
      // }

      window.dispatchEvent(
        new CustomEvent("myVideoEvent", {
          detail: {
            data: user
          }
        })
      );
      // sessionStorage.isReL = true;
      // if (sessionStorage.isReL == "true") {
      //   this.reload();
      //   sessionStorage.isReL = false;
      // }

      // v-if="this.roleList.indexOf(13) > -1"
      // ("当前用户角色权限", this.roleList);
    },
    // 获取用户名称
    getMessage() {
      // this.message = this.$route.query.name;
      //从sessionStorage中获取用户的类型
      // ("用户名称", sessionStorage.objName);
      if (this.$route.query.AllMess !== "") {
        this.message = this.$route.query.AllMess;
      }
      // ("用户名称123", sessionStorage.objName);
      ("用户名称123", localStorage.objName);

      // var infostr = sessionStorage.objName;
      var infostr = localStorage.objName;
      var objName = JSON.parse(infostr);
      // ("用户名", objName);
      this.message = objName;
      // this.reload();

      // ("用户名称2", sessionStorage.objName);
    },
    ...mapActions([
      "companyInforAsync",
      "projectFormAsync",
      "terminalCountAsync",
      "getProjectAsync",
      "newsStateAsync",
      "phoneStateAsync"
    ]),
    //消息中心状态
    async getState() {
      const data = await this.newsStateAsync();
      if (data.length == 0) {
        this.hasNews = false;
      } else if (data.length > 0) {
        this.hasNews = true;
      }
    },
    //未接来电状态
    async getPhoneState() {
      const data = await this.phoneStateAsync();
      if (data.length == 0) {
        this.hasPhone = false;
      } else if (data.length > 0) {
        this.hasPhone = true;
      }
    },
    // 跳回页面
    getWelcome() {
      if (this.$route.query.AllRole == 1) {
        this.AllRoleone = 1;
      }
      this.$router.push({
        path: "/welcome",
        query: {
          name: this.message,
          AllMess: this.message,
          AllRole: this.AllRoleone
        }
      });
    },
    //radio状态
    radioValue() {
      this.$store.commit("home/initStatus", this.radio);
      this.projectFormAsync();
    },
    //按名字模糊搜索
    searchName() {
      this.$store.commit("home/changePage", 1);
      this.$store.commit("home/initSearch", this.queryContent);
      this.projectFormAsync();
    },
    detail(prop, index) {
      ("无声侦护", prop);

      this.projectId = prop.pid;
      this.showAll = true;
      this.drawChart2();
      this.latitude = prop.latitude;
      this.longitude = prop.longitude;
      this.person = prop.person_in_charge;
      this.phone = prop.pic_phone;
      this.introduction = prop.introduction;
      //点击切换项目位置
      this.center.lng = prop.longitude;
      this.center.lat = prop.latitude;
      ("center", this.center);

      // 无声侦护弹窗出现
      // this.DetectionDrawer = true;
      //点击地图项目名称出现
      let arr = this.markers.reverse();
      // ("1", this.markers);
      for (let i = 0; i < arr.length; i++) {
        arr[i].showla = true;
      }
      this.markers.reverse();
      //结束项目
      let arr2 = this.endMarkers.reverse();
      for (let j = 0; j < arr2.length; j++) {
        arr2[j].showla2 = true;
      }
      this.endMarkers.reverse();
      this.zoom = 20;
    },
    //分页
     
    handleCurrentChange(val) {
      this.$store.commit("home/changePage", val);
      this.projectFormAsync();
    },
    //百度地图
    async handler({ BMap, map }) {
      let mapStyle = { style: "midnight" };
      map.setMapStyle(mapStyle);
      //进行中项目
      const data1 = await this.getProjectAsync({
        status: 0
      });
      this.projectList = data1;
      for (let i = 0; i < this.projectList.length; i++) {
        const position = {
          lng: this.projectList[i].longitude,
          lat: this.projectList[i].latitude,
          projectAddress: this.projectList[i].address,
          projectName: this.projectList[i].projectName,
          showla: false
        };
        await this.markers.push(position);
      }
      //已结束项目
      const data2 = await this.getProjectAsync({
        status: 1
      });
      this.endList = data2;
      for (let j = 0; j < this.endList.length; j++) {
        const position2 = {
          lng: this.endList[j].longitude,
          lat: this.endList[j].latitude,
          projectAddress: this.endList[j].address,
          projectName: this.endList[j].projectName,
          showla2: false
        };
        await this.endMarkers.push(position2);
      }

      // this.getRoleData();
    },
    getClickInfo(e) {
      // (e.point.lng);
      // (e.point.lat);
      this.center.lng = e.point.lng;
      this.center.lat = e.point.lat;
    },
    //引入图表企业概况
    async drawChart1() {
      const data = await this.companyInforAsync();
      this.companyTotal = data[1].value;
      let newData = [data[0], data[2]];
      Object.assign(chart1.data1, newData);
      let firstChart = this.$echarts.init(document.getElementById("chartOne"));

      if (
        chart1.series[0].data[0].value == 0 ||
        chart1.series[0].data[1].value == 0
      ) {
        chart1.series[0].itemStyle.normal.labelLine.show = false;
        chart1.series[0].itemStyle.normal.label.show = false;
      } else {
        chart1.series[0].itemStyle.normal.labelLine.show = true;
        chart1.series[0].itemStyle.normal.label.show = true;
      }
      firstChart.setOption(chart1);
    },
    async drawChart2() {
      let projectId = this.projectId;
      const data = await this.terminalCountAsync({ projectId: projectId });
      this.terCount = data[1].value;
      let newData = [data[0], data[2]];
      Object.assign(chart2.data2, newData);
      let secondChart = this.$echarts.init(document.getElementById("chartTwo"));
      if (
        chart2.series[0].data[0].value == 0 ||
        chart2.series[0].data[1].value == 0
      ) {
        chart2.series[0].itemStyle.normal.labelLine.show = false;
        chart2.series[0].itemStyle.normal.label.show = false;
      } else {
        chart2.series[0].itemStyle.normal.labelLine.show = true;
        chart2.series[0].itemStyle.normal.label.show = true;
      }
      secondChart.setOption(chart2);
    },
    // 点击按钮收缩视频框
    changeVde() {
      this.DetectionDrawer = !this.DetectionDrawer;
    },
    bttn(row) {
      // ("无声侦护", row);
      sessionStorage.pid = row.pid;
    },
    // 点击无声侦查设置人员
    async setUpHum() {
      // (sessionStorage.pid);

      this.dataList.projectId = sessionStorage.pid * 1;
      // (this.dataList);

      // const {data:res} = await this.$http.get('device/findDevicesBy',{params:this.dataList})
      this.SetUpVisible = true;
    },
    // 无声侦查弹框表单多选框
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    // 点击跳转到未接电话栏
    getTelephone() {
      this.$router.push({ path: "/telephone", query: { name: this.message } });
    },
    // 打开设置弹框
    getSetUp() {
      this.SetUpDialogVisible = true;
    },

    // 点击跳转到消息中心栏
    getNews() {
      // sessionStorage.setItem("token", "true");
      this.$router.push({ path: "/news", query: { name: this.message } });
    },
    // 点击更改姓名弹框
    editName() {
      this.SetUpDialogVisible = false;
      this.editNameVisible = true;
    },
    //修改名称
    async editNameTrue() {
      const { data: res } = await this.$http.post(
        "user/modifyName",
        qs.stringify(this.form)
      );
      if (res.code !== 200) return this.$message.error(res.message);
      this.$message.success("修改姓名成功");
      this.editNameVisible = false;
      this.message = this.form.name;
      localStorage.objName = this.form.name;
      // this.$router.push("/login");
    },
    // 点击更改密码
    editPassword() {
      this.SetUpDialogVisible = false;
      this.editPassVisible = true;
    },
    // 更改密码
    async editPasswordTrue() {
      if (this.form.Passwordes !== this.form.newPassword)
        return this.$message.error("请输入一样的密码");
      const { data: res } = await this.$http.post(
        "user/modifyPassWord",
        qs.stringify(this.form)
      );
      if (res.code !== 200) return this.$message.error(res.message);
      this.$message.success("修改密码成功");
      this.editPassVisible = false;
      this.$router.push("/login");
    },
    // 退出登录
    async LogoutEvent() {
      const yesDeleteData = await this.$confirm(
        "此操作将退出登录, 是否继续?", "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      ).catch(err => err);
      if (yesDeleteData != "confirm") {
        return this.$message.info("取消登出账号");
      }
      const { data: res } = await this.$http.get("admin/logout");
      if (res.code !== 200) {
        return this.$message(res.message);
      }
      if (res.code == 200) this.$message.success("退出登录成功");
      sessionStorage.clear();
      localStorage.clear();
      let url = window.location.href;
      let urlone = url.split("?");
      window.location.href = urlone[0];
      this.$router.push("/login");

      // this.$router.push("/login");
    },
    // //初始化websocket
    initSocket() {
      // ("---initsocket---");
      let userinfor = JSON.parse(localStorage.getItem("user"));
      // ("222", userinfor);
      // this.$refs.myVideo.$emit('videoMethod', userinfor);
      // this.createSocket(userinfor);
      window.dispatchEvent(
        new CustomEvent("myVideoEvent", {
          detail: {
            data: userinfor
          }
        })
      );
    },
    // //发送socket数据
    // sendSocket(data) {
    //   ("----send-----");
    //   sendWSPush(data);
    // }
    //无声侦护
    openDetection() {
      this.getClientList();
    },
    // 无声侦护终端数据
    async getClientList() {
      // 请求筛选终端成员
      if (this.projectId == null) {
        this.$message.error("请先选择项目");
      } else {
        this.DetectionDrawer = true;
        let params = {
          projectId: this.projectId,
          pageSize: 6,
          pageNum: this.postmaildata.pageNum,
          status: 1
        };
        const { data: res2 } = await this.$http.get("/client/findByStatus", {
          params
        });
        this.multipleSelectionZ = [];
        this.postmaildata.mailTotal = res2.data.total
        res2.data.list.forEach(element => {
          this.multipleSelectionZ.push(element);
        });
      }
    },
       // 无声侦护终端数据分页
    MailhandleCurrentChange(val) {
      this.postmaildata.pageNum = val;
      this.getClientList();
    },
    inviteVideoOnoToOne(e) {
      this.DetectionDrawer = false;
      localStorage.setItem("fullScreen", true);
      window.dispatchEvent(
        new CustomEvent("inviteFull", {
          detail: {
            full: 0,
            id: 4,
            userinfor: JSON.parse(localStorage.getItem("user")),
            targetType: this.multipleSelection[0].type == "1" ? "d" : "z",
            type: this.multipleSelection[0].type == "1" ? "d2d" : "d2z",
            multipleSelection: this.multipleSelection
          }
        })
      );
    }
  },
  components: {
    BmlMarkerClusterer
  }
};
</script>
<style lang="less" scoped>
.homeContainer {
  height: 100%;
}
.el-header {
  height: 80px !important;
  line-height: 80px;
  background: linear-gradient(
    199deg,
    rgba(51, 167, 255, 1) 0%,
    rgba(0, 103, 248, 1) 100%
  );
  .logo {
    float: left;
    height: 80px;
    line-height: 80px;
    .lo {
      width: 84px;
      height: 42px;
      font-size: 30px;
      font-family: DIN;
      font-weight: bold;
      line-height: 42px;
      color: rgba(255, 255, 255, 1);
      img {
        vertical-align: middle;
        margin-top: 5px;
        height: 90%;
      }
    }
    .mi {
      margin-left: 10px;
      width: 336px;
      height: 42px;
      font-size: 24px;
      font-family: Microsoft YaHei;
      font-weight: bold;
      line-height: 42px;
      color: rgba(255, 255, 255, 1);
    }
  }
  .header-right {
    float: right;
    div {
      // display: table-cell;
      position: relative;
      float: left;
      height: 100%;
      width: 80px;
      text-align: center;
      vertical-align: middle;
      img {
        display: inline-block;
        width: 100%;
        height: 100%;
      }
    }
    div:nth-child(1) {
      img {
        margin-top: 20px;
        width: 50%;
        height: 50%;
      }
    }
    div:nth-child(2) {
      img {
        margin-top: 20px;
        width: 50%;
        height: 50%;
      }
    }
    .hr-two {
      img {
        margin-top: -10px !important;
        width: 80px !important;
        height: 80px !important;
      }
    }
    .hr-three {
      img {
        margin-top: -10px !important;
        width: 80px !important;
        height: 80px !important;
      }
    }
    .hr-five {
      text-align: center;
      vertical-align: middle;
      width: 160px;
      img {
        // display: inline-block;
        text-align: center;
        vertical-align: middle;
        width: 40px;
        height: 40px;
      }
      span {
        font-size: 14px;
        color: rgba(255, 255, 255, 1);
        margin-left: 5px;
      }
    }
    .item {
      margin-top: 10px;
      margin-right: 40px;
    }
  }
}
.el-main {
  background-color: #fff;
  height: 100%;
}
.centerContainer {
  width: 100%;
  height: 100%;
}
.baiduMap {
  width: 100%;
  height: 100%;
  margin-top: 0px;
  z-index: 1;
  position: absolute;
}
// 左边
.leftForm {
  //width: 370px;
  height: 100%;
  background-color: transparent;
  z-index: 999;
  position: absolute;
  color: rgba(255, 255, 255, 1);
}
.leftForm > div {
  padding-top: 15px;
  margin-left: 15px;
  min-width: 350px;
  border: 1px solid rgba(255, 255, 255, 0.8);
  background: rgba(1, 28, 49, 0.5);
  border-radius: 10px;
  margin-top: 15px;
}
.left-top {
  //height: 200px;
}
.left-top > div:nth-of-type(1) {
  //height: 10%;
  //width: 350px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.title-left {
  margin-left: 20px;
  font-size: 16px;
}
.title-right {
  margin-right: 20px;
  font-size: 14px;
}
.left-top > div:nth-of-type(2) {
  //height: 90%;
  width: 100%;
}
.left-middle {
  min-height: 5rem;
}
.left-middle > div {
  width: 90%;
  margin: 10px auto;
}
.middle-t {
  display: flex;
  align-items: center;
  font-size: 0.3rem;
  height: 0.6rem;
}
.middle-t > div:nth-of-type(1) {
 margin-right: 10px;
 line-height: 0.6rem;
}
.middle-m {
  height: 40px;
  /* background-color: yellowgreen; */
  position: relative;
}
.middle-m > input {
  -web-kit-appearance: none;
  -moz-appearance: none;
  font-size: 14px;
  border-radius: 4px;
  font-family: Microsoft YaHei;
  font-weight: 400;
  border: 1px solid #c8cccf;
  color: white;
  padding-left: 15px;
  background-color: transparent;
}
.middle-m > input:focus {
  border-radius: 4px;
}
.middle-m > i {
  display: inline-block;
  width: 22px;
  height: 22px;
  position: absolute;
  z-index: 999;
  left: 285px;
  top: 7px;
  background-repeat: no-repeat;
  background-size: 100% 100%;
  background-image: url("../assets/search.png");
  cursor: pointer;
}
.middle-b {
  height: 300px;
}
.middle-b > div {
  width: 90%;
  height: 100%;
  margin: 0 auto;
}
.middle-b > div > p {
  font-size: 14px;
  border-bottom: 1px solid white;
  padding: 0 0 10px 5px;
}

.el-pagination {
  text-align: left;
  margin-top: 15px;
}
canvas {
  width: 200px;
  height: 170px;
}
.left-bottom {
  width: 100%;
  height: 200px;
}
.left-bottom > div:nth-of-type(1) {
  height: 10%;
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.left-bottom > div:nth-of-type(2) {
  height: 90%;
  width: 100%;
}
.rightForm {
  width: 370px;
  height: 300px;
  background-color: transparent;
  z-index: 1000;
  position: absolute;
  left: 80.6%;
  color: rgba(255, 255, 255, 1);
}
.rightForm > div {
  width: 350px;
  border: 1px solid rgba(255, 255, 255, 0.8);
  background: rgba(1, 28, 49, 0.5);
  border-radius: 10px;
  margin-top: 15px;
  margin-left: 2px;
  height: 265px;
}
.right-top {
  height: 310px;
}
.right > div:nth-of-type(1) {
  height: 10%;
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.right > div:nth-of-type(2) {
  height: 90%;
  width: 100%;
}
.right-bottom > div {
  display: flex;
  margin-top: 10px;
  font-size: 14px;
}
.right-bottom > div > span:nth-of-type(1) {
  width: 80px;
  margin-left: 20px;
}
.right-bottom > div:nth-of-type(3) {
  width: 100%;
  height: 150px;
}
.right-bottom > div:nth-of-type(3) > span {
  width: 700px;
}
.right-bottom > div:nth-of-type(3) > div {
  height: 160px;
  overflow-y: auto;
}
.introduction {
  width: 2100px;
  height: 100%;
}
.drawerBtn {
  position: absolute;
  right: 0;
  top: 50%;
  // margin-top: -50%;
  // background-color: blue;
  z-index: 60000;
  height: 50px;
  width: 25px;
  vertical-align: middle;
  transform: all 0.22s ease !important;
  cursor: pointer;
  span {
    height: 100%;
    width: 100%;
    font-size: 16px;
    line-height: 16px;
    text-align: center;
    color: #fff;
  }
  background: rgba(1, 28, 49, 0.5);
}
.drawerBtn-change {
  cursor: pointer;
  margin-right: 460px;
  background: rgba(1, 28, 49, 0.5);
  transform: all 0.22s ease;
}
.header-right div {
  cursor: pointer;
}
.dialog-setup {
  text-align: center;
  .el-dialog__body {
    div {
      cursor: pointer;
      height: 50px;
      line-height: 50px;
      font-weight: 700;
      font-size: 18px;
    }
  }
}
// /deep/.homeContainer-drawerHome .el-drawer__open {
//   border: 0 !important;
//   overflow: hidden !important;
// }
// /deep/.homeContainer-drawerHome .el-drawer__container {
//   overflow: hidden;
//   border: 0;
// }
.home-dialoges {
  z-index: 99999;
}
</style>

<style >
.leftForm .el-radio__input.is-checked .el-radio__inner {
  border-color: #409eff;
  background: #409eff;
}
.leftForm .el-radio__input.is-checked + .el-radio__label {
  color: white;
}
.leftForm .el-radio {
  color: #999999;
  padding: 0 5px;
}
.leftForm .el-radio__label {
  font-size: 12px;
  padding-left: 5px;
}
/* 表单样式修改 */
.leftForm .el-table {
  background-color: transparent;
  color: white;
}
.leftForm .el-table thead {
  color: white;
}
.leftForm .el-table td,
.el-table th.is-leaf {
  border-bottom: 1px solid white;
}
.leftForm .el-table th,
.el-table tr {
  background-color: transparent;
}
.leftForm .el-table--enable-row-hover .el-table__body tr:hover > td {
  background-color: #1596ff !important;
  cursor: pointer;
  opacity: 0.5;
  border: none;
  color: white;
}
.leftForm .el-table__body tr.hover-row > td {
  background-color: transparent;
}
/* 分页样式 */
.leftForm .el-pagination button:disabled {
  color: white;
  background-color: transparent;
}
.leftForm .el-pagination .btn-next,
.el-pagination .btn-prev {
  background-color: transparent;
  color: white;
}
.leftForm .el-pagination--small .el-pager li {
  background-color: transparent;
  color: white;
}
.leftForm .el-pager li.active {
  color: #409eff;
  cursor: default;
}
/* 去除百度地图标志 */
.BMap_cpyCtrl {
  display: none;
}
.anchorBL {
  display: none;
}

/* 滚动条样式 */
.leftForm ::-webkit-scrollbar {
  width: 6px;
  height: 40px;
}
.leftForm ::-webkit-scrollbar-thumb {
  background-color: #03a7ff;
  border-radius: 3px;
  border: none;
}
.leftForm ::-webkit-scrollbar-thumb {
  background-color: #03a7ff;
  border-radius: 3px;
  border: none;
}
/* .homeContainer .drawerBtn {
  background-color: pink;
  z-index: 2000;
} */
.homeContainer-drawerHome .el-dialog__wrapper {
  z-index: 99000 !important;
  border: 0 !important;
  overflow: hidden !important;
}
.homeContainer-drawerHome .el-drawer.rtl {
  margin-top: 81px;
  height: 855px;
  /* margin-right: 18px; */
  border-radius: 10px;
  border: 1px solid rgba(255, 255, 255, 0.8);
  z-index: 99000 !important;
}
.homeContainer-drawerHome .el-drawer__body {
  z-index: 99000 !important;
}
.homeContainer-drawerHome .el-drawer__body .rtl-header {
  height: 40px;
  line-height: 40px;
  /* background-color: #33a7ff; */
  background: rgba(1, 28, 49, 0.5);
  color: #fff;
  font-size: 18px;
  cursor: pointer;
}
.homeContainer-drawerHome .el-drawer__body .rtl-header span {
  margin-left: 190px;
}
.homeContainer-drawerHome .el-drawer__body .rtl-header img {
  vertical-align: middle;
  display: inline-block;
  margin-left: 150px;
}
.homeContainer-drawerHome .rtl-main-top-header {
  background-color: skyblue;
}
.homeContainer-drawerHome .rtl-main-top-header .yuan {
  display: inline-block;
  height: 10px;
  width: 10px;
  background-color: #67c23a;
  border-radius: 50%;
  margin-right: 20px;
  margin-left: 10px;
}
.homeContainer-drawerHome .rtl-main-top-header .hui {
  background-color: #909399;
}
.homeContainer-drawerHome .rtl-main-top-header .rtl-main-top-header-icon {
  vertical-align: middle;
}
.homeContainer-drawerHome .rtl-main-top-header .rtl-main-top-header-icon ul {
  float: right;
  padding: 0;
  margin: 0;
}
.homeContainer-drawerHome .rtl-main-top-header .rtl-main-top-header-icon ul li {
  list-style: none;
  float: left;
  margin-right: 10px;
}
.homeContainer-drawerHome
  .rtl-main-top-header
  .rtl-main-top-header-icon
  ul
  li
  img {
  vertical-align: middle;
  margin-left: 10px;
}
.homeContainer-drawerHome .rtl-main-top {
  margin-bottom: 2px;
}
.homeContainer-drawerHome .rtl-vio {
  height: 375px;
  width: 100%;
  background-color: #fff;
  margin-top: 25px;
}
.homeContainer-drawerHome .el-drawer__container {
  overflow: hidden;
  border: 0;
}
.homeContainer-drawerHome {
  border: 0;
  width: 100%;
  margin-left: -240px;
}

.homeContainer .el-button--primary {
  background: 0 0;
  padding-left: 0;
  padding-right: 0;
  border: none;
  font-size: 14px;
  color: white;
}
.homeContainer .el-button--primary.is-plain:focus,
.el-button--primary.is-plain:hover {
  background: transparent;
  border-color: transparent;
  color: #409eff;
}
.homeContainer .middle-b .el-pagination--small .arrow.disabled,
.el-table .hidden-columns,
.el-table td.is-hidden > *,
.el-table th.is-hidden > *,
.el-table--hidden {
  visibility: inherit;
}
.el-input--small .el-input__inner{
  height: 0.5rem;
}
</style>

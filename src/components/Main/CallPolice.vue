
<template>
  <div class="caPolice">
    <!-- 百度地图 -->
    <baidu-map
      :center="center"
      :zoom="zoom"
      @ready="handler"
      class="baiduMap"
      :scroll-wheel-zoom="true"
    >
      <!-- <bm-marker
        v-if="isLocation && detailData.userType == 2  && thisUserStatus != 0"
        :position="pointZ"
        :icon="{url: pointDispatcher, size: {width: 40, height: 96}}"
      ></bm-marker>-->
      <!-- && detailData.userType === '终端用户' && thisUserStatus === 1 -->
      <!-- <bm-marker
        v-if="isLocation && detailData.userType == 1 && thisUserStatus == 0"
        :position="pointZ"
        :icon="{url: pointTerminal, size: {width: 40, height: 96}}"
      ></bm-marker>-->
      <bm-marker
        :position="pointz"
        :icon="terminalLocation"
        @click="oneClick"
        v-if="showTerminal"
      ></bm-marker>

      <bm-marker
        v-if="isNowTrack"
        :position="nowTrackMarker"
        animation="BMAP_ANIMATION_BOUNCE"
      ></bm-marker>
      <bm-marker
        v-if="isLocation && thisUserStatus == 0"
        :position="pointZ"
        :icon="{ url: pointOffline, size: { width: 40, height: 96 } }"
      ></bm-marker>
      <bm-polyline
        :path="polylinePath"
        stroke-color="blue"
        :stroke-opacity="0.5"
        :stroke-weight="2"
        :editing="false"
      ></bm-polyline>
      <el-card v-if="nowTrackBtn" class="box-card nowTrackBtn">
        <el-button type="primary" plain @click="stopTrack"
          >停止获取实时轨迹</el-button
        >
      </el-card>
      <!-- @click="getClickInfo" -->
    </baidu-map>
    <div class="callPo">
      <el-container>
        <el-drawer :visible.sync="drawer" direction="ltr" :modal="false">
          <el-form ref="form" :model="form" label-width="80px">
            <el-form-item
              label="起止日期:"
              style="margin-top: 10px; height: 50px; line-height: 50px"
            >
              <el-date-picker
                unlink-panels
                v-model="timeBetween"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                style="width: 320px"
                @change="getTime"
                value-format="yyyy-MM-dd"
              ></el-date-picker>
            </el-form-item>
            <el-form-item label="搜索:">
              <el-row :gutter="20">
                <el-col :span="10" class="el-col-10">
                  <el-input
                    placeholder="输入姓名搜索"
                    v-model="getName"
                  ></el-input>
                </el-col>
                <el-col :span="4" class="el-col-4">
                  <el-button type="primary" @click="query">查询</el-button>
                </el-col>
              </el-row>
            </el-form-item>
          </el-form>
          <!-- 警告点 -->
          <div class="itemDiv">
            <div class="itemDivES">
              <el-badge :is-dot="hasAll" class="item"></el-badge>
            </div>
            <div class="itemDivES">
              <el-badge :is-dot="hasSos" class="item"></el-badge>
            </div>
            <div class="itemDivES">
              <el-badge :is-dot="hasTrack" class="item"></el-badge>
            </div>
            <div class="itemDivES">
              <el-badge :is-dot="hasFall" class="item"></el-badge>
            </div>
            <div class="itemDivES">
              <el-badge :is-dot="hasAway" class="item"></el-badge>
            </div>
            <div class="itemDivES">
              <el-badge :is-dot="hasHigh" class="item"></el-badge>
            </div>

            <!-- <span class="item" v-show="hasAll"></span>
            <span class="item" v-show="hasSos"></span>
            <span class="item" v-show="hasTrack"></span>
            <span class="item" v-show="hasFall"></span>
            <span class="item" v-show="hasAway"></span>
            <span class="item" v-show="hasHigh"></span>-->
          </div>

          <!-- tab切换栏 -->
          <el-tabs type="card" :stretch="true" v-model="activeName" @tab-click="handleClick">
            <el-tab-pane label="全部">
              <div class="tableContainer">
                <el-table :data="list" class="tabone"  @row-click="details">
                  <el-table-column align="center" prop="bid" label="ID" v-if="showId"></el-table-column>
                  <el-table-column align="center" prop="workType" label="工种名称"></el-table-column>
                  <el-table-column align="center" prop="name" label="姓名"></el-table-column>
                  <el-table-column align="center" prop="content" label="内容"></el-table-column>
                  <el-table-column align="center" prop="recordTime" label="时间"></el-table-column>
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
            </el-tab-pane>

            <el-tab-pane label="SOS报警">
              <div class="tableContainer">
                <el-table :data="list" class="tabone" @row-click="details">
                  <el-table-column
                    align="center"
                    prop="bid"
                    label="ID"
                    v-if="showId"
                  ></el-table-column>
                  <el-table-column
                    align="center"
                    prop="workType"
                    label="工种名称"
                  ></el-table-column>
                  <el-table-column
                    align="center"
                    prop="name"
                    label="姓名"
                  ></el-table-column>
                  <el-table-column
                    align="center"
                    prop="content"
                    label="内容"
                  ></el-table-column>
                  <el-table-column
                    align="center"
                    prop="recordTime"
                    label="时间"
                  ></el-table-column>
                  <el-table-column align="center" label="操作">
                    <template slot-scope="scope">
                      <el-button
                        type="text"
                        size="small"
                        @click="details(scope.row, scope.$index)"
                        >详情</el-button
                      >
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
            </el-tab-pane>

            <el-tab-pane label="围栏报警">
              <div class="tableContainer">
                <el-table :data="list" class="tabone" @row-click="details">
                  <el-table-column
                    align="center"
                    prop="bid"
                    label="ID"
                    v-if="showId"
                  ></el-table-column>
                  <el-table-column
                    align="center"
                    prop="workType"
                    label="工种名称"
                  ></el-table-column>
                  <el-table-column
                    align="center"
                    prop="name"
                    label="姓名"
                  ></el-table-column>
                  <el-table-column
                    align="center"
                    prop="content"
                    label="内容"
                  ></el-table-column>
                  <el-table-column
                    align="center"
                    prop="recordTime"
                    label="时间"
                  ></el-table-column>
                  <el-table-column align="center" label="操作">
                    <template slot-scope="scope">
                      <el-button
                        type="text"
                        size="small"
                        @click="details(scope.row, scope.$index)"
                        >详情</el-button
                      >
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
            </el-tab-pane>

            <el-tab-pane label="跌落报警">
              <div class="tableContainer">
                <el-table :data="list" class="tabone" @row-click="details">
                  <el-table-column
                    align="center"
                    prop="bid"
                    label="ID"
                    v-if="showId"
                  ></el-table-column>
                  <el-table-column
                    align="center"
                    prop="workType"
                    label="工种名称"
                  ></el-table-column>
                  <el-table-column
                    align="center"
                    prop="name"
                    label="姓名"
                  ></el-table-column>
                  <el-table-column
                    align="center"
                    prop="content"
                    label="内容"
                  ></el-table-column>
                  <el-table-column
                    align="center"
                    prop="recordTime"
                    label="时间"
                  ></el-table-column>
                  <el-table-column align="center" label="操作">
                    <template slot-scope="scope">
                      <el-button
                        type="text"
                        size="small"
                        @click="details(scope.row, scope.$index)"
                        >详情</el-button
                      >
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
            </el-tab-pane>

            <el-tab-pane label="脱离报警">
              <div class="tableContainer">
                <el-table :data="list" class="tabone" @row-click="details">
                  <el-table-column
                    align="center"
                    prop="bid"
                    label="ID"
                    v-if="showId"
                  ></el-table-column>
                  <el-table-column
                    align="center"
                    prop="workType"
                    label="工种名称"
                  ></el-table-column>
                  <el-table-column
                    align="center"
                    prop="name"
                    label="姓名"
                  ></el-table-column>
                  <el-table-column
                    align="center"
                    prop="content"
                    label="内容"
                  ></el-table-column>
                  <el-table-column
                    align="center"
                    prop="recordTime"
                    label="时间"
                  ></el-table-column>
                  <el-table-column align="center" label="操作">
                    <template slot-scope="scope">
                      <el-button
                        type="text"
                        size="small"
                        @click="details(scope.row, scope.$index)"
                        >详情</el-button
                      >
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
            </el-tab-pane>

            <el-tab-pane label="高空报警" class="policetabs">
              <div class="tableContainer">
                <el-table :data="list" class="tabone" @row-click="details">
                  <el-table-column
                    align="center"
                    prop="bid"
                    label="ID"
                    v-if="showId"
                  ></el-table-column>
                  <el-table-column
                    align="center"
                    prop="workType"
                    label="工种名称"
                  ></el-table-column>
                  <el-table-column
                    align="center"
                    prop="name"
                    label="姓名"
                  ></el-table-column>
                  <el-table-column
                    align="center"
                    prop="content"
                    label="内容"
                  ></el-table-column>
                  <el-table-column
                    align="center"
                    prop="recordTime"
                    label="时间"
                  ></el-table-column>
                  <el-table-column align="center" label="操作">
                    <template slot-scope="scope">
                      <el-button
                        type="text"
                        size="small"
                        @click="details(scope.row, scope.$index)"
                        >详情</el-button
                      >
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
            </el-tab-pane>
          </el-tabs>
        </el-drawer>

        <!-- 控制按钮 -->
        <div
          :class="['retra', drawer == false ? '' : 'retses']"
          @click="shrink"
        >
          <!-- <img src="../../assets/images/jiantou.png" alt /> -->
          <span v-if="drawer == true">收起</span>
          <span v-else>展开</span>
        </div>
        <!-- 成员信息表 -->
        <!-- 成员信息弹框 -->
        <div class="dia-1">
          <el-dialog
            title="成员信息"
            :visible.sync="MemberDialogVisible"
            width="30%"
            :modal="false"
          >
            <!-- 主体信息区 -->
            <div class="tabs">
              <div>
                <i>姓名：</i>
                <span>{{ detailData.name }}</span>
              </div>
              <div>
                <i>账号类型：</i>
                <span>终端账号</span>
              </div>
              <div>
                <i>工种：</i>
                <span>{{ detailData.workType }}</span>
              </div>
              <el-divider style="width: 460px"></el-divider>
              <div>
                <i>电池电量：</i>
                <span>{{ detailData.power }}</span>
              </div>
              <div>
                <i>主板温度：</i>
                <span>{{ detailData.mainTemperature }}</span>
              </div>
              <div>
                <i>环境温度：</i>
                <span>{{ detailData.environmentTemperature }}</span>
              </div>
              <div>
                <i>气压：</i>
                <span>{{ detailData.pressure }}</span>
              </div>
              <div>
                <i>网络：</i>
                <span>{{ detailData.network }}</span>
              </div>
              <el-divider style="width: 460px"></el-divider>
              <div>
                <i>时间：</i>
                <span>{{ detailData.time }}</span>
              </div>
              <div>
                <i>经度：</i>
                <span>{{ detailData.longitude }}</span>
              </div>
              <div>
                <i>维度：</i>
                <span>{{ detailData.latitude }}</span>
              </div>
            </div>
            <!-- 底部功能区 -->
            <div class="fn">
              <ul>
                <li @click="inviteVideoOnoToOne(1)" v-if="ifCall">
                  <img src="../../assets/images/2018.png" alt />
                  <p>语音电话</p>
                </li>
                <li @click="inviteVideoOnoToOne(3)" v-if="ifVideo">
                  <img src="../../assets/images/2019.png" alt />
                  <p>视频电话</p>
                </li>
                <li @click="VoiceBroadcast" v-if="ifBroadcast">
                  <img src="../../assets/images/2020.png" alt />
                  <p>语音广播</p>
                </li>
                <li @click="getTraJecJory" v-if="ifTrail">
                  <img src="../../assets/images/2021.png" alt />
                  <p>轨迹</p>
                </li>
                <li @click="inviteVideoOnoToOne(5)" v-if="ifListener">
                  <img src="../../assets/images/2022.png" alt />
                  <p>无声侦护</p>
                </li>
              </ul>
            </div>
          </el-dialog>
          <!-- 轨迹查询框 -->
          <el-dialog
            title="提示"
            :visible.sync="trajectoryVisible"
            width="20%"
            center
            :modal="false"
          >
            <!-- 主体部分 -->
            <el-form ref="trackForm" :model="trackForm" label-width="90px">
              <el-form-item label="查看方式：">
                <el-radio v-model="radio" label="1">历史轨迹</el-radio>
                <el-radio v-model="radio" label="2">实时轨迹</el-radio>
              </el-form-item>

              <el-form-item label="开始时间：" v-show="radio === '1'">
                <el-col :span="10">
                  <el-date-picker
                    size="mini"
                    type="date"
                    placeholder="年/月/日"
                    v-model="trackForm.startdate"
                    :picker-options="pickerStart"
                    style="width: 100%"
                  ></el-date-picker>
                </el-col>
                <el-col class="line" :span="2">一</el-col>
                <el-col :span="10">
                  <el-time-picker
                    size="mini"
                    v-model="trackForm.starttime"
                    @blur="startTimeValidator"
                    :disabled="isTimePicker"
                    style="width: 100%"
                  ></el-time-picker>
                </el-col>
              </el-form-item>

              <el-form-item label="结束时间：" v-show="radio === '1'">
                <el-col :span="10">
                  <el-date-picker
                    size="mini"
                    type="date"
                    placeholder="年/月/日"
                    v-model="trackForm.enddate"
                    :picker-options="pickerEnd"
                    style="width: 100%"
                  ></el-date-picker>
                </el-col>
                <el-col class="line" :span="2">一</el-col>
                <el-col :span="10">
                  <el-time-picker
                    size="mini"
                    v-model="trackForm.endtime"
                    :disabled="isTimePicker"
                    @blur="endTimeValidator"
                    style="width: 100%"
                  ></el-time-picker>
                </el-col>
              </el-form-item>

              <el-form-item label="间隔时间：">
                <el-select size="mini" v-model="trackForm.type">
                  <el-option label="10秒" value="1"></el-option>
                  <el-option label="1分钟" value="2"></el-option>
                  <el-option label="5分钟" value="3"></el-option>
                </el-select>
              </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
              <el-button @click="dialogVisible = false">关 闭</el-button>
              <el-button type="primary" @click="getTrack">获得轨迹</el-button>
            </span>
          </el-dialog>
          <!-- 语音广播对话框 -->
          <el-dialog
            title="发送语音广播"
            :visible.sync="VoiceBroadcastVisible"
            width="40%"
            :modal="false"
            :before-close="handleSelectionClose"
          >
            <div class="voices">
              <div class="voice-right">
                <el-row>
                  <el-col :span="8" style="text-align: center">
                    <span>发送方式:</span>
                  </el-col>
                  <el-col :span="4">
                    <el-radio v-model="audioradio" label="1">文字</el-radio>
                  </el-col>
                  <el-col :span="4">
                    <el-radio v-model="audioradio" label="2">语音</el-radio>
                  </el-col>
                </el-row>
                <div class="rimain">
                  <el-form
                    ref="form"
                    :model="recordForm"
                    v-if="audioradio == '1'"
                  >
                    <el-form-item>
                      <el-input
                        type="textarea"
                        v-model="recordForm.content"
                        :rows="12"
                      ></el-input>
                    </el-form-item>
                  </el-form>
                  <el-form
                    ref="form"
                    :model="recordForm"
                    v-if="audioradio == '2'"
                  >
                    <el-form-item>
                      <audio
                        id="audioStream"
                        controls="controls"
                        style="width: 90%"
                      ></audio>
                      <el-button
                        v-if="audioBtn == 0"
                        type="primary"
                        size="mini"
                        class="recordBtn"
                        @click="audioRecord(0)"
                        >录 音</el-button
                      >
                      <el-button
                        v-if="audioBtn == 1"
                        type="danger"
                        size="mini"
                        class="recordBtn"
                        @click="audioRecord(1)"
                        >终 止</el-button
                      >
                      <el-button
                        v-if="audioBtn == 2"
                        type="warning"
                        size="mini"
                        class="recordBtn"
                        @click="audioRecord(2)"
                        >重 录</el-button
                      >
                    </el-form-item>
                  </el-form>
                </div>
                <el-button type="primary" class="bup" @click="sendRecord"
                  >发送</el-button
                >
              </div>
            </div>
          </el-dialog>
        </div>
      </el-container>
    </div>
  </div>
</template>

<script>
import RSfun from "../../assets/js/record.js";
var RS = RSfun();
import pointDispatcher from "../../assets/pointz.png";
import pointTerminal from "../../assets/pointt.png";
import pointOffline from "../../assets/pointh.png";
import { createNamespacedHelpers } from "vuex";
//图标颜色
import L_0C468E from "../../assets/location/0C468E.png";
import L_2DD787 from "../../assets/location/2DD787.png";
import L_3FE5F2 from "../../assets/location/3FE5F2.png";
import L_5C4DC6 from "../../assets/location/5C4DC6.png";
import L_9B5718 from "../../assets/location/9B5718.png";
import L_011C31 from "../../assets/location/011C31.png";
import L_68E1222 from "../../assets/location/68E122.png";
import L_814A94 from "../../assets/location/814A94.png";
import L_1596FF from "../../assets/location/1596FF.png";
import L_009721 from "../../assets/location/009721.png";
import L_C3C3C3 from "../../assets/location/C3C3C3.png";
import L_D32084 from "../../assets/location/D32084.png";
import L_F8EA38 from "../../assets/location/F8EA38.png";
import L_FF3E59 from "../../assets/location/FF3E59.png";
import L_FFB142 from "../../assets/location/FFB142.png";
import L_29710 from "../../assets/location/29710.png";
import L_29711 from "../../assets/location/29711.png";
import qs from "qs";
const { mapState, mapActions } = createNamespacedHelpers("warning");
const {
  mapState: trackState,
  mapActions: trackAction,
} = createNamespacedHelpers("track");
export default {
  data() {
    return {
      // 地图初始位置
      center: { lng: 104.081548, lat: 30.652613 }, // 地图缩放度
      zoom: 15,
      polylinePath: [],
      // 查看成员的在线状态
      thisUserStatus: 0,
      isClickLocation: false,
      pointDispatcher: pointDispatcher,
      pointTerminal: pointTerminal,
      pointOffline: pointOffline,
      // 轨迹查询
      trajectoryVisible: false,
      // 通讯录表单数据
      trackForm: {
        name: "",
        type: "1",
        desc: "",
        startdate: "",
        starttime: "",
        enddate: "",
        endtime: "",
      },
      pickerStart: {
        disabledDate: (time) => {
          if (
            this.trackForm.enddate !== "" &&
            this.trackForm.enddate !== null
          ) {
            return (
              time.getTime() > new Date(this.trackForm.enddate).getTime() ||
              time.getTime() <
                new Date(this.trackForm.enddate).getTime() - 8.64e7
            );
          } else {
            return time.getTime() < Date.now() - 8.64e7 * 365 * 5;
          }
        },
      },
      pickerEnd: {
        disabledDate: (time) => {
          if (
            this.trackForm.startdate !== "" &&
            this.trackForm.startdate !== null
          ) {
            return (
              time.getTime() < new Date(this.trackForm.startdate).getTime() ||
              time.getTime() >
                new Date(this.trackForm.startdate).getTime() + 8.64e7
            );
          } else {
            return time.getTime() < Date.now() - 8.64e7 * 365 * 5;
          }
        },
      },
      radio: "1",
      nowTrackBtn: false,
      // 控制侧边栏显示
      drawer: true,
      direction: "ltl",
      // 表单绑定数据
      form: {},
      // 日期选择绑定数据
      timeBetween: "",
      // 成员信息表弹框
      MemberDialogVisible: false,
      showId: false,
      activeName: "",
      activeValue: "",
      detailData: {},
      getName: "",
      hasAll: false,
      hasSos: false,
      hasTrack: false,
      hasFall: false,
      hasAway: false,
      hasHigh: false,
      //功能配置
      ifCall: true,
      ifVideo: true,
      ifBroadcast: true,
      ifTrail: true,
      ifListener: true,
      // 语音广播对话框
      VoiceBroadcastVisible: false,
      audioradio: "1",
      isNowTrack: false,
      recordForm: {
        content: "",
      },
      audioSrc: "",
      audioBtn: 0, // 录音状态
      audioStream: new FormData(),
      audioMediaStream: null,
      terminalLocation: { url: pointTerminal, size: { width: 40, height: 96 } },
      pointDispatcher: pointDispatcher,
      pointTerminal: pointTerminal,
      showYardMan: false,
      showTerminal: false,
      MemberDialogVisible: false,
      // 查询通讯录成员提交数据
      postmaildata: {
        pageSize: 10000,
        pageNum: 1,
      },
      MailTableData: [],
      rowData: [],
      findDetailData: {},
      findDetliat: {},
    };
  },
  mounted() {
    this.trackForm.enddate = new Date();
    this.trackForm.endtime = new Date();
    this.trackForm.startdate = new Date(
      new Date().getTime() - 24 * 60 * 60 * 1000
    );
    this.trackForm.starttime = new Date(
      new Date().getTime() - 24 * 60 * 60 * 1000
    );
    this.$store.commit("warning/changePage", 1);
    this.warnFormAsync();
    this.warnStates();
    //总后台功能配置
    this.getCall();
    this.getVideo();
    this.getBroadcast();
    this.getTrail();
    this.getListener();
    this.postMailData();
    this.getdw();
    // 监听报警查询数据handleClick
    window.addEventListener("warnStates", this.warnStates);
  },
  computed: {
    ...mapState([
      "pageNum",
      "pageSize",
      "list",
      "total",
      "start",
      "end",
      "getName",
    ]),
    // pointZ() {
    //   let point = JSON.parse(JSON.stringify(this.center));
    //   point.lat += -0.019;
    //   point.lng += -0.009;
    //   return point;
    // },
    pointz() {
      let point = {
        lng: this.detailData.longitude,
        lat: this.detailData.latitude,
      };
      return point;
    },
    pointh() {
      let point = {
        lng: this.detailData.longitude,
        lat: this.detailData.latitude,
      };
      return point;
    },
    isLocation() {
      if (this.isClickLocation === true && this.MemberDialogVisible !== false) {
        return true;
      } else {
        false;
      }
    },
    // 时间选择器是否可用
    isTimePicker() {
      if (
        this.trackForm.startdate !== "" &&
        this.trackForm.startdate !== null &&
        this.trackForm.enddate !== "" &&
        this.trackForm.enddate !== null
      ) {
        return false;
      } else {
        this.trackForm.starttime = "";
        this.trackForm.endtime = "";
        return true;
      }
    },
    nowTrackMarker() {
      if (this.polylinePath.length > 0) {
        let i = this.polylinePath.length - 1;
        var data = {
          lat: this.polylinePath[i].lat,
          lng: this.polylinePath[i].lng,
        };
        this.center = data;
        this.zoom = 20;
      } else {
        var data = {
          // lng: this.findDetliat.longitude + 0.009,
          // lat: this.findDetliat.latitude + 0.016
          lng: this.detailData.longitude,
          lat: this.detailData.latitude,
        };
        this.center = data;
        this.zoom = 20;
      }
      return data;
    },
  },
  methods: {
    ...trackAction(["gettrackAsync", "getLatestPointAsync"]),
    ...mapActions([
      "warnFormAsync",
      "detailsAsync",
      "queryByTimeAsync",
      "queryByNameAsync",
      "warnStateAsync",
      "changeStateAsync",
    ]),
    // 点击报警跳转定位
    async getdw() {
      let datas = {
        page: 1,
        limit: 10,
      };
      const { data: res } = await this.$http.get(

      );

      if (this.$route.query.num == 1) {
        this.details(res.data.list[0]);
      }
    },
    oneClick() {
      this.MemberDialogVisible = true;
    },
    twoClick() {
      this.DispatcherDialogVisible = true;
    },
    // 获取所有账号信息
    async postMailData() {
      const { data: res } = await this.$http.post("contact/findContact", qs.stringify(this.postmaildata));
      this.MailTableData = res.data.list;
      this.getdw();
      // if (this.$route.query.num == 1) {
      //   this.details(this.MailTableData[0]);
      // }
    },
    //功能配置——语音电话
    getCall() {
      let isCall = JSON.parse(sessionStorage.getItem("configIsCall"));
      if (isCall == 0) {
        this.ifCall = true;
      } else if (isCall == 1) {
        this.ifCall = false;
      }
    },
    //功能配置——视频电话
    getVideo() {
      let video = JSON.parse(sessionStorage.getItem("configVedio"));
      if (video == 0) {
        this.ifVideo = true;
      } else if (video == 1) {
        this.ifVideo = false;
      }
    },
    //功能配置——语音广播
    getBroadcast() {
      let broadcast = JSON.parse(sessionStorage.getItem("configBroadcast"));
      if (broadcast == 0) {
        this.ifBroadcast = true;
      } else if (broadcast == 1) {
        this.ifBroadcast = false;
      }
    },
    //功能配置——轨迹
    getTrail() {
      let trail = JSON.parse(sessionStorage.getItem("configTrail"));
      if (trail == 0) {
        this.ifTrail = true;
      } else if (trail == 1) {
        this.ifTrail = false;
      }
    },
    //功能配置——无声侦护
    getListener() {
      let listener = JSON.parse(sessionStorage.getItem("configListener"));
      if (listener == 0) {
        this.ifListener = true;
      } else if (listener == 1) {
        this.ifListener = false;
      }
    },
    //点击tab获取类型值
    async handleClick(tab, event) {
      if (tab.label == "SOS报警") {
        this.activeValue = 1;
        let arr1 = JSON.stringify(this.data1.list);
        let typeId1 = 1;
        const data = await this.changeStateAsync({
          type: typeId1,
          ids: arr1,
        });
        this.hasSos = false;
      } else if (tab.label == "围栏报警") {
        this.activeValue = 2;
        let arr2 = JSON.stringify(this.data2.list);
        let typeId2 = 2;
        const data = await this.changeStateAsync({
          type: typeId2,
          ids: arr2,
        });
        this.hasTrack = false;
      } else if (tab.label == "跌落报警") {
        this.activeValue = 3;
        let arr3 = JSON.stringify(this.data3.list);
        let typeId3 = 3;
        const data = await this.changeStateAsync({
          type: typeId3,
          ids: arr3,
        });
        this.hasFall = false;
      } else if (tab.label == "脱离报警") {
        this.activeValue = 4;
        let arr4 = JSON.stringify(this.data4.list);
        let typeId4 = 4;
        const data = await this.changeStateAsync({
          type: typeId4,
          ids: arr4,
        });
        this.hasAway = false;
      } else if (tab.label == "高空报警") {
        this.activeValue = 5;
        let arr5 = JSON.stringify(this.data5.list);
        let typeId5 = 5;
        const data = await this.changeStateAsync({
          type: typeId5,
          ids: arr5,
        });
        this.hasHigh = false;
      } else if (tab.label == "全部") {
        this.activeValue = "";
        let arrAll = JSON.stringify(this.dataAll.list);
        let typeIdAll = "";
        const data = await this.changeStateAsync({
          type: typeIdAll,
          ids: arrAll,
        });
        this.hasAll = false;
        this.hasSos = false;
        this.hasTrack = false;
        this.hasFall = false;
        this.hasAway = false;
        this.hasHigh = false;
      }
      this.$store.commit("warning/changePage", 1);
      this.$store.commit("warning/ininType", this.activeValue);
      this.warnFormAsync();
    },
    //报警状态
    async warnStates() {
      //全部
      let idAll = "";
      const dataAll = await this.warnStateAsync({
        type: idAll,
      });
      this.dataAll = dataAll;
      if (dataAll.list.length > 0) {
        this.hasAll = true;
      } else {
        this.hasAll = false;
      }
      //SOS报警
      let id1 = 1;
      const data1 = await this.warnStateAsync({
        type: id1,
      });
      this.data1 = data1;
      if (data1.list.length > 0) {
        this.hasSos = true;
      } else {
        this.hasSos = false;
      }
      //围栏报警
      let id2 = 2;
      const data2 = await this.warnStateAsync({
        type: id2,
      });
      this.data2 = data2;
      if (data2.list.length > 0) {
        this.hasTrack = true;
      } else {
        this.hasTrack = false;
      }
      //跌落报警
      let id3 = 3;
      const data3 = await this.warnStateAsync({
        type: id3,
      });
      this.data3 = data3;
      if (data3.list.length > 0) {
        this.hasFall = true;
      } else {
        this.hasFall = false;
      }
      //脱离报警
      let id4 = 4;
      const data4 = await this.warnStateAsync({
        type: id4,
      });
      this.data4 = data4;
      if (data4.list.length > 0) {
        this.hasAway = true;
      } else {
        this.hasAway = false;
      }
      //高空报警
      let id5 = 5;
      const data5 = await this.warnStateAsync({
        type: id5,
      });
      this.data5 = data5;
      if (data5.list.length > 0) {
        this.hasHigh = true;
      } else {
        this.hasHigh = false;
      }
      this.warnFormAsync();
    },
    handler({ BMap, map }) {
      var point = new BMap.Point(104.081548, 30.652613);
      map.centerAndZoom(point, 15);
      map.addOverlay(point);
      // let mapStyle = { style: "midnight" };
      // map.setMapStyle(mapStyle);
    },
    getTraJecJory() {
      this.trajectoryVisible = true;
      // this.MailTableData
    },
    // 获得历史轨迹
    async getTrack() {
      if (this.radio === "1") {
        // 历史轨迹
        this.historyTrack();
      } else if (this.radio === "2") {
        // 实时轨迹
        this.nowTrack();
      }
    },
    // 验证时间不得超过24小时
    startTimeValidator(e) {
      if (this.trackForm.endtime !== "" && this.trackForm.endtime !== null) {
        if (
          new Date(this.trackForm.startdate).getTime() !==
          new Date(this.trackForm.enddate).getTime()
        ) {
          //两天
          if (e.valueOnOpen < this.trackForm.endtime) {
            this.trackForm.starttime = "";
            this.$message.error("选择时间不得超过24小时");
          }
        } else if (e.valueOnOpen > this.trackForm.starttime) {
          this.trackForm.endtime = "";
          this.$message.error("选择时间不得大于结束时间");
        }
      }
    },
    endTimeValidator(e) {
      if (
        this.trackForm.starttime !== "" &&
        this.trackForm.starttime !== null
      ) {
        if (
          new Date(this.trackForm.startdate).getTime() !==
          new Date(this.trackForm.enddate).getTime()
        ) {
          //两天
          if (e.valueOnOpen > this.trackForm.starttime) {
            this.trackForm.endtime = "";
            this.$message.error("选择时间不得超过24小时");
          }
        } else if (e.valueOnOpen < this.trackForm.starttime) {
          this.trackForm.endtime = "";
          this.$message.error("选择时间不得小于开始时间");
        }
      }
    },
    // 获得历史轨迹
    async historyTrack() {
      this.polylinePath = [];
      this.dialogVisible = false;
      let d = new Date(this.trackForm.startdate);
      let startd =
        d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate();
      let da = new Date(this.trackForm.starttime);
      let startt =
        da.getHours() + ":" + da.getMinutes() + ":" + da.getSeconds();
      let dat = new Date(this.trackForm.enddate);
      let endd =
        dat.getFullYear() + "-" + (dat.getMonth() + 1) + "-" + dat.getDate();
      let date = new Date(this.trackForm.endtime);
      let endt =
        date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
      let startTime = startd + " " + startt;
      let endTime = endd + " " + endt;

      let num =
        (new Date(endTime).getTime() / 1000 -
          new Date(startTime).getTime() / 1000) /
        10;
      let i = parseInt(num);
      let params = {
        entity_name: this.detailData.account,
        start_time: new Date(startTime).getTime() / 1000,
        end_time: new Date(endTime).getTime() / 1000,
        page_index: 1,
      };
      let data = await this.gettrackAsync(params);
      this.polylinePath = [];
      if (data.status === 0) {
        data.points.forEach((element, index) => {
          let pointObj = {
            lng: element.longitude,
            lat: element.latitude,
          };
          this.polylinePath.push(pointObj);
        });
        let searchNumber = Math.floor(data.total / 5000); // 向下取整

        for (let index = 2; index < searchNumber + 2; index++) {
          params.page_index = index;
          let dataObj = await this.gettrackAsync(params);
          if (dataObj.status === 0) {
            dataObj.points.forEach((element, index) => {
              let pointObj = {
                lng: element.longitude,
                lat: element.latitude,
              };
              this.polylinePath.push(pointObj);
            });
          }
        }
      }
    },
    // 获得历史轨迹
    async historyTrack() {
      this.trajectoryVisible = false;
      this.polylinePath = [];
      this.dialogVisible = false;
      let d = new Date(this.trackForm.startdate);
      let startd =
        d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate();
      let da = new Date(this.trackForm.starttime);
      let startt =
        da.getHours() + ":" + da.getMinutes() + ":" + da.getSeconds();
      let dat = new Date(this.trackForm.enddate);
      let endd =
        dat.getFullYear() + "-" + (dat.getMonth() + 1) + "-" + dat.getDate();
      let date = new Date(this.trackForm.endtime);
      let endt =
        date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
      let startTime = startd + " " + startt;
      let endTime = endd + " " + endt;

      let num =
        (new Date(endTime).getTime() / 1000 -
          new Date(startTime).getTime() / 1000) /
        10;
      let i = parseInt(num);
      if (this.topViewTrack == true) {
        var paramsget = {
          entity_name: this.detailData.account,
          start_time: new Date(startTime).getTime() / 1000,
          end_time: new Date(endTime).getTime() / 1000,
          page_index: 1,
        };
      } else {
        var paramsget = {
          entity_name: this.detailData.account,
          start_time: new Date(startTime).getTime() / 1000,
          end_time: new Date(endTime).getTime() / 1000,
          page_index: 1,
        };
      }
      let data = await this.gettrackAsync(paramsget);
      this.polylinePath = [];
      if (data.status === 0) {
        this.MemberDialogVisible = false;
        this.trajectoryVisible = false;
        data.points.forEach((element, index) => {
          let pointObj = {
            lng: element.longitude,
            lat: element.latitude
          };
          this.polylinePath.push(pointObj);
        });
        let searchNumber = Math.floor(data.total / 5000); // 向下取整

        for (let index = 2; index < searchNumber + 2; index++) {
          params.page_index = index;
          let dataObj = await this.gettrackAsync(params);
          if (dataObj.status === 0) {
            dataObj.points.forEach((element, index) => {
              let pointObj = {
                lng: element.longitude,
                lat: element.latitude,
              };
              this.polylinePath.push(pointObj);
            });
          }
        }
      } else {
        this.trajectoryVisible = false;
        if (data.message == "entity_name:参数必需") {
          this.$message.error("需要是鹰眼账号");
        }
      }
    },
    // 获得实时轨迹
    async nowTrack() {
      this.isNowTrack = true;
      this.trajectoryVisible = false;
      this.polylinePath = [];
      var interval = 10000;
      if (this.trackForm.type === "1") {
        interval = 10000;
      } else if (this.trackForm.type === "2") {
        interval = 600000;
      } else {
        interval = 3000000;
      }
      // 起点
      if (this.topViewTrack == true) {
        var paramsnow = {
          entity_name: this.detailData.account,
        };
      } else {
        var paramsnow = {
          entity_name: this.detailData.account,
        };
      }

      let dataObj = await this.getLatestPointAsync(paramsnow);
      if (dataObj.status === 0) {
        this.MemberDialogVisible = false;
        this.trajectoryVisible = false;
        this.nowTrackBtn = true;
        let pointObj = {
          lng: dataObj.latest_point.longitude,
          lat: dataObj.latest_point.latitude,
        };
        this.polylinePath.push(pointObj);
        var ix = 1;
        // --- 定时器 ---
        this.trackIntervalId = setInterval(async () => {
          ix++;
          if (this.topViewTrack == true) {
            var paramsnow2 = {
              entity_name: this.detailData.account,
            };
          } else {
            var paramsnow2 = {
              entity_name: this.detailData.account,
            };
          }
          let dataObj = await this.getLatestPointAsync(paramsnow2);
          if (dataObj.status === 0) {
            let pointObj = {
              lng: dataObj.latest_point.longitude,
              lat: dataObj.latest_point.latitude,
            };
            // let pointObj = {
            //   lng: 103 + 0.005*ix,
            //   lat: 30 + 0.005*ix
            // }
            this.polylinePath.push(pointObj);
          }
        }, interval);
      } else {
        this.$message.error(dataObj.message);
      }
    },
    //停止获取实时轨迹
    stopTrack() {
      this.isNowTrack = false;
      this.nowTrackBtn = false;
      clearInterval(this.trackIntervalId);
      this.trackIntervalId = null;
      this.zoom = 15;
    },
    // 点击触发信息框显示与隐藏
    shrink(e) {
      // 根据事件处理参数e下的pageX，PageY来定位div的位置
      this.drawer = !this.drawer;
    },

    //详情
    async details(row){
       console.log(row)
       let ids = row.bid;
       const data = await this.detailsAsync({
        clientId: ids,
        type: 2,
      });
      this.detailData = data.data;
      this.thisUserStatus = this.detailData.onlineStatus;
      // this.rowData = prop;
      // 定位
      this.DWviewAction();
    },
    
    //定位跳转
    async DWviewAction() {
      this.isClickLocation = true; // 控制是否定位
      this.showTerminal = true;
      this.center = {
        lng: this.detailData.longitude,
        lat: this.detailData.latitude,
      };
      // 显示图标
      if (this.detailData.color == "#0C468E") {
        this.terminalLocation.url = L_0C468E;
      } else if (this.detailData.color == "#2DD787") {
        this.terminalLocation.url = L_2DD787;
      } else if (this.detailData.color == "#3FE5F2") {
        this.terminalLocation.url = L_3FE5F2;
      } else if (this.detailData.color == "#5C4DC6") {
        this.terminalLocation.url = L_5C4DC6;
      } else if (this.detailData.color == "#9B5718") {
        this.terminalLocation.url = L_9B5718;
      } else if (this.detailData.color == "#011C31") {
        this.terminalLocation.url = L_011C31;
      } else if (this.detailData.color == "#68E122") {
        this.terminalLocation.url = L_68E122;
      } else if (this.detailData.color == "#814A94") {
        this.terminalLocation.url = L_814A94;
      } else if (this.detailData.color == "#1596FF") {
        this.terminalLocation.url = L_1596FF;
      } else if (this.detailData.color == "#009721") {
        this.terminalLocation.url = L_009721;
      } else if (this.findDetliat.color == "#C3C3C3") {
        this.terminalLocation.url = L_C3C3C3;
      } else if (this.detailData.color == "#D32084") {
        this.terminalLocation.url = L_D32084;
      } else if (this.detailData.color == "#F8EA38") {
        this.terminalLocation.url = L_F8EA38;
      } else if (this.detailData.color == "#FF3E59") {
        this.terminalLocation.url = L_FF3E59;
      } else if (this.detailData.color == "#FFB142") {
        this.terminalLocation.url = L_FFB142;
      }
      // 将当前数据的账号名与所有数据的账号名查询，status
      let one = {};
      for (let i = 0; i < this.MailTableData.length; i++) {
        if (this.MailTableData[i].userName == this.detailData.account) {
          one = this.MailTableData[i];
        }
      }
      this.findDetailData = one;
      // 查看是否是调度员或者终端用户
      // this.MemberInformation();
      let rowda = {
        clientId: this.findDetailData.id,
        type: this.findDetailData.type,
      };
      const { data: res } = await this.$http.post("contact/findContactDetail", qs.stringify(rowda));
      this.findDetliat = res.data;
      // 判断是否在线
      // if (this.findDetailData.status == 0) {
      //   this.terminalLocation.url = L_C3C3C3;
      // }
      if (this.findDetliat.userType == 1) {
        if (this.findDetailData.status == 0) {
          this.terminalLocation.url = L_29710;
        } else {
          this.terminalLocation.url = L_29711;
        }
      }
    },
    // 查看是否是调度员或者终端用户
    // async MemberInformation() {
    //   let rowda = {
    //     clientId: this.findDetailData.id,
    //     type: this.findDetailData.type
    //   };
    //   const { data: res } = await this.$http.post(
    //     "contact/findContactDetail",
    //     qs.stringify(rowda)
    //   );
    //   this.findDetliat = res;
    // },
    //分页
    handleCurrentChange(val) {
      this.$store.commit("warning/changePage", val);
      if (this.start !== "" || this.end !== "") {
        this.queryByTimeAsync();
        if (this.getName !== "") {
          this.queryByNameAsync();
        }
      } else if (this.getName !== "") {
        this.queryByNameAsync();
      } else {
        this.warnFormAsync();
      }
    },
    //按时间查询
    getTime() {
      let start = this.timeBetween[0];
      let end = this.timeBetween[1];
      this.$store.commit("warning/ininStart", start);
      this.$store.commit("warning/ininEnd", end);
      this.queryByTimeAsync();
    },
    // 按名字查询
    query() {
      this.$store.commit("warning/ininName", this.getName);
      this.queryByNameAsync();
    },
    // //邀请视频
    inviteVideoOnoToOne(id) {
      var userinfor = [];
      this.detailData.userName = this.detailData.account;
      this.detailData.fullName = this.detailData.name;
      userinfor.push(this.detailData);
      if (id === 3 || id === 4) {
        window.dispatchEvent(
          new CustomEvent("inviteVideo", {
            detail: {
              id: id,
              // iscalling: true,
              userinfor: JSON.parse(localStorage.getItem("user")),
              targetType: userinfor[0].type == "1" ? "d" : "z",
              type: userinfor[0].type == "1" ? "d2d" : "d2z",
              multipleSelection: userinfor,
            },
          })
        );
      } else if (id === 1 || id === 2) {
        window.dispatchEvent(
          new CustomEvent("inviteAudio", {
            detail: {
              id: id,
              userinfor: JSON.parse(localStorage.getItem("user")),
              targetType: userinfor[0].type == "1" ? "d" : "z",
              type: userinfor[0].type == "1" ? "d2d" : "d2z",
              multipleSelection: userinfor,
            },
          })
        );
      } else if (id === 5) {
        localStorage.setItem("fullScreen", "true");
        window.dispatchEvent(
          new CustomEvent("inviteFull", {
            detail: {
              full: 0,
              id: 4,
              userinfor: JSON.parse(localStorage.getItem("user")),
              targetType: userinfor[0].type == "1" ? "d" : "z",
              type: userinfor[0].type == "1" ? "d2d" : "d2z",
              multipleSelection: userinfor,
            },
          })
        );
      }
    },
    // 音频采集并且录音
    gotMedia() {
      var that = this;
      let options = {
        video: false,
        audio: true,
      };
      let getUserMedia =
        navigator.getUserMedia || //旧版API
        navigator.mediaDevices.getUserMedia || //最新的标准API
        navigator.webkitGetUserMedia || //webkit核心浏览器
        navigator.mozGetUserMedia || //firfox浏览器
        navigator.msGetUserMedia;

      if (getUserMedia) {
        // 调用用户媒体设备, 访问摄像头
        this.getUserMediaFun(
          options,
          this.createStreamSuccess,
          this.createStreamError
        );
      } else {
        console.log(new Error("WebRTC is not yet supported in this browser."));
      }
    },
    createStreamSuccess(stream) {
      this.audioMediaStream = stream;
      RS.mediaStream = stream;
      RS.startRecord();
    },
    createStreamError(error) {
      console.log(error);
    },
    //访问用户媒体设备的兼容方法
    getUserMediaFun(constraints, success, error) {
      if (navigator.mediaDevices.getUserMedia) {
        //最新的标准API
        navigator.mediaDevices
          .getUserMedia(constraints)
          .then(success)
          .catch(error);
      } else if (navigator.webkitGetUserMedia) {
        //webkit核心浏览器
        navigator.webkitGetUserMedia(constraints, success, error);
      } else if (navigator.mozGetUserMedia) {
        //firfox浏览器
        navigator.mozGetUserMedia(constraints, success, error);
      } else if (navigator.getUserMedia) {
        //旧版API
        navigator.getUserMedia(constraints, success, error);
      } else {
        console.log(new Error("WebRTC is not yet supported in this browser."));
      }
    },
    // 录音
    async audioRecord(i) {
      if (this.audioBtn == 0) {
        // 第一次开始录音
        this.audioBtn = 1;
        this.gotMedia();
      } else if (this.audioBtn == 2) {
        // 重录
        this.audioBtn = 1;
        await this.gotMedia();
      } else if (this.audioBtn == 1) {
        // 停止录音
        this.audioBtn = 2;
        var audio = document.getElementById("audioStream");
        RS.stopRecord();
        audio.src = RS.url;
        const blob = await fetch(RS.url).then((r) => r.blob());
        const file = new File([blob], "record.mp3", { type: blob.type });
        this.audioStream.append("file", file);
      }
    },
    // 发送语音
    async sendRecord() {
      this.audioBtn = 0;
      var that = this;
      if (this.audioradio == "1") {
        //文字
        let recordUserlist = [];
        recordUserlist.push({
          userName: this.detailData.account,
        });
        window.dispatchEvent(
          new CustomEvent("onSendRecord", {
            detail: {
              user: recordUserlist,
              content: that.recordForm.content,
              type: "text",
            },
          })
        );
        this.$message.success("发送成功");
      } else {
        this.audioStream.append("type", 1);
        var url = await this.$http.post(
          "/broadcast/uploadVoiceFile",
          this.audioStream
        );
        // url.data     fullName
        if (url.data.code == 200) {
          let recordUserlist = [];
          recordUserlist.push({
            userName: this.detailData.account,
          });
          window.dispatchEvent(
            new CustomEvent("onSendRecord", {
              detail: {
                user: recordUserlist,
                content: url.data.message,
                type: "voice",
              },
            })
          );
          this.$message.success("发送成功");
        } else {
          this.$message.error("发送失败");
        }
      }
    },
    // 语音广播对话框
    VoiceBroadcast() {
      this.VoiceBroadcastVisible = true;
      this.MemberDialogVisible = false;
    },
    handleSelectionClose() {
      this.VoiceBroadcastVisible = false;
      if (this.audioMediaStream !== null) {
        this.audioMediaStream.getTracks()[0].stop();
      }
    },
  },
};
</script>

<style lang="less" scoped>
.caPolice {
  position: relative;
  height: 100%;
  .baiduMap {
    width: 100%;
    height: 100%;
    margin-top: 0px;
    position: absolute;
    top: 0;
    z-index: 0 !important;
  }
  .nowTrackBtn {
    position: absolute;
    // margin: 0 auto;
    top: 100px;
    left: 37%;
  }
  .voices {
    width: 100%;
    height: 450px;
    .voice-left {
      float: left;
      width: 40%;
      height: 99.5%;
      border: 1px solid #ccc;
      // .yuan {
      //   display: inline-block;
      //   height: 10px;
      //   width: 10px;
      //   background-color: #67c23a;
      //   border-radius: 50%;
      //   margin-right: 20px;
      // }
      // .hui
    }
  }
  .voice-right {
    float: left;
    width: 95%;
    height: 95%;
    margin-left: 10px;
    border: 1px solid #ccc;
    font-size: 16px;
    padding-top: 20px;
    position: relative;
    .rimain {
      margin-top: 30px;
      height: 270px;
      // background-color: pink;
      width: 100%;
      padding: 10px;
      box-sizing: border-box;
      .recordBtn {
        display: inherit;
        margin: 30px auto;
      }
      audio {
        display: inherit;
        margin: 0 auto;
      }
    }
    .bup {
      position: absolute;
      bottom: 10px;
      right: 15px;
    }
  }
}
// 左侧侧边栏样式
.el-dialog__wrapper {
  position: fixed;
  left: 240px;
}
/deep/.el-drawer.ltr {
  position: relative;
  margin-left: 0 !important;
  //width: 2.6rem !important;
  margin-top: 80px;
  position: relative;
  // height: 855px;
  .el-drawer__header {
    display: none;
  }
  .el-tabs {
    .el-form-item {
      margin-bottom: 9px;
      border-bottom: 1px solid #33a7ff;
    }
  }
  .el-tabs__item {
     /* width: 16.4%; */
    padding: 0 9px;
  }
  .el-tabs--border-card > .el-tabs__content {
    //padding: 5px 15px;
    padding: 0 0 0 10px;
    height: 100%;
  }
  p {
    margin: 0;
    line-height: 30px;
    height: 30px;
  }
  .el-col {
    line-height: 30px;
    height: 30px;
  }
}
// 按钮的两个样式
.retra {
  // margin-top: 3rem !important;
  margin-top: 25% !important;
  width: 48px;
  height: 100px;
  vertical-align: middle;
  text-align: center;
  padding-top: 50px;
  background-color: #011c31;
  transition: all 0.21s ease;
  z-index: 9999 !important;
  cursor: pointer;
  span {
    display: inline-block;
    width: 50%;
    margin-right: 0;
    // margin-left: 10px;
    text-align: center;
    vertical-align: middle;
    color: #fff;
    font-size: 18px;
  }
  img {
    margin-left: 0;
  }
}
.retses {
  margin-left: 30.2% !important;
  cursor: pointer;
  margin-top: 25% !important;
}
// 成员信息表样式
.dia-1 {
  .el-dialog__body {
    padding: 0;
    .fn {
      height: 80px;
      width: 100%;
      ul {
        cursor: pointer;
        margin: 0;
        // padding-left:30px ;
        padding: 0;
        width: 100%;
        height: 100%;
        list-style: none;
        display: flex;
        background-color: #1596ff;
        li {
          // float: left;
          display: inline-block;
          // height: 80px;
          // width: 20%;
          vertical-align: middle;
          text-align: center;
          font-size: 14px;
          color: #1596ff;
          img {
            vertical-align: middle;
            // margin-top: 5px;
          }
          p {
            margin-top: -10px;
            color: #fff;
          }
        }
      }
    }
  }
}
.tabs {
  div {
    margin-bottom: 20px;
    font-size: 14px;
    margin-left: 20px;
    width: 460px;
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
// /deep/#tab-0 {
//   background-color: pink;
// }
/deep/.itemDiv {
  height: 17px;
  width: 100%;
  line-height: 17px;
  position: relative;
  top: 12px;
  right: 0;
  zoom: 1;
  box-sizing: border-box;
  // width: 2.6rem;
  // margin-bottom: -12px;
  // background-color: pink;
  /deep/.itemDivES {
    display: inline-block !important;
    height: 17px;
    line-height: 17px;
    width: 16%;
    margin-left: 2px;
    position: relative;
    /* margin-left: 1px; */
    // width: 14.8%;
    // width: 45.8%;
  }
  /deep/.item {
    /* float: right; */
    position: absolute;
    right: 0;
    margin-top: 0.1rem !important;
    z-index: 99999;
    width: 10px;
    height: 10px;
  }
}
/deep/#tab-0 {
  padding: 0 9px;
  // width: 86px;
  //width: 0.4rem;
  text-align: center;
}
/deep/#tab-1 {
  padding: 0 9px;
}
</style>

<style >
/*.callPo{*/
/*  position: absolute;*/
/*  top: 0;*/
/*  left: 0;*/
/*  width: 8.7rem;*/
/*}*/
.callPo .el-tabs__nav-wrap.is-scrollable {
  padding: 0;
}
.callPo .el-tabs__nav-prev {
  width: 0;
}
.callPo .el-tabs__nav-next {
  width: 0;
}
.callPo .el-icon-arrow-left {
  display: none;
}
.callPo .el-icon-arrow-right {
  display: none;
}
.callPo .el-tabs__nav {
  /* width: 500px; */
  width: 9.24rem;
}
.callPo .el-tabs--border-card > .el-tabs__header .is-scrollable .el-tabs__item {
  width: 1.5rem;
  text-align: center;
}
.tableContainer {
  margin-left: -15px;
}
.tableContainer .el-tabs__content {
  overflow: visible;
}
.tableContainer .el-table--scrollable-x .el-table__body-wrapper {
  overflow: visible;
}

</style>

<style scoped>
.tabone {
  overflow-y: scroll !important;
}

.el-pagination {
  text-align: center;
  margin-top: 15px;
}
</style>
>>>>>>> 8a0073a80d16ea7ba6961b10916aac57d9fa5eb9

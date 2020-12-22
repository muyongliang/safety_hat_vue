// 通讯录,frame框
<template>
  <div id="calle" class="calles">
    <!-- 百度地图 -->
    <baidu-map
      :center="center"
      :zoom="zoom"
      @ready="handler"
      class="baiduMap"
      :scroll-wheel-zoom="true"
      @addoverlay="mapAddoverlay"
    >
      <!-- :icon="{url: marker.status == 0?pointOffline: marker.type == '1'? pointTerminal:pointDispatcher, size: {width: 40, height: 96}}" -->
      <bml-marker-clusterer :averageCenter="true">
        <bm-marker v-for="(marker, index) in pointLocation" :key="index" :position="marker.center" :icon="{ url: marker.url, size: { width: 40, height: 96 } }" @click="pointClick(index)">
          <!-- <bm-label
          :content="测试名称"
          :position="{lng: marker.center.lng, lat: marker.center.lat}"
          :labelStyle="{color: 'white', fontSize : '16px',marginLeft:'40px',backgroundColor:'rgba(21,150,255,0.8)',padding:'15px',border:' 1px solid rgba(1, 28, 49, 0.5)',marginTop:'-20px'}"
          />-->
        </bm-marker>

        <!-- 定位图标 -->
        <!-- <bm-marker
          :position="pointz"
          :icon="terminalLocation"
          @click="oneClick"
          v-if="showTerminal"
        ></bm-marker>-->
        <!-- <bm-marker
        v-if="isLocation && thisUserStatus === 0"
        :position="pointZ"
        :icon="{url: pointOffline, size: {width: 40, height: 96}}"
        ></bm-marker>-->
        <bm-marker v-if="isNowTrack" :position="nowTrackMarker" animation="BMAP_ANIMATION_BOUNCE"></bm-marker>
        <bm-polyline v-for="(item,index) in polylinePath" :key="item.key" :path="item.points" stroke-color="blue" :stroke-opacity="0.5" :stroke-weight="5" :editing="false"></bm-polyline>
        <bm-marker v-if="isTrack" v-for="(item,index) in startPoints" :position="item" :icon="{ url: pointStart, size: { width: 27, height: 48 } }"></bm-marker>
        <bm-marker v-if="isTrack" v-for="(item,index) in endPoints" :position="item" :icon="{ url: pointEnd, size: { width: 27, height: 48 } }"></bm-marker>
        <el-card v-if="nowTrackBtn" class="box-card nowTrackBtn">
          <el-button type="primary" plain @click="stopTrack">停止获取实时轨迹</el-button>
        </el-card>
      </bml-marker-clusterer>
    </baidu-map>
    <el-container class="calles-dra">
      <!-- 信息框 -->
      <!-- <el-button @click="drawer = true" type="primary" style="margin-left: 16px;">点我打开</el-button> -->
      <el-drawer :visible.sync="drawer" direction="ltr" :modal="false">
        <transition>
          <div class="frame" v-show="show">
            <!-- 上半部功能区 -->
            <div class="gn">
              <ul>
                <li @click="VoiceTelephone" :class="isChooseUser == true ? '' : 'calleActive'" v-if="hasCall">
                  <img src="../../assets/images/2018.png" alt />
                  <p>语音电话</p>
                </li>
                <li @click="videoTelephone" :class="isChooseUser == true ? '' : 'calleActive'" v-if="hasVideo">
                  <img src="../../assets/images/2019.png" alt />
                  <p>视频电话</p>
                </li>
                <li @click="VoiceBroadcast" v-if="hasBroadcast">
                  <img src="../../assets/images/2020.png" alt />
                  <p>语音广播</p>
                </li>
                <li @click="getTraJecJory" :class="isChooseUser == true ? '' : 'calleActive'" v-if="hasTrail">
                  <img src="../../assets/images/2021.png" alt />
                  <p>轨迹</p>
                </li>
                <li @click="openDetection" v-if="hasListener">
                  <img src="../../assets/images/2022.png" alt />
                  <p>无声侦护</p>
                </li>
                <!-- <el-date-picker
                    v-model="trackForm.startdate"
                    type="daterange"
                    :start-placeholder="trackForm.startdate"
                    end-placeholder="123"
                    :default-time="['00:00:00', '23:59:59']">
                </el-date-picker>-->
              </ul>
            </div>
            <!-- 下半部通讯tab栏 -->
            <div class="mail">
              <el-tabs v-model="activeName" type="card" @tab-click="findGroupByName">
                <el-tab-pane label="通讯录" name="first">
                  <!-- 查询框 -->
                  <el-form ref="FindFormDataRef" :model="FindFormData" label-width="80px">
                    <el-row>
                      <el-col :span="4">
                        <span class="col43">选择工种</span>
                      </el-col>
                      <el-col :span="20">
                        <el-row>
                          <el-col :span="8">
                            <el-select v-model="FindFormData.zidianType" @change="getWorkTypeList">
                              <el-option v-for="item in zdtypeData" :key="item.zid" :label="item.name" :value="item.zid"></el-option>
                            </el-select>
                          </el-col>
                          <el-col :span="10">
                            <el-input v-model="FindFormData.name"></el-input>
                          </el-col>
                          <el-col :span="2">
                            <el-button icon="el-icon-search" @click="FindName"></el-button>
                          </el-col>
                        </el-row>

                        <!-- <el-input v-model="form.name" class="input-with-select">
                        <el-select
                          v-model="form"
                          slot="prepend"
                          placeholder="全部"
                          style="width:120px"
                        >
                          <el-option label="全部" value="1"></el-option>
                          <el-option label="部分" value="2"></el-option>
                        </el-select>
                        <el-button slot="append" icon="el-icon-search"></el-button>
                        </el-input>-->
                      </el-col>
                    </el-row>
                  </el-form>

                  <!-- 通讯录表单 -->
                  <div class="tab-divl">
                    <el-table ref="multipleTable" :data="MailTableData" tooltip-effect="dark" @selection-change="handleSelectionChange" class="tabone">
                      <el-table-column width="50" type="selection" :selectable="selectable"></el-table-column>
                      <el-table-column width="50" label="状态">
                        <template slot-scope="scope">
                          <!-- 后面根据数据来渲染圆点背景色 -->
                          <span class="yuan" v-if="scope.row.status !== 0"></span>
                          <span class="yuan , hui" v-else></span>
                        </template>
                      </el-table-column>
                      <el-table-column label="账号类型" prop="type">
                        <template slot-scope="scope">
                          <span v-if="scope.row.type == 1">调度员</span>
                          <span v-else-if="scope.row.type == 2">终端用户</span>
                        </template>
                      </el-table-column>
                      <el-table-column width="80" label="姓名" prop="fullName"></el-table-column>
                      <el-table-column label="工种名称">
                        <template slot-scope="scope">
                          <span v-if="scope.row.type == 1"></span>
                          <span v-if="scope.row.type !== 1">{{scope.row.workName }}</span>
                        </template>
                      </el-table-column>
                      <el-table-column width="100" label="所属对讲组">
                        <template slot-scope="scope">
                          <span v-for="(item,index) in scope.row.tname" :key="index">{{ item }}</span>
                        </template>
                      </el-table-column>
                      <el-table-column>
                        <template slot-scope="scope">
                          <span @click="MemberInformation(scope.row)" style="cursor: pointer">...</span>
                        </template>
                      </el-table-column>
                    </el-table>
                  </div>

                  <!-- 添加分页 -->
                  <el-pagination
                    @current-change="MailhandleCurrentChange"
                      :current-page="this.postmaildata.pageNum"
                    :page-size="this.postmaildata.pageSize"
                    layout="total, prev, pager, next"
                    :total="mailTotal"
                  ></el-pagination>
                </el-tab-pane>

                <el-tab-pane label="群组" name="second">
                  <!-- 开始表格，会进行一个判断 -->
                  <div v-show="groupDetailed">
                    <el-form ref="getMemberDataRef" :model="getMemberData" label-width="20px">
                      <el-row>
                        <el-col :span="12">
                          <el-form-item>
                            <el-input
                              v-model="getMemberData.groupName"
                              placeholder="输入群组名称搜索"
                            ></el-input>
                          </el-form-item>
                        </el-col>
                        <el-col :span="5" style="margin-left: 10px">
                          <el-button
                            icon="el-icon-search"
                            type="primary"
                            @click="findGroupByName"
                          ></el-button>
                        </el-col>
                        <el-col :span="5">
                          <el-button type="primary" @click="addGetVisible"
                            >添加群组</el-button
                          >
                        </el-col>
                      </el-row>
                    </el-form>
                    <div class="tab-divr">
                      <el-table :data="findGroupList" style="width: 100%">
                        <el-table-column label="群组名称">
                          <template slot-scope="scope">
                            <span @click="groupData(scope.row)">{{                                scope.row.groupName }}</span>
                          </template>
                        </el-table-column>
                        <el-table-column label width="95%">
                          <template slot-scope="scope">
                            <span style="cursor: pointer" @click="editDleteOf(scope.row)">. . .</span>
                          </template>
                        </el-table-column>
                      </el-table>
                    </div>
                  </div>

                  <div v-show="groupDetailed == false">
                    <el-row>
                      <el-col :span="10">
                        <el-button type="primary" @click="backDroupData" style="margin-left: 10px">返回</el-button>
                      </el-col>
                      <el-col :span="10" style="height: 40px; line-height: 40px">{{ groupDataRowTwo.name }}</el-col>
                    </el-row>
                    <el-divider></el-divider>

                    <!-- 通讯录表单 -->
                    <div class="tab-divl">
                      <el-table ref="multipleTable2" :data="MailTableDataTwo" tooltip-effect="dark" @selection-change="handleSelectionChange" border>
                        <!--                        <el-table-column type="selection"></el-table-column>-->
                        <el-table-column label="在线状态">
                          <template slot-scope="scope">
                            <!-- 后面根据数据来渲染圆点背景色 -->
                            <span class="yuan" v-if="scope.row.status !== 0"></span>
                            <span class="yuan , hui" v-else></span>
                          </template>
                        </el-table-column>
                        <el-table-column label="账号类型" prop="type">
                          <template slot-scope="scope">
                            <span v-if="scope.row.type == 1" @click="getDispatcher(scope.row)" style="cursor: pointer">调度员</span>
                            <span v-else-if="scope.row.type == 2" @click="getDispatcher(scope.row)" style="cursor: pointer">终端用户</span>
                          </template>
                        </el-table-column>
                        <el-table-column label="姓名" prop="fullName"></el-table-column>
                        <el-table-column label="工种名称" prop="workName"></el-table-column>
                        <el-table-column>
                          <template slot-scope="scope">
                            <span @click="MemberInformation(scope.row)" style="cursor: pointer">...</span>
                          </template>
                        </el-table-column>
                      </el-table>
                    </div>

                    <!-- 添加分页 -->
                    <!-- <el-pagination
                      @current-change="MailhandleCurrentChange"
                      :current-page="this.postmaildata.pageNum"
                      :page-size="this.postmaildata.pageSize"
                      layout="total, prev, pager, next"
                      :total="mailTotal"
                    ></el-pagination> -->
                  </div>
                  <!-- <el-pagination
                    @current-change="MailhandleCurrentChange"
                    :current-page="this.postmaildata.pageNum"
                    :page-size="this.postmaildata.pageSize"
                    layout="total, prev, pager, next"
                    :total="mailTotal"
                  ></el-pagination>-->
                </el-tab-pane>
              </el-tabs>
            </div>
          </div>
        </transition>
      </el-drawer>

      <!-- 控制按钮 -->
      <!-- <div class="retract 'show:false? frames : one '" @click="shrink"> -->
      <!-- <div :class="retract 'drawer == false?"rets":" "'" @click="shrink"> -->
      <div :class="['retracts', drawer == false ? '' : 'rets']" @click="shrink">
        <!-- <img src="../../assets/images/jiantou.png" alt /> -->
        <span v-if="drawer == true">收起</span>
        <span v-else>展开</span>
      </div>

      <!-- 终端成员信息弹框 -->
      <div class="dia-1">
        <el-dialog title="成员信息" :visible.sync="MemberDialogVisible" width="30%" :modal="false">
          <!-- 主体信息区 -->
          <el-form class="findDetliatRef" ref="findDetliatRef" :model="findDetliat" label-width="120px" style="width: 90%">
            <el-form-item label="姓名：">
              <el-input v-model="findDetliat.name" :disabled="true"></el-input>
            </el-form-item>
            <el-form-item label="账号类型：">
              <el-input v-model="findDetliat.userType" :disabled="true">
                <!-- <span v-if="findDetliat.userType == 0">调度员</span>
                <span v-if="findDetliat.userType == 1">终端用户</span>-->
              </el-input>
            </el-form-item>
            <el-form-item v-show="this.findDetliat.userType == '终端用户'" label="工种：">
              <el-input v-model="findDetliat.workType" :disabled="true"></el-input>
            </el-form-item>
            <div v-show="this.findDetliat.userType == '终端用户'">
              <el-divider></el-divider>
              <el-form-item label="电池电量：">
                <el-input v-model="findDetliat.power" :disabled="true"></el-input>
              </el-form-item>
              <el-form-item label="主板温度：">
                <el-input v-model="findDetliat.mainTemperature" :disabled="true"></el-input>
              </el-form-item>
              <el-form-item label="环境温度：">
                <el-input v-model="findDetliat.environmentTemperature" :disabled="true"></el-input>
              </el-form-item>
              <el-form-item label="气压：">
                <el-input v-model="findDetliat.pressure" :disabled="true"></el-input>
              </el-form-item>
              <el-form-item label="网络：">
                <el-input v-model="findDetliat.network" :disabled="true"></el-input>
              </el-form-item>
            </div>
            <el-divider></el-divider>
            <el-form-item label="时间：">
              <el-input v-model="findDetliat.time" :disabled="true"></el-input>
            </el-form-item>
            <el-form-item label="经度：">
              <el-input v-model="findDetliat.latitude" :disabled="true"></el-input>
            </el-form-item>
            <el-form-item label="纬度：">
              <el-input v-model="findDetliat.longitude" :disabled="true"></el-input>
            </el-form-item>
          </el-form>
          <!-- 底部功能区 -->
          <div class="fn">
            <ul>
              <li @click="VoiceTelephone" v-if="hasCall">
                <img src="../../assets/images/2018.png" alt />
                <p>语音电话</p>
              </li>
              <li @click="videoTelephone" v-if="hasVideo">
                <img src="../../assets/images/2019.png" alt />
                <p>视频电话</p>
              </li>
              <!-- <li @click="VoiceBroadcast">
                <img src="../../assets/images/2020.png" alt />
                <p>语音广播</p>
              </li>-->
              <!-- 定位 -->
              <li @click="DWviewAction">
                <img src="../../assets/images/2042.png" alt />
                <p>定位</p>
              </li>
              <li @click="getTraJecJory" v-show="this.findDetliat.userType == '终端用户'" v-if="hasTrail">
                <img src="../../assets/images/2021.png" alt />
                <p>轨迹</p>
              </li>
              <!-- getDetection -->
              <li @click="inviteVideoOnoToOne(5)" v-show="this.findDetliat.userType == '终端用户'" v-if="hasListener">
                <img src="../../assets/images/2022.png" alt />
                <p>无声侦护</p>
              </li>
            </ul>
          </div>
        </el-dialog>
      </div>

      <!-- 调度员成员信息框 -->
      <div class="dia-1 dia-2">
        <el-dialog title="成员信息" :visible.sync="DispatcherDialogVisible" width="30%" :modal="false">
          <!-- 主体信息区 -->
          <div class="tabs">
            <div>
              <i>姓名：</i>
              <span>战三</span>
            </div>
            <div>
              <i>账号类型：</i>
              <span>终端账号</span>
            </div>
            <div>
              <i>电话：</i>
              <span>1212121212121</span>
            </div>
          </div>

          <!-- 底部功能区 -->
          <div class="fn">
            <ul style="cursor: pointer">
              <li @click="VoiceTelephone" v-if="hasCall">
                <img src="../../assets/images/2018.png" alt />
                <p>语音电话</p>
              </li>
              <li @click="videoTelephone" v-if="hasVideo">
                <img src="../../assets/images/2019.png" alt />
                <p>视频电话</p>
              </li>
              <li>
                <img src="../../assets/images/2048.png" alt />
                <p>定位</p>
              </li>
            </ul>
          </div>
        </el-dialog>
      </div>

      <!-- 添加群组弹框 -->
      <el-dialog title="群组管理" :visible.sync="adddVisible" width="40%" center :modal="false">
        <el-form :model="AddToGroupMembers" :rules="AddToGroupMembersRules" ref="AddToGroupMembersRef" label-width="80px" class="demo-ruleForm">
          <el-form-item label="群组名称" prop="groupName">
            <el-input v-model="AddToGroupMembers.groupName"></el-input>
          </el-form-item>
          <el-form-item label="群组成员">
            <el-transfer v-model="value" :data="TransFerAllAdd" :titles="['未添加', '已添加']" @change="ferHandleChange"></el-transfer>
          </el-form-item>
        </el-form>
        <el-divider></el-divider>
        <span slot="footer" class="dialog-footer">
          <el-button @click="adddVisible = false">取 消</el-button>
          <el-button type="primary" @click="addDataListMembers">确 定</el-button>
        </span>
      </el-dialog>

      <!-- 群组名称编辑弹框 -->
      <el-dialog title="群组编辑" :visible.sync="edddialogVisible" width="15%" :modal="false" class="diael">
        <el-button type="success" @click="editadd">编辑</el-button>
        <el-button type="danger " @click="deleteadd">删除</el-button>
      </el-dialog>
      <!-- 删除弹框 -->
      <el-dialog :visible.sync="deleteDialogVisible" width="20%" :modal="false" center>
        <span>真的要删除吗</span>
        <span slot="footer" class="dialog-footer">
          <el-button @click="deleteDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="deleteDataMem">确 定</el-button>
        </span>
      </el-dialog>
      <!-- 群组编辑栏 -->
      <el-dialog title="群组管理" :visible.sync="editVisible" width="40%" center :modal="false">
        <el-form :model="editMemberdForm" ref="editMemberdFormRef" label-width="80px" class="demo-ruleForm">
          <el-form-item label="群组名称">
            <el-input v-model="editMemberdForm.groupName"></el-input>
          </el-form-item>
          <el-form-item label="群组成员">
            <el-transfer v-model="editAddListData" :data="editHandleData" @change="editMemHandleChange"></el-transfer>
          </el-form-item>
        </el-form>
        <el-divider></el-divider>
        <span slot="footer" class="dialog-footer">
          <el-button @click="editMemHandleclose">取 消</el-button>
          <el-button type="primary" @click="editMemHandleEvent">确 定</el-button>
        </span>
      </el-dialog>

      <!-- 语音电话栏 -->
      <el-dialog title="语音电话" :visible.sync="voiceVisible" width="20%" :modal="false" center>
        <br />
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="inviteVideoOnoToOne(1)">1V1语音电话</el-button>
          <el-button type="primary " @click="inviteVideoOnoToOne(2)">语音会议</el-button>
        </span>
      </el-dialog>

      <!-- 1v1语音电话呼叫栏 -->
      <el-dialog :visible.sync="OnevoneVisible" width="30%" center :modal="false">
        <span>这是一段信息</span>
        <span slot="footer" class="dialog-footer">
          <el-button type="danger" @click="OnevoneVisible = false">挂断</el-button>
        </span>
      </el-dialog>

      <!-- 视频通话对话框 -->
      <el-dialog title="视频电话" :visible.sync="videoVisible" width="20%" :modal="false" center>
        <br />
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="inviteVideoOnoToOne(3)">1V1视频通话</el-button>
          <el-button type="primary " @click="inviteVideoOnoToOne(4)">视频会议</el-button>
          <!-- <el-button type="primary">1V1视频通话</el-button>
          <el-button type="primary">视频会议</el-button>-->
        </span>
      </el-dialog>

      <!-- 无声侦护 -->
      <!-- MailTableData -->
      <el-dialog :visible.sync="DetectionDrawer" width="30%" center :modal="false" title="终端列表">
        <el-table style="width: 100%" @selection-change="handleSelectionChange" :data="multipleSelectionZ">
          <el-table-column type="selection"></el-table-column>
          <el-table-column label="在线状态">
            <template slot-scope="scope">
              <span class="yuan" v-if="scope.row.status !== 0"></span>
              <span class="yuan , hui" v-else></span>
            </template>
          </el-table-column>
          <el-table-column label="账号类型" prop="type">
            <template slot-scope="scope">
              <span v-if="scope.row.type == 1">调度员</span>
              <span v-else-if="scope.row.type == 2">终端用户</span>
            </template>
          </el-table-column>
          <el-table-column label="姓名" prop="fullName"></el-table-column>
          <el-table-column label="工种名称" prop="workName"></el-table-column>
        </el-table>
        <span slot="footer" class="dialog-footer">
          <el-button @click="DetectionDrawer = false">取 消</el-button>
          <el-button type="primary" @click="inviteVideoOnoToOne(5)">确 定</el-button>
        </span>
      </el-dialog>

      <!-- 语音广播对话框 -->
      <el-dialog title="发送语音广播" :visible.sync="VoiceBroadcastVisible" width="40%" :modal="false" :before-close="handleSelectionClose">
        <div class="voices">
          <div class="voice-left">
            <!-- 发送对象表单 -->
            <el-table ref="multipleTable3" :data="multipleSelectionZ" tooltip-effect="dark" style="width: 100%" height="100%" @selection-change="handleSelectionChange">
              <el-table-column type="selection"></el-table-column>
              <el-table-column label="发送对象" width="90">
                <template slot-scope="scope" prop="type">
                  <!-- 后面根据数据来渲染圆点背景色 -->
                  <span class="yuan" v-if="scope.row.status !== 0"></span>
                  <span class="yuan , hui" v-else></span>
                </template>
              </el-table-column>
              <el-table-column label="姓名" prop="fullName"></el-table-column>
            </el-table>
          </div>
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
            <!-- 内容区域 -->
            <div class="rimain">
              <el-form ref="form" :model="recordForm" v-if="audioradio == '1'">
                <el-form-item>
                  <el-input type="textarea" v-model="recordForm.content" :rows="12"></el-input>
                </el-form-item>
              </el-form>
              <el-form ref="form" :model="recordForm" v-if="audioradio == '2'">
                <el-form-item>
                  <audio id="audioStream" controls="controls" style="width: 90%"></audio>
                  <el-button v-if="audioBtn == 0" type="primary" size="mini" class="recordBtn" @click="audioRecord(0)">录 音</el-button>
                  <el-button v-if="audioBtn == 1" type="danger" size="mini" class="recordBtn" @click="audioRecord(1)">终 止</el-button>
                  <el-button v-if="audioBtn == 2" type="warning" size="mini" class="recordBtn" @click="audioRecord(2)">重 录</el-button>
                </el-form-item>
              </el-form>
            </div>
            <el-button type="primary" class="bup" @click="sendRecord" :disabled="isSendRecord">发送</el-button>
          </div>
        </div>
      </el-dialog>

      <!-- 轨迹查询框 -->

      <div class="tarckCss" v-show="showTrack">
        <div style="position: relative;top: 0;z-index: 9999" @click="showLeftTrack">
          <img src="../../assets/images/left-top.png" alt="" style="width: 45px">
        </div>
          <el-dialog :visible.sync="trajectoryVisible" :close-on-click-modal="false" width="100%" center :modal="false">
            <!-- 主体部分 -->

            <div>
              <el-form ref="trackForm" :model="trackForm" label-width="90px">
                <el-form-item label="查看方式：">
                  <el-radio v-model="radio" label="1">历史轨迹</el-radio>
                  <el-radio v-model="radio" label="2">实时轨迹</el-radio>
                </el-form-item>
                <el-form-item label="开始时间：" v-show="radio === '1'">
                  <el-col :span="13">
                    <el-date-picker size="mini" type="date" placeholder="年/月/日" v-model="trackForm.startdate" :picker-options="pickerStart" @blur="startTimeValidator" style="width: 100%"></el-date-picker>
                  </el-col>
                  <el-col class="line" :span="2">-</el-col>
                  <!-- :disabled="isTimePicker" -->
                  <el-col :span="9">
                    <el-time-picker size="mini" v-model="trackForm.starttime" @blur="startTimeValidator" style="width: 100%"></el-time-picker>
                  </el-col>
                </el-form-item>
                <el-form-item label="结束时间：" v-show="radio === '1'">
                  <el-col :span="13">
                    <el-date-picker size="mini" type="date" placeholder="年/月/日" v-model="trackForm.enddate" :picker-options="pickerEnd" @blur="endTimeValidator" style="width: 100%"></el-date-picker>
                  </el-col>
                  <el-col class="line" :span="2">-</el-col>
                  <!-- :disabled="isTimePicker" -->
                  <el-col :span="9">
                    <el-time-picker size="mini" v-model="trackForm.endtime" @blur="endTimeValidator" style="width: 100%"></el-time-picker>
                  </el-col>
                </el-form-item>
                <el-form-item label="间隔时间：">
                  <el-select size="mini" v-model="trackForm.type">
                    <el-option label="5秒" value="1"></el-option>
                    <el-option label="1分钟" value="2"></el-option>
                    <el-option label="5分钟" value="3"></el-option>
                  </el-select>
                </el-form-item>
              </el-form>
              <span slot="footer" class="dialog-footer">
                <el-button @click="closeTrack">关 闭</el-button>
                <el-button type="primary" v-show="radio === '1'" @click="getTrack">获得轨迹</el-button>
                <el-button type="primary" v-show="radio === '2'" @click="getTrack" :disabled="isNowTrack">获得轨迹</el-button>
              </span>
            </div>
          </el-dialog>
      </div>
    </el-container>
    <el-dialog class="calldialog" title="username" :visible.sync="iscall" :close-on-click-modal="false" width="30%" :center="true">
      <span style="text-align: center; display: inline-block; width: 100%">视频通话呼叫中。。。</span>
      <span slot="footer" class="dialog-footer">
        <!-- <el-button @click="dialogVisible = false">取 消</el-button> -->
        <el-button type="primary" @click="iscall = false">挂 断</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<!--<script>// 点聚合</script>-->
<script>
import RSfun from "../../assets/js/record.js";
var RS = RSfun();
import { BmlMarkerClusterer } from "vue-baidu-map";
import pointDispatcher from "../../assets/pointz.png";
import pointTerminal from "../../assets/pointt.png";
import pointOffline from "../../assets/pointh.png";
import pointStart from "../../assets/images/start.png";
import pointEnd from "../../assets/images/end.png";
import qs from "qs";
import { createNamespacedHelpers } from "vuex";
import { async } from "q";
const { mapState, mapActions } = createNamespacedHelpers("track");
import { createSocket, sendWSPush, closeWS } from "../../plugins/socket";
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

export default {
  data() {
    // 群组成员管理
    const generateData = (_) => {
      const rudata = [];
      for (let i = 1; i <= 15; i++) {
        rudata.push({
          key: i,
          label: `备选项 ${i}`,
          disabled: i % 4 === 0,
        });
      }
      return rudata;
    };

    return {
      // 地图初始位置
      center: { lng: 104.081548, lat: 30.652613 }, // 地图缩放度
      zoom: 20,
      polylinePath: [],
      pickerStart: {
        disabledDate: (time) => {
          // (this.trackForm.enddate)
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
          // (this.trackForm.startdate)
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
      
      nowTrackBtn: false,
      // 定时器
      trackIntervalId: null,
      // 控制侧边栏显示
      drawer: true,
      direction: "ltl",
      // 默认选中tab栏
      activeName: "first",
      // 边框显示隐藏
      show: true,
      // 控制按钮位移
      tranLeft: 500, // 向左偏移
      tranTop: 500, // 向右偏移

      // 通讯录数据
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
      recordForm: {
        content: "",
      },
      mailTotal: 0,
      // 查询通讯录成员提交数据
      postmaildata: {
        pageSize: 10,
        pageNum: 1,
      },
      viewForm: [],
      // 通讯录成员表单数据
      MailTableData: [],
      // 查询用户详细信息提交数据
      findDetailData: {
        clientId: "",
        type: "",
      },
      // 查询用户详细信息绑定数据
      findDetliat: {},
      // 是否点击定位
      isClickLocation: false,
      pointDispatcher: pointDispatcher,
      pointTerminal: pointTerminal,
      pointOffline: pointOffline,
      // 查看成员的在线状态
      thisUserStatus: 0,
      // 根据名字查询绑定数据
      FindFormData: {
        name: "",
        workType: "",
      },
      zidianTypeD: {
        zidianType: 0,
      },
      zdtypeData: [],
      // 表格选中数据
      multipleSelection: [],
      // 通讯录数据end
      // 群组功能区
      getMemberData: {
        groupName: null, //参数可以为null，为null时，查询调度员的所有群组列表
        groupId: "", //分组id
      },
      // 群组名称查询
      findGroupByNameData: {
        groupName: "",
      },
      // 群组表单绑定数据
      findGroupList: [],
      // 获取通讯录群组成员,添加群组使用
      addGroupId: {
        //  groupId: ""
      },
      // 添加群组成员绑定数据
      AddToGroupMembers: {
        groupId: "",
        groupName: "",
        waitAdd: [
          // {
          //   id: 2,
          //   userName: "superadmin",
          //   fullName: "李老二",
          //   mobile: null,
          //   status: 0,
          //   type: 1,
          //   workName: "调度员",
          //   color: "#804000"
          // }
        ],
        add: [],
      },
      // 添加群组成员管理
      rudata: generateData(),
      value: [],
      // 添加穿梭框处理数据start
      // 所有未添加数据（也是数据）
      TransFerAllAdd: [],
      // 添加穿梭框处理数据end
      AddToGroupMembersRules: {
        groupName: [
          { required: true, message: "请输入活动名称", trigger: "blur" },
          { min: 3, max: 5, message: "长度在 3 到 5 个字符", trigger: "blur" },
        ],
      },
      transArrAdd: [], //群组成员添加的数据
      // 点击添加的数据
      forDataAdd: [],
      // 编辑选中群组基础信息
      editMemberData: {
        // groupId: 16
        // groupName: "分组ddd"
        // projectId: 1
      },
      // 群组编辑栏数据区start
      editMemberdForm: {
        // groupId: "",
        // groupName: "",
        // waitAdd: [
        //   // {
        //   //   id: 2,
        //   //   userName: "superadmin",
        //   //   fullName: "李老二",
        //   //   mobile: null,
        //   //   status: 0,
        //   //   type: 1,
        //   //   workName: "调度员",
        //   //   color: "#804000"
        //   // }
        // ],
        // add: []
      }, //这个回去对象数据
      editData: [], //合并所有的编辑数据
      editHandleData: [], //所有处理好的数据
      editAddListData: [], //处理好要以添加的数据
      arrYrr: [], //处理回已添加状态的数据
      // 群组编辑栏数据区end
      // 群组功能区end

      // 成员信息弹框
      MemberDialogVisible: false,
      DispatcherDialogVisible: false,
      adddVisible: false,
      edddialogVisible: false,
      // 添加群组绑定数据
      ruleForm: {
        name: "",
      },
      // 添加群组绑定数据验证规则
      rules: {
        name: [
          { required: true, message: "请输入活动名称", trigger: "blur" },
          { min: 3, max: 5, message: "长度在 3 到 5 个字符", trigger: "blur" },
        ],
      },
      // 群组编辑框
      editVisible: false,
      // 群组栏显示内容变化
      downIcon: true,
      // 语音对话框显示
      voiceVisible: false,
      // 视频通话对话框
      videoVisible: false,
      // 语音广播对话框
      VoiceBroadcastVisible: false,
      audioradio: "1",
      // 单选框绑定数据
      radio: "1",
      // 轨迹查询
      trajectoryVisible: false,
      // 无声侦查对话框
      showTrack: false,
      DetectionDrawer: false,
      // 1v1语音电话对话框
      OnevoneVisible: false,
      // 测试折叠框
      activeNames: [],
      deleteDialogVisible: false,
      //是否正在呼叫
      iscall: false,
      socket: null,
      // path: "ws://118.190.38.198:8080/video/web/",
      // path: "ws://192.168.0.16:8083/video/web/",
      timer: null, //定时器
      groupDetailed: true,
      groupDataRow: {},
      groupDataRowTwo: {},
      MailTableDataTwo: [],
      GroupId: 0, //当前账号组id
      editValueGrou: [], //穿梭框编辑栏操作数据
      multipleSelectionZ: [], //终端成员
      audioSrc: "",
      audioBtn: 0, // 录音状态
      audioStream: new FormData(),
      topViewTrack: false,
      audioMediaStream: null,
      hasCall: true,
      hasVideo: true,
      hasBroadcast: true,
      hasTrail: true,
      hasListener: true,
      isNowTrack: false,
      roleList: [], //功能权限数据
      pointLocation: [],
      pointStart: pointStart,
      pointEnd: pointEnd,
      isTrack: false, //控制显示轨迹的起点和终点
      startPoints: [],
      endPoints: [],
      terminalLocation: { url: pointTerminal, size: { width: 40, height: 96 } },
      pointDispatcher: pointDispatcher,
      pointTerminal: pointTerminal,
      showYardMan: false,
      showTerminal: false,
      MemberDialogVisible: false,
      rowData: [],
      rowDataArray: [],
      isrow: false,
      pointList: [],
      table_list: [],
      timeEsInterval: null,
      bpoint: [], // 定位点定位合集
      lastPl: [], // 记录刷新前的通讯录选中数据
      isDetective:false,
      
      videoStates:true
    };
  },
  created() {
    if(sessionStorage.getItem('videoStates') == 'false'){
      
    }
    this.postMailData();
    // await this.initWebsocket();
    this.getWorkType();
    // this.setTimer();
    this.getRoleBtnData();
    // this.timer = setInterval(this.postMailData(), 30000);
    this.timerEs();
    
    window.addEventListener("videoState", this.selectablestatus);
  
  },
  mounted() {
     
    // this.timer = setInterval(this.postMailData, 30000);
    let now = new Date();
    this.trackForm.enddate = new Date();
    this.trackForm.endtime = new Date(
      new Date(new Date().toLocaleDateString()).getTime() +
        24 * 60 * 60 * 1000 -
        1
    );
    this.trackForm.startdate = new Date();
    this.trackForm.starttime = new Date(
      new Date(new Date().toLocaleDateString()).getTime()
    );
    // this.trackForm.startdate = new Date(
    //   new Date().getTime() - 24 * 60 * 60 * 1000
    // );
    // this.trackForm.starttime = new Date(
    //   new Date().getTime() - 24 * 60 * 60 * 1000
    // );
    //总后台功能配置
    this.getCall();
    this.getVideo();
    this.getBroadcast();
    this.getTrail();
    this.getListener();
    window.addEventListener("updateOnline", this.updateOnline);
  },
  destroyed() {
    // this.socket.onclose = this.close;
  },
  activated() {
    // this.getMessage();
  },
  beforeDestroy() {
    clearInterval(this.trackIntervalId);
  },
  components: {
    BmlMarkerClusterer,
  },
  computed: {
    ...mapState([]),
    
    isLocation() {
      if (this.isClickLocation === true && this.MemberDialogVisible !== false) {
        return true;
      } else {
        false;
      }
    },
    // pointZ() {
    //   let point = JSON.parse(JSON.stringify(this.center));
    //   point.lat += -0.016;
    //   point.lng += -0.009;
    //   return point;
    // },
    pointz() {
      let point = {
        lng: this.findDetliat.longitude,
        lat: this.findDetliat.latitude,
      };
      return point;
    },
    pointh() {
      let point = {
        lng: this.findDetliat.longitude,
        lat: this.findDetliat.latitude,
      };
      return point;
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
        // this.trackForm.starttime = "";
        this.trackForm.endtime = "";
        return true;
      }
    },
    // 是否选择了成员，选择了返回true
    isChooseUser() {
      if (this.multipleSelection.length > 0) {
        return true;
      } else {
        return false;
      }
    },
    isSendRecord() {
      if (this.multipleSelection.length != 0) {
        return false;
      } else {
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
          lng: this.findDetliat.longitude,
          lat: this.findDetliat.latitude,
        };
        this.center = data;
        this.zoom = 20;
      }
      return data;
    },
  },

  beforeDestroy() {
    clearInterval(this.timer);
    clearInterval(this.timeEsInterval);
  },
  methods: {

    // 更新在线状态
    updateOnline() {
      this.postMailData();
    },
    // 点聚合
    djh() {

    },

    oneClick() {
      // if (this.zoom !== 15) {
      this.zoom = 20;
      // } else if (this.zoom == 15) {
      //   this.zoom = 20;
      // }
      // ("zoom+", this.zoom);
      // ("this.center", this.center);
      this.center.lng = this.center.lng + 0.00138;
      this.center.lat = this.center.lat + 0.00138;
      this.MemberDialogVisible = true;
    },
    twoClick() {
      this.DispatcherDialogVisible = true;
    },
    ...mapActions(["gettrackAsync", "getLatestPointAsync"]),
    /**
     * 地图新增覆盖物触发函数
     */
    mapAddoverlay() {},
    handler({ BMap, map }) {
      let point = new BMap.Point(104.081548, 30.652613);
      map.centerAndZoom(point, 12);
      map.addOverlay(point); // let mapStyle = { style: "midnight" }; // map.setMapStyle(mapStyle);
      let that = this;
      window.addEventListener("mapAddoverlay", function () {
        let view = map.getViewport(eval(that.bpoint));
        let mapZoom = view.zoom;
        let centerPoint = view.center;
        map.centerAndZoom(centerPoint, mapZoom);
      });
    },
    // 功能权限
    async getRoleBtnData() {
      let dataR = {
        parentId: 3,
        userName: null,
      };
      const { data: res } = await this.$http.get("menu/getButtonMenus", {params: dataR});
      let arr = [];
      res.data.forEach((item) => {
        arr.push(item.mid);
      });
      this.roleList = arr;
    },

    //功能配置——语音电话
    getCall() {
      let isCall = JSON.parse(sessionStorage.getItem("configIsCall"));
      if (isCall == 0) {
        this.hasCall = true;
      } else if (isCall == 1) {
        this.hasCall = false;
      }
    },
    //功能配置——视频电话
    getVideo() {
      let video = JSON.parse(sessionStorage.getItem("configVedio"));
      // (video,"视频电话");
      if (video == 0) {
        this.hasVideo = true;
      } else if (video == 1) {
        this.hasVideo = false;
      }
    },
    //功能配置——语音广播
    getBroadcast() {
      let broadcast = JSON.parse(sessionStorage.getItem("configBroadcast"));
      // (broadcast,"语音广播");
      if (broadcast == 0) {
        this.hasBroadcast = true;
      } else if (broadcast == 1) {
        this.hasBroadcast = false;
      }
    },
    //功能配置——轨迹
    getTrail() {
      let trail = JSON.parse(sessionStorage.getItem("configTrail"));
      // (trail,"轨迹");
      if (trail == 0) {
        this.hasTrail = true;
      } else if (trail == 1) {
        this.hasTrail = false;
      }
    },
    //功能配置——无声侦护
    getListener() {
      let listener = JSON.parse(sessionStorage.getItem("configListener"));
      // (listener,"无声侦护");
      if (listener == 0) {
        this.hasListener = true;
      } else if (listener == 1) {
        this.hasListener = false;
      }
    },
    // 验证时间不得超过24小时
    startTimeValidator(e) {
      var h = new Date(this.trackForm.endtime).getHours();
      var m = new Date(this.trackForm.endtime).getMinutes();
      var s = new Date(this.trackForm.endtime).getSeconds();
      var h2 = new Date(this.trackForm.starttime).getHours();
      var m2 = new Date(this.trackForm.starttime).getMinutes();
      var s2 = new Date(this.trackForm.starttime).getSeconds();
      var start = new Date(this.trackForm.startdate);
      var end = new Date(this.trackForm.enddate);
      var year = start.getFullYear();
      var month = start.getMonth() + 1;
      var date = start.getDate();
      var year2 = end.getFullYear();
      var month2 = end.getMonth() + 1;
      var date2 = end.getDate();
      var startymd = year + "-" + month + "-" + date;
      var endymd = year2 + "-" + month2 + "-" + date2;
      // (startymd,endymd)
      if (this.trackForm.endtime !== "" && this.trackForm.endtime !== null) {
        // if (
        //   new Date(this.trackForm.startdate).getTime() / 1000 !==
        //   new Date(this.trackForm.enddate).getTime() / 1000
        // )
        if (startymd !== endymd) {
          //两天
          // (e.valueOnOpen , this.trackForm.endtime)
          this.trackForm.starttime, this.trackForm.endtime;
          // if ( this.trackForm.endtime.getTime() - this.trackForm.starttime.getTime() > 24*60*60*1000){
          //   this.trackForm.starttime = "";
          //   this.$message.error("选择时间不得超过24小时");
          // }
          if (h > h2) {
            this.trackForm.starttime = "";
            this.$message.error("选择时间不得超过24小时");
          }
          if (h == h2 && m > m2) {
            this.trackForm.starttime = "";
            this.$message.error("选择时间不得超过24小时");
          }
          if (h == h2 && m == m2 && s > s2) {
            this.trackForm.starttime = "";
            this.$message.error("选择时间不得超过24小时");
          }
        } else if (startymd == endymd) {
          // (e.valueOnOpen > this.trackForm.starttime)
          // (this.trackForm.starttime.getTime(), this.trackForm.endtime.getTime())
          // if (this.trackForm.endtime.getTime() - this.trackForm.starttime.getTime() < 0) {
          //   this.trackForm.starttime = "";
          //   this.$message.error("选择时间不得大于结束时间");
          // }
          if (h < h2) {
            this.trackForm.starttime = "";
            this.$message.error("开始时间不得大于结束时间");
          }
          if (h == h2 && m < m2) {
            this.trackForm.starttime = "";
            this.$message.error("开始时间不得大于结束时间");
          }
          if (h == h2 && m == m2 && s < s2) {
            this.trackForm.starttime = "";
            this.$message.error("开始时间不得大于结束时间");
          }
        }
      }
    },
    endTimeValidator(e) {
      var h = new Date(this.trackForm.endtime).getHours();
      var m = new Date(this.trackForm.endtime).getMinutes();
      var s = new Date(this.trackForm.endtime).getSeconds();
      var h2 = new Date(this.trackForm.starttime).getHours();
      var m2 = new Date(this.trackForm.starttime).getMinutes();
      var s2 = new Date(this.trackForm.starttime).getSeconds();

      var start = new Date(this.trackForm.startdate);
      var end = new Date(this.trackForm.enddate);
      var year = start.getFullYear();
      var month = start.getMonth() + 1;
      var date = start.getDate();
      var year2 = end.getFullYear();
      var month2 = end.getMonth() + 1;
      var date2 = end.getDate();
      var startymd = year + "-" + month + "-" + date;
      var endymd = year2 + "-" + month2 + "-" + date2;
      // (startymd,endymd)
      if (
        this.trackForm.starttime !== "" &&
        this.trackForm.starttime !== null
      ) {
        // if (
        //   new Date(this.trackForm.startdate).getTime() !==
        //   new Date(this.trackForm.enddate).getTime()
        // )
        if (startymd !== endymd) {
          //两天
          // if (this.trackForm.endtime.getTime() - this.trackForm.starttime.getTime() > 24*60*60*1000) {
          //   this.trackForm.endtime = "";
          //   this.$message.error("选择时间不得超过24小时");
          // }
          if (h > h2) {
            this.trackForm.endtime = "";
            this.$message.error("选择时间不得超过24小时");
          }
          if (h == h2 && m > m2) {
            this.trackForm.endtime = "";
            this.$message.error("选择时间不得超过24小时");
          }
          if (h == h2 && m == m2 && s > s2) {
            this.trackForm.endtime = "";
            this.$message.error("选择时间不得超过24小时");
          }
        } else if (startymd == endymd) {
          // (e.valueOnOpen < this.trackForm.starttime)
          // if (this.trackForm.endtime.getTime() - this.trackForm.starttime.getTime() > 0) {
          //   this.trackForm.endtime = "";
          //   this.$message.error("选择时间不得小于开始时间");
          // }
          if (h < h2) {
            this.trackForm.endtime = "";
            this.$message.error("结束时间不得小于开始时间");
          }
          if (h == h2 && m < m2) {
            this.trackForm.endtime = "";
            this.$message.error("结束时间不得小于开始时间");
          }
          if (h == h2 && m == m2 && s < s2) {
            this.trackForm.endtime = "";
            this.$message.error("结束时间不得小于开始时间");
          }
        }
      }
    },
    // 测试折叠框
    handleChange(val) {

    },
    // 通讯录方法(获取所有数据)
    async postMailData() {
      let indexArr = JSON.parse(JSON.stringify(this.table_list));
      const { data: res } = await this.$http.post("contact/findContact", qs.stringify(this.postmaildata));
      this.MailTableData = res.data.list;
      // 请求筛选终端成员
      const { data: res2 } = await this.$http.post("contact/findContact", qs.stringify({pageSize: 999, pageNum: 1,}));
      this.multipleSelectionZ = [];
      res2.data.list.forEach((element) => {
        if (element.type === 2) {
          this.multipleSelectionZ.push(element);
        }
      });
      this.mailTotal = res.data.total;
      this.GroupId = sessionStorage.GroupId; //将当前用户的组id传进来
      // ("定时器炸开每30秒，自动获取状态");
      let mailArr = [];
      this.MailTableData.forEach((element) => {
        indexArr.forEach((el) => {
          if (element.id == el) {
            mailArr.push(element);
          }
        });
      });
      this.toggleSelection(mailArr)
    },
    // 定时触发
    timerEs() {
      this.timeEsInterval = setInterval(() => {
        this.postMailData();
      }, 15000);
    },
    // 点击触发信息框显示与隐藏,需要获取数据
    shrink(e) {
      // 根据事件处理参数e下的pageX，PageY来定位div的位置
      // this.drawer = true;
      this.drawer = !this.drawer;
      // alert(this.drawer);

      // 每次点击都重新获取下数据
      // this.postMailData();
    },
    // 查询用户详细信息
    // 点击打开成员信息弹框
    async MemberInformation(row) {
      // ("zoom", this.zoom);
      // if (this.zoom !== 15) {
      //   this.zoom = 15;
      // } else if (this.zoom == 15) {
      //   this.zoom = 20;
      // }
      // ("zoom+", this.zoom);

      this.topViewTrack = false;
      this.isClickLocation = false; // 控制是否定位
      this.thisUserStatus = row.status;
      this.findDetailData.type = row.type;
      this.findDetailData.clientId = row.id;
      const { data: res } = await this.$http.post("contact/findContactDetail", qs.stringify(this.findDetailData));
      this.findDetliat = res.data;
      if (this.findDetliat.userType == 1) {
        this.findDetliat.userType = "调度员";
      } else if (this.findDetliat.userType == 2) {
        this.findDetliat.userType = "终端用户";
      }
      this.MemberDialogVisible = true;
      // 当前行数据
      this.rowData = row;

      // this.$refs.multipleTable.clearSelection();
      this.multipleSelection = [];
      this.multipleSelection.push(row);

      this.$refs.multipleTable.clearSelection();
      this.$refs.multipleTable.toggleRowSelection(row);
    },
    // 查看定位
    viewLocation() {
      this.zoom = 10;

      if (this.topViewTrack == false) {
        if (
          this.findDetliat.longitude &&
          this.findDetliat.longitude !== "" &&
          this.findDetliat.longitude !== "undefined" &&
          this.findDetliat.latitude &&
          this.findDetliat.latitude !== "" &&
          this.findDetliat.latitude !== "undefined"
        ) {
          this.isClickLocation = true; // 控制是否定位
          this.center = {
            lng: this.findDetliat.longitude,
            lat: this.findDetliat.latitude,
          };
        } else {
          this.$message.error("暂无定位！");
        }
      } else {
        if (
          this.multipleSelection[0].longitude &&
          this.multipleSelection[0].longitude !== "" &&
          this.multipleSelection[0].longitude !== "undefined" &&
          this.multipleSelection[0].latitude &&
          this.multipleSelection[0].latitude !== "" &&
          this.multipleSelection[0].latitude !== "undefined"
        ) {
          this.isClickLocation = true; // 控制是否定位
          this.center = {
            lng: this.multipleSelection[0].longitude,
            lat: this.multipleSelection[0].latitude,
          };
        } else {
          this.$message.error("暂无定位！");
        }
      }
    },
    // 跳转到定位页面,终端
    ZDviewAction() {
      // let account = row.uploadByAccount;
      // const data = await this.getLocationAsync(account);
      // if (data.code == 200) {
      //   // 实现路由跳转打开新标签页
      //   (data);
      sessionStorage.locationData = JSON.stringify(this.findDetliat);
      //   const { href } = this.$router.resolve({
      //     path: "/viewlocation"
      //   });
      //   window.open(href, "_blank");
      // } else {
      //   this.$message("无法获取定位信息，请联系调度员或终端");
      // }
      const { href } = this.$router.resolve({path: "/viewLocation",});
      window.open(href, "_blank");
    },
    //定位跳转
    DWviewAction() {
      // this.zoom = 10;
      // ("zoom", this.zoom);
      // if (this.zoom !== 15) {
      //   this.zoom = 15;
      // } else if (this.zoom == 15) {
      //   this.zoom = 20;
      // }
      // ("zoom+", this.zoom);

      this.isClickLocation = true; // 控制是否定位
      this.showTerminal = true;
      this.center = {
        lng: 104,
        lat: 30,
      };
      this.center = {
        lng: this.findDetliat.longitude,
        lat: this.findDetliat.latitude,
      };

      // 显示图标
      if (this.findDetliat.color == "#0C468E") {
        this.terminalLocation.url = L_0C468E;
      } else if (this.findDetliat.color == "#2DD787") {
        this.terminalLocation.url = L_2DD787;
      } else if (this.findDetliat.color == "#3FE5F2") {
        this.terminalLocation.url = L_3FE5F2;
      } else if (this.findDetliat.color == "#5C4DC6") {
        this.terminalLocation.url = L_5C4DC6;
      } else if (this.findDetliat.color == "#9B5718") {
        this.terminalLocation.url = L_9B5718;
      } else if (this.findDetliat.color == "#011C31") {
        this.terminalLocation.url = L_011C31;
      } else if (this.findDetliat.color == "#68E122") {
        this.terminalLocation.url = L_68E122;
      } else if (this.findDetliat.color == "#814A94") {
        this.terminalLocation.url = L_814A94;
      } else if (this.findDetliat.color == "#1596FF") {
        this.terminalLocation.url = L_1596FF;
      } else if (this.findDetliat.color == "#009721") {
        this.terminalLocation.url = L_009721;
      } else if (this.findDetliat.color == "#C3C3C3") {
        this.terminalLocation.url = L_C3C3C3;
      } else if (this.findDetliat.color == "#D32084") {
        this.terminalLocation.url = L_D32084;
      } else if (this.findDetliat.color == "#F8EA38") {
        this.terminalLocation.url = L_F8EA38;
      } else if (this.findDetliat.color == "#FF3E59") {
        this.terminalLocation.url = L_FF3E59;
      } else if (this.findDetliat.color == "#FFB142") {
        this.terminalLocation.url = L_FFB142;
      }
      // 判断是否在线
      // if (this.rowData.status == 0) {
      //   this.terminalLocation.url = L_C3C3C3;
      // }
      if (this.findDetliat.userType == "调度员") {
        if (this.rowData.status == 0) {
          this.terminalLocation.url = L_29710;
        } else {
          this.terminalLocation.url = L_29711;
        }
      }
      this.MemberDialogVisible = false;
    },
    // 根据名字查询
    async FindName() {
      if (this.FindFormData.name == "") {
        return this.postMailData();
      }
      this.FindFormData.zidianType = "";
      const { data: res } = await this.$http.get("contact/findName", {
        params: this.FindFormData,
      });
      this.MailTableData = res.data.list;
    },
    // 进入页面获取工种信息
    async getWorkType() {
      const { data: res } = await this.$http.get("system/zidian/getWorkTypeList", {params: this.zidianTypeD,});
      this.zdtypeData = res.data;
      const arr = [];
      for (let v = 0; v < this.zdtypeData.length; v++) {
        arr.push({
          zid: this.zdtypeData[v].zid,
          name: this.zdtypeData[v].name,
        });
      }
      let allds = [
        {
          zid: -1,
          name: "全部",
        },
      ];
      // arr = arr.concat(allds);
      let c = arr.concat(allds);
      this.zdtypeData = c;
    },
    // 根据工种查询(没有渲染到页面上)
    async getWorkTypeList() {
      this.FindFormData.name = "";
      if (this.FindFormData.zidianType == -1) {
        this.postMailData();
        return;
      }
      this.FindFormData.workType = this.FindFormData.zidianType;
      const { data: res } = await this.$http.get("contact/findWorkType", {params: this.FindFormData,});
      this.MailTableData = res.data.list;
      this.mailTotal = res.data.total;
    },
    // 通讯录分页
    MailhandleCurrentChange(val) {
      this.postmaildata.pageNum = val;
      this.postMailData();
    },
    // 通讯录方法end

    // 获取通讯录成员数据
    // tab栏点击监听
    handleClick(tab, event) {
      tab, event;
    },
    // 调度员弹框
    getDispatcher() {
      this.DispatcherDialogVisible = true;
    },
    // 通讯录表单数据点击按钮
    handleSelectionChange(val) {
      this.multipleSelection = val;
        // if (val.length > 0) {
        //   for(let i =0;i<=val.length;i++){
        //     if(val[i].type != 2){
        //       this.isDetective =false
        //     }else {
        //       this.isDetective =true;
        //     }
        //   }
        // };
      this.table_list = [];
      val.forEach((val, index) => {
        this.MailTableData.forEach((v, i) => {
          // id 是每一行的数据id
          if (val.id == v.id) {
            this.table_list.push(val.id);
          }
        });
      });
      // "----------------点击选择的行数据", this.table_list;
      this.pointLocation = val;
      this.bpoint = [];
      this.pointLocation.forEach((element) => {
        // 显示图标
        if (element.color == "#0C468E") {
          this.terminalLocation.url = L_0C468E;
        } else if (element.color == "#2DD787") {
          this.terminalLocation.url = L_2DD787;
        } else if (element.color == "#3FE5F2") {
          this.terminalLocation.url = L_3FE5F2;
        } else if (element.color == "#5C4DC6") {
          this.terminalLocation.url = L_5C4DC6;
        } else if (element.color == "#9B5718") {
          this.terminalLocation.url = L_9B5718;
        } else if (element.color == "#011C31") {
          this.terminalLocation.url = L_011C31;
        } else if (element.color == "#68E122") {
          this.terminalLocation.url = L_68E122;
        } else if (element.color == "#814A94") {
          this.terminalLocation.url = L_814A94;
        } else if (element.color == "#1596FF") {
          this.terminalLocation.url = L_1596FF;
        } else if (element.color == "#009721") {
          this.terminalLocation.url = L_009721;
        } else if (element.color == "#D32084") {
          this.terminalLocation.url = L_D32084;
        } else if (element.color == "#F8EA38") {
          this.terminalLocation.url = L_F8EA38;
        } else if (element.color == "#FF3E59") {
          this.terminalLocation.url = L_FF3E59;
        } else if (element.color == "#FFB142") {
          this.terminalLocation.url = L_FFB142;
        }
        // 判断是否在线
        // if (element.status == 0) {
        //   this.terminalLocation.url = L_C3C3C3;
        // }
        if (element.type == 1) {
          if (element.status == 0) {
            this.terminalLocation.url = L_29710;
          } else {
            this.terminalLocation.url = L_29711;
          }
        }
        element.center = {
          lat: element.latitude,
          lng: element.longitude,
        };
        element.url = this.terminalLocation.url;
        // this.bpoint.push(element.center);
      });
      this.djh();
      // mapAddoverlay
      // if (this.pointLocation.length == 1) {
      //   this.center = this.pointLocation[0].center;
      //   this.zoom = 20;
      //   // this.center = this.pointLocation[0].center;
      // } else if (this.pointLocation.length != 0) {
      //   this.center = {
      //     lat: this.center + 0.000001,
      //     lng: this.center + 0.000001
      //   };
      //   this.zoom = 12;
      // }

      if (this.lastPl !== this.pointLocation) {
        window.dispatchEvent(new CustomEvent("mapAddoverlay", {}));
        this.lastPl = JSON.parse(JSON.stringify(this.pointLocation));
      }
    },
    // 通讯录表单选中某行
    toggleSelection(rows) {
      if (rows) {
        rows.forEach((row) => {
          this.$refs.multipleTable.toggleRowSelection(row);
        });
      } else {
        this.$refs.multipleTable.clearSelection();
      }
    },

    // 群组功能区
    // 获取群组成员列表,群组按名称搜索数据
    async findGroupByName() {
      this.getMemberData.groupId = this.GroupId;
      const { data: res } = await this.$http.get("contact/findGroupByName", {
        params: this.getMemberData,
      });
      // this.$message.success("获取群组成员信息成功");
      this.findGroupList = res.data;
      this.groupDetailed = true;
    },
    // 点击添加群组管理
    async addGetVisible() {
      // this.addGroupId.groupId = this.GroupId;
      const { data: res } = await this.$http.get("contact/getContactGroupMember",
        {params: this.addGroupId,}
      );
      res.data.groupName = "";
      this.AddToGroupMembers = res.data;
      // // 将获取到的数据进行处理，符合显示在框内要求
      const AllAddData = [];
      for (let i = 0; i < this.AddToGroupMembers.waitAdd.length; i++) {
        AllAddData.push({
          key: this.AddToGroupMembers.waitAdd[i].id,
          label: this.AddToGroupMembers.waitAdd[i].fullName,
        });
      }
      this.TransFerAllAdd = AllAddData;
      this.adddVisible = true;
    },
    // 添加数据切换事件
    ferHandleChange(value, direction, movedKeys) {
      for (let i = 0; i < value.length; i++) {
        const arrAdd = this.AddToGroupMembers.waitAdd.filter((item) => {
          return item.id == value[i];
        });
        this.transArrAdd = this.transArrAdd.concat(arrAdd);
      }
    },
    // 确定添加群组数据并上传
    async addDataListMembers() {
      // 将添加的数据从总数据中去掉，并赋值给add栏
      const addData = this.transArrAdd;
      const AllDATA = this.AddToGroupMembers.waitAdd;
      // 让添加出具遍历，用里面每一项数据对比总数据的美一项
      for (let i = 0; i < addData.length; i++) {
        let index = AllDATA.indexOf(addData[i]);
        if (index != -1);
        AllDATA.splice(index, 1); //剩余数据
      }
      this.AddToGroupMembers.waitAdd = AllDATA;
      this.AddToGroupMembers.add = addData;
      const { data: res } = await this.$http.post("contact/createContactGroup",
        this.AddToGroupMembers
      );

      if (res.code !== 200) return this.$message.error("成员添加失败");
      this.$message.success("成员添加成功");
      this.adddVisible = false;
      this.value = [];
      this.TransFerAllAdd = [];
      this.findGroupByName();
    },

    // 显示群组编辑对话框
    editDleteOf(row) {
      this.editMemberData = row;
      this.edddialogVisible = true;
    },

    // 点击编辑内容切换显示内容，点击返回切换显示内容
    async editadd() {
      this.edddialogVisible = false;
      //  根据选中的群组id获取到相应的数据
      const { data: res } = await this.$http.get("contact/getContactGroupMember",
        {params: this.editMemberData}
      );
      this.editMemberdForm = res.data;
      // 将未添加与添加的数组合并，处理成穿梭狂需要的格式，再将已添加数据进行处理分开
      const editAddList = [];
      for (let i = 0; i < this.editMemberdForm.add.length; i++) {
        editAddList.push(this.editMemberdForm.add[i].id);
      }
      this.editAddListData = editAddList;
      const editWietData = [];
      this.editData = this.editMemberdForm.waitAdd.concat(
        this.editMemberdForm.add
      );
      for (let i = 0; i < this.editData.length; i++) {
        editWietData.push({
          key: this.editData[i].id,
          label: this.editData[i].fullName,
        });
      }
      this.editHandleData = editWietData;
      this.editVisible = true;
    },
    // 群组编辑穿梭栏切换
    editMemHandleChange(value, direction, movedKeys) {
      this.editValueGrou = value;
      for (let i = 0; i < value.length; i++) {
        const arr12 = this.editData.filter((item) => {
          return item.id == value[i];
        });
        // this.arrYrr = arr12;
        this.arrYrr = this.arrYrr.concat(arr12);
      }
    },
    // 上传编辑好的数据
    async editMemHandleEvent() {
      if (this.editValueGrou.length == 0) {
        this.findGroupByName();
        this.editVisible = false;
        return;
      } else {
        var editDataListROM = this.editData;
        var arrYrrData = this.arrYrr;
        // ("arrYrrData", arrYrrData);
        // 根据id查询数组
        let inone = [];
        for (let i = 0; i < editDataListROM.length; i++) {
          for (let j = 0; j < this.editValueGrou.length; j++) {
            if (editDataListROM[i].id == this.editValueGrou[j]) {
              inone.push(editDataListROM[i]);
            }
          }
        }
        let index = [];
        for (let i = 0; i < this.editValueGrou.length; i++) {
          for (let j = 0; j < editDataListROM.length; j++) {
            if (this.editValueGrou[i] == editDataListROM[j].id) {
              editDataListROM.splice(j, 1);
            }
          }
        }
        index = editDataListROM;
        this.editMemberdForm.add = inone;
        this.editMemberdForm.waitAdd = index;
        const { data: res } = await this.$http.post(
          "contact/editContactGroup",
          this.editMemberdForm
        );
        if (res.code !== 200) return this.$message.error(res.message);
        this.$message.success("编辑群组成功");
        this.findGroupByName();
        this.editVisible = false;
      }
    },
    editMemHandleclose() {
      this.value = [];
      this.TransFerAllAdd = [];
      this.editAddListData = [];
      this.editHandleData = [];
      this.editVisible = false;
    },
    // 群组功能区end

    // 点击返回切换显示内容
    backAdd() {
      this.downIcon = !this.downIcon;
    },
    // 编辑删除
    deleteadd() {
      this.edddialogVisible = false;
      this.deleteDialogVisible = true;
    },
    // 确定删除
    async deleteDataMem() {
      const { data: res } = await this.$http.get("contact/deleteContactGroup", {
        params: this.editMemberData,
      });
      if (res.code !== 200) return this.$message.error("删除失败");
      this.$message.success("数据 删除成功");
      this.findGroupByName();
      this.value = [];
      this.TransFerAllAdd = [];
      this.editAddListData = [];
      this.editHandleData = [];
      this.deleteDialogVisible = false;
    },
    // 触发语音电话栏
    VoiceTelephone() {
      if (this.isChooseUser) {
        // this.voiceVisible = true;
        this.MemberDialogVisible = false;
        if (this.multipleSelection.length == 1) {
          if (this.multipleSelection[0].status != 0) {
            this.inviteVideoOnoToOne(1);
          } else {
            this.$message.error("对方不在线");
          }
        } else {
          this.inviteVideoOnoToOne(2);
        }
      }
    },
    // 视频通话栏
    videoTelephone() {
      // this.isChooseUser =false 
      if (this.isChooseUser) {
        this.MemberDialogVisible = false;
        if (this.multipleSelection.length == 1) {
          if (this.multipleSelection[0].status != 0) {
            this.inviteVideoOnoToOne(3);
            
          } else {
            this.$message.error("对方不在线");
          }
        } else {
          this.inviteVideoOnoToOne(4);
        }
      }
    },
    // 语音广播对话框
    VoiceBroadcast() {
      this.multipleSelection = [];
      this.VoiceBroadcastVisible = true;
    },
    showLeftTrack(){
      this.trajectoryVisible = !this.trajectoryVisible;
    },
    // 开始轨迹监控
    getTraJecJory() {
      if (this.isChooseUser) {
        if (this.multipleSelection.length > 1) {
          this.$message.error("只能选择一个终端成员");
        } else {
          if (this.multipleSelection[0].type == 2) {
            this.showTrack = true
            this.trajectoryVisible = true;
            this.topViewTrack = true;
            this.viewLocation();
            this.MemberDialogVisible = false;
          } else {
            this.$message.error("只能选择一个终端成员");
          }
        }
      }
      // this.MailTableData
    },
    // 获得历史轨迹
    async getTrack() {
      if (this.multipleSelection.length == 1) {
        if (this.multipleSelection[0].type == 2) {
          if (this.radio === "1") {
            // 历史轨迹
            this.historyTrack();
          } else if (this.radio === "2") {
            // 实时轨迹
            this.nowTrack();
          }
        } else {
          this.$message.error("只能选择一个终端用户");
        }
      } else if (this.multipleSelection.length == 0) {
        this.$message.error("请选择终端进行查询");
      } else {
        this.$message.error("只能选择一个终端用户");
      }
    },
    // 获得历史轨迹
    async historyTrack() {
      // this.trajectoryVisible = false;
      this.polylinePath = [];
      this.dialogVisible = false;
      let d = new Date(this.trackForm.startdate);
      let startd = d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate();
      let da = new Date(this.trackForm.starttime);
      let startt = da.getHours() + ":" + da.getMinutes() + ":" + da.getSeconds();
      let dat = new Date(this.trackForm.enddate);
      let endd = dat.getFullYear() + "-" + (dat.getMonth() + 1) + "-" + dat.getDate();
      let date = new Date(this.trackForm.endtime);
      let endt = date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
      let startTime = startd + " " + startt;
      let endTime = endd + " " + endt;
      let num = (new Date(endTime).getTime() / 1000 - new Date(startTime).getTime() / 1000) / 10;
      let i = parseInt(num);
      if (this.topViewTrack == true) {
        var paramsget = {
          entity_name: this.multipleSelection[0].userName,
          start_time: new Date(startTime).getTime() / 1000,
          end_time: new Date(endTime).getTime() / 1000,
          page_index: 1,
        };
      } else {
        var paramsget = {
          entity_name: this.findDetliat.account,
          start_time: new Date(startTime).getTime() / 1000,
          end_time: new Date(endTime).getTime() / 1000,
          page_index: 1,
        };
      }

      let data = await this.gettrackAsync(paramsget);
      let timeInter;
      if (this.trackForm.type === "1") {
        timeInter = 5
      } else if (this.trackForm.type === "2") {
        timeInter = 60
      } else {
        timeInter = 300
      }

      this.polylinePath = [];
      if (data.status === 0) {
        if (data.points.length == 0) {
          this.$message("暂无轨迹");
          return;
        }
        let trace_flag = []
        let new_trace_flag = []
        let pointsLists = []
        let pointsList = data.points
        for(let i=0;i<pointsList.length;i++){
          pointsLists.push({lng:pointsList[i].longitude,lat:pointsList[i].latitude,trace_flag: pointsList[i].trace_flag,loc_time:pointsList[i].loc_time})
        }
        pointsLists.forEach(item=>{
          var n = trace_flag.indexOf(item.trace_flag);
          if (n==-1) {
            trace_flag.push(item.trace_flag);
            new_trace_flag.push({ points : [item] , key : item.trace_flag});
          } else {
            new_trace_flag[n].points.push(item);
          }
        })
        let startPoints = []
        let endPoints = []

        for(let i =0;i<new_trace_flag.length;i++){
          let point = new_trace_flag[i].points
          startPoints.push({lat:point[0].lat,lng:point[0].lng})
          endPoints.push({lat:point[point.length-1].lat,lng:point[point.length-1].lng})
          if(timeInter != 5){
            let pointObj1  = new Map() ;
            for(let x=0;x<point.length;x++){
              for(let j=point[0].loc_time; j<=point[point.length-1].loc_time;j=j+timeInter){
                if(point[x].loc_time <= j){
                  pointObj1.set(j,{lat:point[x].lat,lng:point[x].lng})
                }
              }
            }
            let pointObjs =  Array.from(pointObj1);
            let newPointObj =[]
            for(let z=0;z<pointObjs.length;z++){
              newPointObj.push(pointObjs[z][1])
            }
            new_trace_flag[i].points = newPointObj
          }
        }
        this.isTrack = true;
        this.startPoints = startPoints
        this.endPoints = endPoints
        if(timeInter != 5){
          this.polylinePath=new_trace_flag;
        }else{
          this.polylinePath=new_trace_flag;
        }

      } else {
        // this.trajectoryVisible = false;
        if (data.message == "entity_name:参数必需") {
          this.$message.error("需要是鹰眼账号");
        }
      }

    },


    // 获得实时轨迹、
    async nowTrack() {
      // this.trajectoryVisible = false;
      this.polylinePath = [];
      this.dialogVisible = false;
      let points = []
      let Endpoints = []
      let Startpoints = []
      if (this.topViewTrack == true) {
        var paramsget = {
          entity_name: this.multipleSelection[0].userName,
          start_time: Math.round(new Date().getTime() / 1000 - 10),
          end_time: Math.round(new Date().getTime() / 1000),
          page_index: 1,
        };
      } else {
        var paramsget = {
          entity_name: this.findDetliat.account,
          start_time: Math.round(new Date().getTime() / 1000 - 10),
          end_time: Math.round(new Date().getTime() / 1000),
          page_index: 1,
        };
      }
      let data = await this.getLatestPointAsync(paramsget);

      this.polylinePath = [];
      if (data.status === 0) {
        // if (data.latest_point.longitude != 0) {
        //   let pointsStart = {
        //     lng: data.latest_point.longitude,
        //     lat: data.latest_point.latitude,
        //   };
        //   Startpoints.push(pointsStart)
        //   let start = {Startpoints}
        //   // this.polylinePath.push(start);
        //   let pointsEnd = {
        //     lng: data.latest_point.longitude,
        //     lat: data.latest_point.latitude,
        //   };
        //   Endpoints.push(pointsEnd)
        //   let end = {Endpoints}
        //   // this.polylinePath.push(end);
        //   this.startPoints = JSON.parse(JSON.stringify(pointsStart));
        //   this.endPoints = pointsEnd;
        //   this.center = pointsStart;
        //   this.isTrack = true;
        //   this.zoom = 20;
        //   this.MemberDialogVisible = false;
        // }

        var interval = 5000;
        if (this.trackForm.type === "1") {
          interval = 5000;
        } else if (this.trackForm.type === "2") {
          interval = 60000;
        } else {
          interval = 300000;
        }

        this.trackIntervalId = setInterval(async () => {
          if (this.topViewTrack == true) {
            var paramsget = {
              entity_name: this.multipleSelection[0].userName,
              start_time: Math.round(new Date().getTime() / 1000 - 10),
              end_time: Math.round(new Date().getTime() / 1000),
              page_index: 1,
            };
          } else {
            var paramsget = {
              entity_name: this.findDetliat.account,
              start_time: Math.round(new Date().getTime() / 1000 - 10),
              end_time: Math.round(new Date().getTime() / 1000),
              page_index: 1,
            };
          }
          let data = await this.getLatestPointAsync(paramsget);

          if (data.latest_point.longitude != 0) {
            let pointsEnd = {lng: data.latest_point.longitude,lat: data.latest_point.latitude}
            points.push(pointsEnd)
            let aaa = {points}
            this.polylinePath.push(aaa);
            this.endPoints = pointsEnd;
            this.center = pointsEnd;
            this.isTrack = true;
            this.zoom = 20;
            this.MemberDialogVisible = false;
          }
        }, interval);
      } else {
      
        // this.trajectoryVisible = false;
        if (data.message == "entity_name:参数必需") {
          this.$message.error("需要是鹰眼账号");
        }
      }
    },

    // async nowTrack() {
    //   this.isNowTrack = true;
    //   // this.trajectoryVisible = false;
    //   this.polylinePath = [];
    //   let eName = JSON.parse(
    //     JSON.stringify(this.multipleSelection[0].userName)
    //   );
    //   var interval = 10000;
    //   if (this.trackForm.type === "1") {
    //     interval = 10000;
    //   } else if (this.trackForm.type === "2") {
    //     interval = 600000;
    //   } else {
    //     interval = 3000000;
    //   }
    //   ("12312312", this.multipleSelection[0]);
    //   // 起点
    //   if (this.topViewTrack == true) {
    //     var paramsnow = {
    //       entity_name: eName
    //     };
    //   } else {
    //     var paramsnow = {
    //       entity_name: this.findDetliat.account
    //     };
    //   }

    //   let dataObj = await this.getLatestPointAsync(paramsnow);
    //   (dataObj);
    //   if (dataObj.status === 0) {
    //     this.MemberDialogVisible = false;
    //     // this.trajectoryVisible = false;
    //     // this.nowTrackBtn = true;
    //     let pointObj = {
    //       lng: dataObj.latest_point.longitude,
    //       lat: dataObj.latest_point.latitude
    //     };
    //     this.polylinePath.push(pointObj);
    //     var ix = 1;
    //     // --- 定时器 ---
    //     this.trackIntervalId = setInterval(async () => {
    //       ix++;
    //       if (this.topViewTrack == true) {
    //         var paramsnow2 = {
    //           entity_name: eName
    //         };
    //       } else {
    //         var paramsnow2 = {
    //           entity_name: this.findDetliat.account
    //         };
    //       }
    //       let dataObj = await this.getLatestPointAsync(paramsnow2);
    //       (dataObj);
    //       if (dataObj.status === 0) {
    //         let pointObj = {
    //           lng: dataObj.latest_point.longitude,
    //           lat: dataObj.latest_point.latitude
    //         };
    //         // let pointObj = {
    //         //   lng: 103 + 0.005*ix,
    //         //   lat: 30 + 0.005*ix
    //         // }
    //         this.polylinePath.push(pointObj);
    //       }
    //       (this.polylinePath);
    //     }, interval);
    //   } else {
    //     this.$message.error(dataObj.message);
    //   }
    // },
    // 关闭轨迹
    closeTrack() {
      this.trajectoryVisible = false;
      this.polylinePath = [];
      this.isTrack = false;
      this.showTrack = false
      this.stopTrack();
    },
    //停止获取实时轨迹
    stopTrack() {
      this.isNowTrack = false;
      this.nowTrackBtn = false;
      clearInterval(this.trackIntervalId);
      this.trackIntervalId = null;
      this.zoom = 15;
    },
    // 开始无声侦查
    openDetection() {
      let isActive = this.multipleSelection
      if (isActive.length) {
        let len = isActive.filter(item=>item.type == 2)
        let status = isActive.filter(item=>item.status != 0)
        if(len.length == isActive.length && status.length == isActive.length){
           this.MemberDialogVisible = false;
           this.inviteVideoOnoToOne(5);
        }else if(len.length < isActive.length){
          this.$message.error("请选择终端用户");
        }else if(status.length < isActive.length){
          this.$message.error("对方不在线");
        }
      } else {
        this.$message.error("请选择终端用户");
      }
    },
    FullScreen() {
      this.$router.push("/mail/fullScreen");
    }, //点击查看全屏视频
    // 电话/视频  跳转通话栏网页
    Onevoneget(id) {
      this.voiceVisible = false;
      this.$router.push({ path: `/mail/phones/` + id });
      // this.OnevoneVisible = true;
    },
    // 跳转到视频页面
    OneVideo(id) {
      this.$router.push({ path: `/mail/callvideo/` + id });
    },
    //初始化websocket
    initWebsocket() {
      if (typeof WebSocket === "undefined") {
        alert("您的浏览器不支持socket");
      } else {
        let userinfor = JSON.parse(localStorage.getItem("user"));
        // 实例化socket
        this.socket = new WebSocket(this.path + userinfor.account);
        // 监听socket连接
        this.socket.onopen = this.open;
        // 监听socket错误信息
        this.socket.onerror = this.error;
        // 监听socket消息
        this.socket.onmessage = this.getMessage;
      }
    },
    open() {

    },
    error() {

    },
    getMessage({ data }) {
      let mes = JSON.parse(data);
    },
    close() {

    },
    // //邀请视频
    inviteVideoOnoToOne(id) {
      localStorage.getItem("user");
      if (this.multipleSelection.length > 0) {
        if (id === 3 || id === 4) {
          window.dispatchEvent(
            new CustomEvent("inviteVideo", {
              detail: {
                id: id,
                // iscalling: true,
                userinfor: JSON.parse(localStorage.getItem("user")),
                targetType: this.multipleSelection[0].type == "1" ? "d" : "z",
                type: this.multipleSelection[0].type == "1" ? "d2d" : "d2z",
                multipleSelection: this.multipleSelection,
              },
            })
          );
        } else if (id === 1 || id === 2) {
          window.dispatchEvent(
            new CustomEvent("inviteAudio", {
              detail: {
                id: id,
                userinfor: JSON.parse(localStorage.getItem("user")),
                targetType: this.multipleSelection[0].type == "1" ? "d" : "z",
                type: this.multipleSelection[0].type == "1" ? "d2d" : "d2z",
                multipleSelection: this.multipleSelection,
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
                  targetType: this.multipleSelection[0].type == "1" ? "d" : "z",
                  type: this.multipleSelection[0].type == "1" ? "d2d" : "d2z",
                  multipleSelection: this.multipleSelection,
                },
              })
            );
        }
        this.voiceVisible = false;
        this.videoVisible = false;
        this.OnevoneVisible = false;
        this.DetectionDrawer = false;
        this.drawer = false;
      } else {
        this.$message.error("请选择邀请成员！");
      }
    },
    // 点击切换到数据群组成员列表
    async groupData(row) {
      this.groupDataRow.groupId = row.groupId;
      this.groupDataRowTwo.name = row.groupName;
      //点击后页面会显示切换显示群组成员
      this.groupDetailed = false;
      const { data: res } = await this.$http.get("contact/getContactGroupMember",
        {
          params: this.groupDataRow,
        }
      );
      this.MailTableDataTwo = res.data.add;
    },
    // 点击返回原来页面
    backDroupData() {
      this.groupDetailed = true;
      this.groupDataRowTwo.name = "";
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
        new Error("WebRTC is not yet supported in this browser.");
      }
    },
    createStreamSuccess(stream) {
      this.audioMediaStream = stream;
      RS.mediaStream = stream;
      RS.startRecord();
    },
    createStreamError(error) {
      error;
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
        new Error("WebRTC is not yet supported in this browser.");
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
        RS.url;
        audio.src = RS.url;
        const blob = await fetch(RS.url).then((r) => r.blob());
        const file = new File([blob], "record.mp3", { type: blob.type });
        file;
        this.audioStream.append("file", file);
      }
    },
    // 发送语音
    async sendRecord() {
      this.audioBtn = 0;
      var that = this;
      if (this.audioradio == "1") {
        //文字
        var recordUserlist = [];
        this.multipleSelection.forEach((el) => {
          let username = {
            userName: el.userName,
          };
          recordUserlist.push(username);
        });
        // (url.data.message);
        window.dispatchEvent(
          new CustomEvent("onSendRecord", {
            detail: {
              user: recordUserlist,
              content: that.recordForm.content,
              type: "text",
            },
          })
        );
        this.recordForm.content = "";
        this.$message.success("发送成功");
      } else {
        this.audioStream.append("type", 1);
        var url = await this.$http.post(
          "/broadcast/uploadVoiceFile",
          this.audioStream
        );
        // url.data     fullName
        if (url.data.code == 200) {
          var recordUserlist = [];
          this.multipleSelection.forEach((el) => {
            let username = {
              userName: el.userName,
            };
            recordUserlist.push(username);
          });
          // (url.data.message);
          window.dispatchEvent(
            new CustomEvent("onSendRecord", {
              detail: {
                user: recordUserlist,
                content: url.data.message,
                type: "voice",
              },
            })
          );
          var audio = document.getElementById("audioStream");
          audio.src = null;
          this.audioStream.delete("file");
          this.$message.success("发送成功");
        } else {
          this.$message.error("发送失败");
        }
      }
    },
    handleSelectionClose() {
      this.VoiceBroadcastVisible = false;
      if (this.audioMediaStream !== null) {
        this.audioMediaStream.getTracks()[0].stop();
      }
    },
    // 定位图标的点击事件
    pointClick(i) {
      this.pointLocation[i];
      this.MemberInformation(this.pointLocation[i]);

    },
    //监听是否在视频或语音，
    selectablestatus(e){
      if (e.detail.eventName == "正在通话") {
        this.videoStates = false;
        sessionStorage.setItem('videoStates', this.videoStates);
      } else {
        this.videoStates = true;
        sessionStorage.setItem('videoStates', this.videoStates);
      }
    },
    selectable(){
      if(sessionStorage.getItem('videoStates') == 'false'){
        return false
      }else{
        return true
      }
      
    }
    
  },
  
  // watch: {
  //   list() {
  //     this.timer();
  //   }
  // }
  // destroyed() {
  //   clearTimeout(this.timer());
  // }
};
</script>

<style lang="less">
#calle {
  .findDetliatRef {
    margin-left: 20px;
  }
  .findDetliatRef {
    // margin-left: 20px;
    .el-form-item {
      display: flex;
      justify-content: flex-start;
      margin-bottom: 0px;
      // margin-left: 20px;
      .is-disabled {
        .el-input__inner {
          background-color: #ffffff;
          border: none;
          color: #606266;
          cursor: default;
        }
      }
      .el-form-item__content {
        margin-left: 0px !important;
      }
      .el-form-item__label {
        flex: none;
        text-align: left;
        width: 90px !important;
      }
    }
    .el-divider--horizontal {
      margin: 0px;
    }
  }
  .calldialog {
    .el-dialog {
      float: right;
      margin-right: 40px;
      width: 220px !important;
    }
    .el-dialog__headerbtn {
      display: none;
    }
  }
}
</style>

<style lang="less" >
.calleActive {
  cursor: not-allowed !important;
}
.yuan {
  display: inline-block;
  height: 10px;
  width: 10px;
  background-color: #67c23a;
  border-radius: 50%;
  margin-right: 5px;
}
.hui {
  background-color: #909399;
}
#calle {
  .baiduMap {
    width: 100%;
    height: 100%;
    margin-top: 0px;
    position: absolute;
    top: 0;
    z-index: 100 !important;
  }
  .calles-dra {
    .el-dialog__body {
      padding: 0px;
    }
  }
  .nowTrackBtn {
    position: absolute;
    // margin: 0 auto;
    top: 100px;
    left: 37%;
  }
}

.tarckCss {
  position: absolute;
  top: 0;
  right: 150px;
  width: 500px;
  min-height: 600px;
}
.tarckCss .el-dialog__wrapper {
  position: absolute;
  left: 0;
  top: 0;
}

.tarckCss .el-dialog__body {
  padding: 20px !important;
}

.tarckCss .el-dialog {
  // min-height: 400px;
  margin: 0 !important;
  border: 1px solid #dcdfe6;
}

.el-dialog__wrapper {
  position: fixed;
  // left: 0.95rem;
  left: 240px;
  // left: 9.5vw;

  // left: 9vw;
  // margin-left: 10%;
  // left: 9.5%;
}
.el-drawer.ltr {
  margin-left: 0 !important;
  margin-top: 80px;
}
// 侧边栏弹出滑动禁止
.el-dialog__wrapper {
  overflow: hidden;
}
.col43 {
  font-size: 12px;
  line-height: 44px;
  text-align: center;
  margin-left: 5px;
}
.el-drawer__header {
  display: none;
}
.el-table__row .cell {
  cursor: pointer;
}
.frame {
  height: 100% !important;
  width: 100%;
  /*overflow-x: scroll;*/
  margin-left: 0;
  .gn {
    height: 120px;
    width: 100%;
    ul {
      margin: 0;
      // padding-left:30px ;
      padding: 0;
      width: 100%;
      height: 100%;
      list-style: none;
      background-color: #e7f4ff;
      li {
        // float: left;
        display: inline-block;
        height: 120px;
        width: 20%;
        // width: 25%;
        vertical-align: middle;
        text-align: center;
        cursor: pointer;
        font-size: 14px;
        color: #1596ff;
        img {
          vertical-align: middle;
          margin-top: 30px;
        }
        p {
          margin-top: 6px;
        }
      }
    }
  }
  .mail {
    width: 100%;
    /* height: 100%; */
    opacity: 1;
    .el-tabs__item {
      width: 209px;
      font-size: 18px;
      text-align: center;
    }
    .el-table {
      margin-top: 20px;
    }
    .tab-divr {
      height: 620px;
      overflow: scroll;
      .el-table {
        margin-top: 0;
        height: 615px;
        overflow: scroll;
      }
      .el-table::-webkit-scrollbar {
      display: none;
    }
    }
    .tab-divr::-webkit-scrollbar {
      display: none;
    }
  }
}
.retracts {
  position: absolute;
  top: 50%;
  left: 240px;
  margin-top: -50px;
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
.rets {
  position: absolute;
  top: 50%;
  left: 745px;
  margin-top: -50px;
}
.frames {
  transform: translate(-1500%, -50%);
}
.tabs {
  div {
    margin-bottom: 20px;
    font-size: 14px;
    margin-left: 20px;
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
.dia-1 {
  .el-dialog__body {
    padding: 0;
    .fn {
      height: 80px;
      width: 100%;
      ul {
        cursor: pointer;
        margin: 0;
        padding: 0;
        width: 100%;
        height: 100%;
        list-style: none;
        background-color: #1596ff;
        display: flex;
        justify-content: space-around;
        li {
          // float: left;
          display: inline-block;
          // height: 80px;
          vertical-align: middle;
          text-align: center;
          cursor: pointer;
          font-size: 14px;
          color: #1596ff;
          img {
            vertical-align: middle;
            margin-top: 5px;
          }
          p {
            margin: 0;
            // margin-top: 6px;
            color: #fff;
          }
        }
      }
    }
  }
}
.dia-2 {
  li {
    width: 33.33% !important;
  }
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
  .voice-right {
    float: left;
    width: 55%;
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
.Detection-drawer {
  .el-drawer.rtl {
    margin-top: 80px;
    height: 850px;
    .rtl-header {
      height: 60px;
      line-height: 60px;
      background-color: #33a7ff;
      color: #fff;
      font-size: 18px;
      // text-align: center;
      span {
        margin-left: 250px;
      }
      img {
        vertical-align: middle;
        display: inline-block;
        margin-right: 20px;
      }
    }
    .rtl-main {
      height: 790px;
      .yuan {
        display: inline-block;
        height: 10px;
        width: 10px;
        background-color: #67c23a;
        border-radius: 50%;
        margin-right: 20px;
        margin-left: 10px;
      }
      .rtl-main-top {
        height: 50%;
        background-color: pink;
        .rtl-main-top-header {
          height: 60px;
          line-height: 60px;
          background-color: #fff;
          .rtl-main-top-header-icon {
            vertical-align: middle;
            ul {
              float: right;
              padding: 0;
              margin: 0;
              li {
                list-style: none;
                float: left;
                margin-right: 10px;
                img {
                  margin-top: 20px;
                }
              }
            }
          }
        }
      }
      .rtl-main-btn {
        height: 50%;
        background-color: pink;
        .rtl-main-top-header {
          height: 60px;
          line-height: 60px;
          background-color: #fff;
          .rtl-main-top-header-icon {
            vertical-align: middle;
            ul {
              float: right;
              padding: 0;
              margin: 0;
              li {
                list-style: none;
                float: left;
                margin-right: 10px;
                img {
                  margin-top: 20px;
                }
              }
            }
          }
        }
      }
    }
  }
}
.diael {
  .el-dialog__body {
    margin-top: 20px;
    margin-left: 20px;
    height: 60px;
  }
}
</style>
<style scoped>
  .tab-divl {
    /* height: 580px !important; */
    /* height: 9rem !important; */
    min-height: 9rem !important;
    position: relative !important;
    overflow: auto !important;
  }
 
  .tabone {
    position: absolute !important;
    max-width: none !important;
  }
  .calles .el-table--scrollable-x .el-table__body-wrapper::-webkit-scrollbar {
    display: none;
  }
</style>

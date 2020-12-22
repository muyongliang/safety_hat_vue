// 项目管理
<template>
  <div id="pro">
    <!-- 最大卡片区域 -->
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>项目管理</span>
      </div>
      <!-- 下半部页面 -->
      <div class="box">
        <!-- 左边盒子 -->
        <div class="box-left">
          <!-- 左边小盒子用card渲染 -->
          <el-card class="box-card">
            <div slot="header" class="clearfix">
              <span>项目列表</span>
              <el-button
                style="float: right"
                type="primary"
                @click="addData"
                v-show="roleList.indexOf(50) !== -1"
                >添加项目</el-button
              >
              <!-- 功能搜索栏 -->
              <!-- <div style="margin-top:35px;margin-left:0"> -->
              <el-form
                ref="findFormRef"
                :model="findForm"
                :inline="true"
                style="margin-top: 35px"
              >
               
                <el-form-item label="状态：">
                  <el-select v-model="SStatus.status" @change="putFindStatus">
                    <el-option label="全部" value></el-option>
                    <el-option label="进行中" value="0"></el-option>
                    <el-option label="已结束" value="1"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="检索：">
                  <el-input
                    v-model="findForm.projectName"
                    placeholder="输入项目名称"
                  ></el-input>
                </el-form-item>
             
                <el-form-item style="float: right">
                  <el-button
                    type="primary"
                    @click="findInputData"
                    v-show="roleList.indexOf(49) !== -1"
                    >查询</el-button
                  >
                </el-form-item>
         
              </el-form>
   

              <!-- 功能搜索栏end -->
            </div>
            <!-- 左侧下半部分渲染项目名称 使用table表单渲染-->
            <el-table
              :data="tableList"
              style="cursor: pointer"
              max-height="500"
              :show-header="false"
              @row-click="getmemData"
              :highlight-current-row="highlight"
            >
              <el-table-column width="100">
                <template slot-scope="scope">
                  <span v-if="scope.row.status == 0">[进行中]</span>
                  <span v-if="scope.row.status == 1">[已结束]</span>
                  <span v-if="scope.row.status == 2">[状态码为2]</span>
                </template>
              </el-table-column>
              <el-table-column prop="projectName" width="280"></el-table-column>
              <el-table-column>
                <template slot-scope="scope">
                  <el-button
                    size="mini"
                    type="primary"
                    @click="pushEdit(scope.row)"
                    v-show="roleList.indexOf(51) !== -1"
                    >编辑</el-button
                  >
                </template>
              </el-table-column>
            </el-table>
          </el-card>
          <!-- 左边小盒子完 -->
        </div>
        <!-- 右边盒子 -->
        <div class="box-right">
          <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
            <!-- 终端账号栏 -->
            <el-tab-pane label="终端账号" name="first">
              <!-- 上半部分input  -->
              <el-form
                ref="findFormRef"
                :model="getpushHost"
                label-width="100px"
              >
                <el-row :gutter="20">
                  <el-col :span="8">
                    <el-form-item label="账号状态">
                      <el-select
                        v-model="getpushHdata.status"
                        @change="FindDataList"
                        placeholder
                      >
                        <el-option label="全部" value=""></el-option>
                        <el-option label="启用" value="1"></el-option>
                        <el-option label="禁用" value="0"></el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>

                  <el-col :span="12">
                    <el-form-item label="检索" :inline="true">
                      <el-row :gutter="0">
                        <el-col :span="8">
                          <el-select v-model="getpushHost.type">
                            <el-option label="姓名" value="0"></el-option>
                            <el-option label="账号" value="1"></el-option>
                            <el-option label="电话" value="2"></el-option>
                            <el-option label="设备编号" value="3"></el-option>
                          </el-select>
                        </el-col>
                        <el-col :span="12">
                          <el-input v-model="getpushHost.param"></el-input>
                        </el-col>
                        <el-col :span="2">
                          <el-button
                            type="primary"
                            @click="viewFindData"
                            style="margin-left: 10px"
                            :disabled="disabledData"
                            v-show="roleList.indexOf(52) !== -1"
                            >查询</el-button
                          >
                        </el-col>
                      </el-row>
                    </el-form-item>
                  </el-col>

                </el-row>
                <el-form-item class="rigle">
                  <el-button
                    type="primary"
                    @click="getOutData"
                    :disabled="disabledData"
                    v-show="roleList.indexOf(53) !== -1"
                    >导出</el-button
                  >
                  <el-button
                    type="success"
                    @click="getmove"
                    :disabled="disabledData"
                    v-show="roleList.indexOf(54) !== -1"
                    >移动</el-button
                  >
                  <el-button
                    type="success"
                    @click="AddAccount"
                    :disabled="disabledData"
                    v-show="roleList.indexOf(55) !== -1"
                    >添加终端账号</el-button
                  >
                </el-form-item>
              </el-form>
              <!-- 下半部tab表 -->
              <el-table
                ref="multipleTable"
                :data="accountTableData"
                tooltip-effect="dark"
                style="width: 100%"
                @selection-change="handleSelectionChange"
                border
              >
                <el-table-column type="selection"></el-table-column>
                <el-table-column prop="name" label="姓名"></el-table-column>
                <el-table-column
                  prop="userName"
                  label="账号"
                  show-overflow-tooltip
                ></el-table-column>
                <el-table-column
                  prop="mobile"
                  label="电话"
                  show-overflow-tooltip
                ></el-table-column>
                <el-table-column
                  prop="workType"
                  label="工种"
                  show-overflow-tooltip
                ></el-table-column>
                <el-table-column
                  prop="number"
                  label="绑定设备编号"
                  show-overflow-tooltip
                  width="100px"
                ></el-table-column>
                <el-table-column label="账号状态" show-overflow-tooltip>
                  <template slot-scope="scope">
                    <span v-if="scope.row.status == 1">启用</span>
                    <span v-else>禁用</span>
                  </template>
                </el-table-column>
                <el-table-column label="操作" width="350">
                  <template slot-scope="scope">
                    <el-button
                      type="primary"
                      size="mini"
                      @click="editAccountVis(scope.row)"
                      v-show="roleList.indexOf(56) !== -1"
                      >编辑</el-button
                    >
                    <el-button
                      type="success"
                      size="mini"
                      @click="ResetPassword(scope.row)"
                      v-show="roleList.indexOf(57) !== -1"
                      >重置密码</el-button
                    >
                    <el-button
                      v-if="scope.row.status == 0"
                      type="primary"
                      size="mini"
                      v-show="roleList.indexOf(58) !== -1"
                      @click="getOpen(scope.row)"
                      >启用</el-button
                    >
                    <el-button
                      v-else
                      type="danger"
                      size="mini"
                      @click="getProhibit(scope.row)"
                      v-show="roleList.indexOf(58) !== -1"
                      >禁用</el-button
                    >
                  </template>
                </el-table-column>
              </el-table>

              <el-pagination
                @current-change="OneHandleCurrentChange"
                :current-page="getpushHost.pageNum"
                :page-size="getpushHost.pageSize"
                layout="total, prev, pager, next"
                :total="getpushHost.total"
                style="margin-top: 20px"
                :disabled="disabledData"
              ></el-pagination>
            </el-tab-pane>

            <!-- 调度员账号栏 -->
            <el-tab-pane label="调度员账号" name="second">
              <!-- 上半部分input  -->
              <el-form
                ref="findFormRef"
                :model="getDispatcherData"
                label-width="100px"
              >
                <el-row :gutter="20">
                  <el-col :span="8">
                    <el-form-item label="账号状态">
                      <el-select
                        v-model="getDispatcherData.status"
                        @change="ChangeFinds"
                        placeholder
                        :disabled="disabledData"
                      >
                        <el-option label="全部" value="2"></el-option>
                        <el-option label="启用" value="1"></el-option>
                        <el-option label="禁用" value="0"></el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>

                  <el-col :span="12">
                    <el-form-item label="检索" :inline="true">
                      <el-row :gutter="0">
                        <el-col :span="8">
                          <el-select v-model="getDispatcherData.type">
                            <el-option label="姓名" value="0"></el-option>
                            <el-option label="账号" value="1"></el-option>
                            <el-option label="电话" value="2"></el-option>
                          </el-select>
                        </el-col>
                        <el-col :span="12">
                          <el-input
                            v-model="getDispatcherData.param"
                          ></el-input>
                        </el-col>
                        <el-col :span="2">
                          <el-button
                            type="primary"
                            @click="viewDisData"
                            style="margin-left: 10px"
                            :disabled="disabledData"
                            v-show="roleList.indexOf(59) !== -1"
                            >查询</el-button
                          >
                        </el-col>
                      </el-row>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-form-item class="rigle">
                  <el-button
                    type="primary"
                    @click="getOutDataTwo"
                    :disabled="disabledData"
                    v-show="roleList.indexOf(60) !== -1"
                    >导出</el-button
                  >
                  <el-button
                    type="success"
                    @click="getmoveAccount"
                    :disabled="disabledData"
                    v-show="roleList.indexOf(61) !== -1"
                    >移动</el-button
                  >
                  <el-button
                    type="success"
                    @click="controlAccount"
                    :disabled="disabledData"
                    v-show="roleList.indexOf(62) !== -1"
                    >添加调度员账号</el-button
                  >
                </el-form-item>
              </el-form>
              <!-- 下半部tab表 -->
              <el-table
                ref="DispatcherDataRef"
                :data="DispatcherData"
                tooltip-effect="dark"
                style="width: 100%"
                @selection-change="handleSelectionChange"
                border
              >
                <el-table-column type="selection"></el-table-column>
                <el-table-column prop="name" label="姓名"></el-table-column>
                <el-table-column
                  prop="userName"
                  label="账号"
                  show-overflow-tooltip
                ></el-table-column>
                <el-table-column
                  prop="mobile"
                  label="电话"
                  show-overflow-tooltip
                ></el-table-column>
                <el-table-column label="账号状态" show-overflow-tooltip>
                  <template slot-scope="scope">
                    <span v-if="scope.row.status == 0">禁用</span>
                    <span v-else>启用</span>
                  </template>
                </el-table-column>
                <el-table-column label="操作" width="350">
                  <template slot-scope="scope">
                    <el-button
                      type="primary"
                      size="mini"
                      @click="editAccountViss(scope.row)"
                      v-show="roleList.indexOf(63) !== -1"
                      >编辑</el-button
                    >
                    <el-button
                      type="success"
                      size="mini"
                      @click="resetPwds(scope.row)"
                      v-show="roleList.indexOf(64) !== -1"
                      >重置密码</el-button
                    >
                    <el-button
                      v-if="scope.row.status == 0"
                      type="primary"
                      size="mini"
                      @click="getOpenOne(scope.row)"
                      v-show="roleList.indexOf(65) !== -1"
                      >启用</el-button
                    >
                    <el-button
                      v-else
                      type="danger"
                      size="mini"
                      @click="getProhibitOne(scope.row)"
                      v-show="roleList.indexOf(65) !== -1"
                      >禁用</el-button
                    >
                  </template>
                </el-table-column>
              </el-table>

              <el-pagination
                @current-change="TwoHandleCurrentChange"
                :current-page="getDispatcherData.pageNum"
                :page-size="getDispatcherData.pageSize"
                layout="total,prev, pager, next"
                :total="getDispatcherData.total"
                style="margin-top: 20px"
                :disabled="disabledData"
              ></el-pagination>
            </el-tab-pane>

            <!-- 报警设置栏 -->
            <el-tab-pane label="报警设置" name="third">
              <el-form class="it8" :model="CellFindSetting">
                <el-form-item>
                  <span>终端跌落报警</span>
                  <el-radio v-model="CellFindSetting.radioOne" label="0"
                    >开</el-radio
                  >
                  <el-radio v-model="CellFindSetting.radioOne" label="1"
                    >关</el-radio
                  >
                  <hr />
                </el-form-item>
                <el-form-item>
                  <div class="radio-1">终端脱离报警</div>
                  <div class="radio-2">
                    <el-radio
                      v-model="CellFindSetting.radioTwo"
                      label="0"
                      @change="yesTime"
                      >统一设定</el-radio
                    >
                    <br />
                    <template>
                      <!-- v-if="CellFindSetting.radioTwo == 1? disabled =false :''" -->
                      <el-radio
                        v-if="CellFindSetting.radioTwo == 1"
                        v-model="CellFindSetting.radioTwoSun"
                        label="0"
                        disabled
                        >开</el-radio
                      >
                      <el-radio
                        v-else-if="CellFindSetting.radioTwo == 0"
                        v-model="CellFindSetting.radioTwoSun"
                        label="0"
                        >开</el-radio
                      >
                      <el-radio
                        v-if="CellFindSetting.radioTwo == 1"
                        disabled
                        v-model="CellFindSetting.radioTwoSun"
                        label="1"
                        >关</el-radio
                      >
                      <el-radio
                        v-else-if="CellFindSetting.radioTwo == 0"
                        v-model="CellFindSetting.radioTwoSun"
                        label="1"
                        >关</el-radio
                      >
                    </template>
                    <hr />
                    <el-radio
                      v-model="CellFindSetting.radioTwo"
                      label="1"
                      @change="yesTime"
                      >按时间设定</el-radio
                    >
                    <br />
                    <span>开启时间段</span>
                    <!-- 时间选择 -->
                    <template>
                      <el-time-picker
                        arrow-control
                        value-format="HH:mm:ss"
                        v-model="CellFindSetList.beginTime"
                        :picker-options="{
                          selectableRange: '00:00:00 - 23:59:00',
                        }"
                        placeholder="任意时间点"
                        @change="TimeChange"
                        :disabled="disabledtwo"
                      ></el-time-picker>
                      <el-time-picker
                        arrow-control
                        value-format="HH:mm:ss"
                        v-model="CellFindSetList.endTime"
                        :picker-options="{
                          selectableRange: '00:00:00 - 23:59:00',
                        }"
                        placeholder="任意时间点"
                        @change="TimeChange"
                        :disabled="disabledtwo"
                      ></el-time-picker>
                    </template>
                    <p>注：其余时间则为关闭报警</p>
                  </div>
                </el-form-item>
                <hr />
                <el-form-item>
                  <div class="radio-1">高空作业报警</div>
                  <div class="radio-2">
                    <el-radio v-model="CellFindSetting.radioThree" label="0"
                      >开</el-radio
                    >
                    <template class="it10">
                      <span style="margin-right: 20px">报警高度（米）</span>
                      <el-input
                        v-if="CellFindSetting.radioThree == 1"
                        disabled
                        placeholder
                        style="width: 300px"
                        v-model="CellFindSetting.hignWorkAlarm"
                      ></el-input>
                      <el-input
                        v-else-if="CellFindSetting.radioThree == 0"
                        placeholder
                        style="width: 300px"
                        v-model="CellFindSetting.hignWorkAlarm"
                      ></el-input>
                      <p style="margin-left: 219px">
                        注：高于该高度就会触发高空作业报警，该高度为海拔高度
                      </p>
                    </template>
                    <el-radio v-model="CellFindSetting.radioThree" label="1"
                      >关</el-radio
                    >
                  </div>
                </el-form-item>
                <hr />
                <el-form-item class="in1">
                  <el-button
                    type="primary"
                    @click="GetCellSetonData"
                    :disabled="disabledData"
                    v-show="roleList.indexOf(66) !== -1"
                    >保存</el-button
                  >
                </el-form-item>
              </el-form>
            </el-tab-pane>
          </el-tabs>
        </div>
      </div>
      <!-- card结束 -->
    </el-card>

    <!-- 终端账号栏弹框模板区 -->
    <!-- 移动弹框 -->
    <el-dialog
      title="移动"
      :visible.sync="getmoveDialogVisible"
      width="30%"
      center
      :modal="false"
    >
      <span>账号移动到：</span>
      <el-select
        v-model="getMoveRuleForm.projectId"
        placeholder="请选择"
        style="margin-left: 20px; width: 75%"
      >
        <el-option
          v-for="item in getMoveData"
          :key="item.pid"
          :label="item.projectName"
          :value="item.pid"
        ></el-option>
      </el-select>
      <span slot="footer" class="dialog-footer">
        <el-button @click="getmoveDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="GETMoveIsData">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 调度员移动弹框 -->
    <el-dialog
      title="移动"
      :visible.sync="getmoveaccountVisible"
      width="30%"
      cente
      :modal="false"
    >
      <span>账号移动到：</span>
      <el-select
        v-model="getMoveDataAccList.projectId"
        placeholder="请选择"
        style="margin-left: 20px; width: 75%"
      >
        <el-option
          v-for="item in getMoveAccountData"
          :key="item.pid"
          :label="item.projectName"
          :value="item.pid"
        ></el-option>
      </el-select>
      <span slot="footer" class="dialog-footer">
        <el-button @click="getmoveaccountVisible = false">取 消</el-button>
        <el-button type="primary" @click="GETMoveIsAccData">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 添加终端账号弹框 -->
    <el-dialog
      title="添加终端账号"
      :visible.sync="AddAccountDialogVisible"
      width="40%"
      center
      :modal="false"
    >
      <!-- 主体 -->
      <div class="add-main">
        <el-form
          :model="AddFormDataNum"
          :rules="AddFormDataNumRules"
          ref="AddFormDataNumRef"
          label-width="auto"
          class="demo-ruleForm"
        >
          <el-form-item label="账号：" prop="account">
            <el-col :gutter="5">
              <el-col :span="4">
                <div class="grid-content bg-purple">{{ UserName }}_</div>
              </el-col>
              <el-col :span="20">
                <div class="grid-content bg-purple">
                  <el-input
                    v-model="AddFormDataNum.account"
                    placeholder="3-10位数字、字母、字符"
                    @blur="QueryAccount"
                  ></el-input>
                </div>
              </el-col>
            </el-col>
          </el-form-item>

          <el-form-item label="密码：" prop="password">
            <!-- <span class="sx">sxlc_</span> -->
            <el-input
              v-model="AddFormDataNum.password"
              placeholder="初始密码与账号相同"
              type="password"
              show-password
            ></el-input>
          </el-form-item>

          <el-form-item label="姓名：" prop="name">
            <!-- <span class="sx">sxlc_</span> -->
            <el-input
              v-model="AddFormDataNum.name"
              placeholder="2-20位字符"
            ></el-input>
          </el-form-item>

          <el-form-item label="电话：" prop="tel">
            <el-input
              v-model="AddFormDataNum.tel"
              placeholder="11位电话号码"
            ></el-input>
          </el-form-item>

          <el-form-item label="工种:">
            <el-select
              v-model="AddFormDataNum.workId"
              placeholder="请选择工种"
              style="width: 100%"
            >
              <el-option
                v-for="item in WorkIdNameData"
                :key="item.workId"
                :label="item.workName"
                :value="item.workId"
              ></el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="绑定设备：">
            <!-- <el-row> -->
            <!-- <el-col :span="14"> -->
            <!-- 这个设备编号需要从下个页面传上来 -->
            <el-input v-model="AddFormDataNum.number"></el-input>
            <!-- </el-col>
            <el-col :span="8" style="margin-left:5px">-->
            <el-button type="primary" size="mini" @click="ChoiceAddNum"
              >选择</el-button
            >
            <el-button type="warning" size="mini" @click="Choicedelete"
              >取消绑定</el-button
            >
            <!-- </el-col>
            </el-row>-->
          </el-form-item>

          <el-form-item label="视频参数：" class="it7">
            <el-radio-group
              v-model="AddFormDataNum.diyFlag"
              @change="addvideoShow"
            >
              <el-radio label="0">跟随系统设置</el-radio>
              <el-radio label="1">自定义</el-radio>
            </el-radio-group>
            <br />
            <!-- <el-form ref="AddFormDataNumRef" :model="AddFormDataNum" label-width="130px"> -->
            <el-form-item
              label="自定义视频分辨率"
              class="opt1"
              v-show="addviShow"
            >
              <el-select placeholder v-model="AddFormDataNum.resolution">
                <el-option label="144*176" value="144*176"></el-option>
                <el-option label="240*320" value="240*320"></el-option>
                <el-option label="320*480" value="320*480"></el-option>
                <el-option label="480*800" value="480*800"></el-option>
                <el-option label="540*960" value="540*960"></el-option>
                <el-option label="720*1280" value="720*1280"></el-option>
                <!-- <el-option label="1080*1440" value="1080*1440"></el-option> -->
              </el-select>
            </el-form-item>
            <br />
            <el-form-item label="自定义视频码率" label-width="115px">
              <div class="block">
                <!-- <el-slider
                  v-model="sliderValue"
                  range
                  :marks="sliderMarks"
                  :max="600"
                  @change="ChangeSliderData"
                ></el-slider>-->
                <span>{{ sliderValuees }}</span>
              </div>
            </el-form-item>
            <!-- </el-form> -->
          </el-form-item>
          <!-- 主体 end -->
          <el-form-item>
            <!--            <span slot="footer" class="dialog-footer">-->
            <el-button @click="AddAccountDataBad">取 消</el-button>
            <el-button type="primary" @click="AddAccountData">确 定</el-button>
            <!--            </span>-->
          </el-form-item>
        </el-form>
      </div>
    </el-dialog>

    <!-- 编辑终端账号弹框 -->
    <el-dialog
      title="编辑终端账号"
      :visible.sync="editAccountDialogVisible"
      width="40%"
      center
      :modal="false"
      :before-close="handleCloseOne"
    >
      <!-- 主体 -->
      <div class="add-main">
        <el-form
          :model="EditFormDataNum"
          :rules="EditFormDataNumRules"
          ref="EditFormDataNumRef"
          label-width="auto"
          class="demo-ruleForm"
        >
          <el-form-item label="账号：">
            <span>{{ EditFormDataNum.account }}</span>
          </el-form-item>

          <el-form-item label="密码：">
            <el-input
              v-model="EditFormDataNum.password"
              type="password"
              show-password
            ></el-input>
          </el-form-item>

          <el-form-item label="姓名：" prop="name">
            <!-- <span class="sx">sxlc_</span> -->
            <el-input v-model="EditFormDataNum.name"></el-input>
          </el-form-item>

          <el-form-item label="电话：">
            <el-input v-model="EditFormDataNum.tel"></el-input>
          </el-form-item>

          <el-form-item label="工种：">
            <el-select
              v-model="EditFormDataNum.workId"
              placeholder
              style="width: 100%"
            >
              <!-- <el-option label="默认工种" value="1"></el-option>
              <el-option label="监理" value="2"></el-option>
              <el-option label="施工" value="3"></el-option>-->
              <el-option
                v-for="item in WorkIdNameData"
                :key="item.workId"
                :label="item.workName"
                :value="item.workId"
              ></el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="绑定设备：">
            <!-- <el-row>
            <el-col :span="14">-->
            <el-input v-model="editNumber"></el-input>
            <!-- </el-col>
            <el-col :span="10">-->
            <el-button type="primary" size="mini" @click="ChoiceAddNum"
              >选择</el-button
            >
            <el-button type="warning" size="mini" @click="Unbind"
              >取消绑定</el-button
            >
            <!-- </el-col>
            </el-row>-->
          </el-form-item>

          <el-form-item label="视频参数：" class="it7">
            <el-radio-group
              v-model="EditFormDataNum.diyFlag"
              @change="editvideoShow"
            >
              <el-radio :label="0">跟随系统设置</el-radio>
              <el-radio :label="1">自定义</el-radio>
            </el-radio-group>
            <br />
            <el-form-item
              label="自定义视频分辨率"
              class="opt1"
              v-show="videoShow"
            >
              <el-select placeholder v-model="EditFormDataNum.resolution">
                <el-option label="144*176" value="144*176"></el-option>
                <el-option label="240*320" value="240*320"></el-option>
                <el-option label="320*480" value="320*480"></el-option>
                <el-option label="480*800" value="480*800"></el-option>
                <el-option label="540*960" value="540*960"></el-option>
                <el-option label="720*1280" value="720*1280"></el-option>
              </el-select>
            </el-form-item>
            <br />
            <el-form-item label="自定义视频码率" label-width="115px">
              <div class="block">
                <!-- <el-slider
                  v-model="sliderValue"
                  range
                  :marks="sliderMarks"
                  :max="600"
                  @change="EDITSliderData"
                ></el-slider>-->
                <span>{{ sliderValuees }}</span>
              </div>
            </el-form-item>
          </el-form-item>
        </el-form>
      </div>

      <!-- 主体 end -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="editAccountCLOSE">取 消</el-button>
        <el-button type="primary" @click="editAccountPush">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 选择终端设备弹框 -->
    <el-dialog
      title="选择终端设备"
      :visible.sync="ChoiceDialogVisible"
      width="60%"
      center
      :modal="false"
    >
      <!-- 主体 -->
      <el-form
        ref="getMoveRuleFormRef"
        :model="ChoiceFindStatus"
        label-width="80px"
      >
        <el-row :gutter="20">
          <el-col :span="6">
            <el-form-item label="绑定状态">
              <el-select
                v-model="ChoiceFindStatus.status"
                placeholder
                @change="findByStatus"
              >
                <el-option label="全部" value="2"></el-option>
                <el-option label="未绑定" value="0"></el-option>
                <el-option label="已绑定" value="1"></el-option>
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :span="14">
            <el-form-item label="检索" :inline="true">
              <el-row :gutter="0">
                <el-col :span="7">
                  <el-select v-model="ChoiceFindStatus.type" placeholder>
                    <el-option label="设备编号" value="0"></el-option>
                    <el-option label="设备IMEI" value="1"></el-option>
                    <el-option label="设备型号" value="2"></el-option>
                  </el-select>
                </el-col>
                <el-col :span="12">
                  <el-input v-model="ChoiceFindStatus.param"></el-input>
                </el-col>
                <el-col :span="2" style="margin-left: 5px">
                  <el-button type="primary" @click="ChoicefindBy"
                    >查询</el-button
                  >
                </el-col>
              </el-row>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>

      <!-- 表单区 -->
      <el-table :data="ChoiceAddDataList" style="width: 100%" border>
        <el-table-column
          prop="number"
          label="设备编号"
          width="180"
        ></el-table-column>
        <el-table-column
          prop="imei"
          label="设备IMEI"
          width="250"
        ></el-table-column>
        <el-table-column prop="type" label="设备型号"></el-table-column>
        <el-table-column prop="status" label="绑定状态">
          <template slot-scope="scope">
            <span v-if="scope.row.status == 0">空闲中</span>
            <span v-if="scope.row.status == 1">使用中</span>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <!-- <el-radio v-model="choicRadio" label="0" @change="choicBtn(scope.row)">选择</el-radio>
            <el-radio v-model="choicRadio" label="1">不选择</el-radio>-->
            <el-button
              type="primary"
              size="mini"
              @click="choicBtn(scope.row)"
              :disabled="disabledBttnn"
              v-if="scope.row.status == 1"
              >选择绑定</el-button
            >
            <el-button
              type="primary"
              size="mini"
              @click="choicBtn(scope.row)"
              v-if="scope.row.status == 0"
              >选择绑定</el-button
            >
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页： -->
      <el-pagination
        @current-change="CHhandleCurrentChange"
        :current-page="pushDataAddNum.pageNum"
        :page-size="pushDataAddNum.pageSize"
        layout="total,prev, pager, next"
        :total="pushDataAddNum.total"
      ></el-pagination>

      <!-- 底部 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="ChoicButtonClose">取 消</el-button>
        <el-button type="primary" @click="ChoicButton">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 终端账号栏弹框模板区end -->
    <!-- 调度员弹框区域 -->

    <!-- 添加调度员账号弹框 -->
    <el-dialog
      title="添加调度员账号"
      :visible.sync="controlDialogVisible"
      width="35%"
      center
      :modal="false"
    >
      <!-- 主体 -->
      <div class="add-main">
        <el-form
          :model="getAccOuntPush"
          :rules="getAccOuntPushRules"
          ref="ruleFormRef"
          label-width="auto"
          class="demo-ruleForm"
        >
          <el-form-item label="账号：" prop="account">
            <el-col :gutter="5">
              <el-col :span="4">
                <div class="grid-content bg-purple">{{ this.UserName }}_</div>
              </el-col>
              <el-col :span="20">
                <div class="grid-content bg-purple">
                  <el-input
                    v-model="getAccOuntPush.account"
                    placeholder="3-10位数字、字母、字符"
                    @blur="QueryAccountTwo"
                  ></el-input>
                </div>
              </el-col>
            </el-col>
          </el-form-item>

          <el-form-item label="密码：" prop="pwd">
            <!-- <span class="sx">sxlc_</span> -->
            <el-input
              v-model="getAccOuntPush.pwd"
              placeholder="初始密码与账号相同"
              type="password"
              show-password
            ></el-input>
          </el-form-item>

          <el-form-item label="姓名：" prop="name">
            <!-- <span class="sx">sxlc_</span> -->
            <el-input
              v-model="getAccOuntPush.name"
              placeholder="限20字"
            ></el-input>
          </el-form-item>

          <el-form-item label="电话：" prop="tel">
            <el-input
              v-model="getAccOuntPush.tel"
              placeholder="请输入11位电话号码"
            ></el-input>
          </el-form-item>
        </el-form>
      </div>

      <!-- 主体 end -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="AddControlAccountBad">取 消</el-button>
        <el-button type="primary" @click="AddControlAccount">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 编辑调度员账号弹框 -->
    <el-dialog
      title="编辑调度员账号"
      :visible.sync="EditcontrolDialogVisible"
      width="35%"
      center
      :modal="false"
    >
      <!-- 主体 -->
      <div class="add-main">
        <el-form
          :model="editAccounData"
          :rules="getAccOuntPushRules"
          ref="ruleFormRef"
          label-width="auto"
          class="demo-ruleForm"
        >
          <el-form-item label="账号：">
            <!-- <el-col :gutter="5">
              <el-col :span="3">
                <div class="grid-content bg-purple">sxlc_</div>
              </el-col>
            <el-col :span="21">-->
            <!-- <div class="grid-content bg-purple"> -->
            <span>{{ editAccounData.account }}</span>
            <!-- <el-input v-model="editAccounData.account"></el-input> -->
            <!-- </div>
              </el-col>
            </el-col>-->
          </el-form-item>

          <el-form-item label="密码：">
            <!-- <span class="sx">sxlc_</span> -->
            <el-input
              v-model="editAccounData.pwd"
              type="password"
              show-password
            ></el-input>
          </el-form-item>

          <el-form-item label="姓名：" prop="name">
            <!-- <span class="sx">sxlc_</span> -->
            <el-input
              v-model="editAccounData.name"
              placeholder="限20字"
            ></el-input>
          </el-form-item>

          <el-form-item label="电话：">
            <el-input
              v-model="editAccounData.tel"
              placeholder="请输入11位电话号码"
            ></el-input>
          </el-form-item>
        </el-form>
      </div>

      <!-- 主体 end -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="EditcontrolDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editAccountVisData">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 调度员弹框区域 end-->
  </div>
</template>

<script>
import qs from "qs";
import { createNamespacedHelpers } from "vuex";
const { mapState, mapActions } = createNamespacedHelpers("electronics");
export default {
  data() {
    return {
      Unbinds: true,
      UserName: "", //企业用户前缀
      highlight: true,
      disabledData: true, //按钮是否使用
      // 左侧功能下拉框
      findForm: {
        // 查询项目状态信息
        status: "",
        // 项目名称模糊查询绑定数据
        projectName: "",
        name: "",
        region: "",
        date1: "",
        date2: "",
        delivery: false,
        type: [],
        resource: "",
        desc: "",
        pid: "", //项目id
      },
      // 左侧下半部渲染表单绑定数据
      tableList: [],
      // 状态查询专用状态码
      SStatus: {
        status: "",
      },
      // tab栏默认显示
      activeName: "first",
      multipleSelection: [],
      // 移动弹框
      getmoveDialogVisible: false,
      getmoveaccountVisible: false,
      // 移动弹框提交数据，移动弹框选中项目绑定数据
      getMoveRuleForm: {
        // clientId: "",
        clientId: [],
        projectId: "",
      },
      // 移动弹框表格绑定数据
      getMoveData: [],
      // 移动弹框验证规则，
      getMoveRules: {
        name: [
          { required: true, message: "请输入活动名称", trigger: "blur" },
          { min: 3, max: 5, message: "长度在 3 到 5 个字符", trigger: "blur" },
        ],
        region: [
          { required: true, message: "请选择活动区域", trigger: "change" },
        ],
      },
      // 调度员移动弹框表格绑定数据
      getMoveAccountData: [],
      // 调度员移动弹框提交数据，
      getMoveAccountForm: {
        bid: "",
      },
      // 调度员移动弹框选中项目绑定数据
      getMoveDataAccList: {
        projectId: "",
        bid: "",
      },
      // 终端账号栏数据部分
      getMoveRulLiat: {},
      // 表单绑定数据
      accountTableData: [],
      // 终端账号提交回去信息对象，也是账号状态查询
      getpushHost: {
        // 当前所选中项目Id
        projectId: "",
        // 设备的终端账号启用状态
        status: 2,
        pageSize: 5,
        pageNum: 1,
        type: "", //传送值状态
        param: "", //输入值
        zidianType: 0, //查询工种数据
        total: 0,
      },
      // 工种名称数据
      WorkIdNameData: [],
      // 账号状态查询上传数据
      getpushHdata: {
        projectId: "", //项目id
        status: "",
        pageSize: 5,
        pageNum: 1,
      },
      // 变更状态按钮上传数据
      pushChangeStatusNum: {
        clientId: "", //终端账号id
        status: "",
      },
      // 添加终端账号弹框
      AddAccountDialogVisible: false,
      // 编辑终端账号弹框
      editAccountDialogVisible: false,
      // 选择终端弹框
      ChoiceDialogVisible: false,
      // 单选框
      radio: "1",
      radiotwo: "5",
      // 视频分辨率滑块
      sliderValue: [130, 460],
      sliderMarks: {
        0: "0",
      },
      // 自定义码率
      sliderValuees: 1024,
      // 添加账号对话框绑定数据
      AddFormDataNum: {
        clientId: null, //绑定设备人员id，添加为null
        account: "", //账号
        password: "",
        name: "",
        tel: "",
        workId: "", //工种
        resolution: "", //视频分辨率
        minKps: "", //自定义码率
        maxKps: "",
        deviceId: "", //设备编号如A10001其实是给1
        diyFlag: "0", //是否采用系统设置{0:系统默认;1:自定义
        projectId: "", //项目id
        number: "", //设备编号
        endBinding: 0,
      },
      AddFormDataNumRules: {
        account: [
          { required: true, message: "请输入账号", trigger: "blur" },
          {
            min: 3,
            max: 20,
            message: "长度在 3 到 10 个字符",
            trigger: "blur",
          },
        ],
        password: [
          { required: true, message: "默认密码与账号相同", trigger: "blur" },
          {
            min: 3,
            max: 20,
            message: "长度在 3 到 10 个字符",
            trigger: "blur",
          },
        ],
        tel: [
          { required: true, message: "请输入账号", trigger: "blur" },
          { min: 3, max: 11, message: "长度11 个字符", trigger: "blur" },
        ],

        name: [
          { required: true, message: "请输入姓名", trigger: "blur" },
          {
            min: 2,
            max: 20,
            message: "长度在 2 到 20 个字符",
            trigger: "blur",
          },
        ],
        region: [
          { required: true, message: "请选择活动区域", trigger: "change" },
        ],
      },
      editNumber: "",
      isdata: [],
      // 编辑账号对话框绑定数据
      EditFormDataNum: {
        clientId: null, //绑定设备人员id，添加为null
        account: "", //账号
        password: "",
        name: "",
        tel: "",
        workId: "", //工种
        resolution: "", //视频分辨率
        minKps: "", //自定义码率
        maxKps: "",
        deviceId: 0, //设备编号如A10001其实是给1
        diyFlag: 0, //是否采用系统设置{0:系统默认;1:自定义
        // isVedioDiy: 0, //是否采用系统设置{0:系统默认;1:自定义
        projectId: "", //项目id
        endBinding: 0,
        // number: null,
      },
      EditFormDataNumRules: {
        name: [
          { required: true, message: "请输入活动名称", trigger: "blur" },
          { min: 3, max: 5, message: "长度在 3 到 5 个字符", trigger: "blur" },
        ],
        region: [
          { required: true, message: "请选择活动区域", trigger: "change" },
        ],
      },
      // 重置终端账号密码
      resetPwd: {
        clientId: 0,
      },
      // 终端账号栏数据部分end

      // 调度员账号栏
      controlDialogVisible: false,
      EditcontrolDialogVisible: false,
      // 获取调度员账号列表请求数据列表.调度员状态查询框上传数据
      getDispatcherData: {
        projectId: "", //项目id
        pageSize: 5,
        pageNum: 1,
        status: "",
        type: "",
        param: "",
      },
      // 调度员账号绑定列表
      DispatcherData: [],
      // 调度员状态按钮切换数据
      pushChangeOneNum: {
        bid: "",
        status: "",
      },
      // 添加调度员账号上传绑定数据
      getAccOuntPush: {
        projectId: "", //项目id
        account: "", //账号
        name: "",
        tel: "",
        pwd: "",
      },
      getAccOuntPushRules: {
        name: [
          { required: true, message: "限20字", trigger: "blur" },
          {
            min: 2,
            max: 20,
            message: "长度在 2 到 20 个字符",
            trigger: "blur",
          },
        ],
        account: [
          {
            required: true,
            message: "3-10位数字、字母、字符",
            trigger: "blur",
          },
          {
            min: 3,
            max: 20,
            message: "长度在 3 到 10 个字符",
            trigger: "blur",
          },
        ],
        pwd: [
          {
            required: true,
            message: "原始密码和账号相同",
            trigger: "blur",
          },
          {
            min: 3,
            max: 20,
            message: "长度在 3 到 10 个字符",
            trigger: "blur",
          },
        ],
        tel: [
          { required: true, message: "11位", trigger: "blur" },
          { min: 3, max: 11, message: "长度为 11 个字符", trigger: "blur" },
        ],
        region: [
          { required: true, message: "请选择活动区域", trigger: "change" },
        ],
      },
      // 编辑调度员绑定数据
      editAccounData: {
        bid: "", //主键
        account: "",
        pwd: "",
        name: "",
        tel: "",
      },
      // 调度员账号栏end

      // 选择终端设备区域
      // 点击选择设备编号弹框页面绑定数据，状态码0空闲，1使用
      ChoiceAddDataList: [],
      // choicRadio: "",
      // 设备did与设备编号数据
      DidNumbers: {
        did: "",
        number: "",
      },
      // 选择终端设备弹框
      pushDataAddNum: {
        pageSize: 3,
        pageNum: 1,
      },
      // 根据状态查询提交数据
      ChoiceFindStatus: {
        status: "",
        pageSize: 2,
        pageNum: 1,
        type: "",
        param: "",
      },
      // 选择终端设备弹框end

      // 报警设置页面
      CellFindSetData: {
        projectId: "",
      },
      // 页面选择绑定数据列表
      CellFindSetting: {
        // 跌落报警
        radioOne: "0",
        // 脱离报警
        radioTwo: "0",
        // 统一设定开关
        radioTwoSun: "0",
        // 高空作业报警
        radioThree: "1",
        hignWorkAlarm: "",
      },
      // 更新保存数据
      CellFindSetList: {
        alarmId: null,
        dropSwitch: "", //跌落开关
        alarmLeaveSwitch: "", //脱离报警开关
        alarmLeaveTime: "",
        hignWorkAlarm: "", //高空作业距离
        projectId: "",
        beginTime: "", //脱离报警开关时间
        endTime: "",
      },
      // 时间选择器数据
      TimeData: "",

      // 报警设置页面end

      // 编辑项目页面跳转数据
      pushEditList: {
        // businessId: "",
        // introduction: "",
        // personInCharge: "",
        // picPhone: "",
        // pid: "",
        // projectAddress: "",
        // projectName: "",
        // status: ""
      },
      outDataExe: {
        bids: {
          bid: [],
        },
        projectId: "",
      },
      // 脱离报警选择时间
      disabledtwo: true,
      // 添加账号查重账号数据
      userNameEss: {
        userName: "",
      },
      disabledBttnn: true, //选择设备按钮禁用否
      roleList: [],
      videoShow: true,
      addviShow: true,
    };
  },
  created() {
    // 页面刷新获取数据(只是先获取左边的数据，
    this.getDataList();
    this.getWorkIdName();
    // 由于解决不了获取数据的bug，让设备详情表单在这里获取数据
    // this.getDiD();
    this.getRoleBtnData();
  },
  computed: {
    ...mapState([""]),
  },
  methods: {
    ...mapActions(["addEntityAsync"]),
    // 功能权限
    async getRoleBtnData() {
      let dataR = {
        parentId: 9,
        userName: null,
      };
      const { data: res } = await this.$http.get("menu/getButtonMenus", {
        params: dataR,
      });
      "获取数据页面功能权限", res;
      let arr = [];
      res.data.forEach((item) => {
        arr.push(item.mid);
      });
      this.roleList = arr;
      "获取数据页面功能权限", this.roleList;
      console.log("获取数据页面功能权限", this.roleList)
    },

    // 页面刷新获取数据(只是先获取左边的数据，没有右边的)
    async getDataList() {
      const { data: res } = await this.$http.get("project/findByStatus", {
        params: this.SStatus,
      });
      "项目列表获取数据", res;
      if (sessionStorage.UserName == "") {
        let username = localStorage.objName;
        this.UserName = username;
      } else {
        let username = sessionStorage.UserName;
        // ("企业用户前缀", username);
        this.UserName = username;
      }
      // if (res.code !== 200) return this.$message.error("表单获取失败");
      // this.$message.success("表单获取成功");
      this.tableList = res.data;
      // (this.tableList[0].pid);
      // this.getpushHost.projectId = this.tableList[0].pid;
      // this.getNumBerData();
      // 获取报警页面数据
      // this.GetCellSetting();
    },
    // 点击行选择项目获取项目数据，并渲染到右边表格中
    getmemData(row) {
      // (row);
      this.getpushHost.projectId = row.pid;
      // ("查询终端账号数据", this.getpushHost);
      // 页面刷新获取数据(右边的数据，终端账号的数据
      this.getNumBerData();
      // 获取调度员页面
      this.getDispatcher();
      // 获取报警设置页面
      this.AlarmSettings();
    },
    // 终端账号栏方法部分
    // 多选框,先只允许一个一个导出
    handleSelectionChange(val) {
      this.multipleSelection = val;
      "选择id", this.multipleSelection;

      // this.getMoveRuleForm.clientId = this.multipleSelection[0].bid;
      // this.getMoveAccountForm.bid = this.multipleSelection[0].bid;
      // ("多选框选择数据", this.multipleSelection);

      // ('选择账号',this.getMoveRuleForm);
    },
    // 移动弹框
    async getmove() {
      // this.multipleSelection[0].clientId;
      // if (this.multipleSelection.length > 1) {
      //   return this.$message("一次只能移动一个账号");
      // }
      this.getmoveDialogVisible = true;
      // this.getMoveRuleForm.clientId = this.getpushHost.bid;
      // this.getMoveRuleForm.clientId = this.multipleSelection[0].clientId;
      let datas = {
        clientId: this.multipleSelection[0].clientId,
      };
      "查询数据", this.getMoveRuleForm;

      const { data: res } = await this.$http.get("client/getProjectList", {
        params: datas,
      });
      this.getMoveData = res.data;
      if (this.multipleSelection.length == 1) {
        // return this.$message("一次只能移动一个账号");
        this.getMoveRuleForm.clientId = this.multipleSelection[0].clientId;
        return;
      } else if (this.multipleSelection.length > 1) {
        let one = [];
        for (let i = 0; i < this.multipleSelection.length; i++) {
          one.push(this.multipleSelection[i].clientId);
        }
        "选择数据", one;

        this.getMoveRuleForm.clientId = one.toString();
      }

      // (this.getMoveData);
    },
    // 移动弹框，选取后移动项目
    async GETMoveIsData() {
      // this.getMoveRuleForm.projectId = this.getpushHost.projectId;
      "移动数据", this.getMoveRuleForm;

      const { data: res } = await this.$http.post(
        "client/moveToTargetProject",
        qs.stringify(this.getMoveRuleForm)
      );
      "移动res", res;

      if (res.code !== 200) return this.$message.error(res.message);
      this.$message.success("数据移动成功");
      this.getmoveDialogVisible = false;
      this.getNumBerData();
    },
    // tab栏点击触发事件,通过点击来触发相应的数据获取
    handleClick(tab, event) {
      // (tab, event);
      // 获取调度员页面
      this.getDispatcher();
      // 获取报警设置页面
      this.AlarmSettings();
    },

    //终端账号页面请求
    // 终端账号部分开始，获取数据并渲染
    async getNumBerData() {
      // ("查询终端账号数据", this.getpushHost);
      // (typeof this.getpushHost.projectId);

      if (this.getpushHost.projectId !== 0) {
        this.disabledData = false;
      }
      const { data: res } = await this.$http.get("client/findByStatus", {
        params: this.getpushHost,
      });
      "终端账号获取数据", res.data;
      this.accountTableData = res.data.list;
      this.getpushHost.bid = res.data.bid;
      this.getpushHost.pageSize = res.data.pageSize;
      this.getpushHost.pageNum = res.data.pageNum;
      this.getpushHost.total = res.data.total;
    },

    OneHandleCurrentChange(val) {
      // (val);
      this.getpushHost.pageNum = val;
      this.getNumBerData();
    },

    // 添加终端账号弹框
    AddAccount() {
      this.AddFormDataNum.diyFlag = "0";
      this.addviShow = false;
      this.AddFormDataNum.number = "";
      this.AddFormDataNum.endBinding = 0;
      this.AddFormDataNum.deviceId = 0;
      this.AddAccountDialogVisible = true;
    },
    // 添加框中回去视频码率的值
    ChangeSliderData() {
      this.AddFormDataNum.minKps = this.sliderValue[0];
      this.AddFormDataNum.maxKps = this.sliderValue[1];
    },
    //选择终端设备弹框获取数据
    // 选择设备编号弹框
    // 根据状态查询
    async findByStatus() {
      const { data: res } = await this.$http.get("device/findDevicesByStatus", {
        params: this.ChoiceFindStatus,
      });
      // (res);
      this.ChoiceAddDataList = res.data.list;
      this.pushDataAddNum.total = res.data.total;
    },
    // 检索查询
    async ChoicefindBy() {
      if (this.ChoiceFindStatus.param == "") {
        return this.ChoiceAddNum();
      }
      const { data: res } = await this.$http.get("device/findDevicesBy", {
        params: this.ChoiceFindStatus,
      });
      // (res);
      this.ChoiceAddDataList = res.data.list;
      this.pushDataAddNum.total = res.data.total;
    },
    // 监听
    handleCloseOne() {
      ("监听到编辑弹框关闭");
      this.EditFormDataNum.deviceId = 0;
      "this.EditFormDataNum.deviceId", this.EditFormDataNum.deviceId;
      this.editAccountDialogVisible = false;
    },
    // 点击选择设备编号
    async ChoiceAddNum() {
      // ("editNumber", this.editNumber);
      "编辑数据", this.EditFormDataNum;
      "this.EditFormDataNum.deviceId", this.EditFormDataNum.deviceId;
      if (this.EditFormDataNum.deviceId !== 0) {
        this.$message(
          // "已经绑定了设备，如重新选择需要先点击  [取消绑定]  按钮"
          "更改绑定要先取消当前绑定设备"
        );
        return;
      }

      const { data: res } = await this.$http.get("device/findDevices", {
        params: this.pushDataAddNum,
      });
      // ("获取选择设备表单数据");
      // (res);
      this.ChoiceAddDataList = res.data.list;
      this.pushDataAddNum.total = res.data.total;
      this.ChoiceDialogVisible = true;
    },
    Choicedelete() {
      this.EditFormDataNum.deviceId = 0;
    },
    ChoicButtonClose() {
      this.ChoiceDialogVisible = false;
      // this.AddFormDataNum.deviceId = "";
      // this.AddFormDataNum.number = "";
      this.EditFormDataNum.deviceId = 0;
      // this.editNumber = "";
    },
    // 点击选择设备，上传did和设备编号
    choicBtn(row) {
      row;
      // 状态码0空闲，1使用
      if (row.status == 0) {
        row.status = 1;
      } else if (row.status == 1) {
        row.status = 0;
      }
      this.DidNumbers.did = row.did;
      this.DidNumbers.number = row.number;
      this.AddFormDataNum.deviceId = this.DidNumbers.did;
      this.AddFormDataNum.number = this.DidNumbers.number;
      this.EditFormDataNum.deviceId = this.DidNumbers.did;
      this.editNumber = this.DidNumbers.number;

      // (this.DidNumbers);
      // this.ChoiceAddNum();
    },
    // 点击确定，提交选中绑定设备
    ChoicButton() {
      // this.AddFormDataNum.deviceId = this.DidNumbers.did;
      // this.AddFormDataNum.number = this.DidNumbers.number;
      // this.EditFormDataNum.deviceId = this.DidNumbers.did;
      // this.EditFormDataNum.number = this.DidNumbers.number;
      // this.editNumber = this.DidNumbers.number;
      this.ChoiceDialogVisible = false;
    },
    // 分页
    CHhandleCurrentChange(val) {
      // (`当前页: ${val}`);
      this.pushDataAddNum.pageNum = val;
      this.ChoiceAddNum();
    },
    // 选择设备编号弹框end

    // 输入完终端账号后进行查重
    async QueryAccount() {
      let user = {
        userName: "",
      };
      if (user.userName.indexOf(this.UserName + "_") > -1) {
        user.userName = this.AddFormDataNum.account;
      } else {
        user.userName = this.UserName + "_" + this.AddFormDataNum.account;
      }
      // ("终端账号", user);
      const { data: res } = await this.$http.get("client/checkAccount", {
        params: user,
      });
      res;
      if (res.code !== 200) return this.$message.error(res.message);
      if (res.data == false) {
        return this.$message.error("账号以重复，请重新更换账号");
      }
      this.$message.success("账号未重复，可以使用");
      this.AddFormDataNum.password =
        this.UserName + "_" + this.AddFormDataNum.account.toLowerCase();
    },

    // 点击保存按钮并提交添加表单
    async AddAccountData() {
      if (this.AddFormDataNum.account.indexOf(this.UserName + "_") !== -1) {
        this.AddFormDataNum.account = this.AddFormDataNum.account;
      } else {
        this.AddFormDataNum.account =
          this.UserName + "_" + this.AddFormDataNum.account;
      }
      this.AddFormDataNum.account = this.AddFormDataNum.account.toLowerCase();
      this.AddFormDataNum.password = this.AddFormDataNum.account;
      this.AddFormDataNum.projectId = this.getpushHost.projectId;
      // this.AddFormDataNum.number = null;
      this.AddFormDataNum.minKps = this.sliderValuees;
      this.AddFormDataNum.maxKps = this.sliderValuees;
      if (this.AddFormDataNum.number == "") {
        this.AddFormDataNum.deviceId = null;
      }
      this.AddFormDataNum.diyFlag = this.AddFormDataNum.diyFlag * 1;
      const { data: res } = await this.$http.post(
        "client/addClientAccount",
        this.AddFormDataNum
      );
      if (res.code !== 200) {
        // this.AddFormDataNum.account
        this.AddFormDataNum.account = "";
        this.$message.error(res.message);
        return;
      }
      if (res.code == 200) {
        this.$message.success("数据添加成功");
        this.AddAccountDialogVisible = false;
        this.$refs.AddFormDataNumRef.resetFields(); //清空表单
        this.AddFormDataNum.workId = "";
        this.AddFormDataNum.resolution = "";
        this.AddFormDataNum.number = "";
        this.getNumBerData();
        this.addEntityAsync(this.accountTableData[0].account);
      }
    },
    // 取消添加添加终端账号
    AddAccountDataBad() {
      this.AddAccountDialogVisible = false;
      this.$refs.AddFormDataNumRef.resetFields(); //清空表单
      this.AddFormDataNum.workId = "";
      this.AddFormDataNum.resolution = "";
      this.AddFormDataNum.number = "";
      if (this.AddFormDataNum.diyFlag == "1") {
        this.addviShow = true;
      } else {
        this.addviShow = false;
      }
    },
    // 添加终端账号弹框end
    //获取工种信息使用字典管理接口
    async getWorkIdName() {
      const { data: res } = await this.$http.get(
        "system/zidian/getWorkTypeList",
        {
          params: this.getpushHost,
        }
      );
      "工种信息", res;
      const arr = [];
      for (let i = 0; i < res.data.length; i++) {
        arr.push({
          workId: res.data[i].zid,
          workName: res.data[i].name,
        });
      }
      this.WorkIdNameData = arr;
      // (this.WorkIdNameData);
    },

    // 编辑终端账号弹框
    async editAccountVis(row) {
      this.editAccountDialogVisible = true;
      this.EditFormDataNum.clientId = row.clientId;
      this.EditFormDataNum.account = row.userName;
      this.EditFormDataNum.password = row.password;
      this.EditFormDataNum.name = row.name;
      this.EditFormDataNum.tel = row.mobile;
      this.editNumber = row.number;
      this.EditFormDataNum.projectId = this.getpushHost.projectId;
      this.EditFormDataNum.resolution = row.resolution;
      this.EditFormDataNum.diyFlag = row.diyFlag + "";
      // ("编辑完成数据", this.EditFormDataNum);
      if (this.EditFormDataNum.diyFlag == "1") {
        this.videoShow = true;
      } else {
        this.videoShow = false;
      }

      // 设备编号我就先写死，如A10001其实是给1
      // 查询工种
      this.isdata = this.WorkIdNameData.filter(
        (item) => item.workName == row.workType
      );
      // (this.isdata[0].workId);
      this.EditFormDataNum.workId = this.isdata[0].workId;
      let pushdaga = { pageSize: 10000, pageNum: 1 };

      // 获取设备编号
      const { data: res } = await this.$http.get("device/findDevices", {
        params: pushdaga,
      });
      this.ChoiceAddDataList = res.data.list;
      // ("设备单", this.ChoiceAddDataList);
      let arr = [];
      for (let i = 0; i < this.ChoiceAddDataList.length; i++) {
        arr.push({
          did: this.ChoiceAddDataList[i].did,
          number: this.ChoiceAddDataList[i].number,
        });
      }
      if (row.number !== null) {
        let arro = arr.filter((item) => {
          return item.number == row.number;
        });
        "查找的设备", arro;
        this.EditFormDataNum.deviceId = arro[0].did;
        // this.EditFormDataNum.endBinding = this.EditFormDataNum.deviceId;
        if (arro[0].did == undefined) {
          this.EditFormDataNum.endBinding == 0;
        }
        this.EditFormDataNum.endBinding = arro[0].did * 1;
      }
      this.EditFormDataNum.diyFlag = this.EditFormDataNum.diyFlag * 1;
      this.EditFormDataNum.deviceId = this.EditFormDataNum.deviceId * 1;
    },
    // 点击确认提交编辑的数据
    async editAccountPush() {
      this.EditFormDataNum.minKps = this.sliderValuees;
      this.EditFormDataNum.maxKps = this.sliderValuees;
      this.EditFormDataNum.diyFlag = this.EditFormDataNum.diyFlag * 1;
      const { data: res } = await this.$http.post(
        "client/editClientAccount",
        this.EditFormDataNum
      );
      console.log("返回结果", res);

      if (res.code !== 200) {
        this.EditFormDataNum.deviceId = 0;
        this.EditFormDataNum.endBinding = 0;
        this.$message(res.message);
        return;
      }
      this.$message.success("数据编辑成功");
      this.editAccountDialogVisible = false;
      this.EditFormDataNum.deviceId = 0;
      this.EditFormDataNum.endBinding = 0;
      this.getNumBerData();
    },
    editAccountCLOSE() {
      this.EditFormDataNum.deviceId = 0;
      this.editAccountDialogVisible = false;
      if (this.EditFormDataNum.diyFlag == "1") {
        this.videoShow = true;
      } else {
        this.videoShow = false;
      }
    },

    // 添加框中回去视频码率的值
    EDITSliderData() {
      this.EditFormDataNum.minKps = this.sliderValue[0];
      this.EditFormDataNum.maxKps = this.sliderValue[1];
    },
    // 编辑终端账号绑定设备之取消绑定
    async Unbind() {
      // 取消绑定发送一次编辑请求
      // let did = this.EditFormDataNum.deviceId * 1;
      // this.EditFormDataNum.endBinding = did;
      this.EditFormDataNum.deviceId = 0;
      this.editNumber = null;
      "取消绑定", this.EditFormDataNum;
      this.EditFormDataNum.minKps = this.sliderValuees;
      this.EditFormDataNum.maxKps = this.sliderValuees;
      this.EditFormDataNum.diyFlag = this.EditFormDataNum.diyFlag * 1;
      "编辑完成数据", this.EditFormDataNum;
      const { data: res } = await this.$http.post(
        "client/editClientAccount",
        this.EditFormDataNum
      );
      "取消绑定结果", res;
      if (res.code !== 200) {
        this.EditFormDataNum.deviceId = 0;
        this.EditFormDataNum.endBinding = 0;
        this.$message(res.message);
        return;
      }
      this.$message.success("取消绑定成功");
      this.EditFormDataNum.deviceId = 0;
      this.EditFormDataNum.endBinding = 0;
      this.getNumBerData();
    },
    // 视频参数选择跟随系统设置时视频分辨率隐藏
    editvideoShow() {
      if (this.EditFormDataNum.diyFlag == "1") {
        this.videoShow = true;
      } else {
        this.videoShow = false;
      }
    },
    addvideoShow() {
      if (this.AddFormDataNum.diyFlag == "1") {
        this.addviShow = true;
      } else {
        this.addviShow = false;
      }
    },
    // 编辑终端账号弹框end

    ChoiceAccount() {
      this.ChoiceDialogVisible = true;
    },
    // 点击启用按钮，让终端账号处于启用状态，做更改后上传状态
    async getOpen(row) {
      if (row.status == 0) {
        row.status = 1;
      }
      this.pushChangeStatusNum.clientId = row.bid;
      this.pushChangeStatusNum.status = row.status;
      const { data: res } = await this.$http.get("client/changeStatus", {
        params: this.pushChangeStatusNum,
      });
      if (res.code !== 200) {
        this.$message.error(res.message);
        this.getNumBerData();
        return;
      }
      this.$message.success("更改状态成功");

      // 重新刷新页面，终端账号的数据
      this.getNumBerData();
    },
    // 点击禁用按钮，让终端账号处于禁用状态
    async getProhibit(row) {
      if (row.status == 1) {
        row.status = 0;
      }
      this.pushChangeStatusNum.clientId = row.bid;
      this.pushChangeStatusNum.status = row.status;
      const { data: res } = await this.$http.get("client/changeStatus", {
        params: this.pushChangeStatusNum,
      });
      if (res.code !== 200) {
        this.$message.error(res.message);
        this.getNumBerData();
        return;
      }
      this.$message.success("更改状态成功");

      // 重新刷新页面，终端账号的数据
      this.getNumBerData();
    },
    // 点击选择账号状态栏，直接搜索
    async FindDataList() {
      this.getpushHdata.projectId = this.getpushHost.projectId;
      const { data: res } = await this.$http.get("client/findByStatus", {
        params: this.getpushHdata,
      });
      // ("调度员根据状态查询账号", res);
      this.accountTableData = res.data.list;
      this.getpushHost.total = res.data.total;
    },
    // 点击检索栏，查询信息
    async viewFindData() {
      if (this.getpushHost.param == "") {
        this.getpushHost.type = "";
        return this.getNumBerData();
      }
      this.getpushHost.param = this.getpushHost.param.trim();
      const { data: res } = await this.$http.get("client/findByParam", {
        params: this.getpushHost,
      });
      // (res);

      this.accountTableData = res.data.list;
      this.accountTableData;
      for (let i = 0; i < this.accountTableData.length; i++) {
        this.accountTableData[i].userName = this.accountTableData[i].account;
        this.accountTableData[i].mobile = this.accountTableData[i].tel;
      }
      this.getpushHost.total = res.data.total;
    },
    // 重置密码按钮
    async ResetPassword(row) {
      this.resetPwd.clientId = row.clientId;
      const { data: res } = await this.$http.get("client/resetPassword", {
        params: this.resetPwd,
      });
      res;
      if (res.code !== 200) return this.$message.error(res.message);
      this.$message.success("重置密码成功");
    },
    // 终端账号栏方法部分end

    // 调度员账号方法部分
    // 点击跳出添加调度员账号
    controlAccount() {
      this.controlDialogVisible = true;
    },
    // 输入完调度员账号后进行查重
    async QueryAccountTwo() {
      let user = {
        userName: "",
      };
      if (user.userName.indexOf(this.UserName + "_") > -1) {
        user.userName = this.getAccOuntPush.account;
      } else {
        user.userName = this.UserName + "_" + this.getAccOuntPush.account;
      }
      "调度员账号", user;
      const { data: res } = await this.$http.get("client/checkAccount", {
        params: user,
      });
      res;
      if (res.code !== 200) return this.$message.error(res.message);
      if (res.data == false) {
        return this.$message.error("账号以重复，请重新更换账号");
      }
      this.$message.success("账号未重复，可以使用");
      this.getAccOuntPush.pwd =
        this.UserName + "_" + this.getAccOuntPush.account.toLowerCase();
    },

    // 添加调度员账号事件
    async AddControlAccount() {
      this.getAccOuntPush.account =
        this.UserName + "_" + this.getAccOuntPush.account.toLowerCase();
      this.getAccOuntPush.projectId = this.getpushHost.projectId;
      // ("添加调度员数据", this.getAccOuntPush);
      const { data: res } = await this.$http.post(
        "dispatcher/registerDispatcher",
        qs.stringify(this.getAccOuntPush)
      );
      // (res);
      if (res.code !== 200) {
        this.getAccOuntPush.account = "";
        this.$message.error(res.message);
        return;
      }
      this.$message.success("添加调度员账号成功");
      this.controlDialogVisible = false;
      this.$refs.ruleFormRef.resetFields(); //清空表单
      this.getDispatcher();
    },
    // 取消添加调度员
    AddControlAccountBad() {
      this.controlDialogVisible = false;
      this.$refs.ruleFormRef.resetFields(); //清空表单
    },
    // 获取调度员账号渲染列表请求数据列表事件
    async getDispatcher() {
      // if (this.getpushHost.projectId !== 0) {
      //   this.disabledData = false;
      // }

      this.getDispatcherData.projectId = this.getpushHost.projectId;
      const { data: res } = await this.$http.get("dispatcher/findByAll", {
        params: this.getDispatcherData,
      });
      "获取调度员账号列表请求数据", res;
      this.DispatcherData = res.data.list;
      // this.getMoveAccountForm.bid = res.data.bid;
      // 将获取页码保存到对象数据中，可以在使用
      // this.getDispatcherData.pageSize = res.data.pageSize;
      this.getDispatcherData.total = res.data.total;
      // this.getDispatcherData.pageNum = res.data.pageNum;
    },
    // 点击跳转页码
    TwoHandleCurrentChange(val) {
      this.getDispatcherData.pageNum = val;
      this.getDispatcher();
    },
    // 调度员状态查询事件
    async ChangeFinds() {
      const { data: res } = await this.$http.get("dispatcher/findByStatus", {
        params: this.getDispatcherData,
      });
      this.DispatcherData = res.data.list;
      this.getDispatcherData.total = res.data.total;
    },
    // 点击按条件查询信息
    async viewDisData() {
      if (this.getDispatcherData.param == "") {
        this.getDispatcherData.type = "";
        return this.getDispatcher();
      }
      this.getDispatcherData.param = this.getDispatcherData.param.trim();
      const { data: res } = await this.$http.get("dispatcher/findByParam", {
        params: this.getDispatcherData,
      });
      this.DispatcherData = res.data.list;
      this.getDispatcherData.total = res.data.total;
    },
    //调度员点击启用按钮，让终端账号处于启用状态，还没做更改后上传状态
    async getOpenOne(row) {
      // (row);
      if (row.status == 0) {
        row.status = 1;
      }
      this.pushChangeOneNum.bid = row.bid;
      this.pushChangeOneNum.status = row.status;
      const { data: res } = await this.$http.get(
        "dispatcher/changeDispatcherStatus",
        {
          params: this.pushChangeOneNum,
        }
      );
      if (res.code !== 200) return this.$message.error(res.message);
      this.$message.success("状态变更成功");

      // 重新刷新页面，终端账号的数据
      this.getDispatcher();
    },
    // 调度员点击禁用按钮，让终端账号处于禁用状态
    async getProhibitOne(row) {
      if (row.status == 1) {
        row.status = 0;
      }
      this.pushChangeOneNum.bid = row.bid;
      this.pushChangeOneNum.status = row.status;
      const { data: res } = await this.$http.get(
        "dispatcher/changeDispatcherStatus",
        {
          params: this.pushChangeOneNum,
        }
      );
      if (res.code !== 200) return this.$message.error(res.message);
      this.$message.success("状态变更成功");

      // 重新刷新页面，终端账号的数据
      this.getDispatcher();
    },
    // 调度员移动弹框
    async getmoveAccount() {
      // if (this.multipleSelection.length > 1) {
      //   return this.$message("一次只能移动一个账号");
      // }
      this.getmoveaccountVisible = true;
      // this.getMoveAccountForm.bid = this.multipleSelection[0].bid;
      let datas = {
        bid: this.multipleSelection[0].bid,
      };
      // ("查询数据", this.getMoveRuleForm);

      const { data: res } = await this.$http.get("dispatcher/getProjectList", {
        params: datas,
      });
      // ("调度员移动项目res", res);
      this.getMoveAccountData = res.data;

      if (this.multipleSelection.length == 1) {
        // return this.$message("一次只能移动一个账号");
        this.getMoveAccountForm.bid = this.multipleSelection[0].bid;
        return;
      } else if (this.multipleSelection.length > 1) {
        let one = [];
        for (let i = 0; i < this.multipleSelection.length; i++) {
          one.push(this.multipleSelection[i].bid);
        }
        "选择数据", one;

        this.getMoveAccountForm.bid = one.toString();
      }
    },
    // 调度员移动弹框，选取后移动项目
    async GETMoveIsAccData() {
      // this.getMoveDataAccList.bid = this.getMoveAccountForm.bid;
      this.getMoveAccountForm.projectId = this.getMoveDataAccList.projectId;
      "调度员移动数据", this.getMoveAccountForm;
      const { data: res } = await this.$http.post(
        "dispatcher/moveDispatcher",
        qs.stringify(this.getMoveAccountForm)
      );
      if (res.code !== 200) return this.$message.error(res.message);
      this.$message.success("移动成功");
      this.getmoveaccountVisible = false;
      this.getMoveDataAccList.projectId = "";
      this.getMoveDataAccList.bid = "";
      this.getDispatcher();
    },
    //点击跳出编辑调度员框
    editAccountViss(row) {
      this.editAccounData.tel = row.mobile;
      this.editAccounData.bid = row.bid;
      this.editAccounData.name = row.name;
      this.editAccounData.account = row.userName;
      this.editAccounData.pwd = row.password;
      this.EditcontrolDialogVisible = true;
    },
    // 编辑调度员事件
    async editAccountVisData() {
      "编辑调度员数据", this.editAccounData;
      const { data: res } = await this.$http.post(
        "dispatcher/editDispatcher",
        qs.stringify(this.editAccounData)
      );
      if (res.code !== 200) {
        this.$message.error(res.message);
        return;
      }
      this.$message.success("编辑成功");
      this.EditcontrolDialogVisible = false;
      this.getDispatcher();
    },
    // 调度员重置密码
    async resetPwds(row) {
      row;
      this.editAccounData.bid = row.bid;
      const { data: res } = await this.$http.get("dispatcher/resetPassword", {
        params: this.editAccounData,
      });
      // (res);
      if (res.code !== 200) return this.$message.error(res.message);
      this.$message.success("重置密码成功");
    },
    // 调度员账号方法部分end

    // 状态框查询(直接查询数据)
    async putFindStatus() {
      this.findForm.projectName = "";
      const { data: res } = await this.$http.get("project/findByStatus", {
        params: this.SStatus,
      });
      // ("查询状态数据", res);
      this.tableList = res.data;
    },
    // 项目名称模糊查询
    async findInputData() {
      if (this.findForm.projectName == "") {
        return this.getDataList();
      }
      // this.SStatus.status = "";
      this.findForm.projectName = this.findForm.projectName.trim();
      const { data: res } = await this.$http.get("project/findByName", {
        params: this.findForm,
      });
      this.tableList = res.data;
    },
    // 添加项目按钮跳转页面
    addData() {
      this.$router.push("/project/addlist");
    },
    // 编辑项目页面跳转
    pushEdit(row) {
      this.$router.push({
        path: "/project/editlist",
        query: {
          businessId: row.businessId,
          introduction: row.introduction,
          personInCharge: row.personInCharge,
          picPhone: row.picPhone,
          pid: row.pid,
          projectAddress: row.projectAddress,
          projectName: row.projectName,
          status: row.status,
        },
      });
    },
    // 报警设置页面
    // "alarmId": null,
    // 	"dropSwitch": "四川西南项目一期",  跌落开关
    // 	"alarmLeaveSwitch": "四川省成都市双流区武侯大道1225号", 脱离报警开关
    // 	"alarmLeaveTime": "该字段已废弃，请保持值为空",    null
    // 	"hignWorkAlarm": "420",        高空作业距离
    // 	"projectId": 1,
    // 	"beginTime": "2019-10-01 00:00:00",   脱离报警开关时间
    // 	"endTime": "2019-12-01 00:00:00"
    // 更改时间操作
    TimeChange() {
      // this.CellFindSetList.beginTime = this.TimeData[0];
      // this.CellFindSetList.endTime = this.TimeData[1];
      this.CellFindSetList.beginTime;
      this.CellFindSetList.endTime;
    },
    // 获取报警设置页面数据
    async GetCellSetting() {
      this.CellFindSetData.projectId = this.getpushHost.projectId;
      const { data: res } = await this.$http.get("alarmSetting/findSetting", {
        params: this.CellFindSetData,
      });
      "报警数据", res;

      // if (res.code !== 200) return this.$message.error("数据获取失败");
      // this.$message.success("数据获取成功");
    },
    // 更新保存报警设置数据
    async GetCellSetonData() {
      this.CellFindSetList.dropSwitch = this.CellFindSetting.radioOne * 1;
      if (this.CellFindSetting.radioTwo == 0) {
        this.CellFindSetList.alarmLeaveSwitch =
          this.CellFindSetting.radioTwoSun * 1;
      } else if (this.CellFindSetting.radioTwo == 1) {
        this.CellFindSetList.alarmLeaveSwitch = 2;
      }
      // this.CellFindSetList.alarmLeaveSwitch = this.CellFindSetting.radioTwo;
      if (this.CellFindSetting.radioThree == 1) {
        this.CellFindSetList.hignWorkAlarm = "";
      } else {
        this.CellFindSetList.hignWorkAlarm = this.CellFindSetting.hignWorkAlarm;
        // this.CellFindSetting.hignWorkAlarm = "";
      }
      this.CellFindSetList.projectId = this.getpushHost.projectId;
      "更新上传报警设置数据", this.CellFindSetList;

      const { data: res } = await this.$http.post(
        "alarmSetting/updateSetting",
        this.CellFindSetList
      );
      // ("报警页面提交保存返回结果", res);

      if (res.code !== 200) return this.$message.error(res.message);
      this.$message.success("报警设置成功");
      // ("报警设置结果", res);

      // // 刷新所有页面
      this.getDataList();
    },
    // 脱离报警是否设置时间
    yesTime() {
      if (this.CellFindSetting.radioTwo == 1) {
        this.disabledtwo = false;
      } else {
        this.disabledtwo = true;
      }
    },
    // 点击查看报警设置
    async AlarmSettings() {
      // ("查询报警上传数据", this.getpushHost);

      const { data: res } = await this.$http.get("alarmSetting/findSetting", {
        params: this.getpushHost,
      });
      "报警设置页面数据", res;
      if (res.data == undefined) {
        "报警页面无数据", res;
        this.CellFindSetting.radioOne = "0";
        this.CellFindSetting.radioTwo = "0";
        this.disabledtwo = true;
        this.CellFindSetting.radioTwoSun = "0";
        this.CellFindSetting.radioThree = "1";
        this.CellFindSetting.hignWorkAlarm = "";
        this.CellFindSetList.beginTime = "";
        this.CellFindSetList.endTime = "";
      } else if (res.data !== undefined) {
        "报警页面有数据", res;
        this.CellFindSetList = res.data;
        "报警设置页面数据1", this.CellFindSetList;
        this.CellFindSetting.radioOne = this.CellFindSetList.dropSwitch + "";

        if (this.CellFindSetList.alarmLeaveSwitch == 2) {
          this.CellFindSetting.radioTwo = "1";
        } else if (this.CellFindSetList.alarmLeaveSwitch == 0) {
          this.CellFindSetting.radioTwo = "0";
          this.CellFindSetting.radioTwoSun = "0";
        } else if (this.CellFindSetList.alarmLeaveSwitch == 1) {
          this.CellFindSetting.radioTwo = "0";
          this.CellFindSetting.radioTwoSun = "1";
        }

        // this.CellFindSetting.radioTwo =
        //   this.CellFindSetList.alarmLeaveSwitch + "";
        if (this.CellFindSetList.hignWorkAlarm == 0) {
          this.CellFindSetting.radioThree = "1";
          this.CellFindSetting.hignWorkAlarm = "";
          // (this.CellFindSetting.radioThree);
        } else if (this.CellFindSetList.hignWorkAlarm !== 0) {
          this.CellFindSetting.radioThree = "0";
          this.CellFindSetting.hignWorkAlarm = this.CellFindSetList.hignWorkAlarm;
          // (234);
        }
        // this.CellFindSetting.radioThree = this.CellFindSetList.hignWorkAlarm;
        // this.CellFindSetting.hignWorkAlarm = this.CellFindSetList.hignWorkAlarm;
        this.CellFindSetList.alarmId = res.data.alarmId;
        // if (this.CellFindSetList.hignWorkAlarm !== "") {
        //   this.CellFindSetting.radioThree = "0";
        // } else if (this.CellFindSetList.hignWorkAlarm == "") {
        //   this.CellFindSetting.radioThree = "1";
        // }
        if (this.CellFindSetting.radioTwo == 1) {
          this.disabledtwo = false;
        } else if (this.CellFindSetting.radioTwo == 0) {
          this.disabledtwo = true;
        }
      }
    },
    // 报警设置页面end

    // 终端账号导出
    async getOutData() {
      this.outDataExe.projectId = this.getpushHost.projectId;
      let arr = [];
      for (let i = 0; i < this.multipleSelection.length; i++) {
        arr.push(this.multipleSelection[i].bid);
      }
      // (arr);
      this.outDataExe.bids.bid = arr;
      this.outDataExe.bids = JSON.stringify(this.outDataExe.bids);
      this.outDataExe;
      const {
        data: res,
      } = await this.$http.post(
        "client/handleExportClientAccountList",
        qs.stringify(this.outDataExe),
        { responseType: "blob" }
      );
      res;

      // 将数据变成a标签
      const link = document.createElement("a");
      let blob = new Blob([res], { type: "application/vnd.ms-excel" });
      link.style.display = "none";
      link.href = URL.createObjectURL(blob);
      let num = "";
      for (let i = 0; i < 10; i++) {
        num += Math.ceil(Math.random() * 10);
      }
      link.setAttribute("download", "项目管理_终端账号_" + num + ".xls");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      (this.outDataExe.bids = {}), (this.outDataExe.projectId = "");
    },
    // 调度员导出
    async getOutDataTwo() {
      // (this.multipleSelection);
      this.outDataExe.projectId = this.getpushHost.projectId;
      const arr = [];
      for (let i = 0; i < this.multipleSelection.length; i++) {
        arr.push(this.multipleSelection[i].bid);
      }
      // (arr);
      this.outDataExe.bids.bid = arr;
      this.outDataExe.bids = JSON.stringify(this.outDataExe.bids);
      this.outDataExe;
      const {
        data: res,
      } = await this.$http.post(
        "dispatcher/handleExportDispatcher",
        qs.stringify(this.outDataExe),
        { responseType: "blob" }
      );
      res;

      // 将数据变成a标签
      const link = document.createElement("a");
      let blob = new Blob([res], { type: "application/vnd.ms-excel" });
      link.style.display = "none";
      link.href = URL.createObjectURL(blob);
      let num = "";
      for (let i = 0; i < 10; i++) {
        num += Math.ceil(Math.random() * 10);
      }
      link.setAttribute("download", "项目管理_调度员_" + num + ".xls");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      (this.outDataExe.bids = {}), (this.outDataExe.projectId = "");
    },
  },
};
</script>

<style lang="less" scoped>
#pro {
  .el-dialog__wrapper {
    overflow: scroll;
  }

  .box {
    width: 100%;
    padding: 10px;
    margin-top: -10px;
    // background-color: pink;
    height: 750px;
    display: flex;
    .box-left {
      width: 32%;
      float: left;
      // background-color: skyblue;
      // height: 100%;
      padding: 5px;
      border: 1px solid #eee;
      /deep/.el-card__body {
        // height: 2.87rem;
        position: relative;
        overflow: auto;
        // height: 300px !important;
        height: 500px !important;
        /deep/.el-table {
          position: absolute;
          width: auto;
          max-width: none;
          // height: 480px;
          // height: 500px !important;
        }
      }
      // .el-table {
      //   position: absolute;
      //   width: auto;
      //   max-width: none;
      //   // height: 500px !important;
      // }
    }
    .box-right {
      width: 67%;
      // min-width: 65%;
      // overflow: scroll;
      float: right;
      // background: green;
      height: 100%;
      .el-form-item__content {
        margin-left: 20px !important;
      }
      .add-main {
        .el-form-item__label {
          text-align: left;
        }
      }
    }
  }
  .opt1 {
    .el-form-item__label {
      width: 125px;
    }
    .el-form-item__content {
      margin-left: 125px;
    }
  }
  .it8 {
    span {
      margin-right: 50px;
      margin-left: 33px;
    }
    .radio-1 {
      float: left;
      margin-left: 33px;
      margin-right: 50px;
    }
    .radio-2 {
      float: left;
      width: 600px;
      p {
        // text-align: center;
        margin-left: 154px;
      }
    }
    .in1 {
      .el-button {
        margin-left: 30px;
      }
    }
  }
  .el-dialog .el-pagination {
    margin-top: 20px;
    border-bottom: 1px solid #eee;
  }
  .rigle {
    float: right;
  }
}
</style>

// 数据页面
<template>
  <div>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>数据</span>
        <el-form ref="form" :model="dataNameForm" label-width="100px">
          <el-form-item label="项目名称">
            <el-select @change="chooseProject" v-model="pid" placeholder>
              <el-option
                v-for="item in options"
                :key="item.pid"
                :label="item.projectName"
                :value="item.pid"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </div>
      <!-- 主题tab栏 -->
      <div class="text item">
        <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
          <el-tab-pane label="照片" name="first" :disabled="disableData">
            <!-- 功能主体区 -->
            <el-form ref="form" :model="photoForm" label-width="100px">
              <el-row :gutter="10">
                <el-col :span="5">
                  <el-form-item label="账号类型">
                    <el-select
                      v-model="typeValue"
                      placeholder="全部"
                      @change="getType1"
                      :disabled="disableData"
                    >
                      <el-option
                        v-for="item in typeOption"
                        :key="item.typeValue"
                        :label="item.name"
                        :value="item.typeValue"
                      ></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>

                <el-col :span="6">
                  <el-form-item label="上传时间">
                    <el-date-picker
                      v-model="photoDate"
                      type="daterange"
                      range-separator="至"
                      start-placeholder="开始日期"
                      end-placeholder="结束日期"
                      value-format="yyyy-MM-dd"
                      unlink-panels
                      @change="findTime"
                      :disabled="disableData"
                    ></el-date-picker>
                  </el-form-item>
                </el-col>

                <el-col :span="7">
                  <el-form-item label="检索">
                    <el-row :gutter="0">
                      <el-col :span="8">
                        <div class="grid-content bg-purple">
                          <el-select
                            v-model="photoSearch"
                            placeholder="请选择"
                            :clearable="makeSureClear"
                          >
                            <el-option
                              v-for="item in photoSearchOption"
                              :key="item.photoSearch"
                              :label="item.name"
                              :value="item.photoSearch"
                            ></el-option>
                          </el-select>
                        </div>
                      </el-col>
                      <el-col :span="14">
                        <div class="grid-content bg-purple">
                          <el-input
                            v-model="photoContext"
                            placeholder="请输入内容"
                          ></el-input>
                        </div>
                      </el-col>
                      <el-col :span="2">
                        <el-button
                          type="primary"
                          style="margin-left: 20px"
                          @click="photoQuery"
                          :disabled="disableData"
                          >查询</el-button
                        >
                      </el-col>
                    </el-row>
                  </el-form-item>
                </el-col>

                <el-col :span="3" style="float: right">
                  <!-- <el-button type="primary" @click="downloadEvent">下载</el-button> -->
                  <!-- <el-button type="primary" @click="photoDataList()">查询全部</el-button> -->
                  <!-- <el-button
                    type="danger"
                    @click="deleteFile"
                    :disabled="disableData"
                    v-for="item in roleList"
                    v-if="item == 36"
                  >删除</el-button>-->
                  <el-button
                    type="danger"
                    @click="deleteFile"
                    :disabled="disableData"
                    v-show="roleList.indexOf(36) !== -1"
                    >删除</el-button
                  >

                  <!-- <el-button
                    type="success"
                    @click="exportPhotos"
                    :disabled="disableData"
                    v-for="item in roleList"
                    v-if="item == 34"
                  >导出</el-button>-->
                  <el-button
                    type="success"
                    @click="exportPhotos"
                    :disabled="disableData"
                    v-show="roleList.indexOf(34) !== -1"
                    >导出</el-button
                  >
                  <!-- <el-button @click="btnCELL">跳转cellphone页面</el-button> -->
                </el-col>
              </el-row>
            </el-form>

            <!-- 下半部表格区 -->
            <el-table
              ref="multipleTable"
              :data="photoData"
              tooltip-effect="dark"
              style="width: 100%"
              @selection-change="handleSelectionChange"
              border
            >
              <el-table-column
                type="selection"
                width="55"
                prop="fid"
              ></el-table-column>
              <el-table-column
                prop="fileName"
                label="文件名"
                width
              ></el-table-column>
              <el-table-column
                prop="uploadByName"
                label="上传人姓名"
                width
              ></el-table-column>
              <el-table-column
                prop="uploadByAccount"
                label="上传人账号"
                width
                show-overflow-tooltip
              ></el-table-column>
              <el-table-column
                prop="userType"
                label="账号类型"
                show-overflow-tooltip
                :formatter="changeStatus"
              ></el-table-column>
              <el-table-column label="文件大小(MB)" show-overflow-tooltip>
                <template slot-scope="scope">
                  <span>{{ scope.row.fileSize }} MB</span>
                </template>
              </el-table-column>
              <el-table-column
                prop="uploadTime"
                label="上传时间"
                show-overflow-tooltip
              ></el-table-column>
              <el-table-column label="操作" width="400" show-overflow-tooltip>
                <template slot-scope="scope">
                  <el-button
                    type="primary"
                    size="mini"
                    @click="viewPhoto(scope.row)"
                    :disabled="disableData"
                    v-show="roleList.indexOf(37) !== -1"
                    >查看</el-button
                  >
                  <!-- <el-button
                    type="primary"
                    size="mini"
                    @click="viewPhoto(scope.row)"
                    :disabled="disableData"
                  >查看</el-button>-->
                  <el-button
                    type="success"
                    size="mini"
                    @click="editPhoto(scope.row.fid)"
                    :disabled="disableData"
                    v-show="roleList.indexOf(35) !== -1"
                    >编辑</el-button
                  >

                  <!-- <el-button
                    type="success"
                    size="mini"
                    @click="editPhoto(scope.row.fid)"
                    :disabled="disableData"
                  >编辑</el-button>-->
                  <el-button
                    type="success"
                    size="mini"
                    @click="viewAction(scope.row)"
                    :disabled="disableData"
                    v-show="roleList.indexOf(96) !== -1"
                    >定位</el-button
                  >
                  <el-button
                    type="primary"
                    size="mini"
                    @click="download(scope.row)"
                    :disabled="disableData"
                    v-show="roleList.indexOf(33) !== -1"
                    >下载</el-button
                  >
                  <!-- <el-button
                    type="primary"
                    size="mini"
                    @click="download(scope.row)"
                    :disabled="disableData"
                  >下载</el-button>-->
                </template>
              </el-table-column>
            </el-table>

            <!-- 分页 -->
            <el-pagination
              :total="total1"
              :page-size="pageSize1"
              :current-page="pageNum1"
              @current-change="photoPage"
              layout="prev, pager, next"
              style="margin-top: 30px"
              :disabled="disableData"
            ></el-pagination>
          </el-tab-pane>

          <el-tab-pane label="视频" name="second" :disabled="disableData">
            <!-- 功能主体区 -->
            <el-form ref="form" :model="videoForm" label-width="100px">
              <el-row :gutter="10">
                <el-col :span="5">
                  <el-form-item label="账号类型">
                    <el-select
                      v-model="videoValue"
                      placeholder="全部"
                      @change="videoType"
                      :disabled="disableData"
                    >
                      <el-option
                        v-for="item in videoTypeOption"
                        :key="item.videoValue"
                        :label="item.name"
                        :value="item.videoValue"
                      ></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>

                <el-col :span="6">
                  <el-form-item label="上传时间">
                    <el-date-picker
                      v-model="videoDate"
                      type="daterange"
                      range-separator="至"
                      start-placeholder="开始日期"
                      end-placeholder="结束日期"
                      value-format="yyyy-MM-dd"
                      unlink-panels
                      @change="findvidEvent"
                    ></el-date-picker>
                  </el-form-item>
                </el-col>

                <el-col :span="7">
                  <el-form-item label="检索">
                    <el-row :gutter="0">
                      <el-col :span="8">
                        <div class="grid-content bg-purple">
                          <el-select
                            v-model="videoSearch"
                            placeholder="请选择"
                            :clearable="makeSureClear"
                          >
                            <el-option
                              v-for="item in videoSearchOption"
                              :key="item.videoSearch"
                              :label="item.name"
                              :value="item.videoSearch"
                            ></el-option>
                          </el-select>
                        </div>
                      </el-col>
                      <el-col :span="14">
                        <div class="grid-content bg-purple">
                          <el-input
                            v-model="videoContext"
                            placeholder="请输入内容"
                          ></el-input>
                        </div>
                      </el-col>
                      <el-col :span="2">
                        <el-button
                          type="primary"
                          style="margin-left: 20px"
                          @click="videoQuery"
                          :disabled="disableData"
                          >查询</el-button
                        >
                      </el-col>
                    </el-row>
                  </el-form-item>
                </el-col>

                <el-col :span="3" style="float: right">
                  <!-- <el-button type="primary">下载</el-button> -->
                  <!-- <el-button type="danger" @click="deleteFile" :disabled="disableData">删除</el-button>
                  <el-button type="success" @click="exportVID" :disabled="disableData">导出</el-button>-->
                  <el-button
                    type="danger"
                    @click="deleteFile"
                    :disabled="disableData"
                    v-show="roleList.indexOf(36) !== -1"
                    >删除</el-button
                  >
                  <el-button
                    type="success"
                    @click="exportVID"
                    :disabled="disableData"
                    v-show="roleList.indexOf(95) !== -1"
                    >导出</el-button
                  >
                </el-col>
              </el-row>
            </el-form>

            <!-- 下半部表格区 -->
            <el-table
              ref="multipleTable"
              :data="videoData"
              tooltip-effect="dark"
              style="width: 100%"
              @selection-change="handleSelectionChange"
              border
            >
              <el-table-column
                type="selection"
                prop="fid"
                width="55"
              ></el-table-column>
              <el-table-column
                prop="fileName"
                label="文件名"
                width
              ></el-table-column>
              <el-table-column
                prop="uploadByName"
                label="上传人姓名"
                width
              ></el-table-column>
              <el-table-column
                prop="uploadByAccount"
                label="上传人账号"
                width
                show-overflow-tooltip
              ></el-table-column>
              <el-table-column
                prop="userType"
                label="账号类型"
                show-overflow-tooltip
                :formatter="changeStatus"
              ></el-table-column>
              <el-table-column label="文件大小(MB)" show-overflow-tooltip>
                <template slot-scope="scope">
                  <span>{{ scope.row.fileSize }} MB</span>
                </template>
              </el-table-column>
              <el-table-column
                prop="uploadTime"
                label="上传时间"
                show-overflow-tooltip
              ></el-table-column>
              <el-table-column label="操作" width="400" show-overflow-tooltip>
                <template slot-scope="scope">
                  <!-- <el-button
                    type="primary"
                    size="mini"
                    @click="viewVideo(scope.row)"
                    :disabled="disableData"
                  >查看</el-button>
                  <el-button
                    type="success"
                    size="mini"
                    @click="editPhoto(scope.row.fid)"
                    :disabled="disableData"
                  >编辑</el-button>
                  <el-button
                    type="success"
                    size="mini"
                    @click="viewAction(scope.row)"
                    :disabled="disableData"
                  >定位</el-button>
                  <el-button
                    type="primary"
                    size="mini"
                    @click="download(scope.row)"
                    :disabled="disableData"
                  >
                    下载
                  </el-button>-->
                  <el-button
                    type="primary"
                    size="mini"
                    @click="viewVideo(scope.row)"
                    :disabled="disableData"
                    v-show="roleList.indexOf(37) !== -1"
                    >查看</el-button
                  >
                  <el-button
                    type="success"
                    size="mini"
                    @click="editPhoto(scope.row.fid)"
                    :disabled="disableData"
                    v-show="roleList.indexOf(35) !== -1"
                    >编辑</el-button
                  >
                  <el-button
                    type="success"
                    size="mini"
                    @click="viewAction(scope.row)"
                    :disabled="disableData"
                    v-show="roleList.indexOf(96) !== -1"
                    >定位</el-button
                  >
                  <el-button
                    type="primary"
                    size="mini"
                    @click="downloadvid(scope.row)"
                    :disabled="disableData"
                    v-show="roleList.indexOf(33) !== -1"
                    >下载</el-button
                  >
                </template>
              </el-table-column>
            </el-table>

            <!-- 分页 -->
            <el-pagination
              :total="total2"
              :page-size="pageSize2"
              :current-page="pageNum2"
              @current-change="videoPage"
              layout="prev, pager, next"
              style="margin-top: 30px"
            ></el-pagination>
          </el-tab-pane>
        </el-tabs>
      </div>
    </el-card>

    <!-- 查看照片对话框 -->
    <el-dialog
      :visible.sync="viewPhotoDialogVisible"
      width="25%"
      :modal="false"
    >
      <div style="width: 100%">
        <el-image
          style="width: 100%; height: 100%"
          :src="imageUrl[0]"
          :preview-src-list="imageUrl"
        >
        </el-image>
        <!--        <img :src="imageUrl" class="imagesurl" />-->
      </div>
    </el-dialog>
    <!-- 查看视频对话框 -->
    <el-dialog
      :visible.sync="viewVideoDialogVisible"
      width="33.5%"
      :modal="false"
      destroy-on-close
    >
      <div style="width: 100%">
        <video :src="videoUrl" class="videosurl" controls id="videL"></video>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="btnVid" id="btnnn" type="primary">关 闭</el-button>
      </span>
    </el-dialog>
    <!-- 编辑照片对话框 -->
    <el-dialog
      title="编辑"
      :visible.sync="editPhotoDialogVisible"
      width="30%"
      :modal="false"
    >
      <el-form
        :model="dataNameForm"
        :rules="editRules"
        ref="ruleForm"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="修改名称" prop="name">
          <el-input v-model="changeName"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editPhotoDialogVisible = false">取 消</el-button>
        <el-button
          type="primary"
          @click="
            editPhotoDialogVisible = false;
            updateName();
          "
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
import qs from "qs";
import { createNamespacedHelpers } from "vuex";
const { mapState, mapActions } = createNamespacedHelpers("datum");
export default {
  data() {
    return {
      photoData: [], //照片数据
      videoData: [], //视频数据
      disableData: true,
      options: [
        {
          pid: "",
          projectName: "",
        },
      ],
      pid: "",
      // 项目名称列表
      dataNameForm: {
        name: "",
        region: "",
      },
      // tab栏默认选中
      activeName: "first",
      // 照片栏表单数
      photoForm: {
        name: "",
        region: "",
      },
      videoForm: {
        name: "",
        region: "",
      },
      photoDate: "",
      videoDate: "",
      multipleSelection: [],
      viewPhotoDialogVisible: false,
      viewVideoDialogVisible: false,
      // 编辑照片对话框
      editPhotoDialogVisible: false,
      // 编辑文件名对话框验证规则
      editRules: {
        name: [
          { required: true, message: "请输入文件名", trigger: "blur" },
          {
            min: 3,
            max: 20,
            message: " 文件名限制20字符及以内",
            trigger: "blur",
          },
        ],
      },
      type: 1,
      typeValue: "",
      typeOption: [
        {
          name: "全部",
          typeValue: "",
        },
        {
          name: "终端",
          typeValue: 2,
        },
        {
          name: "调度员",
          typeValue: 1,
        },
      ],
      videoValue: "",
      videoTypeOption: [
        {
          name: "全部",
          videoValue: "",
        },
        {
          name: "终端",
          videoValue: 2,
        },
        {
          name: "调度员",
          videoValue: 1,
        },
      ],
      photoSearch: "",
      photoSearchOption: [
        {
          name: "文件名",
          photoSearch: "文件名",
        },
        {
          name: "上传人姓名",
          photoSearch: "上传人姓名",
        },
        {
          name: "上传人账号",
          photoSearch: "上传人账号",
        },
      ],
      videoSearch: "",
      videoSearchOption: [
        {
          name: "文件名",
          videoSearch: "文件名",
        },
        {
          name: "上传人姓名",
          videoSearch: "上传人姓名",
        },
        {
          name: "上传人账号",
          videoSearch: "上传人账号",
        },
      ],
      photoContext: "",
      videoContext: "",
      changeName: "",
      // 导出表格上传数据
      FID: {
        fileIds: [],
      },
      imageUrl: [],
      videoUrl: "",
      checked: null, // 如果使用单选框,定义一个model值
      currentSelectItem: {}, // 当前选中的值
      currentRow: null,
      fidess: {},
      roleList: [],
      total1s: 0,
      total2s: 0,
      // 杜发起照片请求
      dataS: {
        pageNum: 1,
        pageSize: 5,
        type: 1,
        projectId: null,
        userType: 0,
      },
      // 杜发起视频请求
      dataTWO: {
        pageNum: 1,
        pageSize: 5,
        userType: "",
        type2: 2,
        projectId: null,
      },
      deleteId: 0,
      fiddELEdata: {
        fid: 0,
      },
      makeSureClear: true,
    };
  },
  mounted() {
    this.getid();
    // this.photoDataList();
    // this.videoDataList();
    this.photoByTypeAsync();
    this.videoByTypeAsync();
  },
  computed: {
    ...mapState([
      "pageNum1",
      "pageSize1",
      "list1",
      "total1",
      "pageNum2",
      "pageSize2",
      "list2",
      "total2",
    ]),
  },
  created() {
    this.getRoleBtnData();
  },
  methods: {
    btnCELL() {
      this.$router.push("/mail/phones");
    },
    // 功能权限
    async getRoleBtnData() {
      let dataR = {
        parentId: 6,
        userName: null,
      };
      const { data: res } = await this.$http.get("menu/getButtonMenus", {
        params: dataR,
      });
      // ("获取数据页面功能权限", res);
      let arr = [];
      res.data.forEach((item) => {
        arr.push(item.mid);
      });
      this.roleList = arr;
      // ("获取数据页面功能权限", this.roleList);
    },
    ...mapActions([
      "getProjectAsync",
      "photoByTypeAsync",
      "videoByTypeAsync",
      "photoByTimeAsync",
      "videoByTimeAsync",
      "photoByNameAsync",
      "videoByNameAsync",
      "photoByUploadAsync",
      "videoByUploadAsync",
      "photoByAccountAsync",
      "videoByAccountAsync",
      "updateNameAsync",
      "deleteItemAsync",
      "checkDetailAsync",
      "getLocationAsync",
    ]),
    // 点击tab栏，监听
    handleClick(value) {
      if (value.label == "照片") {
        this.type = 1;
      } else if (value.label == "视频") {
        this.type = 2;
      }
      this.$store.commit("datum/initType", this.type);
      this.$store.commit("datum/photoPage", 1);
      this.$store.commit("datum/videoPage", 1);
      this.photoByTypeAsync().then((val) => {
        this.videoByTypeAsync().then((val) => {
          this.flashData();
        });
      });
    },
    // table表格监听,当选择项发生变化时会触发该事件
    handleSelectionChange(val) {
      this.multipleSelection = val;
      // this.deleteId = this.multipleSelection[0].fid;
      this.str = val.map((v) => v.fid).join(",");
    },
    // 点击查看照片
    async viewPhoto(prop) {
      this.imageUrl = [];
      const data = await this.checkDetailAsync(prop.fid);
      let mess = data.message;
      let MESS = "";
      mess = mess.replace(/\\/g, "/");
      if (window.location.protocol == "http:") {
        if (mess.indexOf("http") == -1) {
          MESS = window.location.protocol + "//" + mess;
        } else if (mess.indexOf("http") !== -1) {
          MESS = mess;
        }
      }
      if (window.location.protocol == "https:") {
        let one = mess.split("//");
        let two = one[1].split("/");
        two[0] = window.location.host;
        // two[0] = "qiye.ytha-hd.com";
        let three = "";
        for (let i = 0; i < two.length; i++) {
          three += two[i] + "/";
        }
        three = three.substr(0, three.length - 1);
        MESS = window.location.protocol + "//" + three;
      }
      this.imageUrl.push(MESS);
      this.viewPhotoDialogVisible = true;

      // if (mess.indexOf("http") == -1) {
      //   ("不含有http");
      //   if (mess.indexOf("/") == -1) {
      //     return;
      //   }
      //   MESS = "http://" + mess;
      // } else if (mess.indexOf("http") !== -1) {
      //   ("有http");
      //   MESS = mess;
      // }
      // if (mess.indexOf("https") !== -1) {
      //   ("没有https");
      //   let one = mess.split("//");
      //   let two = one[1].split("/");
      //   // two[0] = window.location.host;
      //   two[0] = "qiye.ytha-hd.com";
      //   let three = "";
      //   for (let i = 0; i < two.length; i++) {
      //     three += two[i] + "/";
      //   }
      //   three = three.substr(0, three.length - 1);
      //   MESS = "https://" + three;
      // }
      // this.imageUrl = MESS;
      // ("处理后地址", this.imageUrl);

      // this.viewPhotoDialogVisible = true;
    },
    //点击查看视频
    async viewVideo(prop) {
      const data = await this.checkDetailAsync(prop.fid);
      let mess = data.message;
      let MESS = "";
      // // mess.replace(/\\/, "/");
      // ("原始地址2", mess);
      // alert(mess.replace(/\\/g, "/"));
      mess = mess.replace(/\\/g, "/");
      if (mess.indexOf("http") == -1) {
        if (mess.indexOf("/") == -1) {
          return;
        }
        MESS = "http://" + mess;
      } else if (mess.indexOf("http") !== -1) {
        MESS = mess;
      }
      if (mess.indexOf("https") !== -1) {
        let one = mess.split("//");
        let two = one[1].split("/");
        // two[0] = window.location.host;
        two[0] = "qiye.ytha-hd.com";
        let three = "";
        for (let i = 0; i < two.length; i++) {
          three += two[i] + "/";
        }
        three = three.substr(0, three.length - 1);
        MESS = "https://" + three;
      }
      // ("处理反斜杠1", MESS);
      this.videoUrl = MESS;
      this.viewVideoDialogVisible = true;
    },
    handleCloses() {
      this.$confirm("确认关闭？")
        .then((_) => {
          done();
        })
        .catch((_) => {});
    },
    // 点击关闭视频
    btnVid() {
      var videL = document.getElementById("videL");
      var btnnn = document.getElementById("btnnn");
      btnnn.onclick = function () {
        if (videL.paused) {
          videL.play();
        } else {
          videL.pause();
        }
      };
      this.viewVideoDialogVisible = false;
    },
    // 点击编辑照片按钮
    editPhoto(prop) {
      this.editPhotoDialogVisible = true;
      this.changeId = prop;
    },
    // 选择项目查询数据
    chooseProject() {
      this.$store.commit("datum/initPid", this.pid);
      this.disableData = false;
      this.$store.commit("datum/photoPage", 1);
      this.videoByTypeAsync().then((val) => {
        this.photoByTypeAsync().then((val) => {
          this.flashData();
          // this.photoData = this.list1;
          // this.videoData = this.list2;
        });
      });

      // this.videoByTypeAsync().then(val => {
      //   this.videoData = this.list2;
      //   ("视频使用数据", this.videoData);
      // });
      // this.photoByTypeAsync().then(val => {
      //   this.photoData = this.list1;
      //   ("照片使用数据", this.photoData);
      // });

      // 刷新页面
      this.photoData = this.list1;
      // this.videoData = this.list2;
    },
    flashData() {
      this.photoData = this.list1;
      this.videoData = this.list2;
      // this.total1s = this.total1;
      // this.total2s = this.total2;
    },

    async getid() {
      const data = await this.getProjectAsync();
      this.options = [...this.options, ...data.data];
      this.options.shift();
      this.pid = this.options[0].pid;
      this.chooseProject();
    },
    //照片账号类型查询
    getType1() {
      this.$store.commit("datum/initUserType", this.typeValue);
      this.$store.commit("datum/photoPage", 1);
      this.photoByTypeAsync().then((val) => {
        this.flashData();
      });
    },
    // 根据时间查询
    async findTime() {
      if (this.photoDate !== null) {
        let photoStartTime = this.photoDate[0];
        let photoEndTime = this.photoDate[1];
        this.$store.commit("datum/initPhotoStartTime", photoStartTime);
        this.$store.commit("datum/initPhotoEndTime", photoEndTime);
        this.photoByTimeAsync().then((val) => {
          this.flashData();
        });
      }
      // else if (this.photoDate == null) {
      //   ("null来了");
      //   this.$store.commit("datum/photoPage", 1);
      //   this.$store.commit("datum/initPhotoStartTime", null);
      //   this.$store.commit("datum/initPhotoEndTime", null );

      //   this.photoByTimeAsync().then(val => {
      //     this.flashData();
      //   });
      // }
    },
    //视频账号类型查询
    videoType() {
      this.$store.commit("datum/initUserType2", this.videoValue);
      this.$store.commit("datum/videoPage", 1);
      this.videoByTypeAsync().then((val) => {
        this.flashData();
      });
    },
    //照片分页
    photoPage(val) {
      this.$store.commit("datum/photoPage", val);
      this.photoByTypeAsync().then((val) => {
        this.flashData();
      });
    },
    //视频分页
    videoPage(val) {
      this.$store.commit("datum/videoPage", val);
      this.videoByTypeAsync().then((val) => {
        this.flashData();
      });
    },
    //修改状态
    changeStatus(row, column) {
      switch (row.userType) {
        case 1:
          return "调度员";
          break;
        case 2:
          return "终端";
          break;
      }
    },
    //照片查询
    photoQuery() {
      //按时间段
      let photoStartTime = this.photoDate[0];
      let photoEndTime = this.photoDate[1];
      this.$store.commit("datum/initPhotoStartTime", photoStartTime);
      this.$store.commit("datum/initPhotoEndTime", photoEndTime);
      this.photoByTimeAsync().then((val) => {
        this.flashData();
      });
      this.photoDate = "";
      //检索
      // ("检索条件", this.photoSearch);
      this.photoContext = this.photoContext.trim();
      if (this.photoSearch == "文件名") {
        let fileName = this.photoContext;
        this.$store.commit("datum/initPhotoFileName", fileName);
        this.photoByNameAsync().then((val) => {
          this.flashData();
        });
        // this.photoSearchOption = "";
        // this.photoContext = "";
      } else if (this.photoSearch == "上传人姓名") {
        let uploader = this.photoContext;
        this.$store.commit("datum/initPhotoUploader", uploader);
        this.photoByUploadAsync().then((val) => {
          this.flashData();
        });
        // this.photoSearchOption = "";
        // this.photoContext = "";
      } else if (this.photoSearch == "上传人账号") {
        let account = this.photoContext;
        this.$store.commit("datum/initPhotoAccount", account);
        this.photoByAccountAsync().then((val) => {
          this.flashData();
        });
        // this.photoSearchOption = "";
        // this.photoContext = "";
      }
    },
    // 视频时间查询
    findvidEvent() {
      let videoStartTime = this.videoDate[0];
      let videoEndTime = this.videoDate[1];
      this.$store.commit("datum/initVideoStartTime", videoStartTime);
      this.$store.commit("datum/initVideoEndTime", videoEndTime);
      this.videoByTimeAsync().then((val) => {
        this.flashData();
      });
    },
    //视频查询
    videoQuery() {
      //按时间段
      let videoStartTime = this.videoDate[0];
      let videoEndTime = this.videoDate[1];
      this.$store.commit("datum/initVideoStartTime", videoStartTime);
      this.$store.commit("datum/initVideoEndTime", videoEndTime);
      this.videoByTimeAsync().then((val) => {
        this.flashData();
      });
      this.videoDate = "";
      //检索
      this.videoContext = this.videoContext.trim();
      if (this.videoSearch == "文件名") {
        let fileName = this.videoContext;
        this.$store.commit("datum/initVideoFileName", fileName);
        this.videoByNameAsync().then((val) => {
          this.flashData();
        });
        // this.videoSearchOption = "";
        // this.videoContext = "";
      } else if (this.videoSearch == "上传人姓名") {
        let uploader = this.videoContext;
        this.$store.commit("datum/initVideoUploader", uploader);
        this.videoByUploadAsync().then((val) => {
          this.flashData();
        });
        // this.videoSearchOption = "";
        // this.videoContext = "";
      } else if (this.videoSearch == "上传人账号") {
        let account = this.videoContext;
        this.$store.commit("datum/initVideoAccount", account);
        this.videoByAccountAsync().then((val) => {
          this.flashData();
        });
        // this.videoSearchOption = "";
        // this.videoContext = "";
      }
    },
    //修改名称
    async updateName() {
      let id = this.changeId;
      let newName = this.changeName;
      const data = await this.updateNameAsync({
        fid: id,
        fileName: newName,
      });
      if (data.code == 200) {
        this.photoByTypeAsync().then((val) => {
          this.videoByTypeAsync().then((val) => {
            this.flashData();
          });
        });

        this.$message("修改成功");
      } else {
        this.$message("修改失败");
      }
    },
    //删除
    async deleteFile() {
      // let id = this.str;
      // ("删除数据", this.deleteId);
      // (id.length);

      // if (this.multipleSelection.length == 0) {
      //   this.$message("请选择需要删除项");
      // } else if (this.multipleSelection.length > 1) {
      //   this.$message("一次只能删除一项");
      // } else if (this.multipleSelection.length == 1) {
      //   // await this.deleteItemAsync({
      //   //   fid: this.deleteId
      //   // });

      //   this.fiddELEdata.fid = this.deleteId;
      //   ("删除数据", this.fiddELEdata);

      //   const { data: res } = await this.$http.post("file/deleteFile", {
      //     params: this.fiddELEdata
      //   });
      //   ("删除结果", res);

      //   if (res.code !== 200) {
      //     return this.$message(res.message);
      //   }
      //   this.$message("删除成功");
      //   this.$store.commit("datum/photoPage", 1);
      //   this.videoByTypeAsync().then(val => {
      //     this.photoByTypeAsync().then(val => {
      //       this.flashData();
      //     });
      //   });
      // }
      if (this.multipleSelection.length == 0) {
        this.$message("请选择删除项");
      } else if (this.multipleSelection.length > 0) {
        let str = [];
        let fid = "";
        for (let i = 0; i < this.multipleSelection.length; i++) {
          str.push(this.multipleSelection[i].fid);
        }
        fid = str.join(",");
        this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        })
          .then(async () => {
            let id = { fids: fid };
            const { data: res } = await this.$http.post(
              "file/deleteFiles",
              qs.stringify(id)
            );
            if (res.code !== 200) {
              return this.$message(res.message);
            }
            this.$message("删除成功");
            this.$store.commit("datum/photoPage", 1);
            this.videoByTypeAsync().then((val) => {
              this.photoByTypeAsync().then((val) => {
                this.flashData();
              });
            });
          })
          .catch(() => {
            this.$message({
              type: "info",
              message: "已取消删除",
            });
          });
      }
    },
    // 导出数据/视频照片
    async exportPhotos() {
      const arr = [];
      for (let i = 0; i < this.multipleSelection.length; i++) {
        arr.push(this.multipleSelection[i].fid);
      }
      this.FID.fileIds = JSON.stringify(arr);
      const { data: res } = await this.$http.post(
        "file/exportImg",
        this.$qs.stringify(this.FID),
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
      link.setAttribute("download", "照片_" + num + ".xls");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    },
    async exportVID() {
      const arr = [];
      for (let i = 0; i < this.multipleSelection.length; i++) {
        arr.push(this.multipleSelection[i].fid);
      }
      this.FID.fileIds = JSON.stringify(arr);
      const { data: res } = await this.$http.post(
        "file/exportVideo",
        this.$qs.stringify(this.FID),
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
      link.setAttribute("download", "视频_" + num + ".xlsx");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    },
    // 下载照片
    downloadEvent() {},
    async download(row) {
      let dataArr = {
        fid: row.fid,
      };
      // const { data: res } = await this.$http.get(
      //   "file/download",
      //   { params: dataArr }
      //   // { responseType: "blob" }
      // );
      // ("下载数据", res);
      // if (res.code !== 200) {
      //   this.$message.error(res.message);
      // }

      let a = document.createElement("a");
      a.href = this.$src + "file/download?fid=" + row.fid;
      a.click();
    },
    // http://localhost:8083/file/download?fid=19
    toExport(id) {
      var url2 = this.$src + "/file/download?fid" + id;
      // window.location.href = url2;
      window.open(url2);
    },
    // 下载视频
    async downloadvid(row) {
      let dataArr = {
        fid: row.fid,
      };
      let a = document.createElement("a");
      a.href = this.$src + "file/download?fid=" + row.fid;
      a.click();

      // const { data: res } = await this.$http.get(
      //   "file/download",
      //   { params: dataArr },
      //   { responseType: "blob" }
      //   // {
      //   //   "Content-Type": "application/x-www-form-urlencoded"
      //   // },
      //   // { responseType: "arraybuffer" }
      // );
      // ("下载数据", res);
      // if (res.code !== 200) {
      //   return this.$message.error(res.message);
      // }
      // // if (res.code == 200) {
      // // let url = window.URL.createObjectURL(
      // //   new Blob([res], { type: "image/jpeg" })
      // // );
      // let url = window.URL.createObjectURL(
      //   new Blob([res], { type: "multipart/form-data" })
      // );
      // let link = document.createElement("a");
      // link.style.display = "none";
      // ("3");
      // link.href = url;
      // // ("link.download", link.download(".jpg"));
      // // link.download = ".jpg";
      // ("4");
      // // link.setAttribute("download", ".jpg");
      // link.setAttribute("download", "视频.jpg");
      // document.body.appendChild(link);
      // ("5");
      // link.click();
      // // if (res.code !== 200) {
      // //   this.$message.error(res.message);
      // // }

      // // }
      // // this.toExport(row.fid);
    },

    // 跳转到定位页面
    async viewAction(row) {
      let dwdata = {
        userName: row.uploadByAccount,
        type: row.userType,
      };
      // ("查询在线否", dwdata);
      // const { data: res } = await this.$http.post(
      //   "contact/findContactDetailByUserName",
      //   qs.stringify(dwdata)
      // );
      // ("res", res);

      let account = row.uploadByAccount;
      const data = await this.getLocationAsync(account);
      if (data.code == 200) {
        // 实现路由跳转打开新标签页
        sessionStorage.locationData = JSON.stringify(data.data);
        const { href } = this.$router.resolve({
          path: "/viewlocation",
        });
        window.open(href, "_blank");
      } else {
        this.$message("无法获取定位信息，请联系调度员或终端");
      }
    },
  },
};
</script>

<style lang="less" scoped>
.el-card {
  margin: 10px 0 10px 0;
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.15);
  .el-card__header {
    border-bottom: 0;
  }
  .clearfix {
    .el-form {
      float: right;
    }
  }
  .xa {
    span {
      font-size: 18px;
      margin-right: 20px;
    }
    .jsSpan {
      margin-left: 40px;
    }
    .jsSele {
      width: 100px;
    }
    .el-input {
      width: 250px;
    }
    .el-button {
      margin-left: 20px;
      background-color: #1596ff;
      color: #fff;
    }
    .addS {
      float: right;
      // margin-left: 20px;
    }
  }
}
</style>
<style scoped>
.imagesurl {
  width: 100%;
  /*height: 100%;*/
}
.videosurl {
  width: 100%;
  /*height: 100%;*/
}
</style>

// 功能页面
<template>
  <div id="talkback" v-show="talkCss && this.roleList.indexOf(3) > -1 && this.roleList.indexOf(4) > -1" :class="[shrinkBtnNum == false? 'talkbackminiwrap':'']" @mousedown="move($event)">
    <!-- 对讲对话 -->
    <div :class="['talk',shrinkBtnNum == false? 'talkbtn':'']" v-show="hasTalkback">
      <audio id="audioStreamtalk" controls="controls" autoplay="autoplay" style="width: 0;height: 0;display:none;"></audio>
      <el-form ref="formss" :model="formss" style="margin-top:5px;margin-left:10px;" v-show="shrinkBtnNum">
        <el-row :gutter="10">
          <el-col :span="13">
            <el-form-item>
              <el-select v-model="formss.region" placeholder="对讲组名称" @change="changeTalk">
                <el-option v-for="(item, index) in regionList" :key="index" :label="item.name" :value="item.id"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="9">
            <el-form-item>
              <el-select v-model="formss.userIndex" placeholder="查看成员" @change="changeUser()">
                <el-option v-for="(item, index) in userlist" :key="index" :label="item.fullName" :value="index"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div class="info">
        <p v-show="shrinkBtnNum && TalkBackinfo">来自【{{talkBackUser}}】的实时对讲</p>
        <!-- 发送人 -->
        <p v-show="shrinkBtnNum && startTalkBack">{{talkbackTime}}</p>
        <!-- 时间 -->
      </div>
      <!-- talk-bunmini -->
      <div :class="['talk-bun',shrinkBtnNum == false? 'talk-bunmini':'']">
        <img src="../assets/images/2032.png" alt class="imgOne" @click="VoiceSwitch" v-if="voiceData == true" v-show="shrinkBtnNum"/>
        <img src="../assets/images/2033.png" alt class="imgOne" @click="VoiceSwitch" v-else v-show="shrinkBtnNum"/>
        <img v-show="shrinkBtnNum" class="talk-img" src="../assets/images/u3888.png" alt />
        <span class="talk-text" v-show="shrinkBtnNum" @click="chengestartend">{{talkBackText}}</span>
        <span :class="['talk-btn',startEnd == true?'':'talk-btnT']" @click="chengestartend" v-show="shrinkBtnNum"></span>
        <div :class="['talk-dian',startEnd == true?'':'talk-dianT']" v-show="shrinkBtnNum"></div>
        <div :class="['shrink',shrinkBtnNum == false? 'shrinkmini':'']" @click="shrinkBtn">
          <img :class="[shrinkBtnNum == false? 'shrinkimgmini':'shrinkimg']" src="../assets/images/20631.png" alt/>
        </div>
        <img v-show="!shrinkBtnNum" class="miniImg" src="../assets/images/20632.png" alt />
      </div>
    </div>
    <el-dialog title="成员信息" :visible.sync="MemberDialogVisible" width="30%">
      <!-- 主体信息区 -->
      <el-form class="findDetliatRef" ref="findDetliatRef" :model="findDetliat" label-width="120px" style="width:90%">
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
            <img src="../assets/images/2018.png" alt />
            <p>语音电话</p>
          </li>
          <li @click="videoTelephone(3)" v-if="hasVideo">
            <img src="../assets/images/2019.png" alt />
            <p>视频电话</p>
          </li>
          <!-- <li @click="VoiceBroadcast">
            <img src="../assets/images/2020.png" alt />
            <p>语音广播</p>
          </li>-->
          <!-- <li @click="viewLocation">
            <img src="../assets/images/2042.png" alt />
            <p>定位</p>
          </li>-->
          <!-- <li
            @click="getTraJecJory"
            v-show="this.findDetliat.userType == '终端用户'"
            v-if="hasTrail"
          >
            <img src="../assets/images/2021.png" alt />
            <p>轨迹</p>
          </li>-->
          <!-- getDetection -->
          <li
            @click="videoTelephone(5)"
            v-show="this.findDetliat.userType == '终端用户'"
            v-if="hasListener"
          >
            <img src="../assets/images/2022.png" alt />
            <p>无声侦护</p>
          </li>
        </ul>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import RSfun from "../assets/js/record.js";
var RS = RSfun();
import qs from "qs";
import { createNamespacedHelpers } from "vuex";
const { mapState, mapActions } = createNamespacedHelpers("talk");
export default {
  name: "my-talkBack",
  data() {
    return {
      shrinkBtnNum: true, // 对讲框点击放大缩小
      // 对讲组表单数据
      formss: {
        name: "",
        region: "",
        userIndex: "",
      },
      // regionList: [],
      userlist: [],
      startEnd: true, //开始讲话判断
      voiceData: true, // 对讲组声音开关数据
      hasTalkback: false,
      talkCss: false,
      audioStream: new FormData(),
      startTalkBack: false,
      TalkBackinfo: false,
      talkbackTime: "00:00",
      talkBackUser: "",
      talkBackText: "点击说话",
      minute: 0,
      second: 0,
      minuteString: "",
      secondString: "",
      int: "",
      audioUrlList: [],
      talkBackUserList: [],
      roleList: [],
      positionX: 0,
      positionY: 0,
      movetalkback: 0, //移动的是大窗口还是小窗口，0是大，1是小
      sendTime: 0, //计时发送时间小于1秒，提示时间太短
      intSend: "",
      // 成员信息弹框
      MemberDialogVisible: false,
      // 查询用户详细信息绑定数据
      findDetliat: {},
      hasListener: true,
      hasCall: true,
      hasVideo: true,
      multipleSelection: [],
    };
  },
  mounted() {
    this.getTalkBack();
    window.addEventListener("talkbackProjectId", this.initTalkback);
    window.addEventListener("onTalkbackClose", this.closeTalkback);
    if (localStorage.roleData) {
      let arr = localStorage.roleData.split(",");
      arr = arr.map(Number);
      // arr = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13];
      // const arr = JSON.parse(sessionStorage.roleData);
      this.roleList = arr;
    }
    if (localStorage.getItem("initTalkback") == "true") {
      this.talkCss = true;
    }
    if (localStorage.getItem("ProjectIdtalkback")) {
      var id = localStorage.getItem("ProjectIdtalkback");
      let data = {
        detail: {
          projectId: id,
        },
      };
      this.initTalkback(data);
    }
    let that = this;
    window.addEventListener("onTalkbackShow", function (e) {
      let arr = localStorage.roleData.split(",");
      arr = arr.map(Number);
      // arr = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13];
      // const arr = JSON.parse(sessionStorage.roleData);
      that.roleList = arr;
      if (e.detail.status == 1) {
        that.talkCss = true;
      }
    });
    window.addEventListener("getTalkbackShow", this.getTalkBack);
    // 监听播放对讲
    window.addEventListener("playTalkBack", this.palyTalkBack);
    // 音频播放完毕S
    var audio = document.getElementById("audioStreamtalk");
    audio.loop = false;
    audio.addEventListener("ended", this.endTalkBack, false);

    // 监听切换对讲组S
    window.addEventListener("sendTalkBack", function (e) {
      that.formss.region = e.detail.gid;
      that.getTalkBackUserList(e.detail.gid);
    });
  },
  computed: {
     ...mapState(["GroupList"]),
    regionList(){

      if (this.GroupList) {
        this.GroupList.forEach((element) => {
          if (element.isActivate == 1) {
            this.formss.region = element.id;
            this.getTalkBackUserList(element.id);
          }
        });
        return this.GroupList
      }
    }
  },
  methods: {
    ...mapActions(["getGroupIdAsync"]),
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
    //功能配置——语音电话
    getCall() {
      let isCall = JSON.parse(sessionStorage.getItem("configIsCall"));
      // (isCall,"语音电话");
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
    // 触发语音电话栏
    VoiceTelephone() {
      window.dispatchEvent(
        new CustomEvent("onSendCloseMessage", {
          detail: {
            eventName: "voiceConversationEnd",
          },
        })
      );
      window.dispatchEvent(
        new CustomEvent("inviteAudio", {
          detail: {
            id: 1,
            // iscalling: true,
            userinfor: JSON.parse(localStorage.getItem("user")),
            targetType: this.multipleSelection[0].type == "1" ? "d" : "z",
            type: this.multipleSelection[0].type == "1" ? "d2d" : "d2z",
            multipleSelection: this.multipleSelection,
          },
        })
      );
    },
    // 视频通话栏
    videoTelephone(i) {
      if (i == 3) {
        window.dispatchEvent(
          new CustomEvent("onSendCloseMessage", {
            detail: {
              eventName: "videoConversationEnd",
            },
          })
        );
        window.dispatchEvent(
          new CustomEvent("inviteVideo", {
            detail: {
              id: i,
              // iscalling: true,
              userinfor: JSON.parse(localStorage.getItem("user")),
              targetType: this.multipleSelection[0].type == "1" ? "d" : "z",
              type: this.multipleSelection[0].type == "1" ? "d2d" : "d2z",
              multipleSelection: this.multipleSelection,
            },
          })
        );
      } else {
        window.dispatchEvent(
          new CustomEvent("onSendCloseMessage", {
            detail: {
              eventName: "videoMoreConversationEnd",
            },
          })
        );
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
    },
    // 初始化对讲组
    async initTalkback(e) {
      let pid = {
        pageSize: 999,
        pageNum: 1,
        projectId: e.detail.projectId,
      };
      this.getGroupIdAsync({params: pid})
      // let data = await this.$http.get("/talkBack/findTalkBack", {
      //   params: pid,
      // });
      // this.regionlist = data.data.data.list;

      // let tb = document.getElementById('talkback')
    },
    // 关闭对讲组
    closeTalkback() {
      this.talkCss = false;
    },
    // 对讲组声音开关数据
    VoiceSwitch() {
      this.voiceData = !this.voiceData;
      if (!this.voiceData) {
        document.getElementById("audioStreamtalk").muted = true;
      } else {
        document.getElementById("audioStreamtalk").muted = false;
      }
    },
    // 对讲组点阿基成员信息弹框
    viewMemData() {
      //之后需要做判断
      // this.DispatcherDialogVisible = true;
      // this.MemberDialogVisible = true;
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

      }
    },
    createStreamSuccess(stream) {
      this.audioMediaStream = stream;
      RS.mediaStream = stream;
      RS.startRecord();
    },
    createStreamError(error) {

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
        (new Error("WebRTC is not yet supported in this browser."));
      }
    },
    //对讲开始结束
    async chengestartend() {
      this.startTalkBack = !this.startTalkBack;
      if (!this.startTalkBack) {
        //结束
        this.talkBackText = "点击说话";
        clearInterval(this.int);
        this.minute = 0;
        this.second = 0;
        this.minuteString = "";
        this.secondString = "";
        this.int = null;
        this.talkbackTime = "00:00";
      } else {
        //开始
        var that = this;
        that.talkbackTime = "00:00";
        this.int = setInterval(function () {
          that.second = that.second + 1;
          if (that.second > 59) {
            that.minute = that.minute + 1;
            that.second = 0;
            if( that.minute == 1 && that.second == 0){
                // that.talkBackText = "点击说话";
                // that.startEnd = !that.startEnd;
                // that.startTalkBack = !that.startTalkBack;
                // that.minute = 0;
                // that.second = 0;
                // that.minuteString = "";
                // that.secondString = "";
                // clearInterval(that.int);
                // that.int = null;
            }
          } else {
            if (that.second < 10) {
              that.secondString = "0" + that.second;
            } else {
              that.secondString = that.second;
            }
            if (that.minute < 10) {
              that.minuteString = "0" + that.minute;
            } else {
              that.minuteString = that.minute;
            }
          }
          that.talkbackTime = that.minuteString + ":" + that.secondString;
        }, 1000);
        this.talkBackText = "点击结束";

      }
      this.startEnd = !this.startEnd;

      if (this.startEnd == false) {
        var that = this;
        // 开始录音
        this.gotMedia();
        this.intSend = setInterval(function () {
          that.sendTime = that.sendTime + 1;
        }, 1000);
      } else {

        clearInterval(this.intSend);
        this.intSend = null;

        if (this.sendTime > 1) {
          this.sendTime = 0;
          // setTimeout( async () => {
          RS.stopRecord();

          // audio.src = RS.url;
          const blob = await fetch(RS.url).then((r) => r.blob());
          const name = new Date().getTime();
          const file = new File([blob], name + ".wav", { type: blob.type });
          this.audioStream.delete("file");
          this.audioStream.append("file", file);
          this.audioStream.append("type", 1);

          var url = await this.$http.post(
            "/broadcast/uploadVoiceFile",
            this.audioStream
          );
          // url.data     fullName

          var username = JSON.parse(localStorage.getItem("user"));
          if (url.data.code == 200) {
            let that = this;

            window.dispatchEvent(
              new CustomEvent("onSendRecord", {
                detail: {
                  id: 1,
                  user: username.username,
                  content: url.data.message,
                  type: "intercom",
                  groupId: that.formss.region,
                },
              })
            );
            this.$message.success("发送成功");
          }

          // }, 500);
        } else {
          this.sendTime = 0;
          this.$message.error("时间太短");
        }
        if (this.audioMediaStream !== null) {
          this.audioMediaStream.getTracks()[0].stop();
        }
        // audioStream
        this.audioMediaStream = null;
      }
    },
    // 对讲框点击放大缩小
    shrinkBtn() {
      this.shrinkBtnNum = !this.shrinkBtnNum;
      var talkbackDom = document.getElementById("talkback");
      // if (this.positionY != "" && this.positionx != "") {
      //   if (!this.shrinkBtnNum) {
      //     // if (this.movetalkback == 0) {
      //     talkbackDom.style.cssText =
      //       "left:" +
      //       (this.positionY + 230) +
      //       "px;top:" +
      //       (this.positionX + 150) +
      //       "px;";
      //     // } else {
      //     //   talkbackDom.style.cssText = 'left:' + (this.positionY - 230)+ 'px;top:' + (this.positionX - 150) + 'px;'
      //     // }
      //   } else {
      //     // if (this.movetalkback == 0) {
      //     talkbackDom.style.cssText =
      //       "left:" + this.positionY + "px;top:" + this.positionX + "px;";
      //     // } else {
      //     //   talkbackDom.style.cssText = 'left:' + (this.positionY - 230)+ 'px;top:' + (this.positionX - 150) + 'px;'
      //     // }
      //   }
      // }
    },
    //功能配置(对讲组)
    getTalkBack() {
      let talkback = JSON.parse(sessionStorage.getItem("configTalkback"));
      if (talkback == 0) {
        this.hasTalkback = true;
      } else if (talkback == 1) {
        this.hasTalkback = false;
      }
    },
    // 鼠标位移
    move(e) {
      // if (this.shrinkBtnNum) {
      //   this.movetalkback = 0;
      // } else {
      //   this.movetalkback = 1;
      // }
      let odiv = e.currentTarget; //获取目标元素
      //算出鼠标相对元素的位置
      // document.documentElement.clientWidth
      // let disX = e.clientX - odiv.offsetLeft;
      // let disY = e.clientY - odiv.offsetTop;
      let disX = odiv.clientWidth - (e.clientX - odiv.offsetLeft);
      let disY = odiv.clientHeight - (e.clientY - odiv.offsetTop);
      document.onmousemove = (e) => {
        //鼠标按下并移动的事件
        //用鼠标的位置减去鼠标相对元素的位置，得到元素的位置
        let right = document.documentElement.clientWidth - e.clientX - disX;
        let bottom = document.documentElement.clientHeight - e.clientY - disY;
        //绑定元素位置到positionX和positionY上面
        // this.positionX = top;
        // this.positionY = left;
        this.positionX = right;
        this.positionY = bottom;
        //移动当前元素
        // odiv.style.left = left + "px";
        // odiv.style.top = top + "px";
        odiv.style.right = right + "px";
        odiv.style.bottom = bottom + "px";
      };
      document.onmouseup = (e) => {
        document.onmousemove = null;
        document.onmouseup = null;
      };
    }, // 鼠标位移end
    // 查询对讲组下的成员
    async getTalkBackUserList(id) {
      let gid = {
        groupId: id,
      };
      const { data: res } = await this.$http.get("/talkBack/findTalkBackMemBer", {params: gid});
      this.userlist = res.data;
    },
    async changeTalk() {
      let gid = {
        groupId: this.formss.region,
      };
      const { data: res } = await this.$http.get("/talkBack/findTalkBackMemBer", {params: gid,});
      this.userlist = res.data;
      let id = this.formss.region;
      var Pages = {
        name: "",
        isRecording: "", //是否记录对讲{1:开;0：关}
        pageSize: 5,
        pageNum: 1,
        groupId: id, //切换激活状态参数
        projectId: "",
      };

      const { data: res2 } = await this.$http.get(
        "talkBack/switchActivateStatus",
        {
          params: Pages,
        }
      );
      if (res2.code !== 200) {
        this.$message.error("切换状态失败");
      } else {
        this.$message.success("切换状态成功");
      }
      window.dispatchEvent(
        new CustomEvent("onTalkBack2", {
          detail: {
            gid: id,
          },
        })
      );
    },
    // 选择打开成员信息弹框
    async changeUser() {
      let index = this.formss.userIndex;
      let user = this.userlist[index];
      this.multipleSelection = [];
      this.multipleSelection.push(user);
      let params = {
        type: user.type,
        clientId: user.id,
      };
      const { data: res } = await this.$http.post("contact/findContactDetail", qs.stringify(params));
      this.findDetliat = res.data;
      if (this.findDetliat.userType == 1) {
        this.findDetliat.userType = "调度员";
      } else if (this.findDetliat.userType == 2) {
        this.findDetliat.userType = "终端用户";
      }
      this.MemberDialogVisible = true;
    },
    // 播放接收到的对讲
    palyTalkBack(e) {
      this.TalkBackinfo = true;
      // this.talkBackUser = e.detail.realName;
      var audio = document.getElementById("audioStreamtalk");

      //地址转换
      var mess = e.detail.url;
      let index = mess.indexOf("safety-hat");
      var messSub = mess.substring(index);
      if (window.location.protocol == "https:") {
        var Mess =
          window.location.protocol +
          "//" +
          window.location.hostname +
          "/" +
          messSub;
      } else {
        //内网， 加端口
        var Mess =
          window.location.protocol +
          "//" +
          // + "118.190.38.198"
          window.location.hostname +
          ":" +
          window.location.port +
          "/" +
          messSub;
      }

      this.audioUrlList.push(Mess);
      this.talkBackUserList.push(e.detail.realName);
      if (this.audioUrlList.length <= 1) {
        audio.src = this.audioUrlList[0];
        this.talkBackUser = this.talkBackUserList[0];
      }

      // audio.play();
    },
    endTalkBack() {
      // this.TalkBackinfo = false;
      // this.talkBackUser = '';
      var audio = document.getElementById("audioStreamtalk");
      // audio.src = null;
      this.audioUrlList.shift();
      this.talkBackUserList.shift();
      if (this.audioUrlList.length > 0) {
        audio.src = this.audioUrlList[0];
        this.talkBackUser = this.talkBackUserList[0];
      } else {
        this.talkBackUser = "";
        this.TalkBackinfo = false;
      }
    },
  },
};
</script>

<style lang="less">
#talkback {
  .el-dialog__wrapper {
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
  }
}
</style>

<style lang="less" scoped>
#talkback {
  width: 280px;
  height: 200px;
  position: absolute;
  bottom: 5%;
  right: 5%;
}
.talkbackactive {
  display: none;
}
.talkbackminiwrap {
  width: 50px !important;
  height: 50px !important;
}
#talkback .talk {
  position: absolute;
  bottom: 0;
  right: 0;
  width: 280px;
  padding-top: 10px;
  // height: 200px;
  // border: 1px solid black;
  box-shadow: 0px 3px 10px rgba(81, 81, 81, 0.16);
  background-color: white;
  box-sizing: border-box;
  cursor: pointer;
  border-radius: 8px;
  z-index: 999;
}
#talkback .talkbtn {
  width: 50px;
  height: 50px;
}
#talkback .talk .el-form-item {
  margin-bottom: 0;
}
#talkback .talk .el-form {
  margin-bottom: 5px;
}
#talkback .info {
  // border: 1px solid red;
  height: 40px;
}
#talkback .talk p {
  text-align: center;
  // display: inline-block;
  /* width: 100%; */
  // margin-left: 112px;
  font-size: 15px;
  color: skyblue;
  margin-top: 0;
  margin-bottom: 0;
}
#talkback .talk .talk-bun {
  height: 100px;
  position: relative;
}

#talkback .talk .miniImg {
  width: 22px;
  height: 20px;
  margin-top: 10px;
  margin-left: 6px;
}

#talkback .talk .talk-bunmini {
  height: 100% !important;
  width: 100% !important;
  position: absolute !important;
  top: 0;
  left: 0;
}
#talkback .talk .talk-bun .imgOne {
  margin-top: 20px;
  margin-left: 10px;
}
#talkback .talk .talk-bun .talk-img {
  position: absolute;
  width: 20px;
  height: 29px;
  margin-left: 72px;
  margin-top: 19px;
  text-align: center;
  color: white;
}
#talkback .talk .talk-bun .talk-text {
  position: absolute;
  margin-left: 58px;
  margin-top: 53px;
  text-align: center;
  color: white;
  font-size: 12px;
}
#talkback .talk .talk-bun .talk-btn {
  width: 75px;
  height: 75px;
  border-radius: 50%;
  background: linear-gradient(
    180deg,
    rgba(24, 231, 255, 1) 0%,
    rgba(27, 112, 248, 1) 100%
  );
  display: inline-block;
  margin-left: 45px;
  font-size: 14px;
  margin-top: 10px;
}
#talkback .talk .talk-bun .talk-btnT {
  // background-color: red;
  background: linear-gradient(
    180deg,
    rgb(255, 165, 138) 0%,
    rgb(248, 27, 27) 100%
  );
}
#talkback .talk .talk-bun .talk-btn .sp {
  margin-left: 0;
}
#talkback .talk .talk-bun .talk-dian {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: green;
  display: inline-block;
  margin-left: 10px;
  margin-bottom: 60px;
}
#talkback .talk .talk-bun .talk-dianT {
  background-color: #909399;
}
#talkback .talk .talk-bun .shrink {
  width: 30px;
  height: 30px;
  position: absolute;
  bottom: 0;
  right: 0;
}
#talkback .talk .talk-bun .shrinkmini {
  width: 30px;
  height: 30px;
  // margin-left: 28px;
  // margin-bottom: -18px;
}
#talkback .talk .talk-bun .shrinkimg {
  width: 35px;
  height: 35px;
  position: absolute;
  top: -5px;
  left: -5px;
  display: inline-block;
}
#talkback .talk .talk-bun .shrinkimgmini {
  width: 19px;
  height: 19px;
  position: absolute;
  top: 11px;
  left: 11px;
  display: inline-block;
  transform: rotate(-90deg);
  -ms-transform: rotate(-90deg); /* IE 9 */
  -moz-transform: rotate(-90deg); /* Firefox */
  -webkit-transform: rotate(-90deg); /* Safari 和 Chrome */
  -o-transform: rotate(-90deg);
}
</style>


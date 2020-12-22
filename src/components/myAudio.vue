// 语言通话页面
<template>
  <div id="audioWrap">
    <div id="audioMAP" @mousedown="moveVideo">
      <!-- 视频通话-通话中-窗口 -->
      <template>
        <el-card class="box-card box-card-audio-one box-card-two">
          <div slot="header" class="clearfix">
            <span class="sptitle">1v1语音</span>
            <span class="calltime"> 正在通话： {{ audioTime }}</span>
            <el-button style="margin-left: 16%" type="danger" @click="CloseCell">挂断</el-button>
            <el-button style="" type="success" @click="miniMize">最小化</el-button>
          </div>
          <div class="mainleftaudio">
            <div class="icones-left">
              <div style="textalign: center; fontsize: 18px; margintop: 80px">
                <img style="width: 40px; height: 40px"  src="../assets/images/2005@2x.png"  alt="" />
                <div>{{ audioUser }}</div>
              </div>
              <div
                id="videosaudio"
                style=" width: 90%;height: 100%;position: absolute;top: 60px;left: 0;"></div>
            </div>

            <div class="meVideo" v-if="extendVideoData == false">
              <span></span>
              <video
                id="meaudio"
                autoplay
                style="width: 200px; height: 266px"
              ></video>
            </div>

            <div
              class="record"
              :class="isRecord ? 'recordactive' : ''"
              @click="record"
            >
              <span v-if="!isRecord" class="startrecord">录 音</span>
              <span v-if="isRecord" class="endrecord"></span>
            </div>
          </div>
        </el-card>
      </template>
      <!-- 视频会议-呼叫通话中-窗口 -->
      <el-card class="box-card box-card-audio-three box-card-two">
        <div slot="header" class="clearfix">
          <span class="sptitle">语音会议</span>
          <span class="calltime" style="margin-left: 20px">
            正在通话： {{ audioTime }}</span
          >
          <el-button
            style="float: right; margin-right: 15px"
            type="danger"
            @click="CloseCell"
            >结束会议</el-button
          >
          <el-button
            style="float: right; margin-right: 15px"
            type="success"
            @click="miniMize"
            >最小化</el-button
          >
          <el-button
            style="float: right; margin-right: 15px"
            type="info"
            :disabled="isInvited"
            @click="addUser"
            >添加成员</el-button
          >
          <!-- <el-button style="float: right;margin-right:10px;" size="medium" @click="addCallvideo">添加成员</el-button> -->
        </div>
        <div class="mainleftaudioMore">
          <div id="videosaudioMore" @click="isMuteImgfun">
            <!-- <img v-show="isMuteImg" src="../assets/images/u3888.png" alt="">
                <img v-show="!isMuteImg" src="../assets/images/u3889.png" alt=""> -->
            <video
              id="meaudioMore"
              autoplay
              style="width: 0px; height: 0px"
            ></video>
          </div>
          <!-- <div class="otheraudioid">
                <img style="width:30px;height:30px;" src="../assets/images/2005@2x.png" alt="">
                <span>username</span>
              </div> -->
        </div>
      </el-card>
    </div>
    <!-- 添加成员 -->
    <el-dialog
      :visible.sync="DetectionDrawer"
      width="60%"
      center
      :modal="false"
      title="添加成员"
    >
      <el-table
        style="width: 100%"
        @selection-change="handleSelectionChange"
        :data="multipleSelectionZ"
        height="400"
      >
        <el-table-column
          type="selection"
          :selectable="selectEnable"
        ></el-table-column>
        <el-table-column label="在线状态">
          <template slot-scope="scope">
            <span class="yuan" v-if="scope.row.status != 0"></span>
            <span class="yuan , hui" v-else></span>
          </template>
        </el-table-column>
        <!-- <el-table-column label="账号类型">
        <span>终端用户</span>
      </el-table-column> -->
        <el-table-column label="姓名" prop="fullName"></el-table-column>
        <el-table-column label="工种名称" prop="workName"></el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button @click="DetectionDrawer = false">取 消</el-button>
        <el-button type="warning" @click="addUserSend">确 定</el-button>
      </span>
    </el-dialog>
    <div id="minAudio" @mousedown="moveVideo">
      <el-card class="minCard">
        <span class="sptitle">语音中。。。</span>
        <el-button
          style="float: right; margin-right: 15px"
          type="danger"
          @click="CloseCell"
          >挂断</el-button
        >
        <el-button
          style="float: right; margin-right: 15px"
          type="success"
          @click="maxMization"
          >最大化</el-button
        >
      </el-card>
    </div>
  </div>
</template>

<script>
import qs from "qs";
import SkyRTC from "../assets/js/SkyRTC-client.js";
var rtc = SkyRTC();
import RSfun from "../assets/js/record.js";
var RS = RSfun();

import audioImg from "../assets/images/2005@2x.png";
import MuteImg from "../assets/images/ismute2.png";
import MuteImg2 from "../assets/images/ismute3.png";

export default {
  name: "my-audio",
  data() {
    return {
      message: "",
      viewId: 0, //判断传过来的id是多少就显示什么弹框；
      positionX: 0, //鼠标位移地址
      positionY: 0,
      cellphone: true, //通话框显示
      extendVideoData: false, //视频全屏控制按钮
      RadiumLamp: false, //镭射灯开关
      FlashLamp: false,
      Screenshots: false,
      Recording: false,
      addcalldialogVisible: false,
      extendVideoDataTwo: false,
      videoShow: false, //视频窗口显示
      videoArray: [], //存放video标签
      socket: null,
      audioUser: "",
      userList: [],
      isMuteImg: true,
      usernameAudio: [],
      audioImg: audioImg,
      isRecord: false,
      recordStream: "",
      roomId: "",
      roomName: "",
      audioStream: new FormData(),
      auidoParams: {},
      audioSetInterva: null,
      multipleSelection: [],
      multipleSelectionZ: [],
      DetectionDrawer: false,
      callerAccount: "",
      calledAccount: "",
      //计时
      audioTime: "00:00",
      minute: 0,
      second: 0,
      minuteString: "",
      secondString: "",
      int: "",
      //录音时长
      timetitle: "",
      timetitle2: "",
      isInvited: true,
      MuteImg: MuteImg,
      MuteImg2: MuteImg2,
      localStream: null,
      operation: {
        username: "z005",
        socketId: "",
        realName: "c31_005",
        mic: "1",
        flashlight: "0",
        laserlight: "0",
      },

      // path: "ws://118.190.38.198:8080/video/web/",
      // path: "ws://192.168.0.16:8083/video/web/",
    };
  },
  created() {
    // this.getIdData();
    this.getMessage();
    rtc.on("remove_peer", function (data) {
      data;
    });
  },
  mounted() {
    // this.startVideo();
    // (sessionStorage.getItem('user'))
    // 监听邀请
    window.addEventListener("inviteAudios", this.startVideo);
    window.addEventListener("tuiLogin", this.CloseCell);
    // (document.getElementsByClassName('box-card-audio-one'))
    // 监听挂断
    let that = this;
    window.addEventListener("voiceConversationEnd", async function (e) {
      await that.CloseCell(e);
    });
    window.addEventListener("voiceMoreConversationEnd", async function (e) {
      await that.CloseCell(e);
    });
    // 监听成员信息
    window.addEventListener(
      "findUserInfoBySocketIduserList",
      this.findUserInfoBySocketIduserList
    );
    // 监听排队挂断
    window.addEventListener("callwaitAnswerAudio", this.waitCloseCell);
    // 初始化语音通话
    this.initAudio();
    //监听禁麦
    window.addEventListener("operationMute", this.operationMute);
  },
  computed: {
    username() {
      // return this.$route.query.username
      let user = JSON.parse(localStorage.getItem("user")).username(user);
      return user;
    },
    isInvitedShow() {
      if (this.isInvited == true) {
        //禁用
        return "none";
      } else {
        return "block";
      }
    },
  },
  methods: {
    // LoginTui() {
    //   console.log("退出登录，顺便退出通话");
    // },
    //   获取从通讯录页面传来的值来判断显示什么界面
    getIdData() {
      // this.viewId = this.$route.params.id;
      //   this.viewId = this.$route.params.id;
      this.viewId;
    },
    getMessage() {
      // this.message = this.$route.query.name;
      //从sessionStorage中获取用户的类型
      var infostr = sessionStorage.objName;
      var objName = JSON.parse(infostr);
      this.message = objName;
    },
    // 鼠标位移
    move(e) {
      let odiv = e.target; //获取目标元素
      //算出鼠标相对元素的位置
      let disX = e.clientX - odiv.offsetLeft;
      let disY = e.clientY - odiv.offsetTop;
      document.onmousemove = (e) => {
        //鼠标按下并移动的事件
        //用鼠标的位置减去鼠标相对元素的位置，得到元素的位置
        let left = e.clientX - disX;
        let top = e.clientY - disY;
        //绑定元素位置到positionX和positionY上面
        this.positionX = top;
        this.positionY = left;
        //移动当前元素
        odiv.style.left = left + "px";
        odiv.style.top = top + "px";
      };
      document.onmouseup = (e) => {
        document.onmousemove = null;
        document.onmouseup = null;
      };
    }, // 鼠标位移end
    moveVideo(e) {
      let odiv = e.currentTarget; //获取目标元素
      //算出鼠标相对元素的位置
      let disX = e.clientX - odiv.offsetLeft;
      let disY = e.clientY - odiv.offsetTop;
      document.onmousemove = (e) => {
        //鼠标按下并移动的事件
        //用鼠标的位置减去鼠标相对元素的位置，得到元素的位置
        let left = e.clientX - disX;
        let top = e.clientY - disY;
        //绑定元素位置到positionX和positionY上面
        this.positionX = top;
        this.positionY = left;
        //移动当前元素
        odiv.style.left = left + "px";
        odiv.style.top = top + "px";
      };
      document.onmouseup = (e) => {
        document.onmousemove = null;
        document.onmouseup = null;
      };
    },
    // 最小化
    miniMize() {
      var domAudio = document.getElementById("audioMAP");
      domAudio.style.cssText = "left:800%;";
      var minVideo = document.getElementById("minAudio");
      minVideo.style.cssText = "left:800px;";
    },
    // 最大化
    maxMization() {
      var domAudio = document.getElementById("audioMAP");
      domAudio.style.cssText = "left:15%;";
      var minVideo = document.getElementById("minAudio");
      minVideo.style.cssText = "left:800%;";
    },
    //挂断操作
    CloseCell() {
      this.localStream = null;
      localStorage.setItem("isInvited", false);
      clearInterval(this.int); // 关闭计时
      this.audioTime = "00:00";
      this.minute = 0;
      this.second = 0;
      this.minuteString = "";
      this.secondString = "";
      this.int = "";
      window.dispatchEvent(
        new CustomEvent("videoState", {
          detail: {
            eventName: "挂断",
          },
        })
      );
      var that = this;
      window.dispatchEvent(
        new CustomEvent("onSendCloseMessage", {
          detail: {
            roomId: that.roomId,
            roomName: that.roomName,
            eventName: that.viewId,
          },
        })
      );
      var domAudio = document.getElementById("audioMAP");
      this.videoShow = false;
      domAudio.style.cssText = "left:800%;";
      var minVideo = document.getElementById("minAudio");
      minVideo.style.cssText = "left:800%;";
      rtc.closePC();
      rtc.on("socket_closed", function (socket) {
        localStorage.setItem("isclose", false);
      });
      // window.location.reload();
      if (this.viewId == 1) {
        document.getElementById("meaudio").srcObject = null;
        let videodom = document.getElementById("videosaudio");
        let otherAuido = document.getElementsByClassName("otherAuido");
        if (otherAuido !== null) {
          for (let i = otherAuido.length - 1; i >= 0; i--) {
            videodom.removeChild(otherAuido[i]);
          }
        }
      } else if (this.viewId == 2) {
        document.getElementById("meaudioMore").srcObject = null;
        let moreVideodom = document.getElementsByClassName(
          "mainleftaudioMore"
        )[0];
        let moreVideo = document.getElementsByClassName("otheraudioid");
        moreVideo.length;
        if (moreVideo !== null) {
          for (let i = moreVideo.length - 1; i >= 0; i--) {
            moreVideodom.removeChild(moreVideo[0]);
          }
        }
      }
      if(this.isRecord ==true){
        this.record()
      }
      
    },
    // 呼叫排队挂断
    async waitCloseCell(e) {
      await this.CloseCell();
      window.dispatchEvent(
        new CustomEvent("callwaitAnswer2", {
          detail: {
            event: "触发接听",
            index: e.detail.index,
          },
        })
      );
    },
    extendVideo() {
      this.extendVideoData = !this.extendVideoData;
    }, //扩展全屏视频通话
    changeRadium() {
      this.RadiumLamp = !this.RadiumLamp;
    }, //镭射灯开关
    changeFlash() {
      this.FlashLamp = !this.FlashLamp;
    },
    changeScreenshots() {
      this.Screenshots = !this.Screenshots;
    }, //截图
    changeRecording() {
      this.Recording = !this.Recording;
    },
    // 视频会议-呼叫通话中-窗口-小画面改变
    onecallone() {
      this.Recording = !this.Recording;
    },
    onecalloneTwo() {
      this.Screenshots = !this.Screenshots;
    },
    // 视频会议-呼叫通话中-窗口 -添加成员
    addCallvideo() {
      this.addcalldialogVisible = true;
    },
    // ADDhandleSelectionChange(val) {
    //   this.multipleSelection = val;
    // },
    // 视频会议-呼叫通话中-窗口 -全屏
    extendVideoTwo() {
      this.extendVideoDataTwo = !this.extendVideoDataTwo;
    },
    // 开始语音
    startVideo(e) {
      //开始计时
      var that = this;
      this.int = setInterval(function () {
        that.second = that.second + 1;
        if (that.second > 59) {
          that.minute = that.minute + 1;
          that.second = 0;
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
        that.audioTime = that.minuteString + ":" + that.secondString;
      }, 1000);
      localStorage.setItem("isclose", true);
      this.roomId = e.detail.room;
      this.roomName = e.detail.room;
      e.detail.user;
      this.callerAccount = e.detail.user[0].memberId;
      this.calledAccount = e.detail.user[1].memberId;
      window.dispatchEvent(
        new CustomEvent("videoState", {
          detail: {
            eventName: "正在通话",
          },
        })
      );

      if (localStorage.getItem("isInvited") == "true") {
        //有权限
        this.isInvited = false;
      } else {
        this.isInvited = true;
      }
      this.viewId = e.detail.id;

      var domAudio = document.getElementById("audioMAP");
      var videoAudioOne = document.getElementsByClassName(
        "box-card-audio-one"
      )[0];
      var videoAudioThree = document.getElementsByClassName(
        "box-card-audio-three"
      )[0];

      if (this.viewId === 1) {
        e.detail.username;
        this.audioUser = e.detail.username;
        domAudio.style.cssText = "right:5%;";
        videoAudioOne.style.cssText = "left:0px;";
        videoAudioThree.style.cssText = "left:100%;";
      } else if (this.viewId === 2) {
        domAudio.style.cssText = "right:5%;";
        videoAudioOne.style.cssText = "left:100%;";
        videoAudioThree.style.cssText = "left:0px;";
      }

      //连接WebSocket服务器
      //   rtc.connect("wss://webrtc.ytha-hd.com/wss/video/web", this.$route.query.room);
      rtc.connect("wss://webrtc.ytha-hd.com/wss/video/web", e.detail.room);
    },
    initAudio() {
      var that = this;
      var videosaudio = "";
      //成功创建WebSocket连接
      rtc.on("connected", function (socket) {
        //创建本地视频流
        rtc.createStream({
          video: false,
          audio: true,
        });
      });
      //创建本地视频流成功
      rtc.on("stream_created", function (stream) {
        if (that.viewId === 1) {
          document.getElementById("meaudio").srcObject = stream;
          document.getElementById("meaudio").play();
          // 设置本地不播放自己的声音
          document.getElementById("meaudio").volume = 0.0;
        } else if (that.viewId === 2) {
          document.getElementById("meaudioMore").srcObject = stream;
          document.getElementById("meaudioMore").play();
          // 设置本地不播放自己的声音
          document.getElementById("meaudioMore").volume = 0.0;
        }
        that.localStream = stream;
      });
      //创建本地视频流失败
      rtc.on("stream_create_error", function () {
        alert("create stream failed!");
      });
      //接收到其他用户的视频流

      rtc.on("_remove_peer", function (data) {
        if (that.viewId == 1) {
          that.CloseCell();
        } else if (that.viewId == 2) {
          let videomoredom = document.getElementById("other-" + data.socketId);
          videomoredom.parentNode.parentNode.removeChild(
            videomoredom.parentNode
          );
          let moreVideodom = document.getElementsByClassName("otheraudioid");
          if (moreVideodom.length == 0) {
            that.CloseCell();
          }
          let userNameDom = document.getElementsByClassName("userspan");
          for (let i = 0; i < userNameDom.length; i++) {
            for (let j = 0; j < that.userList.length; j++) {
              if (
                userNameDom[i].innerHTML.indexOf(that.userList[j].realName) ==
                -1
              ) {
                that.userList.splice(j, 1);
              }
            }
          }
        }
      });

      rtc.on("get_peers", function (data) {
        let userInfo = JSON.parse(localStorage.getItem("user"));
        window.dispatchEvent(
          new CustomEvent("sendBindSocketId", {
            detail: {
              socketId: data.you,
              realName: userInfo.username,
              username: userInfo.account,
            },
          })
        );
      });

      rtc.on("pc_add_stream", function (stream, socketId) {
        //1v1语音
        if (that.viewId == 1) {
          let videosaudio = document.getElementById("videosaudio");
          stream, socketId;
          that.recordStream = stream;
          var newVideo = document.createElement("video");
          var id = "other-" + socketId;
          newVideo.setAttribute("class", "otherAuido");
          newVideo.setAttribute("autoplay", "autoplay");
          newVideo.setAttribute("id", id);
          newVideo.style.cssText =
            "width:100%;height:85%;position: absolute; top: 0px; left: 0px;";
          videosaudio.appendChild(newVideo);
          rtc.attachStream(stream, id);
        }

        //语音会议
        else if (that.viewId == 2) {
          let getUserInfo = {
            eventName: "findUserInfoBySocketId",
            data: [
              {
                socketId: socketId,
              },
            ],
            type: "3",
          };
          that.sendWSPush(getUserInfo);
          // var videoList = document.getElementsByClassName('meVideo')
          var mainleftaudio = document.querySelector(".mainleftaudioMore");
          var newVideo = document.createElement("video");
          var div = document.createElement("div");
          var id = "other-" + socketId;
          div.setAttribute("class", "otheraudioid");
          div.innerHTML =
            // "<div class='otheraudioid'>" +
            "<img style='width:30px;height:30px;' src='" +
            that.audioImg +
            "' alt=''>" +
            "<span class='userspan'></span>" +
            "<img style='width:20px;height:20px;display:" +
            that.isInvitedShow +
            ";' class='usermute' src='" +
            that.MuteImg2 +
            "' alt=''>";
          // "</div>"
          newVideo.setAttribute("class", "other");
          newVideo.setAttribute("autoplay", "autoplay");
          newVideo.setAttribute("id", id);
          newVideo.style.cssText = "width:0px;height:0px;";
          div.appendChild(newVideo);
          mainleftaudio.appendChild(div);
          rtc.attachStream(stream, id);

          // 添加点击事件
          let arr = document.getElementsByClassName("otheraudioid");
          for (let i = 0; i < arr.length; i++) {
            let muteImgClick = document.getElementsByClassName("usermute")[i];
            (function (i) {
              muteImgClick.onclick = function () {
                // 静音
                that.Mute(i);
              };
            })(i);
          }
        }
      });
    },
    //挂断电话
    hangUp() {
      //删除其他用户
      rtc.on("remove_peer", function (socketId) {
        var video = document.getElementById("other-" + socketId);
        if (video) {
          video.parentNode.removeChild(video);
        }
      });
      
    },
    // 通话时间
    videoTiming() {
      var that = this;
      // window.setInterval(function() {
      //   that.videotime =
      // }, 1000);
    },
    isMuteImgfun() {
      this.isMuteImg = !this.isMuteImg;
    },
    // 语音会议---静音
    Mute(i) {
      let muteImg = document.getElementsByClassName("usermute")[i];

      if (muteImg.src == this.MuteImg2) {
        //静音
        muteImg.src = this.MuteImg;
        this.userList[i].mic = "0";
        window.dispatchEvent(
          new CustomEvent("onOperation", {
            detail: {
              data: this.userList[i],
            },
          })
        );
        // document.getElementsByClassName('other')[i].muted = true;
      } else if (muteImg.src == this.MuteImg) {
        muteImg.src = this.MuteImg2;
        this.userList[i].mic = "1";
        window.dispatchEvent(
          new CustomEvent("onOperation", {
            detail: {
              data: this.userList[i],
            },
          })
        );
        // document.getElementsByClassName('other')[i].muted = false;
      }
    },
    // 录音
    async record() {
      this.isRecord = !this.isRecord;
      if (this.viewId == 1 && this.isRecord) {
        RS.mediaStream = this.recordStream;
        RS.startRecord(true);
        this.timetitle = new Date().getTime();
      } else if (this.isRecord == false) {
        this.audioSetInterva = null;
        RS.stopRecord();
        this.timetitle2 = new Date().getTime();
        // RS.downloadRecord();
        const blob = await fetch(RS.url).then((r) => r.blob());
        let name = new Date().getTime();
        const file = new File([blob], name + ".mp3", { type: blob.type });
        file;
        this.audioStream.append("file", file);
        this.audioStream.append("type", 4);
        var url = await this.$http.post(
          "/broadcast/uploadVoiceFile",
          this.audioStream
        );
        let params = {
          callerAccount: this.callerAccount,
          calledAccount: this.calledAccount,
          title: this.timetitle2 - this.timetitle,
          messageType: 1,
          message: url.data.message,
        };
        this.auidoParams = params;
        var userInfo = JSON.parse(localStorage.getItem("user"));
        if (userInfo.account == this.callerAccount) {
          this.auidoParams.messageType = 1;
        } else {
          this.auidoParams.messageType = 2;
        }
        // this.auidoParams.title
        this.auidoParams.message = url.data.message;
        this.auidoParams.recordTime = this.format(new Date(), "-");
        this.auidoParams;
        let data = await this.$http.post(
          "/phoneRecord/addRecordVo",
          qs.stringify(this.auidoParams)
        );
        data;
        this.audioTime = 0;
      }
    },
    // 时间格式转化
    // 第一个参数为日期，第二个参数为年月日分割格式 '/'或'-'
    format(Date, str) {
      var obj = {
        Y: Date.getFullYear(),
        M: Date.getMonth() + 1,
        D: Date.getDate(),
        H: Date.getHours(),
        Mi: Date.getMinutes(),
        S: Date.getSeconds(),
      };
      // 拼接时间 hh:mm:ss
      var time =
        " " +
        this.supplement(obj.H) +
        ":" +
        this.supplement(obj.Mi) +
        ":" +
        this.supplement(obj.S);
      // yyyy-mm-dd
      if (str.indexOf("-") > -1) {
        return (
          obj.Y +
          "-" +
          this.supplement(obj.M) +
          "-" +
          this.supplement(obj.D) +
          time
        );
      }
      // yyyy/mm/dd
      if (str.indexOf("/") > -1) {
        return (
          obj.Y +
          "/" +
          this.supplement(obj.M) +
          "/" +
          this.supplement(obj.D) +
          time
        );
      }
    },
    // 时间格式转化,位数不足两位补全0
    supplement(nn) {
      return (nn = nn < 10 ? "0" + nn : nn);
    },
    // 通讯录表单数据点击按钮
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    // 添加成员
    async addUser() {
      this.DetectionDrawer = true;
      // 请求筛选终端成员
      const { data: res2 } = await this.$http.post(
        "contact/findContact",
        qs.stringify({
          pageSize: 999,
          pageNum: 1,
        })
      );
      res2;
      this.multipleSelectionZ = res2.data.list;
    },
    addUserSend() {
      this.DetectionDrawer = false;
      window.dispatchEvent(
        new CustomEvent("inviteAudio", {
          detail: {
            id: 2,
            // iscalling: true,
            userinfor: JSON.parse(localStorage.getItem("user")),
            targetType: this.multipleSelection[0].type == "1" ? "d" : "z",
            type: this.multipleSelection[0].type == "1" ? "d2d" : "d2z",
            multipleSelection: this.multipleSelection,
            roomId: this.roomId,
          },
        })
      );
    },
    findUserInfoBySocketIduserList(e) {
      let dom = document.getElementsByClassName("userspan");
      this.userList = e.detail.userlist;
      dom.forEach((element, i) => {
        element.innerHTML = e.detail.userlist[i].realName;
      });
    },
    // 禁止选择已加入会议的成员
    selectEnable(row, index) {
      for (let j = 0; j < this.multipleSelectionZ.length; j++) {
        this.multipleSelectionZ[j].callstatus = true;
        for (let i = 0; i < this.userList.length; i++) {
          if (
            this.multipleSelectionZ[j].fullName == this.userList[i].realName
          ) {
            this.multipleSelectionZ[j].callstatus = false;
          }
        }
      }
      return this.multipleSelectionZ[index].callstatus !== false;
    },
    //被禁麦/开启
    operationMute(e) {
      if (this.localStream !== null) {
        if (e.detail.mic == "0") {
          this.localStream.getAudioTracks()[0].enabled = false;
        } else {
          this.localStream.getAudioTracks()[0].enabled = true;
        }
      }
    },
  },
};
</script>

<style>
#audioWrap {
  z-index: 9999;
}
 #audioMAP .el-button{
    width: 1rem;
    height: .5rem;
    text-align: center;
    padding: 0;

 }
#audioWrap #audioMAP .record {
  position: absolute;
  bottom: 80px;
  right: 100px;
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background-color: #409eff;
  line-height: 80px;
  cursor: pointer;
}
#audioWrap #audioMAP .recordactive {
  border: 1px solid #409eff;
  background-color: white;
}
#audioWrap #audioMAP .record .startrecord {
  display: block;
  text-align: center;
  font-size: 20px;
  color: white;
}
#audioWrap #audioMAP .record .endrecord {
  display: block;
  width: 30px;
  height: 30px;
  position: absolute;
  top: 50%;
  left: 50%;
  margin-top: -15px;
  margin-left: -15px;
  border-radius: 50%;
  background-color: red;
}
#audioWrap #audioMAP {
  height: 5rem;
  width: 8rem;
  position: absolute;
  /* top: 100%; */
  /* left: 100%; */
  top: 15%;
  right: 800%;
  /* left: 15%; */
  overflow: hidden;
  /* border: 1px solid rgb(228, 228, 228); */
  border-radius: 12px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  z-index: 999;
}
#audioWrap #audioMAP .el-card {
  /* background-color: rgb(65, 65, 65); */
  /* background-color: rgb(3, 175, 243); */
  background-color: white;
  border-radius: 12px;
}
#audioWrap #audioMAP .tag {
  position: absolute;
  top: 10%;
  left: 85%;
  height: 210px;
  width: 200px;
  box-sizing: border-box;
  /* background-color: pink; */
  /* margin-top: 50px; */
  border-radius: 8px;
  text-align: center;
  font-size: 14px;
  border: 1px solid black;
  cursor: pointer;
}
#audioWrap #audioMAP .tag-height {
  height: 300px;
}
#audioWrap #audioMAP .tag-height-two {
  height: 360px;
}
#audioWrap #audioMAP .tag .tag-header img {
  display: block;
  margin-left: 85px;
}
#audioWrap #audioMAP .tag .tag-main {
  margin-top: 50px;
  font-size: 16px;
}
#audioWrap #audioMAP .box-card-audio-three {
  position: absolute;
  top: 0px;
  left: 100%;
}
#audioWrap #audioMAP .box-card-audio-one {
  position: absolute;
  top: 0px;
  left: 0px;
}
#audioWrap #audioMAP .box-card-two {
  height: 100%;
  position: absolute;
  width: 100%;
}
#audioWrap #audioMAP .box-card-two .clearfix .sptitle {
  font-size: 20px;
  color: #1596ff;
  font-weight: 700;
}

#audioWrap #audioMAP .box-card-two .clearfix .calltime {
  font-size: 15px;
  color: #1596ff;
  display: inline-block;
  margin-left: 80px;
}

#audioWrap #audioMAP .box-card-two .clearfix img {
  float: right;
  height: 30px;
  width: 30px;
}
#audioWrap #audioMAP .box-card-two .mainleftaudio,
#audioWrap #audioMAP .box-card-two .mainleftaudioMore {
  /* position: absolute;
  float: left; */
  width: 100%;
  height: 100%;
  overflow: hidden;
  overflow-y: scroll;
  /* background-color: pink; */
}
#audioWrap #audioMAP .box-card-two .mainleftaudio ul,
#audioWrap #audioMAP .box-card-two .mainleftaudioMore ul {
  float: left;
  /* margin-left: 10px; */
  padding-left: 15px;
}
#audioWrap #audioMAP .box-card-two .mainleftaudio li,
#audioWrap #audioMAP .box-card-two .mainleftaudioMore li {
  list-style: none;
}
#audioWrap #audioMAP .box-card-two .mainleftaudioMore #videosaudioMore {
  background-color: #ccc;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  position: absolute;
  bottom: 20px;
  left: 50%;
  margin-left: -20px;
}
#audioWrap #audioMAP .box-card-two .mainleftaudioMore #videosaudioMore img {
  width: 30px;
  height: 35px;
  margin-left: 5px;
  margin-top: 3px;
  cursor: pointer;
  display: none;
}
#audioWrap #audioMAP .box-card-two .mainleftaudioMore .otheraudioid {
  /* width: 60px;
  height: 60px; */
  /* border: 1px solid red; */
  margin: 10px;
  float: left;
}
#audioWrap #audioMAP .box-card-two .mainleftaudioMore .otheraudioid img {
  display: inherit;
  margin: 0 auto;
}
#audioWrap #audioMAP .box-card-two .mainleftaudioMore .otheraudioid span {
  display: block;
  text-align: center;
}
#audioWrap #audioMAP .box-card-two .mainleftaudioMore .otheraudioid .usermute {
  cursor: pointer;
}
#audioWrap #audioMAP .box-card-two .mainleftaudio .meVideo {
  position: absolute;
  bottom: 10px;
  left: 10px;
  width: 200px;
  height: 266px;
  border: none;
  /* background-color: green; */
  /* margin-top: 440px;
  margin-left: 30px; */
}
#audioWrap #audioMAP .box-card-two .mainright {
  float: left;
  margin-left: 20px;
  /* width: 330px;
  height: 750px;
  background-color: skyblue; */
}
#audioWrap #audioMAP .box-card-two .mainleftaudioAll {
  width: 1600px;
  height: 800px;
  /* background-color: pink; */
}
#audioWrap #audioMAP .box-card-audio-three .el-button {
  color: #fff !important;
}
#audioWrap #audioMAP .meVideo .miniul {
  position: absolute;
  bottom: -20px;
  right: 10px;

  /* position: relative; */
}
#audioWrap #audioMAP .meVideo .miniul li {
  float: right;
}
/* #audioMAP .box-card-audio-three .meVideo:nth-of-type(2){
  position: absolute;
  bottom: 10px;
  left: 300px;
  margin-left: 250px;
} */

/* #audioMAP .box-card-audio-three .meVideoTwo {
  margin-left: 500px;
}
#audioMAP .box-card-audio-three .meVideoThree {
  margin-left: 750px;
}
#audioMAP .box-card-audio-three .meVideoFour {
  margin-left: 1000px;
} */

#audioWrap .mainleftaudio div:nth-of-type(4) {
  margin-left: 250px;
}
#audioWrap .mainleftaudio div:nth-of-type(5) {
  margin-left: 500px;
}
#audioWrap .mainleftaudio div:nth-of-type(6) {
  margin-left: 750px;
}
#audioWrap .mainleftaudio div:nth-of-type(7) {
  margin-left: 1000px;
}

#audioWrap #minAudio {
  position: absolute;
  /* top: 2px;
    left: 800px; */
  top: 2px;
  left: 800%;
  width: 400px;
  height: 80px;
  z-index: 999;
  font-size: 18px;
  color: #1596ff;
  font-weight: 700;
}

#audioWrap #minAudio .el-button {
  margin-bottom: 15px;
}
</style>
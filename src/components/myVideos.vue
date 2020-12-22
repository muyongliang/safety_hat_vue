// 视频通话页面
<template>
  <div id="videoWrap">
    <div id="videoMAP" @mousedown="moveVideo">
      <ul class="leftfunction">
        <!-- 全屏 -->
        <li @click="fullScreen">
          <img :src="fullScreenImg" alt="" />
        </li>
        <!-- 录制 -->
        <li @click="record" v-if="viewId == 3">
          <img :src="recordImg" alt="" />
        </li>
        <!-- 截图 -->
        <li @click="screenShot" v-if="viewId == 3">
          <img :src="screenShotImg" alt="" />
        </li>
        <!-- 闪光灯 -->
        <!-- <li @click="changeFlash" v-if="isInvited" >
          <img :src="changeFlashImg" alt="">
        </li> -->
        <!-- 闪光灯1v1 -->
        <li @click="changeFlash" v-if="viewId == 3 && accountType == 'z'">
          <img :src="changeFlashImg" alt="" />
        </li>
        <!-- 镭射灯 -->
        <li @click="LaserLight" v-if="viewId == 3 && accountType == 'z'">
          <img :src="LaserLightImg" alt="" />
        </li>
        <!-- 静音 -->
        <li @click="Mute" v-if="viewId == 4">
          <img class="mutecss" :src="MuteImg" alt="" />
        </li>
      </ul>
      <!-- 视频通话-通话中-窗口 -->
      <template>
        <div class="box-card box-card-one box-card-two">
          <div class="clearfix">
            <span class="sptitle">1v1视频</span>
            <span class="calltime"> 正在通话： {{ videotime }}</span>
            <button class="videoBtn closebtn" @click="CloseCell">挂断</button>
            <button class="videoBtn minbtn" @click="miniMize">最小化</button>
          </div>
          <div :class="isFull === false ? 'mainleft' : 'mainleftfull'">
            <div id="videos" :class="bigOrSmall === 1 ? 'smallVideo' : 'bigVideo'" @click="bigOrSmallClick(1)" style="overflow: hidden"></div>
            <div :class="bigOrSmall === 0 ? 'smallVideo' : 'bigVideo'" v-if="extendVideoData == false" @click="bigOrSmallClick(0)">
              <video id="me" autoplay style="width: 100%; height: 100%"></video>
            </div>
            <canvas id="myCanvas" width="700" height="400"></canvas>
          </div>
        </div>
      </template>
      <!-- 视频会议-呼叫通话中-窗口 -->
      <div class="box-card box-card-three box-card-two" style="left: 0">
        <div class="clearfix">
          <span class="sptitle">视频会议</span>
          <span class="calltime"> 正在通话： {{ videotime }}</span>
          <button class="videoBtn closebtn" @click="CloseCell">挂断</button>
          <button class="videoBtn minbtn" @click="miniMize">最小化</button>
          <button class="videoBtn" :class="isInvited ? 'adduser' : 'noadduser'" @click="addUser">添加成员</button>
          <!-- <el-button style="float: right;margin-right:10px;" size="medium" @click="addCallvideo">添加成员</el-button> -->
        </div>
        <div :class="isFullMore === false ? 'mainleftMore' : 'mainleftMorefull'">
          <!-- style="width:1000px;height:717px;position:absolute;" -->
          <div id="videosMore">
            <video :id="isFullMore === false ? 'meMore' : 'meMoreFull'" autoplay></video>
            <div class="videosBottom" v-show="!isFullMore"></div>
          </div>
        </div>
        <!-- 通话成员列表 -->
        <div class="userList" v-show="!isFullMore">
          <div class="clearfix">
            <span class="sptitle" style="font-size: 16px">成员列表({{ userList.length }})</span>
          </div>
          <div
            class="userli"
            v-for="(item, index) in userList"
            :key="index"
            @click="userListClick(index)"
          >
            {{ item.realName }}
          </div>
        </div>
        <!-- 添加成员 -->
        <el-dialog
          :visible.sync="DetectionDrawer"
          width="40%"
          center
          :modal="false"
          title="添加成员"
        >
          <el-table
            style="width: 100%"
            height="300"
            @selection-change="handleSelectionChange"
            :data="multipleSelectionZ"
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
      </div>
    </div>
    <div id="min" @mousedown="moveVideo">
      <el-card class="minCard">
        <span class="sptitle">视频中。。。</span>
        <el-button style="float: right; margin-right: 15px" type="danger" @click="CloseCell">挂断</el-button>
        <el-button style="float: right; margin-right: 15px" type="success" @click="maxMization">最大化</el-button>
      </el-card>
    </div>
  </div>
</template>

<script>
import SkyRTC from "../assets/js/SkyRTC-client.js";
var rtc = SkyRTC();
import RSfun from "../assets/js/record.js";
var RS = RSfun();
import fullScreenImg from "../assets/images/2067@2x.png";
import fullScreenImg2 from "../assets/images/2068@2x.png";
import recordImg from "../assets/images/2063@2x.png";
import recordImg2 from "../assets/images/2072@2x.png";
import screenShotImg from "../assets/images/2064@2x.png";
// import screenShot2 from '../assets/images/2068@2x.png';
import changeFlashImg from "../assets/images/2065@2x.png";
import changeFlashImg2 from "../assets/images/2070@2x.png";
import LaserLightImg from "../assets/images/2069@2x.png";
import LaserLightImg2 from "../assets/images/2066@2x.png";
import MuteImg from "../assets/images/u3888.png";
import MuteImg2 from "../assets/images/u3889.png";
import qs from "qs";
export default {
  name: "my-videos",
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
      // 添加视频通话表单多选框数据
      multipleSelection: [],
      extendVideoDataTwo: false,
      videoShow: false, //视频窗口显示
      videoArray: [], //存放video标签
      socket: null,
      bigOrSmall: 0, // 0默认1v1小窗口，多人大窗口
      userList: [], // 成员列表
      userInfoName: "", // 1v1成员名称
      isFull: false, // 是否全屏
      isFullMore: false,
      isRecord: false, // 是否开始录屏
      isMute: false, // 是否静音
      muteList: [],
      fullScreenImg: fullScreenImg,
      recordImg: recordImg,
      screenShotImg: screenShotImg,
      changeFlashImg: changeFlashImg,
      otherchangeFlashImg: changeFlashImg,
      otherchangeFlashImg2: changeFlashImg2,
      LaserLightImg: LaserLightImg,
      MuteImg: MuteImg,
      otherMuteImg: MuteImg,
      otherMuteImg2: MuteImg2,
      recordStream: "", // 用于存放对方的视频流
      videoSocketId: [], //存储已经加进来的连接
      roomId: "",
      roomName: "",
      operation: {
        username: "z005",
        socketId: "",
        realName: "c31_005",
        mic: "1",
        flashlight: "0",
        laserlight: "0",
      },
      multipleSelection: [],
      multipleSelectionZ: [],
      DetectionDrawer: false,
      videotime: "00:00",
      minute: 0,
      second: 0,
      minuteString: "",
      secondString: "",
      int: "",
      isInvited: false,
      localStream: null,
      invitedUserName: "",
      invitedFullName: "",
      accountType: "",
      sint:null,
      // path: "ws://118.190.38.198:8080/video/web/",
      // path: "ws://192.168.0.16:8083/video/web/",
    };
  },
  created() {},
  mounted() {
    // 监听邀请
    window.addEventListener("inviteVideos", this.startVideo);
    // 监听挂断
    let that = this;
    window.addEventListener("videoConversationEnd", async function (e) {
      await that.CloseCell(e);
    });
    window.addEventListener("videoMoreConversationEnd", async function (e) {
      await that.CloseCell(e);
    });
    // 监听成员信息
    window.addEventListener(
      "findUserInfoBySocketIduserList",
      this.findUserInfoBySocketIduserList
    );
    // 监听排队挂断
    window.addEventListener("callwaitAnswer", this.waitCloseCell);
    // 初始化视频
    this.initVideos();
    //监听禁麦
    window.addEventListener("operationMute", this.operationMute);
    window.addEventListener("tuiLogin", this.CloseCell); //监听退出登录挂断电话
  },
  computed: {
    username() {
      // return this.$route.query.username
      let user = JSON.parse(localStorage.getItem("user")).username;
      console.log(user);
      return user;
    },
    isInvitedShow() {
      if (this.isInvited == false) {
        //禁用
        return "none";
      } else {
        return "block";
      }
    },
  },
  methods: {
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
        //移动当前元
        odiv.style.left = left + "px";
        odiv.style.top = top + "px";
      };
      document.onmouseup = (e) => {
        document.onmousemove = null;
        document.onmouseup = null;
      };
    }, // 鼠标位移end6
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
      var domVideo = document.getElementById("videoMAP");
      domVideo.style.cssText = "left:800%;";
      var minVideo = document.getElementById("min");
      minVideo.style.cssText = "left:800px;";
    },
    // 最大化
    maxMization() {
      var domVideo = document.getElementById("videoMAP");
      domVideo.style.cssText = "left:15%;";
      var minVideo = document.getElementById("min");
      minVideo.style.cssText = "left:800%;";
    },
    //挂断操作
    CloseCell() {
      this.localStream = null;
      localStorage.setItem("isInvited", false);
      // localStorage.setItem("videoMore", false)
      clearInterval(this.int); // 关闭计时
      this.videotime = "00:00";
      this.minute = 0;
      this.second = 0;
      this.minuteString = "";
      this.secondString = "";
      this.int = null;
      this.videoSocketId = [];
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
      var minVideo = document.getElementById("min");
      minVideo.style.cssText = "left:800%;";
      var domVideo = document.getElementById("videoMAP");
      this.videoShow = false;
      rtc.closePC();
      // rtc.on('socket_closed',function(socket) {
      localStorage.setItem("isclose", false);
      domVideo.style.cssText = "left:800%;";
      // })
      if (this.viewId == 3) {
        document.getElementById("me").srcObject = null;
        let videodom = document.getElementById("videos");
        let otherVideo = document.getElementsByClassName("otherVideo");
        if (otherVideo !== null) {
          for (let i = otherVideo.length - 1; i >= 0; i--) {
            videodom.removeChild(otherVideo[i]);
          }
        }
      } else if (this.viewId == 4) {
        document.getElementById("meMore").srcObject = null;
        let moreVideodom = document.getElementsByClassName("videosBottom")[0];
        let moreVideo = document.getElementsByClassName("moreVideo");
        if (moreVideo !== null) {
          for (let i = moreVideo.length - 1; i >= 0; i--) {
            moreVideodom.removeChild(moreVideo[0]);
          }
        }
      }
      // 停止录制
      if(this.isRecord == true){
        this.record();
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
    // 开始视频
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
        that.videotime = that.minuteString + ":" + that.secondString;
      }, 1000);
      localStorage.setItem("isclose", true);
      //1v1被邀请这的账号名字类型
      if (e.detail.userName) {
        this.invitedUserName = e.detail.userName;
        this.invitedFullName = e.detail.fullName;
        this.accountType = e.detail.accountType;
      }
      //
      this.roomId = e.detail.room;
      this.roomName = e.detail.room;
      this.userList = [];
      window.dispatchEvent(
        new CustomEvent("videoState", {
          detail: {
            eventName: "正在通话",
          },
        })
      );

      if (localStorage.getItem("isInvited") == "true") {
        //有权限静音等
        this.isInvited = true;
      } else {
        this.isInvited = false;
      }
      this.viewId = e.detail.id;
      var videos = "";

      // this.userList = e.detail.username;

      var that = this;
      var domVideo = document.getElementById("videoMAP");
      var videoOne = document.getElementsByClassName("box-card-one")[0];
      var videoThree = document.getElementsByClassName("box-card-three")[0];
      domVideo.style.cssText = "left:15%;";
      if (that.viewId === 3) {
        videoOne.style.cssText = "left:0px;";
        videoThree.style.cssText = "left:100%;";
      } else if (that.viewId === 4) {
        videoOne.style.cssText = "left:100%;";
        videoThree.style.cssText = "left:0px;";
      }

      //连接WebSocket服务器
      rtc.connect("wss://webrtc.ytha-hd.com/wss/video/web", e.detail.room);
    },
    // 初始化视频通话监听
    initVideos() {
      var that = this;
      //成功创建WebSocket连接
      rtc.on("connected", function (socket) {
        //创建本地视频流
        rtc.createStream({
          video: true,
          audio: true,
        });
      });

      //创建本地视频流成功
      rtc.on("stream_created", function (stream) {
        if (that.viewId === 3) {
          document.getElementById("me").srcObject = stream;
          document.getElementById("me").play();
          // 设置本地不播放自己的声音
          document.getElementById("me").volume = 0.0;
        } else if (that.viewId === 4) {
          document.getElementById("meMore").srcObject = stream;
          document.getElementById("meMore").play();
          // 设置本地不播放自己的声音
          document.getElementById("meMore").volume = 0.0;
        }
        that.localStream = stream;
      });
      //创建本地视频流失败
      rtc.on("stream_create_error", function () {
        alert("create stream failed!");
      });
      //接收到其他用户的视频流

      rtc.on("_remove_peer", function (data) {
        if (that.viewId == 3) {
          that.CloseCell();
        } else if (that.viewId == 4) {
          let videomoredom = document.getElementById("other-" + data.socketId);
          videomoredom.parentNode.parentNode.removeChild(
            videomoredom.parentNode
          );
          let moreVideodom = document.getElementsByClassName("moreVideo");
          if (moreVideodom.length == 0) {
            that.CloseCell();
          }
          let userNameDom = document.getElementsByClassName("videoUserName");
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
          for (let j = 0; j < moreVideodom.length; j++) {
            moreVideodom[j].style.cssText =
              "width: 19%;height: 100%;border:1px solid white;background-color:rgb(102,102,102);position:absolute;left:" +
              20 * j +
              "%;top:0;";
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
        //1v1视频
        let list = {
          isSingleScreen: false, // 是否单屏
          isRecord: false, // 是否开始录屏
        };
        if (that.viewId == 3) {
          let videos = document.getElementById("videos");
          that.operation = {
            flashlight: "0",
            laserlight: "0",
            mic: "0",
            realName: that.invitedFullName,
            socketId: socketId,
            userType: 2,
            username: that.invitedUserName,
          };
          that.recordStream = stream; //存入视频流
          var newVideo = document.createElement("video");
          var id = "other-" + socketId;
          newVideo.setAttribute("class", "otherVideo");

          newVideo.setAttribute("autoplay", "autoplay");
          newVideo.setAttribute("id", id);
          newVideo.style.cssText ="width:100%;height:100%;display:inline-block";
          videos.appendChild(newVideo);
          rtc.attachStream(stream, id);
        }

        //视频会议
        else if (that.viewId == 4) {
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
          var mainleft = document.querySelector(".videosBottom");
          // mainleft.innerHTML = '';
          var newVideo = document.createElement("video");
          var div = document.createElement("div");
          var userNameDom = document.createElement("div");
          var muteDom = document.createElement("img");
          var id = "other-" + socketId;
          div.setAttribute("class", "moreVideo");
          let moreVideolist = document.getElementsByClassName("moreVideo");
          if (moreVideolist == null) {
            div.style.cssText =
              "width: 19%;height: 100%;border:1px solid white;background-color:rgb(102,102,102);position:absolute;left:0;top:0;text-align:center";
          } else {
            div.style.cssText =
              "width: 19%;height: 100%;border:1px solid white;background-color:rgb(102,102,102);position:absolute;left:" +
              moreVideolist.length * 20 +
              "%;top:0;";
          }

          // that.userList.push(sessionStorage.getItem('findUserInfoBySocketId'))
          // console.log(localStorage.getItem('findUserInfoBySocketIduserList'))
          // that.userList = JSON.parse(localStorage.getItem('findUserInfoBySocketIduserList'))

          // 成员名字
          userNameDom.setAttribute("class", "videoUserName");
          userNameDom.style.cssText =
            "width: 100%;height: 50px;line-height:50px;font-size:15px;position:absolute;top:0;left:0;text-align:center;color:white;";
          // userNameDom.innerHTML = sessionStorage.getItem('findUserInfoBySocketId');

          // 静音按钮
          div.innerHTML =
            "<img style='width:10%;height:10%;position:absolute;bottom:5px;right:5px;cursor:pointer;z-index:999;display:" +
            that.isInvitedShow +
            ";' class='mute' src='" +
            that.otherMuteImg +
            "' alt=''>" +
            "<img style='width:16%;height:14%;position:absolute;bottom:5px;left:5px;cursor:pointer;z-index:999;display:none;' class='changeFlash' src='" +
            that.otherchangeFlashImg +
            "' alt=''>";
          // "</div>"

          newVideo.setAttribute("class", "otherVideo");
          newVideo.setAttribute("autoplay", "autoplay");
          newVideo.setAttribute("id", id);
          newVideo.style.cssText =
            "width: 100%;height:100%;display:inline-block";
          div.appendChild(newVideo);
          div.appendChild(userNameDom);
          // div.appendChild(muteDom)
          mainleft.appendChild(div);
          rtc.attachStream(stream, id);

          // 添加点击事件
          let arr = document.getElementsByClassName("moreVideo");
          for (let i = 0; i < arr.length; i++) {
            let muteImgClick = document.getElementsByClassName("mute")[i];
            let changeFlashClick = document.getElementsByClassName(
              "changeFlash"
            )[i];
            (function (i) {
              muteImgClick.onclick = function () {
                // 静音
                that.otherMute(i);
              };
              changeFlashClick.onclick = function () {
                // 闪光灯
                that.otherchangeFlash(i);
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
    // 1v1切换镜头
    bigOrSmallClick(a) {
      console.log(a);
      if (this.bigOrSmall === a) {
        if (this.bigOrSmall === 0) {
          this.bigOrSmall = 1;
        } else {
          this.bigOrSmall = 0;
        }
      }
    },
    // 多人选择成员将该成员切换至首位
    userListClick(i) {
      let userVideoList = document.getElementsByClassName("moreVideo");
      // console.log(userVideoList)
      let num = 0;
      for (let j = 0; j < userVideoList.length; j++) {
        if (i !== j) {
          num++;
        }
        userVideoList[j].style.cssText ="width: 19%;height: 100%;border:1px solid white;background-color:rgb(102,102,102);position:absolute;left:" +20 * num +"%;top:0;";}
      userVideoList[i].style.cssText ="width: 19%;height: 100%;border:1px solid white;background-color:rgb(102,102,102);position:absolute;left:0;top:0;";
    },
    // 全屏
    fullScreen() {
      if (this.viewId == 3) {
        this.isFull = !this.isFull;
      } else if (this.viewId == 4) {
        this.isFullMore = !this.isFullMore;
      }
      let video = document.getElementById("videoMAP");
      if (this.isFull || this.isFullMore) {
        video.style.width =window.screen.width+ 'px';
        video.style.height =window.screen.height+ 'px'
        video.style.left =0
        video.style.top =0
        video.style.position ='fixed'
        this.fullScreenImg = fullScreenImg2;
      } else {
        video.style.width =15.291667+'rem';
        video.style.height = 8.166667 +'rem'
        video.style.left =337+ 'px'
        this.fullScreenImg = fullScreenImg;
      }
    },
    // 录屏
    record() {
      this.isRecord = !this.isRecord;
      if (this.viewId == 3 && this.isRecord) {
        let video = document.getElementById("videos");
        let otherVideo = document.getElementsByClassName("otherVideo")[0]
        video.style.border = "2px solid blue";
        this.recordImg = recordImg2;
        let c = document.getElementById("myCanvas");
        let ctx = c.getContext("2d");
        this.sint = setInterval(() => {
          ctx.drawImage(otherVideo, 0, 0, video.clientWidth, video.clientHeight);
          //打印当前视频的播放时间
          // (otherVideo.currentTime);
        }, 20);
        RS.mediaStream = c.captureStream();
        RS.startRecord(true);
      } else if (this.isRecord == false) {
        let video = document.getElementById("videos");
        video.style.border = "0px solid blue";
        this.recordImg = recordImg;
        clearInterval(this.sint);
        RS.stopRecord();
        RS.downloadRecord();
      }
    },
    // 截屏
    screenShot() {
      if (this.viewId == 3) {
        let otherVideo = document.querySelector(".otherVideo");
        let video = document.getElementById("videos");
        let myCanvas = document.createElement("canvas");
        myCanvas.width = video.clientWidth;
        myCanvas.height = video.clientHeight;
        video.appendChild(myCanvas);
        let ctx = myCanvas.getContext("2d");
        // video.clientWidth
        ctx.drawImage(otherVideo, 0, 0, video.clientWidth, video.clientHeight);
        let url = myCanvas.toDataURL("image/png");
        const oA = document.createElement("a");
        oA.download = ""; // 设置下载的文件名，默认是'下载'
        oA.href = url;
        document.body.appendChild(oA);
        oA.click();
        oA.remove();
      }
    },
    // 闪光灯
    changeFlash() {
      console.log(this.viewId);
      if (this.viewId == 3) {
        if (this.operation.flashlight == "0") {
          this.operation.flashlight = "1";
          this.changeFlashImg = changeFlashImg2;
          window.dispatchEvent(
            new CustomEvent("onOperation", {
              detail: {
                data: this.operation,
              },
            })
          );
        } else {
          this.operation.flashlight = "0";
          this.changeFlashImg = changeFlashImg;
          window.dispatchEvent(
            new CustomEvent("onOperation", {
              detail: {
                data: this.operation,
              },
            })
          );
        }
      } else if (this.viewId == 4) {
        // let changeFlash = document.getElementsByClassName('changeFlash');
        // for (let i = 0; i < changeFlash.length; i++) {
        //    if (this.operation.flashlight == '0') { //开启
        //     changeFlash[i].src = this.otherchangeFlashImg2;
        //     this.userList[i].flashlight = '1';
        //     // document.getElementsByClassName('other')[i].muted = true;
        //   } else {
        //     changeFlash[i].src = this.otherchangeFlashImg;
        //     this.userList[i].flashlight = '0';
        //   }
        //   window.dispatchEvent(
        //     new CustomEvent('onOperation', {
        //       detail: {
        //         data: this.userList[i]
        //       }
        //     })
        //   )
        // }
      }
    },
    //镭射灯开关
    LaserLight() {
      console.log(this.viewId);
      if (this.viewId == 3) {
        if (this.operation.laserlight == "0") {
          this.operation.laserlight = "1";
          this.LaserLightImg = LaserLightImg2;
          console.log(this.operation);
          window.dispatchEvent(
            new CustomEvent("onOperation", {
              detail: {
                data: this.operation,
              },
            })
          );
        } else {
          this.operation.laserlight = "0";
          this.LaserLightImg = LaserLightImg;
          window.dispatchEvent(
            new CustomEvent("onOperation", {
              detail: {
                data: this.operation,
              },
            })
          );
        }
      } else if (this.viewId == 4) {
        var that = this;
        if (this.operation.laserlight == "0") {
          this.operation.laserlight = "1";
        } else {
          this.operation.laserlight = "0";
          this.LaserLightImg = LaserLightImg;
        }
        // this.isFullMore = !this.isFullMore;
        setTimeout(function () {
          that.$message.error("net err");
        }, 3000);
      }
    },
    // 静音
    Mute() {
      this.isMute = !this.isMute;
      if (this.isMute == false) {
        // 静音
        this.MuteImg = MuteImg;
        this.localStream.getAudioTracks()[0].enabled = true;
      } else {
        this.MuteImg = MuteImg2;
        this.localStream.getAudioTracks()[0].enabled = false;
      }
    },

    // 视频会议 -- 静音某成员
    otherMute(i) {
      // this.muteList
      let muteImg = document.getElementsByClassName("mute")[i];
      if (muteImg.src == this.otherMuteImg2) {
        muteImg.src = this.otherMuteImg;
        this.userList[i].mic = "1";
        window.dispatchEvent(
          new CustomEvent("onOperation", {
            detail: {
              data: this.userList[i],
            },
          })
        );
        // document.getElementsByClassName('other')[i].muted = true;
      } else if (muteImg.src == this.otherMuteImg) {
        //静音
        muteImg.src = this.otherMuteImg2;
        this.userList[i].mic = "0";
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
    // 通讯录表单数据点击按钮
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    // 添加成员
    async addUser() {
      if (this.isInvited) {
        this.DetectionDrawer = true;
        // 请求筛选终端成员
        const { data: res2 } = await this.$http.post(
          "contact/findContact",
          qs.stringify({
            pageSize: 999,
            pageNum: 1,
          })
        );
        this.multipleSelectionZ = res2.data.list;
      }
    },
    addUserSend() {
      this.DetectionDrawer = false;
      window.dispatchEvent(
        new CustomEvent("inviteVideo", {
          detail: {
            id: 4,
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
      let dom = document.getElementsByClassName("videoUserName");
      let img = document.getElementsByClassName("changeFlash");
      // console.log(e.detail.userlist)
      if (dom) {
        this.userList = e.detail.userlist;
        dom.forEach((element, i) => {
          element.innerHTML = e.detail.userlist[i].realName;
        });

        if (this.isInvitedShow == "block") {
          //有权限
          img.forEach((element, j) => {
            console.log(e.detail.userlist[j].userType);
            if (e.detail.userlist[j].userType == "2") {
              element.style.cssText =
                "width:16%;height:14%;position:absolute;bottom:5px;left:5px;cursor:pointer;z-index:999;display:block;";
            }
          });
        }
      }
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
      console.log(this.localStream);
      if (this.localStream !== null) {
        if (e.detail.mic == "0") {
          this.MuteImg = MuteImg;
          this.localStream.getAudioTracks()[0].enabled = false;
        } else {
          this.MuteImg = MuteImg2;
          this.localStream.getAudioTracks()[0].enabled = true;
        }
      }
    },
    // 开启闪光灯
    otherchangeFlash(i) {
      let changeFlash = document.getElementsByClassName("changeFlash")[i];
      if (changeFlash.src == this.otherchangeFlashImg) {
        changeFlash.src = this.otherchangeFlashImg2;
        this.userList[i].flashlight = "1";
        window.dispatchEvent(
          new CustomEvent("onOperation", {
            detail: {
              data: this.userList[i],
            },
          })
        );
        // document.getElementsByClassName('other')[i].muted = true;
      } else if (changeFlash.src == this.otherchangeFlashImg2) {
        //静音
        changeFlash.src = this.otherchangeFlashImg;
        this.userList[i].flashlight = "0";
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
  },
};
</script>

<style scoped>
#videoWrap #videoMAP {
  height: 8.166667rem;
  width: 15.291667rem;
  position: absolute;
  top: 10%;
  left: 800%;
  /* left: 15%; */
  z-index: 9999;
  overflow: hidden;
  /* border: 1px solid rgb(228, 228, 228); */
  border-radius: 12px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}
#videoWrap #videoMAP .leftfunction {
  width: 40px;
  list-style: none;
  position: absolute;
  top: 100px;
  left: -20px;
  z-index: 999;
}

#videoWrap #videoMAP .leftfunction li {
  margin-bottom: 10px;
  width: 40px;
}
#videoWrap #videoMAP .leftfunction li img {
  width: 0.5rem;
  height: 0.5rem;
  cursor: pointer;
}
#videoWrap #videoMAP .leftfunction li .mutecss {
  margin-top: 10px;
  margin-left: 7px;
  width: 25px;
  height: 35px;
}

#videoWrap #videoMAP .videoBtn {
  margin-top: 10px;
  width: 1rem;
  height: 0.5rem;
  border-radius: 8px;
  color: #fff;
  line-height: 1;
  white-space: nowrap;
  cursor: pointer;
  font-size: 14px;
  border-radius: 4px;
  float: right;
  margin-right: 15px;
}

#videoWrap #videoMAP .minbtn {
  border: 1px solid #67c23a;
  background-color: #67c23a;
}

#videoWrap #videoMAP .closebtn {
  border: 1px solid #f56c6c;
  background-color: #f56c6c;
}

#videoWrap #videoMAP .adduser {
  border: 1px solid #1a1818;
  background-color: #1a1818;
}
#videoWrap #videoMAP .noadduser {
  cursor: not-allowed;
  border: 1px solid #c8c9cc;
  background-color: #c8c9cc;
  outline: 0 none;
}

#videoWrap #videoMAP .box-card {
  height: 100%;
  width: 100%;
  position: absolute;
  top: 0;
  left: 0;
}

#videoWrap #videoMAP .tag {
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
#videoWrap #videoMAP .tag-height {
  height: 300px;
}
#videoWrap #videoMAP .tag-height-two {
  height: 360px;
}
#videoWrap #videoMAP .tag .tag-header img {
  display: block;
  margin-left: 85px;
}
#videoWrap #videoMAP .tag .tag-main {
  margin-top: 50px;
  font-size: 16px;
}
#videoWrap #videoMAP .box-card-three {
  position: absolute;
  top: 0px;
  left: 100%;
}
#videoWrap #videoMAP .box-card-three .userList {
  position: absolute;
  top: 0.7rem;
  right: 30px;
  width: 1.8rem;
  border: 1px solid rgb(209, 209, 209);
  background-color: #ffffff;
}
#videoWrap #videoMAP .box-card-one {
  position: absolute;
  top: 0px;
  left: 0px;
}
#videoWrap #videoMAP .box-card-two {
  height: 100%;
  position: absolute;
  width: 100%;
  background-color: #fff;
}
#videoWrap #videoMAP .box-card-two .clearfix {
  height: 0.6rem;
  line-height: 0.6rem;
  border-bottom: 1px solid rgb(220, 220, 220);
}
#videoWrap #videoMAP .box-card-two .clearfix .sptitle {
  display: inline-block;
  height: 60px;
  line-height: 60px;
  margin-left: 20px;
  font-size: 20px;
  color: #1596ff;
  font-weight: 700;
}

#videoWrap #videoMAP .box-card-two .clearfix .calltime {
  font-size: 15px;
  color: #1596ff;
  display: inline-block;
  margin-left: 80px;
}

#videoWrap #videoMAP .box-card-two .clearfix img {
  float: right;
  height: 30px;
  width: 30px;
}
#videoWrap #videoMAP .box-card-two .mainleft,
#videoWrap #videoMAP .box-card-two .mainleftMore {
  position: relative;
  margin: 10px;
  width: 100%;
  height: 92%;
  overflow: hidden;
  border: 1px solid rgb(153, 153, 153);
  background-color: rgb(153, 153, 153);
}
#videoWrap #videoMAP .box-card-two .mainleftfull,
#videoWrap #videoMAP .box-card-two .mainleftMorefull {
  position: absolute;
  top: 0;
  left: 0;
  margin: 0px;
  height: 100%;
  width: 100%;
  border: 1px solid rgb(153, 153, 153);
  background-color: rgb(153, 153, 153);
}
#videoWrap #videoMAP .box-card-two #meMore {
  height: 64%;
  width: 1000px;
  display: block;
  margin: 0 auto;
}
#videoWrap #videoMAP .box-card-two #meMoreFull {
  height: 100%;
  width: 1000px;
  display: block;
  margin: 0 auto;
}
#videoWrap #videoMAP .box-card-two .mainleft ul,
#videoWrap #videoMAP .box-card-two .mainleftMore ul {
  float: left;
  /* margin-left: 10px; */
  padding-left: 15px;
}
#videoWrap #videoMAP .box-card-two .mainleft li,
#videoWrap #videoMAP .box-card-two .mainleftMore li {
  list-style: none;
}
#videoWrap #videoMAP .box-card-two .smallVideo {
  position: absolute;
  bottom: 1rem;
  left: 10px;
  width: 0;
  height: 0;
  padding-right: 2px;
  background-color: rgb(102, 102, 102);
  border: 1px solid white;
  cursor: pointer;
  z-index: 999;
}
#videoWrap #videoMAP .box-card-two .bigVideo {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
}
/* #videoWrap #videoMAP .box-card-two .mainleft .meVideo {
  float: left;
  margin-left: 5px;
  width: 230px;
} */
#videoWrap #videoMAP .box-card-two .mainleftMore .videosBottom .moreVideo {
  width: 185px;
}
#videoWrap
  #videoMAP
  .box-card-two
  .mainleftMore
  .videosBottom
  .moreVideo
  .otherVideo {
  /* width: 185px; */
  width: 250px !important;
}
/* #videoWrap #videoMAP .box-card-two .mainleftMore .videosBottom .moreVideo .videoUserName {
  position:absolute;
  top:0;
  left:0;
  width:180px;
  text-align:center;
  color:white;
} */
#videoWrap
  #videoMAP
  .box-card-two
  .mainleftMore
  .videosBottom
  .moreVideo
  .noChangeFlash {
  display: none !important;
}

#videoWrap #videoMAP .box-card-two .videosBottom {
  position: absolute;
  bottom: .7rem;
  left: 0;
  margin-top: 5px;
  /* width: 9999999px; */
  width: 100%;
  overflow: hidden;
  height: 34%;
}
#videoWrap #videoMAP .box-card-two #videosMore {
  width: 100%;
  height: 100%;
  position: absolute;
}
#videoWrap #videoMAP .box-card-two .mainright {
  float: left;
  margin-left: 20px;
  /* width: 330px;
  height: 750px;
  background-color: skyblue; */
}
#videoWrap #videoMAP .box-card-two .mainleftAll {
  width: 1600px;
  height: 800px;
  /* background-color: pink; */
}
#videoWrap #videoMAP .meVideo .miniul {
  position: absolute;
  bottom: -20px;
  right: 10px;

  /* position: relative; */
}
#videoWrap #videoMAP .meVideo .miniul li {
  float: right;
}
/* #videoMAP .box-card-three .meVideo:nth-of-type(2){
  position: absolute;
  bottom: 10px;
  left: 300px;
  margin-left: 250px;
} */

/* #videoMAP .box-card-three .meVideoTwo {
  margin-left: 500px;
}
#videoMAP .box-card-three .meVideoThree {
  margin-left: 750px;
}
#videoMAP .box-card-three .meVideoFour {
  margin-left: 1000px;
} */

#videoWrap .mainleft div:nth-of-type(4) {
  margin-left: 250px;
}
#videoWrap .mainleft div:nth-of-type(5) {
  margin-left: 500px;
}
#videoWrap .mainleft div:nth-of-type(6) {
  margin-left: 750px;
}
#videoWrap .mainleft div:nth-of-type(7) {
  margin-left: 1000px;
}

#videoWrap #min {
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
 #myCanvas {
  position: absolute;
  top: -9999px;
  left: -9999px;
}
</style>

<style>
#videoWrap #videoMAP .box-card-three .el-button {
  color: #fff !important;
}
#videoWrap #videoMAP .el-card {
  /* background-color: rgb(65, 65, 65); */
  /* background-color: rgb(3, 175, 243); */
  background-color: white;
  border-radius: 12px;
}
#videoWrap #min .el-button {
  margin-bottom: 15px;
}
#videoWrap #videoMAP .userList .el-card__body {
  height: 85%;
  cursor: pointer;
}
#videoWrap #videoMAP .userList .userli {
  font-size: 16px;
  padding: 10px 0px 10px 20px;
  cursor: pointer;
}
#videoWrap #videoMAP .box-card-one > .el-card__body {
  height: 85%;
}
</style>
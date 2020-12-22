// 无声侦护页面
<template>
  <div id="fullWrap">
    <!-- @mousedown="moveVideo" -->
    <div id="fullMAP" :class="isdrawer?'fullMAPdrawer':'fullMAPdialog'">
      <!-- 视频会议-呼叫通话中-窗口 -->
      <div class="box-card box-card-full-three box-card-two">
        <div slot="header" class="clearfix" :class="isdrawer?'clearfix1':'clearfix2'">
          <span :class="isdrawer?'sptitled':'sptitle'">无声侦护</span>
          <button class="fullBtn closebtn" v-show="!isdrawer" @click="CloseCell">关 闭</button>
          <button class="fullBtn minbtn" v-show="!isdrawer" @click="miniMize">收起</button>
          <button class="fullBtn adduser" v-show="!isdrawer" @click="addUser">添加成员</button>
          <!-- <el-button style="float: right;margin-right:10px;" size="medium" @click="addCallvideo">添加成员</el-button> -->
          <div class="drawerimg" v-show="isdrawer">
            <img class="closeimg" @click="CloseCellImg" :src="CloseDImg" alt />
            <img class="quarterimg" @click="quarterScreen" :src="quarterScreenImg" alt />
          </div>
        </div>
        <div class="mainleftfullMore">
          <div id="videosfullMore" style="width:0;height:0;position:absolute;top:0;left:0">
            <video id="mefullMore" autoplay style=" width:0;height:0"></video>
          </div>
          <canvas id="myCanvas" width="300" height="360"></canvas>
          <!-- <div class="screenwrap fullScreen">
                  <div class="fullheader">
                    <ul class="topfunction">
                      <li><img alt=""></li>
                      <li><img alt=""></li>
                      <li><img alt=""></li>
                      <li><img alt=""></li>
                      <li><img alt=""></li>
                      <li><img alt=""></li>
                      <li><img alt=""></li>
                    </ul>
                  </div>
                  <div class="fullVideo"></div>
          </div>-->
        </div>
      </div>
      <!-- 添加成员 -->
      <el-dialog :visible.sync="DetectionDrawer" width="40%" center :modal="false" title="添加成员">
        <el-table
                style="width: 100%"
                height="300"
                @selection-change="handleSelectionChange"
                :data="multipleSelectionZ"
        >
          <el-table-column type="selection" :selectable="selectEnable"></el-table-column>
          <el-table-column label="在线状态">
            <template slot-scope="scope">
              <span class="yuan" v-if="scope.row.status != 0"></span>
              <span class="yuan , hui" v-else></span>
            </template>
          </el-table-column>
          <el-table-column label="账号类型">
            <span>终端用户</span>
          </el-table-column>
          <el-table-column label="姓名" prop="fullName"></el-table-column>
          <el-table-column label="工种名称" prop="workName"></el-table-column>
        </el-table>
        <span slot="footer" class="dialog-footer">
          <el-button @click="DetectionDrawer = false">取 消</el-button>
          <el-button type="warning" @click="addUserSend">确 定</el-button>
        </span>
      </el-dialog>

      <div
              id="controlbtn"
              @click="controlClick"
              v-if="unFoldRule"
              v-show="talkCss"
      >{{ controltext }}</div>
    </div>
    <div id="minfull" @mousedown="moveVideo">
      <el-card class="minCard" style="width:500px;">
        <span class="sptitle">无声侦护中。。。</span>
        <el-button style="float: right;margin-right:15px;" type="danger" @click="CloseCell">结束无声侦护</el-button>
        <el-button style="float: right;margin-right:15px;" type="success" @click="maxMization">最大化</el-button>
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
  import recordImg from "../assets/images/2113@2x.png";
  import recordImg2 from "../assets/images/2072@2x.png";
  import screenShotImg from "../assets/images/2112@2x.png";
  import closeImg from "../assets/images/2114@2x.png";
  import rightSpin from "../assets/images/2110@2x.png";
  import leftSpin from "../assets/images/2109@2x.png";
  import muteImg from "../assets/images/mute.png";
  import muteImg2 from "../assets/images/mute2.png";
  import CloseDImg from "../assets/images/u2183.png";
  import quarterScreenImg from "../assets/images/u2184.png";

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
        videotime: "00:00",
        fullScreenImg: fullScreenImg,
        recordImg: recordImg,
        screenShotImg: screenShotImg,
        recordImg2: recordImg2,
        fullScreenImg2: fullScreenImg2,
        closeImg: closeImg,
        muteImg: muteImg,
        muteImg2: muteImg2,
        rightSpin: rightSpin,
        leftSpin: leftSpin,
        CloseDImg: CloseDImg,
        quarterScreenImg: quarterScreenImg,
        isSingleScreen: false,
        otherStream: [],
        otherVideo: [],
        fullId: "",
        roomId: "",
        roomName: "",
        spin: 0,
        videoNum: 0,
        DetectionDrawer: false,
        multipleSelection: [],
        multipleSelectionZ: [],
        userList: [],
        isdrawer: true, //无声侦护默认侧边栏 展 示, 控制侧边栏或弹出框
        controltext: "展 开",
        controlShow: false,
        talkCss: false,
        roleList: [],
        sint: null, // canvas录制视频定时器
        unFoldRule: false,
        // path: "ws://118.190.38.198:8080/video/web/",
        // path: "ws://192.168.0.16:8083/video/web/",
      };
    },
    created() {
      // this.getIdData();
      this.getMessage();
      // rtc.on('remove_peer', function(data) {

      // })
    },
    mounted() {
      // this.startVideo();
      // 监听邀请
      window.addEventListener("inviteFullStart", this.startVideo);
      // 监听成员信息
      window.addEventListener(
              "findUserInfoBySocketIduserList",
              this.findUserInfoBySocketIduserList
      );
      // 初始化无声侦护监听事件
      this.initFullScreen();
      // 监听排队挂断
      window.addEventListener("callwaitAnswer", this.waitCloseCell);
      //控制无声侦护显示
      window.addEventListener("onTalkbackClose", this.closeTalkback);
      if (localStorage.getItem("initTalkback") == "true") {
        this.talkCss = true;
      }
      var that = this;
      window.addEventListener("onFullScreenShow", function (e) {
        if (e.detail.status == 1) {
          that.talkCss = true;
        }
        let arr = localStorage.roleData.split(",");
        arr = arr.map(Number);
        // arr = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13];
        // const arr = JSON.parse(sessionStorage.roleData);
        that.roleList = arr;

        if (
                that.roleListCom.indexOf(3) > -1 &&
                that.roleListCom.indexOf(4) > -1
        ) {
          that.unFoldRule = false;
        } else {
          that.unFoldRule = true;
        }
      });
      if (localStorage.roleData) {
        let arr = localStorage.roleData.split(",");
        arr = arr.map(Number);
        // arr = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13];
        // const arr = JSON.parse(sessionStorage.roleData);
        this.roleList = arr;
      }
      // (this.unFoldRule);
    },
    computed: {
      username() {
        // return this.$route.query.username
        let user = JSON.parse(localStorage.getItem("user")).username;
        return user;
      },
      roleListCom() {
        if (localStorage.roleData) {
          let arr = localStorage.roleData.split(",");
          arr = arr.map(Number);
          // arr = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13];
          // const arr = JSON.parse(sessionStorage.roleData);
          this.roleList = arr;
        }
        return this.roleList;
      },
      // unFoldRule() {
      //   if (
      //     this.roleListCom.indexOf(3) > -1 &&
      //     this.roleListCom.indexOf(4) > -1
      //   ) {
      //     return false;
      //   } else {
      //     return true;
      //   }
      // }
    },
    methods: {
      // 关闭无声侦护
      closeTalkback() {
        this.talkCss = false;
      },
      //   获取从通讯录页面传来的值来判断显示什么界面
      getIdData() {
        // this.viewId = this.$route.params.id;
        //   this.viewId = this.$route.params.id;
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
      // 收起
      miniMize() {
        if (this.unFoldRule) {
          this.isdrawer = true;
          this.fullWidth(false);
        } else {
          // 最小化
          var domFull = document.getElementById("fullMAP");
          domFull.style.cssText = "left:800%;";
          var minVideo = document.getElementById("minfull");
          minVideo.style.cssText = "left:800px;";
        }
      },

      // 最大化
      maxMization() {
        var domFull = document.getElementById("fullMAP");
        domFull.style.cssText = "left:15%;";
        var minVideo = document.getElementById("minfull");
        minVideo.style.cssText = "left:800%;";
      },
      //挂断操作
      async CloseCell() {
        // let minVideo = document.getElementById('minfull');
        // minVideo.style.cssText = 'left:800%;';
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
        localStorage.setItem("fullScreen", false);

        if (this.unFoldRule) {
          this.controlShow = false;
          await this.miniMize();
          this.controltext = "展 开";
          let fullMAPdrawer = document.getElementsByClassName("fullMAPdrawer")[0];
          fullMAPdrawer.style.cssText = "";
        } else {
          var domFull = document.getElementById("fullMAP");
          domFull.style.cssText = "left:800%;";
          let minVideo = document.getElementById("minfull");
          // (minvideo)
          minVideo.style.cssText = "left:800%;";
        }

        this.videoShow = false;
        var that = this;
        rtc.closePC();
        rtc.on("socket_closed", function (socket) {
          // that.$router.push({ path: "/home" });
          localStorage.setItem("isclose", false);
        });
        document.getElementById("mefullMore").srcObject = null;
        let screenwrapdom = document.getElementsByClassName("screenwrap");
        for (let i = screenwrapdom.length - 1; i >= 0; i--) {
          screenwrapdom[i].parentNode.removeChild(screenwrapdom[i]);
        }
        this.videoNum = 0;
        // window.location.reload();
        this.otherStream.splice(0, this.otherStream.length);
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
      // 关闭
      closefull(i) {
        let userName;
        this.otherStream.splice(i, 1);
        let screenwrap = document.getElementsByClassName("screenwrap")[i];
        let other = document.getElementsByClassName("other")[i];
        let id = other.getAttribute("id");
        let socketIdObj = id.split("other-")[1];
        let screenwrapdom = document.getElementsByClassName("screenwrap");
        if(screenwrapdom.length){
          let userList = this.userList
          userList.forEach(item=>{
            if(item.socketId == socketIdObj){
              userName = item.username
            }
          })
          window.dispatchEvent(
                  new CustomEvent("onSendCloseMessage", {
                    detail: {
                      userName: userName,
                      roomId: this.roomId,
                      roomName: this.roomName,
                      eventName: this.viewId
                    },
                  })
          );
        }

        let data = {
          socketId: socketIdObj
        };

        // (data);
        rtc.emit("_remove_peer", data);
      },
      // 开始视频
      startVideo(e) {
        // let arr = localStorage.roleData.split(",");
        // arr = arr.map(Number);
        // // arr = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13];
        // // const arr = JSON.parse(sessionStorage.roleData);
        // this.roleList = arr;
        localStorage.setItem("isclose", true);
        this.roomId = e.detail.room;
        this.roomName = e.detail.room;
        this.viewId = e.detail.id;
        var domFull = document.getElementById("fullMAP");
        //   var videoOne = document.getElementsByClassName('box-card-one')[0];
        var videoFullThree = document.getElementsByClassName(
                "box-card-full-three"
        )[0];
        if (this.viewId === 5) {
          if (this.unFoldRule) {
            this.controlShow = true;
            let fullMAPdrawer = document.getElementsByClassName("fullMAPdrawer")[0];
            this.controltext = "收 起";
            fullMAPdrawer.style.cssText = "right: 0px;";
          } else {
            this.quarterScreen();
            domFull.style.cssText = "left:15%;";
            videoFullThree.style.cssText = "left:0px;";
          }
        }

        //连接WebSocket服务器
        rtc.connect("wss://webrtc.ytha-hd.com/wss/video/web", e.detail.room);
      },
      initFullScreen() {
        var videos = "";
        // ("无声侦护", this.viewId);
        videos = document.getElementById("videosfullMore");
        let that = this;
        // (videos);
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
          document.getElementById("mefullMore").srcObject = stream;
          document.getElementById("mefullMore").play();
          // 设置本地不播放自己的声音
          document.getElementById("mefullMore").volume = 0.0;
          // 禁用本地麦克风
          stream.getAudioTracks()[0].enabled = false;

        });
        //创建本地视频流失败
        rtc.on("stream_create_error", function () {
          alert("create stream failed!");
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

        rtc.on("remove_peer", function (socketId) {
          that.videoNum = that.videoNum - 1;
          var video = document.getElementById("other-" + socketId);
          video.parentNode.parentNode.parentNode.removeChild(
                  video.parentNode.parentNode
          );
          let screenwrapdom = document.getElementsByClassName("screenwrap");
          if (screenwrapdom.length == 0) {
            that.CloseCell();
          }else{

          }
        });

        //接收到其他用户的视频流
        rtc.on("pc_add_stream", function (stream, socketId) {
          that.otherStream.push(stream);
          let list = {
            isSingleScreen: false, // 是否单屏
            isRecord: false, // 是否开始录屏
          };
          that.otherVideo.push(list);
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
          var fullMore = document.querySelector(".mainleftfullMore");
          var fullScreen = document.createElement("div");
          fullScreen.setAttribute("class", "screenwrap");
          fullScreen.classList.add("fullScreen");

          fullScreen.innerHTML =
                  // "<div class='screenwrap fullScreen'>"+
                  "<div class='fullheader'>" +
                  "<div class='user'></div>" +
                  "<ul class='topfunction'>" +
                  "<li><img class='fullScreenImg' src='" + that.fullScreenImg + "'></li>" +
                  "<li><img class='leftSpin' src='" + that.leftSpin + "'></li>" +
                  "<li><img class='rightSpin' src='" + that.rightSpin + "'></li>" +
                  "<li><img class='screenShotImg' src='" + that.screenShotImg + "'></li>" +
                  "<li><img class='muteImg' src='" + that.muteImg2 + "'></li>" +
                  "<li><img class='recordImg' src='" + that.recordImg + "'></li>" +
                  "<li><img class='closeImg' src='" + that.closeImg + "'></li>" +
                  "</ul>" +
                  "</div>" +
                  "<div class='fullVideo'></div>";
          fullMore.appendChild(fullScreen);

          // that.userList = JSON.parse(localStorage.getItem('findUserInfoBySocketIduserList'))

          var mainleft = document.getElementsByClassName("fullVideo")[
                  that.videoNum
                  ];
          //  (that.userList, that.videoNum)

          // mainleft.style.cssText =
          var newVideo = document.createElement("video");
          var id = "other-" + socketId;
          newVideo.setAttribute("class", "other");
          newVideo.setAttribute("autoplay", "autoplay");
          newVideo.setAttribute("id", id);
          newVideo.style.cssText = "width:100%;height:100%;";
          mainleft.appendChild(newVideo);
          rtc.attachStream(stream, id);
          // (rtc);

          let arr = document.getElementsByClassName("fullScreenImg");
          // 添加点击事件
          for (let i = 0; i < arr.length; i++) {
            let fullScreenClick = document.getElementsByClassName("fullScreenImg")[i];
            let screenShotClick = document.getElementsByClassName("screenShotImg")[i];
            let recordClick = document.getElementsByClassName("recordImg")[i];
            let closeClick = document.getElementsByClassName("closeImg")[i];
            let leftSpinClick = document.getElementsByClassName("leftSpin")[i];
            let rightSpinClick = document.getElementsByClassName("rightSpin")[i];
            let muteImgClick = document.getElementsByClassName("muteImg")[i];
            (function (i) {
              fullScreenClick.onclick = function () {
                that.fullScreen(i);
              };
              screenShotClick.onclick = function () {
                that.screenShot(i);
              };
              recordClick.onclick = function () {
                that.record(i);
              };
              closeClick.onclick = function () {
                // 关闭某一个侦护
                that.closefull(i);
              };
              leftSpinClick.onclick = function () {
                that.leftSpinClick(i);
              };
              rightSpinClick.onclick = function () {
                that.rightSpinClick(i);
              };
              muteImgClick.onclick = function () {
                // 静音
                that.muteImgClick(i);
              };
            })(i);
            // fullScreenClick.addEventListener('click', that.fullScreen())
            // screenShotClick.addEventListener('click', that.screenShot())
            // recordClick.addEventListener('click', that.record())
            // closeClick.addEventListener('click', that.closefull())
          }
          that.videoNum = that.videoNum + 1;
          // (that.videoNum);
          if (that.unFoldRule) {
          } else {
            that.quarterScreen();
          }
        });
      },
      //挂断电话
      // hangUp() {
      //   //删除其他用户
      //   rtc.on("remove_peer", function(socketId) {
      //     var video = document.getElementById("other-" + socketId);
      //     video.parentNode.parentNode.removeChild(video.parentNode);
      //   });
      //   ("---close---");
      // },
      // 通话时间
      videoTiming() {
        var that = this;
        // window.setInterval(function() {
        //   that.videotime =
        // }, 1000);
      },
      // 切换单屏
      fullScreen(i) {
        let fullScreenImg = document.getElementsByClassName("fullScreenImg")[i];
        let screenwrap = document.getElementsByClassName("screenwrap")[i];
        if (fullScreenImg.src == this.fullScreenImg) {
          fullScreenImg.src = this.fullScreenImg2;
          screenwrap.classList.remove("fullScreen");
          screenwrap.classList.add("singleScreen");
          document.getElementById('fullMAP').style.width = document.body.clientWidth+ 'px'
          document.getElementById('fullMAP').style.height =document.body.clientHeight+ 'px'
          document.getElementById('fullMAP').style.left = 0
          if (!this.isdrawer) {
            screenwrap.classList.remove("fullScreenwidth");
          }
        } else {
          fullScreenImg.src = this.fullScreenImg;
          screenwrap.classList.remove("singleScreen");
          this.maxMization()
          screenwrap.classList.add("fullScreen");
          if (!this.isdrawer) {
            screenwrap.classList.add("fullScreenwidth");
          }
        }
        // this.otherVideo[i].isSingleScreen = !this.otherVideo[i].isSingleScreen;
      },
      // 录屏
      record(i) {
        let otherVideo = document.getElementsByClassName("other")[i];
        let recordImg = document.getElementsByClassName("recordImg")[i];
        let fullVideo = document.getElementsByClassName("fullVideo")[i];
        // ()
        if (recordImg.src == this.recordImg) {
          recordImg.src = this.recordImg2;
          // (this.otherStream)
          // RS.mediaStream = this.otherStream[i];
          // (otherVideo.srcObject)
          // RS.mediaStream = otherVideo.srcObject;
          // RS.startRecord(true);
          let c = document.getElementById("myCanvas");
          let ctx = c.getContext("2d");
          //每20毫秒画一次图
          // v.addEventListener('play', function() {
          this.sint = setInterval(() => {
            ctx.drawImage(otherVideo, 0, 0, 300, 360);
            //打印当前视频的播放时间
            // (otherVideo.currentTime);
          }, 20);
          RS.mediaStream = c.captureStream();
          RS.startRecord(true);
          // fullVideo.style.border = '2px solid blue';
        } else if (recordImg.src == this.recordImg2) {
          clearInterval(this.sint);
          recordImg.src = this.recordImg;
          RS.stopRecord();
          RS.downloadRecord();
          // fullVideo.style.border = '0px solid blue';
        }
      },

      // 截屏
      screenShot(i) {
        let otherVideo = document.getElementsByClassName("other")[i];
        let fullVideo = document.getElementsByClassName("fullVideo")[i];
        let myCanvas = document.createElement("canvas");
        myCanvas.width = fullVideo.clientWidth;
        myCanvas.height = fullVideo.clientHeight;
        fullVideo.appendChild(myCanvas);
        let ctx = myCanvas.getContext("2d");
        // video.clientWidth
        ctx.drawImage(
                otherVideo,
                0,
                0,
                fullVideo.clientWidth,
                fullVideo.clientHeight
        );
        let url = myCanvas.toDataURL("image/png");
        const oA = document.createElement("a");
        oA.download = ""; // 设置下载的文件名，默认是'下载'
        oA.href = url;
        document.body.appendChild(oA);
        oA.click();
        oA.remove();
      },

      // 静音
      muteImgClick(i) {
        let muteImg = document.getElementsByClassName("muteImg")[i];
        if (muteImg.src == this.muteImg2) {
          muteImg.src = this.muteImg;
          document.getElementsByClassName("other")[i].muted = true;
        } else if (muteImg.src == this.muteImg) {
          muteImg.src = this.muteImg2;
          document.getElementsByClassName("other")[i].muted = false;
        }
      },
      // 左旋转
      leftSpinClick(i) {
        this.spin = this.spin - 90;
        let other = document.getElementsByClassName("other")[i];
        other.style.webkitTransform = "rotate(" + this.spin + "deg)";
        other.style.mozTransform = "rotate(" + this.spin + "deg)";
        other.style.msTransform = "rotate(" + this.spin + "deg)";
        other.style.oTransform = "rotate(" + this.spin + "deg)";
        other.style.transform = "rotate(" + this.spin + "deg)";
      },
      // 右旋转
      rightSpinClick(i) {
        this.spin = this.spin + 90;
        let other = document.getElementsByClassName("other")[i];
        other.style.webkitTransform = "rotate(" + this.spin + "deg)";
        other.style.mozTransform = "rotate(" + this.spin + "deg)";
        other.style.msTransform = "rotate(" + this.spin + "deg)";
        other.style.oTransform = "rotate(" + this.spin + "deg)";
        other.style.transform = "rotate(" + this.spin + "deg)";
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
        // (res2);
        this.multipleSelectionZ = [];
        res2.data.list.forEach((element) => {
          if (element.type === 2) {
            this.multipleSelectionZ.push(element);
          }
        });
      },
      addUserSend() {
        this.DetectionDrawer = false;
        window.dispatchEvent(
                new CustomEvent("inviteFull", {
                  detail: {
                    id: 4,
                    full: 0,
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
        var user = document.getElementsByClassName("user");
        if (user) {
          this.userList = e.detail.userlist;
          user.forEach((element, i) => {
            element.innerHTML = e.detail.userlist[i].realName;
          });
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
      //四分屏
      quarterScreen() {
        this.isdrawer = false;
        this.fullWidth(true);
      },
      // 视频宽度调整, 参数a为true时四分屏宽度为49.5%
      fullWidth(a) {
        let screenwrap = document.getElementsByClassName("screenwrap");
        // screenwrap.forEach(element => {
        //   // element.style.cssText = 'width:49.5%;'
        //   if (a) {
        //     element.classList.add("fullScreenwidth");
        //   } else {
        //     element.classList.remove("fullScreenwidth");
        //   }
        // });
        if (screenwrap.length != 0) {
          for (let i = 0; i < screenwrap.length; i++) {
            const element = screenwrap[i];
            if (a) {
              element.classList.add("fullScreenwidth");
            } else {
              element.classList.remove("fullScreenwidth");
            }
          }
        } else {
          setTimeout(() => {
            let screenwrapSto = document.getElementsByClassName("screenwrap");
            for (let i = 0; i < screenwrapSto.length; i++) {
              const element = screenwrapSto[i];
              if (a) {
                element.classList.add("fullScreenwidth");
              } else {
                element.classList.remove("fullScreenwidth");
              }
            }
          }, 1500);
        }
      },
      //收起展开无声侦护
      controlClick() {
        this.controlShow = !this.controlShow;
        let fullMAPdrawer = document.getElementsByClassName("fullMAPdrawer")[0];
        if (this.controlShow) {
          this.controltext = "展 开";
          fullMAPdrawer.style.cssText = "right:-15rem;";
        } else {
          this.controltext = "收 起";
          fullMAPdrawer.style.cssText = "right: 0px;";
        }
      },
      CloseCellImg() {
        let fullScreen = document.getElementsByClassName("fullScreen");
        if (fullScreen.length !== 0) {
          this.CloseCell();
        } else {
          this.$message.error("暂无可关闭的无声侦护");
        }
      },
    },
  };
</script>

<style>
  #fullWrap .fullMAPdrawer {
    height: calc(100% - 80px);
    width: 15rem;
    position: absolute;
    top: 80px;
    right: -15rem;
    transition: right 0.5s;
    -moz-transition: right 0.5s;
    -webkit-transition: right 0.5s;
    -o-transition: right 0.5s;
    z-index: 9999;
    background-color: #fff;
    /* overflow: hidden; */
  }
  #fullWrap .fullMAPdialog {
    min-height: 9rem;
    width: 16rem;
    position: absolute;
    top: 10%;
    left: 15%;
    z-index: 9999;
    background-color: #fff;
    border-radius: 12px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    overflow: hidden;
  }
  #fullWrap #fullMAP .tag {
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
  #fullWrap #fullMAP .tag-height {
    height: 300px;
  }
  #fullWrap #fullMAP .tag-height-two {
    height: 360px;
  }
  #fullWrap #fullMAP .tag .tag-header img {
    display: block;
    margin-left: 85px;
  }
  #fullWrap #fullMAP .tag .tag-main {
    margin-top: 50px;
    font-size: 16px;
  }
  #fullWrap #fullMAP .box-card-full-three {
    position: absolute;
    top: 0px;
    left: 100%;
  }
  #fullWrap #fullMAP .box-card-one {
    position: absolute;
    top: 0px;
    left: 0px;
  }
  #fullWrap #fullMAP .box-card-two {
    height: 100%;
    position: absolute;
    top: 0px;
    left: 0px;
    width: 100%;
  }
  #fullWrap #fullMAP .fullBtn {
    margin-top: 10px;
    width: 240px;
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
  #fullWrap #fullMAP .minbtn {
    border: 1px solid #67c23a;
    background-color: #67c23a;
  }

  #fullWrap #fullMAP .closebtn {
    border: 1px solid #f56c6c;
    background-color: #f56c6c;
  }

  #fullWrap #fullMAP .box-card-two .clearfix .drawerimg {
    float: right;
    padding: 18px;
  }

  #fullWrap #fullMAP .box-card-two .clearfix .closeimg {
    /* display: inline-block; */
    width: 24px;
    height: 24px;
    margin-left: 18px;
    cursor: pointer;
  }

  #fullWrap #fullMAP .box-card-two .clearfix .quarterimg {
    /* display: inline-block; */
    width: 24px;
    height: 24px;
    margin-right: 18px;
    cursor: pointer;
  }

  #fullWrap #fullMAP .adduser {
    border: 1px solid #1a1818;
    background-color: #1a1818;
  }

  #fullWrap #fullMAP .box-card-two .clearfix {
    height: 0.6rem;
    line-height: 0.6rem;
    border-bottom: 1px solid rgb(220, 220, 220);
  }
  #fullWrap #fullMAP .box-card-two .clearfix1 {
    background-color: rgb(51, 51, 51);
  }
  #fullWrap #fullMAP .box-card-two .clearfix2 {
    background-color: #fff;
  }

  #fullWrap #fullMAP .box-card-two .clearfix .sptitle {
    display: inline-block;
    height: 60px;
    line-height: 60px;
    margin-left: 20px;
    font-size: 20px;
    color: #1596ff;
    font-weight: 700;
  }
  #fullWrap #fullMAP .box-card-two .clearfix .sptitled {
    display: inline-block;
    height: 60px;
    line-height: 60px;
    margin-left: 20px;
    font-size: 20px;
    color: #fff;
    font-weight: 700;
  }

  #fullWrap #fullMAP .box-card-two .clearfix img {
    float: right;
    height: 30px;
    width: 30px;
  }
  #fullWrap #fullMAP .box-card-two .mainleftfullMore {
    width: 100%;
    height: 8.4rem;
    overflow: hidden;
    overflow-y: scroll;
  }
  #fullWrap #fullMAP .box-card-two .mainleftfullMore ul {
    float: left;
    /* margin-left: 10px; */
    padding-left: 15px;
  }
  #fullWrap #fullMAP .box-card-two .mainleftfullMore li {
    list-style: none;
  }
  #fullWrap #fullMAP .box-card-two .mainleftfullMore .meVideo {
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

  #fullWrap #fullMAP .box-card-two .mainleftfullMore .fullVideo {
    overflow: hidden;
    width: 100%;
    height: 100%;
  }

  #fullWrap #fullMAP .box-card-two .mainleftfullMore .singleScreen {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    border: 1px solid rgb(121, 121, 121);
    background-color: rgb(51, 51, 51);
    z-index: 999;
  }

  #fullWrap #fullMAP .box-card-two .mainleftfullMore .fullScreen {
    float: left;
    /* width: 49.8%; */
    width: 100%;
    height: 4rem;
    border: 1px solid rgb(121, 121, 121);
    background-color: rgb(51, 51, 51);
    overflow: hidden;
  }
  #fullWrap #fullMAP .box-card-two .mainleftfullMore .fullScreenwidth {
    width: 49.5% !important;
  }
  #fullWrap #fullMAP .box-card-two .mainleftfullMore .fullheader {
    position: relative;
    height: .5rem;
    background-color: rgb(255, 255, 255);
  }
  #fullWrap #fullMAP .box-card-two .mainleftfullMore .fullheader .topfunction {
    height: .5rem;
    list-style: none;
    position: absolute;
    top: 0px;
    right: 0px;
    margin: 0;
  }
  #fullWrap #fullMAP .box-card-two .mainleftfullMore .fullheader .topfunction li {
    width: .5rem;
    padding: 5px;
    float: left;
  }
  #fullWrap
  #fullMAP
  .box-card-two
  .mainleftfullMore
  .fullheader
  .topfunction
  li
  img {
    width: .4rem;
    height: .4rem;
    cursor: pointer;
  }
  #fullWrap
  #fullMAP
  .box-card-two
  .mainleftfullMore
  .fullheader
  .topfunction
  li
  .muteImg {
    border: 1px solid rgb(29, 29, 29);
    width: .3rem;
    height: .3rem;
    padding: 5px;
    border-radius: 50%;
  }

  #fullWrap #fullMAP .box-card-two .mainleftfullMore .fullheader .user {
    float: left;
    height: .5rem;
    line-height: .5rem;
    margin-left: 10px;
    font-size: 16px;
  }

  #fullWrap #fullMAP .box-card-two .mainright {
    float: left;
    margin-left: 20px;
    /* width: 330px;
    height: 750px;
    background-color: skyblue; */
  }
  #fullWrap #fullMAP .box-card-two .mainleftAll {
    width: 1600px;
    height: 800px;
    /* background-color: pink; */
  }
  #fullWrap #fullMAP .box-card-full-three .el-button {
    color: #fff !important;
  }
  #fullWrap #fullMAP .meVideo .miniul {
    position: absolute;
    bottom: -20px;
    right: 10px;

    /* position: relative; */
  }
  #fullWrap #fullMAP .meVideo .miniul li {
    float: right;
  }
  /* #fullMAP .box-card-full-three .meVideo:nth-of-type(2){
    position: absolute;
    bottom: 10px;
    left: 300px;
    margin-left: 250px;
  } */

  /* #fullMAP .box-card-full-three .meVideoTwo {
    margin-left: 500px;
  }
  #fullMAP .box-card-full-three .meVideoThree {
    margin-left: 750px;
  }
  #fullMAP .box-card-full-three .meVideoFour {
    margin-left: 1000px;
  } */

  #fullWrap .mainleft div:nth-of-type(4) {
    margin-left: 250px;
  }
  #fullWrap .mainleft div:nth-of-type(5) {
    margin-left: 500px;
  }
  #fullWrap .mainleft div:nth-of-type(6) {
    margin-left: 750px;
  }
  #fullWrap .mainleft div:nth-of-type(7) {
    margin-left: 1000px;
  }

  #fullWrap #minfull {
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

  #fullWrap #minfull .el-button {
    margin-bottom: 15px;
  }

  #fullWrap .fullMAPdrawer #controlbtn {
    position: absolute;
    top: 50%;
    margin-top: -60px;
    left: -43px;
    padding: 50px 10px 50px 10px;
    /* height: 120px; */
    background-color: rgb(15, 15, 15);
    font-size: 18px;
    writing-mode: vertical-lr;
    color: #fff;
    cursor: pointer;
  }
  #fullWrap #myCanvas {
    position: absolute;
    top: -9999px;
    left: -9999px;
  }
</style>
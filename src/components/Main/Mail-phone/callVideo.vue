// 视频通话页面
<template>
  <div id="videoMAP">
    <!-- 视频通话1v1 -->
    <div class="tag" @mousedown="move" v-if="viewId == 3" v-show="cellphone">
      <div class="tag-header">
        <img src="../../../assets/images/组 2176.png" alt />
        <span> {{ username }} </span>
      </div>
      <div class="tag-main">
        <p>视频通话拨号中...</p>
      </div>
      <div class="tag-foot">
        <el-button type="danger" @click="CloseCell">挂断</el-button>
      </div>
    </div>
    <!-- 视频会议 -->
    <div class="tag" @mousedown="move" v-if="viewId == 4" v-show="cellphone">
      <div class="tag-header" style="margin-bottom:95px;">
        <!-- <img src="../../../assets/images/组 2176.png" alt />
        <span>username</span>-->
      </div>
      <div class="tag-main">
        <p>视频会议拨号中...</p>
      </div>
      <div class="tag-foot">
        <el-button type="danger" @click="CloseCell">挂断</el-button>
      </div>
    </div>
    <!-- 视频通话-通话中-窗口 -->
    <template v-if="videoShow">
      <el-card class="box-card box-card-two" v-if="viewId == 3">
        <div slot="header" class="clearfix" v-if="extendVideoData == false">
          <span>1v1视频</span>
          <!-- <el-button style="float: right; padding: 3px 0" type="danger" size="medium">挂断</el-button> -->
          <img src="../../../assets/images/组 2079.png" alt @click="CloseCell" />
        </div>
        <div :class="['mainleft', extendVideoData == false?'':'mainleftAll']">
          <div class="icones-left">
            <ul style="display:none">
              <li @click="extendVideo">
                <img src="../../../assets/images/组 2067.png" alt v-if="extendVideoData == false" />
                <img src="../../../assets/images/组 2068.png" v-else alt />
              </li>
              <li @click="changeRadium">
                <img src="../../../assets/images/组 2066.png" alt v-if="RadiumLamp == false" />
                <img src="../../../assets/images/组 2069.png" alt v-else />
              </li>
              <li @click="changeFlash">
                <img src="../../../assets/images/组 2065.png" alt v-if="FlashLamp ==false" />
                <img src="../../../assets/images/组 2070.png" alt v-else />
              </li>
              <li @click="changeScreenshots">
                <img src="../../../assets/images/组 2064.png" alt v-if="Screenshots ==false" />
                <img src="../../../assets/images/组 2071.png" alt v-else />
              </li>
              <li @click="changeRecording">
                <img src="../../../assets/images/组 2063.png" alt v-if="Recording ==false" />
                <img src="../../../assets/images/组 2072.png" alt v-else />
              </li>
            </ul>
            <div id="videos" style="width:1250px;height:750px;position:absolute;top:0;left:0"></div>
          </div>

          <div class="meVideo" v-if="extendVideoData == false">
            <span></span>
            <video id="me" autoplay style=" width: 200px;height: 266px;"></video>
          </div>
        </div>
        <!-- <div class="mainright" v-if="extendVideoData == false">
          <span>在线人数：（4）</span>
          <el-table :data="tableData" style="width: 100%" :show-header="false" max-height="500">
            <el-table-column prop="name" width="180"></el-table-column>
          </el-table>
        </div> -->
      </el-card>
    </template>
    <!-- 视频会议-呼叫通话中-窗口 -->
    <el-card class="box-card box-card-three box-card-two" v-if="viewId == 4">
      <div slot="header" class="clearfix" v-if="extendVideoDataTwo == false">
        <span>视频会议</span>
        <el-button style="float: right;" size="medium">结束会议</el-button>
        <!-- <el-button style="float: right;margin-right:10px;" size="medium" @click="addCallvideo">添加成员</el-button> -->
      </div>
      <div :class="['mainleft', extendVideoDataTwo == false?'':'mainleftAll']">
        <div id="videos" style="width:1250px;height:750px;position:absolute;top:0;left:0">
          <video id="me" autoplay style=" width:1250px;height:466px;"></video>
        </div>
        <div class="icones-left">
          <!-- <ul>
            <li>
              <span></span>
            </li>
            <li @click="extendVideoTwo">
              <img src="../../../assets/images/组 2067.png" alt v-if="extendVideoDataTwo == false" />
              <img src="../../../assets/images/组 2068.png" v-else alt />
            </li>
            <li @click="changeRadium">
              <img src="../../../assets/images/组 2066.png" alt v-if="RadiumLamp == false" />
              <img src="../../../assets/images/组 2069.png" alt v-else />
            </li>
            <li @click="changeFlash">
              <img
                src="../../../assets/images/组 2082.png"
                alt
                v-if="FlashLamp ==false"
                style="height:38px;width:38px"
              />
              <img src="../../../assets/images/组 2072.png" alt v-else />
            </li>
          </ul> -->
        </div>
      </div>
      <!-- <div class="mainright" v-if="extendVideoDataTwo == false">
        <span>在线人数：（4）</span>
        <el-table :data="tableData" style="width: 100%" :show-header="false" max-height="500">
          <el-table-column prop="name" width="180"></el-table-column>
        </el-table>
      </div> -->
    </el-card>
                                                                          
    <!-- 视频会议-呼叫通话中-窗口 -添加成员弹框 -->
    <el-dialog title="添加视频会议成员" :visible.sync="addcalldialogVisible" width="30%">
      <el-table
        ref="multipleTable"
        :data="addtableData"
        tooltip-effect="dark"
        style="width: 100%"
        @selection-change="ADDhandleSelectionChange"
        :show-header="false"
        max-height="500"
      >
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column prop="name" width="120"></el-table-column>
        <el-table-column prop="workType" show-overflow-tooltip></el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addcalldialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addcalldialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import SkyRTC from "../../../assets/js/SkyRTC-client.js";
var rtc = SkyRTC();

export default {
  data() {
    return {
      message: '',
      viewId: 0, //判断传过来的id是多少就显示什么弹框；
      positionX: 0, //鼠标位移地址
      positionY: 0,
      cellphone: true, //通话框显示
      tableData: [
        {
          name: "王小虎"
        },
        {
          name: "王麻子"
        },
        {
          name: "老王"
        },
        {
          name: "小明"
        }
      ],
      extendVideoData: false, //视频全屏控制按钮
      RadiumLamp: false, //镭射灯开关
      FlashLamp: false,
      Screenshots: false,
      Recording: false,
      addcalldialogVisible: false,
      // 添加视频通话表单多选框数据
      multipleSelection: [],
      addtableData: [
        {
          name: "终端姓名",
          workType: "工种名称"
        },
        {
          name: "终端姓名",
          workType: "工种名称"
        },
        {
          name: "终端姓名",
          workType: "工种名称"
        },
        {
          name: "终端姓名",
          workType: "工种名称"
        },
        {
          name: "终端姓名",
          workType: "工种名称"
        }
      ],
      extendVideoDataTwo: false,
      videoShow: true, //视频窗口显示
      videoArray: [], //存放video标签
      socket: null,
      videotime: '00:00'
      // path: "ws://118.190.38.198:8080/video/web/",
      // path: "ws://192.168.0.16:8083/video/web/",
    };
  },
  created() {
    this.getIdData();
    this.getMessage();
    rtc.on('remove_peer', function(data) {
      (data)
    })
  },
  mounted() {
    this.startVideo();
    // (sessionStorage.getItem('user'))
  },
  computed: {
    username() {
      // return this.$route.query.username
      let user = JSON.parse(sessionStorage.getItem('user')).username
      (user)
      return user
    }
  },
  methods: {
    //   获取从通讯录页面传来的值来判断显示什么界面
    getIdData() {
      // this.viewId = this.$route.params.id;
      this.viewId = this.$route.params.id;
      (this.viewId);
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
      document.onmousemove = e => {
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
      document.onmouseup = e => {
        document.onmousemove = null;
        document.onmouseup = null;
      };
    }, // 鼠标位移end
    //挂断操作
    CloseCell() {
      // closeWS();
      var that = this;
      rtc.closePC();
      rtc.on('socket_closed',function(socket) {
        // document.getElementById("me").pause();
        // document.getElementById("me").srcObject = null;
        // let mainDom = document.getElementById("videos");
        // let meVideo = document.getElementsByClassName('meVideo')
        // (meVideo[0])
        // if (meVideo) {
        //   for (let index = 0; index < meVideo.length; index++) {
        //     mainDom.removeChild(meVideo[index]);
        //   }
        // }
        that.$router.push({ path: "/home" });
        localStorage.setItem('isclose', true)
        // var x = document.getElementsByClassName("meVideo");
        // ("len:" + x.length);
        // while (x.length > 0) {
        //   x[0].remove();
        // }
        // (document.getElementsByClassName("meVideo"))
      })
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
    ADDhandleSelectionChange(val) {
      this.multipleSelection = val;
    },
    // 视频会议-呼叫通话中-窗口 -全屏
    extendVideoTwo() {
      this.extendVideoDataTwo = !this.extendVideoDataTwo;
    },
    // 开始视频
    startVideo() {
      var videos = document.getElementById("videos");
      let that = this;
      //成功创建WebSocket连接
      rtc.on("connected", function(socket) {
        //创建本地视频流
        rtc.createStream({
          video: true,
          audio: true
        });
      });
      //创建本地视频流成功
      rtc.on("stream_created", function(stream) {
        // let meVideo = createElement("video");
        // let meID = 'me';
        // meVideo.setAttribute("autoplay", "autoplay");
        // meVideo.style.cssText = "width:1250px;height:466px;";
        document.getElementById("me").srcObject = stream;
        document.getElementById("me").play();
        // 设置本地不播放自己的声音
        document.getElementById("me").volume = 0.0;
      });
      //创建本地视频流失败
      rtc.on("stream_create_error", function() {
        alert("create stream failed!");
      });
      //接收到其他用户的视频流

      if (that.viewId == 3) {
        //1v1视频
        rtc.on("pc_add_stream", function(stream, socketId) {
          var newVideo = document.createElement("video");
          var id = "other-" + socketId;
          newVideo.setAttribute("class", "meVideo");
          newVideo.setAttribute("autoplay", "autoplay");
          newVideo.setAttribute("id", id);
          newVideo.style.cssText = "width:1230px;height:730px;";
          videos.appendChild(newVideo);
          rtc.attachStream(stream, id);
        });
      }

      //视频会议
      if (that.viewId == 4) {
        rtc.on("pc_add_stream", function(stream, socketId) {
          // var videoList = document.getElementsByClassName('meVideo')
          var mainleft = document.querySelector(".mainleft");
          var newVideo = document.createElement("video");
          var div = document.createElement("div");
          var id = "other-" + socketId;
          div.setAttribute("class", "meVideo");
          div.innerHTML = `<span>username</span>
          <ul class="miniul">
            <li @click="onecallone">
              <img src="../../../assets/images/组 1783(1).png" alt v-if="Recording ==false" />
              <img src="../../../assets/images/组 1783.png" alt v-else />
            </li>
            <li @click="onecalloneTwo">
              <img
                style="width:20px;height:20px"
                src="../../../assets/images/组 2066.png"
                alt
                v-if="Screenshots ==false"
              />
              <img
                style="width:20px;height:20px"
                src="../../../assets/images/组 2069.png"
                alt
                v-else
              />
            </li>
          </ul>`;
          newVideo.setAttribute("class", "other");
          newVideo.setAttribute("autoplay", "autoplay");
          newVideo.setAttribute("id", id);
          newVideo.style.cssText = "width:200px;height:228px;";
          (div);
          // rtc.attachStream(stream, id);
          // that.videoArray.push(newVideo)
          // (that.videoArray)
          // for(let i = 0;i < videoList.length;i++){

          //   if(videoList[i].contains(newVideo)==false){
          //     videoList[i].appendChild(newVideo);
          //   }
          // }
          div.appendChild(newVideo);
          mainleft.appendChild(div);
          rtc.attachStream(stream, id);
          // (rtc);
        });
      }

      //连接WebSocket服务器
      // rtc.connect("ws:" + window.location.href.substring(window.location.protocol.length).split('#')[0]+"/ws", window.location.hash.slice(1));
      // rtc.connect("ws://47.104.69.208:3000/video/web", "1");
      // rtc.connect("wss://www.ytha-hd.com/wss/video/web", '1');
      // ('asdad',sessionStorage.getItem('room'))
      rtc.connect("wss://webrtc.ytha-hd.com/wss/video/web", this.$route.query.room);
    },
    //挂断电话
    hangUp() {
      //删除其他用户
      rtc.on("remove_peer", function(socketId) {
        var video = document.getElementById("other-" + socketId);
        if (video) {
          video.parentNode.removeChild(video);
        }
      });
      ("---close---");
    },
    // 通话时间
    videoTiming() {
      var that = this;
      // window.setInterval(function() {
      //   that.videotime = 
      // }, 1000);
    }
  }
};
</script>

<style>
#videoMAP {
  height: 100%;
}
#videoMAP .tag {
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
#videoMAP .tag-height {
  height: 300px;
}
#videoMAP .tag-height-two {
  height: 360px;
}
#videoMAP .tag .tag-header img {
  display: block;
  margin-left: 85px;
}
#videoMAP .tag .tag-main {
  margin-top: 50px;
  font-size: 16px;
}
/* #videoMAP .box-card-two .clearfix span {
  font-size: 20px;
  color: #1596ff;
  font-weight: 700;
} */

#videoMAP .box-card-two .clearfix img {
  float: right;
  height: 30px;
  width: 30px;
}
#videoMAP .box-card-two .mainleft {
  position: relative;
  float: left;
  width: 1250px;
  height: 750px;
  /* background-color: pink; */
}
#videoMAP .box-card-two .mainleft ul {
  float: left;
  /* margin-left: 10px; */
  padding-left: 15px;
}
#videoMAP .box-card-two .mainleft li {
  list-style: none;
}
#videoMAP .box-card-two .mainleft .meVideo {
  position: absolute;
  bottom: 10px;
  left: 10px;
  width: 200px;
  height: 266px;
  /* border: 1px green solid; */
  /* background-color: green; */
  /* margin-top: 440px;
  margin-left: 30px; */
}
#videoMAP .box-card-two .mainright {
  float: left;
  margin-left: 20px;
  /* width: 330px;
  height: 750px;
  background-color: skyblue; */
}
#videoMAP .box-card-two .mainleftAll {
  width: 1600px;
  height: 800px;
  background-color: pink;
}
#videoMAP .box-card-three .el-button {
  color: #fff !important;
}
#videoMAP .meVideo .miniul {
  position: absolute;
  bottom: -20px;
  right: 10px;

  /* position: relative; */
}
#videoMAP .meVideo .miniul li {
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

.mainleft div:nth-of-type(4) {
  margin-left: 250px;
}
.mainleft div:nth-of-type(5) {
  margin-left: 500px;
}
.mainleft div:nth-of-type(6) {
  margin-left: 750px;
}
.mainleft div:nth-of-type(7) {
  margin-left: 1000px;
}
</style>
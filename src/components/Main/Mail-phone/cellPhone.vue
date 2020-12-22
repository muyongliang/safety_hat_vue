// 通话栏
<template>
  <div id="phones" style="height: 850px;">
    <div id="videos">
      <!-- 视频显示区域 -->
      <video id="me" autoplay></video>
    </div>

    <!-- 语音电话1v1 -->
    <div class="tag" @mousedown="move" v-if="viewId == 1">
      <div class="tag-header">
        <img src="../../../assets/images/组 2176.png" alt />
        <span>username</span>
      </div>
      <div class="tag-main">
        <p>语音通话拨号中...</p>
      </div>
      <div class="tag-foot">
        <el-button type="danger" @click="CloseCell">挂断</el-button>
      </div>
    </div>
    <!-- 1v1语音通话中 -->
    <!-- <div class="tag" @mousedown="move" v-if="viewId == 1" v-show="!cellphone">
      <div class="tag-header">
        <img src="../../../assets/images/组 2176.png" alt />
        <span>username</span>
      </div>
      <div class="tag-main">
        <p>正在通话中</p>
        <span>00:00</span>
      </div>
      <div class="tag-foot">
        <el-button type="danger" @click="CloseCell">挂断</el-button>
        <el-button type="success">录音</el-button>
      </div>
    </div>-->

    <!-- 语音会议 -->
    <div class="tag" @mousedown="move" v-if="viewId == 2" v-show="cellphone">
      <div class="tag-header" style="margin-bottom:95px;">
        <!-- <img src="../../../assets/images/组 2176.png" alt />
        <span>username</span>-->
      </div>
      <div class="tag-main">
        <p>语音会议拨号中...</p>
      </div>
      <div class="tag-foot">
        <el-button type="danger" @click="CloseCell">挂断</el-button>
      </div>
    </div>
    <!-- 语音会议通话中 -->
    <div
      :class="['tag',addBodyData == false?'':'tag-height']"
      @mousedown="move"
      v-if="viewId == 2"
      v-show="!cellphone"
    >
      <div class="tag-header">
        <span v-if="addBodyData == false">4人在线</span>
        <img src="../../../assets/images/组 2176.png" alt @click="addHumBody" />
      </div>
      <div class="tag-chang" v-if="addBodyData == true">
        <el-table
          :data="MailTableData"
          style="width: 100%"
          :show-header="false"
          size="mini"
          max-height="198"
        >
          <el-table-column prop="username"></el-table-column>
          <el-table-column>
            <template slot-scope="scope" @click="changeMailIcon">
              <img src="../../../assets/images/组 1783(1).png" alt v-if="scope.row.mak == 0" />
              <img src="../../../assets/images/组 2114.png" alt v-else-if="scope.row.mak == 1" />
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="tag-main" style="margin-top:0;">
        <p>正在通话</p>
        <span>00:00</span>
      </div>
      <div class="tag-foot">
        <el-button type="danger" @click="CloseCell">挂断</el-button>
        <el-button type="success" @click="addCellMEN">添加</el-button>
      </div>
    </div>

    <!-- 语音会议-被叫通话中 -->
    <!-- <div
      :class="['tag',addBodyData == false?'':'tag-height-two']"
      @mousedown="move"
      v-if="viewId == 2"
      v-show="!cellphone"
    >
      <div class="tag-header">
        <img src="../../../assets/images/组 2176.png" alt />
        <span>发起人姓名</span>
        <br />
        <span>邀请你进行多人通话</span>
        <img src="../../../assets/images/组 2030.png" alt @click="addHumBody" />
      </div>
      <div class="tag-chang" v-if="addBodyData == true">
        <el-table
          :data="MailTableData"
          style="width: 100%"
          :show-header="false"
          size="mini"
          max-height="198"
        >
          <el-table-column prop="username"></el-table-column>
          <el-table-column>
            <template slot-scope="scope" @click="changeMailIcon">
              <img src="../../../assets/images/组 1783(1).png" alt v-if="scope.row.mak == 0" />
              <img src="../../../assets/images/组 2114.png" alt v-else-if="scope.row.mak == 1" />
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="tag-main" style="margin-top:0;">
        <p>正在通话</p>
        <span>00:00</span>
      </div>
      <div class="tag-foot">
        <el-button type="danger" @click="CloseCell">挂断</el-button>
        </div>
    </div>-->

    <!-- 呼叫排队 -->
    <!-- <div class="lineUp" @mousedown="move">
      <p>5人呼叫等待中</p>
      <el-table :data="tableData" size="mini" max-height="200px;" :show-header="false">
        <el-table-column>
          <template slot-scope="scope">
            <el-tag>{{scope.row.Meeting}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="Type" width="80px"></el-table-column>
        <el-table-column prop="name"></el-table-column>
        <el-table-column>
          <el-row>
            <el-col :span="12">
              <el-button type="danger" size="mini">挂断</el-button>
            </el-col>
            <el-col :span="12">
              <el-button type="success" size="mini">接听</el-button>
            </el-col>
          </el-row>
        </el-table-column>
    </el-table>-->

    <!-- <p>5人呼叫等待中</p>
      <template slot-scope="scope">
        <span>{{tableData.Meeting}}</span>
        <span>{{tableData.Type}}</span>
        <span>{{tableData.name}}</span>
    </template>-->
    <!-- </div> -->

    <!-- 对讲对话 -->
    <!-- <div :class="['talk',shrinkBtnNum == false? 'talkbtn':'']" @mousedown="move">
      <el-form
        ref="form"
        :model="form"
        style="margin-top:5px;margin-left:10px;"
        v-show="shrinkBtnNum"
      >
        <el-row>
          <el-col :span="13">
            <el-form-item>
              <el-select v-model="form.region" placeholder="对讲组名称">
                <el-option label="对讲组名称" value="shanghai"></el-option>
                <el-option label="。。。" value="beijing"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="9">
            <el-form-item>
              <el-select v-model="form.regionOne" placeholder="查看成员" @change="viewMemData">
                <el-option label="username01（调度员）" value="shanghai"></el-option>
                <el-option label="username02（终端）" value="beijing"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <p v-show="shrinkBtnNum">00:10</p>
      <div class="talk-bun">
        <img
          src="../../../assets/images/组 2032.png"
          alt
          class="imgOne"
          @click="VoiceSwitch"
          v-if="voiceData == true"
          v-show="shrinkBtnNum"
        />
        <img
          src="../../../assets/images/组 2033.png"
          alt
          class="imgOne"
          @click="VoiceSwitch"
          v-else
          v-show="shrinkBtnNum"
        />

        <span
          :class="['talk-btn',startEnd == true?'':'talk-btnT']"
          @click="chengestartend"
          v-show="shrinkBtnNum"
        ></span>
        <div :class="['talk-dian',startEnd == true?'':'talk-dianT']" v-show="shrinkBtnNum"></div>
        <div :class="['shrink',shrinkBtnNum == false? 'shrinkmini':'']" @click="shrinkBtn"></div>
      </div>
    </div>-->
    <!-- 对讲对话 -->
    <!-- <div :class="['talk',shrinkBtnNum == false? 'talkbtn':'']" @mousedown="move">
      <el-form
        ref="form"
        :model="form"
        style="margin-top:5px;margin-left:10px;"
        v-show="shrinkBtnNum"
      >
        <el-row>
          <el-col :span="13">
            <el-form-item>
              <el-select v-model="form.region" placeholder="对讲组名称">
                <el-option label="对讲组名称" value="shanghai"></el-option>
                <el-option label="。。。" value="beijing"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="9">
            <el-form-item>
              <el-select v-model="form.regionOne" placeholder="查看成员" @change="viewMemData">
                <el-option label="username01（调度员）" value="shanghai"></el-option>
                <el-option label="username02（终端）" value="beijing"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <p v-show="shrinkBtnNum">00:10</p>
      <div class="talk-bun">
        <img
          src="../../../assets/images/组 2032.png"
          alt
          class="imgOne"
          @click="VoiceSwitch"
          v-if="voiceData == true"
          v-show="shrinkBtnNum"
        />
        <img
          src="../../../assets/images/组 2033.png"
          alt
          class="imgOne"
          @click="VoiceSwitch"
          v-else
          v-show="shrinkBtnNum"
        />

        <span
          :class="['talk-btn',startEnd == true?'':'talk-btnT']"
          @click="chengestartend"
          v-show="shrinkBtnNum"
        ></span>
        <div :class="['talk-dian',startEnd == true?'':'talk-dianT']" v-show="shrinkBtnNum"></div>
        <div :class="['shrink',shrinkBtnNum == false? 'shrinkmini':'']" @click="shrinkBtn"></div>
      </div>
    </div>-->

    <!-- 成员信息弹框 -->
    <div class="dia-1">
      <el-dialog title="成员信息" :visible.sync="MemberDialogVisible" width="30%">
        <!-- 主体信息区 -->
        <!-- <el-form ref="findDetliatRef" :model="findDetliat" label-width="120px" style="width:90%">
          <el-form-item label="姓名：">
            <el-input v-model="findDetliat.clientName"></el-input>
          </el-form-item>
          <el-form-item label="账号类型：">
            <el-input v-model="findDetliat.workType"></el-input>
          </el-form-item>
          <el-form-item label="工种：">
            <el-input v-model="findDetliat.workType"></el-input>
          </el-form-item>
          <el-form-item label="电池电量：">
            <el-input v-model="findDetliat.power"></el-input>
          </el-form-item>
          <el-form-item label="主板温度：">
            <el-input v-model="findDetliat.mainTemperature"></el-input>
          </el-form-item>
          <el-form-item label="环境温度：">
            <el-input v-model="findDetliat.environmentOftemperature"></el-input>
          </el-form-item>
          <el-form-item label="气压：">
            <el-input v-model="findDetliat.pressure"></el-input>
          </el-form-item>
          <el-form-item label="网络：">
            <el-input v-model="findDetliat.network"></el-input>
          </el-form-item>
        </el-form>-->
        <div>
          <i>姓名：</i>
          <span>战三</span>
        </div>
        <div>
          <i>账号类型：</i>
          <span>终端账号</span>
        </div>
        <div>
          <i>工种：</i>
          <span>监工</span>
        </div>
        <div>
          <i>电池电量：</i>
          <span>23%</span>
        </div>
        <div>
          <i>主板温度：</i>
          <span>32</span>
        </div>
        <div>
          <i>环境温度：</i>
          <span>28.1</span>
        </div>
        <div>
          <i>气压：</i>
          <span>94.77kp</span>
        </div>
        <div>
          <i>网络：</i>
          <span>wifi</span>
        </div>

        <!-- 底部功能区 -->
        <div class="fn">
          <ul>
            <li @click="VoiceTelephone">
              <img src="../../../assets/images/2018.png" alt />
              <p>语音电话</p>
            </li>
            <li @click="videoTelephone">
              <img src="../../../assets/images/2019.png" alt />
              <p>视频电话</p>
            </li>
            <li @click="VoiceBroadcast">
              <img src="../../../assets/images/2020.png" alt />
              <p>语音广播</p>
            </li>
            <li @click="getTraJecJory">
              <img src="../../../assets/images/2021.png" alt />
              <p>轨迹</p>
            </li>
            <li @click="getDetection">
              <img src="../../../assets/images/2022.png" alt />
              <p>无声侦护</p>
            </li>
          </ul>
        </div>
      </el-dialog>
    </div>

    <!-- 调度员成员信息框 -->
    <div class="dia-1 dia-2">
      <el-dialog title="成员信息" :visible.sync="DispatcherDialogVisible" width="30%">
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
          <ul>
            <li @click="VoiceTelephone">
              <img src="../../../assets/images/2018.png" alt />
              <p>语音电话</p>
            </li>
            <li @click="videoTelephone">
              <img src="../../../assets/images/2019.png" alt />
              <p>视频电话</p>
            </li>
            <li>
              <img src="../../../assets/images/2048.png" alt />
              <p>定位</p>
            </li>
          </ul>
        </div>
      </el-dialog>
    </div>

    <!-- 语音电话栏 -->
    <el-dialog title="语音电话" :visible.sync="voiceVisible" width="14.2%">
      <el-button type="primary" @click="Onevoneget(1)">1V1语音电话</el-button>
      <el-button type="primary " @click="Onevoneget(2)">语音会议</el-button>
    </el-dialog>

    <!-- 视频通话对话框 -->
    <el-dialog title="视频电话" :visible.sync="videoVisible" width="14.2%">
      <el-button type="primary" @click="Onevoneget(3)">1V1视频通话</el-button>
      <el-button type="primary " @click="Onevoneget(4)">视频会议</el-button>
    </el-dialog>
    <!-- 添加语音会议成员弹框 -->
    <el-dialog title="添加语音会议成员" :visible.sync="addTWOdialogVisible" width="30%" center>
      <el-table
        ref="multipleTable"
        :data="TWOtableData"
        tooltip-effect="dark"
        style="width: 100%"
        @selection-change="handleSelectionChange"
        :show-header="false"
        max-height="420"
      >
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column width="120" prop="username"></el-table-column>
        <el-table-column prop="workType" width="120"></el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addTWOdialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addTWOdialogVisible = false">确 定</el-button>
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
      viewId: 0, //判断传过来的id是多少就显示什么弹框；
      positionX: 0, //鼠标位移地址
      positionY: 0,
      cellphone: true, //通话框显示
      // 呼叫排队数据
      tableData: [
        {
          Meeting: "视频会议", //会议类型
          Type: "调度员", //账号类型
          name: "admin_01", //账号名称
          workType: "监工" //工种名称
        },
        {
          Meeting: "语音会议", //会议类型
          Type: "终 端", //账号类型
          name: "admin_123", //账号名称
          workType: "" //工种名称
        },
        {
          Meeting: "视频通话", //会议类型
          Type: "调度员", //账号类型
          name: "username001", //账号名称
          workType: "监工" //工种名称
        },
        {
          Meeting: "语音通话", //会议类型
          Type: "终 端", //账号类型
          name: "username0023", //账号名称
          workType: "" //工种名称
        },
        {
          Meeting: "视频会议", //会议类型
          Type: "调度员", //账号类型
          name: "admin_123123", //账号名称
          workType: "监工" //工种名称
        }
      ],
      // 对讲组表单数据
      form: {
        name: "",
        region: "",
        regionOne: ""
      },
      DispatcherDialogVisible: false,
      MemberDialogVisible: false,
      voiceData: true, // 对讲组声音开关数据
      startEnd: true, //开始讲话判断
      shrinkBtnNum: true, // 对讲框点击放大缩小
      voiceVisible: false, // 触发语音电话栏
      videoVisible: false, //语音电话栏与视频通话对话栏显示与隐藏
      addBodyData: false, //会议通话点击出现成员信息
      MailTableData: [
        { username: "name01", mak: 0 },
        { username: "name02", mak: 0 },
        { username: "name03", mak: 1 },
        { username: "name05", mak: 0 },
        { username: "name06", mak: 0 },
        { username: "name04", mak: 0 }
      ],
      addTWOdialogVisible: false, //添加语音会议成员
      multipleSelection: [], //添加语音会话成员表单多选框数据
      TWOtableData: [
        { username: "调度员姓名", workType: "工种名称" },
        { username: "调度员姓名", workType: "工种名称" },
        { username: "调度员姓名", workType: "工种名称" },
        { username: "调度员姓名", workType: "工种名称" },
        { username: "调度员姓名", workType: "工种名称" },
        { username: "调度员姓名", workType: "工种名称" },
        { username: "调度员姓名", workType: "工种名称" },
        { username: "调度员姓名", workType: "工种名称" },
        { username: "调度员姓名", workType: "工种名称" }
      ] //添加语音会话成员数据
    };
  },
  created() {
    this.getIdData();
  },
  mounted() {
    this.startVideo();
  },
  methods: {
    //   获取从通讯录页面传来的值来判断显示什么界面
    getIdData() {
      this.viewId = this.$route.params.id;
      (this.viewId);
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
    // 通话关闭事件
    CloseCell() {
      // this.cellphone = false;
      this.cellphone = !this.cellphone;
      var that = this;
      rtc.closePC();
      rtc.on("socket_closed", function(socket) {
        that.$router.push({ path: "/home" });
        localStorage.setItem("isclose", true);
      });
    },
    // 点击出现成员信息
    addHumBody() {
      this.addBodyData = !this.addBodyData;
    },
    // 对讲组点阿基成员信息弹框
    viewMemData() {
      //之后需要做判断
      this.DispatcherDialogVisible = true;
      this.MemberDialogVisible = true;
    },
    // 对讲组声音开关数据
    VoiceSwitch() {
      this.voiceData = !this.voiceData;
    },
    //对讲开始结束
    chengestartend() {
      this.startEnd = !this.startEnd;
    },
    // 对讲框点击放大缩小
    shrinkBtn() {
      this.shrinkBtnNum = !this.shrinkBtnNum;
    },
    // 触发语音电话栏
    VoiceTelephone() {
      this.voiceVisible = true;
    },
    // 视频通话栏
    videoTelephone() {
      this.videoVisible = true;
    },
    // 语音广播对话框
    VoiceBroadcast() {
      this.VoiceBroadcastVisible = true;
    },
    // 开始轨迹监控
    getTraJecJory() {
      this.trajectoryVisible = true;
    },
    // 开始无声侦查
    getDetection() {
      this.DetectionDrawer = true;
    },
    // 电话/视频  跳转通话栏网页
    Onevoneget(id) {
      this.voiceVisible = false;
      this.$router.push({ path: `/mail/phones/` + id });
      // this.OnevoneVisible = true;
    },
    // 点击通话按钮开关通话
    changeMailIcon() {
      if (this.MailTableData.msk == 0) {
        this.MailTableData.msk = 1;
      } else if (this.MailTableData.msk == 1) {
        this.MailTableData.msk = 0;
      }
    },
    // 点击添加回忆成员
    addCellMEN() {
      this.addTWOdialogVisible = true;
    },
    // 添加语音会话成员表单
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    // 开始视频
    startVideo() {
      var videos = document.getElementById("videos");

      //成功创建WebSocket连接
      rtc.on("connected", function(socket) {
        //创建本地视频流
        rtc.createStream({
          video: false,
          audio: true
        });
      });
      //创建本地视频流成功
      rtc.on("stream_created", function(stream) {
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
      rtc.on("pc_add_stream", function(stream, socketId) {
        var newVideo = document.createElement("video");
        var id = "other-" + socketId;
        newVideo.setAttribute("class", "other");
        newVideo.setAttribute("autoplay", "autoplay");
        newVideo.setAttribute("id", id);
        videos.appendChild(newVideo);
        rtc.attachStream(stream, id);
      });
      //删除其他用户
      rtc.on("remove_peer", function(socketId) {
        var video = document.getElementById("other-" + socketId);
        if (video) {
          video.parentNode.removeChild(video);
        }
      });
      //接收到文字信息
      rtc.on("data_channel_message", function(channel, socketId, message) {
        var p = document.createElement("p");
        p.innerText = socketId + ": " + message;
        msgs.appendChild(p);
      });
      //连接WebSocket服务器

      // rtc.connect("ws:" + window.location.href.substring(window.location.protocol.length).split('#')[0]+"/ws", window.location.hash.slice(1));
      rtc.connect(
        "wss://webrtc.ytha-hd.com/wss/video/web",
        this.$route.query.room
      );
      // (window.location.href.substring(window.location.protocol.length).split('#')[0])
      // (window.location.hash.slice(1))
    }
  }
};
</script>

<style scoped>
#iphones {
  width: 100%;
}
#phones .tag {
  position: absolute;
  top: 5%;
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
#phones .tag-height {
  height: 300px;
}
#phones .tag-height-two {
  height: 360px;
}

#phones .tag .tag-header img {
  display: block;
  margin-left: 85px;
}
#phones .tag .tag-main {
  margin-top: 50px;
  font-size: 16px;
}
#phones .lineUp {
  position: absolute;
  top: 40%;
  left: 74%;
  height: 200px;
  width: 500px;
  font-size: 14px;
  /* background-color: pink; */
  overflow: scroll;
  box-sizing: border-box;
  border: 1px solid black;
  cursor: pointer;
}
#phones .talk {
  position: absolute;
  top: 65%;
  left: 85%;
  width: 280px;
  height: 200px;
  border: 1px solid black;
  box-sizing: border-box;
  cursor: pointer;
  border-radius: 8px;
}
#phones .talkbtn {
  width: 50px;
  height: 50px;
}
#phones .talk .el-form-item {
  margin-bottom: 0;
}
#phones .talk .el-form {
  margin-bottom: 20px;
}
#phones .talk p {
  text-align: center;
  display: inline-block;
  /* width: 100%; */
  margin-left: 112px;
  margin-top: 0;
  margin-bottom: 0;
}
#phones .talk .talk-bun {
  height: 100px;
  position: relative;
}
#phones .talk .talk-bun .imgOne {
  margin-top: 20px;
  margin-left: 10px;
}
#phones .talk .talk-bun .talk-btn {
  width: 75px;
  height: 75px;
  border-radius: 50%;
  background-color: skyblue;
  display: inline-block;
  margin-left: 45px;
  font-size: 14px;
  margin-top: 10px;
}
#phones .talk .talk-bun .talk-btnT {
  background-color: red;
}
#phones .talk .talk-bun .talk-btn .sp {
  margin-left: 0;
}
#phones .talk .talk-bun .talk-dian {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: green;
  display: inline-block;
  margin-left: 10px;
  margin-bottom: 60px;
}
#phones .talk .talk-bun .talk-dianT {
  background-color: #909399;
}
#phones .talk .talk-bun .shrink {
  width: 30px;
  height: 30px;
  background-color: yellow;
  display: inline-block;
  margin-left: 50px;
  margin-bottom: -20px;
  border-radius: 0 0 10px 0;
}
#phones .talk .talk-bun .shrinkmini {
  margin-left: 18px;
  margin-bottom: -26px;
}

#videos {
  position: absolute;
  left: 30%;
  top: 0;
  bottom: 0;
  right: 0;
  overflow: auto;
}

#videos video {
  display: inline-block;
  width: 32%;
}
</style>

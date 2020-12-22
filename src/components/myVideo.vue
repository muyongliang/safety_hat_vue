<template>
  <div class="wsmessage" style="position:absolute;top:0;left:0;">
    <!-- 视频通话接听 -->
    <el-dialog
      class="calldialog"
      title="等待接听"
      :visible.sync="isCallShow"
      :close-on-click-modal="false"
      width="30%"
      :center="true"
    >
      <span style="text-align:center;display:inline-block;width:100%;">{{ callerName }}</span>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="isVideo">接 听</el-button>
        <el-button type="primary" @click="iscloseVideo">挂 断</el-button>
      </span>
    </el-dialog>

    <el-dialog
      class="calldialog"
      title="等待接听"
      :visible.sync="iscalling"
      :close-on-click-modal="false"
      width="30%"
      :center="true"
    >
      <span v-if="!waitmessage" style="text-align:center;display:inline-block;width:100%;">通话呼叫中。。。</span>
      <span v-if="waitmessage" style="text-align:center;display:inline-block;width:100%;">对方处于通话中请等待</span>
      <span slot="footer" class="dialog-footer">
        <!-- <el-button @click="dialogVisible = false">取 消</el-button> -->
        <el-button type="primary" @click="closeCall">挂 断</el-button>
      </span>
    </el-dialog>
    <audio id="audioPlay" src="http://downsc.chinaz.net/Files/DownLoad/sound1/202009/13412.mp3" controls="controls" hidden="true"></audio>
  </div>
</template>
<script>
// import { createSocket, sendWSPush, closeWS } from "../plugins/socket";
import qs from "qs";
export default {
  inject: ["reload"],
  name: "my-video",
  data() {
    return {
      //是否正在呼叫
      // iscall: false,
      // socket: null,
      // // path: "ws://118.190.38.198:8080/video/web/",
      // path: "ws://192.168.0.16:8083/video/web/",

      iscall: false,
      //拒绝视频发送数据
      videoParams: {},
      roomId: 0,
      iscalling: false,
      // 是否正在视频
      videoState: false,
      roleList: [],
      userList: [],
      targetlist: [],
      // waitmessage: false,
      state: 0,
      videoOraudio: 1, //1,2是语音，3,4是视频
      callwaitparams: {}, //呼叫排队的消息命令
      videoParamsWait: {}, //呼叫排队接听的消息命令
      videoParamsConfirm: {}, // 确认开启视频后，保存当前的消息信息
      // callerName: '', // 呼叫方的用户名
      callList: [], //呼叫列表
      nowCallMessage: {}, // 当前接听的消息
      invitedNum: 0, //邀请的成员数量
      messclick: {},
      flashData: 0,
    };
  },
  computed: {
    userinfor() {
      if (localStorage.getItem("user") !== null) {
        // this.initSocket() //初始化websocket
        return JSON.parse(localStorage.getItem("user"));
      }
    },
    waitmessage() {
      if (this.iscalling == false) {
        return false;
      } else if (this.state == 2) {
        return true;
      }
    },
    isCallShow() {
      
      if (this.callList.length == 1 && this.videoState == false) {
        return true;
      } else {
        return false;
      }
      
      
    },
    callerName() {
      
      if (this.callList.length > 0) {
        
        if (this.callList[0].eventName == "beInvited") {
          return this.callList[0].data.target[0].name + "的视频通话";
        } else if (this.callList[0].eventName == "beInvitedMore") {
          return this.callList[0].data.target[0].name + "的视频会议";
        } else if (this.callList[0].eventName == "beInvitedVoice") {
          return this.callList[0].data.target[0].name + "的语音通话";
        } else if (this.callList[0].eventName == "beInvitedVoiceMore") {
          return this.callList[0].data.target[0].name + "的语音会议";
        }
      } else {
        return "";
      }
    },
  },
  created() {
    var that = this;
    this.initSocket(); //初始化websocket
    window.addEventListener("onmessageWS", this.getDataFunc); //监听数据接收事件
    // this.closeVideo(); // 挂断
    window.addEventListener("sendBindSocketId", this.bindSocketId); // 绑定socketID
    window.addEventListener("videoState", function (e) {
      if (e.detail.eventName == "正在通话") {
        that.videoState = true;
      } else {
        that.videoState = false;
      }
    });
    

    window.addEventListener("onSendRecord", this.sendRecord); //监听语音广播
    window.addEventListener("onSendCloseMessage", this.sendCloseMessage); // 监听挂断
    window.addEventListener("onOperation", this.operation); //监听功能
    window.addEventListener("callwaitClose", this.closeVideo); //监听排队挂断
    window.addEventListener("callwaitAnswer2", this.isWaitVideo); //监听排队接听
    // this.getRoleDatas();
    // 判断点击报警弹框是不是本页面函数
    this.cellben();
  },
  methods: {
    // 点击触发报警框
    doSomeThing() {
      if (this.$route.path == "/cell") {
        this.reload();
        // this.flashData = 1;
      }
      this.$router.push({ path: "/cell", query: { num: 1 } });
    },
    cellben() {

    },
    // 获取权限数据
    getRoleDatas() {
      let arr = localStorage.roleData.split(",");
      arr = arr.map(Number);
      this.roleList = arr;
    },
    //websocket接收消息
    getDataFunc(e) {
      let mes = JSON.parse(e.detail.data.data);
      let userinfor = JSON.parse(localStorage.getItem("user"));
      this.getRoleDatas();
      // -------------- 挂断消息 --------------------

      if (mes.eventName == "videoConversationEnd") {
        // 对方挂断操作
        window.dispatchEvent(
          new CustomEvent("videoConversationEnd", {
            detail: {
              eventName: "挂断",
            },
          })
        );
      }
      if (mes.eventName == "voiceConversationEnd") {
        // 对方挂断操作
        window.dispatchEvent(
          new CustomEvent("voiceConversationEnd", {
            detail: {
              eventName: "挂断",
            },
          })
        );
      }
      if (mes.eventName == "videoMoreConversationEnd") {
        // 对方挂断操作
        window.dispatchEvent(
          new CustomEvent("videoMoreConversationEnd", {
            detail: {eventName: "挂断",},
          })
        );
      }
      if (mes.eventName == "voiceMoreConversationEnd") {
        // 对方挂断操作
        window.dispatchEvent(
          new CustomEvent("voiceMoreConversationEnd", {
            detail: {
              eventName: "挂断",
            },
          })
        );
      }

      // -------------  其他消息 -------------
      // if (this.roleList.indexOf(4) > -1) {
      if (mes.eventName == "getAlarmRecord") {
        // if (this.roleList.indexOf(4) > -1) {
        //消息推送
        if (mes.data.type == "SOS报警") {
          // warnStates
          window.dispatchEvent(
            new CustomEvent("warnStates", {
              detail: {
                msg: "报警",
              },
            })
          );
          const h = this.$createElement;
          this.messclick = mes;
          this.$notify(
            {
              title: mes.data.type,
              // message:
              //   mes.data.sendName +
              //   " " +
              //   mes.data.number +
              //   " " +
              //   mes.data.tipMessage +
              //   mes.data.recordTime,
              duration: 60000,
              customClass: "styleSos",
              message: h("div", { class: "message" }, [
                h("div", { class: "btnList" }, [
                  h("span", null, mes.data.sendName + " " + mes.data.number + " " + mes.data.tipMessage + mes.data.recordTime),
                  h("p", {class: "latersss", on: {click: this.doSomeThing}}, "查看定位"),
                ]),
              ]),
            }
            // this.logss()
          );
        } else if (mes.data.type == "官方消息") {
          // warnStates
          window.dispatchEvent(
            new CustomEvent("warnStates", {
              detail: {
                msg: "报警",
              },
            })
          );
          this.$notify({
            title: mes.data.type,
            message: mes.data.tipMessage + mes.data.recordTime,
            duration: 60000,
            customClass: "officalNews",
          });
        } else if (mes.data.type == "") {
          // }
          // warnStates
          window.dispatchEvent(
            new CustomEvent("warnStates", {
              detail: {
                msg: "报警",
              },
            })
          );
        } else {
          //报警音效
          let audios = document.getElementById('audioPlay')
          audios.play()
          // warnStates
          window.dispatchEvent(
            new CustomEvent("warnStates", {
              detail: {
                msg: "报警",
              },
            })
          );
          
          {
            this.$notify({
              title: mes.data.type,
              message:
                      mes.data.sendName + " " +
                      // mes.data.number + " " + 
                      mes.data.tipMessage + mes.data.recordTime,
              duration: 60000,
              customClass: "styleOthers",
            });
            // }
          }
        }
      }

      // ------------------- 心跳回复 -------------------
      if (mes.eventName == "heartCheck") {
        let data = {
          data: "",
          eventName: "heartCheck",
          type: "-1",
        };
        this.sendWSPush(data);
      }

      // ------------------- 对讲消息 -------------------
      if (mes.eventName == "talkback") {
        window.dispatchEvent(
          new CustomEvent("playTalkBack", {
            detail: {
              url: mes.data.url,
              groupId: mes.data.groupId,
              realName: mes.data.realName,
            },
          })
        );
      }
      if (mes.eventName == "updateOnline") {
        // 在线状态
        window.dispatchEvent(
          new CustomEvent("updateOnline", {
            detail: {
              eventName: "在线状态",
            },
          })
        );
      }
      // }

      if (mes.eventName == "logout") {
        this.closeWS();
        this.$router.push({ path: "/login" });
      }

      // ---------------- 禁麦消息 -------------
      if (mes.eventName == "operation") {
        window.dispatchEvent(
          new CustomEvent("operationMute", {
            detail: {
              mic: mes.data[0].mic,
            },
          })
        );
      }
      // --------------------------------------

      if (mes.data.room) {
        var data = {
          eventName: "beInvited",
          type: mes.type,
          data: {
            my: {
              id: userinfor.account,
              name: userinfor.username,
              headUrl: "https://pic1.zhimg.com/v2-fda399250493e674f2152c581490d6eb_1200x500.jpg",
              state: "1",
              accountType: "d",
            },
            member: [],
            target: [mes.data.my],
            room: {
              roomId: mes.data.room.roomId,
              roomName: mes.data.room.roomName,
              roomUrl: "roomUrl",
            },
            des: "终端机发起语音呼叫",
            createTime: +new Date(),
          },
        };
      }
      //处于通话中的消息命令  呼叫排队
      var dataCalling = {
        data: {
          createTime: +new Date(),
          des: "处于通话中",
          member: [],
          my: {
            accountType: "d",
            headUrl: "",
            id: userinfor.account,
            name: userinfor.username,
            state: "2",
          },
          room: {
            roomId: this.roomId,
            roomName: this.roomId,
            roomUrl: "",
          },
          target: this.targetlist,
        },
        eventName: "beInvitedVoiceBusy",
        type: "d2d",
      };

      // --------------- 被邀请接收消息 --------------
      if (mes.eventName == "beInvited") {
        // 1v1视频
        this.videoOraudio = 3;
        data.eventName = "beInvited";
        this.roomId = mes.data.room.roomId;
        this.targetlist = mes.data.target;
        this.videoParams = data;
        //  || this.iscall == true
        // if (this.videoState == true) {
        this.videoParamsWait = JSON.parse(JSON.stringify(data));
        this.callList.push(this.videoParamsWait);
        // 1v1视频
        this.videoOraudio = 3;
        window.dispatchEvent(
          new CustomEvent("callWait", {
            detail: {
              type: "视频通话",
              worktype: mes.type,
              username: mes.data.my.name,
              account: mes.data.my.id,
            },
          })
        );
        if (this.videoState == true) {
          //通话中呼叫排队，发送消息
          this.callwaitparams.data.des = "处于通话中";
          this.callwaitparams.data.createTime = +new Date();
          this.callwaitparams.eventName = "beInvitedVoiceBusy";
          this.sendSocket(this.callwaitparams);
        }

        var that = this;
        // 设置55秒未接通主动挂断电话
        setTimeout(function () {
          if (that.iscall == true) {
            window.dispatchEvent(
              new CustomEvent("closeVideo", {
                detail: {
                  // type: '视频通话',
                  // worktype: mes.data.my.accountType,
                  // username: mes.data.my.name
                  index: that.callList.length - 1,
                },
              })
            );
            that.$message({
              message: "呼叫超时未接通",
              type: "warning",
            });
          }
        }, 55000);
        // return;
        // } else {
        //   this.callwaitparams = data;
        // }
      } else if (mes.eventName == "beInvitedMore") {
        // 视频会议
        this.videoOraudio = 4;
        data.eventName = "beInvitedMore";
        this.roomId = mes.data.room.roomId;
        this.targetlist = mes.data.target;
        this.videoParams = data;
        // if (this.videoState == true) {
        this.videoParamsWait = JSON.parse(JSON.stringify(data));
        this.callList.push(this.videoParamsWait);
        //处于通话中，进行呼叫排队
        // 1v1视频
        this.videoOraudio = 4;
        //处于通话中，进行呼叫排队
        window.dispatchEvent(
          new CustomEvent("callWait", {
            detail: {
              type: "视频会议",
              worktype: mes.type,
              username: mes.data.my.name,
              account: mes.data.my.id,
            },
          })
        );
        if (this.videoState == true) {
          //通话中呼叫排队，发送消息
          this.callwaitparams.data.des = "处于通话中";
          this.callwaitparams.data.createTime = +new Date();
          this.callwaitparams.eventName = "beInvitedVoiceBusy";
          this.sendSocket(this.callwaitparams);
        }

        setTimeout(function () {
          if (that.iscall == true) {
            window.dispatchEvent(
              new CustomEvent("closeVideo", {
                detail: {
                  // type: '视频通话',
                  // worktype: mes.data.my.accountType,
                  // username: mes.data.my.name
                  index: that.callList.length - 1,
                },
              })
            );
            that.$message({
              message: "呼叫超时未接通",
              type: "warning",
            });
          }
        }, 55000);
      } else if (mes.eventName == "beInvitedVoice") {
        // 1v1语音
        this.videoOraudio = 1;
        data.eventName = "beInvitedVoice";
        this.roomId = mes.data.room.roomId;
        this.targetlist = mes.data.target;
        this.videoParams = data;
        // if (this.videoState == true) {
        this.videoParamsWait = JSON.parse(JSON.stringify(data));
        this.callList.push(this.videoParamsWait);
        //处于通话中，进行呼叫排队
        window.dispatchEvent(
          new CustomEvent("callWait", {
            detail: {
              type: "语音通话",
              worktype: mes.type,
              username: mes.data.my.name,
              account: mes.data.my.id,
            },
          })
        );
        if (this.videoState == true) {
          //通话中呼叫排队，发送消息
          this.callwaitparams.data.des = "处于通话中";
          this.callwaitparams.data.createTime = +new Date();
          this.callwaitparams.eventName = "beInvitedVoiceBusy";
          this.sendSocket(this.callwaitparams);
        }

        setTimeout(function () {
          if (that.iscall == true) {
            window.dispatchEvent(
              new CustomEvent("closeVideo", {
                detail: {
                  // type: '视频通话',
                  // worktype: mes.data.my.accountType,
                  // username: mes.data.my.name
                  index: that.callList.length - 1,
                },
              })
            );
            that.$message({
              message: "呼叫超时未接通",
              type: "warning",
            });
          }
        }, 55000);
      } else if (mes.eventName == "beInvitedVoiceMore") {
        // 多人语音
        this.videoOraudio = 2;
        data.eventName = "beInvitedVoiceMore";
        this.roomId = mes.data.room.roomId;
        this.targetlist = mes.data.target;
        this.videoParams = data;
        // if (this.videoState == true) {
        this.videoParamsWait = JSON.parse(JSON.stringify(data));
        this.callList.push(this.videoParamsWait);
        //处于通话中，进行呼叫排队
        window.dispatchEvent(
          new CustomEvent("callWait", {
            detail: {
              type: "语音会议",
              worktype: mes.type,
              username: mes.data.my.name,
              account: mes.data.my.id,
            },
          })
        );
        if (this.videoState == true) {
          //通话中呼叫排队，发送消息
          this.callwaitparams.data.des = "处于通话中";
          this.callwaitparams.data.createTime = +new Date();
          this.callwaitparams.eventName = "beInvitedVoiceBusy";
          this.sendSocket(this.callwaitparams);
        }

        setTimeout(function () {
          if (that.iscall == true) {
            window.dispatchEvent(
              new CustomEvent("closeVideo", {
                detail: {
                  // type: '视频通话',
                  // worktype: mes.data.my.accountType,
                  // username: mes.data.my.name
                  index: that.callList.length - 1,
                },
              })
            );
            that.$message({
              message: "呼叫超时未接通",
              type: "warning",
            });
          }
        }, 55000);
      } else if (
        mes.eventName == "invitedVoiceClose" ||
        mes.eventName == "invitedVoiceMoreClose" ||
        mes.eventName == "invitedClose" ||
        mes.eventName == "invitedMoreClose"
      ) {
        // 挂断
        this.iscall = false;
        this.iscalling = false;
        this.$message.error("对方已经挂断");
        // 呼叫排队呼叫方主动挂断
        if (mes.data.room.roomId == "-1" || mes.data.room.roomId == null) {
          window.dispatchEvent(
            new CustomEvent("callerClose", {
              detail: {
                account: mes.data.my.id,
              },
            })
          );
        }

        // this.addMissRecord(mes);
        this.callList.forEach((element, index) => {
          if (element.data.my.id == data.data.my.id) {
            this.callList.splice(index, 1);
          }
        });
      } else if (mes.eventName == "findUserInfoBySocketId") {
        // 查询用户信息
        this.userList.push(mes.data[0]);
        window.dispatchEvent(
          new CustomEvent("findUserInfoBySocketIduserList", {
            detail: {
              userlist: this.userList,
            },
          })
        );
        // localStorage.setItem("findUserInfoBySocketIduserList", JSON.stringify(this.userList));
      }

      // ------------  被邀请确认开启视频  -------------

      if (mes.eventName == "beInvitedRes") {
        this.videoOraudio = 3;
        // 1v1视频
        let that = this;
        // 保存开启视频后的数据
        this.nowCallMessage = JSON.parse(JSON.stringify(this.videoParams));
        localStorage.setItem("callStatus", 3);
        if (mes.data.my.state == "1") {
          setTimeout(function () {
            // that.$router.push({
            //   path: "/mail/callvideo/3",
            //   query: { room: that.roomId }
            // });
            window.dispatchEvent(
              new CustomEvent("inviteVideos", {
                detail: {
                  room: that.roomId,
                  id: 3,
                  userName: mes.data.my.id,
                  fullName: mes.data.my.name,
                  accountType: mes.data.my.accountType,
                },
              })
            );
          }, 2000);
        }
      } else if (mes.eventName == "beInvitedMoreRes") {
        // 保存开启视频后的数据
        this.nowCallMessage = JSON.parse(JSON.stringify(this.videoParams));
        // 多人视频
        let that = this;
        this.videoOraudio = 4;
        localStorage.setItem("callStatus", 4);
        if (mes.data.my.state == "1") {
          setTimeout(function () {
            // that.$router.push({
            //   path: "/mail/callvideo/4",
            //   query: { room: that.roomId }
            // });
            window.dispatchEvent(
              new CustomEvent("inviteVideos", {
                detail: {
                  room: that.roomId,
                  id: 4,
                  username: mes.data.member,
                },
              })
            );
          }, 2000);
        }
      } else if (mes.eventName == "beInvitedVoiceRes") {
        // 保存开启视频后的数据
        this.nowCallMessage = JSON.parse(JSON.stringify(this.videoParams));
        // 1v1语音
        let that = this;
        this.videoOraudio = 1;
        localStorage.setItem("callStatus", 1);
        if (mes.data.my.state == "1") {
          setTimeout(function () {
            // that.$router.push({
            //   path: "/mail/phones/1",
            //   query: { room: that.roomId }
            // });
            window.dispatchEvent(
              new CustomEvent("inviteAudios", {
                detail: {
                  room: that.roomId,
                  id: 1,
                  username: mes.data.my.name,
                  user: mes.data.member,
                },
              })
            );
          }, 2000);
        }
      } else if (mes.eventName == "beInvitedVoiceMoreRes") {
        // 保存开启视频后的数据
        this.nowCallMessage = JSON.parse(JSON.stringify(this.videoParams));
        // 多人语音
        let that = this;
        this.videoOraudio = 2;
        localStorage.setItem("callStatus", 2);
        if (mes.data.my.state == "1") {
          setTimeout(function () {
            // that.$router.push({
            //   path: "/mail/phones/2",
            //   query: { room: that.roomId }
            // });
            window.dispatchEvent(
              new CustomEvent("inviteAudios", {
                detail: {
                  room: that.roomId,
                  id: 2,
                  user: mes.data.member,
                },
              })
            );
          }, 2000);
        }
      }
      // --------------  邀请者确认视频  ------------------------
      if (mes.eventName == "invitedRes") {
        // 保存开启视频后的数据
        this.nowCallMessage = JSON.parse(JSON.stringify(this.videoParams));
        // 1v1视频
        let that = this;
        this.videoOraudio = 3;
        localStorage.setItem("callStatus", 3);
        if (mes.data.my.state == "1") {
          this.callwaitparams.data.room.roomId = mes.data.room.roomId;
          this.callwaitparams.data.room.roomName = mes.data.room.roomName;
          this.state = mes.data.my.state;
          this.iscalling = false;
          setTimeout(function () {
            // that.$router.push({
            //   path: `/mail/callvideo/3`,
            //   query: { room: mes.data.room.roomId }
            // });
            window.dispatchEvent(
              new CustomEvent("inviteVideos", {
                detail: {
                  room: mes.data.room.roomId,
                  id: 3,
                  userName: mes.data.my.id,
                  fullName: mes.data.my.name,
                  accountType: mes.data.my.accountType,
                },
              })
            );
          }, 2000);
        } else if (mes.data.my.state == "2") {
          this.state = mes.data.my.state;
        }
        if (mes.data.des == "对方不在线") {
          if (this.invitedNum !== 0) {
            this.invitedNum = this.invitedNum - 1;
          }
          this.$message.error("对方不在线");
          this.iscalling = false;
        }
        if (mes.data.des == "通话已被拒绝") {
          this.$message.error("通话已被拒绝");
          this.iscalling = false;
        }
      } else if (mes.eventName == "invitedMoreRes") {
        localStorage.setItem("isInvited", true);
        // 保存开启视频后的数据
        this.nowCallMessage = JSON.parse(JSON.stringify(this.videoParams));
        // 多人视频 以及 无声侦护
        let that = this;
        this.videoOraudio = 4;
        localStorage.setItem("callStatus", 4);
        if (mes.data.my.state == "1") {
          this.callwaitparams.data.room.roomId = mes.data.room.roomId;
          this.callwaitparams.data.room.roomName = mes.data.room.roomName;
          this.state = mes.data.my.state;
          this.iscalling = false;
          setTimeout(function () {
            // that.$router.push({
            //   path: `/mail/callvideo/4`,
            //   query: { room: mes.data.room.roomId }
            // });
            if (localStorage.getItem("fullScreen") == "true" && localStorage.getItem("isclose") != "true") {
              localStorage.setItem("isclose", true);
              window.dispatchEvent(
                new CustomEvent("inviteFullStart", {
                  detail: {
                    room: mes.data.room.roomId,
                    id: 5,
                  },
                })
              );
              // localStorage.setItem("fullScreen", false);
            } else if (localStorage.getItem("isclose") != "true") {
              localStorage.setItem("isclose", true);
              let member = mes.data.member.slice(-1);
              window.dispatchEvent(
                new CustomEvent("inviteVideos", {
                  detail: {
                    room: mes.data.room.roomId,
                    id: 4,
                    username: member,
                  },
                })
              );
            }
          }, 2000);
        } else if (mes.data.my.state == "2") {
          this.state = mes.data.my.state;
        }
        if (mes.data.des == "通话已被拒绝") {
          this.invitedNum = this.invitedNum - 1;
          if (this.invitedNum == 0) {
            this.iscalling = false;
            this.$message.error("无人接听");
          } else {
            this.$message.error(mes.data.my.id + "通话已被拒绝");
          }
        }
      } else if (mes.eventName == "invitedVoiceRes") {
        // 保存开启视频后的数据
        this.nowCallMessage = JSON.parse(JSON.stringify(this.videoParams));
        // 1v1语音
        this.videoOraudio = 1;
        localStorage.setItem("callStatus", 1);
        let that = this;
        if (mes.data.my.state == "1") {
          this.callwaitparams.data.room.roomId = mes.data.room.roomId;
          this.callwaitparams.data.room.roomName = mes.data.room.roomName;
          this.state = mes.data.my.state;
          this.iscalling = false;
          setTimeout(function () {
            // that.$router.push({
            //   path: `/mail/callvideo/4`,
            //   query: { room: mes.data.room.roomId }
            // });
            window.dispatchEvent(
              new CustomEvent("inviteAudios", {
                detail: {
                  room: mes.data.room.roomId,
                  id: 1,
                  username: mes.data.my.name,
                  user: mes.data.member,
                },
              })
            );
          }, 2000);
        } else if (mes.data.my.state == "2") {
          this.state = mes.data.my.state;
        }
        if (mes.data.des == "通话已被拒绝") {
          this.$message.error("通话已被拒绝");
          this.iscalling = false;
        }
      } else if (mes.eventName == "invitedVoiceMoreRes") {
        localStorage.setItem("isInvited", true);
        // 保存开启视频后的数据
        this.nowCallMessage = JSON.parse(JSON.stringify(this.videoParams));
        // 多人语音
        let that = this;
        this.videoOraudio = 2;
        localStorage.setItem("callStatus", 2);
        this.iscalling = false;
        if (mes.data.my.state == "1") {
          this.callwaitparams.data.room.roomId = mes.data.room.roomId;
          this.callwaitparams.data.room.roomName = mes.data.room.roomName;
          if (localStorage.getItem("isclose") != "true") {
            localStorage.setItem("isclose", true);
            setTimeout(function () {
              // that.$router.push({
              //   path: `/mail/callvideo/4`,
              //   query: { room: mes.data.room.roomId }
              // });
              window.dispatchEvent(
                new CustomEvent("inviteAudios", {
                  detail: {
                    room: mes.data.room.roomId,
                    id: 2,
                    user: mes.data.member,
                  },
                })
              );
            }, 2000);
          }
        }
      }
      // if (mes.data.des == "通话已被拒绝") {
      //   this.invitedNum = this.invitedNum - 1;
      //   this.$message.error(mes.data.my.id + "通话已被拒绝");
      //   if (this.invitedNum == 0) {
      //     this.iscalling = false;
      //     this.$message.error("无人接听");
      //   }
      // }
      sessionStorage.setItem("jsonMes", mes);
    },
    //邀请视频
    inviteVideoOnoToOne(e) {
      var isfull = "";
      if (e.detail.full == 0) {
        isfull = "secret";
        this.iscalling = false;
      } else {
        this.iscalling = true;
      }
      if (e.detail.id == 3) {
        let userinfor = e.detail.userinfor;
        let targetType = e.detail.targetType;
        let type = e.detail.type;
        let data = {
          eventName: "invited",
          type: type,
          data: {
            my: {
              id: userinfor.account,
              name: userinfor.username,
              headUrl: "https://pic1.zhimg.com/v2-fda399250493e674f2152c581490d6eb_1200x500.jpg",
              state: "1",
              accountType: "d",
            },
            member: [],
            target: [
              {
                id: e.detail.multipleSelection[0].userName,
                name: e.detail.multipleSelection[0].fullName,
                headUrl: "https://pic1.zhimg.com/v2-fda399250493e674f2152c581490d6eb_1200x500.jpg",
                accountType: targetType,
                state: "0",
              },
            ],
            room: {
              roomId: "-1",
              roomName: "房间1",
              roomUrl: "roomUrl",
            },
            des: "调度员发起语音呼叫",
            createTime: +new Date(),
          },
        };
        this.videoParams = data;
        this.callwaitparams = data;
        this.sendSocket(data);
      }
      if (e.detail.id == 4) {
        let userinfor = JSON.parse(localStorage.getItem("user"));
        let targetArr = [];
        e.detail.multipleSelection.forEach((item) => {
          let obj = {
            id: item.userName,
            name: item.fullName,
            headUrl: "https://pic1.zhimg.com/v2-fda399250493e674f2152c581490d6eb_1200x500.jpg",
            accountType: item.type == "1" ? "d" : "z",
            state: "0",
          };
          targetArr.push(obj);
        });
        this.invitedNum = targetArr.length;
        let data = {
          eventName: "invitedMore",
          type: "d2a",
          data: {
            my: {
              id: userinfor.account,
              name: userinfor.username,
              headUrl:"https://pic1.zhimg.com/v2-fda399250493e674f2152c581490d6eb_1200x500.jpg",
              state: "1",
              accountType: "d",
            },
            member: [],
            target: targetArr,
            room: {
              roomId: "-1",
              roomName: "房间1",
              roomUrl: isfull,
            },
            des: "调度员发起语音呼叫",
            createTime: +new Date(),
          },
        };
        if (e.detail.roomId) {
          data.data.room.roomId = e.detail.roomId;
          data.data.room.roomName = String(e.detail.roomId);
        }

        this.videoParams = data;
        this.callwaitparams = data;
        this.sendSocket(data);
        // this.$router.push({ path: `/mail/callvideo/4`});
      }

      if (e.detail.id == 1) {
        let userinfor = e.detail.userinfor;
        let targetType = e.detail.targetType;
        let type = e.detail.type;
        let data = {
          eventName: "invitedVoice",
          type: type,
          data: {
            my: {
              id: userinfor.account,
              name: userinfor.username,
              headUrl:
                "https://pic1.zhimg.com/v2-fda399250493e674f2152c581490d6eb_1200x500.jpg",
              state: "1",
              accountType: "d",
            },
            member: [],
            target: [
              {
                id: e.detail.multipleSelection[0].userName,
                name: e.detail.multipleSelection[0].fullName,
                headUrl:
                  "https://pic1.zhimg.com/v2-fda399250493e674f2152c581490d6eb_1200x500.jpg",
                accountType: targetType,
                state: "0",
              },
            ],
            room: {
              roomId: "-1",
              roomName: "房间1",
              roomUrl: "roomUrl",
            },
            des: "调度员发起语音呼叫",
            createTime: +new Date(),
          },
        };
        this.videoParams = data;
        this.callwaitparams = data;
        this.sendSocket(data);
      }
      if (e.detail.id == 2) {
        let userinfor = JSON.parse(localStorage.getItem("user"));
        let targetArr = [];
        e.detail.multipleSelection.forEach((item) => {
          let obj = {
            id: item.userName,
            name: item.fullName,
            headUrl:"https://pic1.zhimg.com/v2-fda399250493e674f2152c581490d6eb_1200x500.jpg",
            accountType: item.type == "1" ? "d" : "z",
            state: "0",
          };
          targetArr.push(obj);
        });
        this.invitedNum = targetArr.length;
        let data = {
          eventName: "invitedVoiceMore",
          type: "d2a",
          data: {
            my: {
              id: userinfor.account,
              name: userinfor.username,
              headUrl:"https://pic1.zhimg.com/v2-fda399250493e674f2152c581490d6eb_1200x500.jpg",
              state: "1",
              accountType: "d",
            },
            member: [],
            target: targetArr,
            room: {
              roomId: "-1",
              roomName: "房间1",
              roomUrl: "roomUrl",
            },
            des: "调度员发起语音呼叫",
            createTime: +new Date(),
          },
        };
        if (e.detail.roomId) {
          data.data.room.roomId = e.detail.roomId;
          data.data.room.roomName = String(e.detail.roomId);
        }
        this.videoParams = data;
        this.callwaitparams = data;
        this.sendSocket(data);
        // this.$router.push({ path: `/mail/callvideo/4`});
      }

      //55秒未接通
      var that = this;
      setTimeout(function () {
        if (that.iscalling == true) {
          that.iscalling = false;
          that.$message({
            message: "无人接听",
            type: "warning",
          });
          that.closeCall();
        }
      }, 55000);
    },
    bindSocketId(e) {
      // e.detail
      let data = {
        eventName: "bindingSocketId",
        data: [
          {
            username: e.detail.username,
            realName: e.detail.realName,
            socketId: e.detail.socketId,
          },
        ],
        type: "3",
      };
      this.sendSocket(data);
    },
    // 发送语音广播/对讲
    sendRecord(e) {
      (e.detail);
      if (e.detail.id) {
        var data = {
          eventName: "talkback",
          type: e.detail.type,
          data: {
            groupId: e.detail.groupId,
            realName: e.detail.user,
            url: e.detail.content,
          },
        };
      } else {
        var data = {
          eventName: "broadcast",
          type: e.detail.type,
          data: {
            target: e.detail.user,
            content: e.detail.content,
          },
        };
      }

      this.sendSocket(data);
    },
    // 发送挂断命令，断开正在通话的连接
    sendCloseMessage(e) {
      this.userList = [];
      let targetList = [];
      // let closeParams = JSON.parse(JSON.stringify(this.videoParams))
      let closeParams = this.nowCallMessage;
      if(e.detail.userName){
        let username = e.detail.userName
        let target = closeParams.data.target
        target.forEach(item=>{
          if(item.id == username){
            targetList.push(item)
          }
        })
      closeParams.data.target = targetList
      }
      if (e.detail.eventName == 1) {
        closeParams.eventName = "voiceConversationEnd";
      } else if (e.detail.eventName == 2) {
        closeParams.eventName = "voiceMoreConversationEnd";
      } else if (e.detail.eventName == 3) {
        closeParams.eventName = "videoConversationEnd";
      } else if (e.detail.eventName == 4) {
        closeParams.eventName = "videoMoreConversationEnd";
      } else if (e.detail.eventName == 5) {
        closeParams.eventName = "videoMoreConversationEnd";
      }
      closeParams.data.des = "结束会话";
      closeParams.data.createTime = +new Date();
      closeParams.data.room.roomId = e.detail.roomId;
      closeParams.data.room.roomName = e.detail.roomName;
      this.sendSocket(closeParams);
      // this.callList.splice(e.detail.index,1)
    },
    // 是否接听/挂断
    iscloseVideo() {
      window.dispatchEvent(
        new CustomEvent("closeVideo", {
          detail: {
            index: 0,
          },
        })
      );
    },
    // 没通话的挂断
    closeVideo(e) {
      this.iscall = false;
      this.iscalling = false;
      // let closeParams = JSON.parse(JSON.stringify(this.videoParams))
      let closeParams = this.callList[e.detail.index];
      // if (this.videoOraudio == 1) {
      //   closeParams.eventName = "invitedVoiceClose";
      // } else if (this.videoOraudio == 2) {
      //   closeParams.eventName = "invitedVoiceMoreClose";
      // } else if (this.videoOraudio == 3) {
      //   closeParams.eventName = "invitedClose";
      // } else if (this.videoOraudio == 4) {
      //   closeParams.eventName = "invitedMoreClose";
      // }
      // if (closeParams.data) {
      //   closeParams.data.des = "客户端主动挂断连接";
      //   closeParams.data.createTime = +new Date();
      // }
      closeParams.data.my.state = "0";
      this.sendSocket(closeParams);
      // this.addMissRecord(closeParams);
      this.callList.splice(e.detail.index, 1);
      localStorage.setItem("isclose", false);
    },
    // web主动邀请呼叫挂断
    closeCall(e) {

      this.iscall = false;
      this.iscalling = false;
      let closeParams = this.videoParams;
      if (this.videoOraudio == 1) {
        closeParams.eventName = "invitedVoiceClose";
      } else if (this.videoOraudio == 2) {
        closeParams.eventName = "invitedVoiceMoreClose";
      } else if (this.videoOraudio == 3) {
        closeParams.eventName = "invitedClose";
      } else if (this.videoOraudio == 4) {
        closeParams.eventName = "invitedMoreClose";
      }
      if (closeParams.data) {
        closeParams.data.des = "客户端主动挂断连接";
        closeParams.data.createTime = +new Date();
      }
      this.sendSocket(closeParams);
      this.addMissRecord(closeParams);
      localStorage.setItem("isclose", false);
    },
    // 接听
    isVideo() {
      this.iscall = false;
      window.dispatchEvent(
        new CustomEvent("isVideo", {
          detail: {
            index: 0,
          },
        })
      );
      // ('-------------------------- isVideo -------------------------')
      // this.sendSocket(this.videoParams);
    },
    // 等待接听
    isWaitVideo(e) {
      this.sendSocket(this.callList[e.detail.index]);
      this.nowCallMessage = JSON.parse(JSON.stringify(this.callList[e.detail.index]));
      this.callList.splice(e.detail.index, 1);
      if ((this.videoState = false)) {
        this.callList = [];
      }
      this.videoState = true;
    },
    // 镭射灯
    operation(e) {
      //客户端操作终端功能
      let data = {
        eventName: "operation",
        data: [],
        type: "3",
      };
      data.data.push(e.detail.data);
      this.sendSocket(data);
    },
    //初始化websocket
    initSocket() {
      // this.$on('videoMethod', (res) => {
      //   ("---initsocket---", res);
      //   this.createSocket(res);
      // })
      var that = this;
      if (localStorage.getItem("user") !== null) {
        that.createSocket(JSON.parse(localStorage.getItem("user")));
      }
      window.addEventListener(
        "myVideoEvent",
        function (event) {
          that.createSocket(event.detail.data);
          // alert(event.detail.data)
        },
        true
      );
      // 监听邀请
      window.addEventListener("inviteVideo", this.inviteVideoOnoToOne);
      window.addEventListener("inviteAudio", this.inviteVideoOnoToOne);
      window.addEventListener("inviteFull", this.inviteVideoOnoToOne);
    },
    //发送socket数据
    sendSocket(data) {
      this.sendWSPush(data);
    },
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
    async addMissRecord(mes) {
      // 未接来电记录上传
      var closeRecordParams = {
        time: this.format(new Date(), "-"),
        type: 1,
        reason: "挂断",
        answerUserName: mes.data.my.id,
      };
      if (mes.eventName == "invitedVoiceClose") {
        closeRecordParams.type = 1; //语音通话
      } else if (mes.eventName == "invitedVoiceMoreClose") {
        closeRecordParams.type = 2; //语音会议
      } else if (mes.eventName == "invitedClose") {
        closeRecordParams.type = 3; //视频通话
      } else if (mes.eventName == "invitedMoreClose") {
        closeRecordParams.type = 4; //视频会议
      }
      let { data: res } = await this.$http.post(
        "/missedCall/addMissRecord",
        qs.stringify(closeRecordParams)
      );
    },
  },
};
</script>
<style >
.styleSos {
  background-color: #ff3e59;
  border: none;
}
.styleOthers {
  background-color: #ffb142;
  border: none;
}
.officalNews {
  background-color: rgba(0, 204, 255, 1);
  border: none;
}
.el-notification__title {
  color: white;
}
.el-notification__content {
  color: white;
}
.el-notification__closeBtn {
  color: white;
}
.latersss {
  cursor: pointer !important;
}
</style>

<template>
    <div @mousedown="moveVideo" class="callwait" v-if="isShow">
        <div class="listnum">{{listnum}}人等待呼叫</div>
        <!-- v-for="(marker, index) in waitList" :key="index" -->
      <ul v-for="(item, index) in waitList" :key="index">
          <li>
              <button class="calltypebtn">{{item.type}}</button>
              <span> [{{item.worktype}}] {{item.username}} </span>
              <button 
                :class="videoState?'closebtn':index != listnum-1?'noclosebtn':'closebtn'" 
                :disabled="videoState?false:index != listnum-1?true:false" 
                @click="close(index)">
                挂断
              </button>
              <button
                :class="videoState?'answerbtn':index != listnum-1?'noanswerbtn':'answerbtn'" 
                :disabled="videoState?false:index != listnum-1?true:false"  
                @click="answer(index)">
                接听
              </button>
          </li>
      </ul>
    </div>
</template>

<script>
// import { createSocket, sendWSPush, closeWS } from "../plugins/socket";
import qs from 'qs';
export default {
  name: "call-wait",
  data() {
    return {
        waitList: [],
        missParamsList: [],
        nowType: 1,
        videoState: false,
    };
  },
  computed: {
      isShow() {
          if (this.waitList.length != 0) {
            if (this.videoState == false && this.waitList.length < 2) {
              return false;
            } else {
              return true;
            }
          } else {
              return false;
          }
      },
      listnum() {
          return this.waitList.length;
      },
  },
  created() {
    //监听另外的呼叫
    window.addEventListener('callWait', this.callWaitFun);
    //监听超时挂断55秒
      // window.addEventListener('timeOut', this.sendClose)
    var that = this;
    // 监听主叫方主动挂断电话
    window.addEventListener('callerClose', this.callerClose);
    window.addEventListener("videoState", function(e) {
      if (e.detail.eventName == "正在通话") {
        that.videoState = true;
      } else {
        that.videoState = false;
      }
    });
    window.addEventListener('isVideo', this.onAnswer);
    window.addEventListener('closeVideo', this.onClose);
  },
  methods: {
      callWaitFun(e) {
        this.nowType = Number(localStorage.getItem('callStatus')) //当前通话的类型
        this.iscall = e.detail.iscall;
        var missParams = {
            time: '',
            type: 1,
            reason: '挂断',
            answerUserName: e.detail.account
        }
          let userinfo = {
              type: e.detail.type,
              worktype: '',
              username: e.detail.username,
              account: e.detail.account
          }
          if (e.detail.worktype == 'z2d' || e.detail.worktype == 'z2a') {
              userinfo.worktype = '终端'
          } else {
              userinfo.worktype = '调度员'
          }
          if (e.detail.type == '语音通话') {
            missParams.type = 1
          } else if (e.detail.type == '语音会议') {
            missParams.type = 2
          } else if (e.detail.type == '视频通话') {
            missParams.type = 3
          } else if (e.detail.type == '视频会议') {
            missParams.type = 4
          }
          this.missParamsList.push(missParams)
          this.waitList.push(userinfo)
      },
      onClose(e) {
        this.close(e.detail.index);
      },
      onAnswer(e) {
        this.answer(e.detail.index);
      },
      close(i) {
        this.missParamsList[i].time = this.format(new Date(), '-');
        this.addMissRecord(this.missParamsList[i])
        // if (this.videoState) {
          window.dispatchEvent(
            new CustomEvent('callwaitClose', {
                detail: {
                    state: false,
                    index: i,
                }
            })
          ) 
        // }
         
        this.waitList.splice(i,1);
        this.missParamsList.splice(i,1);
      },
      // 呼叫超时挂断
      // sendClose(e) {
      //     for (let i = 0; i < this.waitList.length; i++) {
      //         if (
      //             this.waitList[i].worktype == e.detail.worktype &&
      //             this.waitList[i].username == e.detail.username
      //           ) {
      //               window.dispatchEvent(
      //                   new CustomEvent('callwaitClose', {
      //                       detail: {
      //                           state: false,
      //                           index: i,
      //                       }
      //                   })
      //               ) 
      //             this.waitList.splice(i,1);
      //         }
      //     }
      // },
      answer(i) {
          (this.nowType)
          if (this.videoState == false) {
            window.dispatchEvent(
              new CustomEvent('callwaitAnswer2', {
                  detail: {
                      event: '触发接听',
                      index: i,
                  }
              })
            )
          } else {
            if (this.nowType == 1 || this.nowType == 2) { // 当前处于语音通话
                window.dispatchEvent(
                  new CustomEvent('callwaitAnswerAudio', {
                      detail: {
                          state: true,
                          index: i,
                      }
                  })
              )
            } else {
                window.dispatchEvent(
                  new CustomEvent('callwaitAnswer', { // 当前处于视频通话
                      detail: {
                          state: true,
                          index: i,
                      }
                  })
              )
            }
          }
          
          this.waitList.splice(i,1);
          this.missParamsList.splice(i,1);
      },
      callerClose(e) {
          for (let i = 0; i < this.waitList.length; i++) {
              if (this.waitList[i].account == e.detail.account) {
                 this.waitList.splice(i, 1) 
                 this.missParamsList[i].time = this.format(new Date(), '-');
                 this.addMissRecord(this.missParamsList[i])
              }
          };
          
      },
      async addMissRecord(closeRecordParams) {
        // 未接来电记录上传
        // if (mes.eventName == "invitedVoiceClose") {
        //   closeRecordParams.type = 1; //语音通话
        // } else if (mes.eventName == "invitedVoiceMoreClose") {
        //   closeRecordParams.type = 2; //语音会议
        // } else if (mes.eventName == "invitedClose") {
        //   closeRecordParams.type = 3; //视频通话
        // } else if (mes.eventName == "invitedMoreClose") {
        //   closeRecordParams.type = 4; //视频会议
        // }
        (closeRecordParams)
        let { data: res } = await this.$http.post('/missedCall/addMissRecord', qs.stringify(closeRecordParams))
        ('上传记录',res)
      },
    // 时间格式转化
    // 第一个参数为日期，第二个参数为年月日分割格式 '/'或'-'
    format(Date,str){ 
      var obj = {
        Y: Date.getFullYear(),
        M: Date.getMonth() + 1,
        D: Date.getDate(),
        H: Date.getHours(),
        Mi: Date.getMinutes(),
        S: Date.getSeconds()
      }
      // 拼接时间 hh:mm:ss
      var time = ' ' +this.supplement(obj.H) + ':' + this.supplement(obj.Mi) + ':' + this.supplement(obj.S);
      // yyyy-mm-dd
      if(str.indexOf('-') > -1){
        return obj.Y + '-' + this.supplement(obj.M) + '-' + this.supplement(obj.D) + time;
      }
      // yyyy/mm/dd
      if(str.indexOf('/') > -1){
        return obj.Y + '/' + this.supplement(obj.M) + '/' + this.supplement(obj.D) + time;
      }
    },
    // 时间格式转化,位数不足两位补全0
    supplement(nn){
      return nn = nn < 10 ? '0' + nn : nn;
    },
    // 鼠标位移end
    moveVideo(e) {
      let odiv = e.currentTarget ; //获取目标元素
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
    },
  }
};
</script>
<style>
.callwait {
  border: 1px solid black;
  background-color: white;
  width: 6rem;
  min-height: 4rem;
  border-radius: 8px;
  position: absolute;
  right: 50px;
  top: 160px;
  z-index: 9999;
}
.callwait .listnum {
    height: 50px;
    line-height: 50px;
    font-size: 14px;
    color: red;
    margin-left: 10px;
    margin-top: 5px;
}
.callwait ul {
    /*width: 450px;*/
    list-style: none;
    padding-left: 10px;
}

.callwait ul li{
    font-size: 14px;
    height: .5rem;
    margin-bottom: 20px;
    list-style: none;
    position: relative;
}
.callwait ul li button {
    font-size: 14px;
    width: 1rem;
}
.callwait ul li .calltypebtn {
    width: 1.5rem;
    border: 1px solid rgb(204, 204, 204);
    background-color: white;
    color: rgb(0, 153, 255);
    height: .5rem;
    line-height: .5rem;
    cursor: pointer;
    border-radius: 5px;
}
.callwait ul li .closebtn {
    border: 1px solid #f56c6c;
    background-color: #f56c6c;
    color: white;
    height: .5rem;
    line-height: .5rem;
    cursor: pointer;
    border-radius: 5px;
    margin-right: 50px;
}
.callwait ul li .answerbtn {
    border: 1px solid #67c23a;
    background-color: #67c23a;
    color: white;
    height: .5rem;
    line-height: .5rem;
    cursor: pointer;
    border-radius: 5px;
}

.callwait ul li .noclosebtn {
    border: 1px solid #fab6b6;
    background-color: #fab6b6;
    color: white;
    height: 40px;
    line-height: 40px;
    cursor: not-allowed;
    border-radius: 5px;

}
.callwait ul li .noanswerbtn {
    border: 1px solid #b3e19d;
    background-color: #b3e19d;
    color: white;
    height: 40px;
    line-height: 40px;
    cursor: not-allowed;
    border-radius: 5px;
    position: absolute;
    top: 0;
    right: 20px;
}

</style>

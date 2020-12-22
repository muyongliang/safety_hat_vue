// 查看定位
<template>
  <div id="viewLoca">
    <!-- 百度地图 -->
    <baidu-map
      :center="center"
      :zoom="zoom"
      @ready="handler"
      class="baiduMap"
      @click="getClickInfo"
      :scroll-wheel-zoom="true"
    >
      <bm-marker
        :position="pointz"
        :icon="
      terminalLocation"
        @click="oneClick"
        v-if="showTerminal"
      ></bm-marker>
      <!-- <bm-marker
        :position="pointh"
        :icon="{url: pointDispatcher, size: {width: 40, height: 96}}"
        @click="twoClick"
        v-if="showYardMan"
      ></bm-marker>-->
      <!-- <template>
        <el-button class="onebtn" type="primary" @click="oneClick">查看定位-终端</el-button>
        <el-button class="twobtn" type="primary" @click="twoClick">查看定位-调度员</el-button>
      </template>-->
    </baidu-map>

    <!-- 终端成员信息弹框 -->
    <div class="dia-1">
      <el-dialog title="成员信息-终端" :visible.sync="MemberDialogVisible" width="30%" :modal="false">
        <el-form
          style="margin-top:10px;"
          class="terminal"
          ref="terminal"
          :model="terminal"
          label-width="80px"
        >
          <el-form-item label="姓名：">
            <el-input v-model="terminal.name" disabled></el-input>
          </el-form-item>
          <el-form-item label="账号类型：">
            <el-input v-model="terminal.accountType" disabled></el-input>
          </el-form-item>
          <el-form-item label="工种：">
            <el-input v-model="terminal.workType" disabled></el-input>
          </el-form-item>
          <el-divider></el-divider>
          <el-form-item label="电池电量：">
            <el-input v-model="terminal.battery" disabled></el-input>
          </el-form-item>
          <el-form-item label="主板温度：">
            <el-input v-model="terminal.temperature" disabled></el-input>
          </el-form-item>
          <el-form-item label="环境温度：">
            <el-input v-model="terminal.environment" disabled></el-input>
          </el-form-item>
          <el-form-item label="气压：">
            <el-input v-model="terminal.airPressure" disabled></el-input>
          </el-form-item>
          <el-form-item label="网络：">
            <el-input v-model="terminal.internet" disabled></el-input>
          </el-form-item>
          <el-divider></el-divider>
          <el-form-item label="时间：">
            <el-input v-model="terminal.date" disabled></el-input>
          </el-form-item>
          <el-form-item label="纬度：">
            <el-input v-model="terminal.longitude" disabled></el-input>
          </el-form-item>
          <el-form-item label="经度：">
            <el-input v-model="terminal.latitude" disabled></el-input>
          </el-form-item>
        </el-form>

        <!-- 底部功能区 -->
        <div class="fn">
          <ul>
            <li>
              <img src="../../assets/images/2018.png" alt />
              <p>语音电话</p>
            </li>
            <li>
              <img src="../../assets/images/2019.png" alt />
              <p>视频电话</p>
            </li>
            <li>
              <img src="../../assets/images/2020.png" alt />
              <p>语音广播</p>
            </li>
            <li>
              <img src="../../assets/images/2021.png" alt />
              <p>轨迹</p>
            </li>
            <li>
              <img src="../../assets/images/2022.png" alt />
              <p>无声侦护</p>
            </li>
          </ul>
        </div>
      </el-dialog>
    </div>

    <!-- 调度员成员信息框 -->
    <div class="dia-1 dia-2">
      <el-dialog
        title="成员信息-调度员"
        :visible.sync="DispatcherDialogVisible"
        width="30%"
        :modal="false"
      >
        <!-- 主体信息区 -->
        <el-form
          style="margin-top:10px;"
          class="dispatcher"
          ref="dispatcher"
          :model="terminal"
          label-width="80px"
        >
          <el-form-item label="姓名：">
            <el-input v-model="dispatcher.name" disabled></el-input>
          </el-form-item>
          <el-form-item label="账号类型：">
            <el-input v-model="dispatcher.accountType" disabled></el-input>
          </el-form-item>
          <el-form-item label="电话：">
            <el-input v-model="dispatcher.phone" disabled></el-input>
          </el-form-item>
          <el-divider></el-divider>
          <el-form-item label="时间：">
            <el-input v-model="dispatcher.date" disabled></el-input>
          </el-form-item>
          <el-form-item label="经度：">
            <el-input v-model="dispatcher.longitude" disabled></el-input>
          </el-form-item>
          <el-form-item label="纬度：">
            <el-input v-model="dispatcher.latitude" disabled></el-input>
          </el-form-item>
        </el-form>

        <!-- 底部功能区 -->
        <div class="fn">
          <ul>
            <li>
              <img src="../../assets/images/2018.png" alt />
              <p>语音电话</p>
            </li>
            <li>
              <img src="../../assets/images/2019.png" alt />
              <p>视频电话</p>
            </li>
            <li>
              <img src="../../assets/images/2048.png" alt />
              <p>定位</p>
            </li>
          </ul>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import pointDispatcher from "../../assets/pointz.png";
import pointTerminal from "../../assets/location/0C468E.png";
import axios from "axios";
//图标颜色
import L_0C468E from "../../assets/location/0C468E.png";
import L_2DD787 from "../../assets/location/2DD787.png";
import L_3FE5F2 from "../../assets/location/3FE5F2.png";
import L_5C4DC6 from "../../assets/location/5C4DC6.png";
import L_9B5718 from "../../assets/location/9B5718.png";
import L_011C31 from "../../assets/location/011C31.png";
import L_68E1222 from "../../assets/location/68E122.png";
import L_814A94 from "../../assets/location/814A94.png";
import L_1596FF from "../../assets/location/1596FF.png";
import L_009721 from "../../assets/location/009721.png";
import L_C3C3C3 from "../../assets/location/C3C3C3.png";
import L_D32084 from "../../assets/location/D32084.png";
import L_F8EA38 from "../../assets/location/F8EA38.png";
import L_FF3E59 from "../../assets/location/FF3E59.png";
import L_FFB142 from "../../assets/location/FFB142.png";
import L_29710 from "../../assets/location/29710.png";
import L_29711 from "../../assets/location/29711.png";
import qs from "qs";
export default {
  data() {
    return {
      MemberDialogVisible: false,
      DispatcherDialogVisible: false,
      center: { lng: 104.12345678, lat: 30.12345678 },
      zoom: 13,
      terminal: {
        name: "张三",
        accountType: "终端账号",
        workType: "监工",
        battery: "23%",
        temperature: "32",
        environment: "28.1",
        airPressure: "94.77kp",
        internet: "wifi",
        date: "2019-01-01 12:00:00",
        longitude: 104.081548,
        latitude: 30.652613
      },
      dispatcher: {
        name: "李四",
        accountType: "调度员",
        phone: "0288888888",
        date: "2019-01-01 12:00:00",
        longitude: 104.083548,
        latitude: 30.655613
      },
      pointDispatcher: pointDispatcher,
      pointTerminal: pointTerminal,
      showYardMan: false,
      showTerminal: false,
      terminalLocation: { url: pointTerminal, size: { width: 40, height: 96 } },
      // 查询通讯录成员提交数据
      postmaildata: {
        pageSize: 10000,
        pageNum: 1
      },
      MailTableData: []
    };
  },
  mounted() {
    // this.locationData = this.$route.params.locationData;
    this.locationData = sessionStorage.locationData;
    // {"id":6,"name":"调度员02","userType":1,"workType":"调度员","account":"admin001_dd02","tel":null,"power":null,"mainTemperature":null,"environmentTemperature":null,"pressure":null,"network":null,"time":"2020-01-12 14:16:14","latitude":30.75647,"longitude":103.931122,"onlineStatus":0}
    this.locationData = JSON.parse(this.locationData);
    ("定位数据", this.locationData);
    // this.postMailData();
    this.viewDWEVE();
    // this.locationData = sessionStorage.locationData;

    // if (this.locationData.userType == 1) {
    //   //显示坐标
    //   this.showYardMan = true;
    //   this.showTerminal = true;
    //   //信息栏
    //   this.dispatcher.name = this.locationData.name;
    //   this.dispatcher.accountType = this.locationData.workType;
    //   this.dispatcher.phone = this.locationData.tel;
    //   this.dispatcher.date = this.locationData.time;
    //   this.dispatcher.longitude = this.locationData.longitude;
    //   this.dispatcher.latitude = this.locationData.latitude;
    // } else if (this.locationData.userType == 2) {
    //   this.showTerminal = true;
    //   this.terminal.name = this.locationData.name;
    //   this.terminal.accountType = this.locationData.account;
    //   this.terminal.workType = this.locationData.workType;
    //   this.terminal.battery = this.locationData.power;
    //   this.terminal.temperature = this.locationData.mainTemperature;
    //   this.terminal.environment = this.locationData.environmentTemperature;
    //   this.terminal.airPressure = this.locationData.pressure;
    //   this.terminal.date = this.locationData.time;
    //   this.terminal.internet = this.locationData.network;
    //   this.terminal.longitude = this.locationData.longitude;
    //   this.terminal.latitude = this.locationData.latitude;
    // } else if (this.locationData.userType == "终端用户") {
    //   // userType==2
    //   this.showTerminal = true;
    //   this.terminal.name = this.locationData.name;
    //   this.terminal.accountType = this.locationData.account;
    //   this.terminal.workType = this.locationData.workType;
    //   this.terminal.battery = this.locationData.power;
    //   this.terminal.temperature = this.locationData.mainTemperature;
    //   this.terminal.environment = this.locationData.environmentTemperature;
    //   this.terminal.airPressure = this.locationData.pressure;
    //   this.terminal.date = this.locationData.time;
    //   this.terminal.internet = this.locationData.network;
    //   this.terminal.longitude = this.locationData.longitude;
    //   this.terminal.latitude = this.locationData.latitude;
    // } else if (this.locationData.userType == "调度员") {
    //   // userType==1
    //   this.showYardMan = true;
    //   this.showTerminal = true;

    //   //信息栏
    //   this.dispatcher.name = this.locationData.name;
    //   this.dispatcher.accountType = this.locationData.workType;
    //   this.dispatcher.phone = this.locationData.tel;
    //   this.dispatcher.date = this.locationData.time;
    //   this.dispatcher.longitude = this.locationData.longitude;
    //   this.dispatcher.latitude = this.locationData.latitude;
    // }
    // //获取图标颜色
    // (this.locationData.color);

    // if (this.locationData.color == "#0C468E") {
    //   this.terminalLocation.url = L_0C468E;
    // } else if (this.locationData.color == "#2DD787") {
    //   this.terminalLocation.url = L_2DD787;
    // } else if (this.locationData.color == "#3FE5F2") {
    //   this.terminalLocation.url = L_3FE5F2;
    // } else if (this.locationData.color == "#5C4DC6") {
    //   this.terminalLocation.url = L_5C4DC6;
    // } else if (this.locationData.color == "#9B5718") {
    //   this.terminalLocation.url = L_9B5718;
    // } else if (this.locationData.color == "#011C31") {
    //   this.terminalLocation.url = L_011C31;
    // } else if (this.locationData.color == "#68E122") {
    //   this.terminalLocation.url = L_68E122;
    // } else if (this.locationData.color == "#814A94") {
    //   this.terminalLocation.url = L_814A94;
    // } else if (this.locationData.color == "#1596FF") {
    //   this.terminalLocation.url = L_1596FF;
    // } else if (this.locationData.color == "#009721") {
    //   this.terminalLocation.url = L_009721;
    // }
    // // else if (this.locationData.color == "#C3C3C3") {
    // //   this.terminalLocation.url = L_C3C3C3;
    // // }
    // else if (this.locationData.color == "#D32084") {
    //   this.terminalLocation.url = L_D32084;
    // } else if (this.locationData.color == "#F8EA38") {
    //   this.terminalLocation.url = L_F8EA38;
    // } else if (this.locationData.color == "#FF3E59") {
    //   this.terminalLocation.url = L_FF3E59;
    // } else if (this.locationData.color == "#FFB142") {
    //   this.terminalLocation.url = L_FFB142;
    // }
    // // 根据用户查询判断是否在线
    // if (this.locationData.userType == 1) {
    //   ("触发调度员");
    //   if (this.locationData.onlineStatus == 0) {
    //     this.terminalLocation.url = L_29710;
    //     ("调度员未在线");
    //     ("图标", this.terminalLocation.url);
    //   } else {
    //     ("调度员在线");

    //     this.terminalLocation.url = L_29711;
    //   }
    // }
    // if (this.locationData.userType == 2) {
    //   ("触发终端用户");

    //   if (this.locationData.onlineStatus == 0) {
    //     this.terminalLocation.url = L_C3C3C3;
    //   }
    // }

    this.getLocation();
  },
  created() {},
  computed: {
    pointz() {
      let point = {
        lng: this.locationData.longitude,
        lat: this.locationData.latitude
      };
      return point;
    },
    pointh() {
      let point = {
        lng: this.locationData.longitude,
        lat: this.locationData.latitude
      };
      return point;
    }
  },

  methods: {
    async viewDWEVE() {
      // 查询账号绑定状态
      const { data: res } = await this.$http.post(
        "contact/findContact",
        qs.stringify(this.postmaildata)
      );
      // this.MailTableData = res.data.list;
      ("成员数据查询状态res", res);

      if (this.locationData.userType == 1) {
        //显示坐标
        // this.showYardMan = true;
        this.showTerminal = true;
        //信息栏
        this.dispatcher.name = this.locationData.name;
        this.dispatcher.accountType = this.locationData.workType;
        this.dispatcher.phone = this.locationData.tel;
        this.dispatcher.date = this.locationData.time;
        this.dispatcher.longitude = this.locationData.longitude;
        this.dispatcher.latitude = this.locationData.latitude;
      } else if (this.locationData.userType == 2) {
        this.showTerminal = true;
        this.terminal.name = this.locationData.name;
        this.terminal.accountType = this.locationData.account;
        this.terminal.workType = this.locationData.workType;
        this.terminal.battery = this.locationData.power;
        this.terminal.temperature = this.locationData.mainTemperature;
        this.terminal.environment = this.locationData.environmentTemperature;
        this.terminal.airPressure = this.locationData.pressure;
        this.terminal.date = this.locationData.time;
        this.terminal.internet = this.locationData.network;
        this.terminal.longitude = this.locationData.longitude;
        this.terminal.latitude = this.locationData.latitude;
      } else if (this.locationData.userType == "终端用户") {
        // userType==2
        this.showTerminal = true;
        this.terminal.name = this.locationData.name;
        this.terminal.accountType = this.locationData.account;
        this.terminal.workType = this.locationData.workType;
        this.terminal.battery = this.locationData.power;
        this.terminal.temperature = this.locationData.mainTemperature;
        this.terminal.environment = this.locationData.environmentTemperature;
        this.terminal.airPressure = this.locationData.pressure;
        this.terminal.date = this.locationData.time;
        this.terminal.internet = this.locationData.network;
        this.terminal.longitude = this.locationData.longitude;
        this.terminal.latitude = this.locationData.latitude;
      } else if (this.locationData.userType == "调度员") {
        // userType==1
        // this.showYardMan = true;
        this.showTerminal = true;
        //信息栏
        this.dispatcher.name = this.locationData.name;
        this.dispatcher.accountType = this.locationData.workType;
        this.dispatcher.phone = this.locationData.tel;
        this.dispatcher.date = this.locationData.time;
        this.dispatcher.longitude = this.locationData.longitude;
        this.dispatcher.latitude = this.locationData.latitude;
      }
      //获取图标颜色
      (this.locationData.color);

      if (this.locationData.color == "#0C468E") {
        this.terminalLocation.url = L_0C468E;
      } else if (this.locationData.color == "#2DD787") {
        this.terminalLocation.url = L_2DD787;
      } else if (this.locationData.color == "#3FE5F2") {
        this.terminalLocation.url = L_3FE5F2;
      } else if (this.locationData.color == "#5C4DC6") {
        this.terminalLocation.url = L_5C4DC6;
      } else if (this.locationData.color == "#9B5718") {
        this.terminalLocation.url = L_9B5718;
      } else if (this.locationData.color == "#011C31") {
        this.terminalLocation.url = L_011C31;
      } else if (this.locationData.color == "#68E122") {
        this.terminalLocation.url = L_68E122;
      } else if (this.locationData.color == "#814A94") {
        this.terminalLocation.url = L_814A94;
      } else if (this.locationData.color == "#1596FF") {
        this.terminalLocation.url = L_1596FF;
      } else if (this.locationData.color == "#009721") {
        this.terminalLocation.url = L_009721;
      } else if (this.locationData.color == "#D32084") {
        this.terminalLocation.url = L_D32084;
      } else if (this.locationData.color == "#F8EA38") {
        this.terminalLocation.url = L_F8EA38;
      } else if (this.locationData.color == "#FF3E59") {
        this.terminalLocation.url = L_FF3E59;
      } else if (this.locationData.color == "#FFB142") {
        this.terminalLocation.url = L_FFB142;
      }
      if (this.locationData.userType == 1) {
        ("调度员");
        if (this.locationData.onlineStatus == 0) {
          // this.terminalLocation.url = L_29710;
          ("调度员不在线");
          this.terminalLocation.url = L_29710;
        } else {
          // this.terminalLocation.url = L_29711;
          this.terminalLocation.url = L_29711;
        }
      }
      // if (this.locationData.userType == 2) {
      //   if (this.locationData.onlineStatus == 0) {
      //     this.terminalLocation.url = L_C3C3C3;
      //   }
      // }
    },
    // 获取所有账号信息
    // async postMailData() {
    //   const { data: res } = await this.$http.post(
    //     "contact/findContact",
    //     qs.stringify(this.postmaildata)
    //   );
    //   // ("获取通讯录成员数据");
    //   ("获取通讯录成员数据res", res);
    //   this.MailTableData = res.data.list;
    // },

    oneClick() {
      this.MemberDialogVisible = true;
    },
    twoClick() {
      this.DispatcherDialogVisible = true;
    },
    //百度地图
    handler({ BMap, map }) {
      var point = new BMap.Point(
        this.locationData.longitude,
        this.locationData.latitude
      );
      //(point);
      map.centerAndZoom(point, 16);
      map.addOverlay(point);
    },
    getClickInfo(e) {
      // this.addElectronics(e)
    },
    //获取定位
    async getLocation() {
      let data = await axios.get("/gps/uploadClientEnvInfo");
      // ("获取定位", data);
      return data;
    }
  }
};
</script>

<style lang="less">
#viewLoca {
  .terminal,
  .dispatcher {
    .el-form-item {
      display: flex;
      justify-content: flex-start;
      margin-bottom: 0px;
      margin-left: 15px;
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
</style>

<style lang="less" scoped>
#viewLoca {
  .baiduMap {
    width: 100%;
    height: 100%;
    margin-top: 0px;
    position: absolute;
  }
  .onebtn {
    position: absolute;
    top: 0;
    left: 0;
  }
  .twobtn {
    position: absolute;
    top: 0;
    left: 200px;
  }
  .el-button {
    margin-top: 50px;
    margin-left: 50px;
  }
  .dia-1 {
    .el-dialog__body {
      padding: 0;
      .fn {
        height: 80px;
        width: 100%;
        ul {
          margin: 0;
          padding: 0;
          width: 100%;
          height: 100%;
          list-style: none;
          background-color: #1596ff;
          li {
            // float: left;
            display: inline-block;
            height: 80px;
            width: 20%;
            vertical-align: middle;
            text-align: center;

            font-size: 14px;
            color: #1596ff;
            img {
              vertical-align: middle;
              margin-top: 5px;
            }
            p {
              margin-top: 6px;
              color: #fff;
            }
          }
        }
      }
    }
  }
  .dia-2 {
    li {
      width: 33.33333% !important;
    }
  }
}
</style>

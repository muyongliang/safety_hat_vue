// 登录页面
<template>
  <div class="login-container">
    <div class="big-box">
      <!-- 标题框 -->
      <div class="logo">
        <!-- <span class="lo">LOGO</span> -->
        <span class="mi">智能安全生产管控系统后台</span>
      </div>
      <!-- 主体 -->
      <div class="login-main">
        <div class="login-main-left">
          <h3>欢迎登录</h3>
          <!-- input框 +button-->
          <div class="demo-input">
            <el-form :model="loginRuleForm" ref="loginRuleFormRef" label-width="100px">
              <el-form-item class="demo-one">
                <el-input placeholder="请输入账号" prefix-icon="el-icon-user" v-model="loginRuleForm.username"></el-input>
              </el-form-item>
              <el-form-item class="demo-two">
                <el-input placeholder="请输入密码" prefix-icon="el-icon-s-cooperation" show-password v-model="loginRuleForm.password"></el-input>
              </el-form-item>
              <el-form-item class="demo-three">
                <el-row>
                  <el-col :span="20">
                    <el-input placeholder="图形验证码" prefix-icon="el-icon-more-outline" v-model="loginRuleForm.verifyCode"></el-input>
                  </el-col>
                  <el-col :span="1">
                    <div class="vcode">
                      <!-- <el-input type="text" click="num"></el-input> -->
                      <img :src="src" class="num"/>
                      <img src="../assets/images/组 2007@2x.png" alt @click="getImg" />
                    </div>
                  </el-col>
                </el-row>
              </el-form-item>
              <!-- 验证码 -->
              <!-- <el-form-item>
                <div class="vcode">
                  <div class="num"></div>
                  <img src="../assets/images/组 2007@2x.png" alt />
                </div>
              </el-form-item>-->
              <!-- 登录按钮 -->

              <el-form-item class="btns">
                <el-button type="primary" @click="login">立即登录</el-button>
              </el-form-item>
            </el-form>
            <!-- <el-form></el-form> -->
          </div>
          <div></div>
        </div>
      </div>
      <!-- 图片 -->
      <div class="images">
        <img class="im" src="../assets/2077@2x.png" alt />
      </div>

      <!-- <div class="login-main-right">
        <div class="image">
          <img class="im" src="../assets/组 2077@2x.png" alt />
        </div>
      </div>-->
    </div>
    <!-- 公司标题 -->
    <div class="company">
      <span>COPYRIGHT © 四川倚天华安科技有限公司</span>
      <br />
      <span>蜀ICP备19037474号</span>
      <br />
      <span>工信部网址：<a href="https://beian.miit.gov.cn">https://beian.miit.gov.cn</a></span>
      <br />
      <span>备注：系统操作页面最佳分辨率为：1080P，建议采用此分辨率下的显示设备进行系统的登录与操作应用。</span>
    </div>
  </div>
</template>

<script>
import qs from "qs";
// import axios from "axios";
import picMeta from "../assets/panda.png";
import { createSocket, sendWSPush, closeWS } from "../plugins/socket";
import { createNamespacedHelpers } from "vuex";
const { mapState, mapActions } = createNamespacedHelpers("login");
export default {
  inject: ["reload"],
  data() {
    return {
      // 登录表单绑定数据数据
      loginRuleForm: {
        username: "",
        password: "",
        // 验证码
        verifyCode: "",
        // host: "",
        // type: "",
        source: 0,
      },
      // 登陆表单验证规则
      loginRules: {
        username: [
          { required: true, message: "请输入账号", trigger: "blur" },
          {
            min: 3,
            max: 20,
            message: "长度在 3 到 20 个字符",
            trigger: "blur",
          },
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          {
            min: 3,
            max: 20,
            message: "长度在 3 到 20 个字符",
            trigger: "blur",
          },
        ],
      },
      // 验证码图片文件
      // src: "http://192.168.0.105:8083/admin/captcha?t=" + Math.random()
      // src: this.$src + "admin/captcha?t=" + Math.random(),
      src: 0,
      message: "", //用户名称
      // 权限数据
      roleData: {
        parentId: 0, //菜单父ID
        userName: "",
      },
      // 系统设置与记录管理数据
      ones: {
        parentId: 10, //菜单父ID
        userName: "",
      }, //记录管理
      twos: {
        parentId: 11, //菜单父ID
        userName: "",
      }, //系统设置
    };
  },
  mounted() {
    this.backDoor();
    this.getImg();
  },
  computed: {
    ...mapState(["logoImg"]),
  },
  created() {
    window.dispatchEvent(
      new CustomEvent("onTalkbackClose", {
        detail: {
          eventName: "关闭对讲",
        },
      })
    );
    sessionStorage.clear();
    localStorage.clear();
    this.closeWS();
  },
  methods: {
    ...mapActions(["getLogoAsync", "backDoorAsync"]),
    //后门
    async backDoor() {
      let id = window.location.href.split("?")[1];
      let a = id.split("&");
      let b = a[0];
      let c = a[1];
      let d = c.split("=")[1];
      let account = b.split("=")[1];
      let mark = d.split("#")[0];
      // if (account == 0) {
      //   ("account==0");
      //   return;
      // }
      const data = await this.backDoorAsync({
        username: account,
        // username: "c31",
        source: mark,
      });
      if (data.code !== 200) {
        return this.$message(data.message);
      }
      if (data.code == 200) {
        // ("data.message", data.message);

        localStorage.objName = data.message;
        localStorage.roleData = [1, 6, 7, 8, 9, 10, 11, 13];
        localStorage.jiluDataList = [14, 15, 16, 17, 18];
        localStorage.TwoDataList = [19, 20, 21, 22, 23, 24, 25, 26];
        this.$router.push({path: `/welcome`,});
        // this.$router.push({
        //   path: `/welcome`,
        //   query: {
        //     AllMess: data.message,
        //     AllRole: 1
        //   }
        // });
      }
    },
    // 登录获取
    async login() {
      this.loginRuleForm.username = this.loginRuleForm.username.trim();
      this.loginRuleForm.password = this.loginRuleForm.password.trim();

      // 表单预验证
      const { data: res } = await this.$http.post("admin/login", qs.stringify(this.loginRuleForm),);
      if (res.code !== 200) {
        this.getImg();//登录报错刷新验证码
        this.$message.error(res.message)
      }
      // groupName: res.data.groupName,
      // groupId: res.data.groupId,
      // projectId: res.data.projectId

      localStorage.ddyDatas = res.data.groupName;
      localStorage.setItem("ProjectIdtalkback", res.data.projectId);
      window.dispatchEvent(
        new CustomEvent("talkbackProjectId", {
          detail: {projectId: res.data.projectId,},
        })
      );
      localStorage.setItem("initTalkback", true);
      if (res.code == 200) {
        //总后台功能配置——电子围栏
        sessionStorage.setItem("configMapRange", res.data.config.mapRange);
        //总后台功能配置——语音通话功能
        sessionStorage.setItem("configIsCall", res.data.config.isCall);
        //总后台功能配置——视频通话功能
        sessionStorage.setItem("configVedio", res.data.config.vedio);
        //总后台功能配置——对讲功能
        sessionStorage.setItem("configTalkback", res.data.config.talkback);
        //总后台功能配置——轨迹功能
        sessionStorage.setItem("configTrail", res.data.config.trail);
        //总后台功能配置——广播功能
        sessionStorage.setItem("configBroadcast", res.data.config.broadcast);
        //总后台功能配置——无声侦护功能
        sessionStorage.setItem("configListener", res.data.config.listener);
        // 发送权限请求，获取当前用户权限
        // sessionStorage.NameUserData = {
        //   parentId: 0, //菜单父ID
        //   userName: this.loginRuleForm.username
        // };
        // sessionStorage.NameUser = this.loginRuleForm.username;
        // 显示对讲组窗口
        window.dispatchEvent(
          new CustomEvent("getTalkbackShow", {detail: {status: 1}})
        );
        this.roleData.userName = this.loginRuleForm.username;
        const { data: ress } = await this.$http.get("menu/getMenus", {params: this.roleData});
        const arr = [];
        for (let i = 0; i < ress.data.length; i++) {
          arr.push(ress.data[i].mid);
        }
        // 将处理好多权限数据保存到session中
        // sessionStorage.roleData = arr;
        localStorage.roleData = arr;
        this.$message.success(res.message);
        this.message = res.message;
        var infostr = JSON.stringify(this.message); //转换json
        // sessionStorage.objName = infostr;
        localStorage.objName = infostr;

        // 显示侧边无声侦护窗口
        window.dispatchEvent(
          new CustomEvent("onFullScreenShow", {detail: {status: 1}})
        );

        this.getData();
        this.getTwoDatas();
        const { data: restwos } = await this.$http.get("menu/getMenus", {params: this.twos});
        let TWOtwos = [];
        for (let i = 0; i < restwos.data.length; i++) {
          TWOtwos.push(restwos.data[i].mid);
        }
        localStorage.TwoDataList = TWOtwos;
        //  localStorage.TwoDataList = [19, 20, 21, 22, 23, 24, 25, 26];
        const { data: resones } = await this.$http.get("menu/getMenus", {params: this.ones});
        console.log(res)
        let arrones = [];
        for (let i = 0; i < resones.data.length; i++) {
          arrones.push(resones.data[i].mid);
        }
        localStorage.jiluDataList = arrones;
        if (arr.indexOf(1) == -1) {
          this.$router.push({path: "/welcome", query: { name: this.message },});
        } else if (arr.indexOf(1) !== -1) {
          this.$router.push({ path: "/home", query: { name: this.message } });
        }

        // ("查询是否有1", arr.indexOf(1) == -1);
        // if (arr.indexOf(1) == -1) {
        //   this.$router.push({
        //     path: "/welcome",
        //     query: { name: this.message }
        //   });
        // } else if (arr.indexOf(1) !== -1) {
        //   this.$router.push({ path: "/home", query: { name: this.message } });
        // }
        // this.$router.push({ path: "/home", query: { name: this.message } });
        // this.jiluData();
        //userName: "admin001_dd3"
        if (res.data.userName.indexOf("_") == -1) {
          sessionStorage.UserName = res.data.userName;
        } else if (res.data.userName.indexOf("_") !== -1) {
          let user = res.data.userName.split("_");
          let username = user[0];
          sessionStorage.UserName = username;
        }
        sessionStorage.ProjectId = res.data.projectId;
        sessionStorage.GroupId = res.data.groupId;
        let user = {
          username: res.message,
          account: this.loginRuleForm.username,
          headUrl: "https://pic1.zhimg.com/v2-fda399250493e674f2152c581490d6eb_1200x500.jpg",
        };
        localStorage.setItem("user", JSON.stringify(user));
        // let userinfor = JSON.parse(sessionStorage.getItem("user"));
        window.dispatchEvent(
          new CustomEvent("myVideoEvent", {detail: {data: user}})
        );
        await this.getLogoAsync(window);
        if (this.logoImg.metaImg) {
          window.dispatchEvent(
            new CustomEvent("setMeta", {
              detail: {href: this.logoImg.metaImg,},
            })
          );
        } else {
          window.dispatchEvent(
            new CustomEvent("setMeta", {detail: {href: picMeta}})
          );
        }

        // 显示对讲组窗口
        window.dispatchEvent(
          new CustomEvent("onTalkbackShow", {detail: {status: 1},})
        );
      }
      // this.reload();
      // let one23 = {
      //   parentId: 10,
      //   userName: null
      // };
      // ("记录管理页面权限数据", one23);

      // const { data: resss } = await this.$http.get("menu/getMenus", {
      //   params: one23
      // });
    },
    // 获取系统配置权限与记录管理权限
    async getTwoDatas() {
      // const { data: res } = await this.$http.get("menu/getMenus", {
      //   params: this.ones
      // });
      const { data: res } = await this.$http.get("menu/getMenus", {
        params: this.twos,
      });
      // let ONE = [];
      // res.data.list.forEach(item => {
      //   ONE.push(item.mid);
      // });
      let TWO = [];
      for (let i = 0; i < res.data.length; i++) {
        TWO.push(res.data[i].mid);
      }
      localStorage.TwoDataList = TWO;
    },

    async getData() {
      const { data: res } = await this.$http.get("menu/getMenus", {
        params: this.ones,
      });
      let arr = [];
      for (let i = 0; i < res.data.length; i++) {
        arr.push(res.data[i].mid);
      }
      localStorage.jiluDataList = arr;
    },

    // // 查询记录管理页面
    // async jiluData() {
    //   let one = {
    //     parentId: 10
    //   };
    //   const { data: res } = await this.$http.get("menu/getMenus", {
    //     params: one
    //   });
    //   ("记录管理页面权限", res);
    //   // localStorage.jiluDataList=
    // },

    // 重新获取验证码图片
    // getImg() {
    //   this.src = this.$src + "admin/captcha?t=" + Math.random();
    // }
    // 活动获取验证码
    async getImg() {
      const data = await this.$http
        .get("admin/captcha", {responseType: "arraybuffer",})
        .then((res) => "data:image/png;base64," +
            btoa(
              new Uint8Array(res.data).reduce((data, byte) => data + String.fromCharCode(byte), "")
            )
        );
      this.src = data;
    },
  },
};
</script>
<style>

</style>
<style lang="less" scoped>

.login-container {
  .big-box {
    position: relative;
    position: absolute;
    top: 46%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 1200px;
    height: 663px;
    background-color: #fff;
    // 定位背景图
    // background-image: url(../assets/组2077@2x.png);
    // background-size: 500px, 662.75px;
    // background-repeat: no-repeat;
    // background-position: top right;
    // z-index: 10;
    .logo {
      height: 63px;
      background: rgba(244, 245, 254, 1);
      // z-index: 20;
      // float: left;
      .lo {
        color: #1596ff;
        font-size: 28px;
        font-weight: bold;
        opacity: 1;
      }
      .mi {
        margin-left: 18px;
        font-size: 25px;
        font-weight: bold;
        line-height: 25px;
        color: rgba(51, 51, 51, 1);
        opacity: 1;
      }
    }
    .login-main {
      .login-main-left {
        // float: left;
        margin-top: 150px;
        margin-left: 122px;
        font-size: 20px;
        font-weight: bold;
        line-height: 26px;
        .demo-input {
          margin-top: 42px;
          width: 350px;
          height: 40px;
          .demo-three {
            .el-input {
              width: 200px;
            }
            // width: 220px;
            // float: left;
          }
          .vcode {
            // display: inline;
            // float: right;
            margin-left: 50px;
            width: 120px;
            height: 40px;
            background-color: #1596ff;
            cursor: pointer;
            .num {
              // float: right;
              float: left;
              // margin-left: 10px;
              margin-top: 0px;
              width: 80px;
              height: 100%;
              font-size: 24px;
              font-family: DIN;
              font-weight: bold;
              line-height: 40px;
              color: rgba(255, 255, 255, 1);
            }
            img {
              float: right;
              margin-top: 12px;
              margin-right: 10px;
              width: 20px;
              height: 20px;
            }
          }

          .btns {
            // width: 140px;
            height: 40px;
          }
        }
      }
    }
    .images {
      position: absolute;
      right: 0;
      bottom: 0;
      width: 500px;
      height: 662.75px;
      float: right;
      .im {
        width: 100%;
        height: 100%;
      }
    }
  }
  .company {
    position: absolute;
    bottom: 8%;
    left: 50%;
    transform: translate(-50%, -50%);
    text-align: center;
    // margin-bottom: -30px;
    // width: 270px;
    height: 19px;
    font-size: 14px;
    // font-family:Microsoft YaHei;
    font-weight: 400;
    line-height: 19px;
    color: rgba(153, 153, 153, 1);
    opacity: 1;
  }
}
</style>

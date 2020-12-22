<template>
  <div id="we">
    <el-container class="home-container">
      <!-- 头部区域 -->
      <el-header>
        <!-- 标题框 -->
        <div class="logo">
          <span class="lo">
            <img :src="logoImg.logoImg || picLogo" />
          </span>
          <span class="mi">{{ logoImg.systemName }}</span>
        </div>
        <!-- 右边功能栏 -->
        <div class="header-right">
          <div @click="backhome" v-if="this.roleList.indexOf(1) > -1">
            <img src="../assets/images/29718.png" alt />
          </div>
          <div class="hr-two" v-if="this.roleList.indexOf(12) > -1">
            <el-badge :is-dot="hasPhone" class="item">
              <div @click="getTelephone">
                <img src="../assets/images/2074@2x.png" alt />
              </div>
            </el-badge>
          </div>
          <div class="hr-three" v-if="this.roleList.indexOf(13) > -1">
            <el-badge :is-dot="hasNews" class="item">
              <div @click="getNews">
                <img src="../assets/images/2075@2x.png" alt />
              </div>
            </el-badge>
          </div>
          <div class="hr-four" @click="getSetUp">
            <img src="../assets/images/2073@2x.png" alt />
          </div>
          <div class="hr-five">
            <img src="../assets/images/p@2x.png" alt />
            <span>{{ message }}</span>
          </div>
        </div>
      </el-header>
      <!-- 侧边区域 -->
      <el-container>
        <!-- 侧边栏区域 width="240px"-->
        <el-aside>
          <div class="left-top">
            <el-row class="tac">
              <el-col>
                <div style="hight: 20px"></div>
                <el-menu
                    default-active
                    class="el-menu-vertical-demo"
                    @open="handleOpen"
                    @close="handleClose"
                    background-color="#011C31"
                    text-color="#fff"
                    active-text-color="#ffd04b"
                    unique-opened
                    router
                    @select="handleAss"
                >
                  <el-menu-item index="/mail" v-if="roleList.indexOf(3) > -1">
                    <i>
                      <img src="../assets/images/组 1785.png" alt />
                    </i>
                    <span slot="title">通讯录</span>
                  </el-menu-item>

                  <el-menu-item index="/cell" v-if="roleList.indexOf(4) > -1">
                    <i>
                      <img src="../assets/images/组 1784.png" alt />
                    </i>
                    <span slot="title">报警</span>
                  </el-menu-item>

                  <el-menu-item
                      index="/talk"
                      v-if="roleList.indexOf(5) > -1"
                      v-show="hasTalkback"
                  >
                    <i>
                      <img src="../assets/images/组 1783.png" alt />
                    </i>
                    <span slot="title">对讲组</span>
                  </el-menu-item>

                  <el-menu-item index="/page" v-if="roleList.indexOf(6) > -1">
                    <i>
                      <img src="../assets/images/组 1782.png" alt />
                    </i>
                    <span slot="title">数据</span>
                  </el-menu-item>

                  <el-menu-item
                      index="/electronics"
                      v-if="roleList.indexOf(7) > -1"
                      v-show="hasRange"
                  >
                    <i>
                      <img src="../assets/images/组 1781.png" alt />
                    </i>
                    <span slot="title">电子围栏</span>
                  </el-menu-item>

                  <el-menu-item
                      index="/management"
                      v-if="roleList.indexOf(8) > -1"
                  >
                    <i>
                      <img src="../assets/images/组 1780.png" alt />
                    </i>
                    <span slot="title">设备管理</span>
                  </el-menu-item>
                  <el-menu-item
                      index="/project"
                      v-if="roleList.indexOf(9) > -1"
                  >
                    <i>
                      <img src="../assets/images/组 1779.png" alt />
                    </i>
                    <span slot="title">项目管理</span>
                  </el-menu-item>

                  <el-submenu index="8" v-if="roleList.indexOf(10) > -1">
                    <template slot="title">
                      <i>
                        <img src="../assets/images/组 2009.png" alt />
                      </i>
                      <span>记录管理</span>
                    </template>
                    <el-menu-item-group>
                      <el-menu-item
                          index="/police"
                          v-if="roleListtwo.indexOf(14) > -1"
                      >报警记录</el-menu-item
                      >
                      <el-menu-item
                          index="/Radio"
                          v-if="roleListtwo.indexOf(15) > -1"
                      >广播记录</el-menu-item
                      >
                      <el-menu-item
                          index="/TalkR"
                          v-if="roleListtwo.indexOf(16) > -1"
                      >对讲记录</el-menu-item
                      >
                      <el-menu-item
                          index="/Sou"
                          v-if="roleListtwo.indexOf(17) > -1"
                      >电话录音记录</el-menu-item
                      >
                      <el-menu-item
                          index="/Patrol"
                          v-if="roleListtwo.indexOf(18) > -1"
                      >巡检报告</el-menu-item
                      >
                    </el-menu-item-group>
                  </el-submenu>

                  <el-submenu index="9" v-if="roleList.indexOf(11) > -1">
                    <template slot="title">
                      <i>
                        <img src="../assets/images/组 2008.png" alt />
                      </i>
                      <span>系统设置</span>
                    </template>
                    <el-menu-item-group>
                      <el-menu-item
                          index="/sub"
                          v-if="rolearrTwo.indexOf(19) > -1"
                      >子管理员配置</el-menu-item
                      >
                      <el-menu-item
                          index="/role"
                          v-if="rolearrTwo.indexOf(20) > -1"
                      >角色权限配置</el-menu-item
                      >
                      <el-menu-item
                          index="/Remote"
                          v-if="rolearrTwo.indexOf(21) > -1"
                      >远程控制</el-menu-item
                      >
                      <el-menu-item
                          index="/dic"
                          v-if="rolearrTwo.indexOf(22) > -1"
                      >字典配置</el-menu-item
                      >
                      <el-menu-item
                          index="/appup"
                          v-if="rolearrTwo.indexOf(23) > -1"
                      >终端app更新</el-menu-item
                      >
                      <el-menu-item
                          index="/poer"
                          v-if="rolearrTwo.indexOf(24) > -1"
                      >操作日志</el-menu-item
                      >
                      <el-menu-item
                          index="/pages"
                          v-if="rolearrTwo.indexOf(25) > -1"
                      >页面设置</el-menu-item
                      >
                      <el-menu-item
                          index="/service"
                          v-if="rolearrTwo.indexOf(26) > -1"
                      >服务状态</el-menu-item
                      >
                    </el-menu-item-group>
                  </el-submenu>
                </el-menu>
              </el-col>
            </el-row>
          </div>
        
          <!-- 侧边栏底部文字 -->
          <div class="left-bottom">
            <div class="aside-down">
              <h5>当前版本 V1.0</h5>
              <h5 class="sp">技术支持：成都四象联创科技有限公司</h5>
            </div>
          </div>

          <!-- 侧边栏按钮结束标签 -->
        </el-aside>

        <!-- 右侧主体区域 -->
        <el-main>
          <!-- 路由占位符 -->
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>

    <!-- 设置弹框 -->
    <el-dialog
        title="设置"
        :visible.sync="SetUpDialogVisible"
        width="20%"
        class="dialog-setup"
    >
      <div @click="editName">修改姓名</div>
      <div @click="editPassword">修改密码</div>
      <div @click="LogoutEvent">退出登录</div>
    </el-dialog>
    <!-- 更改姓名弹框 -->
    <el-dialog
        title="修改姓名"
        :visible.sync="editNameVisible"
        width="30%"
        center
    >
      <el-form ref="form" :model="form" label-width="80px">
        <el-form-item label="姓名：">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editNameVisible = false">取 消</el-button>
        <el-button type="primary" @click="editNameTrue">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 修改密码弹框 -->
    <el-dialog
        title="修改密码"
        :visible.sync="editPassVisible"
        width="30%"
        center
    >
      <el-form ref="form" :model="form" label-width="20%">
        <el-form-item label="原密码：">
          <el-input
              v-model="form.oldPassword"
              placeholder="请输入原密码"
          ></el-input>
        </el-form-item>
        <el-form-item label="新密码：">
          <el-input
              v-model="form.newPassword"
              placeholder="请输入新密码，6-20位，数字、字母、字符组成"
          ></el-input>
        </el-form-item>
        <el-form-item label="重复密码：">
          <el-input
              v-model="form.Passwordes"
              placeholder="再次输入密码"
          ></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editPassVisible = false">取 消</el-button>
        <el-button type="primary" @click="editPasswordTrue">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 退出登录 -->
    <el-dialog title="提示" :visible.sync="SignOutVisible" width="30%" append-to-body>
      <span>真的要退出登录吗</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="SignOutVisible = false">取 消</el-button>
        <el-button type="primary" @click="LogoutEvent">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import qs from "qs";
import picLogo from "../assets/indexlogo.png";
import { createNamespacedHelpers } from "vuex";
const { mapState, mapActions } = createNamespacedHelpers("home");
const { mapState: logoState } = createNamespacedHelpers("login");
export default {
  inject: ["reload"],
  data() {
    return {
      shrinkBtnNum: true, // 对讲框点击放大缩小
      // 对讲组表单数据
      formss: {
        name: "",
        region: "",
        regionOne: "",
      },
      startEnd: true, //开始讲话判断
      voiceData: true, // 对讲组声音开关数据
      form: {
        name: "",
        oldPassword: "",
        newPassword: "",
        Passwordes: "",
      },
      // 设置弹框
      SetUpDialogVisible: false,
      // 更改姓名弹框
      editNameVisible: false,
      editPassVisible: false,
      SignOutVisible: false,
      // 定时器调用消息提示
      timer: "",
      message: "", //用户名称
      hasNews: false,
      picLogo: picLogo,
      hasPhone: false,
      roleList: [], //菜单权限
      AllRoleone: "",
      roleListtwo: [], //记录管理权限
      rolearrTwo: [], //系统设置权限
      hasRange: false,
      hasTalkback: false,
      user: {},
      sxdata: true,
    };
  },
  mounted() {
    // this.timer = setInterval(this.open, 10000);
    this.getState();
    this.getPhoneState();
    this.getSettings();
    this.getTalkBack();
  },
  // onshow() {
  //   this.reload();
  // },
  created() {
    this.getMessage();
    this.getRoleDatas();
    this.getName();
    this.jtUser();
    this.sxym();
    // this.jiluData();
  },
  computed: {
    ...logoState(["logoImg"]),
  },
  methods: {
    // 定时刷新页面
    sxym() {
      if (!window.name) {
        console.log("第一次开这个窗口！name值" + window.name);
        window.name = "test";
        location.reload();
        // if (window.name == "test") {
        //   return;
        // }
      } else {
        if (window.name == "test1") {
          window.name = "test2";
          location.reload();
        }
        console.log("刷新操作 name值：" + window.name);
      }
      // if (this.sxdata == true) {
      //   this.reload();
      //   this.sxdata = false;
      // }
    },
    // 对讲组声音开关数据
    VoiceSwitch() {
      this.voiceData = !this.voiceData;
    },
    // 对讲组点阿基成员信息弹框
    viewMemData() {
      //之后需要做判断
      // this.DispatcherDialogVisible = true;
      // this.MemberDialogVisible = true;
    },
    //对讲开始结束
    chengestartend() {
      this.startEnd = !this.startEnd;
    },
    // 对讲框点击放大缩小
    shrinkBtn() {
      this.shrinkBtnNum = !this.shrinkBtnNum;
    },
    ...mapActions(["newsStateAsync", "getLogoAsync", "phoneStateAsync"]),
    //功能配置(电子围栏)
    getSettings() {
      let mapRange = JSON.parse(sessionStorage.getItem("configMapRange"));
      // console.log(mapRange,"电子围栏");
      if (mapRange == 0) {
        this.hasRange = true;
      } else if (mapRange == 1) {
        this.hasRange = false;
      }
    },
    //功能配置(对讲组)
    getTalkBack() {
      let talkback = JSON.parse(sessionStorage.getItem("configTalkback"));
      // console.log(talkback,"对讲组");
      if (talkback == 0) {
        this.hasTalkback = true;
      } else if (talkback == 1) {
        this.hasTalkback = false;
      }
    },
    // 监听web
    jtUser() {
      this.user = localStorage.user;
      // console.log("监听user", this.user);

      window.dispatchEvent(
          new CustomEvent("myVideoEvent", {
            detail: {
              data: this.user,
            },
          })
      );
      // console.log("监听web");
    },
    //获取登录时保存在session中的权限数据
    async getRoleDatas() {
      let arr = localStorage.roleData.split(",");
      arr = arr.map(Number);
      // arr = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13];
      // const arr = JSON.parse(sessionStorage.roleData);
      this.roleList = arr;
      // console.log('001',this.roleList)

      console.log("当前用户角色菜单权限", this.roleList);
      // console.log(this.roleList.indexOf(2) > -1);
      let arrOne = localStorage.jiluDataList.split(",");
      // console.log("记录管理页面权限23", arrOne);
      arrOne = arrOne.map(Number);
      this.roleListtwo = arrOne;
      // console.log("记录管理页面权限23", this.roleListtwo);

      let arrTwo = localStorage.TwoDataList.split(",");
      arrTwo = arrTwo.map(Number);
      this.rolearrTwo = arrTwo;
      // console.log("当前用户角色菜单权限", this.roleList);
      if (this.roleList.indexOf(7) !== -1) {
        this.hasRange = true;
      }
      // sessionStorage.isReL = true;
      // console.log("sessionStorage.isReL", sessionStorage.isReL);
      // if (sessionStorage.isReL == undefined) {
      //   this.reload();
      //   sessionStorage.isReL = false;
      // }
      // this.reload();
      // console.log("记录管理页面权限", this.roleListtwo);
      // console.log("系统设置页面权限", this.rolearrTwo);
    },
    // 监听侧边栏数据
    handleAss(key, keyPath) {},
    //消息中心状态
    async getState() {
      const data = await this.newsStateAsync();
      if (data == 0) {
        this.hasNews = false;
      } else if (data.length > 0) {
        this.hasNews = true;
      }
    },
    //未接来电状态
    async getPhoneState() {
      const data = await this.phoneStateAsync();
      if (data == 0) {
        this.hasPhone = false;
      } else if (data > 0) {
        this.hasPhone = true;
      }
    },
    getName() {
      // console.log("用户姓名", localStorage.objName);
      // let infostr = localStorage.objName;
      // let objName = JSON.parse(infostr);
      // console.log("用户名", objName);
      this.message = localStorage.objName;
      let mes = JSON.parse(localStorage.objName);
      // console.log("用户名mes", mes);
      // console.log("用户名message", this.message);
      this.message = mes;
      // this.message = localStorage.objName;
      // console.log("this.message", this.message);
    },
    // 获取用户名
    getMessage() {
      if (this.$route.query.AllRole == 1) {
        // sessionStorage.roleData = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13];
        locationStorage.roleData = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13];
        this.roleList = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13];
      }
      //从sessionStorage中获取用户的类型
      if (this.$route.query.AllMess !== "") {
        sessionStorage.objName = this.$route.query.AllMess;
        return (this.message = this.$route.query.AllMess);
      }
      // var infostr = localStorage.objName;
      // var objName = JSON.parse(infostr);
      // console.log("用户名", objName);
      // this.message = objName;
    },
    // 打开设置弹框
    getSetUp() {
      this.SetUpDialogVisible = true;
    },
    // 侧边栏逻辑
    handleOpen(key, keyPath) {
      console.log("侧边栏逻辑", key, keyPath);
    },
    handleClose(key, keyPath) {
      console.log(key, keyPath);
    },
    // 点击跳转回首页
    backhome() {
      // sessionStorage.setItem("token", "true");
      // console.log("权限", localStorage.roleData);

      // if (localStorage.roleData.indexOf("1") !== -1) {
      //   console.log(
      //     "localStorage.roleData.indexOf(1) !== -1",
      //     localStorage.roleData.indexOf("1") !== -1
      //   );
      //   this.$message("您没有首页菜单权限");
      // } else {
      // if (this.$route.query.AllRole == 1) {
      //   this.AllRoleone = 1;
      // }
      this.$router.push({
        path: "/home",
        query: {
          name: this.message,
          AllMess: this.message,
          AllRole: this.AllRoleone,
        },
      });
      // }
    },
    // 点击跳转到未接电话栏
    getTelephone() {
      this.$router.push("/telephone");
    },
    // 点击跳转到消息中心栏
    getNews() {
      // sessionStorage.setItem("token", "true");
      this.$router.push("/news");
    },
    // 点击更改姓名弹框
    editName() {
      this.SetUpDialogVisible = false;
      this.editNameVisible = true;
    },
    //修改名称
    async editNameTrue() {
      const { data: res } = await this.$http.post(
          "user/modifyName",
          qs.stringify(this.form)
      );
      if (res.code !== 200) return this.$message.error(res.message);
      this.$message.success("修改姓名成功");
      this.editNameVisible = false;
      this.message = this.form.name;
      localStorage.objName = this.form.name;
      // this.$router.push("/login");
    },

    // 点击更改密码
    editPassword() {
      this.SetUpDialogVisible = false;
      this.editPassVisible = true;
    },
    // 更改密码
    async editPasswordTrue() {
      if (this.form.Passwordes !== this.form.newPassword)
        return this.$message.error("请输入一样的密码");
      const { data: res } = await this.$http.post(
          "user/modifyPassWord",
          qs.stringify(this.form)
      );
      if (res.code !== 200) return this.$message.error(res.message);
      this.$message.success("修改密码成功");
      this.editPassVisible = false;
      this.$router.push("/login");
    },

    // 退出登录
    async LogoutEvent() {
      const yesDeleteData = await this.$confirm(
          "此操作将退出登录, 是否继续?",
          "提示",
          {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning",
          }
      ).catch((err) => err);
      if (yesDeleteData != "confirm") {
        return this.$message.info("取消登出账号");
      }
      const { data: res } = await this.$http.get("admin/logout");
      if (res.code !== 200) {
        return this.$message(res.message);
      }
      this.$message.success("退出登录成功");
      console.log("退出登录");
      // 退出登录挂断电话
      // window.dispatchEvent(
      //   new CustomEvent("tuiLogin", {
      //     tuiId: "退出登录并关闭童话",
      //   })
      // );
      // 退出登录挂断电话end
      sessionStorage.clear();
      localStorage.clear();
      window.name = "test1";
      // console.log("window.name", window.name);
      // console.log("window.location.href", window.location.href);
      let url = window.location.href;
      let urlone = url.split("?");
      window.location.href = urlone[0];
      //退出登录成功断开websocket
      this.closeWS();
      // ----------------------
      this.$router.push({
        path: "/login",
      });
      // this.DetectionDrawer = false;
    },
    tuiLogin() {
      console.log("退出登录");
    },
    // 获取提示消息
    open() {
      this.$notify({
        title: "username",
        message: "已经进入电子围栏区域",
        position: "bottom-right",
      });
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
  },
};
</script>

<style lang="less" scoped>
#we {
  .home-container {
    font-size: 21px;
    // min-height: 100%;
    height: 93vh;
    min-width: 100%;
  }
  .el-header {
    height: 80px !important;
    line-height: 80px;
    background: linear-gradient(
        199deg,
        rgba(51, 167, 255, 1) 0%,
        rgba(0, 103, 248, 1) 100%
    );
    .logo {
      float: left;
      height: 80px;
      line-height: 80px;
      .lo {
        width: 84px;
        height: 42px;
        font-size: 30px;
        font-family: DIN;
        font-weight: bold;
        line-height: 42px;
        color: rgba(255, 255, 255, 1);
        img {
          vertical-align: middle;
          margin-top: 5px;
          height: 90%;
        }
      }
      .mi {
        margin-left: 10px;
        width: 336px;
        height: 42px;
        font-size: 24px;
        font-family: Microsoft YaHei;
        font-weight: bold;
        line-height: 42px;
        color: rgba(255, 255, 255, 1);
      }
    }
    .header-right {
      float: right;
      div {
        // display: table-cell;
        position: relative;
        float: left;
        height: 100%;
        width: 80px;
        text-align: center;
        vertical-align: middle;
        img {
          display: inline-block;
          width: 100%;
          height: 100%;
        }
      }
      div:nth-child(1) {
        img {
          margin-top: 20px;
          width: 50%;
          height: 50%;
        }
      }
      .hr-two {
        img {
          margin-top: -10px !important;
          width: 80px !important;
          height: 80px !important;
        }
      }
      .hr-three {
        img {
          margin-top: -10px !important;
          width: 80px !important;
          height: 80px !important;
        }
      }
      .hr-four {
        img {
          margin-top: 0px !important;
          width: 80px !important;
          height: 80px !important;
        }
      }
      .hr-five {
        text-align: center;
        vertical-align: middle;
        width: 160px;
        img {
          // display: inline-block;
          text-align: center;
          vertical-align: middle;
          width: 40px;
          height: 40px;
        }
        span {
          font-size: 14px;
          color: rgba(255, 255, 255, 1);
          margin-left: 5px;
        }
      }
    }
    .item {
      margin-top: 10px;
      margin-right: 40px;
    }
  }
  .header-right {
    cursor: pointer;
  }
  .el-container {
    position: relative;
    min-height: 100%;
    min-width: 100%;
  }
  .el-aside {
    width: 240px !important;
    min-height: 70% !important;
    background-color: #011c31;
    /deep/.left-top {
      width: 100%;
      // height: 93vh;
      // height: 80%;
      min-height: 80%;
      background-color: #011c31;
    }
    .left-bottom {
      width: 100%;
      // height: 90px;
      height: 120px;
      background-color: #011c31;
      text-align: center;
    }

    .el-submenu__title {
      height: 60px;
      border-bottom: 1px solid #1596ff;
      span {
        font-size: 20px;
        margin-left: 18px;
      }
    }
    .el-menu-item {
      font-size: 20px;
      span {
        font-size: 20px;
        margin-left: 18px;
      }
    }
    .el-menu-item-group {
      .el-menu-item {
        font-size: 14px;
      }
    }
    .el-menu-item-group__title {
      padding: 0px 0 7px 12px;
    }
    .el-submenu .el-menu-item {
      height: 40px;
      line-height: 40px;
    }
    .template {
      height: 60px;
    }
    .el-menu {
      border-right: none;
    }
    .aside-down {
      // position: absolute;
      // bottom: 5px;
      text-align: center;
      width: 100%;
      // height: 60px;
      margin-bottom: 10px;
      color: #1596ff;
      text-align: center;
      font-size: 14px;
      h5 {
        margin-top: 10px;
        margin-bottom: 10px;
      }
      .sp {
        color: #fff;
        font-size: 12px;
      }
    }
    /deep/.el-menu-item-group__title {
      padding: 0;
    }
  }
  .el-main {
    //height: 100%;
    margin: 0;
    padding: 0;
    overflow: auto;
  }
  .dialog-setup {
    text-align: center;
    .el-dialog__body {
      div {
        cursor: pointer;
        height: 50px;
        line-height: 50px;
        font-weight: 700;
        font-size: 18px;
      }
    }
  }
}
#we .el-aside .el-submenu .el-menu-item {
  height: 35px;
  padding-left: 60px !important;
}
</style>

<script>
import qs from "qs";
import picLogo from "../assets/indexlogo.png";
import { createNamespacedHelpers } from "vuex";
const { mapState, mapActions } = createNamespacedHelpers("home");
const { mapState: logoState } = createNamespacedHelpers("login");
export default {
  inject: ["reload"],
  data() {
    return {
      shrinkBtnNum: true, // 对讲框点击放大缩小
      // 对讲组表单数据
      formss: {
        name: "",
        region: "",
        regionOne: "",
      },
      startEnd: true, //开始讲话判断
      voiceData: true, // 对讲组声音开关数据
      form: {
        name: "",
        oldPassword: "",
        newPassword: "",
        Passwordes: "",
      },
      // 设置弹框
      SetUpDialogVisible: false,
      // 更改姓名弹框
      editNameVisible: false,
      editPassVisible: false,
      SignOutVisible: false,
      // 定时器调用消息提示
      timer: "",
      message: "", //用户名称
      hasNews: false,
      picLogo: picLogo,
      hasPhone: false,
      roleList: [], //菜单权限
      AllRoleone: "",
      roleListtwo: [], //记录管理权限
      rolearrTwo: [], //系统设置权限
      hasRange: false,
      hasTalkback: false,
      user: {},
      sxdata: true,
    };
  },
  mounted() {
    // this.timer = setInterval(this.open, 10000);
    this.getState();
    this.getPhoneState();
    this.getSettings();
    this.getTalkBack();
  },
  // onshow() {
  //   this.reload();
  // },
  created() {
    this.getMessage();
    this.getRoleDatas();
    this.getName();
    this.jtUser();
    this.sxym();
    // this.jiluData();
  },
  computed: {
    ...logoState(["logoImg"]),
  },
  methods: {
    // 定时刷新页面
    sxym() {
      if (!window.name) {
        "第一次开这个窗口！name值" + window.name;
        window.name = "test";
        location.reload();
        // if (window.name == "test") {
        //   return;
        // }
      } else {
        if (window.name == "test1") {
          window.name = "test2";
          location.reload();
        }
        "刷新操作 name值：" + window.name;
      }
      // if (this.sxdata == true) {
      //   this.reload();
      //   this.sxdata = false;
      // }
    },
    // 对讲组声音开关数据
    VoiceSwitch() {
      this.voiceData = !this.voiceData;
    },
    // 对讲组点阿基成员信息弹框
    viewMemData() {
      //之后需要做判断
      // this.DispatcherDialogVisible = true;
      // this.MemberDialogVisible = true;
    },
    //对讲开始结束
    chengestartend() {
      this.startEnd = !this.startEnd;
    },
    // 对讲框点击放大缩小
    shrinkBtn() {
      this.shrinkBtnNum = !this.shrinkBtnNum;
    },
    ...mapActions(["newsStateAsync", "getLogoAsync", "phoneStateAsync"]),
    //功能配置(电子围栏)
    getSettings() {
      let mapRange = JSON.parse(sessionStorage.getItem("configMapRange"));
      // (mapRange,"电子围栏");
      if (mapRange == 0) {
        this.hasRange = true;
      } else if (mapRange == 1) {
        this.hasRange = false;
      }
    },
    //功能配置(对讲组)
    getTalkBack() {
      let talkback = JSON.parse(sessionStorage.getItem("configTalkback"));
      // (talkback,"对讲组");
      if (talkback == 0) {
        this.hasTalkback = true;
      } else if (talkback == 1) {
        this.hasTalkback = false;
      }
    },
    // 监听web
    jtUser() {
      this.user = localStorage.user;
      // ("监听user", this.user);

      window.dispatchEvent(
          new CustomEvent("myVideoEvent", {
            detail: {
              data: this.user,
            },
          })
      );
      // ("监听web");
    },
    //获取登录时保存在session中的权限数据
    async getRoleDatas() {
      // ("获取权限数据1", this.$route.query.AllRole);
      // if (this.$route.query.AllRoleData == 1) {
      //   this.roleList = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13];
      //   return (this.roleList);
      // }
      // let arr = sessionStorage.roleData.split(",");
      // ("调度员身份ddy", localStorage.ddyDatas);

      let arr = localStorage.roleData.split(",");
      arr = arr.map(Number);
      // arr = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13];
      // const arr = JSON.parse(sessionStorage.roleData);
      this.roleList = arr;

      // ("当前用户角色菜单权限", this.roleList);
      // (this.roleList.indexOf(2) > -1);
      let arrOne = localStorage.jiluDataList.split(",");
      // ("记录管理页面权限23", arrOne);
      arrOne = arrOne.map(Number);
      this.roleListtwo = arrOne;
      // ("记录管理页面权限23", this.roleListtwo);

      let arrTwo = localStorage.TwoDataList.split(",");
      arrTwo = arrTwo.map(Number);
      this.rolearrTwo = arrTwo;
      // ("当前用户角色菜单权限", this.roleList);
      if (this.roleList.indexOf(7) !== -1) {
        this.hasRange = true;
      }
      // sessionStorage.isReL = true;
      // ("sessionStorage.isReL", sessionStorage.isReL);
      // if (sessionStorage.isReL == undefined) {
      //   this.reload();
      //   sessionStorage.isReL = false;
      // }
      // this.reload();
      // ("记录管理页面权限", this.roleListtwo);
      // ("系统设置页面权限", this.rolearrTwo);
    },
    // 监听侧边栏数据
    handleAss(key, keyPath) {},
    //消息中心状态
    async getState() {
      const data = await this.newsStateAsync();
      if (data == 0) {
        this.hasNews = false;
      } else if (data.length > 0) {
        this.hasNews = true;
      }
    },
    //未接来电状态
    async getPhoneState() {
      const data = await this.phoneStateAsync();
      if (data == 0) {
        this.hasPhone = false;
      } else if (data > 0) {
        this.hasPhone = true;
      }
    },
    getName() {
      // ("用户姓名", localStorage.objName);
      // let infostr = localStorage.objName;
      // let objName = JSON.parse(infostr);
      // ("用户名", objName);
      this.message = localStorage.objName;
      let mes = JSON.parse(localStorage.objName);
      // ("用户名mes", mes);
      // ("用户名message", this.message);
      this.message = mes;
      // this.message = localStorage.objName;
      // ("this.message", this.message);
    },
    // 获取用户名
    getMessage() {
      if (this.$route.query.AllRole == 1) {
        // sessionStorage.roleData = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13];
        locationStorage.roleData = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13];
        this.roleList = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13];
      }
      //从sessionStorage中获取用户的类型
      if (this.$route.query.AllMess !== "") {
        sessionStorage.objName = this.$route.query.AllMess;
        return (this.message = this.$route.query.AllMess);
      }
      // var infostr = localStorage.objName;
      // var objName = JSON.parse(infostr);
      // ("用户名", objName);
      // this.message = objName;
    },
    // 打开设置弹框
    getSetUp() {
      this.SetUpDialogVisible = true;
    },
    // 侧边栏逻辑
    handleOpen(key, keyPath) {
      "侧边栏逻辑", key, keyPath;
    },
    handleClose(key, keyPath) {
      key, keyPath;
    },
    // 点击跳转回首页
    backhome() {
      // sessionStorage.setItem("token", "true");
      // ("权限", localStorage.roleData);

      // if (localStorage.roleData.indexOf("1") !== -1) {
      //   (
      //     "localStorage.roleData.indexOf(1) !== -1",
      //     localStorage.roleData.indexOf("1") !== -1
      //   );
      //   this.$message("您没有首页菜单权限");
      // } else {
      // if (this.$route.query.AllRole == 1) {
      //   this.AllRoleone = 1;
      // }
      this.$router.push({
        path: "/home",
        query: {
          name: this.message,
          AllMess: this.message,
          AllRole: this.AllRoleone,
        },
      });
      // }
    },
    // 点击跳转到未接电话栏
    getTelephone() {
      this.$router.push("/telephone");
    },
    // 点击跳转到消息中心栏
    getNews() {
      // sessionStorage.setItem("token", "true");
      this.$router.push("/news");
    },
    // 点击更改姓名弹框
    editName() {
      this.SetUpDialogVisible = false;
      this.editNameVisible = true;
    },
    //修改名称
    async editNameTrue() {
      const { data: res } = await this.$http.post(
          "user/modifyName",
          qs.stringify(this.form)
      );
      if (res.code !== 200) return this.$message.error(res.message);
      this.$message.success("修改姓名成功");
      this.editNameVisible = false;
      this.message = this.form.name;
      localStorage.objName = this.form.name;
      // this.$router.push("/login");
    },

    // 点击更改密码
    editPassword() {
      this.SetUpDialogVisible = false;
      this.editPassVisible = true;
    },
    // 更改密码
    async editPasswordTrue() {
      if (this.form.Passwordes !== this.form.newPassword)
        return this.$message.error("请输入一样的密码");
      const { data: res } = await this.$http.post(
          "user/modifyPassWord",
          qs.stringify(this.form)
      );
      if (res.code !== 200) return this.$message.error(res.message);
      this.$message.success("修改密码成功");
      this.editPassVisible = false;
      this.$router.push("/login");
    },

    // 退出登录
    async LogoutEvent() {
      const yesDeleteData = await this.$confirm(
          "此操作将退出登录, 是否继续?",
          "提示",
          {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning",
          }
      ).catch((err) => err);
      if (yesDeleteData != "confirm") {
        return this.$message.info("取消登出账号");
      }
      const { data: res } = await this.$http.get("admin/logout");
      "推出登录res", res;
      if (res.code !== 200) {
        return this.$message(res.message);
      }
      this.$message.success("退出登录成功");
      sessionStorage.clear();
      localStorage.clear();
      window.name = "test1";
      // this.$router.push({
      //   path: "/login"
      // });
      // this.$router.push(this.$src);
      // this.$router.push({ name: "Login" ,});
      "window.name", window.name;

      "window.location.href", window.location.href;
      let url = window.location.href;
      let urlone = url.split("?");
      "urlone", urlone;
      window.location.href = urlone[0];
      //退出登录成功断开websocket
      this.closeWS();
      // ----------------------
      this.$router.push({
        path: "/login",
      });
      console.log("退出登录");
      // 退出登录挂断电话
      window.dispatchEvent(
          new CustomEvent("tuiLogin", {
            tuiId: "退出登录并关闭童话",
          })
      );
      // 退出登录挂断电话end

      // let a = document.createElement("a");
      // a.href = urlone;
      // a.click();
    },
    // 获取提示消息
    open() {
      this.$notify({
        title: "username",
        message: "已经进入电子围栏区域",
        position: "bottom-right",
      });
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
  },
};
</script>

<style lang="less" scoped>
#we {
  .home-container {
    font-size: 21px;
    //min-height: 100%;
    height: 91.5vh;
    min-width: 100%;
  }
  .el-header {
    height: 80px !important;
    line-height: 80px;
    background: linear-gradient(
        199deg,
        rgba(51, 167, 255, 1) 0%,
        rgba(0, 103, 248, 1) 100%
    );
    .logo {
      float: left;
      height: 80px;
      line-height: 80px;
      .lo {
        width: 84px;
        height: 42px;
        font-size: 30px;
        font-family: DIN;
        font-weight: bold;
        line-height: 42px;
        color: rgba(255, 255, 255, 1);
        img {
          vertical-align: middle;
          margin-top: 5px;
          height: 90%;
        }
      }
      .mi {
        margin-left: 10px;
        width: 336px;
        height: 42px;
        font-size: 24px;
        font-family: Microsoft YaHei;
        font-weight: bold;
        line-height: 42px;
        color: rgba(255, 255, 255, 1);
      }
    }
    .header-right {
      float: right;
      div {
        // display: table-cell;
        position: relative;
        float: left;
        height: 100%;
        width: 80px;
        text-align: center;
        vertical-align: middle;
        img {
          display: inline-block;
          width: 100%;
          height: 100%;
        }
      }
      div:nth-child(1) {
        img {
          margin-top: 20px;
          width: 50%;
          height: 50%;
        }
      }
      .hr-two {
        img {
          margin-top: -10px !important;
          width: 80px !important;
          height: 80px !important;
        }
      }
      .hr-three {
        img {
          margin-top: -10px !important;
          width: 80px !important;
          height: 80px !important;
        }
      }
      .hr-four {
        img {
          margin-top: 0px !important;
          width: 80px !important;
          height: 80px !important;
        }
      }
      .hr-five {
        text-align: center;
        vertical-align: middle;
        width: 160px;
        img {
          // display: inline-block;
          text-align: center;
          vertical-align: middle;
          width: 40px;
          height: 40px;
        }
        span {
          font-size: 14px;
          color: rgba(255, 255, 255, 1);
          margin-left: 5px;
        }
      }
    }
    .item {
      margin-top: 10px;
      margin-right: 40px;
    }
  }
  .header-right {
    cursor: pointer;
  }
  .hr-five {
    cursor: default;
  }
  .el-container {
    position: relative;
    min-height: 100%;
    min-width: 100%;
  }
  .el-aside {
    width: 240px !important;
    min-height: 70% !important;
    // height: 1000px;
    background-color: #011c31;
    //  line-height: 100px !important;
    /deep/.left-top {
      width: 100%;
      height: 700px;
      // height: 80%;
      min-height: 80%;
      background-color: #011c31;
    }
    .left-bottom {
      width: 100%;
      // height: 90px;
      height: 120px;
      background-color: #011c31;
      text-align: center;
    }

    .el-submenu__title {
      height: 60px;
      border-bottom: 1px solid #1596ff;
      span {
        font-size: 20px;
        margin-left: 18px;
      }
    }
    .el-menu-item {
      font-size: 20px;
      span {
        font-size: 20px;
        margin-left: 18px;
      }
    }
    .el-menu-item-group {
      .el-menu-item {
        font-size: 14px;
      }
    }
    .el-menu-item-group__title {
      padding: 0px 0 7px 12px;
    }
    .el-submenu .el-menu-item {
      height: 40px;
      line-height: 40px;
    }
    .template {
      height: 60px;
    }
    .el-menu {
      border-right: none;
    }
    .aside-down {
      // position: absolute;
      // bottom: 5px;
      text-align: center;
      width: 100%;
      // height: 60px;
      margin-bottom: 10px;
      color: #1596ff;
      text-align: center;
      font-size: 14px;
      h5 {
        margin-top: 10px;
        margin-bottom: 10px;
      }
      .sp {
        color: #fff;
        font-size: 12px;
      }
    }
    /deep/.el-menu-item-group__title {
      padding: 0;
    }
  }
  .el-main {
    //height: 100%;
    margin: 0;
    padding: 0;
    overflow: auto;
  }
  .dialog-setup {
    text-align: center;
    .el-dialog__body {
      div {
        cursor: pointer;
        height: 50px;
        line-height: 50px;
        font-weight: 700;
        font-size: 18px;
      }
    }
  }
}
#we .el-aside .el-submenu .el-menu-item {
  height: 35px;
  padding-left: 60px !important;
}
</style>

<template>
  <div id="adld">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>修改项目</span>
        <div class="backTo">
          <el-button style="margin-top:10px;" type="primary" @click="backpro">返回</el-button>
          <el-breadcrumb
            separator-class="el-icon-arrow-right"
            style="margin-left:15px;margin-top:10px;"
          >
            <el-breadcrumb-item>项目管理</el-breadcrumb-item>
            <el-breadcrumb-item>修改项目</el-breadcrumb-item>
          </el-breadcrumb>
        </div>
      </div>
      <!-- 表单主体 -->
      <div class="main">
        <el-form
          :model="updateForm"
          ref="updateForm"
          :rules="rules"
          label-width="120px"
          class="demo-ruleForm"
        >
          <el-form-item label="项目名称：" prop="projectName" required>
            <el-input style="width:400px;" v-model="updateForm.projectName"></el-input>
          </el-form-item>

          <el-form-item label="项目地址：" style="width:500px" prop="projectAddress" required>
            <div
              id="searchResultPanel"
              style="border:1px solid #C0C0C0;width:150px;height:auto; display:none;"
            ></div>

            <label>
              <el-cascader
                v-model="area"
                :options="areaOption"
                @change="handleChange"
                clearable
                :placeholder="activePlace"
              ></el-cascader>
            </label>
            <el-input
              v-model="updateForm.projectAddress"
              placeholder="请输入详细地址地图定位"
              style="width:400px;"
              @change="adress"
              id="suggestId"
            ></el-input>
          </el-form-item>
          <el-form-item style="marginTop:-15px;">
            <baidu-map
              :center="center"
              :zoom="zoom"
              @ready="handler"
              class="baiduMap"
              :scroll-wheel-zoom="true"
              id="l-map"
            >
              <!-- <bm-view class="map"></bm-view> -->
              <bm-local-search :keyword="areaPosition" :auto-viewport="true" :panel="false"></bm-local-search>
              <bm-local-search
                :keyword="updateForm.projectAddress"
                :auto-viewport="true"
                :panel="false"
                @searchcomplete="getGps"
              ></bm-local-search>
            </baidu-map>
          </el-form-item>
          <!-- 地图位置 -->
          <!-- <div class="map-main"></div> -->

          <el-form-item label="项目负责人：" prop="personInCharge">
            <el-input v-model="updateForm.personInCharge" style="width:400px;" placeholder="限20字"></el-input>
          </el-form-item>
          <el-form-item label="负责人电话：" prop="picPhone">
            <el-input v-model="updateForm.picPhone" style="width:400px;"></el-input>
          </el-form-item>
          <el-form-item label="项目状态：" prop="status" style="width:240px">
            <el-select v-model="updateForm.status" style="width:240px" class="selectInput">
              <el-option label="进行中" value="0"></el-option>
              <el-option label="已结束" value="1"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="项目简介：" prop="introduction ">
            <el-input type="textarea" style="width:600px;" v-model="updateForm.introduction" :rows="6"></el-input>
          </el-form-item>

          <el-form-item>
            <el-button type="primary" @click="editPushData">保存</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
  </div>
</template>

<script>
import { regionData, CodeToText, TextToCode } from "element-china-area-data";
import { BmlMarkerClusterer } from "vue-baidu-map";
export default {
  data() {
    return {
      // 表单验证绑定数据
      center: { lng: 104, lat: 30 },
      zoom: 16,
      updateForm: {
        pid: null,
        projectName: "王二狗乐基有限公司",
        projectAddress: "",
        personInCharge: "张三",
        picPhone: "1889498798",
        status: "",
        introduction: "asdsadsakldksajkd",
        businessId: 1,
        longitude: "",
        latitude: ""
      },
      location: "北京",
      keyword: "百度",
      areaOption: regionData,
      area: "",
      address: "",
      activePlace: "请选择",
      rules: {
        projectName: [
          { required: true, message: "请输入企业名称", trigger: "blur" },
          { min: 1, max: 20, message: "长度不能超过20个字符", trigger: "blur" }
        ],
        projectAddress: [
          { required: true, message: "请选择项目地址", trigger: "blur" }
        ],
        personInCharge: [
          { required: true, message: "请输入项目负责人", trigger: "blur" }
        ],
        picPhone: [
          { required: true, message: "请输入负责人电话", trigger: "blur" }
        ],
        status: [
          { required: true, message: "请选择项目状态", trigger: "blur" }
        ],
        introduction: [
          { required: true, message: "请输入项目简介", trigger: "blur" },
          {
            min: 1,
            max: 500,
            message: "长度不能超过500个字符",
            trigger: "blur"
          }
        ]
      }
    };
  },
  created() {
    this.getPushData();
  },
  methods: {
    getPushData() {
      ("跳转编辑页面获得数据", this.$route.query);
      this.updateForm.pid = this.$route.query.pid;
      this.updateForm.projectName = this.$route.query.projectName;
      this.updateForm.projectAddress = this.$route.query.projectAddress;
      this.updateForm.personInCharge = this.$route.query.personInCharge;
      this.updateForm.picPhone = this.$route.query.picPhone;
      this.updateForm.introduction = this.$route.query.introduction;
      this.updateForm.businessId = this.$route.query.businessId;
      this.updateForm.longitude = this.$route.query.longitude;
      this.updateForm.latitude = this.$route.query.latitude;

      (this.$route.query.projectAddress);

      let aaa = this.$route.query.projectAddress.split("-")[1];
      (aaa);
      this.address = aaa;
      this.setLocation = this.$route.query.projectAddress;
      if (this.$route.query.status == 0) {
        this.$route.query.status = "进行中";
      } else if (this.$route.query.status == 1) {
        this.$route.query.status = "已结束";
      }
      this.updateForm.status = this.$route.query.status;

      // (this.updateForm);
    },
    backpro() {
      this.$router.push("/project");
    },
    handleChange(value) {
      let province = CodeToText[value[0]];
      let city = CodeToText[value[1]];
      let area = CodeToText[value[2]];
      this.location = province + city + area;
      this.changelocationflag = true;
      this.areaPosition = province + city + area;
      this.updateForm.projectAddress = this.areaPosition;
    },
    //百度地图
    handler({ BMap, map }) {
      var point = new BMap.Point(104.081548, 30.652613);
      map.centerAndZoom(point, 5);
    },
    getGps(results) {
      // this.gpsLocation = results.Br[0].point;
      this.gpsLocation = results.Hr[0].point;
    },
    // 提交编辑信息
    async editPushData() {
      if (this.updateForm.status == "进行中") {
        this.updateForm.status = 0;
      } else if (this.updateForm.status == "已结束") {
        this.updateForm.status = 1;
      }
      this.updateForm.pid = parseInt(this.updateForm.pid);
      this.updateForm.businessId = parseInt(this.updateForm.businessId);
      this.updateForm.longitude = this.gpsLocation.lng;
      this.updateForm.latitude = this.gpsLocation.lat;
      // (this.updateForm.status);
      ("this.areaPosition", this.areaPosition);

      if ((this.changelocationflag = true)) {
        this.updateForm.projectAddress;
      } else {
        this.updateForm.projectAddress = this.setLocation;
      }
      ("编辑数据", this.updateForm);

      const { data: res } = await this.$http.post(
        "project/updateProject",
        this.updateForm
      );
      ("编辑res", res);
      if (res.code == 200) {
        this.$message("修改成功");
        this.$router.push("/project");
      } else {
        this.$message(res.message);
      }
    },
    adress() {}
  }
};
</script>

<style scoped>
.backTo {
  display: flex;
  align-items: center;
}
/* 地图容器 */
#l-map {
  width: 6rem;
  height: 3rem;
  margin-top: 20px;
}

.main {
  width: 100%;
  height: 100%;
}

.main .el-form .second .el-input {

  margin-left: 20px;
}

.main .el-form .address {
  margin-top: 15px;
}

.main form {
  height: 100%;
  overflow: auto;
}

</style>

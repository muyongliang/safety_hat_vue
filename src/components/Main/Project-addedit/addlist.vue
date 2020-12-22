<template>
  <div id="adld">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>添加项目</span>
        <div class="backTo">
          <el-button style="margin-top:10px;" type="primary" @click="backpro">返回</el-button>
          <el-breadcrumb
            separator-class="el-icon-arrow-right"
            style="margin-left:15px;margin-top:10px;"
          >
            <el-breadcrumb-item>项目管理</el-breadcrumb-item>
            <el-breadcrumb-item>添加项目</el-breadcrumb-item>
          </el-breadcrumb>
        </div>
      </div>
      <!-- 表单主体 -->
      <div class="main">
        <el-form :model="addForm" ref="addForm" label-width="120px"  :rules="rules">
          <el-form-item label="项目名称：" prop="projectName">
            <el-input style="width:400px;" v-model="addForm.projectName"></el-input>
          </el-form-item>

          <el-form-item label="项目地址：" prop="projectAddress">
            <label>
              <el-cascader v-model="area" :options="areaOption" @change="handleChange" clearable></el-cascader>
            </label>
            <el-input
              v-model="addForm.projectAddress"
              placeholder="请输入详细地址"
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
                :keyword="addForm.projectAddress"
                :auto-viewport="true"
                :panel="false"
                @searchcomplete="getGps"
              ></bm-local-search>
            </baidu-map>
          </el-form-item>

          <!-- 地图位置 -->

          <el-form-item label="项目负责人：" prop="personInCharge">
            <el-input style="width:400px;" v-model="addForm.personInCharge" placeholder="限20字"></el-input>
          </el-form-item>
          <el-form-item label="负责人电话：" prop="picPhone">
            <el-input style="width:400px;" v-model="addForm.picPhone"></el-input>
          </el-form-item>
          <el-form-item label="项目状态：" prop="status">
            <el-select v-model="addForm.status" class="selectInput">
              <el-option label="进行中" value="0"></el-option>
              <el-option label="已结束" value="1"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="项目简介：" prop="introduction">
            <el-input style="width:600px;" type="textarea" v-model="addForm.introduction" :rows="6"></el-input>
          </el-form-item>

          <el-form-item>
            <el-button type="primary" @click="addDataList">保存</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
  </div>
</template>

<script>
import { regionData, CodeToText, TextToCode } from "element-china-area-data";
import { BmlMarkerClusterer } from "vue-baidu-map";
import { createNamespacedHelpers } from "vuex";
const { mapState, mapActions } = createNamespacedHelpers("project");
export default {
  data() {
    return {
      center: { lng: 104, lat: 30 },
      zoom: 13,
      addForm: {
        pid: null,
        projectName: "",
        projectAddress: "",
        personInCharge: "",
        picPhone: "",
        status: "",
        introduction: "",
        businessId: 1,
        longitude: "",
        latitude: ""
      },
      location: "北京",
      keyword: "百度",
      areaOption: regionData,
      area: "",
      address: "",
      areaPosition: "",
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
  computed: {},
  methods: {
    ...mapActions(["addProjectAsync"]),
    // 返回到项目管理页面
    backpro() {
      this.$router.push("/project");
    },
    // 省市级联动
    handleChange(value) {
      let province = CodeToText[value[0]];
      let city = CodeToText[value[1]];
      let area = CodeToText[value[2]];
      // this.location = province + city + area;
      // this.site = value;
      // this.area=province + city + area;
      this.areaPosition = province + city + area;
      // this.activePlace=province + city + area;

      this.addForm.projectAddress = this.areaPosition;
    },
    handler({ BMap, map }) {
      var point = new BMap.Point(104.081548, 30.652613);
      map.centerAndZoom(point, 5);
    },
    getGps(results) {
      // (results.Br[0].point);
      // this.gpsLocation = results.Br[0].point;
      if(results){
        this.gpsLocation = results.Hr[0].point;
      }
    },
    // 点击保存，添加数据，并返回项目管理页面（表单清空）
    async addDataList() {
      this.addForm.longitude = this.gpsLocation.lng;
      this.addForm.latitude = this.gpsLocation.lat;
      const data = await this.addProjectAsync(this.addForm);
      ("添加数据", data);
      if (data.data.code == 200) {
        this.$message.success("添加成功");
        this.$router.push("/project");
      } else {
        this.$message(data.data.message);
      }
    },

    adress() {}
    //百度地图
    // handler({ BMap, map }) {
    //   // 百度地图API功能
    //   function G(id) {
    //     return document.getElementById(id);
    //   }

    //   var mapS = new BMap.Map("l-map");
    //   var point = new BMap.Point(104.081548, 30.652613);
    //   mapS.centerAndZoom(point, 5); // 初始化地图,设置城市和地图级别。
    //   var ac = new BMap.Autocomplete({ input: "suggestId", location: mapS }); //建立一个自动完成的对象

    //   ac.addEventListener("onhighlight", function(e) {
    //     //鼠标放在下拉列表上的事件
    //     var str = "";
    //     var _value = e.fromitem.value;
    //     var value = "";
    //     if (e.fromitem.index > -1) {
    //       value =
    //         _value.province +
    //         _value.city +
    //         _value.district +
    //         _value.street +
    //         _value.business;
    //     }
    //     str =
    //       "FromItem<br />index = " +
    //       e.fromitem.index +
    //       "<br />value = " +
    //       value;

    //     value = "";
    //     if (e.toitem.index > -1) {
    //       _value = e.toitem.value;
    //       value =
    //         _value.province +
    //         _value.city +
    //         _value.district +
    //         _value.street +
    //         _value.business;
    //     }
    //     str +=
    //       "<br />ToItem<br />index = " +
    //       e.toitem.index +
    //       "<br />value = " +
    //       value;
    //     G("searchResultPanel").innerHTML = str;
    //   });

    //   var myValue;
    //   ac.addEventListener("onconfirm", function(e) {
    //     //鼠标点击下拉列表后的事件
    //     var _value = e.item.value;
    //     myValue =
    //       _value.province +
    //       _value.city +
    //       _value.district +
    //       _value.street +
    //       _value.business;
    //     G("searchResultPanel").innerHTML =
    //       "onconfirm<br />index = " +
    //       e.item.index +
    //       "<br />myValue = " +
    //       myValue;

    //     setPlace();
    //   });
    //   function setPlace() {
    //     mapS.clearOverlays(); //清除地图上所有覆盖物
    //     function myFun() {
    //       var pp = local.getResults().getPoi(0).point; //获取第一个智能搜索的结果
    //       mapS.centerAndZoom(pp, 18);
    //       mapS.addOverlay(new BMap.Marker(pp)); //添加标注
    //       window.ppp = pp;
    //     }
    //     var local = new BMap.LocalSearch(mapS, {
    //       //智能搜索
    //       onSearchComplete: myFun
    //     });
    //     local.search(myValue);
    //   }
    // },
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
  height: 2rem;
  margin-top: 20px;
}
.main {
  width: 100%;
  height: 13.33333rem;

}
.main form {
  height: 100%;
  overflow: auto;
}

.main .el-form .address {
  margin-top: 15px;
}

.main .el-cascader {
  margin-bottom: 20px;
}

</style>

// 视频全屏页面
<template>
  <div id="fullveo">
    <div class="header">
      <span class="name">无声侦查</span>
      <div class="rtl">
        <span class="yuan"></span>
        <span>调度员</span>
      </div>
      <div class="icones">
        <ul>
          <li>
            <img src="../../../assets/images/组 2102.png" alt />
          </li>
          <li>
            <img src="../../../assets/images/组 2103.png" alt />
          </li>
          <li>
            <img src="../../../assets/images/组 2104.png" alt />
          </li>
          <li>
            <img src="../../../assets/images/组 2105.png" alt />
          </li>
          <li>
            <img src="../../../assets/images/组 2106.png" alt />
          </li>
          <li style="margin-left:150px" @click="backMail">
            <img src="../../../assets/images/组 2107.png" alt />
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  methods: {
    // 返回通讯录页面
    backMail() {
      this.$router.push("/mail");
    }
  }
};
</script>

<style>
#fullveo .header {
  /* height: 60px; */
  line-height: 60px;
  background-color: pink;
  box-sizing: border-box;
}
#fullveo .header .name {
  text-align: center;
  font-weight: 700;
  margin-left: 730px;
}
#fullveo .header .rtl {
  height: 60px;
  display: inline-block;
  font-size: 16px;
  margin-left: 200px;
}
#fullveo .header .rtl .yuan {
  display: inline-block;
  height: 10px;
  width: 10px;
  background-color: #67c23a;
  border-radius: 50%;
  margin-right: 5px;
}
#fullveo .header .icones {
  vertical-align: middle;
  display: inline-block;
  margin-left: 200px;
}
#fullveo .header .icones ul {
  float: right;
  padding: 0;
  margin: 0;
}
#fullveo .header .icones ul li {
  list-style: none;
  float: left;
  margin-right: 10px;
}
#fullveo .header .icones ul li img {
  margin-top: 20px;
}
</style>

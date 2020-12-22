// 消息中心
<template>
  <div id="new">
    <!-- <el-card class="box-card">
      <div slot="header">
        <span>消息中心</span>
      </div>
      <div class="news-main">
        <div class="newList" style="border-top: 1px soild pink;">
          <span>推送通知标题，1行显示</span>
          <br />
          <span>消息文本内容，默认展示最多展示3行，超过的，再末尾显示查看更多，可展开查看更多Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean euismod bibendum laoreet. Proin gravida dolor sit amet lacus accumsan et viverra justo commodo. Proin sodales pulvinar tempor. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Nam fermentum, nulla luctus pharetra vulputate, felis tellus mollis orci, sed rhoncus sapien nunc eget.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean euismod bibendum laoreet. Proin gravida dolor sit amet lacus accumsan et viverra justo commodo. , felis tellus mollis orci, , felis tellus l…</span>
          <span style="margin-left:200px;">查看更多</span>
          <p style="font-weight:400;font-size:12px;">2019-10-23 12:00</p>
        </div>
      </div>
    </el-card>-->
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>消息中心</span>
      </div>
      <div class="main">
        <el-table :data="list" style="width: 100%" border>
          <el-table-column prop="mid" label="id" v-if="showID"></el-table-column>
          <el-table-column prop="title" label="推送通知名称" width="250"></el-table-column>
          <el-table-column prop="content" label="消息内容"></el-table-column>
          <el-table-column prop="time" label="推送时间" width="200"></el-table-column>
          
        </el-table>
      </div>

      <!-- 分页 -->
      <el-pagination
        layout="prev, pager, next"
        :total="total"
        :page-size="pageSize"
        :current-page="pageNum"
        @current-change="handleCurrentChange"
      ></el-pagination>
    </el-card>
  </div>
</template>

<script>
import { createNamespacedHelpers } from "vuex";
const { mapState, mapActions } = createNamespacedHelpers("system");
export default {
  data() {
    return {
      showID: false
    };
  },
  async mounted() {
    if (window.location.href.indexOf("#reloaded") == -1) {
      window.location.href = window.location.href + "#reloaded";
      window.location.reload();
    }
    this.newsFormAsync();
    await this.getSts();
    this.changeSts();
  },
  computed: {
    ...mapState(["pageNum", "pageSize", "list", "total"])
  },
  methods: {
    ...mapActions(["newsFormAsync", "changePageAsync", "newsCheckAsync","newsStateAsync"]),
    //状态
    async getSts() {
      const data = await this.newsStateAsync();
      this.ids = data;
    },
    changeSts() {
      let arr = JSON.stringify(this.ids);      
      this.newsCheckAsync({
        mid: arr
      });
    },
    //分页
    handleCurrentChange(val) {
      this.changePageAsync(val);
    },
  }
};
</script>

<style lang="less" scoped>
#new {
  .el-card {
    margin: 10px;
    box-shadow: 0 1px 1px rgba(0, 0, 0, 0.15);
    //   .news-main {
    //     .newList {
    //       box-sizing: border-box;
    //       height: 200px;
    //       width: 100%;
    //       border: 1px soild black !important;
    //       border-radius: 5px;
    //       span {
    //         display: inline-block;
    //         font-size: 14px;
    //         font-weight: 400;
    //       }
    //     }
    //   }
    .el-pagination {
      margin-top: 20px;
    }
  }
}
</style>
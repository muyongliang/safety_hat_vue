<template>
  <div class="pageSet">
    <p>页面设置</p>
    <el-form ref="form" :model="form" :rules="rules" label-width="140px">
      <el-form-item prop="name" label="系统名称">
        <el-input v-model="form.name"></el-input>
      </el-form-item>
      <el-form-item label="系统图标">
        <el-upload
          class="upload-demo"
          ref="uploadmeta"
          multiple
          :on-remove="handleRemove"
          :file-list="iconList"
          :before-upload="beforeIconUpload"
          action
          :http-request="uploadIcon"
          :limit="1"
          :on-exceed="systemPictureError"
          :on-preview="systemPicturePreview"
          list-type="picture-card"
        >
          <!-- <img class="img-upload" :src="logoImg.metaImg || picMeta"/> -->
          <i class="el-icon-plus"></i>
          <div class="el-upload__tip" slot="tip">用于在浏览器标签上显示，仅支持常规png、jpg格式，图片小于500KB，建议比例为1:1</div>
          <el-dialog :visible.sync="systemPictureVisible">
            <img width="100%" :src="systemPictureUrl" alt />
          </el-dialog>
        </el-upload>
      </el-form-item>
      <el-form-item label="管理后台LOGO">
        <el-upload
          class="upload-demo"
          ref="uploadlogo"
          :on-preview="logoPreview"
          multiple
          :file-list="logoList"
          :before-upload="beforeLogoUpload"
          :on-remove="handleRemove2"
          action
          :http-request="uploadLogo"
          :limit="1"
          :on-exceed="logoError"
          list-type="picture-card"
        >
          <!-- <img class="img-upload" :src="logoImg.logoImg || picLogo"/> -->
          <i class="el-icon-plus"></i>
          <div class="el-upload__tip" slot="tip">用于顶部导航栏上显示，仅支持常规png、jpg格式，图片小于1M，建议尺寸120*40 px</div>
          <el-dialog :visible.sync="logoVisible">
            <img width="100%" :src="logoUrl" alt />
          </el-dialog>
        </el-upload>
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          @click="submitUpload('form')"
          v-show="roleList.indexOf(122) !== -1"
        >保存修改</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import picLogo from "../../../assets/indexlogo.png";
import picMeta from "../../../assets/panda.png";
import { createNamespacedHelpers } from "vuex";
const { mapState, mapActions } = createNamespacedHelpers("login");
import axios from "axios";
import { async } from "q";
export default {
  data() {
    return {
      picLogo: picLogo,
      picMeta: picMeta,
      isShowMeta: true,
      isShowImg: true,
      form: {
        name: ""
      },
      iconList: [],
      logoList: [],
      uploadData: new FormData(),
      rules: {
        name: [{ required: true, message: "请输入名称", trigger: "change" }]
      },
      systemPictureUrl: "",
      systemPictureVisible: false,
      logoUrl: "",
      logoVisible: false,
      roleList: []
    };
  },
  computed: {
    ...mapState(["logoImg"])
  },
  async mounted() {
    await this.getLogoAsync(window);
    (this.logoImg);
    if (this.logoImg) {
      this.iconList.push({
        name: "pic",
        url: this.logoImg.metaImg
      });
      this.logoList.push({
        name: "pic",
        url: this.logoImg.logoImg
      });
    } else {
      this.iconList.push({
        name: "pic",
        url: picMeta
      });
      this.logoList.push({
        name: "pic",
        url: picLogo
      });
    }
    (this.iconList, this.logoList);
  },
  created() {
    this.getRoleBtnData();
  },
  methods: {
    // 功能权限
    async getRoleBtnData() {
      let dataR = {
        parentId: 25,
        userName: null
      };
      const { data: res } = await this.$http.get("menu/getButtonMenus", {
        params: dataR
      });
      // ("获取数据页面功能权限", res);
      let arr = [];
      res.data.forEach(item => {
        arr.push(item.mid);
      });
      this.roleList = arr;
      ("获取数据页面功能权限", this.roleList);
      //  v-show="roleList.indexOf(35) !== -1"
    },

    ...mapActions(["getLogoAsync"]),
    systemPicturePreview(file) {
      this.systemPictureUrl = file.url;
      this.systemPictureVisible = true;
    },
    logoPreview(file) {
      this.logoUrl = file.url;
      this.logoVisible = true;
    },
    //  删除文件
    handleRemove(file, iconList) {
      this.uploadData.delete("meta");
    },
    handleRemove2(file, logoList) {
      this.uploadData.delete("logo");
    },
    // 限制上传文件
    //系统图标
    systemPictureError(file, iconList) {
      if (this.iconList.length !== 0) {
        this.$message("一次只能上传一张图片");
      }
    },
    beforeIconUpload(file) {
      // (file)
      // const isJPG = file.type === 'image/jpg'
      let isJPG = false;
      if (
        file.type === "image/jpg" ||
        file.type === "image/png" ||
        file.type === "image/jpeg"
      ) {
        isJPG = true;
      } else {
        isJPG = false;
      }
      const isLt2M = file.size / 1024 / 1024 < 0.5;

      if (!isJPG) {
        this.$message.error("仅支持常规png、jpg格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传图片大小不能超过 500KB!");
      }
      return isJPG && isLt2M;
    },
    //logo
    logoError(file, logoList) {
      if (this.logoList.length !== 0) {
        this.$message("一次只能上传一张图片");
      }
    },
    beforeLogoUpload(file) {
      // const isJPG = file.type === 'image/jpg';
      let isJPG = false;
      if (
        file.type === "image/jpg" ||
        file.type === "image/png" ||
        file.type === "image/jpeg"
      ) {
        isJPG = true;
      } else {
        isJPG = false;
      }
      const isLt2M = file.size / 1024 / 1024 < 1;

      if (!isJPG) {
        this.$message.error("仅支持常规png、jpg格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传图片大小不能超过 1MB!");
      }
      return isJPG && isLt2M;
    },
    // 覆盖上传，自定义上传
    uploadIcon(file) {
      this.uploadData.append("metaImg", file.file);
    },
    uploadLogo(file) {
      this.uploadData.append("logoImg", file.file);
    },
    // 提交上传文件
    submitUpload(formName) {
      this.$refs[formName].validate(async valid => {
        if (valid) {
          if (
            this.uploadData.get("logoImg") !== null ||
            this.uploadData.get("iconImg") !== null
          ) {
            this.uploadData.append("name", this.form.name);
            const data = await axios.post(
              "/system/page/addPageSetting",
              this.uploadData
            );
            (data);
            if (data.status === 200) {
              this.$message({
                message: "修改成功!",
                type: "success"
              });
              await this.getLogoAsync(window);
              window.dispatchEvent(
                new CustomEvent("setMeta", {
                  detail: {
                    href: this.logoImg.metaImg
                  }
                })
              );
            } else {
              this.$message.error("修改失败！");
            }
            (data);
          } else {
            this.$message.error("请上传图片!");
          }
        } else {
          // ('error submit!!');
          return false;
        }
      });
    }
  }
};
</script>

<style scoped>
.pageSet {
  width: 96%;
  height: 100%;
  margin: 0 auto;
}
.pageSet > p {
  font-size: 20px;
  font-weight: 600;
  padding-bottom: 10px;
  border-bottom: 1px solid rgb(192, 188, 188);
}
</style>

<style >
.pageSet .el-form .el-input__inner {
  width: 500px;
}
.upload-demo {
  position: relative;
}
.pageSet .upload-demo .el-upload {
  /* margin-left: 230px; */
  position: relative;
}
.pageSet .img-upload {
  position: absolute;
  top: 0;
  left: -230px;
  width: 148px;
  height: 148px;
  border: 1px dashed #c0ccda;
  border-radius: 8px;
  overflow: hidden;
}
</style>
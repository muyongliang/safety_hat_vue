
<template>
  <div id="app">
    <!-- <img :src="metaImg" style="display:none;"> -->
    <router-view v-if="isRouter"></router-view>
    <my-video></my-video>
    <my-videos></my-videos>
    <my-audio></my-audio>
    <fullScreen></fullScreen>
    <my-talkBack></my-talkBack>
    <callWait></callWait>
  </div>
</template>

<script>
import picMeta from "./assets/panda.png";
import { createNamespacedHelpers, mapState } from "vuex";
// import video from '../components/video.vue'
const { mapState: logoState, mapActions: logoAction } = createNamespacedHelpers(
  "login"
);
export default {
  name: "app",
  components: {},
  provide() {
    return {
      reload: this.reload
    };
  },
  data() {
    return {
      picMeta: picMeta,
      isRouter: true
    };
  },
  computed: {
    ...logoState(["logoImg"])
  },
  async created() {
    await this.getLogoAsync(window);
    this.createLink();
    // (localStorage.setItem("user", JSON.stringify(user)))
    let user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      window.dispatchEvent(
        new CustomEvent("myVideoEvent", {
          detail: {
            data: user
          }
        })
      );
    }
    localStorage.setItem("isclose", false);
  },
  methods: {
    ...logoAction(["getLogoAsync"]),
    createLink() {
      if (localStorage.getItem("user")) {
        if (this.logoImg.metaImg) {
          window.dispatchEvent(
            new CustomEvent("setMeta", {
              detail: {
                href: this.logoImg.metaImg
              }
            })
          );
        } else {
          window.dispatchEvent(
            new CustomEvent("setMeta", {
              detail: {
                href: picMeta
              }
            })
          );
        }
      }
    },
    reload() {
      this.isRouter = false;
      this.$nextTick(function() {
        this.isRouter = true;
      });
    }
  }
};
</script>

<style>
#app {
  width: 100%;
  height: 100%;
}
</style>
  min-width: 100% !important;
  min-height: 100% !important;

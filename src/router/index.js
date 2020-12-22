import Vue from 'vue'
import VueRouter from 'vue-router'

// import Login from '../components/Login.vue'
// import Home from '../components/Home.vue'
// import Welcome from '../components/Welcome.vue'
// import We from '../components/Main/We.vue'
// import MailList from '../components/Main/MailList.vue'
// import CallPolice from '../components/Main/CallPolice.vue'
// import TalkBack from '../components/Main/TalkBack.vue'
// import DataPage from '../components/Main/DataPage.vue'
// import Electronics from '../components/Main/Electronics.vue'
// import Management from '../components/Main/Management.vue'
// import Project from '../components/Main/Project.vue'
// import SubAdministrator from '../components/Main/SystemSettings/SubAdministrator.vue'
// import Role from '../components/Main/SystemSettings/Role.vue'
// import Dictionaries from '../components/Main/SystemSettings/Dictionaries.vue'
// import Dictionaries from '../components/Main/SystemSettings/RemoteSon/DeleTminal.vue'


Vue.use(VueRouter)
const originalPush = VueRouter.prototype.push

VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}

const routes = [{
  path: '/viewlocation',
  home: '查看定位',
  component: resolve => (require(["@/components/Main/ViewLocation.vue"], resolve)),
},

{
  path: '',
  redirect: '/login'
},
{
  path: '/login',
  name: '登录页面',
  component: resolve => (require(["@/components/Login.vue"], resolve))
},
{
  path: '/home',
  name: 'Home',
  component: resolve => (require(["@/components/Home.vue"], resolve)),
  meta: {
    mid: 1
  }
},
{
  path: '/welcome',
  home: '欢迎页面',
  component: resolve => (require(["@/components/Welcome.vue"], resolve)),
  meta: {
    mid: 2
  },
  redirect: '/we',
  children: [{
    path: '/we',
    home: 'we',
    component: resolve => (require(["@/components/Main/We.vue"], resolve)),

  },
  {
    path: '/mail',
    home: '通讯录',
    component: resolve => (require(["@/components/Main/MailList.vue"], resolve)),
    meta: {
      mid: 3
    },
  },
  {
    path: '/cell',
    home: '报警',
    component: resolve => (require(["@/components/Main/CallPolice.vue"], resolve)),
    meta: {
      mid: 4
    },
  },
  {
    path: '/talk',
    home: '对讲组',
    component: resolve => (require(["@/components/Main/TalkBack.vue"], resolve)),
    meta: {
      mid: 5
    },
  },
  {
    path: '/page',
    home: '数据',
    component: resolve => (require(["@/components/Main/DataPage.vue"], resolve)),
    meta: {
      mid: 6
    },
  },
  {
    path: '/electronics',
    home: '电子围栏',
    component: resolve => (require(["@/components/Main/Electronics.vue"], resolve)),
    meta: {
      mid: 7
    },
  },
  {
    path: '/management',
    home: '设备管理',
    component: resolve => (require(["@/components/Main/Management.vue"], resolve)),
    meta: {
      mid: 8
    },
  },
  // {
  //   path: '/viewlocation',
  //   home: '查看定位',
  //   component: resolve => (require(["@/components/Main/ViewLocation.vue"], resolve)),
  // },
  {
    path: '/project',
    home: '项目管理',
    component: resolve => (require(["@/components/Main/Project.vue"], resolve)),
    meta: {
      mid: 9
    },
  },
  {
    path: '/project/addlist',
    home: '/project/addlist',
    component: resolve => (require(["@/components/Main/Project-addedit/addlist.vue"], resolve)),
  }, {
    path: '/project/editlist',
    home: '/project/editlist',
    component: resolve => (require(["@/components/Main/Project-addedit/editlist.vue"], resolve)),
  },
  // 系统管理配置页面子页面
  {
    path: '/sub',
    home: '子管理员配置',
    component: resolve => (require(["@/components/Main/SystemSettings/SubAdministrator.vue"], resolve)),
    meta: {
      mid: 11
    },
  },
  {
    path: '/role',
    home: '角色权限配置',
    component: resolve => (require(["@/components/Main/SystemSettings/Role.vue"], resolve)),
    meta: {
      mid: 11
    },
  },
  {
    path: '/dic',
    home: '字典配置',
    component: resolve => (require(["@/components/Main/SystemSettings/Dictionaries.vue"], resolve)),
    meta: {
      mid: 11
    },
  },
  {
    path: '/telephone',
    home: '未接来电',
    component: resolve => (require(["@/components/Main/FunctionBar/Telephone.vue"], resolve)),
    meta: {
      mid: 12
    }
  },
  {
    path: '/news',
    home: '消息中心',
    component: resolve => (require(["@/components/Main/FunctionBar/News"], resolve)),
    meta: {
      mid: 13
    },
  },
  // 记录管理页面配置
  {
    path: '/Patrol',
    home: '巡查报告',
    component: resolve => (require(["@/components/Main/RecordManagement/Patrol.vue"], resolve)),
    meta: {
      mid: 10
    },
  },
  {
    path: '/police',
    home: '报警记录',
    component: resolve => (require(["@/components/Main/RecordManagement/police.vue"], resolve)),
    meta: {
      mid: 10
    },
  },
  {
    path: '/Radio',
    home: '广播记录',
    component: resolve => (require(["@/components/Main/RecordManagement/Radio.vue"], resolve)),
    meta: {
      mid: 10
    },
  },
  {
    path: '/Sou',
    home: '电话录音记录',
    component: resolve => (require(["@/components/Main/RecordManagement/Sou.vue"], resolve)),
    meta: {
      mid: 10
    },
  },
  {
    path: '/TalkR',
    home: '对讲记录',
    component: resolve => (require(["@/components/Main/RecordManagement/Talk.vue"], resolve)),
    meta: {
      mid: 10
    },
  },
  {
    path: '/TalkSon',
    home: '对讲记录明细',
    component: resolve => (require(["@/components/Main/RecordManagement/TalkSon.vue"], resolve)),
  },
  // 系统设置剩余界面路由
  {
    path: '/Remote',
    home: '远程控制',
    component: resolve => (require(["@/components/Main/SystemSettings/Remote.vue"], resolve)),
    meta: {
      mid: 11
    },
  },
  {
    path: '/appup',
    home: '终端app更新',
    component: resolve => (require(["@/components/Main/SystemSettings/appUpdate.vue"], resolve)),
    meta: {
      mid: 11
    },
  },
  {
    path: '/poer',
    home: '操作日志',
    component: resolve => (require(["@/components/Main/SystemSettings/Operation.vue"], resolve)),
    meta: {
      mid: 11
    },
  },
  {
    path: '/pages',
    home: '页面设置',
    component: resolve => (require(["@/components/Main/SystemSettings/PageSetup.vue"], resolve)),
    meta: {
      mid: 11
    },
  },
  {
    path: '/service',
    home: '服务状态',
    component: resolve => (require(["@/components/Main/SystemSettings/Service.vue"], resolve)),
    meta: {
      mid: 11
    },
  },
  {
    path: '/TerminalVideo',
    home: '终端视频',
    component: resolve => (require(["@/components/Main/SystemSettings/RemoteSon/TerminalVideo.vue"], resolve)),

  },
  {
    path: '/ChangeTerminal',
    home: '变更终端账号',
    component: resolve => (require(["@/components/Main/SystemSettings/RemoteSon/ChangeTerminal.vue"], resolve)),

  },
  {
    path: '/DeleTminal',
    home: '销毁终端数据',
    component: resolve => (require(["@/components/Main/SystemSettings/RemoteSon/DeleTminal.vue"], resolve)),

  },
  {
    path: '/mail/phones',
    home: '通话栏',
    component: resolve => (require(["@/components/Main/Mail-phone/cellPhone.vue"], resolve)),
  },
  {
    path: '/mail/fullScreen',
    home: '全屏视频',
    component: resolve => (require(["@/components/Main/Mail-phone/fullScreen.vue"], resolve)),
  },
  {
    path: '/mail/callvideo/:id',
    home: '视频通话',
    component: resolve => (require(["@/components/Main/Mail-phone/callVideo.vue"], resolve)),
  },
  {
    path: '/ceshi',
    home: '测试',
    component: resolve => (require(["@/components/Main/ceshi.vue"], resolve)),
  },

  ]
}
]


const router = new VueRouter({
  mode: 'hash',
  base: process.env.BASE_URL,
  routes
})

// // 挂载路由导航守卫
// router.beforeEach((to, from, next) => {
// // to 将要访问的路径
// // from 代表从哪个路径跳转而来
// // next 是一个函数，表示放行
// //     next()  放行    next('/login')  强制跳转
//   if (to.path === '/login') return next()
//   // 获取token
//   const tokenStr = window.sessionStorage.getItem('token')
//   if (!tokenStr) return next('/login')
//   next()
// })

// 登录拦截
// router.beforeEach((to, from, next) => {
//   if (to.meta.requireAuth) { // 判断该路由是否需要登录权限
//     if (sessionStorage.getItem("token") == 'true') { // 判断本地是否存在token
//       next()
//     } else {
//       // 未登录,跳转到登陆页面
//       next({
//         path: '/login'
//       })
//     }
//   } else {
//     if (sessionStorage.getItem("token") == 'true') {
//       next('/home');
//     } else {
//       next();
//     }
//   }
// })

export default router
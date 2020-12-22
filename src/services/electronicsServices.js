import axios from "axios";
import qs from "qs";
// var express = require('express');
// var app = express()
// var apiRoutes = express.Router()
// app.use('/api', apiRoutes)
import $ from 'jquery'
// import VueJsonp from 'vue-jsonp'
// Vue.use(VueJsonp)

export default {
    // 获取项目列表
    async getProjectList() {
        let data = await axios.get('/alarmRange/getProjectList');
        return data;
    },
    // 当前用户下某一项的电子围栏列表
    // async getFenceRangeList(params) {
    //     let data = await axios.get('/alarmRange/getFenceRangeList', {
    //         params
    //     });


    //     return data;
    // },
    // 创建电子围栏请求后台api
    async createFenceQuire(params) {
        let data = await axios.post('/alarmRange/addFence', params)
        return data;
    },
    // 创建圆形电子围栏请求鹰眼API
    async createCircleFence(params) {
        axios.defaults.baseURL = "";
        let {data} = await axios.post('/api/v3/fence/createcirclefence', qs.stringify(params),)
        axios.defaults.baseURL = "http://118.190.38.198:8080/"
        // let data = $.ajax({
        //     url: "http://yingyan.baidu.com/api/v3/fence/createcirclefence",
        //     type: "GET",
        //     dataType: "JSONP", //指定服务器返回的数据类型
        //     data: qs.stringify(params) ,
        //     success: function (data) {
        //         console.log(data)
        //     },
        //     error: function (res) {
        //         console.log('err', res)
        //     }
        // });
        return data;
    },
    // 创建矩形电子围栏请求鹰眼API
    async createPolygonFence(params) {
        axios.defaults.baseURL = "";
        let {data} = await axios.post('/api/v3/fence/createpolygonfence', qs.stringify(params),)
        axios.defaults.baseURL = "http://118.190.38.198:8080/"
        // let data = $.ajax({
        //     url: "http://yingyan.baidu.com/api/v3/fence/createpolygonfence",
        //     type: "GET",
        //     dataType: "JSONP", //指定服务器返回的数据类型
        //     data: qs.stringify(params) ,
        //     success: function (data) {

        //     },
        //     error: function (res) {

        //     }
        // });
        return data;
    },
    // 查询围栏鹰眼api
    async seachFenceList(params) {
        // axios.defaults.baseURL = "";
        // let data = await axios.get('/api/v3/fence/list', {
        //     params
        // })
        // axios.defaults.baseURL = "http://118.190.38.198:8080/"
        // console.log('list',data);
        let dataObj = await $.ajax({
            url: "/api/v3/fence/list",
            type: "GET",
            dataType: "JSONP", //指定服务器返回的数据类型
            jsonp: 'callback',
            data: qs.stringify(params) ,
            async: false,
            // success: function (data) {
            //     dataObj = data
            // },
            // error: function (res) {
            // }
        });
        let data = {status: 200, data: dataObj}
        return data;
    },
    // 根据类型后台查询围栏
    async seachTypeFence(params) {
        let {data} = await axios.post('/alarmRange/getFenceRangeByType', qs.stringify(params))
        return data;
    },
    // 根据名称后台查询围栏
    async seachNameFence(params) {
        let {data} = await axios.post('/alarmRange/getFenceRangeByName', qs.stringify(params))
        return data;
    },
    // 当前用户下某一项的电子围栏列表
    async getFenceId(params) {
        let data = await axios.get('/alarmRange/getFenceRangeList', {params})
        return data;
    },
    // 统一查询接口
    async getFenceRangeList(params) {
        let data = await axios.post('/alarmRange/getFenceRangeListByParam', {params})
        return data;
    },
    // 编辑更新圆形电子围栏请求鹰眼API
    async updateCircleFence(params) {
        axios.defaults.baseURL = "";
        let {data} = await axios.post('/api/v3/fence/updatecirclefence', qs.stringify(params),)
        axios.defaults.baseURL = "http://118.190.38.198:8080/"
        // let data = await $.ajax({
        //     url: "http://yingyan.baidu.com/api/v3/fence/updatecirclefence",
        //     type: "POST",
        //     crossDomain: true,
        //     dataType: "JSONP", //指定服务器返回的数据类型
        //     data: params,
        //     success: function (data) {
        //         console.log(data)
        //     },
        //     error: function (res) {
        //         console.log('err', res)
        //     }
        // });
        return data;
    },
    // 编辑更新矩形电子围栏请求鹰眼API
    async updatePolygonFence(params) {
        axios.defaults.baseURL = "";
        let {data} = await axios.post('/api/v3/fence/updatepolygonfence', qs.stringify(params),)
        axios.defaults.baseURL = "http://118.190.38.198:8080/"
        // let data = $.ajax({
        //     url: "http://yingyan.baidu.com/api/v3/fence/updatepolygonfence",
        //     type: "GET",
        //     dataType: "JSONP", //指定服务器返回的数据类型
        //     data:  qs.stringify(params) ,
        //     success: function (data) {
        //         console.log(data)
        //     },
        //     error: function (res) {
        //         console.log('err', res)
        //     }
        // });
        return data;
    },
    // 编辑电子围栏请求后台
    async updateFenceQuire(params) {
        let data = await axios.post('/alarmRange/editFence', params);
        return data;
    },
    // 请求鹰眼API删除电子围栏
    async deleteFence(params) {
        axios.defaults.baseURL = '';
        let data = await axios.post('/api/v3/fence/delete', qs.stringify(params));
        // axios.defaults.baseURL = 'http://118.190.38.198:8080/';
        return data;
        // let data = $.ajax({
        //     url: "http://yingyan.baidu.com/api/v3/fence/delete",
        //     type: "GET",
        //     dataType: "JSONP", //指定服务器返回的数据类型
        //     data: qs.stringify(params) ,
        //     success: function (data) {
        //         console.log(data)
        //     },
        //     error: function (res) {
        //         console.log('err', res)
        //     }
        // });

    },
    // 请求后端删除电子围栏
    async deleteFenceQuire(params) {
        let data = await axios.post('/alarmRange/deleteRange', qs.stringify(params));
        return data;
    },
    // 查询围栏下的成员
    async listmonitoredperson(params) {
        axios.defaults.baseURL = "";
        let data = await axios.get("/api/v3/fence/listmonitoredperson", {params});
        axios.defaults.baseURL = "http://118.190.38.198:8080/"
        return data;
    },
    // 查询在线终端
    async getOnlineClientList(params) {
        let data = await axios.post('/alarmRange/getOnlineClientList', qs.stringify(params));
        return data;
    },
    // 添加终端账号向鹰眼添加终端
    async addEntity(params) {
        axios.defaults.baseURL = "";
        let data = await axios.post('/api/v3/entity/add', qs.stringify(params));
        axios.defaults.baseURL = "http://118.190.38.198:8080/"
        return data;
    },

}
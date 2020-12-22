import electronicsApi from "../services/electronicsServices";
import qs from "qs";
import {
    get
} from "http";

export default {
    namespaced: true,
    state: {
        tableList: [],
        projectList: '',
        total: 0,
        cliData: {}
    },
    mutations: {
        setData(state, payload) {
            state.tableList = payload;
        },
        setProjectListData(state, payload) {
            state.projectList = payload;
        },
        setTotal(state, payload) {
            state.total = payload;
        },
        setcliData(state, payload) {
            state.cliData = payload.data.data;
        },
    },
    actions: {
        //列表数据
        // async electronicsData(context) {
        //     const params = {
        //         projectId: 1,
        //         pageSize: 1,
        //         pageNum: 1,
        //     };
        //     const data = await electronicsApi.getFenceRangeList(params);
        //     // context.commit("setData", data)
        //     return data;
        // },

        // 获取项目列表
        async getProjectListData(context) {
            const data = await electronicsApi.getProjectList();
            context.commit("setProjectListData", data.data.data);
            return data;
        },
        //创建圆形电子围栏
        async circleFenceData(context, payload) {
            const data = await electronicsApi.createCircleFence(payload.yingyian);
            let params = {
                rid: null,
                name: payload.houtai.fence_name,
                type: payload.houtai.type,
                tipInfo: payload.houtai.tipInfo,
                projectId: payload.houtai.projectId,
                rangeType: 0,
                handShape: 1,
                gpsRange: [{
                    latitude: payload.yingyian.longitude,
                    longitude: payload.yingyian.latitude
                }],
                radius: payload.yingyian.radius,
                fenceId: data.fence_id
            };
            const data2 = await electronicsApi.createFenceQuire(params);
            return data2;
        },
        //创建矩形/多边形电子围栏
        async ploygonFenceData(context, payload) {
            let yyApi = JSON.parse(JSON.stringify(payload.yingyian));
            let yyVertexes = '';
            yyApi.vertexes.forEach(element => {
                yyVertexes += element.latitude + ',' + element.longitude + ';'
            });
            yyApi.vertexes = yyVertexes;
            const data = await electronicsApi.createPolygonFence(yyApi);
            let params = {
                rid: null,
                name: payload.houtai.fence_name,
                type: Number(payload.houtai.type),
                tipInfo: payload.houtai.tipInfo,
                projectId: Number(payload.houtai.projectId),
                rangeType: 0,
                handShape: 3,
                gpsRange: payload.yingyian.vertexes,
                radius: payload.yingyian.radius || null,
                fenceId: data.fence_id
            };
            const data2 = await electronicsApi.createFenceQuire(params);
            return data2;
        },
        // 查询围栏L
        async fenceListData(context, payload) {
            var list = [];
            if (payload.type !== null || payload.type === 0) {
                var dataObj = await electronicsApi.seachTypeFence(payload);
                list = dataObj.data.list;
                context.commit('setTotal', dataObj.data.total);
            } else if (payload.rangeName !== null) {
                var dataObj = await electronicsApi.seachNameFence(payload);
                list = dataObj.data.list;
                context.commit('setTotal', dataObj.data.total);
            } else {
                var dataObj = await electronicsApi.getFenceId(payload);
                list = dataObj.data.data.list;
                context.commit('setTotal', dataObj.data.data.total);
            }
            // var dataObj = await electronicsApi.getFenceRangeList(payload);
            // list = dataObj.data.data.list;
            // context.commit('setTotal', dataObj.data.data.total);
            let fence_ids = [];
            var dataList = [];
            if (list.length > 0) {
                list.forEach((el, i) => {
                    fence_ids.push(el.fenceId);
                    let tableData = {
                        name: el.name,
                        type: list[i].type,
                        address: "",
                        etotal: 0,
                        onlineClientNum: list[i].onlineClientNum || 0,
                        totalClientNum: list[i].totalClientNum || 0,
                        // circlePath: '',
                        // polygonPath: '',
                        isedit: false,
                        rangeId: list[i].rid,
                        fence_id: list[i].fenceId,
                    };
                    dataList.push(tableData);
                });
                const paramsapi = {
                    ak: 'VMDTdzBD360GHN3yarevFr4fQ48z7q1Y',
                    service_id: 217504,
                    fence_ids: fence_ids.join(','),
                    coord_type_output: 'bd09ll',
                };
                var data = await electronicsApi.seachFenceList(paramsapi);
                // typeof(data.fences) === "object" &&
                if (data.data.fences) {
                    dataList.forEach(async (el, i) => {
                        data.data.fences.forEach((ele, j) => {
                            if (ele.fence_id == el.fence_id) {
                                if (ele.shape === "circle") {
                                    el.circlePath = {
                                        center: {
                                            lng: ele.longitude,
                                            lat: ele.latitude
                                        },
                                        radius: ele.radius
                                    }
                                } else {
                                    let data = JSON.parse(JSON.stringify(ele.vertexes).replace(/longitude/g, 'lng'));
                                    let vertexes = JSON.parse(JSON.stringify(data).replace(/latitude/g, 'lat'));
                                    el.polygonPath = {
                                        center: vertexes,
                                    }
                                }
                            }
                        });
                    });
                }

                // var dataObjFence = {
                //     ak: 'VMDTdzBD360GHN3yarevFr4fQ48z7q1Y',
                //     service_id: 217504,
                //     fence_id: '',
                // }
                // for (let index = 0; index < dataList.length; index++) {
                //     dataObjFence.fence_id = dataList[index].fence_id;
                //     // 查询围栏下的中端成员
                //     if (dataList[index].fence_id !== null) {
                //         // console.log(index)
                //         let p = await electronicsApi.listmonitoredperson(dataObjFence)
                //         dataList[index].etotal = p.data.total;
                //     } else {
                //         dataList[index].etotal = 0;
                //     }
                // }
            }
            context.commit("setData", dataList);
            // context.commit("setInfo", dataObj.data.data.list);
            // return data.data;
        },
        // 更新鹰眼圆形电子围栏
        async updateCircleFenceData(context, payload) {
            let yyApi = JSON.parse(JSON.stringify(payload.yingyian));
            // let yyVertexes = '';
            // yyApi.vertexes.forEach(element => {
            //     yyVertexes += element.latitude + ',' + element.longitude + ';'
            // });
            // yyApi.vertexes = yyVertexes;
            let data = await electronicsApi.updateCircleFence(payload.yingyian);
            let params = {
                rid: payload.houtai.rid,
                name: payload.houtai.fence_name,
                type: payload.houtai.type,
                tipInfo: payload.houtai.tipInfo,
                projectId: payload.houtai.projectId,
                rangeType: 0,
                handShape: 3,
                gpsRange: payload.yingyian.vertexes,
                radius: payload.yingyian.radius,
                fenceId: data.fence_id
            };
            const data2 = electronicsApi.updateFenceQuire(params);
            return data2;
        },
        // 更新鹰眼矩形多边形电子围栏
        async updatePolgonFenceData(context, payload) {
            let yyApi = JSON.parse(JSON.stringify(payload.yingyian));
            let yyVertexes = '';
            yyApi.vertexes.forEach(element => {
                yyVertexes += element.latitude + ',' + element.longitude + ';'
            });
            yyApi.vertexes = yyVertexes;
            let data = await electronicsApi.updatePolygonFence(yyApi);
            // let gpsRange = []
            // payload.yingyian.vertexes.forEach(element => {
            //     gpsRange.push(JSON.stringify(element))
            // });
            let params = {
                rid: payload.houtai.rid,
                name: payload.houtai.fence_name,
                type: payload.houtai.type,
                tipInfo: payload.houtai.tipInfo,
                projectId: payload.houtai.projectId,
                rangeType: 0,
                handShape: 1,
                // gpsRange: [{
                //     latitude: payload.yingyian.longitude,
                //     longitude: payload.yingyian.latitude
                // }],
                gpsRange: payload.yingyian.vertexes,
                radius: 0,
                fenceId: payload.yingyian.fence_id
            };
            const data2 = await electronicsApi.updateFenceQuire(params);
            return data2;
        },
        // 删除鹰眼电子围栏
        async deleteFenceData(context, payload) {
            const paramsapi = {
                ak: 'VMDTdzBD360GHN3yarevFr4fQ48z7q1Y',
                service_id: 217504,
                fence_ids: payload.fence_ids,
            };
            // let dataApi = await electronicsApi.deleteFence(paramsapi);
            let data = await electronicsApi.deleteFenceQuire(payload);
            // context.commit("setData", data)
            if (data.data.code === 200) {
                let dataApi = await electronicsApi.deleteFence(paramsapi);
                return true;
            } else {
                return false;
            }
        },
        // 清空电子围栏
        async deleteAllFence(context, payload) {
            let data = [];
            context.commit("setData", data);
        },
        // 查询在线终端
        async getOnlineClientListAsync(context, payload) {
            const params = {
                fenceId: payload,
                pageSize: 10,
                pageNum: 1,
            };
            // let dataApi = await electronicsApi.deleteFence(paramsapi);
            let data = await electronicsApi.getOnlineClientList(params);
            context.commit("setcliData", data)
        },
        // 添加终端账号向鹰眼添加终端
        async addEntityAsync(context, payload) {
            const params = {
                ak: 'VMDTdzBD360GHN3yarevFr4fQ48z7q1Y',
                service_id: 217504,
                entity_name: payload,
            };
            // let dataApi = await electronicsApi.deleteFence(paramsapi);
            let data = await electronicsApi.addEntity(params);
            return data;
        },
        // // 向鹰眼更新监控终端
        // async deletemonitoredpersonAsync(context, payload) {
        //     let data = await electronicsApi.addEntity(params);
        //     return data;
        // },
        // async addmonitoredpersonAsync(context, payload) {
        //     let data = await electronicsApi.addEntity(params);
        //     return data;
        // },
    }
}
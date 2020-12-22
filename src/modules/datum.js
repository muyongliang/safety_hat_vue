import datumApi from "../services/datumServices";

export default {
    namespaced: true,
    state: {
        pageNum1: 1,
        pageSize1: 5,
        list1: [],
        total1: 0,
        allP: [],
        type: 1,
        projectId: null,
        userType1: '',
        photoStartTime: "",
        photoEndTime: "",
        photoName: "",
        photoUpload: "",
        photoAccount: "",

        pageNum2: 1,
        pageSize2: 5,
        list2: [],
        total2: 0,
        userType2: '',
        type2: 2,
        videoStartTime: '',
        videoEndTime: '',
        videoName: "",
        videoUpload: "",
        videoAccount: ""
    },
    mutations: {
        //添加项目
        allProject(state, payload) {
            Object.assign(state, {
                allP: payload.data
            })
        },
        //照片按账号类型分页查询
        photoTypeForm(state, payload) {
            for (let i = 0; i < payload.data.list.length; i++) {
                let a = payload.data.list[i].fileSize / (1024 * 1024)
                a = a * 1
                payload.data.list[i].fileSize = a.toFixed(2)
            }
            // ('照片数据', payload.data);
            Object.assign(state, {
                list1: payload.data.list,
                total1: payload.data.total
            })
        },
        initType(state, payload) {
            Object.assign(state, {
                type: payload
            })
        },
        initPid(state, payload) {
            Object.assign(state, {
                projectId: payload
            })
        },
        initUserType(state, payload) {
            Object.assign(state, {
                userType1: payload
            })
        },
        initUserType2(state, payload) {
            Object.assign(state, {
                userType2: payload
            })
        },
        //按时间段
        initPhotoStartTime(state, payload) {
            Object.assign(state, {
                photoStartTime: payload
            })
        },
        initPhotoEndTime(state, payload) {
            Object.assign(state, {
                photoEndTime: payload
            })
        },
        initVideoStartTime(state, payload) {
            Object.assign(state, {
                videoStartTime: payload
            })
        },
        initVideoEndTime(state, payload) {
            Object.assign(state, {
                videoEndTime: payload
            })
        },
        //按文件名
        initPhotoFileName(state, payload) {
            Object.assign(state, {
                photoName: payload
            })
        },
        initVideoFileName(state, payload) {
            Object.assign(state, {
                videoName: payload
            })
        },
        //按上传人姓名
        initPhotoUploader(state, payload) {
            Object.assign(state, {
                photoUpload: payload
            })
        },
        initVideoUploader(state, payload) {
            Object.assign(state, {
                videoUpload: payload
            })
        },
        //按账号
        initPhotoAccount(state, payload) {
            Object.assign(state, {
                photoAccount: payload
            })
        },
        initVideoAccount(state, payload) {
            Object.assign(state, {
                videoAccount: payload
            })
        },

        //照片分页
        photoPage(state, payload) {
            Object.assign(state, {
                pageNum1: payload
            })
        },
        //视频按账号类型分页查询
        videoTypeForm(state, payload) {
            for (let i = 0; i < payload.data.list.length; i++) {
                let a = payload.data.list[i].fileSize / (1024 * 1024)
                a = a * 1
                payload.data.list[i].fileSize = a.toFixed(2)
            }
            Object.assign(state, {
                list2: payload.data.list,
                total2: payload.data.total
            })
        },
        //视频分页
        videoPage(state, payload) {
            Object.assign(state, {
                pageNum2: payload
            })
        },
        //照片按时间段分页查询
        photoTimeForm(state, payload) {
            Object.assign(state, {
                list1: payload.data.list,
                total1: payload.data.total
            })
        },
        //视频按时间段分页查询
        videoTimeForm(state, payload) {
            Object.assign(state, {
                list2: payload.data.list,
                total2: payload.data.total
            })
        },
        //照片按文件名分页查询
        photoNameForm(state, payload) {
            Object.assign(state, {
                list1: payload.data.list,
                total1: payload.data.total
            })
        },
        //视频按文件名分页查询
        videoNameForm(state, payload) {
            Object.assign(state, {
                list2: payload.data.list,
                total2: payload.data.total
            })
        },

        //照片上传人分页查询
        photoUploadForm(state, payload) {
            Object.assign(state, {
                list1: payload.data.list,
                total1: payload.data.total
            })
        },
        //视频上传人分页查询
        videoUploadForm(state, payload) {
            Object.assign(state, {
                list2: payload.data.list,
                total2: payload.data.total
            })
        },

        //照片账号分页查询
        photoAccountForm(state, payload) {
            Object.assign(state, {
                list1: payload.data.list,
                total1: payload.data.total
            })
        },
        //视频账号分页查询
        videoAccountForm(state, payload) {
            Object.assign(state, {
                list2: payload.data.list,
                total2: payload.data.total
            })
        },
    },
    actions: {
        //添加项目
        async getProjectAsync(context, payload) {
            const {
                data
            } = await datumApi.getProject(payload);
            context.commit("allProject", data)

            return data;
        },
        //照片按账号类型分页查询
        async photoByTypeAsync(context) {
            const params = {
                pageSize: context.state.pageSize1,
                pageNum: context.state.pageNum1,
                projectId: context.state.projectId,
                type: 1,
                userType: context.state.userType1
            };
            const {
                data
            } = await datumApi.byType(params);
            // let a = payload.data.fileSize / (1024 * 1024)
            // payload.data.fileSize = a
            context.commit("photoTypeForm", data)
            // ('查询照片总数据', data);
            return data;
        },
        //视频按账号类型分页查询
        async videoByTypeAsync(context, payload) {
            const params = {
                pageSize: context.state.pageSize2,
                pageNum: context.state.pageNum2,
                projectId: context.state.projectId,
                type: 2,
                userType: context.state.userType2
            };
            const {
                data
            } = await datumApi.byType(params);
            context.commit("videoTypeForm", data)
            // ('查询视频总数据', data);
            return data;
        },
        //照片按时间段分页查询
        async photoByTimeAsync(context) {
            const params = {
                pageSize: context.state.pageSize1,
                pageNum: context.state.pageNum1,
                projectId: context.state.projectId,
                type: context.state.type,
                begin: context.state.photoStartTime,
                end: context.state.photoEndTime,
            };
            const {
                data
            } = await datumApi.byTime(params);
            context.commit("photoTimeForm", data)
            return data;
        },
        //视频按时间段分页查询
        async videoByTimeAsync(context) {
            const params = {
                pageSize: context.state.pageSize2,
                pageNum: context.state.pageNum2,
                projectId: context.state.projectId,
                type: context.state.type2,
                begin: context.state.videoStartTime,
                end: context.state.videoEndTime,
            };
            const {
                data
            } = await datumApi.byTime(params);
            context.commit("videoTimeForm", data)
            return data;
        },

        //照片按文件名分页查询
        async photoByNameAsync(context) {
            const params = {
                pageSize: context.state.pageSize1,
                pageNum: context.state.pageNum1,
                projectId: context.state.projectId,
                type: context.state.type,
                fileName: context.state.photoName,
            };
            const {
                data
            } = await datumApi.byName(params);
            context.commit("photoNameForm", data)
            return data;
        },
        //视频按文件名分页查询
        async videoByNameAsync(context) {
            const params = {
                pageSize: context.state.pageSize2,
                pageNum: context.state.pageNum2,
                projectId: context.state.projectId,
                type: context.state.type2,
                fileName: context.state.videoName,
            };
            const {
                data
            } = await datumApi.byName(params);
            context.commit("videoNameForm", data)
            return data;
        },

        //照片按上传人分页查询
        async photoByUploadAsync(context) {
            const params = {
                pageSize: context.state.pageSize1,
                pageNum: context.state.pageNum1,
                projectId: context.state.projectId,
                type: context.state.type,
                name: context.state.photoUpload,
            };
            const {
                data
            } = await datumApi.byUpload(params);
            context.commit("photoUploadForm", data)
            return data;
        },
        //视频按上传人分页查询
        async videoByUploadAsync(context) {
            const params = {
                pageSize: context.state.pageSize2,
                pageNum: context.state.pageNum2,
                projectId: context.state.projectId,
                type: context.state.type2,
                name: context.state.videoUpload,
            };
            const {
                data
            } = await datumApi.byUpload(params);
            context.commit("videoUploadForm", data)
            return data;
        },

        //照片按账号分页查询
        async photoByAccountAsync(context) {
            const params = {
                pageSize: context.state.pageSize1,
                pageNum: context.state.pageNum1,
                projectId: context.state.projectId,
                type: context.state.type,
                account: context.state.photoAccount,
            };
            const {
                data
            } = await datumApi.byAccount(params);
            context.commit("photoAccountForm", data)
            return data;
        },
        //视频按账号分页查询
        async videoByAccountAsync(context) {
            const params = {
                pageSize: context.state.pageSize2,
                pageNum: context.state.pageNum2,
                projectId: context.state.projectId,
                type: context.state.type2,
                account: context.state.videoAccount,
            };
            const {
                data
            } = await datumApi.byAccount(params);
            context.commit("videoAccountForm", data)
            return data;
        },

        //修改名称
        async updateNameAsync(context, payload) {
            const {
                data
            } = await datumApi.updateName(payload);
            return data;
        },

        //刪除
        async deleteItemAsync(context, payload) {
            const {
                data
            } = await datumApi.deleteItem(payload);
            return data;
        },
        //查看
        async checkDetailAsync(context, payload) {
            const {
                data
            } = await datumApi.checkDetail(payload);
            return data;
        },
        //定位
        async getLocationAsync(context, payload) {
            const {
                data
            } = await datumApi.getLocation(payload);
            ('定位data', data);
            return data;
        },
    }
}
import warnApi from "../services/warningServices";

export default {
    namespaced: true,
    state: {
        pageNum: 1,
        pageSize: 5,
        list: [],
        total: 4,
        type: '',
        start: '',
        end: '',
        getName: '',
        allList: {}
        // idList:[]
    },
    mutations: {
        //全部
        warnData(state, payload) {
            Object.assign(state, {
                list: payload.list,
                total: payload.total,
            })
        },
        allLists(state, payload) {
            Object.assign(state, {
                allList: payload
            })

        },
        changePage(state, payload) {
            Object.assign(state, {
                pageNum: payload
            })
        },
        ininType(state, payload) {
            Object.assign(state, {
                type: payload
            })
        },
        ininStart(state, payload) {
            Object.assign(state, {
                start: payload
            })
        },
        ininEnd(state, payload) {
            Object.assign(state, {
                end: payload
            })
        },
        ininName(state, payload) {
            Object.assign(state, {
                getName: payload
            })
        },
        //根据时间搜索
        timeData(state, payload) {
            Object.assign(state, {
                list: payload.list,
                total: payload.total,
            })
        },
        //按名字查询
        nameData(state, payload) {
            (payload)
            Object.assign(state, {
                list: payload.list,
                total: payload.total,
            })
        },
        //获取所有id
        // idData(state, payload) {
        //     Object.assign(state, {
        //         idList: payload.list
        //     })
        // },
    },
    actions: {
        //报警列表分页
        async warnFormAsync(context) {
            const params = {
                limit: context.state.pageSize,
                page: context.state.pageNum,
                aid: context.state.type
            };

            const {
                data
            } = await warnApi.warnForm(params);
            context.commit("warnData", data)
            ('报警列表分页', data);
            // this.state.allList = data
            // context.commit("allLists", data)
            // ('报警列表分页1', allLists);

            return data;

        },
        //详情
        async detailsAsync(context, payload) {
            let {
                data
            } = await warnApi.details(payload);
            return data;
        },
        //根据时间搜索
        async queryByTimeAsync(context) {
            const params = {
                limit: context.state.pageSize,
                page: context.state.pageNum,
                startTime: context.state.start,
                endTime: context.state.end,
            };
            const {
                data
            } = await warnApi.warnForm(params);
            context.commit("timeData", data)

            return data;
        },
        //根据名字搜索
        async queryByNameAsync(context) {
            const params = {
                limit: context.state.pageSize,
                page: context.state.pageNum,
                name: context.state.getName,
            };
            (params)

            const {
                data
            } = await warnApi.warnForm(params);
            context.commit("nameData", data)
            return data;
        },
        //查询报警状态id
        async warnStateAsync(context, payload) {
            // const params = {
            //     type: context.state.type
            // };
            let {
                data
            } = await warnApi.warnState(payload);
            // context.commit("idData", data)
            return data;
        },
        //改变报警状态
        async changeStateAsync(context, payload) {
            let { data } = await warnApi.changeState(payload);
            return data;
        },
    }
}
import trackApi from "../services/trackServices";

export default {
    namespaced: true,
    state: {
        pointArray: [],
    },
    mutations: {
        //全部
        // setData(state, payload) {    
        //     state.pointArray.push() 
        // },
    },
    actions: {
        // 获取历史轨迹
        async gettrackAsync(context, payload) {
            let params = {
                ak: "VMDTdzBD360GHN3yarevFr4fQ48z7q1Y",
                service_id: 217504,
                entity_name: payload.entity_name,
                start_time: payload.start_time,
                end_time: payload.end_time,
                page_size: 5000,
                // is_processed: 1,
                // process_option: 'need_mapmatch=1'
              }
            params.page_index = payload.page_index

            let data1 = await trackApi.gettrack(params)
            if(data1.total>data1.points.length){
              params.page_index = payload.page_index+=1
              let data2 = await trackApi.gettrack(params)
                data1.points = data1.points.concat(data2.points)
            }
            return data1;
        },
        // 获取实时轨迹
        async getLatestPointAsync(context, payload) {
            let params = {
                ak: "VMDTdzBD360GHN3yarevFr4fQ48z7q1Y",
                service_id: 217504,
                entity_name: payload.entity_name,
                is_processed: 1,
                // process_option: 'need_mapmatch=1'
              }
            let data = await trackApi.getlatestpoint(params)
            return data;
        },
    }
}
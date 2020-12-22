import projectApi from "../services/projectService";

export default {
    namespaced: true,
    state: {

    },
    mutations: {

    },
    actions: {
        //添加项目
        async addProjectAsync(context, payload) {
            const data = await projectApi.addProject(payload)
            return data;
        },
    }
}
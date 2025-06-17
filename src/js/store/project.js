export default {
    namespaced: true,
    state: () => ({
        projects: [],
        activeProject: null,
    }),
    getters: {
        getActiveProject(state) {
            return state.activeProject
        },
        getActiveProjectId(state) {
            return state.activeProject?.id ?? null;
        },
        getDefaultProject(state) {
            return state.projects.filter(project => project.isDefault)?.[0] ?? null;
        },
        getProjects(state) {
            return state.projects
        },
        getProjectBySlug: (state) => (slug) => {
            return state.projects.find(project => project.id === slug) || null;
        },
        getProjectById: (state) => (id) => {
            return state.projects.find(project => project.id === id) || null;
        },
        isDefaultProject(state) {
            return !state.activeProject || ( state.activeProject?.isDefault ?? false );
        }
    },
    mutations: {
        setActiveProject(state, project) {
            state.activeProject = project
        },
        setProjects(state, projects) {
            if (Array.isArray(projects)) {
                state.projects = projects
            }
        },
    },
    actions: {
        setActiveProject(context, project) {
            context.commit('setActiveProject', project)
        },
        setProjects(context, projects) {
            context.commit('setProjects', projects)
        }
    }
}

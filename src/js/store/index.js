import Vue from 'vue'
import Vuex from 'vuex'

import map from './map'
import project from './project'
import filters from './featureFilters'
import sidebar from './sidebar'
import iiifViewer from './iiifViewer'

Vue.use(Vuex)

import ProjectService from '../services/ProjectService'
import PlaceService from "../services/PlaceService";

export default new Vuex.Store({
    modules: {
        map: map,
        project: project,
        featureFilters: filters,
        sidebarSearch: sidebar,
        sidebarMaps: sidebar,
        sidebarFilters: sidebar,
        sidebarProjects: sidebar,
        sidebarTimeline: sidebar,
        sidebarInfo: sidebar,
        sidebarViewer: sidebar,
        iiifViewer: iiifViewer
    },
    state: () => ({
        focusedSidebar: [],
        openRequests: 0
    }),
    getters: {
        focusedSidebar: (state) => state.focusedSidebar[0] ?? null,
        sidebarWeight: (state) => (sidebar_id) => state.focusedSidebar.indexOf(sidebar_id),
        openRequests: (state) => state.openRequests
    },
    mutations: {
        focusSidebar(state, sidebar_id) {
            state.focusedSidebar.unshift(sidebar_id)
            state.focusedSidebar = [...new Set(state.focusedSidebar)];
        },
        removeSidebarFocus(state, sidebar_id) {
            state.focusedSidebar = state.focusedSidebar.filter(id => id !== sidebar_id)
        },
        startRequest(state) {
            state.openRequests++
        },
        endRequest(state) {
            if (state.openRequests > 0 ) {
                state.openRequests--
            }
        }
    },
        async loadProjects({state, commit}) {
            if (!state.project.projects.length) {
                commit('startRequest');
                const projects = await ProjectService.list();
                commit('endRequest');
                commit('project/setProjects', projects);
            }
        },
})

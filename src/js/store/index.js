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
import UrlHelper from "../helper/UrlHelper";

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
        },
    },
    actions: {
        async loadProjects({state, commit}) {
            if (!state.project.projects.length) {
                commit('startRequest');
                const projects = await ProjectService.list();
                commit('endRequest');
                commit('project/setProjects', projects);
            }
        },
        async loadFeatures({state, commit, getters}) {
            commit('startRequest');
            const geojson = await PlaceService.list(getters['project/getActiveProjectId']);
            commit('endRequest');
            commit('map/setGeoJSONData', geojson);
        },
        async initProject({dispatch, commit}, project) {
            // prepare map
            commit('map/clearSelection')
            commit('map/clearHighlight')
            // close sidebars
            commit('sidebarInfo/collapse')
            // set active project
            commit('project/setActiveProject', project);
            // set url
            window.history.pushState({}, '', UrlHelper.createProjectUrl(project));
            // load project features
            dispatch('loadFeatures');
        },
        initApplication({dispatch, commit, getters}) {
            // collapse info window
            dispatch('sidebarInfo/collapse')
            dispatch('sidebarViewer/collapse')
            dispatch('sidebarSearch/collapse')
            dispatch('sidebarMaps/collapse')
            dispatch('sidebarFilters/collapse')
            dispatch('sidebarTimeline/collapse')
            dispatch('sidebarProjects/collapse')

            // parse url
            const urlSegmentValues = UrlHelper.parseUrlPath(window.location.pathname)

            // load project data
            dispatch('loadProjects').then( (result) => {
                // determine active project
                let activeProject = getters['project/getDefaultProject']
                let projects = getters['project/getProjects']

                // url refers to project id?
                if (urlSegmentValues.project_slug) {
                    activeProject = projects.find( project => project.slug === urlSegmentValues.project_slug )
                }

                // set active project
                if (activeProject) {
                    commit('project/setActiveProject', activeProject) // commit = sync, dispatch = async
                }
            }).then( (result) => {
                // load features
                dispatch('loadFeatures').then( (result) => {
                    // select feature
                    if (urlSegmentValues?.place_id) {
                        dispatch('map/selectFeature', {id: urlSegmentValues.place_id})
                    }
                });
            });
        }
    }
})

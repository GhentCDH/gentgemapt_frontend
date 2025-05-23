import Vue from 'vue'
import Vuex from 'vuex'

import map from './map'
import poi from './poi'
import project from './project'
import filters from './featureFilters'
import sidebar from './sidebar'
import iiifViewer from './iiifViewer'
import theme from './theme'

Vue.use(Vuex)

import ProjectService from '../services/ProjectService'
import PlaceService from "../services/PlaceService";
import MapService from "../services/MapService";
import UrlHelper from "../helper/UrlHelper";

const logo = require('@/images/gentgemapt-logo-white.svg');

export default new Vuex.Store({
    modules: {
        map: map,
        poi: poi,
        project: project,
        featureFilters: filters,
        sidebarSearch: sidebar,
        sidebarMaps: sidebar,
        sidebarFilters: sidebar,
        sidebarProjects: sidebar,
        sidebarTimeline: sidebar,
        sidebarInfo: sidebar,
        sidebarViewer: sidebar,
        iiifViewer: iiifViewer,
        theme: theme,
    },
    state: () => ({
        focusedSidebar: [],
        openRequests: 0,
        debug: process.env?.DEBUG === 'true',
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
        async loadLayers({commit, getters}){
            commit('startRequest', null, { root: true });
            const layers = await MapService.list(getters['project/getActiveProjectId']);
            commit('endRequest', null, { root: true });
            commit('map/setLayers', layers);
        },
        async loadPlaces({commit, getters}) {
            commit('startRequest');
            const geojson = await PlaceService.list(getters['project/getActiveProjectId']);
            commit('endRequest');
            commit('map/setPlaces', geojson);
        },
        async loadPlace({commit}, placeId) {
            // commit('startRequest');
            const place = await PlaceService.get(placeId);
            // commit('endRequest');
            commit('poi/setPlace', place);
        },
        async selectPlace({dispatch, commit}, placeId, pushState = true) {
            if (pushState) {
                window.history.pushState({}, '', UrlHelper.createPlaceUrl(placeId))
            }
            dispatch('map/selectFeature', {id: placeId})
            dispatch('loadPlace', placeId)
            dispatch('sidebarInfo/collapse', false)
        },
        async initProject({dispatch, commit}, project) {
            // clear place
            dispatch('poi/clearPlace')
            // prepare map
            commit('map/clearSelection')
            commit('map/clearHighlight')
            // close sidebars
            commit('sidebarInfo/collapse')
            // set active project
            commit('project/setActiveProject', project);

            // set bounds
            if (project?.config?.bounds) {
                commit('map/setBounds', project.config.bounds)
            }

            // set center
            if (project?.config?.center) {
                commit('map/setCenter', project.config.center)
            }

            // set zoom
            if (project?.config?.zoom) {
                commit('map/setZoom', project.config.zoom)
            }

            // set theme
            commit('theme/setTheme', project?.config?.theme ?? {})

            // set url
            window.history.pushState({}, '', UrlHelper.createProjectUrl(project));

            // load project layers
            if (project?.config?.layers) {
                await dispatch('map/setLayers', project.config.layers)
            } else {
                await dispatch('loadLayers')
            }

            // load project features
            return dispatch('loadPlaces');
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

            commit('theme/setThemeDefaults', {
                logo: logo,
                notch: true,
                colors: {
                    primary: '#610345',
                    secondary: '#ed474a',
                    primaryContrast: '#e6e6e6',
                    secondaryContrast: '#e6e6e6',
                    marker: '#fff',
                    markerFocused: '#ed474a',
                    markerContrast: '#610345',
                    markerFocusedContrast: '#fff',
                }
            })

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
                dispatch('initProject', activeProject).then( (result) => {
                    if (urlSegmentValues?.place_id) {
                        // select place
                        dispatch('selectPlace', urlSegmentValues.place_id, false)
                        // update feature
                        dispatch('map/redrawFeatures', [urlSegmentValues.place_id])
                    }
                })
            }).then( (result) => {
                // load project places
                // dispatch('loadPlaces').then( (result) => {
                //     if (urlSegmentValues?.place_id) {
                //         // select place
                //         dispatch('selectPlace', urlSegmentValues.place_id, false)
                //         // update feature
                //         dispatch('map/redrawFeatures', [urlSegmentValues.place_id])
                //     }
                // });
            });
        }
    }
})

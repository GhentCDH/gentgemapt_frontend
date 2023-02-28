import Vue from 'vue'
import Vuex from 'vuex'

import map from './map'
import filters from './featureFilters'
import sidebar from './sidebar'
import iiifViewer from './iiifViewer'

Vue.use(Vuex)

export default new Vuex.Store({
    modules: {
        map: map,
        featureFilters: filters,
        sidebarSearch: sidebar,
        sidebarMaps: sidebar,
        sidebarFilters: sidebar,
        sidebarTimeline: sidebar,
        sidebarInfo: sidebar,
        sidebarViewer: sidebar,
        iiifViewer: iiifViewer
    },
    state: () => ({
        focusedSidebar: [],
    }),
    getters: {
        focusedSidebar: (state) => state.focusedSidebar[0] ?? null,
        sidebarWeight: (state) => (sidebar_id) => state.focusedSidebar.indexOf(sidebar_id)
    },
    mutations: {
        focusSidebar(state, sidebar_id) {
            state.focusedSidebar.unshift(sidebar_id)
            state.focusedSidebar = [...new Set(state.focusedSidebar)];
        },
        removeSidebarFocus(state, sidebar_id) {
            state.focusedSidebar = state.focusedSidebar.filter( id => id !== sidebar_id )
        }
    },
})
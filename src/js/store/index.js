import Vue from 'vue'
import Vuex from 'vuex'

import map from './map'
import sidebar from './sidebar'
import iiifViewer from './iiifViewer'

Vue.use(Vuex)

export default new Vuex.Store({
    modules: {
        map: map,
        sidebarSearch: sidebar,
        sidebarMaps: sidebar,
        sidebarFilters: sidebar,
        sidebarInfo: sidebar,
        sidebarViewer: sidebar,
        iiifViewer: iiifViewer
    }
})
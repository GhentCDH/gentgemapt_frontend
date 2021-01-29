import Vue from 'vue'
import Vuex from 'vuex'

import map from './map'
import sidebar from './sidebar'

Vue.use(Vuex)

export default new Vuex.Store({
    modules: {
        map: map,
        sidebar_search: sidebar,
        sidebar_info: sidebar
    }
})
import placeTypes from '../data/placeTypes'

export default {
    namespaced: true,
    state: () => ( {
        placeTypes: placeTypes,
        year: new Date().getFullYear(),
        search: []
    }),
    getters: {
        getPlaceTypes: state => state.placeTypes,
        getYear: state => state.year,
        getSearch: state => state.search
    },
    mutations: {
        reset(state) {
            state.placeTypes.forEach( i => i.active = true)
            state.year = new Date().getFullYear()
            state.search = []
        },
        resetYear(state) {
            state.year = new Date().getFullYear()
        },
        resetSearch(state) {
            state.search = []
        },
        resetPlaceTypes(state, active = true) {
            state.placeTypes.forEach( i => i.active = active)
        },
        // set map year
        setYear(state, year) {
            state.year = year
        },
        // list of place id's
        // payload = [ id1, ... ]
        setSearchResult(state, ids) {
            state.search = ids
        },
        // set status of placeType filters
        // payload = { id: XX, active: true/false }
        setPlaceTypeStatus(state, payload) {
            if ( payload?.id && payload?.active !== undefined ) {
                state.placeTypes.filter( i => i.id === payload.id ).forEach( i => i.active = payload.active )
            }
        },
    },
    actions: {
        setPlaceTypeStatus({commit}, payload) {
            commit('setPlaceTypeStatus', payload);
        },
        activateAllPlaceTypes({commit}) {
            commit('resetPlaceTypes', true)
        },
        deactivateAllPlaceTypes({commit}) {
            commit('resetPlaceTypes', false)
        },
        resetSearch({commit}) {
            commit('resetSearch')
        },
        setSearchResult({commit}, ids) {
            commit('setSearchResult', ids)
        },
        setYear({commit}, year) {
            commit('setYear', year)
        },
    },
}

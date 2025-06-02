export default {
    namespaced: true,
    state: () => ({
        apiUrl: null,
        siteUrl: null,
        mapUrl: null,
        debug: false,
    }),
    getters: {
        getApiUrl(state) {
            return state.apiUrl
        },
        getSiteUrl(state) {
            return state.siteUrl
        },
        getMapUrl(state) {
            return state.mapUrl
        },
        isDebug(state) {
            return state.debug
        }
    },
    mutations: {
        setApiUrl(state, apiUrl) {
            state.apiUrl = apiUrl
        },
        setSiteUrl(state, siteUrl) {
            state.siteUrl = siteUrl
        },
        setMapUrl(state, mapUrl) {
            state.mapUrl = mapUrl
        },
        setDebug(state, debug) {
            state.debug = debug
        }
   },
}

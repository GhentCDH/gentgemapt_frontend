export default {
    namespaced: true,
    state: () => ({
        manifestUrl: null
    }),
    getters: {
        getManifestUrl: state => state.manifestUrl,
    },
    mutations: {
        loadManifest(state, manifestUrl) {
            state.manifestUrl = manifestUrl
        },
    },
    actions: {
        loadManifest(context, manifestUrl) {
            context.commit('loadManifest', manifestUrl)
        },
    }
}
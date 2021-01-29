export default {
    namespaced: true,
    state: () => ( {
        center: [51.0526147, 3.7149632],
        zoom: 14,
        feature: null
    }),
    mutations: {
        updateCenter(state, payload) {
            state.center = [ payload.lat, payload.lng ]
        },
        updateZoom(state, payload) {
            state.zoom = payload
        },
        setFeature(state, feature) {
            state.feature = feature
        },
        clearFeature(state) {
            state.feature = null
        }
    },
    actions: {
        updateCenter(context, payload) {
            // update if different
            if ( JSON.stringify([ payload.lat, payload.lng]) != JSON.stringify(context.state.center) ) {
                context.commit('updateCenter', payload)
            }
        },
        updateZoom(context, payload) {
            // update if different
            if ( payload !== context.state.zoom ) {
                context.commit('updateZoom', payload)
            }
        },
        setFeature(context, feature) {
            if ( context.state.feature !== feature ) {
                context.commit('setFeature', feature)
            }
        },
        clearFeature(context) {
            context.commit('clearFeature')
        }
    }
}
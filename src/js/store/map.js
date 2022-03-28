import PlaceService from "../services/PlaceService";
import union from 'lodash/union';

export default {
    namespaced: true,
    state: () => ( {
        center: {
            lat: process.env.MAP_LAT,
            lng: process.env.MAP_LNG
        },
        bounds: null,
        zoom: 16,
        selectFeature: null,
        highlightFeatures: [],
        geojson: null,
    }),
    async mounted() {
        await this.$store.dispatch('loadGeoJSONData');
    },
    getters: {
        getGeoJSONData: state => state.geojson,
        getFeatureById: state => id => {
            return state.geojson.features.find(feature => feature.properties.id === id);
        },
        getZoom: state => state.zoom,
        getCenter: state => state.center,
        getBounds: state => state.bounds,
        getSelectedFeature: state => state.selectFeature,
        getHighlightedFeatures: state => state.selectFeature ? union(state.highlightFeatures, [state.selectFeature]) : state.highlightFeatures
    },
    mutations: {
        setCenter(state, payload) {
            state.center = [ payload.lat, payload.lng ]
        },
        setZoom(state, payload) {
            state.zoom = payload
        },
        selectFeature(state, feature) {
            feature.highlight = true
            state.selectFeature = feature
        },
        highlightFeature(state, feature) {
            feature.highlight = true;
            state.highlightFeatures.push(feature);
        },
        unhighlightFeature(state, feature) {
            if ( !state.selectFeature || state.selectFeature !== feature ) {
                feature.highlight = false;
            }
            state.highlightFeatures = state.highlightFeatures.filter(item => item.properties.id !== feature.properties.id)
        },
        setBounds(state, bounds) {
            state.bounds = bounds
        },
        clearSelection(state) {
            if ( state.selectFeature ) {
                state.selectFeature.highlight = false;
            }
            state.selectFeature = null
        },
        setGeoJSONData(state, payload) {
            state.geojson = payload
        }
    },
    actions: {
        setCenter(context, payload) {
            // update if different
            if ( JSON.stringify(payload) != JSON.stringify(context.state.center) ) {
                context.commit('setCenter', payload)
            }
        },
        setZoom(context, payload) {
            // update if different
            if ( payload !== context.state.zoom ) {
                context.commit('setZoom', payload)
            }
        },
        setBounds(context, payload) {
            // update if different
            if ( JSON.stringify(payload) != JSON.stringify(context.state.bounds) ) {
                // console.log('set bounds');
                // console.log(payload);
                context.commit('setBounds', payload)
            }
        },
        selectFeature(context, payload) {
            context.commit('clearSelection');
            if ( payload?.id ) {
                const feature = context.getters.getFeatureById(payload.id);
                if ( feature ) {
                    context.commit('selectFeature', feature);
                }
            }
            if ( payload?.feature ) {
                context.commit('selectFeature', payload.feature)
            }
        },
        clearSelection(context) {
            context.commit('clearSelection')
        },
        highlightFeature(context, payload) {
            if ( payload?.id ) {
                const feature = context.getters.getFeatureById(payload.id);
                context.commit('highlightFeature', feature);
            }
            if ( payload?.feature ) {
                context.commit('highlightFeature', payload.feature);
            }
        },
        unhighlightFeature(context, payload) {
            if ( payload?.id ) {
                const feature = context.getters.getFeatureById(payload.id);
                context.commit('unhighlightFeature', feature);
            }
            if ( payload?.feature ) {
                context.commit('unhighlightFeature', payload.feature);
            }
        },
        async loadGeoJSONData(context) {
            const geojson = await PlaceService.list();
            context.commit('setGeoJSONData', geojson);
        }
    }
}
import PlaceService from "../services/PlaceService";
import union from 'lodash/union';

import layers from '../data/layers'

function setPlaceUrl(id) {
    if ( ['number', 'string'].includes(typeof id) ) {
        const url = '/plaats/' + id
        window.history.pushState({}, '', url)
    }
}

function resetPlaceUrl() {
    window.history.pushState({}, '', '/')
}

export default {
    namespaced: true,
    state: () => ( {
        center: {
            lat: process.env.MAP_LAT,
            lng: process.env.MAP_LNG
        },
        bounds: null,
        zoom: 15,
        selectFeature: null,
        focusFeature: null,
        highlightFeatures: [],
        geojson: null,
        layers: layers,
        layerOptions: {
            'mapbox-v1' : {
                visible: true,
            }
        }
    }),
    getters: {
        getGeoJSONData: state => state.geojson,
        getLayers: state => state.layers,
        getFeatureById: state => id => {
            return state.geojson.features.find(feature => feature.properties.id === id);
        },
        getFeaturesById: state => id => {
            return state.geojson.features.filter(feature => feature.properties.id === id);
        },
        getFeaturesByIds: state => ids => {
            return state.geojson.features.find(feature => ids.includes(feature.properties.id))
        },
        getZoom: state => state.zoom,
        getCenter: state => state.center,
        getBounds: state => state.bounds,
        getSelectedFeature: state => state.selectFeature,
        getFocusedFeature: state => state.focusFeature,
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
        focusFeature(state, feature) {
            state.focusFeature = feature
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
        },
        setLayerVisibility(state, payload) {
            if ( payload?.id && payload?.visible !== undefined ) {
                // base layer? reset all layers first
                if ( state.layers.filter( i => i.id === payload.id )[0].options?.layerType === "base" ) {
                    state.layers.filter( i => i.options?.layerType === "base" ).forEach( i => i.options.visible = false )
                }
                state.layers.filter( i => i.id === payload.id ).forEach( i => i.options.visible = payload.visible )
            }
        },
        setLayerOpacity(state, payload) {
            if ( payload?.id && payload?.opacity !== undefined ) {
                state.layers.filter( i => i.id === payload.id ).forEach( i => i.options.opacity = payload.opacity )
            }
        }
    },
    actions: {
        setCenter(context, payload) {
            // update if different
            if ( JSON.stringify(payload) !== JSON.stringify(context.state.center) ) {
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
            if ( JSON.stringify(payload) !== JSON.stringify(context.state.bounds) ) {
                context.commit('setBounds', payload)
            }
        },
        selectFeature(context, payload) {
            context.commit('clearSelection');
            if ( payload?.id ) {
                const feature = context.getters.getFeatureById(payload.id);
                if ( feature ) {
                    context.commit('selectFeature', feature);
                    setPlaceUrl(feature.properties.id)
                }
            }
            if ( payload?.feature ) {
                context.commit('selectFeature', payload.feature)
                setPlaceUrl(payload.feature.properties.id)
            }
        },
        focusFeature(context, payload) {
            if ( payload?.id ) {
                const feature = context.getters.getFeatureById(payload.id);
                if ( feature ) {
                    context.commit('focusFeature', feature);
                }
            }
            if ( payload?.feature ) {
                context.commit('focusFeature', payload.feature)
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
            if ( !context.state.geojson ) {
                context.commit('startRequest', null, { root: true });
                const geojson = await PlaceService.list();
                context.commit('endRequest', null, { root: true });
                context.commit('setGeoJSONData', geojson);
            }
        }
    }
}

import PlaceService from "../services/PlaceService";
import union from 'lodash/union';

import layers from '../data/layers'





export default {
    namespaced: true,
    state: () => ( {
        center: {
            lat: null, //process.env.MAP_LAT,
            lng: null, //process.env.MAP_LNG
        },
        bounds: null,
        zoom: 15,
        selectedFeature: null,
        focusFeature: null,
        highlightedFeatures: [],
        geojson: null,
        layers: [],
        defaultLayers: [],
        featuresToRedraw: []
    }),
    getters: {
        getPlaces: state => {
            return state.geojson
        },
        getLayers: (state, getters) => state.layers,
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
        getSelectedFeature: state => state.selectedFeature,
        getFocusedFeature: state => state.focusFeature,
        getHighlightedFeatures: state => state.selectedFeature ? union(state.highlightedFeatures, [state.selectedFeature]) : state.highlightedFeatures,
        getFeaturesToRedraw: state => state.featuresToRedraw,
        points(state) {
            let features = state.geojson?.features ?? []
            let ret = {
                type: 'FeatureCollection',
                features: features.filter(function (item) {
                    return item.geometry.type === 'Point'//  && !item.properties.placeType.includes('straat')
                    // && that.visibleFeatureIds.has(item.properties.id);
                })
            };
            return ret
        },
        geometries(state) {
            let features = state.geojson?.features ?? []
            return {
                type: 'FeatureCollection',
                features: features.filter(function (item) {
                    return item.geometry.type !== 'Point';
                })
            };
        },
    },
    mutations: {
        setCenter(state, payload) {
            if ( Array.isArray(payload) && payload.length === 2 ) {
                state.center = payload
            } else if ( payload.lat && payload.lng ) {
                state.center = [ payload.lat, payload.lng ]
            }
        },
        setZoom(state, payload) {
            state.zoom = payload
        },
        selectFeature(state, feature) {
            // feature.highlight = true
            state.selectedFeature = feature
        },
        focusFeature(state, feature) {
            state.focusFeature = feature
        },
        highlightFeature(state, feature) {
            // feature.highlight = true;
            state.highlightedFeatures.push(feature);
        },
        unhighlightFeature(state, feature) {
            // if ( !state.selectedFeature || state.selectedFeature !== feature ) {
            //     // feature.highlight = false;
            // }
            state.highlightedFeatures = state.highlightedFeatures.filter(item => item.properties.id !== feature.properties.id)
        },
        setBounds(state, bounds) {
            state.bounds = bounds
        },
        clearSelection(state) {
            // if ( state.selectedFeature ) {
            //     state.selectedFeature.highlight = false;
            // }
            state.selectedFeature = null
        },
        clearHighlight(state) {
            // if ( state.highlightedFeatures.length ) {
            //     state²lightedFeatures.map(feature => feature.highlight = false)
            // }
            state.highlightedFeatures = []
        },
        setPlaces(state, payload) {
            state.geojson = payload
        },
        setLayers(state, layers) {
            state.layers = layers
        },
        setLayerVisibility(state, payload) {
            if ( payload?.id && payload?.visible !== undefined ) {
                // base layer? reset all layers first
                if ( state.layers.filter( layer => layer.id === payload.id )[0].isBaseLayer ) {
                    state.layers
                        .filter( layer => layer.isBaseLayer )
                        .forEach( layer => layer.options.visible = false )
                }
                state.layers
                    .filter( layer => layer.id === payload.id )
                    .forEach( layer => layer.options.visible = payload.visible )
            }
        },
        setLayerOpacity(state, payload) {
            if ( payload?.id && payload?.opacity !== undefined ) {
                state.layers
                    .filter( layer => layer.id === payload.id )
                    .forEach( layer => layer.options.opacity = payload.opacity )
            }
        },
        setFeaturesToRedraw(state, featureIds) {
            state.featuresToRedraw = featureIds
        }
    },
    actions: {
        setCenter({ commit, state }, payload) {
            // update if different
            if ( JSON.stringify(payload) !== JSON.stringify(state.center) ) {
                commit('setCenter', payload)
            }
        },
        setZoom({ commit, state }, payload) {
            // update if different
            if ( payload !== state.zoom ) {
                commit('setZoom', payload)
            }
        },
        setBounds({ commit, state }, payload) {
            // update if different
            if ( JSON.stringify(payload) !== JSON.stringify(state.bounds) ) {
                commit('setBounds', payload)
            }
        },
        selectFeature({ commit, dispatch, getters }, payload) {
            dispatch('clearSelection')
            const feature = payload?.id ? getters.getFeatureById(payload.id) : payload?.feature ?? null
            if ( feature ) {
                commit('selectFeature', feature);
            }
            if ( payload?.focus ) {
              commit('focusFeature', feature);
            }
        },
        focusFeature({ commit, dispatch, getters }, payload) {
            const feature = payload?.id ? getters.getFeatureById(payload.id) : payload?.feature ?? null
            if ( feature ) {
                commit('focusFeature', feature);
            }
        },
        clearSelection({ commit, dispatch, getters }) {
            const feature = getters['getSelectedFeature']
            if (feature) {
                dispatch('redrawFeatures', [ feature.properties.id ])
            }
            commit('clearSelection')
        },
        clearHighlight({ commit, dispatch }) {
            commit('clearHighlight')
        },
        highlightFeature({ commit, dispatch, getters }, payload) {
            const feature = payload?.id ? getters.getFeatureById(payload.id) : payload?.feature ?? null
            if ( feature ) {
                commit('highlightFeature', feature);
                dispatch('redrawFeatures', [feature.properties.id])
            }
        },
        unhighlightFeature({ commit, dispatch, getters }, payload) {
            const feature = payload?.id ? getters.getFeatureById(payload.id) : payload?.feature ?? null
            if ( feature ) {
                commit('unhighlightFeature', feature);
                dispatch('redrawFeatures', [feature.properties.id])
            }
        },
        redrawFeatures({ commit, dispatch }, ids = []) {
            commit('setFeaturesToRedraw', ids)
        },
        setLayerOpacity({commit}, payload) {
            commit('setLayerOpacity', payload)
        },
        setLayerVisibility({commit}, payload) {
            commit('setLayerVisibility', payload)
        },
        setLayers({commit}, layers) {
            commit('setLayers', layers)
        },
    }
}

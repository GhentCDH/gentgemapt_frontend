import PlaceService from '../services/PlaceService'
import union from 'lodash/union'

import layers from '../data/layers'


export default {
    namespaced: true,
    state: () => ({
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
        featuresToRedraw: [],
    }),
    getters: {
        getPlaces: state => {
            return state.geojson
        },
        getLayers: (state, getters) => state.layers,
        getFeatureById: state => id => {
            return state.geojson.features.find(feature => feature.properties.id === id)
        },
        getFeaturesById: state => id => {
            return state.geojson.features.filter(feature => feature.properties.id === id)
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
                features: features.filter(function(item) {
                    return item.geometry.type === 'Point'//  && !item.properties.placeType.includes('straat')
                    // && that.visibleFeatureIds.has(item.properties.id);
                }),
            }
            return ret
        },
        geometries(state) {
            let features = state.geojson?.features ?? []
            return {
                type: 'FeatureCollection',
                features: features.filter(function(item) {
                    return item.geometry.type !== 'Point'
                }),
            }
        },
    },
    mutations: {
        setCenter(state, center) {
            let newCenter = null
            if (Array.isArray(center) && center.length === 2) {
                newCenter = { lat: center[0], lng: center[1] }
            } else if (center?.lat && center?.lng) {
                newCenter = center
            }
            if (newCenter) {
                if (JSON.stringify(newCenter) !== JSON.stringify(state.center)) {
                    state.center = newCenter
                }
            }
        },
        setZoom(state, zoom) {
            state.zoom = zoom
        },
        setBounds(state, bounds) {
            state.bounds = bounds
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
            state.highlightedFeatures.push(feature)
        },
        unhighlightFeature(state, feature) {
            // if ( !state.selectedFeature || state.selectedFeature !== feature ) {
            //     // feature.highlight = false;
            // }
            state.highlightedFeatures = state.highlightedFeatures.filter(item => item.properties.id !== feature.properties.id)
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
            if (payload?.id && payload?.visible !== undefined) {
                // base layer? reset all layers first
                if (state.layers.filter(layer => layer.id === payload.id)[0].isBaseLayer) {
                    state.layers
                        .filter(layer => layer.isBaseLayer)
                        .forEach(layer => layer.options.visible = false)
                }
                state.layers
                    .filter(layer => layer.id === payload.id)
                    .forEach(layer => layer.options.visible = payload.visible)
            }
        },
        setLayerOpacity(state, payload) {
            if (payload?.id && payload?.opacity !== undefined) {
                state.layers
                    .filter(layer => layer.id === payload.id)
                    .forEach(layer => layer.options.opacity = payload.opacity)
            }
        },
        setFeaturesToRedraw(state, featureIds) {
            state.featuresToRedraw = featureIds
        },
    },
    actions: {
        setCenter({ commit, state }, center) {
            commit('setCenter', center)
        },
        setZoom({ commit, state }, zoom) {
            // update if different
            if (zoom !== state.zoom) {
                commit('setZoom', zoom)
            }
        },
        setBounds({ commit, state }, bounds) {
            // update if different
            if (JSON.stringify(bounds) !== JSON.stringify(state.bounds)) {
                commit('setBounds', bounds)
            }
        },
        selectFeature({ commit, dispatch, getters }, payload) {
            dispatch('clearSelection').then(() => {
                const feature = payload?.id ? getters.getFeatureById(payload.id) : payload?.feature ?? null
                if (feature) {
                    commit('selectFeature', feature)
                    commit('setFeaturesToRedraw', [feature.properties.id])
                    if (payload?.focus) {
                        commit('focusFeature', feature)
                    }
                }
            })
        },
        focusFeature({ commit, dispatch, getters }, payload) {
            const feature = payload?.id ? getters.getFeatureById(payload.id) : payload?.feature ?? null
            if (feature) {
                commit('focusFeature', feature)
            }
        },
        clearSelection({ commit, dispatch, getters }) {
            const feature = getters['getSelectedFeature']
            if (feature) {
                commit('setFeaturesToRedraw', [feature.properties.id])
            }
            commit('clearSelection')
        },
        clearHighlight({ commit, dispatch }) {
            commit('clearHighlight')
        },
        highlightFeature({ commit, dispatch, getters }, payload) {
            const feature = payload?.id ? getters.getFeatureById(payload.id) : payload?.feature ?? null
            if (feature) {
                commit('highlightFeature', feature)
                commit('setFeaturesToRedraw', [feature.properties.id])
            }
        },
        unhighlightFeature({ commit, dispatch, getters }, payload) {
            const feature = payload?.id ? getters.getFeatureById(payload.id) : payload?.feature ?? null
            if (feature) {
                commit('unhighlightFeature', feature)
                commit('setFeaturesToRedraw', [feature.properties.id])
            }
        },
        redrawFeatures({ commit, dispatch }, ids = []) {
            commit('setFeaturesToRedraw', ids)
        },
        setLayerOpacity({ commit }, payload) {
            commit('setLayerOpacity', payload)
        },
        setLayerVisibility({ commit }, payload) {
            commit('setLayerVisibility', payload)
        },
        setLayers({ commit }, layers) {
            commit('setLayers', layers)
        },
    },
}

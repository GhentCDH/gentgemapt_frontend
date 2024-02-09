<template>
    <div id="map" class="map">
        <l-map v-bind="map" :center="center" :zoom="zoom" :bounds="bounds" :max-zoom="18"
               @update:zoom="onUpdateZoom"
               @update:center="onUpdateCenter"
               @update:bounds="onUpdateBounds"
               @ready="onMapReady">
            <v-marker-cluster :options="defaultMarkerClusterOptions" ref="markerCluster">
            </v-marker-cluster>
            <l-tile-layer v-for="layer in tileLayers" :key="layer.id"
                          v-bind="layer.options"
            />
            <l-w-m-s-tile-layer v-for="layer in wmsLayers" :key="layer.id" v-bind="layer.options"></l-w-m-s-tile-layer>
            <l-geo-json :ref="layer.id" v-for="layer in geojsonLayers" :key="layer.id"
                        v-bind="layer.options"></l-geo-json>
            <l-warped-map :ref="layer.id" v-for="layer in warpedMapLayers" :key="layer.id"
                        v-bind="layer.options"></l-warped-map>
            <l-control class="map__control map__control--topleft" position="topleft">
                <slot name="controls-topleft"></slot>
            </l-control>
            <l-control-attribution position="bottomright" :prefix="false"></l-control-attribution>
        </l-map>
    </div>
</template>

<script>
import {LControl, LControlLayers, LControlAttribution, LGeoJson, LMap, LMarker, LTileLayer, LWMSTileLayer} from 'vue2-leaflet';
import LWarpedMap from './LWarpedMap.vue';
import Vue2LeafletMarkerCluster from 'vue2-leaflet-markercluster'
import {Icon} from 'leaflet';


var isCallable = require('is-callable');

import 'leaflet.snogylop'
import 'leaflet/dist/leaflet.css';
import {WarpedMapLayer} from "@allmaps/leaflet";

export default {
    name: "AppMap",
    emits: [
        'featureSelect', 'featureMouseLeave', 'featureMouseEnter',
        'updateZoom', 'updateCenter', 'updateBounds', 'mapReady'
    ],
    components: {
        LMap,
        LTileLayer,
        LMarker,
        LGeoJson,
        LControl,
        LControlLayers,
        LControlAttribution,
        LWarpedMap,
        LWMSTileLayer,
        'v-marker-cluster': Vue2LeafletMarkerCluster
    },
    props: {
        debug: {
            type: Boolean,
            required: false,
            default: false
        },
        layers: {
            type: Array,
            default() {
                return []
            }
        },
        bounds: {
            type: Array|Object,
            default: null
        },
        center: {
            type: Array|Object,
            default: () => [0, 0]
        },
        zoom: {
            type: Number,
            default: 0
        },
        iconDefaults: {
            type: Object,
            required: false,
            default: function() {
                return {
                    iconSize: [28, 33],
                    iconAnchor: [14, 33],
                    popupAnchor: [1, -34],
                    tooltipAnchor: [20, -28],
                    shadowSize: [40, 54],
                    shadowAnchor: [40,54],
                }
            }
        },
        clusterIconDefaults: {
            type: Object,
            required: false,
            default: function() {
                return {
                    iconSize: [34, 40],
                    iconAnchor: [17, 40],
                    popupAnchor: [1, -41],
                    tooltipAnchor: [20, -28],
                    shadowSize: [40, 54],
                    shadowAnchor: [40,54],
                }
            }
        },
        featureClass: {
            type: String|Function,
            required: false,
            default: 'feature'
        },
        clusterClass: {
            type: String|Function,
            required: false,
            default: 'cluster'
        },
        refreshFeatures: {
            type: Array,
            required: false,
            default: () => []
        }
    },
    data() {
        return {
            mapObject: null,
            map: {
                minZoom: 12,
                options: {
                    attributionControl: false,
                    zoomControl: true
                }
            },
        }
    },
    computed: {
        defaultGeoJsonOptions() {
            return {
                onEachFeature: this.onEachFeature,
                pointToLayer: this.pointToLayer
            }
        },
        defaultMarkerClusterOptions() {
            return {
                iconCreateFunction: this.clusterIcon,
                showCoverageOnHover: false,
                maxClusterRadius: 40,
            }
        },
        /* layers */
        wmsLayers() {
            return this.layers.filter( layer => layer.type === "wmsLayer" )
        },
        tileLayers() {
            return this.layers.filter( layer => layer.type === "tileLayer" )
        },
        geojsonLayers() {
            const that = this
            return this.layers.filter( layer => layer.type === "geoJsonLayer" && !layer?.options?.clusterMarkers ).map( function(layer) {
                layer.options.options = { ...layer.options.options, ...that.defaultGeoJsonOptions}
                return layer
            })
        },
        geojsonClusterLayers() {
            const that = this
            this.debug && console.log("* geojsonClusterLayers refreshed")
            return this.layers.filter( layer => layer.type === "geoJsonLayer" && layer?.options?.clusterMarkers ).map( function(layer) {
                layer.options.options = { ...layer.options.options, ...that.defaultGeoJsonOptions}
                return layer
            })
        },
        warpedMapLayers() {
            return this.layers.filter( layer => layer.type === "warpedMapLayer" )
        },
    },
    watch: {
        refreshFeatures(current, previous) {
            let placeIds = [...current, ...previous]
            this.debug && console.log("* refreshFeatures", placeIds)
            this.updateFeatureStyles(placeIds)
        },
        geojsonClusterLayers(layers) {
            if (!layers?.length) {
                return
            }
            const clusterLayer = this.$refs.markerCluster.mapObject
            clusterLayer.clearLayers()
            for (const layer of layers) {
                const geojson = new L.geoJSON(layer.options.geojson, layer.options.options)
                clusterLayer.addLayer(geojson);
            }

            // for (const layer of layers) {
            //     let layersToRemove = []
            //     let clusterLayerIds = new Set()
            //     const layerIds = new Set(layer.options.geojson.features.map( feature => feature.properties.id ))
            //     clusterLayer.eachLayer( layer => {
            //         if (layerIds.has(layer?.feature.properties.id)) {
            //             layersToRemove.push(layer)
            //         }
            //         clusterLayerIds.add(layer.feature.properties.id)
            //     })
            //     console.log(layersToRemove)
            //     clusterLayer.removeLayers(layersToRemove)
            //     const geojson = new L.geoJSON(layer.options.geojson, {...layer.options.options, filter: feature => !clusterLayerIds.has(feature.properties.id) })
            //     clusterLayer.addLayer(geojson);
            // }
        }
    },
    methods: {
        /* map events */
        onUpdateZoom(payload) {
            this.debug && console.log('* event: updateCenter')
            this.updateFeatureStyles()
            this.$emit('updateZoom', payload)
        },
        onUpdateCenter(payload) {
            this.debug && console.log('* event: updateCenter')
            this.$emit('updateCenter', payload)
        },
        onUpdateBounds(payload) {
            this.debug && console.log('* event: updateBounds')
            this.$emit('updateBounds', payload)
        },
        onMapReady(mapObject) {
            this.debug && console.log('* event: mapReady')
            // this.mapObject = this.$refs.GmMap.mapObject
            this.mapObject = mapObject

            // todo: create panes?
            // this.mapObject.createPane('custom')

            this.$emit('mapReady', mapObject)
        },
        /* feature events */
        onEachFeature(feature, layer) {
            // init highlight property
            feature.highlight = false;

            layer.on('click', event => this.onFeatureSelect( { feature: feature, layer: layer, map: this.mapObject }, event));
            layer.on('mouseout', event => this.onFeatureMouseLeave({ feature: feature, layer: layer, map: this.mapObject }, event));
            layer.on('mouseover', event => this.onFeatureMouseEnter( { feature: feature, layer: layer, map: this.mapObject }, event));
        },
        onFeatureMouseEnter(payload, event) {
            this.debug && console.log('* event: featureMouseEnter')
            this.$emit('featureMouseEnter', payload, event)
        },
        onFeatureMouseLeave(payload, event) {
            this.debug && console.log('* event: featureMouseLeave')
            this.$emit('featureMouseLeave', payload, event)
        },
        onFeatureSelect(payload, event) {
            this.debug && console.log('* event: featureSelect')
            this.$emit('featureSelect', payload, event)
        },
        // feature methods
        pointToLayer: function (feature, latlng) {
            return L.marker(latlng, {
                title: feature?.properties?.title,
                icon: L.divIcon({
                    ...this.iconDefaults,
                    className: isCallable(this.featureClass) ? this.featureClass(feature) : this.featureClass
                }),
                riseOnHover: true,
            })
        },
        clusterIcon: function(cluster) {
            return L.divIcon({
                ...this.clusterIconDefaults,
                html: '<span>' + cluster.getChildCount() + '</span>',
                className: isCallable(this.clusterClass) ? this.clusterClass(cluster) : this.clusterClass
            });
        },
        updateFeatureStyles(featureIds = []) {
            if (!this.mapObject) {
                return
            }

            const featureIdSet = new Set(featureIds)
            this.debug && console.log('* updateFeatureStyles')

            const that = this
            this.mapObject.eachLayer( layer => {
                // no feature? no update
                if (!layer?.feature)
                    return
                // not part of featureIds? no update
                if (featureIdSet.size && !featureIdSet.has(layer.feature.properties.id)) {
                    return
                }
                // update style
                if (layer.options?.style && isCallable(layer.options?.style)) {
                    layer.setStyle(layer.options.style(layer.feature))
                }

                // update class
                layer.getElement().setAttribute(
                    'class',
                    isCallable(this.featureClass) ? this.featureClass(layer.feature) : this.featureClass)
            })
        },
    },

    mounted() {
        // set default icon style
        delete Icon.Default.prototype._getIconUrl;
        L.Icon.Default.mergeOptions(this.iconDefaults)
    },
}
</script>

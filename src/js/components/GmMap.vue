<template>
    <div id="map" class="map">
        <l-map ref="GmMap" v-bind="map" :center="center" :zoom="zoom" :bounds="bounds" @update:zoom="updateZoom"
               @update:center="updateCenter" @update:bounds="updateBounds" @ready="onMapReady">
            <l-control-layers position="topright"></l-control-layers>
            <l-tile-layer v-for="layer in tileLayers" :key="layer.id"
                          v-bind="layer.options"
            />
            <l-wms-tile-layer v-for="layer in wmsLayers" :key="layer.id" v-bind="layer.options"
                              layer-type="overlay"></l-wms-tile-layer>
            <l-geo-json :ref="layer.id" v-for="layer in geojsonLayers" :key="layer.id"
                        v-bind="layer.options"></l-geo-json>
        </l-map>
    </div>
</template>

<script>
// create layer groups
// https://stackoverflow.com/questions/32195267/how-to-parse-geojson-file-into-leaflet-layers


import {LControl, LGeoJson, LMap, LMarker, LTileLayer, LWMSTileLayer, LControlLayers} from 'vue2-leaflet';
import 'leaflet.snogylop'
import 'leaflet/dist/leaflet.css';

// icon fix
import {Icon} from 'leaflet';
// add ghent overlay
import ghent from '@/js/ghent.json'

delete Icon.Default.prototype._getIconUrl;

let iconDefaults = {
    iconSize: [40, 40],
    iconAnchor: [40, 40],
    popupAnchor: [1, -34],
    tooltipAnchor: [20, -28],
    shadowSize: [40, 40],
    iconRetinaUrl: require('@/images/markers/default.svg'),
    iconUrl: require('@/images/markers/default.svg'),
    shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
}

L.Icon.Default.mergeOptions(iconDefaults)

let featureConfigs = [
    {
        features: ['abdijkerken', 'parochiekerken', 'kapellen (gebouwen en structuren)', 'kloosters', 'kerken'],
        markerIcon: L.icon({
            ...iconDefaults,
            iconRetinaUrl: require('@/images/markers/kerk.svg'),
            iconUrl: require('@/images/markers/kerk.svg')
        }),
        fillColor: '',
        textColor: '',
    },
    {
        features: ['katoenfabrieken', 'opslagplaatsen', 'vlasfabrieken', 'spinnerijen', 'kantoorgebouwen'],
        markerIcon: L.icon({
            ...iconDefaults,
            iconRetinaUrl: require('@/images/markers/gebouw.svg'),
            iconUrl: require('@/images/markers/gebouw.svg')
        }),
        fillColor: '',
        textColor: '',
    },
    {
        features: ['theaters'],
        markerIcon: L.icon({
            ...iconDefaults,
            iconRetinaUrl: require('@/images/markers/theatre.svg'),
            iconUrl: require('@/images/markers/theatre.svg')
        }),
        fillColor: '',
        textColor: '',
    },
    {
        features: ['bioscopen'],
        markerIcon: L.icon({
            ...iconDefaults,
            iconRetinaUrl: require('@/images/markers/cinema.svg'),
            iconUrl: require('@/images/markers/cinema.svg')
        }),
        fillColor: '',
        textColor: '',
    },
    {
        features: ['parken'],
        markerIcon: L.icon({
            ...iconDefaults,
            iconRetinaUrl: require('@/images/markers/park.svg'),
            iconUrl: require('@/images/markers/park.svg')
        }),
        fillColor: '',
        textColor: '',
    },
    {
        features: ['universiteitsgebouwen'],
        markerIcon: L.icon({
            ...iconDefaults,
            iconRetinaUrl: require('@/images/markers/university.svg'),
            iconUrl: require('@/images/markers/university.svg')
        }),
        fillColor: '',
        textColor: '',
    },
    {
        features: ['bibliotheken'],
        markerIcon: L.icon({
            ...iconDefaults,
            iconRetinaUrl: require('@/images/markers/library.svg'),
            iconUrl: require('@/images/markers/library.svg')
        }),
        fillColor: '',
        textColor: '',
    },
    {
        features: ['bruggen'],
        markerIcon: L.icon({
            ...iconDefaults,
            iconRetinaUrl: require('@/images/markers/bridge.svg'),
            iconUrl: require('@/images/markers/bridge.svg')
        }),
        fillColor: '',
        textColor: '',
    },

];

// console.log(featureConfigs)

export default {
    name: "AppMap",
    components: {
        LMap,
        LTileLayer,
        LMarker,
        LGeoJson,
        LControl,
        LControlLayers,
        'l-wms-tile-layer': LWMSTileLayer
    },
    props: {
        layers: {
            type: Array,
            default() {
                return []
            }
        },
        geojson: {
            type: Object,
            required: false,
            default: {
                type: 'FeatureCollection',
                features: []
            }
        }

    },
    data() {
        return {
            mapObject: null,
            map: {
                minZoom: 14,
                options: {
                    attributionControl: false,
                    zoomControl: true
                }
                /* preferCanvas: true */
            },
        }
    },
    computed: {
        /* layers */
        wmsLayers() {
            return this.layers.filter( layer => layer.type === "wmsLayer" )
        },
        tileLayers() {
            return this.layers.filter( layer => layer.type === "tileLayer" )
        },
        geojsonLayers() {
            return this.layers.filter( layer => layer.type === "geojsonLayer" )
        },
        /* geojson */
        points() {
            let features = this.geojson?.features ?? []
            return {
                type: 'FeatureCollection',
                features: features.filter(function (item) {
                    return item.geometry.type === 'Point' && !item.properties.features.includes('wegen');
                })
            };
        },
        geometries() {
            let features = this.geojson?.features ?? []
            return {
                type: 'FeatureCollection',
                features: features.filter(function (item) {
                    return item.geometry.type !== 'Point';
                })
            };
        },
        center() {
            return this.$store.getters['map/getCenter'];
        },
        zoom() {
            return this.$store.state.map.zoom
        },
        bounds() {
            return this.$store.state.map.bounds
        },
        highlightedFeatureIds() {
            return this.$store.getters['map/getHighlightedFeatures'].map(i => i.properties.id)
        },

        /*
            ...mapGetters([
                'map/getGeoJSONData'
            ])*/
    },
    watch: {
        highlightedFeatureIds() {
            this.updateFeatureStyles()
        },
        zoom() {
            this.updateFeatureStyles()
        },
        geometries() {
            this.updateGeometries(this.geometries)
        },
        points() {
            this.updatePoints(this.points)
        },
    },
    methods: {
        updateZoom(payload) {
            this.$store.dispatch('map/setZoom', payload)
        },
        updateCenter(payload) {
            this.$store.dispatch('map/setCenter', payload)
        },
        updateBounds(payload) {
            this.$store.dispatch('map/setBounds', payload)
        },
        onMapReady() {
            this.mapObject = this.$refs.GmMap.mapObject
        },
        onEachFeature(feature, layer) {
            const that = this
            // init highlight property
            feature.highlight = false;

            layer.on('click', e => this.onMarkerClick(e, feature));
            layer.on('mouseout', e => this.onMarkerMouseOut(e, feature));
            layer.on('mouseover', e => this.onMarkerMouseOver(e, feature));
        },
        onMarkerMouseOver(e, feature) {
            this.$store.dispatch('map/highlightFeature', {feature: feature})
        },
        onMarkerMouseOut(e, feature) {
            this.$store.dispatch('map/unhighlightFeature', {feature: feature})
        },
        onMarkerClick(e, feature) {
            this.$store.dispatch('map/selectFeature', {feature: feature})
            this.$store.dispatch('sidebarInfo/collapse', false)
            // todo: positie berekenen
            const containerWidth = document.getElementsByClassName('leaflet-container')[0].offsetWidth;
            const sidebarWidth = 550;
            const markerXPos = e.containerPoint.x;
            if (markerXPos > containerWidth - sidebarWidth) {
                this.mapObject.panBy([markerXPos - (containerWidth - sidebarWidth) + 200, 0]);
            }
        },
        geometryClasses(feature) {
            let highlight = this.highlightedFeatureIds.includes(feature.properties.id);
            let classes = feature.properties.features.map(i => 'geometry geometry--feature-' + i)
            if (highlight) {
                classes.push('geometry--highlight')
            }
            classes.push('geometry--type-' + feature.geometry.type)

            return classes
        },
        updateGeoJson(mapObject, json) {
            let new_ids = json.features.map( feature => feature.properties.id )
            let current_ids = []
            mapObject.eachLayer((layer) => {
                if ( !new_ids.includes(layer.feature.properties.id) ) {
                    mapObject.removeLayer(layer)
                } else  {
                    current_ids.push(layer.feature.properties.id)
                }
            })
            // this.$refs.points[0].mapObject.clearLayers()
            mapObject.addData( {
                type: 'FeatureList',
                features: json.features.filter( feature => !current_ids.includes(feature.properties.id) )
            } )
        },
        updateGeometries(json) {
            if (this.$refs?.geometries) {
                this.updateGeoJson(this.$refs.geometries[0].mapObject, json)
            }
        },
        updatePoints(json) {
            if (this.$refs?.points) {
                this.updateGeoJson(this.$refs.points[0].mapObject, json)
            }
        },
        styleGeometry(feature) {
            let isHighlighted = this.highlightedFeatureIds.includes(feature.properties.id);

            switch (feature.geometry.type) {
                case 'Polygon':
                case 'Multipolygon':

                    return {
                        fillOpacity: isHighlighted ? 0.4 : 0.1,
                        fillColor: isHighlighted ? 'rgb(0 128 182)' : 'rgb(0 128 182)',
                        color: 'rgb(0 128 182)',
                        weight: 2,
                        stroke: isHighlighted,
                        className: this.geometryClasses(feature).join(' ')
                    };

                    break;
                default:
                    return {
                        color: isHighlighted ? 'rgb(0 128 182)' : 'rgb(0 0 0)',
                        opacity: isHighlighted ? 0.7 : 0.05,
                        weight: 8,
                        stroke: isHighlighted || this.zoom >= 16,
                        className: this.geometryClasses(feature).join(' ')
                    };

                    break;
            }
        },
        updateFeatureStyles() {
            this.$nextTick(() => {
                // update geometry styles
                if (this.$refs?.geometries) {
                    this.$refs.geometries[0].mapObject.eachLayer((layer) => {
                        if (layer.feature.geometry.type !== 'Point') {
                            layer.setStyle(this.styleGeometry(layer.feature));
                        }
                    })
                }
                // todo: update point styles (this is incorrect)
                if (this.$refs?.points) {
                    this.$refs.geometries[0].mapObject.eachLayer((layer) => {
                        if (layer.feature.geometry.type !== 'Point') {
                            layer.setStyle(this.styleGeometry(layer.feature));
                        }
                    })
                }
            })
        },
    },

    created() {

        // add geojson point layer
        this.layers.push(
            {
                id: 'geometries',
                type: 'geojsonLayer',
                options: {
                    geojson: this.geometries,
                    options: {
                        onEachFeature: this.onEachFeature,
                        style: this.styleGeometry,
                    }
                }
            }
        )

        // add geojson geometry layer
        this.layers.push(
            {
                id: 'points',
                type: 'geojsonLayer',
                options: {
                    geojson: this.points,
                    options: {
                        onEachFeature: this.onEachFeature,
                        // style: this.styleGeometry,
                        pointToLayer: function (feature, latlng) {
                            for (const featureConfig of featureConfigs) {
                                if (featureConfig.features.filter(i => feature.properties.features.includes(i)).length) {
                                    return L.marker(latlng, {
                                        title: feature.properties.title,
                                        icon: featureConfig.markerIcon
                                    })
                                }
                            }
                            return L.marker(latlng, {
                                title: feature.properties.title,
                                icon: L.icon(iconDefaults)
                            })
                        }
                    }
                }
            }
        )


    },
}
</script>

<style scoped>
.gm-map {
    width: 100%;
}
</style>
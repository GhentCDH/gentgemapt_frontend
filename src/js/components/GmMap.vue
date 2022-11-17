<template>
    <div id="map" class="map">
        <l-map ref="GmMap" v-bind="map" :center="center" :zoom="zoom" :bounds="bounds" @update:zoom="onUpdateZoom"
               @update:center="onUpdateCenter" @update:bounds="onUpdateBounds" @ready="onMapReady">
            <l-tile-layer v-for="layer in tileLayers" :key="layer.id"
                          v-bind="layer.options"
            />
            <l-wms-tile-layer v-for="layer in wmsLayers" :key="layer.id" v-bind="layer.options"></l-wms-tile-layer>
            <l-geo-json :ref="layer.id" v-for="layer in geojsonLayers" :key="layer.id"
                        v-bind="layer.options"></l-geo-json>
            <l-control class="map__control map__control--topleft" position="topleft">
                <slot name="controls-topleft"></slot>
            </l-control>
        </l-map>
    </div>
</template>

<script>
import {LControl, LGeoJson, LMap, LMarker, LTileLayer, LWMSTileLayer, LControlLayers} from 'vue2-leaflet';
import 'leaflet.snogylop'
import 'leaflet/dist/leaflet.css';

// icon fix
import {Icon} from 'leaflet';
// add ghent overlay

delete Icon.Default.prototype._getIconUrl;

let iconDefaults = {
    iconSize: [28, 33],
    iconAnchor: [14, 33],
    popupAnchor: [1, -34],
    tooltipAnchor: [20, -28],
    shadowSize: [40, 54],
    shadowAnchor: [40,54],
    iconUrl: require('@/images/placetypes/bw/GentGemapt_Andere.svg'),
}

L.Icon.Default.mergeOptions(iconDefaults)


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
                minZoom: 12,
                options: {
                    attributionControl: false,
                    zoomControl: false
                }
            },
        }
    },
    computed: {
        icons() {
            const icons = {}
            const me = this

            this.$store.getters["placeTypeFilters/getFilters"].forEach(
                function (placeType) {
                    icons[placeType.id] = L.divIcon({
                        ...iconDefaults,
                        className: me.iconClasses(placeType).join(' '),
                        html: '<img src="' + placeType.icon + '">'
                    })
                },
            )
            return icons
        },

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
                    return item.geometry.type === 'Point' && !item.properties.placeType.includes('straat');
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
        highlightedFeatureIds(now, old) {
            let placeIds = [...now, ...old]
            this.updateFeatureStyles(placeIds)
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
        /* map events */
        onUpdateZoom(payload) {
            this.$store.dispatch('map/setZoom', payload)
        },
        onUpdateCenter(payload) {
            this.$store.dispatch('map/setCenter', payload)
        },
        onUpdateBounds(payload) {
            this.$store.dispatch('map/setBounds', payload)
        },
        onMapReady() {
            this.mapObject = this.$refs.GmMap.mapObject
        },
        /* feature events */
        onEachFeature(feature, layer) {
            const that = this
            // init highlight property
            feature.highlight = false;

            layer.on('click', e => this.onMarkerClick(e, feature));
            layer.on('mouseout', e => this.onMarkerMouseOut(e, feature));
            layer.on('mouseover', e => this.onMarkerMouseOver(e, feature));
        },
        /* marker events */
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
        updateFeatureStyles(placeIds = []) {
            this.$nextTick(() => {
                // update style of all geometries or selected placeIds only
                if (this.$refs?.geometries) {
                    this.$refs.geometries[0].mapObject.eachLayer((layer) => {
                        if (placeIds.length && !placeIds.includes(layer.feature.properties.id)) {
                            return
                        }
                        layer.setStyle(this.geometryStyle(layer.feature));
                    })
                }
                // todo: update point styles (this is incorrect)
                // if (this.$refs?.points) {
                //     this.$refs.geometries[0].mapObject.eachLayer((layer) => {
                //         if (layer.feature.geometry.type === 'Point') {
                //             layer.setStyle(this.stylePoint(layer.feature));
                //         }
                //     })
                // }
            })
        },
        /* get geometry classes */
        geometryClasses(feature) {
            let highlight = this.highlightedFeatureIds.includes(feature.properties.id);
            let classes = feature.properties.placeType.map(i => 'geometry geometry--' + i)
            if (highlight) {
                classes.push('geometry--highlight')
            }
            return classes
        },
        iconClasses(placeType) {
            let classes = ['icon', 'icon--' + placeType.id]
            return classes
        },
        /* get geometry style */
        geometryStyle(feature) {
            let isHighlighted = this.highlightedFeatureIds.includes(feature.properties.id);

            switch (feature.geometry.type) {
                case 'Polygon':
                case 'MultiPolygon':
                    return {
                        fillOpacity: isHighlighted ? 0.4 : (process.env.IS_SAD === 'true' ? 0.1 : 0.0 ),
                        fillColor: isHighlighted ? 'rgb(0 128 182)' : (process.env.IS_SAD === 'true' ? 'rgb(246,143,2)' : 'rgb(0 128 182)' ),
                        color: 'rgb(0 128 182)',
                        weight: 2,
                        stroke: isHighlighted,
                        className: this.geometryClasses(feature).join(' ')
                    };
                default:
                    return {
                        color: isHighlighted ? 'rgb(0 128 182)' : (process.env.IS_SAD === 'true' ? 'rgb(246,143,2)' : 'rgb(0 0 0)'),
                        opacity: isHighlighted ? 0.7 : (process.env.IS_SAD === 'true' ? 0.4 : 0.05),
                        weight: this.zoom < 17 ? 4 : Math.ceil(2 ^ (this.zoom - 16) * 4 ),
                        stroke: isHighlighted || ( this.zoom >= 15 || process.env.IS_SAD === 'true' ),
                        className: this.geometryClasses(feature).join(' ')
                    };
            }
        },
        /* get point style */
        pointStyle(feature) {
            let isHighlighted = this.highlightedFeatureIds.includes(feature.properties.id);

            return {
                size: isHighlighted ? [44,44] : [40,40]
            }
        },

    },

    created() {

        const me = this

        // add geojson point layer
        this.layers.push(
            {
                id: 'geometries',
                type: 'geojsonLayer',
                zIndex: 1000,
                options: {
                    geojson: this.geometries,
                    options: {
                        onEachFeature: this.onEachFeature,
                        style: this.geometryStyle,
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
                    zIndex: 1000,
                    options: {
                        onEachFeature: this.onEachFeature,
                        // style: this.styleGeometry,
                        pointToLayer: function (feature, latlng) {
                            // known placeType? display custom icon
                            if ( feature.properties.placeType?.length && me.icons[feature.properties.placeType[0]] )
                            {
                                return L.marker(latlng, {
                                    title: feature.properties.title,
                                    icon: me.icons[feature.properties.placeType[0]]
                                })
                            }
                            // placeType unknown, display default icon
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
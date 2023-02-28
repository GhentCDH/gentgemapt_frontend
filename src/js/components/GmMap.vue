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
import {LControl, LControlLayers, LGeoJson, LMap, LMarker, LTileLayer, LWMSTileLayer} from 'vue2-leaflet';
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
                    zoomControl: true
                }
            },
        }
    },
    computed: {
        icons() {
            const icons = {}
            const me = this

            this.$store.getters["featureFilters/getPlaceTypes"].forEach(
                function (placeType) {
                    icons[placeType.id] = L.divIcon({
                        ...iconDefaults,
                        className: me.getIconClasses(placeType).join(' '),
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
                    return item.geometry.type === 'Point' && !item.properties.placeType.includes('straat') && !item.properties.placeType.includes('water');
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
        filterSearchIds() {
            return this.$store.getters['featureFilters/getSearch']
        },
        focusedFeature() {
            return this.$store.getters['map/getFocusedFeature']
        },
    },
    watch: {
        focusedFeature(now, old) {
            if ( now ) {
                this.focusFeature(now)
            }
        },
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

            layer.on('click', e => this.onFeatureClick(e, feature));
            layer.on('mouseout', e => this.onFeatureMouseOut(e, feature));
            layer.on('mouseover', e => this.onFeatureMouseOver(e, feature));
        },
        onFeatureMouseOver(e, feature) {
            this.$store.dispatch('map/highlightFeature', {feature: feature})
        },
        onFeatureMouseOut(e, feature) {
            this.$store.dispatch('map/unhighlightFeature', {feature: feature})
        },
        onFeatureClick(e, feature) {
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
        // map methods
        focusFeature(feature) {
            const bounds = this.getFeatureBounds(this.$store.getters['map/getFeaturesById'](feature.properties.id))
            const paddingBottomRight = [this.$store.getters['sidebarInfo/collapsed'] ? 0 : 550, 0 ]
            const paddingTopLeft = [this.$store.getters['sidebarSearch/collapsed'] ? 0 : 350, 0 ]

            // this.mapObject.fitBounds(bounds, {
            this.mapObject.fitBounds(bounds, {
                paddingTopLeft: paddingTopLeft,
                paddingBottomRight: paddingBottomRight,
                easeLinearity: 1,
                maxZoom: 18,
            });
        },
        getFeatureBounds(features) {
            let latLngs = [];
            let coords = [];

            if ( Array.isArray(features) ) {
                features.map( function(feature) {
                    switch(feature.geometry.type) {
                        case 'Point':
                            coords = coords.concat([feature.geometry.coordinates])
                            break
                        case 'LineString':
                            coords = coords.concat(feature.geometry.coordinates)
                            break
                        case 'Polygon':
                        case 'MultiLineString':
                            coords = coords.concat(feature.geometry.coordinates.flat())
                            break
                        case 'MultiPolygon':
                            coords = coords.concat(feature.geometry.coordinates.flat(2))
                    }
                })
                latLngs = L.GeoJSON.coordsToLatLngs(coords)
            } else {
                latLngs = features.geometry.type === 'Point' ? [ L.GeoJSON.coordsToLatLng(features.geometry.coordinates) ] : L.GeoJSON.coordsToLatLngs(features.geometry.coordinates.flat())
            }
            
            return L.latLngBounds(latLngs)
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
                        layer.setStyle(this.getGeometryStyle(layer.feature));
                    })
                }
                // todo: update point styles (this is incorrect)
                if (this.$refs?.points) {
                    this.$refs.points[0].mapObject.eachLayer((layer) => {
                        if (placeIds.length && !placeIds.includes(layer.feature.properties.id)) {
                            return
                        }
                        if ( this.highlightedFeatureIds.includes(layer.feature.properties.id) ) {
                            layer._icon.classList.add('icon--selected')
                        } else {
                            layer._icon.classList.remove('icon--selected')
                        }
                        // layer.setStyle(this.getPointStyle(layer.feature));
                    })
                }
            })
        },
        /* get geometry classes */
        getGeometryClasses(feature) {
            let highlight = this.highlightedFeatureIds.includes(feature.properties.id);
            let classes = feature.properties.placeType.map(i => 'geometry geometry--' + i)
            if (highlight) {
                classes.push('geometry--highlight')
            }
            return classes
        },
        getIconClasses(placeType) {
            return ['icon', 'icon--' + placeType.id]
        },
        /* get geometry style */
        getGeometryStyle(feature) {
            const isHighlighted = this.highlightedFeatureIds.includes(feature.properties.id);
            const isSearched = this.filterSearchIds.includes(feature.properties.id);
            const isPolygon = ['Polygon', 'MultiPolygon'].includes(feature.geometry.type);

            const configs = {
                default: {
                    fillColor: 'rgb(0 0 0)',
                    fillOpacity: 0,
                    // color: 'rgb(0 128 182)',
                    color: 'rgb(0 0 0)',
                    opacity: 0.05,
                    weight: isPolygon ? 2 : this.zoom < 17 ? 4 : Math.ceil(2 ^ (this.zoom - 16) * 4 ),
                    className: this.getGeometryClasses(feature).join(' '),
                    stroke: isPolygon ? false : this.zoom >= 15
                },
                searched: {
                    fillOpacity: 0.2,
                    // fillColor: 'rgb(237 71 74)',
                    fillColor: 'rgb(3 69 97)',
                    // color: 'rgb(237 71 74)',
                    color: 'rgb(3 69 97)',
                    opacity: 0.4,
                    stroke: !isPolygon,
                    weight: isPolygon ? 1.5 : this.zoom < 17 ? 4 : Math.ceil(2 ^ (this.zoom - 16) * 4 ),
                },
                highlighted: {
                    fillColor: 'rgb(3 69 97)',
                    fillOpacity: 0.4,
                    // color: 'rgb(3 69 97)',
                    color: 'rgb(237 71 74)',
                    opacity: 0.7,
                    // stroke: !isPolygon,
                    stroke: true,
                    strokeWidth: 2,
                }
            }

            let config = configs.default;
            if ( isSearched ) {
                config = { ...config, ...configs.searched }
            }
            if ( isHighlighted ) {
                config = { ...config, ...configs.highlighted }
            }

            return config;
        },
        /* get point style */
        getPointStyle(feature) {
            let isHighlighted = this.highlightedFeatureIds.includes(feature.properties.id);
            return {
                size: isHighlighted ? [44,44] : [40,40]
            }
        },

    },

    created() {
        const me = this

        // add geojson point layer
        if ( this.layers.filter( layer => layer.id === 'geometries').length === 0 ) {
            this.layers.push(
                {
                    id: 'geometries',
                    type: 'geojsonLayer',
                    zIndex: 1000,
                    options: {
                        geojson: this.geometries,
                        options: {
                            onEachFeature: this.onEachFeature,
                            style: this.getGeometryStyle,
                        }
                    }
                }
            )
        }

        // add geojson geometry layer
        if ( this.layers.filter( layer => layer.id === 'points').length === 0 ) {
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
                                        icon: me.icons[feature.properties.placeType[0]],
                                        riseOnHover: true
                                    })
                                }
                                // placeType unknown, display default icon
                                return L.marker(latlng, {
                                    title: feature.properties.title,
                                    icon: L.icon(iconDefaults),
                                    riseOnHover: true
                                })
                            }
                        }
                    }
                }
            )
        }

    },
}
</script>
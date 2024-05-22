<template>
    <div id="app" class="d-flex flex-column vw-100 dvh-100" :class="themeClass">

        <gm-navbar :title="title" class="app__navbar"></gm-navbar>

        <div class="app__main">
            <gm-map
                :class="{ 'sidebar-left-open': !this.$store.state.sidebarSearch.collapsed, 'sidebar-right-open': !this.$store.state.sidebarInfo.collapsed }"
                :layers="layers"
                :featureClass="featureClass"
                :featureStyle="featureStyle"
                :debug="true"
                :zoom="zoom"
                :bounds="bounds"
                :center="center"
                :refresh-features="$store.getters['map/getFeaturesToRedraw']"
                :maxZoom="18"
                :visible-feature-ids="visibleFeatureIds"
                @featureMouseEnter="onFeatureMouseEnter"
                @featureMouseLeave="onFeatureMouseLeave"
                @featureSelect="onFeatureSelect"
                @updateZoom="onUpdateZoom"
                @updateBounds="onUpdateBounds"
                @updateCenter="onUpdateCenter"
                @mapReady="onMapReady"
            >
                <!--        :layers="$store.getters['map/getLayers']"-->
                <template v-slot:controls-topleft>
                </template>
            </gm-map>

            <gm-sidebar id="sidebar__search" collapsible position="left" store_namespace="sidebarSearch" title="Zoeken">
                <gm-search-places></gm-search-places>
            </gm-sidebar>
            <gm-sidebar id="sidebar__maps" collapsible position="left" store_namespace="sidebarMaps"
                        title="Kaart opties">
                <div class="scrollable scrollable--vertical">
                    <gm-layer-panel></gm-layer-panel>
                </div>
            </gm-sidebar>

            <gm-sidebar id="sidebar__filters" collapsible position="left" store_namespace="sidebarFilters"
                        title="Plaatstype">
                <div class="scrollable scrollable--vertical">
                    <gm-place-type-filter></gm-place-type-filter>
                </div>
            </gm-sidebar>

            <gm-sidebar id="sidebar__projects" collapsible position="left" store_namespace="sidebarProjects"
                        title="Gent Gezien">
                <div class="scrollable scrollable--vertical">
                    <gm-project-panel></gm-project-panel>
                </div>
            </gm-sidebar>

            <gm-sidebar id="sidebar__viewer" collapsible position="left" store_namespace="sidebarViewer">
                <gm-iiif-manifest-viewer
                    :manifest-url="$store.getters['iiifViewer/getManifestUrl']"></gm-iiif-manifest-viewer>
            </gm-sidebar>

            <gm-sidebar id="sidebar__place" collapsible position="right" store_namespace="sidebarInfo">
                <gm-place-info></gm-place-info>
            </gm-sidebar>

        </div>

        <gm-footer></gm-footer>

        <gm-modal-root/>

        <div v-if="$store.getters['openRequests']" class="loading-overlay">
            <div class="spinner"/>
        </div>
    </div>
</template>

<script>
import GmNavbar from "./js/components/GmNavbar";
import GmSidebar from "./js/components/GmSidebar";
import GmMap from "./js/components/GmMap";
import GmPlaceInfo from "./js/components/GmPlaceInfo";
import GmModalRoot from "./js/components/GmModalRoot";
import GmIiifManifestViewer from "./js/components/GmIiifManifestViewer";

import GmSearchPlaces from "./js/components/search/GmSearchPlaces";
import GmPlaceTypeFilter from "./js/components/filters/GmPlaceTypeFilter";
import GmLayerPanel from "./js/components/layers/GmLayerPanel";
import GmProjectPanel from "./js/components/projects/GmProjectPanel";
import GmYearFilter from "./js/components/filters/GmYearFilter.vue";
import GmFooter from "./js/components/GmFooter.vue";

export default {
    name: "App",
    components: {
        GmFooter,
        GmYearFilter,
        GmPlaceTypeFilter,
        'gm-navbar': GmNavbar,
        'gm-sidebar': GmSidebar,
        'gm-search-places': GmSearchPlaces,
        'gm-place-info': GmPlaceInfo,
        'gm-map': GmMap,
        'gm-modal-root': GmModalRoot,
        GmIiifManifestViewer,
        GmLayerPanel,
        GmProjectPanel,
    },
    data() {
        return {
            title: process.env.TITLE,
            filters: {
                year: 2022
            }
        }
    },
    computed: {
        themeClass() {
            return this.$store.getters['project/isDefaultProject'] ? 'theme--default' : 'theme--blikken'
        },
        isSAD() {
            return process.env.IS_SAD === 'true'
        },
        highlightedIds() {
            return this.$store.getters['map/getHighlightedFeatures'].map(i => i.properties.id)
        },
        /* geojson */
        geojson() {
            return this.$store.getters['map/getGeoJSONData'];
        },
        points() {
            let features = this.geojson?.features ?? []
            const that = this
            let ret = {
                type: 'FeatureCollection',
                features: features.filter(function (item) {
                    return item.geometry.type === 'Point' && !item.properties.placeType.includes('straat')
                        // && that.visibleFeatureIds.has(item.properties.id);
                })
            };
            return ret
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
        sidebarInfoCollapsed() {
            return this.$store.getters["sidebarInfo/collapsed"]
        },
        sidebarSearchCollapsed() {
            return this.$store.getters["sidebarSearch/collapsed"]
        },
        layers() {
            const extras = [
                {
                    id: 'gentgemapt-v1',
                    label: 'Gent Gemapt basiskaart',
                    type: 'tileLayer',
                    options: {
                        url: 'https://maps.ghentcdh.ugent.be/GentGemapt/v1/{z}/{x}/{y}.png',
                        attribution: '<a href="https://www.maptiler.com/copyright/" target="_blank">© MapTiler</a> <a href="https://www.openstreetmap.org/copyright" target="_blank">© OpenStreetMap contributors</a>',
                        maxZoom: 18,
                        visible: true,
                        opacity: 1,
                        layerType: 'base',
                        zIndex: 10,
                    }
                },
                {
                    id: 'google-satellite',
                    type: 'tileLayer',
                    label: 'Google satelliet',
                    options: {
                        url: 'https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}',
                        attribution: '© Google',
                        maxZoom: 18,
                        visible: false,
                        opacity: 1,
                        layerType: 'base',
                        zIndex: 10,
                    }
                },

                // {
                //     id: 'geojson',
                //     type: 'geoJsonLayer',
                //     zIndex: 1000,
                //     options: {
                //         geojson: this.geojson,
                //         options: {
                //             // pane: 'custom',
                //             style: this.featureStyle,
                //         }
                //     }
                // },

                // {
                //     id: 'allmaps',
                //     type: '_warpedMapLayer',
                //     options: {
                //         url: 'https://annotations.allmaps.org/images/0d17b31e4b32aa8a',
                //         options: {
                //             opacity: 1,
                //             visible: true
                //         },
                //         maxZoom: 18,
                //         minZoom: 10
                //     }
                // },
                // {
                //     id: 'geometries',
                //     type: 'geoJsonLayer',
                //     zIndex: 1000,
                //     options: {
                //         geojson: this.geometries,
                //         options: {
                //             // pane: 'custom',
                //             style: this.featureStyle,
                //         },
                //         maxZoom: 18,
                //         minZoom: 10
                //     }
                // },
                {
                    id: 'points',
                    type: 'geoJsonLayer',
                    zIndex: 1000,
                    options: {
                        geojson: this.points,
                        clusterMarkers: true,
                        options: {
                            // pane: 'custom',
                            style: this.featureStyle,
                        },
                        maxZoom: 18,
                        minZoom: 10
                    }
                },
            ]
            return extras
            // return [...this.$store.getters["map/getLayers"], ...extras]
        },
        center() {
            return this.$store.getters['map/getCenter'];
        },
        zoom() {
            return this.$store.getters['map/getZoom'];
        },
        bounds() {
            return this.$store.getters['map/getBounds'];
        },
        visibleFeatures() {

        },
        visibleFeatureIds() {
            if (!this.geojson) return new Set();
            const ids = this.geojson.features.filter( feature => this.featureIsVisible(feature) ).map( feature => feature.properties.id )
            return (new Set(ids))
        },
        activePlaceTypeIds() {
            return new Set(this.$store.getters['featureFilters/getPlaceTypes'].filter( i => i.active).map( i => i.id ))
        },
        inactivePlaceTypeIds() {
            return new Set(this.$store.getters['featureFilters/getPlaceTypes'].filter( i => !i.active).map( i => i.id ))
        }
    },
    watch: {
        sidebarInfoCollapsed(isCollapsed) {
            if ( isCollapsed ) {
                this.$store.dispatch('sidebarViewer/collapse')
            }
        },
        sidebarSearchCollapsed(isCollapsed) {
            if ( isCollapsed ) {
                this.$store.dispatch('featureFilters/resetSearch')
            }
        },
        // visibleFeatureIds(current, previous) {
        //     if (previous === null) {
        //         return
        //     }
        //     const left = Array.from(current).filter(id => !previous.has(id))
        //     const right = Array.from(previous).filter(id => !current.has(id))
        //
        //     this.$store.dispatch('map/redrawFeatures', [...left, ...right])
        // },

    },
    methods: {
        featureIsVisible(feature) {
            // item in search?
            // search overrules all filters
            const search = this.$store.getters['featureFilters/getSearch']
            if ( search.length && !search.includes(feature.properties.id) ) {
                return false
            }

            // filters by year and placeType
            const year = this.$store.getters['featureFilters/getYear']
            if ( year < (feature.properties?.startDate ?? 0) || year > (feature.properties?.endDate ?? 10000) ) {
                return false
            }

            // const placeTypes = this.$store.getters['featureFilters/getPlaceTypes']
            // const isPlaceTypeOtherAllowed = placeTypes.filter( i => i.active ).filter( i => i.id === 'andere_plaats').length > 0

            // if ( !(isPlaceTypeOtherAllowed && item.properties.placeType.length === 0) ) {
            // return false
            // }

            if ( this.inactivePlaceTypeIds.size ) {
                return ( feature.properties.placeType.filter( type => this.activePlaceTypeIds.has(type)).length > 0 )
            }

            return true
        },
        featureStatus(feature) {
            const search = this.$store.getters['featureFilters/getSearch']

            let status = {
                visible: this.featureIsVisible(feature),
                selected: this.$store.getters['map/getSelectedFeature'] === feature.properties.id,
                searched: search.includes(feature.properties.id),
                highlighted: this.highlightedIds.includes(feature.properties.id),
            }
            return status
        },
        featureClass(feature) {
            let status = this.featureStatus(feature)

            // calculate class
            let _classes = ['leaflet-interactive feature']
            if (feature.properties?.placeType) {
                _classes.push(...feature.properties.placeType.map( id => 'feature--' + id ))
            }
            if (feature?.geometry?.type) {
                _classes.push('geometry--' + feature?.geometry?.type.toLowerCase())
            }
            if (!status.visible) {
                _classes.push('feature--hidden')
            }
            if (status.selected) {
                _classes.push('feature--selected')
            }
            if (status.highlighted) {
                _classes.push('feature--focused')
            }

            return _classes.join(' ')
        },
        featureStyle(feature) {
            if (['Point', 'MultiPoint'].includes(feature.geometry.type)) {
                return {}
            }

            const status = this.featureStatus(feature)

            const isHighlighted = status.highlighted;
            const isSearched = status.searched;
            const isPolygon = ['Polygon', 'MultiPolygon'].includes(feature.geometry.type);


            const configs = {
                default: {
                    fillColor: 'rgb(0 0 0)',
                    fillOpacity: 0,
                    // color: 'rgb(0 128 182)',
                    color: 'rgb(0 0 0)',
                    opacity: 0.05,
                    weight: isPolygon ? 2 : this.zoom < 17 ? 4 : Math.ceil(2 ^ (this.zoom - 16) * 4 ),
                    className: this.featureClass(feature), //this.getGeometryClasses(feature).join(' '),
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
        // todo: update via prop!
        _onFeatureFocus(feature) {

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

        // focusedFeature() {
        //     return this.$store.getters['map/getFocusedFeature']
        // }
        onUpdateZoom(payload) {
            this.$store.dispatch('map/setZoom', payload)
        },
        onUpdateCenter(payload) {
            this.$store.dispatch('map/setCenter', payload)
        },
        onUpdateBounds(payload) {
            this.$store.dispatch('map/setBounds', payload)
        },
        onFeatureMouseEnter({feature, layer}) {
            this.$store.dispatch('map/highlightFeature', {feature: feature})
        },
        onFeatureMouseLeave({feature, layer}) {
            this.$store.dispatch('map/unhighlightFeature', {feature: feature})
        },
        onFeatureSelect({feature, layer, map}, event) {
            this.$store.dispatch('map/selectFeature', {feature: feature})
            this.$store.dispatch('sidebarInfo/collapse', false)

            // to make sure the marker/geometry is visible after the sidebar opens,
            // we pan the map to the left by some amount
            if ( window.innerWidth >= 992 ) {
                const containerWidth = document.getElementsByClassName('leaflet-container')[0].offsetWidth;
                const sidebarWidth = 550;
                const markerXPos = event.containerPoint.x;
                if (markerXPos > containerWidth - sidebarWidth) {
                    // this.mapObject.panBy([markerXPos - (containerWidth - sidebarWidth) + 200, 0]);
                    map.panBy([markerXPos - (containerWidth - sidebarWidth) / 2 , 0]);
                }
            }
        },
        onMapReady(mapObject) {
        }
    },
    created() {
        // init application
        this.$store.dispatch('initApplication')
    },
}
</script>

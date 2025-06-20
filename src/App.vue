<template>
    <div id="app" class="vw-100 dvh-100"
         :class="themeClass"
         :style="themeVariables"
    >
        <div v-if="$store.getters['isError']" class="mx-auto">
            <span class="alert alert-danger">{{ $store.getters['getErrorMessage'] }}</span>
        </div>

        <div v-if="!$store.getters['isError']" class="d-flex flex-column w-100 h-100">
            <gm-navbar class="app__navbar"></gm-navbar>

            <div class="app__main">
                <gm-map
                    :class="{ 'sidebar-left-open': !this.$store.state.sidebarSearch.collapsed, 'sidebar-right-open': !this.$store.state.sidebarInfo.collapsed }"
                    :layers="this.$store.getters['map/getLayers']"
                    :markers="this.$store.getters['map/points']"
                    :geometries="this.$store.getters['map/geometries']"
                    :featureClass="featureClass"
                    :featureStyle="featureStyle"
                    :debug="this.$store.state.debug"
                    :zoom="this.$store.getters['map/getZoom']"
                    :bounds="this.$store.getters['map/getBounds']"
                    :center="this.$store.getters['map/getCenter']"
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
                    <gm-place-info :place="$store.getters['poi/getPlace']" v-if="$store.getters['poi/getPlace']"></gm-place-info>
                </gm-sidebar>
            </div>

            <gm-footer></gm-footer>

            <gm-modal-root/>
        </div>

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
    name: "app",
    components: {
        GmFooter,
        GmYearFilter,
        GmPlaceTypeFilter,
        GmNavbar,
        GmSidebar,
        GmSearchPlaces,
        GmPlaceInfo,
        GmMap,
        GmModalRoot,
        GmIiifManifestViewer,
        GmLayerPanel,
        GmProjectPanel,
    },
    data() {
        return {
            filters: {
                year: 2022
            },
          mapObject: null, // will be set by the map component
        }
    },
    computed: {
        themeVariables() {
            return this.$store.getters['theme/getThemeVariables']
        },
        themeClass() {
            return this.$store.getters['project/isDefaultProject'] ? 'theme--default' : 'theme--default' // todo: still needed?
        },
        highlightedIds() {
            return this.$store.getters['map/getHighlightedFeatures'].filter( i => i?.properties?.id).map(i => i.properties.id)
        },
        sidebarInfoCollapsed() {
            return this.$store.getters["sidebarInfo/collapsed"]
        },
        sidebarSearchCollapsed() {
            return this.$store.getters["sidebarSearch/collapsed"]
        },
        visibleFeatureIds() {
            const geojson = this.$store.getters['map/getPlaces']
            if (!geojson) return new Set();
            const ids = geojson.features.filter( feature => this.featureIsVisible(feature) ).map( feature => feature.properties.id )
            return (new Set(ids))
        },
        activePlaceTypeIds() {
            return new Set(this.$store.getters['featureFilters/getPlaceTypes'].filter( i => i.active).map( i => i.id ))
        },
        inactivePlaceTypeIds() {
          return new Set(this.$store.getters['featureFilters/getPlaceTypes'].filter(i => !i.active).map(i => i.id))
        },
        focusedFeature() {
            return this.$store.getters['map/getFocusedFeature']
        }
    },
    watch: {
      sidebarInfoCollapsed(isCollapsed) {
        if (isCollapsed) {
          this.$store.dispatch('sidebarViewer/collapse')
        }
      },
      sidebarSearchCollapsed(isCollapsed) {
        if (isCollapsed) {
          this.$store.dispatch('featureFilters/resetSearch')
        }
      },
      focusedFeature(feature) {
        if (feature) {
          this.focusFeature(feature)
        }
      },
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
            const zoom = this.$store.getters['map/getZoom']

            const configs = {
                default: {
                    fillColor: 'rgb(0 0 0)',
                    fillOpacity: 0,
                    color: 'rgb(0 0 0)',
                    // opacity: 0.1,
                    opacity: 0.05 + (zoom - 14) * 0.05,
                    weight: isPolygon ? 2 : zoom < 17 ? 4 : Math.ceil(2 ^ (zoom - 16) * 4 ),
                    className: this.featureClass(feature), //this.getGeometryClasses(feature).join(' '),
                    // stroke: isPolygon ? false : zoom >= 15
                    stroke: true,
                },
                searched: {
                    fillOpacity: 0.2,
                    // fillColor: 'rgb(237 71 74)',
                    fillColor: 'rgb(3 69 97)',
                    // color: 'rgb(237 71 74)',
                    color: 'rgb(3 69 97)',
                    opacity: 0.4,
                    stroke: !isPolygon,
                    weight: isPolygon ? 1.5 : zoom < 17 ? 4 : Math.ceil(2 ^ (this.zoom - 16) * 4 ),
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
        focusFeature(feature) {

            const layer = L.geoJSON(feature);
            const bounds = layer.getBounds();
            const center = bounds.getCenter();
            const paddingBottomRight = [this.$store.getters['sidebarInfo/collapsed'] ? 0 : 550, 0 ]
            const paddingTopLeft = [this.$store.getters['sidebarSearch/collapsed'] ? 0 : 350, 0 ]

            this.mapObject.fitBounds(bounds, {
                paddingTopLeft: paddingTopLeft,
                paddingBottomRight: paddingBottomRight,
                easeLinearity: 1,
                maxZoom: 16,
            });
        },

        /** map events **/
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
            if (['place', 'story'].includes(feature?.properties?.type)) {
                this.$store.dispatch('map/highlightFeature', {feature: feature})
            }
        },
        onFeatureMouseLeave({feature, layer}) {
            if (['place', 'story'].includes(feature?.properties?.type)) {
                this.$store.dispatch('map/unhighlightFeature', {feature: feature})
            }
        },
        onFeatureSelect({feature, layer, map}, event) {
            if (!['place', 'story'].includes(feature?.properties?.type)) {
                return
            }

            this.$store.dispatch('selectPlace', { placeId: feature.properties.id })

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
          this.mapObject = mapObject;
        }
    },
    created() {
      // add a popstate event listener to handle back/forward navigation
      window.addEventListener('popstate', (event) => {
        this.$store.dispatch('updateStateFromUrl')
      })

      // init application
      this.$store.dispatch('initApplication')
    }
}
</script>

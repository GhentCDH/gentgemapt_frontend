<template>
  <div id="app" class="d-flex flex-column w-100 h-100">

    <gm-navbar :title="title" class="app__navbar"></gm-navbar>

    <div class="app__main">
      <gm-map
        :class="{ 'sidebar-left-open': !this.$store.state.sidebarSearch.collapsed, 'sidebar-right-open': !this.$store.state.sidebarInfo.collapsed }"
        :geojson="geojson"
        :layers="$store.getters['map/getLayers']"
      >
        <template v-slot:controls-topleft>
        </template>
      </gm-map>

      <gm-sidebar id="sidebar__search" collapsible position="left" store_namespace="sidebarSearch" title="Zoeken">
        <gm-search-places></gm-search-places>
      </gm-sidebar>
      <gm-sidebar id="sidebar__maps" collapsible position="left" store_namespace="sidebarMaps" title="Kaart opties">
        <div class="scrollable scrollable--vertical">
          <gm-layer-panel></gm-layer-panel>
        </div>
      </gm-sidebar>

      <gm-sidebar id="sidebar__filters" collapsible position="left" store_namespace="sidebarFilters" title="Plaatstype">
        <div class="scrollable scrollable--vertical">
          <gm-place-type-filter></gm-place-type-filter>
        </div>
      </gm-sidebar>

      <gm-sidebar id="sidebar__viewer" collapsible position="left" store_namespace="sidebarViewer">
        <gm-iiif-manifest-viewer :manifest-url="$store.getters['iiifViewer/getManifestUrl']"></gm-iiif-manifest-viewer>
      </gm-sidebar>

      <gm-sidebar id="sidebar__place" collapsible position="right" store_namespace="sidebarInfo">
        <gm-place-info></gm-place-info>
      </gm-sidebar>

    </div>

    <div v-if="!isSAD" class="app__footer d-flex bg-dark">
    </div>

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
import UrlPattern from "url-pattern";

export default {
    name: "App",
    components: {
        GmPlaceTypeFilter,
        'gm-navbar': GmNavbar,
        'gm-sidebar': GmSidebar,
        'gm-search-places': GmSearchPlaces,
        'gm-place-info': GmPlaceInfo,
        'gm-map': GmMap,
        'gm-modal-root': GmModalRoot,
        GmIiifManifestViewer,
        GmLayerPanel,
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
        isSAD() {
            return process.env.IS_SAD === 'true'
        },
        geojson() {
            const geojson = this.$store.getters['map/getGeoJSONData']
            const year = this.$store.getters['featureFilters/getYear']
            const placeTypes = this.$store.getters['featureFilters/getPlaceTypes']
            const hiddenPlaceTypes = placeTypes.filter( i => !i.active ).map( i => i.id )
            const search = this.$store.getters['featureFilters/getSearch']

            let features = geojson?.features ?? []

            if ( process.env.IS_SAD === "true") {
                return geojson
            }

            return {
                type: 'FeatureCollection',
                features: features.filter( function(item) {
                    // search overrules all filters
                    if ( search.length ) {
                        return search.includes(item.properties.id)
                    }
                    // filters by year and placeType
                    return ((item.properties?.startDate ?? 0) <= year && (item.properties?.endDate ?? 10000) >= year) &&
                    (item.properties.placeType.length === 0 || hiddenPlaceTypes.length === 0 || item.properties.placeType.filter( type => !hiddenPlaceTypes.includes(type)).length )
                })
            };
        },
        sidebarInfoCollapsed() {
            return this.$store.getters["sidebarInfo/collapsed"]
        },
        sidebarSearchCollapsed() {
            return this.$store.getters["sidebarSearch/collapsed"]
        },
    },
    watch: {
        sidebarInfoCollapsed(isCollapsed) {
            if ( isCollapsed ) {
                this.$store.dispatch('sidebarViewer/collapse')
            }
        },
        sidebarSearchCollapsed(isCollapsed) {
            if ( isCollapsed ) {
                this.$store.commit('featureFilters/resetSearch')
            }
        }
    },
    created() {
        // collapse info window
        this.$store.dispatch('sidebarInfo/collapse')
        this.$store.dispatch('sidebarViewer/collapse')
        this.$store.dispatch('sidebarSearch/collapse')
        this.$store.dispatch('sidebarMaps/collapse')
        this.$store.dispatch('sidebarFilters/collapse')
        this.$store.dispatch('sidebarTimeline/collapse')

        // load geojson data
        this.$store.dispatch('map/loadGeoJSONData').then( (result) => {
            // url refers to place id?
            const PlaceUrlPattern = new UrlPattern('/plaats/:id')
            const matchResult = PlaceUrlPattern.match(window.location.pathname)
            if (matchResult) {
                this.$store.dispatch('map/selectFeature', {id: matchResult.id})
            }
        });
    },
}
</script>

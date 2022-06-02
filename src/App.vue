<template>
    <div id="app" class="d-flex flex-column w-100 h-100">

        <gm-navbar class="app__navbar" :title="title"></gm-navbar>

        <div class="app__main">
            <gm-map :layers="$store.getters['map/getLayers']"
                    :class="{ 'sidebar-left-open': !this.$store.state.sidebarSearch.collapsed, 'sidebar-right-open': !this.$store.state.sidebarInfo.collapsed }"
                    :geojson="geojson"
            >
                <template v-slot:controls-topleft>
                        <button class="control__button" @click="$store.dispatch('sidebarSearch/toggle', { property: 'collapsed' })">
                            <img :src="require('@/images/icons/search.svg')">
                        </button>
                        <button class="control__button" @click="$store.dispatch('sidebarMaps/toggle', { property: 'collapsed' })">
                            <img :src="require('@/images/icons/layers.svg')">
                        </button>
                        <button class="control__button" @click="$store.dispatch('sidebarFilters/toggle', { property: 'collapsed' })">
                            <img :src="require('@/images/icons/sliders-h.svg')">
                        </button>
                        <button class="control__button" @click="$store.dispatch('sidebarTimeline/toggle', { property: 'collapsed' })">
                            <img :src="require('@/images/icons/calendar.svg')">
                        </button>
                </template>
            </gm-map>

            <gm-sidebar id="sidebar__search" position="left" collapsible store_namespace="sidebarSearch">
                <gm-search-places></gm-search-places>
            </gm-sidebar>
            <gm-sidebar id="sidebar__maps" position="left" collapsible store_namespace="sidebarMaps" title="Kaart opties">
                <div class="scrollable scrollable--vertical">
                    <h2>Basiskaarten</h2>
                    <div class="maplist maplist--base">
                        <template v-for="layer in baseLayers">
                            <gm-layer-option :layer="layer"></gm-layer-option>
                        </template>
                    </div>
                    <h2>Kaartlagen</h2>
                    <div class="maplist maplist--overlay">
                        <template v-for="layer in overlayLayers">
                            <gm-layer-option :layer="layer"></gm-layer-option>
                        </template>
                    </div>
                </div>
            </gm-sidebar>
            <gm-sidebar id="sidebar__filters" position="left" collapsible store_namespace="sidebarFilters">
            </gm-sidebar>
            <gm-sidebar id="sidebar__timeline" position="left" collapsible store_namespace="sidebarTimeline">
                <vue-slider v-model="filters.year" direction="btt" :width="20" :height="400" :min="600" :max="2022" :process="false" :tooltip="'always'" :marks="range(500, 2100, 100)" :silent="true"></vue-slider>
            </gm-sidebar>
            <gm-sidebar id="sidebar__viewer" position="left" collapsible store_namespace="sidebarViewer">
                <gm-iiif-manifest-viewer :manifest-url="$store.getters['iiifViewer/getManifestUrl']"></gm-iiif-manifest-viewer>
            </gm-sidebar>
            <gm-sidebar id="sidebar__place" position="right" collapsible store_namespace="sidebarInfo">
                <gm-place-info></gm-place-info>
            </gm-sidebar>

        </div>

        <div v-if="!isSAD" class="app__footer d-flex bg-dark">
        </div>

        <gm-modal-root/>
    </div>
</template>

<script>
import GmNavbar from "./js/components/GmNavbar";
import GmSidebar from "./js/components/GmSidebar";
import GmSearchPlaces from "./js/components/GmSearchPlaces";
import GmMap from "./js/components/GmMap";
import GmPlaceInfo from "./js/components/GmPlaceInfo";
import GmModalRoot from "./js/components/GmModalRoot";
import GmIiifManifestViewer from "./js/components/GmIiifManifestViewer";
import GmLayerOption from "./js/components/GmLayerOption";

import VueSlider from 'vue-slider-component';

import {FontAwesomeIcon} from '@fortawesome/vue-fontawesome';

import {library} from '@fortawesome/fontawesome-svg-core'
import {faSearch} from '@fortawesome/free-solid-svg-icons'

library.add(faSearch)

import api from "./js/config/constants";

export default {
    name: "App",
    components: {
        'gm-navbar': GmNavbar,
        'gm-sidebar': GmSidebar,
        'gm-search-places': GmSearchPlaces,
        'gm-place-info': GmPlaceInfo,
        'gm-map': GmMap,
        'gm-modal-root': GmModalRoot,
        'gm-layer-option': GmLayerOption,
        GmIiifManifestViewer,
        VueSlider,
        'font-awesome-icon': FontAwesomeIcon
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
        baseLayers() {
            return this.$store.getters["map/getLayers"].filter( item => item.options?.layerType === 'base' )
        },
        overlayLayers() {
            return this.$store.getters["map/getLayers"].filter( item => item.options?.layerType === 'overlay' )
        },
        geojson() {
            let geojson = this.$store.getters['map/getGeoJSONData']
            let features = geojson?.features ?? []

            if ( process.env.IS_SAD === "true") {
                return geojson
            }

            return {
                type: 'FeatureCollection',
                features: features.filter( item =>
                    (item.properties?.startDate ?? 0) <= this.filters.year && (item.properties?.endDate ?? 10000) >= this.filters.year
                )
            };
        },
        sidebarInfoCollapsed() {
            return this.$store.getters["sidebarInfo/collapsed"]
        }
    },
    watch: {
        sidebarInfoCollapsed(newVal, oldVal) {
            if ( newVal ) {
                this.$store.dispatch('sidebarViewer/collapse')
            }
        }
    },
    methods: {
        range(start, stop, step = 1) {
            return Array(Math.ceil((stop - start) / step)).fill(start).map((x, y) => x + y * step)
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
        this.$store.dispatch('map/loadGeoJSONData');
    },
}
</script>

<style scoped lang="scss">
</style>
<template>
    <div id="app" class="d-flex flex-column w-100 h-100">

        <gm-navbar class="app__navbar" :title="title"></gm-navbar>

        <div class="app__main">
            <gm-map :layers="layers"
                    :class="{ 'sidebar-left-open': !this.$store.state.sidebarSearch.collapsed, 'sidebar-right-open': !this.$store.state.sidebarInfo.collapsed }"
                    :geojson="geojson"
            ></gm-map>

            <gm-sidebar id="sidebar__search" position="left" collapsible store_namespace="sidebarSearch">
                <gm-search-places></gm-search-places>
            </gm-sidebar>
            <gm-sidebar id="sidebar__viewer" position="left" collapsible store_namespace="sidebarViewer">
                <gm-iiif-manifest-viewer :manifest-url="$store.getters['iiifViewer/getManifestUrl']"></gm-iiif-manifest-viewer>
            </gm-sidebar>
            <gm-sidebar id="sidebar__place" position="right" collapsible store_namespace="sidebarInfo">
                <gm-place-info></gm-place-info>
            </gm-sidebar>

        </div>

        <div class="app__filters d-flex bg-dark">
            <div class="row">
                <div class="filter--timeslider col-md-4">
                    <vue-slider v-model="filters.year" width="100%" :min="600" :max="2022" :process="false" :tooltip="'always'" :marks="range(500, 2100, 100)" :silent="true"></vue-slider>
                </div>
            </div>
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

import VueSlider from 'vue-slider-component';


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
        GmIiifManifestViewer,
        VueSlider,
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
        geojson() {
            let geojson = this.$store.getters['map/getGeoJSONData']
            let features = geojson?.features ?? []
            return {
                type: 'FeatureCollection',
                features: features.filter( item =>
                    (item.properties?.startDate ?? 0) <= this.filters.year && (item.properties?.endDate ?? 10000) >= this.filters.year
                )
            };
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

        // load geojson data
        this.$store.dispatch('map/loadGeoJSONData');

        console.log(process.env.MAP_LAT)
    },
}
</script>

<style scoped lang="scss">
</style>
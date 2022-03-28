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
            layers: [
                {
                    id: 'mapbox-v1',
                    type: 'tileLayer',
                    options: {
                        url: 'https://api.mapbox.com/styles/v1/sysadmin-ghentcdh/ckk5uzofh03s517pd44ucjk61/tiles/256/{z}/{x}/{y}@2x?access_token=pk.eyJ1Ijoic3lzYWRtaW4tZ2hlbnRjZGgiLCJhIjoiY2trNXR3ZW55MGFxYTJ3bndiZDE0czNpOSJ9.b7hzKcWY7vIOdWNgBl6Wkw',
                        attribution: 'mapbox',
                        maxZoom: 18,
                        name: 'MapBox'
                    }
                },
                {
                    id: 'Gent_CompynSoenenPiscador_1912',
                    type: 'tileLayer',
                    options: {
                        url: 'https://dev.gentgemapt.ugent.be/static/maps/Gent_CompynSoenenPiscador_1912/{z}/{x}/{y}.png',
                        attribution: '',
                        maxZoom: 18,
                        tms: false,
                        visible: false,
                        layerType: 'overlay',
                        name: 'Compyn, Soenen & Piscador, 1912'
                    }
                },
                {
                    id: 'ferraris',
                    type: 'wmsLayer',
                    options: {
                        'base-url': 'https://geoservices.informatievlaanderen.be/raadpleegdiensten/histcart/wms',
                        layers: 'ferraris',
                        transparent: true,
                        opacity: 0.5,
                        format: 'image/png',
                        name: 'Ferraris kaart - Kabinetskaart der Oostenrijkse Nederlanden en het Prinsbisdom Luik, 1771 - 1778',
                        visible: false,
                    }
                },
                {
                    id: 'Gent_Horenbault_1619',
                    type: 'tileLayer',
                    options: {
                        url: 'https://dev.gentgemapt.ugent.be/static/maps/Gent_Horenbault_1619/{z}/{x}/{y}.png',
                        attribution: '',
                        maxZoom: 18,
                        tms: false,
                        visible: false,
                        layerType: 'overlay',
                        name: 'Horenbault, 1619'
                    }
                },
                {
                    id: 'popp',
                    type: 'wmsLayer',
                    options: {
                        'base-url': 'https://geoservices.informatievlaanderen.be/raadpleegdiensten/histcart/wms',
                        layers: 'popp',
                        transparent: true,
                        opacity: 0.5,
                        format: 'image/png',
                        name: 'Popp, Atlas cadastrale parcellaire de la Belgique, 1842 - 1879',
                        visible: false
                    }
                },
                {
                    id: 'vandermaelen',
                    type: 'wmsLayer',
                    options: {
                        'base-url': 'https://geoservices.informatievlaanderen.be/raadpleegdiensten/histcart/wms',
                        layers: 'vandermaelen',
                        transparent: true,
                        opacity: 0.5,
                        format: 'image/png',
                        name: 'Topografische kaart Vandermaelen (1846-1854), Vlaanderen',
                        visible: false
                    }
                },
                {
                    id: 'okzrgb79_90vl',
                    type: 'wmsLayer',
                    options: {
                        'base-url': 'https://geoservices.informatievlaanderen.be/raadpleegdiensten/okz/wms',
                        layers: 'okzrgb79_90vl',
                        transparent: true,
                        opacity: 0.5,
                        format: 'image/png',
                        name: 'Luchtfoto Vlaanderen, zomer 1979-1990 - kleur',
                        visible: false,
                    }
                },
                {
                    id: 'OrthofotoGent1955WebMercator',
                    type: 'wmsLayer',
                    copyright: 'Bron: © Vlaamse overheid, Departement Mobiliteit en Openbare Werken, afdeling Algemene Technische Ondersteuning',
                    options: {
                        'base-url': 'https://geo.gent.be/geoserver/gwc/service/wms',
                        layers: 'SG-E-BasislagenLuchtfotos:OrthofotoGent1955WebMercator',
                        transparent: true,
                        opacity: 0.5,
                        format: 'image/png',
                        name: 'Luchtfoto Gent 1954-1961',
                        visible: false
                    }
                },

                /*
                [{'type':'WMS','url':'https://geoserver.gis.cloud.mow.vlaanderen.be/geoserver/wms?SERVICE=WMS&version=1.3.0&request=GetMap','layers':[{'id':'ato:topokaarten','title':'WMS-map Topografische kaarten Ministerie van Openbare Werken en Wederopbouw, opname 1950 - 1970'}]}]
                 */
                {
                    id: 'ghent-overlay',
                    type: '_geojsonLayer',
                    options: {
                        optionsStyle: {
                            "color": "#093549",
                            "weight": 1,
                            "fillOpacity": .6
                        },
                        // geojson: ghent,
                        options: {
                            invert: true,
                        }
                    }
                },
            ],
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
<template>
    <b-navbar :toggleable="false" type="dark" variant="dark" :sticky="true" fixed="top">

        <b-navbar-nav class="user-select-none px-3">
            <div class="nav-item d-none d-sm-block"  @click="$store.dispatch('sidebarSearch/collapse', false)">
                <img :src="require('@/images/icons/GentGemapt_Search.svg')" alt="Zoeken">
            </div>
            <div class="nav-item d-none d-sm-block" @click="$store.dispatch('sidebarMaps/collapse', false)">
                <img :src="require('@/images/icons/GentGemapt_Layers.svg')" alt="Kaarten">
            </div>
            <div class="nav-item" @click="$store.dispatch('sidebarFilters/collapse', false)">
                <img :src="require('@/images/icons/GentGemapt_Filter.svg')" alt="Filter">
            </div>
            <div class="nav-item d-none d-sm-block" @click="$store.dispatch('sidebarProjects/collapse', false)">
                <img :src="require('@/images/icons/GentGemapt_Blik.svg')" alt="Blikken op Gent">
            </div>
        </b-navbar-nav>

        <b-navbar-brand class="bg-dark navbar-brand--default" v-if="notch">
            <div class="navbar-brand-border-left"></div>
            <div class="navbar-brand-image" >
                <a :href="homepage" target="_blank" v-if="notch">
                    <img :src="$store.getters['theme/getLogo']" :alt="title">
                </a>
            </div>
            <div class="navbar-brand-border-right"></div>
        </b-navbar-brand>

        <b-navbar-brand class="bg-dark d-flex px-3" v-if="!notch">
            <div class="navbar-brand-image mr-5 pt-3 pb-2" >
                <a :href="homepage" target="_blank">
                    <img v-if="logo" :src="logo" :alt="title">
                </a>
            </div>
            <div class="navbar-brand-title pt-3">
                <a :href="homepage" target="_blank">
                    <h1 class="text-white">{{ title }}</h1>
                </a>
            </div>
        </b-navbar-brand>

        <b-navbar-nav class="user-select-none px-3 ml-auto d-none d-sm-flex">
            <gm-year-filter class=""></gm-year-filter>
        </b-navbar-nav>

        <b-navbar-nav class="user-select-none ml-auto px-3 d-sm-none">
            <div class="nav-item" @click="$store.dispatch('sidebarProjects/collapse', false)">
                <img :src="require('@/images/icons/GentGemapt_Blik.svg')" alt="Blikken op Gent">
            </div>
        </b-navbar-nav>
    </b-navbar>
</template>

<script>
import VueSlider from 'vue-slider-component';
import GmYearFilter from "./filters/GmYearFilter";

export default {
    name: "gm-navbar",
    components: {
        GmYearFilter,
        VueSlider
    },
    computed: {
        homepage() {
            return this.$store.getters['project/getActiveProject']?.homepage
        },
        title() {
            return this.$store.getters['project/getActiveProject']?.title
        },
        logo() {
            return this.$store.getters['theme/getLogo']
        },
        notch() {
            return this.$store.getters['theme/getNotch']
        },
    },
    methods: {
        range(start, stop, step = 1) {
            return Array(Math.ceil((stop - start) / step)).fill(start).map((x, y) => x + y * step)
        },
    }
}
</script>

<style scoped>

</style>

<template>
    <b-navbar toggleable="sm" type="dark" variant="dark" :sticky="true" fixed="top">
        <b-navbar-brand>
            <img :src="require('@/images/logo-white.svg')" alt="Gent Gemapt">

            <!--        <div class="brand-spacer brand-spacer__left"></div>-->
            <!--        <div class="brand-image">-->
            <!--        </div>-->
            <!--        <div class="brand-spacer brand-spacer__right"></div>-->
        </b-navbar-brand>
        <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>
        <b-collapse id="nav-collapse" is-nav class="bg-dark">
            <b-navbar-nav class="user-select-none">
                <b-nav-item  @click="$store.dispatch('sidebarSearch/collapse', false)">
                    <img :src="require('@/images/icons/GentGemapt_Search.svg')" alt="Zoeken">
                </b-nav-item>
                <b-nav-item @click="$store.dispatch('sidebarMaps/collapse', false)">
                    <img :src="require('@/images/icons/GentGemapt_Layers.svg')" alt="Kaarten">
                </b-nav-item>
                <b-nav-item @click="$store.dispatch('sidebarFilters/collapse', false)">
                    <img :src="require('@/images/icons/GentGemapt_Filter.svg')" alt="Filter">
                </b-nav-item>
            </b-navbar-nav>
            <gm-year-filter class="ml-auto"></gm-year-filter>
        </b-collapse>
    </b-navbar>
</template>

<script>
import VueSlider from 'vue-slider-component';
import GmYearFilter from "./filters/GmYearFilter";

export default {
    name: "GmNavbar",
    components: {
        GmYearFilter,
        VueSlider
    },
    props: ['title'],
    methods: {
        range(start, stop, step = 1) {
            return Array(Math.ceil((stop - start) / step)).fill(start).map((x, y) => x + y * step)
        },
    }
}
</script>

<style scoped>

</style>
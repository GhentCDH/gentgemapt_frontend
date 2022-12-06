<template>
    <b-navbar toggleable="sm" type="dark" variant="dark">
        <b-navbar-nav class="user-select-none">
            <b-nav-item  @click="$store.dispatch('sidebarSearch/toggle', { property: 'collapsed' })">
                <img :src="require('@/images/icons/GentGemapt_Search.svg')" alt="Zoeken">
            </b-nav-item>
            <b-nav-item @click="$store.dispatch('sidebarMaps/toggle', { property: 'collapsed' })">
                <img :src="require('@/images/icons/GentGemapt_Layers.svg')" alt="Kaarten">
            </b-nav-item>
            <b-nav-item @click="$store.dispatch('sidebarFilters/toggle', { property: 'collapsed' })">
                <img :src="require('@/images/icons/GentGemapt_Filter.svg')" alt="Filter">
            </b-nav-item>
        </b-navbar-nav>
<!--        <b-navbar-nav class="ml-auto">-->
<!--            <b-nav-item>-->
<!--                <vue-slider v-model="filters.year" direction="btt" :width="20" :height="400" :min="600" :max="2022" :process="false" :tooltip="'always'" :marks="range(1400, 2100, 100)" :silent="true"></vue-slider>-->
<!--            </b-nav-item>-->
<!--        </b-navbar-nav>-->
        <b-navbar-brand>
            <img :src="require('@/images/logo-white.svg')" alt="Gent Gemapt">

<!--        <div class="brand-spacer brand-spacer__left"></div>-->
<!--        <div class="brand-image">-->
<!--        </div>-->
<!--        <div class="brand-spacer brand-spacer__right"></div>-->
    </b-navbar-brand>
    <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>
  </b-navbar>
</template>

<script>
export default {
  name: "GmNavbar",
  props: ['title'],
}
</script>

<style scoped>

</style>
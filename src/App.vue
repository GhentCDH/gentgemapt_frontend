<template>
  <div id="app" class="d-flex flex-column w-100 h-100">

    <gm-navbar :title="title"></gm-navbar>

    <div class="content flex-grow-1">
      <div id="map" class="map">
        <gm-map></gm-map>
      </div>

      <div class="map-overlay">
        <span @click="$store.dispatch('sidebar_info/collapse', false)">open</span>
        <span @click="$store.dispatch('sidebar_info/collapse', true)">open</span>
      </div>

      <gm-sidebar title="Zoeken" position="left" collapsible expandable store_namespace="sidebar_search">
        <gm-search-places></gm-search-places>
      </gm-sidebar>
      <gm-sidebar title="Info" position="right" collapsible expandable store_namespace="sidebar_info">
          Right content
      </gm-sidebar>
    </div>

  </div>
</template>

<script>
// bootstrap
import 'bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css'

// open-sans
import '@fontsource/open-sans'

// import styles
import './styles/index.scss'

import GmNavbar from "./components/GmNavbar";
import GmSidebar from "./components/GmSidebar";
import GmSearchPlaces from "./components/GmSearchPlaces";
import GmMap from "./components/GmMap";

import store from "./store"

export default {
  name: "App",
  store: store,
  data() {
    return {
      title: 'Gent Gemapt'
    }
  },
  components: {
      'gm-navbar' : GmNavbar,
      'gm-sidebar': GmSidebar,
      'gm-search-places': GmSearchPlaces,
      'gm-map': GmMap
  },
  created() {
    this.$store.dispatch('sidebar_info/collapse')
  }
}
</script>

<style scoped>

</style>
<template>
  <div id="app" class="d-flex flex-column w-100 h-100">

    <gm-navbar :title="title"></gm-navbar>

    <div class="content d-flex flex-grow-1">

      <gm-map></gm-map>

      <gm-sidebar title="Zoeken" position="left" collapsible store_namespace="sidebar_search">
        <gm-search-places></gm-search-places>
      </gm-sidebar>
      <gm-sidebar position="right" collapsible expandable store_namespace="sidebar_info">
        <gm-place-info></gm-place-info>
      </gm-sidebar>
    </div>

    <gm-modal-root />

  </div>
</template>

<script>
// open-sans
import '@fontsource/open-sans'

// import styles
import './styles/index.scss'

import GmNavbar from "./components/GmNavbar";
import GmSidebar from "./components/GmSidebar";
import GmSearchPlaces from "./components/GmSearchPlaces";
import GmMap from "./components/GmMap";
import GmPlaceInfo from "./components/GmPlaceInfo";
import GmModalRoot from "./components/GmModalRoot";

export default {
  name: "App",
  data() {
    return {
      title: 'Gent Gemapt'
    }
  },
  components: {
      'gm-navbar' : GmNavbar,
      'gm-sidebar': GmSidebar,
      'gm-search-places': GmSearchPlaces,
      'gm-place-info': GmPlaceInfo,
      'gm-map': GmMap,
      'gm-modal-root': GmModalRoot
  },
  created() {
    this.$store.dispatch('sidebar_info/collapse')
  }
}
</script>

<style scoped lang="scss">
</style>
<template>
  <div class="sidebar"
       v-bind:class="{ 'sidebar-left': left, 'sidebar-right': right , 'sidebar-collapse': collapsible & collapsed, 'sidebar-expand': expandable && expanded }"
  >
    <div class="sidebar-header">
      <div class="sidebar-header-buttons">
        <span v-if="expandable" class="button button-expand" @click="toggle({property: 'expanded'})"></span>
        <span v-if="collapsible" class="button button-close" @click="toggle({property: 'collapsed'})"></span>
      </div>
      <h1 v-if="title" class="sidebar-header-title">{{ title }}</h1>
    </div>
    <div class="sidebar-content">
      <slot></slot>
    </div>
  </div>
</template>

<script>
import {mapInstanceState, mapInstanceActions} from '@urbn/vuex-helpers';

export default {
  name: "AppSidebar",
  props: {
    expandable: {
      type: Boolean, default: true
    },
    collapsible: {
      type: Boolean, default: true
    },
    position: {
      type: String, required: true
    },
    title: {
      type: String, required: false
    },
    store_namespace: {
      type: String, required: false
    }
  },
  computed: {
    // dynamic namespace
    // mapState aanvaard geen dynamische namespace (via functie)
    ...mapInstanceState( (self) => self.store_namespace, {
        collapsed: state => state.collapsed,
        expanded: state => state.expanded
    }),
    left: function() {
      return this.position === 'left'
    },
    right: function() {
      return this.position === 'right'
    }
  },
  methods: {
    ...mapInstanceActions((self) => self.store_namespace, [
        'collapse', 'expand', 'toggle'
    ])
  },
  activated() {

  }
}
</script>

<style scoped>

</style>
<template>
  <aside class="sidebar"
       v-bind:class="{ 'sidebar-left': left, 'sidebar-right': right , 'sidebar-collapse': collapsible && collapsed, 'sidebar-expand': expandable && expanded }"
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
  </aside>
</template>

<script>
import {mapInstanceState, mapInstanceActions} from '@urbn/vuex-helpers';

export default {
  name: "AppSidebar",
  props: {
    expandable: {
      type: Boolean, default: false
    },
    collapsible: {
      type: Boolean, default: false
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
}
</script>

<style lang="scss">
.sidebar {
  position: absolute;
  display: flex;
  flex-direction: column;

  top: 0;
  height: 100%;
  width: 100%;

  transition: all 0.3s ease;
  box-shadow: 0 0 5px 3px rgba(0, 0, 0, 0.20);
  transform: none;

  padding: 15px;

  z-index: 1001;

  background: white;

  &-header {
    position: relative;

    &-title {
    }

    &-buttons {
      position: absolute;
      top: 0;
      right: 0;

      .button {
        display: inline-block;
        width: 25px;
        height: 25px;
        background: no-repeat;
        background-position: center;
        border-radius: 50%;
        transition: background-color 0.3s ease;
        cursor: pointer;
        user-select: none;

        &:hover {
          background-color: #ddd;
        }

        &-close {
          background: url('data:image/svg+xml;utf8,<svg aria-hidden="true" focusable="false" data-prefix="fal" data-icon="times" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512" class="svg-inline--fa fa-times fa-w-10 fa-3x"><path fill="currentColor" d="M193.94 256L296.5 153.44l21.15-21.15c3.12-3.12 3.12-8.19 0-11.31l-22.63-22.63c-3.12-3.12-8.19-3.12-11.31 0L160 222.06 36.29 98.34c-3.12-3.12-8.19-3.12-11.31 0L2.34 120.97c-3.12 3.12-3.12 8.19 0 11.31L126.06 256 2.34 379.71c-3.12 3.12-3.12 8.19 0 11.31l22.63 22.63c3.12 3.12 8.19 3.12 11.31 0L160 289.94 262.56 392.5l21.15 21.15c3.12 3.12 8.19 3.12 11.31 0l22.63-22.63c3.12-3.12 3.12-8.19 0-11.31L193.94 256z" class=""></path></svg>')
          no-repeat 50%/50%;
        }

        &-expand {
          background: url('data:image/svg+xml;utf8,<svg aria-hidden="true" focusable="false" data-prefix="fal" data-icon="expand-wide" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" class="svg-inline--fa fa-expand-wide fa-w-16 fa-3x"><path fill="currentColor" d="M0 212V88c0-13.3 10.7-24 24-24h124c6.6 0 12 5.4 12 12v8c0 6.6-5.4 12-12 12H32v116c0 6.6-5.4 12-12 12h-8c-6.6 0-12-5.4-12-12zM364 64h124c13.3 0 24 10.7 24 24v124c0 6.6-5.4 12-12 12h-8c-6.6 0-12-5.4-12-12V96H364c-6.6 0-12-5.4-12-12v-8c0-6.6 5.4-12 12-12zm148 236v124c0 13.3-10.7 24-24 24H364c-6.6 0-12-5.4-12-12v-8c0-6.6 5.4-12 12-12h116V300c0-6.6 5.4-12 12-12h8c6.6 0 12 5.4 12 12zM148 448H24c-13.3 0-24-10.7-24-24V300c0-6.6 5.4-12 12-12h8c6.6 0 12 5.4 12 12v116h116c6.6 0 12 5.4 12 12v8c0 6.6-5.4 12-12 12z" class=""></path></svg>')
          no-repeat 50%/65%;
        }
      }
    }
  }

  &-content {
    flex-grow: 1;
    display: flex;
    overflow: hidden;
  }

  &-right {
    right: 0;
  }

  &-right.sidebar-collapse {
    transform: translateX(100%);
  }

  &-left {
    left: 0;
    width: 350px;
  }

  &-left.sidebar-collapse {
    transform: translateX(-100%);
  }

  &-top {
    z-index: 502;
  }
}

@media (min-width: 768px) {
  .sidebar {
    width: 550px;
    max-width: 1100px;

    &-left {
      width: 350px;
    }

    &-expand {
      width: 80%;
    }
  }
}
</style>
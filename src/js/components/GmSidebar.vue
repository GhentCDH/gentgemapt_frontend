<template>
    <aside class="sidebar"
           v-bind:class="{ 'sidebar--left': left, 'sidebar--right': right , 'sidebar--collapsed': collapsible && collapsed, 'sidebar--expanded': expandable && expanded }"
           :style="{'z-index': zIndex - weight}"
           :id="id"
    >
        <div class="sidebar__header">
            <div class="sidebar__header__buttons">
                <span v-if="expandable" class="button button--expand" @click="toggle({property: 'expanded'})">
                    <i class="bi bi-arrows-angle-expand"></i>
                </span>
                <span v-if="collapsible" class="button button--close" @click="toggle({property: 'collapsed'})">
                    <i class="bi bi-x-lg"></i>
                </span>
            </div>
            <h1 v-if="title" class="sidebar__header__title">{{ title }}</h1>
        </div>
        <div class="sidebar__content">
            <slot></slot>
        </div>
    </aside>
</template>

<script>
import {mapInstanceState, mapInstanceActions} from '@urbn/vuex-helpers';


export default {
    name: "AppSidebar",
    components: {
    },
    props: {
        id: {
            type: String,
            required: true
        },
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
        },
        zIndex: {
            type: Number, default: 1000
        }
    },
    computed: {
        // dynamic namespace
        // mapState aanvaard geen dynamische namespace (via functie)
        ...mapInstanceState((self) => self.store_namespace, {
            collapsed: state => state.collapsed,
            expanded: state => state.expanded
        }),
        left: function () {
            return this.position === 'left'
        },
        right: function () {
            return this.position === 'right'
        },
        weight: function() {
            return this.$store.getters['sidebarWeight'](this.id)
        }
    },
    methods: {
        ...mapInstanceActions((self) => self.store_namespace, [
            'collapse', 'expand', 'toggle', 'initStoreId'
        ])
    },
    created() {
        this.initStoreId(this.id)
    }
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

  transition: all 0.2s ease;
  transform: none;

  padding: 15px;

  z-index: 2001;

  background: white;

  &__header {
    position: relative;
    z-index: 2000;

    &__title {
    }

    &__buttons {
      position: absolute;
      top: -5px;
      right: -5px;

      .button {
        display: inline-block;
        width: 30px;
        height: 30px;
        background: no-repeat;
        background-position: center;
        border-radius: 50%;
        transition: background-color 0.3s ease;
        cursor: pointer;
        user-select: none;

        &:hover {
          background-color: #ddd;
        }
      }
    }
  }

  &__content {
    flex-grow: 1;
    flex-direction: column;
    display: flex;
    overflow: hidden;
  }

  &--right {
    right: 0px;
  }

  &--right.sidebar--collapsed {
    transform: translateX(calc(100% + 10px));
  }

  &--left {
    //left: -5px;
    //width: 450px;
  }

  &--left.sidebar--collapsed {
    transform: translateX(calc(-100% - 10px));
  }

  &--top {
    z-index: 502;
  }
}

@media (min-width: 992px) {
  .sidebar {

    &--right {
      width: 550px;
    }

    &--left {
      width: 450px;
    }

    &--expanded {
      width: 80%;
    }
  }
}
</style>

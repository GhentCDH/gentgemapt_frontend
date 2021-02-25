<template>
  <div id="map" class="map" v-bind:class="{ 'sidebar-left-open': !this.$store.state.sidebar_search.collapsed, 'sidebar-right-open': !this.$store.state.sidebar_info.collapsed }">
    <l-map ref="GmMap" v-bind="map" :center="center" :zoom="zoom" :bounds="bounds" @update:zoom="updateZoom" @update:center="updateCenter" @update:bounds="updateBounds" @ready="onMapReady">
      <l-control-layers position="topright"  ></l-control-layers>
      <l-tile-layer v-for="layer in tileLayers" :key="layer.id"
                    v-bind="layer.options"
      />
      <l-wms-tile-layer v-for="layer in wmsLayers" :key="layer.id" v-bind="layer.options" layer-type="overlay"></l-wms-tile-layer>
      <l-geo-json :ref="layer.id" v-for="layer in geojsonLayers" :key="layer.id" v-bind="layer.options"></l-geo-json>
    </l-map>
  </div>
</template>

<script>
// create layer groups
// https://stackoverflow.com/questions/32195267/how-to-parse-geojson-file-into-leaflet-layers


import {LControl, LGeoJson, LMap, LMarker, LTileLayer, LWMSTileLayer, LControlLayers} from 'vue2-leaflet';
import 'leaflet.snogylop'
import 'leaflet/dist/leaflet.css';

// icon fix
import {Icon} from 'leaflet';
// add ghent overlay
import ghent from '@/js/ghent.json'

delete Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
})


export default {
  name: "AppMap",
  components: {
    LMap,
    LTileLayer,
    LMarker,
    LGeoJson,
    LControl,
    LControlLayers,
    'l-wms-tile-layer': LWMSTileLayer
  },
  data() {
    return {
      mapObject: null,
      map: {
        minZoom: 1,
        options: {
          attributionControl: false,
          zoomControl: true
        }
        /* preferCanvas: true */
      },
      tileLayers: [
        {
          id: 'mapbox-v1',
          options: {
            url: 'https://api.mapbox.com/styles/v1/sysadmin-ghentcdh/ckk5uzofh03s517pd44ucjk61/tiles/256/{z}/{x}/{y}@2x?access_token=pk.eyJ1Ijoic3lzYWRtaW4tZ2hlbnRjZGgiLCJhIjoiY2trNXR3ZW55MGFxYTJ3bndiZDE0czNpOSJ9.b7hzKcWY7vIOdWNgBl6Wkw',
            attribution: 'mapbox',
            maxZoom: 18,
            name: 'MapBox'
          }
        }
      ],
      wmsLayers: [
        {
          id: 'ferraris',
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
          id: 'popp',
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
          options: {
            'base-url': 'https://geoservices.informatievlaanderen.be/raadpleegdiensten/histcart/wms',
            layers: 'vandermaelen',
            transparent: true,
            opacity: 0.5,
            format: 'image/png',
            name: 'Topografische kaart Vandermaelen (1846-1854), Vlaanderen',
            visible: false
          }
        }
      ],
      geojsonLayers: [
        {
          id: 'ghent-overlay',
          options: {
            optionsStyle: {
              "color": "#093549",
              "weight": 1,
              "fillOpacity": .6
            },
            geojson: ghent,
            options: {
              invert: true,
            }
          }
        },
      ]
    }
  },
  computed: {
    center() {
      return this.$store.getters['map/getCenter'];
    },
    zoom() {
      return this.$store.state.map.zoom
    },
    bounds() {
      return this.$store.state.map.bounds
    },
    getHighlightedFeatures() {
      return this.$store.getters['map/getHighlightedFeatures']
    },
    getGeoJSONData() {
      return this.$store.getters['map/getGeoJSONData']
    },
/*
    ...mapGetters([
        'map/getGeoJSONData'
    ])*/
  },
  watch: {
    getHighlightedFeatures() {
      this.updateFeatureStyles()
    },
    zoom() {
      this.updateFeatureStyles()
    }
  },
  methods: {
    updateZoom(payload) {
      this.$store.dispatch('map/setZoom', payload)
    },
    updateCenter(payload) {
      this.$store.dispatch('map/setCenter', payload)
    },
    updateBounds(payload) {
      this.$store.dispatch('map/setBounds', payload)
    },
    onMapReady() {
      this.mapObject = this.$refs.GmMap.mapObject
    },
    onEachFeature(feature, layer) {
      const that = this
      // init highlight property
      feature.highlight = false;

      layer.on('click', function (e) {
        that.$store.dispatch( 'map/selectFeature', { feature: feature } )
        that.$store.dispatch('sidebar_info/collapse', false)
        // todo: positie berekenen
        const containerWidth = document.getElementsByClassName('leaflet-container')[0].offsetWidth;
        const sidebarWidth = 550;
        const markerXPos = e.containerPoint.x;
        if ( markerXPos > containerWidth - sidebarWidth ) {
          that.mapObject.panBy([markerXPos - (containerWidth - sidebarWidth) + 200,0]);
        }
      })
    },
    styleFeature(feature) {
      return {
        color: feature.highlight ? 'rgb(0 123 255 / 80%)' : 'rgb(0 123 255 / 15%)',
        weight: feature.highlight ? 8 : ( this.zoom / 16 * 8 ),
        stroke: this.highlight || this.zoom > 14
      };
    },
    updateFeatureStyles() {
      console.log('update styles');
      this.$nextTick(() => {
        if ( _.has(this.$refs, 'markers' ) ) {
          this.$refs.markers[0].mapObject.eachLayer((layer) => {
            if ( layer.feature.geometry.type !== 'Point' ) {
              layer.setStyle( this.styleFeature(layer.feature) );
            }
          })
        }
      })
    },
    showAlert() {
      console.log(this.$refs.markers);
    }
  },

  async created() {
    // load geojson data
    await this.$store.dispatch('map/loadGeoJSONData');

    // add geojson layer
    this.geojsonLayers.push(
        {
          id: 'markers',
          options: {
            geojson: this.getGeoJSONData,
            options: {
              onEachFeature: this.onEachFeature,
              style: this.styleFeature,
            }
          }
        }
    )
  },
}
</script>

<style scoped>
.gm-map {
  width: 100%;
}
</style>
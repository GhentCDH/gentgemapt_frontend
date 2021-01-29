<template>
    <l-map ref="GmMap" v-bind="map" :center="center" :zoom="zoom" @update:zoom="updateZoom" @update:center="updateCenter" @ready="onMapReady">
      <l-tile-layer v-for="layer in tileLayers" :key="layer.id"
          v-bind="layer.options"
      />
      <l-
      <l-geo-json refs="layer.id" v-for="layer in geojsonLayers" :key="layer.id" v-bind="layer.options"></l-geo-json>
    </l-map>
</template>

<script>
// create layer groups
// https://stackoverflow.com/questions/32195267/how-to-parse-geojson-file-into-leaflet-layers



import { LMap, LTileLayer, LMarker, LGeoJson } from 'vue2-leaflet';
import 'leaflet.snogylop'
import 'leaflet/dist/leaflet.css';

// icon fix
import { Icon } from 'leaflet';

delete Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
})

// add ghent overlay
import ghent from '@/js/ghent.json'

import PlaceService from "@/services/PlaceService";
import {mapActions} from "vuex";


export default {
  name: "AppMap",
  components: {
    LMap,
    LTileLayer,
    LMarker,
    LGeoJson
  },
  data() {
    return {
      mapObject: null,
      map: {
        minZoom: 1,
        /* preferCanvas: true */
      },
      tileLayers: [
        {
          id: 'mapbox-v1',
          options: {
            url: 'https://api.mapbox.com/styles/v1/sysadmin-ghentcdh/ckk5uzofh03s517pd44ucjk61/tiles/256/{z}/{x}/{y}@2x?access_token=pk.eyJ1Ijoic3lzYWRtaW4tZ2hlbnRjZGgiLCJhIjoiY2trNXR3ZW55MGFxYTJ3bndiZDE0czNpOSJ9.b7hzKcWY7vIOdWNgBl6Wkw',
            attribution: 'mapbox',
            maxZoom: 18
          }
        }
      ],
      geojsonLayers: [
        {
          id: 'ghent-overlay',
          options: {
            optionsStyle: {
              "color": "#093549",
              "weight": 0,
              "fillOpacity": .6
            },
            geojson: ghent,
            options: {
              invert: true,
            }
          }
        }
      ]
    }
  },
  computed: {
    center() {
      return this.$store.state.map.center
    },
    zoom() {
      return this.$store.state.map.zoom
    }
  },
  async created() {
    const data = await PlaceService.list();
    this.geojsonLayers.push(
        {
          id: 'markers',
          options: {
            geojson: data,
            options: {
              onEachFeature: this.onEachFeature,
              style: this.styleFeature
            }
          }
        }
    )
  },
  methods: {
    updateZoom(payload) {
      this.$store.dispatch('map/updateZoom', payload)
      console.log(this.$refs);
      /*
      this.$refs.markers.setStyle( {
        color: 'red'
      })
      */
    },
    updateCenter(payload) {
      this.$store.dispatch('map/updateCenter', payload)
    },
    onMapReady() {
      this.mapObject = this.$refs.GmMap.mapObject
    },
    onEachFeature(feature, layer) {
      const that = this
      layer.on('click', function (e) {
        console.log('clicked')
        that.$store.dispatch( 'map/setFeature', feature )
        that.$store.dispatch('sidebar_info/collapse', false)
      })
    },
    styleFeature(feature) {
      return {
        color: 'red'
      }
    }
  }
}
</script>

<style scoped>

</style>
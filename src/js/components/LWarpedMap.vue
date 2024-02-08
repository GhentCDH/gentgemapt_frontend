<script>
import { optionsMerger, propsBinder, findRealParent } from 'vue2-leaflet/src/utils/utils.js';
import TileLayerMixin from 'vue2-leaflet/src/mixins/TileLayer.js';
import Options from 'vue2-leaflet/src/mixins/Options.js';
import { tileLayer, DomEvent } from 'leaflet';
import { WarpedMapLayer } from '@allmaps/leaflet'
import {WarpedMapEvent} from "@allmaps/leaflet";


export default {
    name: "LWarpedMap",
    mixins: [TileLayerMixin, Options],
    props: {
        url: {
            type: String,
            default: null,
        },
        tileLayerClass: {
            type: Function,
            default: tileLayer,
        },
    },
    methods: {
        getEventMapId(event) {
            if ( event?.mapId ) {
                return event.mapId
            }
            let i = 0
            let mapId = ''
            while (event?.[i]) {
                mapId+=event[i]
                i++
            }
            return mapId
        }
    },
    mounted() {
        const options = optionsMerger(this.tileLayerOptions, this);
        this.mapObject = new WarpedMapLayer(this.url, options)
        // for ( const map of this.mapObject.getWarpedMapList().getWarpedMaps() ) {
        //     console.log(map)
        //     map.setTransformationType('thinPlateSpline')
        // }

        DomEvent.on(this.mapObject, this.$listeners);
        propsBinder(this, this.mapObject, this.$options.props);
        this.parentContainer = findRealParent(this.$parent);

        this.parentContainer.mapObject.on('warpedmapadded', (event) => {
            this.mapObject.setMapsTransformationType([this.getEventMapId(event)], 'thinPlateSpline')
        })

        this.parentContainer.addLayer(this, !this.visible);
        this.$nextTick(() => {
            /**
             * Triggers when the component is ready
             * @type {object}
             * @property {object} mapObject - reference to leaflet map object
             */
            this.$emit('ready', this.mapObject);
        });
    },
}
</script>

<template>
    <div />
</template>

<style scoped lang="scss">

</style>

<script>
import { optionsMerger, propsBinder, findRealParent } from 'vue2-leaflet/src/utils/utils.js';
import LayerMixin from 'vue2-leaflet/src/mixins/Layer.js';
import Options from 'vue2-leaflet/src/mixins/Options.js';
import { tileLayer, DomEvent } from 'leaflet';

import { MaptilerLayer } from "@maptiler/leaflet-maptilersdk";

export default {
    name: "LMaptilerLayer",
    mixins: [LayerMixin, Options],
    props: {
        apiKey: {
            type: String,
            default: null,
        },
        styleId: {
            type: String,
            default: null,
        },
    },
    mounted() {
        const options = this.options
        if (this.apiKey) {
            options.apiKey = this.apiKey;
        }
        if (this.styleId) {
            options.style = this.styleId;
        }
        this.mapObject = new MaptilerLayer(options)

        DomEvent.on(this.mapObject, this.$listeners);
        propsBinder(this, this.mapObject, this.$options.props);
        this.parentContainer = findRealParent(this.$parent);

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

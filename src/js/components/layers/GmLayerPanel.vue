<template>
    <div>
        <h2>Basiskaarten</h2>
        <div class="maplist maplist--base">
            <template v-for="layer in baseLayers">
                <gm-layer-option :layer="layer"></gm-layer-option>
            </template>
        </div>
        <h2>Kaartlagen</h2>
        <div class="maplist maplist--overlay">
            <template v-for="layer in overlayLayers">
                <gm-layer-option :layer="layer"></gm-layer-option>
            </template>
        </div>
    </div>
</template>

<script>
import GmLayerOption from "./GmLayerOption";

export default {
    name: "GmLayerPanel",
    components: {
        GmLayerOption
    },
    computed: {
        baseLayers() {
            return this.$store.getters["map/getLayers"].filter( item => item.options?.layerType === 'base' )
        },
        overlayLayers() {
            return this.$store.getters["map/getLayers"].filter( item => item.options?.layerType === 'overlay' )
        },
    }
}
</script>

<style scoped>

</style>
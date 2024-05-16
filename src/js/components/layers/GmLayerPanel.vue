<template>
    <div>
        <h2>Basiskaarten</h2>
        <div class="maplist maplist--base">
            <template v-for="layer in baseLayers">
                <gm-layer-option :layer="layer" radio></gm-layer-option>
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
            return this.$store.getters["map/getLayers"].filter( item => item?.isBaseLayer === true && (item?.isToggleable ?? true) === true )
        },
        overlayLayers() {
            return this.$store.getters["map/getLayers"]
                .filter( item => !item?.isBaseLayer && (item?.isToggleable ?? true) === true)
                .sort( (a,b) => (a?.weight ?? 0) - (b?.weight ?? 0))
                .map( function(item) { item.url = process.env.URL_INFOSITE + `/s/default/page/${item.id}`; return item })
        },
    }
}
</script>

<style scoped>

</style>

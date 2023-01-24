<template>
    <div class="layer-option">
        <div class="layer-option__visibility">
            <b-form-checkbox :value="true" :unchecked-value="false" :checked="isVisible" @change="toggleVisible">
            </b-form-checkbox>
        </div>
        <div class="layer-option__details">
            <span class="layer-option__title" @click="toggleVisible(!isVisible)">{{ layer.options.name }}</span>
            <div v-if="isVisible && isOverlay" class="layer-option__opacity">
                <vue-slider :value="opacity" width="100%" :min="0" :max="1" :interval="0.01" :process="false" :tooltip="'none'" :silent="true" @change="setOpacity"></vue-slider>
            </div>
        </div>
    </div>
</template>

<script>
import VueSlider from 'vue-slider-component';

export default {
    name: 'GmLayerOption',
    components: {
        VueSlider
    },
    data() {
        return {
            selected: ''
        }
    },
    props: {
        layer: {
            type: Object,
            required: true
        }
    },
    computed: {
        isVisible() {
            return this.layer.options?.visible ?? false
        },
        isOverlay() {
            return this.layer.options?.layerType === "overlay"
        },
        isBaseLayer() {
            return this.layer.options?.layerType === "base"
        },
        opacity() {
            return this.layer.options?.opacity ?? 0
        }
    },
    methods: {
        toggleVisible(checked) {
            this.$store.commit('map/setLayerVisibility', { id: this.layer.id, visible: checked })
        },
        setOpacity(opacity) {
            this.$store.commit('map/setLayerOpacity', { id: this.layer.id, opacity: opacity })
        }
    }
}
</script>



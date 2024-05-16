<template>
    <div class="layer-option">
        <div class="layer-option__visibility">
            <b-form-checkbox :value="true" :unchecked-value="false" :checked="isVisible" @click.native="checkVisible" @change="toggleVisible">
            </b-form-checkbox>
        </div>
        <div class="layer-option__details">
            <span class="layer-option__title" @click="toggleVisible(!isVisible)">{{ layer.label }}</span>
            <div v-if="isVisible && isOverlay" class="layer-option__opacity">
                <vue-slider :value="opacity" width="100%" :min="0" :max="1" :interval="0.01" :process="false" :tooltip="'none'" :silent="true" @change="setOpacity"></vue-slider>
            </div>
        </div>
        <div class="layer-option__icon" v-if="isOverlay && layer.url">
                <a :href="layer.url" target="_blank"><i class="bi bi-info-circle-fill"></i></a>
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
        },
        radio: {
            type: Boolean,
            default: false
        }
    },
    computed: {
        isVisible() {
            return this.layer?.options?.visible ?? false
        },
        isOverlay() {
            return !this.layer?.isBaseLayer
        },
        isBaseLayer() {
            return this.layer?.isBaseLayer === true
        },
        opacity() {
            return this.layer?.options?.opacity ?? 0
        }
    },
    methods: {
        checkVisible(event) {
            if ( this.radio && this.isVisible ) {
                event.preventDefault();
            }
        },
        toggleVisible(checked) {
            if (!this.radio || (this.radio && checked) ) {
                this.$store.dispatch('map/setLayerVisibility', { id: this.layer.id, visible: checked })
            }
        },
        setOpacity(opacity) {
            this.$store.dispatch('map/setLayerOpacity', { id: this.layer.id, opacity: opacity })
        }
    }
}
</script>



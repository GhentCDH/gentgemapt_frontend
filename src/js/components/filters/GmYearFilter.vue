<template>
    <div class="gm-year-slider">
        <div class="gm-year-slider__slider">
            <vue-slider class="vue-slider--gm" v-model="yearFilter" :contained="true" direction="ltr" :min="yearFilterConfig.min" :max="yearFilterConfig.max" :process="false" :tooltip="'none'" :marks="marks" :silent="true"></vue-slider>
        </div>
        <div class="gm-year-slider__year">
            {{ yearFilter }}
        </div>
    </div>
</template>

<script>
import VueSlider from 'vue-slider-component';

export default {
    components: {
        VueSlider
    },
    computed:  {
        yearFilter: {
            get () {
                return this.$store.getters['featureFilters/getYear']
            },
            set (value) {
                this.$store.dispatch('featureFilters/setYear', value)
            }
        },
        yearFilterConfig() {
            return {
                min: 1550,
                max: new Date().getFullYear(),
                marks: this.range(1550, 2100, 10)
            }
        },
        marks() {
            const ret = {}
            this.yearFilterConfig.marks.forEach( (value) => {
                if (value % 100 === 0) {
                    ret[`${value}`] = {
                        label: value,
                        style: {
                            height: '8px',
                            width: '2px',
                        },
                    }
                    return;
                }
                if (value % 50 === 0) {
                    ret[`${value}`] = {
                        label: null,
                        style: {
                            height: '4px',
                            width: '1px',
                        },
                    }
                    return;
                }
                if (value % 10 === 0) {
                    ret[`${value}`] = {
                        label: null,
                        style: {
                            height: '2px',
                            width: '1px',
                        },
                    }
                }
            });
            return ret
        }
    },
    methods: {
        range(start, stop, step = 1) {
            return Array(Math.ceil((stop - start) / step)).fill(start).map((x, y) => x + y * step)
        },
    }
}
</script>

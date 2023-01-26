<template>
    <div class="filter-option">
        <div class="filter-option__select">
            <b-form-checkbox :value="true" :unchecked-value="false" :checked="isActive" @change="setFilterStatus">
            </b-form-checkbox>
        </div>
        <div class="filter-option__details">
            <span class="filter-option__label" @click="setFilterStatus(!isActive)">{{ filter.label }}</span>
        </div>
        <div class="filter-option__icon">
            <img v-if="filter.icon" :src="filter.icon">
        </div>
    </div>
</template>

<script>
export default {
    name: 'GmFilterOption',
    data() {
        return {
        }
    },
    props: {
        filter: {
            type: Object,
            required: true
        }
    },
    computed: {
        isActive() {
            return this.filter.active ?? true
        },
    },
    methods: {
        setFilterStatus(checked) {
            this.$store.dispatch('featureFilters/setPlaceTypeStatus', { id: this.filter.id, active: checked })
        },
    }
}
</script>



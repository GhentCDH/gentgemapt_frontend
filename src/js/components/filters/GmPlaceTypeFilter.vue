<template>
    <div>
        <div class="mbottom-small user-select-none">
            <a @click="selectAll" class="text-primary small">alles selecteren</a> | <a @click="selectNone" class="text-primary small">niets selecteren</a>
        </div>
        <template v-for="filter in placeTypeFilters">
            <gm-filter-option :filter="filter"></gm-filter-option>
        </template>
    </div>
</template>

<script>
import GmFilterOption from "./GmFilterOption";

export default {
    name: "GmPlaceTypeFilter",
    components: {
        GmFilterOption,
    },
    computed: {
        placeTypeFilters() {
            return this.$store.getters["featureFilters/getPlaceTypes"]
        },
    },
    methods: {
        selectAll() {
            this.$store.dispatch('featureFilters/activateAllPlaceTypes')
        },
        selectNone() {
            this.$store.dispatch('featureFilters/deactivateAllPlaceTypes')
        }
    }
}
</script>

<style scoped>

</style>
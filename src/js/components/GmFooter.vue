<script>
import GmYearFilter from "./filters/GmYearFilter.vue";

export default {
    name: "GmFooter",
    components: {GmYearFilter}
}
</script>

<template>
    <div class="app__footer d-flex bg-dark d-sm-none">
        <div class="navbar navbar-expand w-100">
            <div class="d-flex w-100">
                <div class="px-3 py-2">
                    <div class="nav-item" @click="$store.dispatch('sidebarMaps/collapse', false)">
                        <img :src="require('@/images/icons/GentGemapt_Layers.svg')" alt="Kaarten">
                    </div>
                </div>
                <div class="px-0 py-2 flex-grow-1">
                    <gm-year-filter class="w-100"></gm-year-filter>
                </div>
                <div class="px-3 py-2">
                    <div class="nav-item" @click="$store.dispatch('sidebarSearch/collapse', false)">
                        <img :src="require('@/images/icons/GentGemapt_Search.svg')" alt="Zoeken">
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped lang="scss">

</style>

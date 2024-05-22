<template>
    <div>
        <div class="maplist maplist--base">
            <template v-for="project in projects">
                <gm-project-option :project="project" radio></gm-project-option>
            </template>
        </div>
    </div>
</template>

<script>
import GmProjectOption from "./GmProjectOption";

export default {
    name: "GmProjectPanel",
    components: {
        GmProjectOption
    },
    computed: {
        projects() {
            return this.$store.getters["project/getProjects"];
        },
    }
}
</script>

<style scoped>

</style>

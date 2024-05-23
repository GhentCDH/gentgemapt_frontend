<template>
    <div class="layer-option">
        <div class="layer-option__visibility">
            <b-form-checkbox :value="true" :unchecked-value="false" :checked="isActive" @change="setFilterStatus">
            </b-form-checkbox>
        </div>
        <div class="layer-option__details">
            <span class="filter-option__label" @click="setFilterStatus(!isActive)">{{ project.title }}</span>
        </div>
        <div class="layer-option__icon" v-if="project?.homepage">
            <a :href="project.homepage" target="_blank"><i class="bi bi-info-circle-fill"></i></a>
        </div>
    </div>
</template>

<script>
export default {
    name: 'gm-project-option',
    data() {
        return {
        }
    },
    props: {
        project: {
            type: Object,
            required: true
        }
    },
    computed: {
        isActive() {
            return this.project.id === this.$store.getters['project/getActiveProject']?.id
        },
    },
    methods: {
        setFilterStatus(checked) {
            this.$store.dispatch('initProject', this.project )
        },
    }
}
</script>



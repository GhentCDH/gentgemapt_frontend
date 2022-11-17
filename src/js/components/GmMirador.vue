<template>
    <div :id="id" class="vue-mirador-viewer">
    </div>
</template>

<script>
import Mirador from 'mirador/dist/es/src/index';

export default {
    name: "GmMirador",
    props: {
        id: {
            type: String,
            default: 'vue-mirador'
        },
        options: {
            type: Object,
            default: () => {}
        },
        windows: {
            type: Array,
            default: []
        }
    },
    data() {
        return {
            viewer: null
        }
    },
    computed: {
        config() {
            return {
                ...this.options,
                windows: this.windows,
                id: this.id,
            }
        }
    },
    watch: {
        windows: {
            deep: true,
            handler(windows, prevWindows) {
                let that = this
                windows.forEach( function(window) {
                    let action = Mirador.actions.addWindow(windows[0])
                    that.viewer.store.dispatch(action);
                } )
            }
        }
    },
    methods: {
        setup() {
            if (!this.viewer && this.config) {
                this.viewer = Mirador.viewer(this.config, []);
            }
        }
    },
    mounted: function () {
        this.setup()
    },
}
</script>

<style scoped lang="scss">
</style>
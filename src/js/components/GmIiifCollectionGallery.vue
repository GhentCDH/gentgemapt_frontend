<template>
    <div class="image-grid">
        <div class="image-grid__item" v-if="manifests && manifests.length" v-for="(manifest, index) in manifests" :key="manifest.id + '-' + index"
             @click="handleClick(manifest)">
            <b-img :src="getThumbNailUrl(manifest)"></b-img>
        </div>
    </div>
</template>

<script>
const manifesto = require('manifesto.js/dist-commonjs/');
import GmIiifManifestViewer from "./GmIiifManifestViewer";
import {ModalBus} from "../eventbus"

export default {
    name: "gm-iiif-collection-galery",
    components: {
        GmIiifManifestViewer,
        ModalBus
    },
    data() {
        return {
            collection: null,
        }
    },
    props: {
        collectionUrl: {
            type: String,
            required: true
        },
        thumbnailWidth: {
            type: Number,
            required: false,
            default: 150
        }
    },
    computed: {
        manifests() {
            if (this.collection) {
                return this.collection.getManifests();
            }
            return [];
        },
    },
    watch: {
        collectionUrl: function(url) {
            // console.log(url)
            if (url) {
                this.loadManifest(url)
            }
        }
    },
    created() {
        if (this.collectionUrl) {
            this.loadManifest(this.collectionUrl)
        }
    },
    methods: {
        getThumbNailUrl(manifest) {
            const thumb = manifest.getThumbnail()
            return manifest.getThumbnail()?.id
        },
        handleClick(manifest) {
            this.$store.dispatch('iiifViewer/loadManifest', manifest.id)
            this.$store.dispatch('sidebarViewer/collapse', false)
        },
        async loadManifest(url) {
            // console.log(url)
            const {data} = await this.axios.get(url);
            const resource = manifesto.parseManifest(data);
            if (resource.isCollection()) {
                this.collection = resource;
                resource.getManifests().forEach(function (manifest) {
                    // console.log(manifest.getThumbnail().id);
                });
            }
        }

    },
}
</script>

<style scoped>

</style>

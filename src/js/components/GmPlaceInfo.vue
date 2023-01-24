<template>
    <div class="place-info" v-if="place">
        <div class="place-info__title">
            <h1>{{ place.title }}</h1>
            <div class="titles">
              <span v-if="place.titles.fr">
                  <span class="title__lang">fr</span>
                  <span v-for="(title,index) in place.titles.fr" :key="index" class="title__label">{{ title }}</span>
              </span>
                <span v-if="place.titles.ghents">
                  <span class="badge">gents</span>
                  <span v-for="(title,index) in place.titles.ghents" :key="index">{{ title }}</span>
              </span>
            </div>
        </div>
        <div class="place-info__content scrollable scrollable--vertical">
            <div class="features features--smaller mbottom-default">
                <span class="feature feature--date" v-if="dating">{{ dating }}</span>
                <span class="feature" v-for="feature in place.features">{{ feature }}</span>
            </div>

            <gm-show-more label-show-more="toon meer" label-show-less="toon minder">
                <div class="description" v-html="descriptionFormatted"></div>

                <div class="creators" v-if="place.creators.length">
                    Door
                    <ul>
                        <li v-for="(creator,index) in place.creators" :key="index">{{ creator }}</li>
                    </ul>
                </div>
            </gm-show-more>

            <h2 v-if="place.manifests.length && place.manifests[0].count">Collectie</h2>
            <gm-iiif-collection-gallery v-if="place.manifests && place.manifests.length" v-for="ref in place.manifests" :key="ref.url"
                                        :collectionUrl="ref.url"></gm-iiif-collection-gallery>

            <div class="moreinfo" v-if="place.references.length">
                <h2>Meer weten</h2>
                <ul>
                    <li v-for="(reference,index) in place.references" :key="index">
                        <span v-if="!reference.url">{{ reference.label }}</span>
                        <a target="_blank" v-if="reference.url" :href="reference.url">{{ reference.label }}</a>
                    </li>
                </ul>
            </div>

            <div class="moreinfo" v-if="place.biblio.length">
                <h2>Bibliografie</h2>
                <ul>
                    <li v-for="(reference,index) in place.biblio" :key="index">
                        <span v-if="!reference.url">{{ reference.label }}</span>
                        <a v-if="reference.url" href="reference.url">{{ reference.label }}</a>
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>

<script>
import PlaceService from "../services/PlaceService";

import GmIiifCollectionGallery from "./GmIiifCollectionGallery";
import GmShowMore from "./GmShowMore";

export default {
    name: "GmPlaceInfo",
    components: {
        GmIiifCollectionGallery,
        GmShowMore
    },
    data() {
        return {
            place: null
        }
    },
    computed: {
        placeId() {
            if (this.$store.state.map.selectFeature) {
                return this.$store.state.map.selectFeature.properties.id;
            } else {
                return null
            }
        },
        descriptionFormatted() {
            return this.place.description
                .replaceAll('h2>', 'h3>')
                .replaceAll('h3>', 'h4>')
                .replaceAll('<p><strong>', '<h3>')
                .replaceAll('</strong></p>', '</h3>')
        },
        dating() {
            return this.place?.startDate ? this.place.startDate + ( this.place?.endDate ? ' – ' + this.place.endDate : ' – heden' ) : null
        }
    },
    methods: {
        async loadPlaceData(id) {
            const place = await PlaceService.get(id)
            this.place = place;
        }
    },
    watch: {
        async placeId(newId, oldId) {
            await this.loadPlaceData(newId)
            this.$store.dispatch('sidebarInfo/collapse', false)
        }
    }
}
</script>
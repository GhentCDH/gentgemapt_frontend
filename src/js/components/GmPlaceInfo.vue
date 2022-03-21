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

            <div class="features mbottom-default">
                <span class="feature" v-for="feature in place.features">{{ feature }}</span>
            </div>

            <div class="description" v-html="descriptionFormatted"></div>

            <div class="creators" v-if="place.creators.length">
                <ul>
                    <li v-for="(creator,index) in place.creators" :key="index">{{ creator }}</li>
                </ul>
            </div>

            <h3 v-if="place.refs.length && place.refs[0].count">Collectie</h3>
            <gm-iiif-collection-gallery v-if="place.refs && place.refs.length" v-for="ref in place.refs" :key="ref.url"
                                        :collectionUrl="ref.url"></gm-iiif-collection-gallery>

            <div class="moreinfo" v-if="place.references.length">
                <h3>Meer weten?</h3>
                <ul>
                    <li v-for="(reference,index) in place.references" :key="index">
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

export default {
  name: "GmPlaceInfo",
  components: {
    GmIiifCollectionGallery
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
            .replaceAll('h2>','h3>')
            .replaceAll('h3>','h4>')
            .replaceAll('<p><strong>','<h3>')
            .replaceAll('</strong></p>','</h3>')
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
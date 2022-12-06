<template>
    <div class="place-search">
        <div class="place-search__form">
            <b-input-group>
                <b-input-group-prepend>
                    <b-input-group-text class="bg-transparent border-right-0">
                        <b-icon icon="search"></b-icon>
                    </b-input-group-text>
                </b-input-group-prepend>
                <b-form-input v-model="text" placeholder="" type="search" class="border-left-0" @keyup.enter="search"
                              @input="debouncedSearch"></b-form-input>
            </b-input-group>
            <b-form-group>
            </b-form-group>
        </div>
        <div class="place-search__results flex-grow-1 scrollable scrollable--vertical">
            <ul class="list-unstyled">
                <b-media v-if="response.count" v-for="place in response.items" :key="place.id" tag="li" class="search-result mb-2"
                         @click="select(place)"
                         @mouseenter="highlight(place)"
                         @mouseleave="unhighlight(place)">
                    <template #aside>
                        <b-img :blank="!Boolean(place.thumbnail)" blank-color="#777" width="60"
                               :src="place.thumbnail"></b-img>
                    </template>
                    <h5>{{ place.title }}</h5>
                    <div class="features">
                        <span class="feature" v-for="feature in place.features">{{ feature }}</span>
                    </div>
                </b-media>
            </ul>

            <div v-if="noResults">
                Geen resultaten gevonden.
            </div>

            <div v-if="searching">
                <b-spinner label="Loading..."></b-spinner>
            </div>
        </div>
    </div>
</template>

<script>
import PlaceService from "../services/PlaceService";

import debounce from 'debounce';

import { BIcon } from 'bootstrap-vue'

export default {
    name: "AppSearchPlaces",
    components: {
        BIcon
    },
    data() {
        return {
            text: '',
            response: {
                count: 0,
                items: [],
                pages: 0,
                page: 0
            },
            searching: false,
            noResults: false
        }
    },
    methods: {
        search: async function () {
            this.noResults = false;
            this.response = [];
            if (this.text.trim()) {
                this.searching = true;
                const data = await PlaceService.search(this.text)
                this.searching = false;
                this.response = data;
                this.noResults = this.response.count === 0
                // update bounds
                if (data.count) {
                    this.$store.commit('featureFilters/setSearchResult', data.items.map( i => i.id ))
                    this.$store.dispatch('map/setBounds', [[data.bbox.corner1.lat, data.bbox.corner1.lng], [data.bbox.corner2.lat, data.bbox.corner2.lng]]);
                }
            }
        },
        select: function (item) {
            this.$store.dispatch('map/setCenter', item.coords)
            this.$store.dispatch('map/setZoom', 18)
            this.$store.dispatch('map/selectFeature', {id: item.id})
        },
        highlight: function (item) {
            this.$store.dispatch('map/highlightFeature', {id: item.id})
        },
        unhighlight: function (item) {
            this.$store.dispatch('map/unhighlightFeature', {id: item.id})
        }
    },
    created() {
        this.debouncedSearch = debounce(this.search, 300);
    }
}
</script>

<style lang="scss">
.place-search {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;

  .place-search__results {
    flex-grow: 1;
    overflow-y: auto;

    .search-result {
      cursor: pointer;
    }
  }
}
</style>
<template>
    <div class="place-search">
        <div class="place-search__form">

            <b-input-group>
                <b-form-input v-model="text" type="search" @keyup.enter="search"
                              @input="debouncedSearch" placeholder="Typ hier ..."></b-form-input>
            </b-input-group>
        </div>
        <div class="place-search__results flex-grow-1 scrollable scrollable--vertical">
            <ul class="list-unstyled">
                <b-media v-if="response.count" v-for="place in response.items" :key="place.id" tag="li" class="search-result mb-2"
                         @click="select(place)"
                         @mouseenter="highlight(place)"
                         @mouseleave="unhighlight(place)">
                    <template #aside>
                        <b-img :blank="!Boolean(place.thumbnail)" blank-color="#777" width="60"
                               :src="place.thumbnail + ''" ></b-img>
                    </template>
                    <h5>{{ place.title }}</h5>
                    <div class="features">
                        <span class="feature" v-for="type in place.placeType">{{ type }}</span>
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
import PlaceService from "../../services/PlaceService";

import debounce from 'debounce';

import { BInputGroup } from 'bootstrap-vue'

export default {
    name: "gm-search-places",
    components: {
        BInputGroup
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
                const data = await PlaceService.search(this.text, this.$store.getters['project/getActiveProjectId']);
                this.searching = false;
                this.response = data;
                this.noResults = this.response.count === 0
                // update bounds
                if (data.count) {
                    this.$store.dispatch('featureFilters/setSearchResult', data.items.map( i => i.id ))
                    this.$store.dispatch('map/setBounds', [[data.bbox.corner1.lat, data.bbox.corner1.lng], [data.bbox.corner2.lat, data.bbox.corner2.lng]]);
                }
            } else {
                this.$store.dispatch('featureFilters/resetSearch')
            }
        },
        select: function (item) {
            this.$store.dispatch('selectPlace', item.id)
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
    margin-top: 20px;

    .search-result {
      cursor: pointer;

      h5 {
        margin-bottom: 2px;
      }
    }
  }
}
</style>

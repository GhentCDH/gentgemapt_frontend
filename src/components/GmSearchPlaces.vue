<template>
  <div class="place-search">
    <div class="place-search-from">
      <b-input-group>
        <b-input-group-prepend>
          <b-input-group-text class="bg-transparent border-right-0">
            <font-awesome-icon icon="search"></font-awesome-icon>
          </b-input-group-text>
        </b-input-group-prepend>
        <b-form-input v-model="text" placeholder="" type="search" class="border-left-0" @keyup.enter="search" @input="debouncedSearch"></b-form-input>
      </b-input-group>
      <b-form-group>
      </b-form-group>
    </div>
    <div class="place-search-results flex-grow-1">
      <ul class="list-unstyled">
        <b-media v-if="response.count" v-for="item in response.items" tag="li" class="search-result mb-2"
                 @click="select(item)"
                 @mouseenter="highlight(item)"
                 @mouseleave="unhighlight(item)">
          <template #aside>
            <b-img :blank="!Boolean(item.thumbnail)" blank-color="#777" width="60" :src="item.thumbnail"></b-img>
          </template>
          <h5>{{item.title}}</h5>
          <span class="badge badge-info" v-for="feature in item.features">{{ feature }}</span>
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

import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

import { library } from '@fortawesome/fontawesome-svg-core'
import { faSearch } from '@fortawesome/free-solid-svg-icons'

library.add(faSearch)

export default {
  name: "AppSearchPlaces",
  components: {
    'font-awesome-icon': FontAwesomeIcon
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
    search: async function() {
      this.noResults = false;
      this.response = [];
      if ( this.text.trim() ) {
        this.searching = true;
        const data = await PlaceService.search(this.text)
        this.searching = false;
        this.response = data;
        this.noResults = this.response.count === 0
        // update bounds
        if ( data.count ) {
          this.$store.dispatch('map/setBounds', [ [ data.bbox.corner1.lat, data.bbox.corner1.lng], [ data.bbox.corner2.lat, data.bbox.corner2.lng] ]);
        }
      }
    },
    select: function(item) {
      this.$store.dispatch('map/setCenter', item.coords)
      this.$store.dispatch('map/setZoom', 16)
      this.$store.dispatch('map/selectFeature', { id: item.id })
    },
    highlight: function(item) {
      this.$store.dispatch('map/highlightFeature', { id: item.id })
    },
    unhighlight: function(item) {
      this.$store.dispatch('map/unhighlightFeature', { id: item.id })
    }
  },
  created() {
    this.debouncedSearch = debounce(this.search,300);
  }
}
</script>

<style scoped>
.place-search {
  display:flex;
  flex-direction: column;
  width: 100%;
  height: 100%;

  .place-search-results {
    flex-grow: 1;
    overflow-y: auto;
  }
}

.search-result {
  cursor: pointer;

  .badge {
    font-weight: normal;
    color: inherit;
    border-radius: 0;
    font-size: 70%;
  }

  .badge-info {
    background-color: #efefef;
  }
}
</style>
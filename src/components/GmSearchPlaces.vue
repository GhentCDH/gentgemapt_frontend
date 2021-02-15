<template>
  <div class="place-search">
    <div class="place-search-from">
      <b-input-group>
        <b-form-input v-model="text" placeholder="" type="search"></b-form-input>
        <b-input-group-append>
          <b-button @click="search">Search</b-button>
        </b-input-group-append>
      </b-input-group>
    </div>
    <div class="place-search-results flex-grow-1">
      <ul class="list-unstyled">
        <b-media v-if="response.count" v-for="item in response.items" tag="li">
          <template #aside>
            <b-img :blank="!Boolean(item.thumbnail)" blank-color="#777" width="40" :src="item.thumbnail"></b-img>
          </template>
          <h5>{{item.title}}</h5>
        </b-media>
      </ul>

      <div v-if="noResults">
        Sorry, but no results were found.
      </div>

      <div v-if="searching">
        <i>Searching...</i>
      </div>
    </div>
  </div>
</template>

<script>
import PlaceService from "../services/PlaceService";

export default {
  name: "AppSearchPlaces",
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
      const data = await PlaceService.search(this.text)
      this.searching = false;
      this.response = data;
      this.noResults = this.response.count === 0
    }
  }
}
</script>

<style scoped>
.place-search {
  display:flex;
  flex-direction: column;
  width: 100%;
  height: 100%;

  .place-search-form {

  }

  .place-search-results {
    flex-grow: 1;
    overflow-y: auto;
  }

}
</style>
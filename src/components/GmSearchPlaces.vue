<template>
  <div>
    <input v-model="text" type="search">
    <button @click="search">Search</button>
    <p/>

    <div v-if="response.count" v-for="item in response.items" class="result">
      <b>Title:</b> {{item.title}}<br/>
      <b>ID:</b> {{item.id}}<br/>
      <br clear="left">
    </div>

    <div v-if="noResults">
      Sorry, but no results were found.
    </div>

    <div v-if="searching">
      <i>Searching...</i>
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

</style>
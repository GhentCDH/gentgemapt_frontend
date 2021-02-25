<template>
  <div class="place-info" v-if="placeId">
    <div class="place-info-title">
      <h2>{{ data['dcterms:title'][0]['@value'] }}</h2>
    </div>
    <div class="place-info-content">
      <div class="description">{{ data['dcterms:description'][0]['@value'] }}</div>
      <gm-iiif-image-gallery :manifest_url="'https://iiif.ghentcdh.ugent.be/iiif/manifests/zichtenopgent:' + data['dcterms:identifier'][0]['@value'].replace('http://www.gentgemapt.be/place/','') "></gm-iiif-image-gallery>
    </div>
  </div>
</template>

<script>
import PlaceService from "@/services/PlaceService";

import GmIiifImageGallery from "@/components/GmIiifImageGallery";

export default {
  name: "GmPlaceInfo",
  components: {
    'gm-iiif-image-gallery': GmIiifImageGallery
  },
  data() {
    return {
      data: null
    }
  },
  computed: {
    placeId() {
      if (this.$store.state.map.selectFeature) {
        return this.$store.state.map.selectFeature.properties.id;
      } else {
        return null
      }
    }
  },
  methods: {
    async loadPlaceData(id) {
      const data = await PlaceService.get(id)
      this.data = data;
    }
  },
  watch: {
    async placeId(newId, oldId) {
      await this.loadPlaceData(newId)
      this.$store.dispatch('sidebar_info/collapse', false)
    }
  }
}
</script>

<style scoped lang="scss">
.place-info {
  display: flex;
  flex-direction: column;

  &-title {
    margin-bottom: 1rem;
  }

  &-content {
    flex-grow: 1;
    overflow-y: auto;

    & > div {
      margin-bottom: 1rem;
    }
  }
}

.place-info-title {
}

.place-info-content > div {
  margin-bottom: 1rem;
}
</style>
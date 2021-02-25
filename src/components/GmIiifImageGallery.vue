<template>
  <div class="image-grid">
    <div class="image-grid-item" v-if="canvases && canvases.length" v-for="canvas in canvases" @click="handleClick(canvas)">
      <div class="cropped-image">
        <b-img fluid thumbnail :src="canvas.getCanonicalImageUri(thumbnailWidth)"></b-img>
      </div>
      <h5 v-show="false">Title</h5>
    </div>
  </div>
</template>

<script>
const manifesto = require('manifesto.js/dist-commonjs/');
import GmIiifManifestViewer from "./GmIiifManifestViewer";
import { ModalBus } from "../eventbus"

export default {
  name: "GmIiifImageGallery",
  components: {
    GmIiifManifestViewer,
    ModalBus
  },
  data() {
    return {
      manifest: null,
    }
  },
  computed: {
    canvases() {
      if ( this.manifest ) {
        return this.manifest.getSequenceByIndex(0).getCanvases();
      }
      return [];
    }
  },
  props: {
    manifestUri: {
      type: String,
      required: true
    },
    thumbnailWidth: {
      type: Number,
      required: false,
      default: 150
    }
  },
  methods: {
    handleClick(canvas) {
      console.log('click');
      ModalBus.$emit('open', {
        component: GmIiifManifestViewer,
        props: {
          manifestUri: this.manifestUri
        }
      });
    }
  },
  async created() {
    console.log(this.manifestUri)
    const {data} = await this.axios.get(this.manifestUri);
    const manifest = manifesto.parseManifest(data);
    this.manifest = manifest;

      /*
      canvases.forEach( function(canvas) {
        const images = canvas.getImages();
        if ( images && images.length ) {
          const firstImage = images[0];
          const url = canvas.getCanonicalImageUri(150)
          console.log(url);
          const resource = firstImage.getResource();
          console.log(resource.getWidth());
        }
      });
       */
  }
}
</script>

<style scoped>
.image-grid {
  display: flex;
  flex-wrap: wrap;
}

.image-grid-item {
  dispay: flex;
}

.cropped-image {
  width: 150px;
  height: 150px;
}

.cropped-image img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}
</style>
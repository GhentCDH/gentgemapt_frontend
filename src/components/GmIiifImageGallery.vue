<template>
  <div class="iiif-gallery"></div>
</template>

<script>
export default {
  name: "GmImageGallery",
  props: {
    manifest: {
      type: String,
      required: true
    },
    thumbnailWidth: {
      type: Number,
      required: false,
      default: 150
    }
  },
  mounted() {
    const manifesto = require('manifesto.js/dist-commonjs/');

    manifesto.loadManifest('https://iiif.ghentcdh.ugent.be/iiif/manifests/pmfu:example1').then((data) => {
      const manifest = manifesto.parseManifest(data);
      const sequence = manifest.getSequenceByIndex(0);
      const canvases = sequence.getCanvases();
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
    });
  }
}
</script>

<style scoped>

</style>
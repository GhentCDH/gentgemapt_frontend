<template>
  <div :id="id">
  </div>
</template>

<script>
import Mirador from 'mirador/dist/es/src/index';

export default {
  name: "GmMirador",
  props: {
    id: {
      type: String,
      default: 'vue-mirador'
    },
    options: {
      type: Object
    }
  },
  data() {
    return {
      viewer: null
    }
  },
  methods: {
    setup() {

      if( !this.viewer && this.options ) {
        const config = {
          ...this.options,
          id: this.id,
        }
        this.viewer = Mirador.viewer(config, [
        ]);
      }
    }
  },
  mounted: function () {
    console.log('mirador setup')
    this.setup()
  },
}
</script>

<style scoped lang="scss">
</style>
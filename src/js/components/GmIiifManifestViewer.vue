<template>
  <GmMirador v-if="manifestUrl" :options="options()" :key="manifestUrl"></GmMirador>
</template>

<script>
import GmMirador from "./GmMirador";

export default {
  name: 'GmIiifManifestViewer',
  components: {
    GmMirador
  },
  props: {
    manifestUrl: {
      type: String,
    },
    canvasIndex: {
      type: Number,
    },
    canvasId: {
      type: String,
    }
  },
  methods: {
    options() {
      const miradorWindow = {
        manifestId: this.manifestUrl,
        view: 'single',
        thumbnailNavigationPosition: 'off',
      }
      Object.assign(miradorWindow,
        this.canvasIndex === null ? null : { canvasIndex: this.canvasIndex },
        this.canvasId === null ? null : { canvasId: this.canvasId }
      );
      return {
        selectedTheme: 'light',
        language: 'nl',
        windows: [ { ...miradorWindow } ],
        window: {
          allowClose: false, // Prevent the user from closing this window
          allowMaximize: true,
          defaultSideBarPanel: 'info',
          sideBarOpenByDefault: true,
          hideWindowTitle: true,
          views: [ // Only allow the user to select single and gallery view
            {key: 'single'},
            {key: 'gallery'},
          ],
          panels: { // Configure which panels are visible in WindowSideBarButtons
            info: true,
            attribution: true,
            canvas: false,
            annotations: true,
            search: true,
            layers: false,
          },
        },
        workspace: {
          showZoomControls: true,
          type: 'mosaic',
          allowNewWindows: true,
        },
        workspaceControlPanel: {
          enabled: false,
        },
      }
    }
  }
}
</script>

<style lang="scss">
.mosaic-root {
  top: 0 !important;
  left: 0 !important;
  right: 0 !important;
  bottom: 0 !important;
}

.mosaic-tile {
  margin: 0 !important;
}

.mirador-window-top-bar {
  border: 0 !important;
}

.MuiAppBar-root {
  box-shadow: none !important;
}
</style>
<template>
    <GmMirador v-if="manifestUrl" :options="options" :windows="windows"></GmMirador>
</template>

<script>
import GmMirador from "./GmMirador";

export default {
    name: 'gm-iiif-manifest-viewer',
    components: {
        GmMirador
    },
    props: {
        manifestUrl: {
            type: String,
        },
        canvasIndex: {
            type: Number,
            default: null,
        },
        canvasId: {
            type: String,
            default: null,
        }
    },
    computed: {
        windows() {
            if (!this.manifestUrl) return [];

            return [{
                id: 'default',
                manifestId: this.manifestUrl,
                view: 'single',
                thumbnailNavigationPosition: 'off',
                canvasIndex: this.canvasIndex,
                canvasId: this.canvasId,
                companionAreaOpen: window.innerWidth >= 992 // don't open mirador sidebar on small devices
            }]
        },
        options() {
            return {
                selectedTheme: 'light',
                language: 'nl',
                window: {
                    allowClose: false, // Prevent the user from closing this window
                    allowMaximize: false,
                    allowFullscreen: true,
                    defaultSideBarPanel: 'info',
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
    },
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

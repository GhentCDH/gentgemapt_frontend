## Snippets

### store link to layer in geojson feature
https://stackoverflow.com/questions/34501524/in-place-update-leaflet-geojson-feature/34504270#34504270

    var myGeoJsonLayerGroup = L.geoJson({
        onEachFeature: function (feature, layer) {
            myFeaturesMap[feature.properties.objectID] = layer;
        }
    }).addTo(map);

of using event

    var geojson = new L.GeoJSON().on(
        'layeradd', function (e) {
            console.log(e.layer);
        }
    ).addTo(map);

### use hidden layer to filter features

https://gis.stackexchange.com/questions/258286/how-to-filter-a-vector-layer-in-openlayers

### leaflet examples

http://www.gistechsolutions.com/leaflet/DEMO/

## Tutorials

### Vue dynamic filters

https://medium.com/@brunofrancisco__/rendering-dynamically-filters-with-vue-dynamic-components-b6e1ac8e4a1f

### Vue modal with eventbus

https://medium.com/js-dojo/vue-js-manage-your-modal-window-s-effortlessly-using-eventbus-518977195eed

## Plugins

- realtime geojson data

    https://github.com/perliedman/leaflet-realtime

- Voorbeelden van hoe je geojson filtert met timeslider
    
    https://skeate.dev/Leaflet.timeline/
    
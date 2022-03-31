import ghent from '../data/ghent.json'

const layers = [
    {
        id: 'mapbox-v1',
        type: 'tileLayer',
        options: {
            url: 'https://api.mapbox.com/styles/v1/sysadmin-ghentcdh/ckk5uzofh03s517pd44ucjk61/tiles/256/{z}/{x}/{y}@2x?access_token=pk.eyJ1Ijoic3lzYWRtaW4tZ2hlbnRjZGgiLCJhIjoiY2trNXR3ZW55MGFxYTJ3bndiZDE0czNpOSJ9.b7hzKcWY7vIOdWNgBl6Wkw',
            attribution: 'mapbox',
            maxZoom: 18,
            name: 'MapBox'
        }
    },
    {
        id: 'Gent_CompynSoenenPiscador_1912',
        type: 'tileLayer',
        options: {
            url: 'https://dev.gentgemapt.ugent.be/static/maps/Gent_CompynSoenenPiscador_1912/{z}/{x}/{y}.png',
            attribution: '',
            maxZoom: 18,
            tms: false,
            visible: false,
            opacity: 0.5,
            layerType: 'overlay',
            name: 'Compyn, Soenen & Piscador, 1912'
        }
    },
    {
        id: 'ferraris',
        type: 'wmsLayer',
        options: {
            'base-url': 'https://geoservices.informatievlaanderen.be/raadpleegdiensten/histcart/wms',
            layers: 'ferraris',
            transparent: true,
            opacity: 0.5,
            format: 'image/png',
            name: 'Ferraris kaart - Kabinetskaart der Oostenrijkse Nederlanden en het Prinsbisdom Luik, 1771 - 1778',
            visible: false,
            layerType: 'overlay',
        }
    },
    {
        id: 'Gent_Horenbault_1619',
        type: 'tileLayer',
        options: {
            url: 'https://dev.gentgemapt.ugent.be/static/maps/Gent_Horenbault_1619/{z}/{x}/{y}.png',
            attribution: '',
            maxZoom: 18,
            tms: false,
            visible: false,
            opacity: 0.5,
            layerType: 'overlay',
            name: 'Horenbault, 1619',
        }
    },
    {
        id: 'popp',
        type: 'wmsLayer',
        options: {
            'base-url': 'https://geoservices.informatievlaanderen.be/raadpleegdiensten/histcart/wms',
            layers: 'popp',
            transparent: true,
            opacity: 0.5,
            format: 'image/png',
            name: 'Popp, Atlas cadastrale parcellaire de la Belgique, 1842 - 1879',
            visible: false,
            layerType: 'overlay',
        }
    },
    {
        id: 'vandermaelen',
        type: 'wmsLayer',
        options: {
            'base-url': 'https://geoservices.informatievlaanderen.be/raadpleegdiensten/histcart/wms',
            layers: 'vandermaelen',
            transparent: true,
            opacity: 0.5,
            format: 'image/png',
            name: 'Topografische kaart Vandermaelen (1846-1854), Vlaanderen',
            visible: false,
            layerType: 'overlay',
        }
    },
    {
        id: 'okzrgb79_90vl',
        type: 'wmsLayer',
        options: {
            'base-url': 'https://geoservices.informatievlaanderen.be/raadpleegdiensten/okz/wms',
            layers: 'okzrgb79_90vl',
            transparent: true,
            opacity: 0.5,
            format: 'image/png',
            name: 'Luchtfoto Vlaanderen, zomer 1979-1990 - kleur',
            visible: false,
            layerType: 'overlay',
        }
    },
    {
        id: 'OrthofotoGent1955WebMercator',
        type: 'wmsLayer',
        copyright: 'Bron: © Vlaamse overheid, Departement Mobiliteit en Openbare Werken, afdeling Algemene Technische Ondersteuning',
        options: {
            'base-url': 'https://geo.gent.be/geoserver/gwc/service/wms',
            layers: 'SG-E-BasislagenLuchtfotos:OrthofotoGent1955WebMercator',
            transparent: true,
            opacity: 0.5,
            format: 'image/png',
            name: 'Luchtfoto Gent 1954-1961',
            visible: false,
            layerType: 'overlay',
        }
    },

    /*
    [{'type':'WMS','url':'https://geoserver.gis.cloud.mow.vlaanderen.be/geoserver/wms?SERVICE=WMS&version=1.3.0&request=GetMap','layers':[{'id':'ato:topokaarten','title':'WMS-map Topografische kaarten Ministerie van Openbare Werken en Wederopbouw, opname 1950 - 1970'}]}]
     */
    {
        id: 'ghent-overlay',
        type: 'geojsonLayer',
        options: {
            optionsStyle: {
                "color": "#093549",
                "weight": 1,
                "fillOpacity": .6
            },
            geojson: ghent,
            options: {
                invert: true,
            }
        }
    },
]

export default layers
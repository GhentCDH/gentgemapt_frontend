import ghent from '../data/ghent.json'

const layers = [
    {
        id: 'mapbox-v1',
        label: 'Gent Gemapt basiskaart',
        type: 'tileLayer',
        options: {
            url: 'https://api.mapbox.com/styles/v1/sysadmin-ghentcdh/ckk5uzofh03s517pd44ucjk61/tiles/256/{z}/{x}/{y}@2x?access_token=pk.eyJ1Ijoic3lzYWRtaW4tZ2hlbnRjZGgiLCJhIjoiY2trNXR3ZW55MGFxYTJ3bndiZDE0czNpOSJ9.b7hzKcWY7vIOdWNgBl6Wkw',
            attribution: 'mapbox',
            maxZoom: 18,
            visible: true,
            opacity: 1,
            layerType: 'base',
            zIndex: 10,
        }
    },
    {
        id: 'google-satellite',
        type: 'tileLayer',
        label: 'Google satelliet',
        options: {
            url: 'https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}',
            attribution: 'Google',
            maxZoom: 18,
            visible: false,
            opacity: 1,
            layerType: 'base',
            zIndex: 10,
        }
    },
    {
        id: 'Gent_CompynSoenenPiscador_1912',
        type: 'tileLayer',
        label: 'Compyn, Soenen & Piscador, 1912',
        weight: 1912,
        options: {
            url: 'https://dev.gentgemapt.ugent.be/static/maps/Gent_CompynSoenenPiscador_1912/{z}/{x}/{y}.png',
            attribution: '',
            maxZoom: 18,
            tms: false,
            visible: false,
            opacity: 1,
            layerType: 'overlay',
            zIndex: 100,
        }
    },
    {
        id: 'Gent_Ferraris_1771_1778',
        type: 'tileLayer',
        label: 'Ferraris, 1771-1778',
        weight: 1771,
        options: {
            url: 'https://dev.gentgemapt.ugent.be/static/maps/Gent_Ferraris_1771_1778/{z}/{x}/{y}.png',
            attribution: '',
            maxZoom: 18,
            tms: false,
            visible: false,
            opacity: 1,
            layerType: 'overlay',
            zIndex: 100,
        }
    },
    {
        id: 'Gent_Gerard_1855',
        type: 'tileLayer',
        label: 'Gérard, 1855',
        weight: 1855,
        options: {
            url: 'https://dev.gentgemapt.ugent.be/static/maps/Gent_Gerard_1855/{z}/{x}/{y}.png',
            attribution: '',
            maxZoom: 18,
            tms: true,
            visible: false,
            opacity: 1,
            layerType: 'overlay',
            zIndex: 100,
        }
    },
    {
        id: 'Gent_GevaertVanimpe_1878',
        type: 'tileLayer',
        label: 'Gevaert en Vanimpe, 1878',
        weight: 1878,
        options: {
            url: 'https://dev.gentgemapt.ugent.be/static/maps/Gent_GevaertVanimpe_1878/{z}/{x}/{y}.png',
            attribution: '',
            maxZoom: 18,
            tms: true,
            visible: false,
            opacity: 1,
            layerType: 'overlay',
            zIndex: 100,
        }
    },
    {
        id: 'Gent_Goethals_1796',
        type: 'tileLayer',
        label: 'Goethals, 1796',
        weight: 1796,
        options: {
            url: 'https://dev.gentgemapt.ugent.be/static/maps/Gent_Goethals_1796/{z}/{x}/{y}.png',
            attribution: '',
            maxZoom: 18,
            tms: false,
            visible: false,
            opacity: 1,
            layerType: 'overlay',
            zIndex: 100,
        }
    },

    {
        id: 'Gent_NapoleontischeAtlas_1812',
        type: 'tileLayer',
        label: 'Napoleontisch Kadaster, 1807-1808',
        weight: 1807,
        options: {
            url: 'https://dev.gentgemapt.ugent.be/static/maps/Gent_NapoleontischeAtlas_1812/{z}/{x}/{y}.png',
            attribution: '',
            maxZoom: 18,
            tms: false,
            visible: false,
            opacity: 1,
            layerType: 'overlay',
            zIndex: 100,
        }
    },

    {
        id: 'Gent_PlanIndustriel_1912',
        type: 'tileLayer',
        label: 'Plan Industriel, 1912',
        weight: 1912,
        options: {
            url: 'https://dev.gentgemapt.ugent.be/static/maps/Gent_PlanIndustriel_1912/{z}/{x}/{y}.png',
            attribution: '',
            maxZoom: 18,
            tms: false,
            visible: false,
            opacity: 1,
            layerType: 'overlay',
            zIndex: 100,
        }
    },

    // {
    //     id: 'Gent_PlanWereldtentoonstelling_1912',
    //     type: 'tileLayer',
    //     label: 'Plan Wereldtentoonstelling, 1912',
    //     options: {
    //         url: 'https://dev.gentgemapt.ugent.be/static/maps/Gent_PlanWereldtentoonstelling_1912/{z}/{x}/{y}.png',
    //         attribution: '',
    //         maxZoom: 18,
    //         tms: false,
    //         visible: false,
    //         opacity: 1,
    //         layerType: 'overlay',
    //         zIndex: 100,
    //     }
    // },

    {
        id: 'Gent_SanderusHondius_1641',
        type: 'tileLayer',
        label: 'Sanderus & Hondius, 1641',
        weight: 1641,
        options: {
            url: 'https://dev.gentgemapt.ugent.be/static/maps/Gent_SanderusHondius_1641/{z}/{x}/{y}.png',
            attribution: '',
            maxZoom: 18,
            tms: true,
            visible: false,
            opacity: 1,
            layerType: 'overlay',
            zIndex: 100,
        }
    },    {
        id: 'Gent_Vandermaelen_1846_1854',
        type: 'tileLayer',
        label: 'Vandermaelen, 1846-1854',
        weight: 1846,
        options: {
            url: 'https://dev.gentgemapt.ugent.be/static/maps/Gent_Vandermaelen_1846_1854/{z}/{x}/{y}.png',
            attribution: '',
            maxZoom: 18,
            tms: false,
            visible: false,
            opacity: 1,
            layerType: 'overlay',
            zIndex: 100,
        }
    },
    {
        id: 'Gent_VanDeventer_1545_1575',
        type: 'tileLayer',
        label: 'Van Deventer, 1545-1575',
        weight: 1545,
        options: {
            url: 'https://dev.gentgemapt.ugent.be/static/maps/Gent_VanDeventer_1545_1575/{z}/{x}/{y}.png',
            attribution: '',
            maxZoom: 18,
            tms: true,
            visible: false,
            opacity: 1,
            layerType: 'overlay',
            zIndex: 100,
        }
    },
    {
        id: 'Gent_Horenbault_1619',
        type: 'tileLayer',
        label: 'Horenbault, 1619',
        weight: 1619,
        options: {
            url: 'https://dev.gentgemapt.ugent.be/static/maps/Gent_Horenbault_1619/{z}/{x}/{y}.png',
            attribution: '',
            maxZoom: 18,
            tms: false,
            visible: false,
            opacity: 1,
            layerType: 'overlay',
            zIndex: 100,
        }
    },
    {
        id: 'Popp_1842_1879',
        type: 'wmsLayer',
        label: 'Popp, 1842-1879',
        weight: 1842,
        options: {
            'base-url': 'https://geoservices.informatievlaanderen.be/raadpleegdiensten/histcart/wms',
            layers: 'popp',
            transparent: true,
            opacity: 1,
            format: 'image/png',
            visible: false,
            layerType: 'overlay',
            zIndex: 100,
        }
    },
    {
        id: 'Villaretkaart_1745_1748',
        type: 'wmsLayer',
        label: 'Villaretkaart, 1745-1748',
        weight: 1745,
        options: {
            'base-url': 'https://geo.api.vlaanderen.be/histcart/wms',
            layers: 'Villaret',
            transparent: true,
            opacity: 1,
            format: 'image/png',
            visible: false,
            layerType: 'overlay',
            zIndex: 100,
        }
    },
    {
        id: 'Atlas_der_buurtwegen_1843_1845',
        type: 'wmsLayer',
        label: 'Atlas der Buurtwegen, 1843-1845',
        weight: 1843,
        options: {
            'base-url': 'https://geo.api.vlaanderen.be/histcart/wms',
            layers: 'abw',
            transparent: true,
            opacity: 1,
            format: 'image/png',
            visible: false,
            layerType: 'overlay',
            zIndex: 100,
        }
    },
    {
        id: 'topokaarten',
        type: 'wmsLayer',
        label: 'Topografische kaarten Ministerie van Openbare Werken en Wederopbouw, 1950-1970',
        weight: 1950,
        options: {
            'base-url': 'https://geoserver.gis.cloud.mow.vlaanderen.be/geoserver/gwc/service/wms',
            layers: 'ato:topokaarten',
            transparent: true,
            opacity: 1,
            format: 'image/png',
            visible: false,
            layerType: 'overlay',
            zIndex: 100,
        }
    },

    {
        id: 'Gent_Wereldtentoonstelling_1913',
        type: 'tileLayer',
        label: 'Wereldtentoonstelling, 1913',
        weight: 1913,
        options: {
            url: 'https://dev.gentgemapt.ugent.be/static/maps/Gent_Wereldtentoonstelling_1913/{z}/{x}/{y}.png',
            attribution: '',
            maxZoom: 18,
            tms: true,
            visible: false,
            opacity: 1,
            layerType: 'overlay',
            zIndex: 100,
        }
    },

    // {
    //     id: 'vandermaelen',
    //     type: 'wmsLayer',
    //     options: {
    //         'base-url': 'https://geoservices.informatievlaanderen.be/raadpleegdiensten/histcart/wms',
    //         layers: 'vandermaelen',
    //         transparent: true,
    //         opacity: 1,
    //         format: 'image/png',
    //         label: 'Topografische kaart Vandermaelen (1846-1854), Vlaanderen',
    //         visible: false,
    //         layerType: 'overlay',
    //         zIndex: 100,
    //     }
    // },
    {
        id: 'Luchtfoto_Vlaanderen_1979_1990',
        type: 'wmsLayer',
        label: 'Luchtfoto Vlaanderen, 1979-1990',
        weight: 1979,
        url: '',
        options: {
            'base-url': 'https://geoservices.informatievlaanderen.be/raadpleegdiensten/okz/wms',
            layers: 'okzrgb79_90vl',
            transparent: true,
            opacity: 1,
            format: 'image/png',
            visible: false,
            layerType: 'overlay',
            zIndex: 100,
        }
    },
    {
        id: 'Luchtfotos_Gent_1954_1961',
        type: 'wmsLayer',
        copyright: 'Bron: © Vlaamse overheid, Departement Mobiliteit en Openbare Werken, afdeling Algemene Technische Ondersteuning',
        label: 'Luchtfoto Gent, 1954-1961',
        weight: 1954,
        options: {
            'base-url': 'https://geo.gent.be/geoserver/gwc/service/wms',
            layers: 'SG-E-BasislagenLuchtfotos:OrthofotoGent1955WebMercator',
            transparent: true,
            opacity: 1,
            format: 'image/png',
            visible: false,
            layerType: 'overlay',
            zIndex: 100,
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
            },
            visible: process.env.IS_SAD !== "true",
            zIndex: 200,
        }
    },
]

export default layers
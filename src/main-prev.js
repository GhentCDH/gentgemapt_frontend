// Test import of a JavaScript function
// import { example } from './js/example'

// Test import of an asset
// import webpackLogo from './images/webpack-logo.svg'


// bootstrap
import 'bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css'

// open-sans
import '@fontsource/open-sans'

import './js/sidebar'



import Vue from 'vue'

var app = new Vue({
    el: '#app',
    data: {
        message: 'Gent Gemapt'
    }
})

import './js/map'
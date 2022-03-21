import Vue from 'vue';
import App from './App.vue';

import VueAxios from "vue-axios";
import axios from "axios";

Vue.use(VueAxios, axios)

import store from "./js/store"

import { BootstrapVue, IconsPlugin } from 'bootstrap-vue'

// import styles
import './scss/index.scss'

import 'vue-slider-component/theme/antd.css'


// Make BootstrapVue available throughout your project
Vue.use(BootstrapVue)
// Optionally install the BootstrapVue icon components plugin
Vue.use(IconsPlugin)

new Vue({
    el: '#app',
    store,
    render: h => h(App),
});

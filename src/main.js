import Vue from 'vue';
import App from './App.vue';

import VueAxios from "vue-axios";
import axios from "axios";

Vue.use(VueAxios, axios)

import store from "./js/store"

import { LayoutPlugin, FormPlugin, NavPlugin, NavbarPlugin, ImagePlugin, CollapsePlugin,
    FormCheckboxPlugin, FormGroupPlugin, FormInputPlugin, SpinnerPlugin, MediaPlugin } from "bootstrap-vue";

// Install BootstrapVue
Vue.use(LayoutPlugin);
Vue.use(FormPlugin);
Vue.use(NavPlugin);
Vue.use(NavbarPlugin);
Vue.use(ImagePlugin);
Vue.use(CollapsePlugin);
Vue.use(FormCheckboxPlugin);
Vue.use(FormGroupPlugin);
Vue.use(FormInputPlugin);
Vue.use(SpinnerPlugin);
Vue.use(MediaPlugin);
// Vue.use(BInputGroup);

// import { BootstrapVue } from 'bootstrap-vue'

// import styles
import './scss/index.scss'

import 'bootstrap-icons/font/bootstrap-icons.css';


// Make BootstrapVue available throughout your project
// Vue.use(BootstrapVue)

new Vue({
    el: '#app',
    store,
    render: h => h(App),
});

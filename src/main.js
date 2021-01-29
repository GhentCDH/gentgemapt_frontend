import Vue from 'vue';
import App from './App.vue';

import VueAxios from "vue-axios";
import axios from "axios";

Vue.use(VueAxios, axios)

new Vue({
    el: '#app',
    render: h => h(App),
});
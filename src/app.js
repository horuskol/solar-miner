import Vue from 'vue';

import SolarMiner from './components/solar-miner';

Vue.component('solar-miner', SolarMiner);

var app = new Vue({
  el: '#app'
});
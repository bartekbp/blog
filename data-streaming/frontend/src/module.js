import "@babel/polyfill";
import angular from 'angular';

import app from './app';

angular
  .module('data-streaming', [])
  .component('app', app);
import angular from 'angular';
import uiRouter from '@uirouter/angularjs';

const module = angular
  .module('service-worker-auth', [uiRouter])
  .config($locationProvider => {
    $locationProvider.html5Mode(true);
  })
  .config($compileProvider => {
    if(process.env.NODE_ENV === 'production') {
      $compileProvider.debugInfoEnabled(false);
    }
  });

export default module;
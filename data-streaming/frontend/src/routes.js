import module from 'module';

module.config(['$uiRouterProvider', $uiRouter => {
  const $urlService = $uiRouter.urlService;
  $urlService.rules.otherwise({ state: 'app' });
  const dataSize = 5000;

  const $stateRegistry = $uiRouter.stateRegistry;
  $stateRegistry.register({
    name: 'app',
    url: '/',
    component: 'app',
    resolve: {
      dataSize: () => dataSize
    }
  });

  $stateRegistry.register({
    name: 'fetching',
    url: '/fetching',
    abstract: true,
    template: '<ui-view/>',
    resolve: {
      dataSize: () => dataSize
    }
  });

  $stateRegistry.register({
    name: 'fetching.http',
    url: '/http',
    component: 'fetchHttp'
  });

  $stateRegistry.register({
    name: 'fetching.streaming',
    url: '/streaming',
    component: 'fetchStreamingHttp'
  });

  $stateRegistry.register({
    name: 'fetching.serverSentEvents',
    url: '/server-sent-events',
    component: 'fetchServerSentEvents'
  });
}]);
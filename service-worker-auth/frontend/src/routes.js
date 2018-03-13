import module from 'module';

module.config(['$uiRouterProvider', '$urlRouterProvider', ($uiRouter, $urlRouter) => {
  const $urlService = $uiRouter.urlService;
  $urlService.rules.otherwise('/');
  const $stateRegistry = $uiRouter.stateRegistry;

  $stateRegistry.register({
    name: 'login',
    url: '/login',
    component: 'login',
    authenticate: false
  });

  $stateRegistry.register({
    name: 'cars',
    url: '/cars',
    component: 'cars',
  });

  $urlRouter.when('/', (auth, $state) => {
    if(auth.isLoggedIn()) {
      $state.go('cars');
    } else {
      $state.go('login');
    }
  })

}])
.run(($transitions, $state, auth) => {
  $transitions.onStart({}, transition => {
    const authenticatedState = transition.to().authenticate;
    if(authenticatedState === null || authenticatedState === undefined || authenticatedState === true) {
      if(!auth.isLoggedIn()) {
        console.debug('Not logged in, redirecting to login page');
        $state.go('login');
        event.preventDefault();
      }
    }
  });
});
import module from 'module';

import './index.scss';
import templateUrl from './index.html';


module.component('login', {
  templateUrl,
  controller: class {
    constructor($http, $scope, $state, auth) {
      this.$http = $http;
      this.$scope = $scope;
      this.$state = $state;
      this.auth = auth;
    }

    async submit() {
      try {
        this.error = null;
        await this.auth.login(this.username);
        this.$state.go('cars');
      } catch (reason) {
        this.$scope.$apply(() => this.error = reason)
      }
    }
  }
});
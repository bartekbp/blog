import get from 'lodash.get';
import runtime from 'serviceworker-webpack-plugin/lib/runtime';

import module from 'module';
import './auth';

module.service('sw', class {
  constructor(auth) {
    if(navigator && navigator.serviceWorker) {
      runtime.register()
        .then(res => console.log('Successfully registered sw', res))
        .catch(err => console.error('Cannot register sw', err));

      navigator.serviceWorker.addEventListener('message', event => {
        const { action } = event.data;
        const port = event.ports[0];

        if(action === 'getAuthTokenHeader') {
          console.debug('Token request from sw');
          port.postMessage({
            authHeader: auth.getAuthorizationHeader(),
          })
        } else {
          console.error('Unknown event', event);
          port.postMessage({
            error: 'Unknown request',
          })
        }
      });
    }
  }

  isRunning() {
    return get(navigator, 'serviceWorker.controller.state') === 'activated';
  }
});
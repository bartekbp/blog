import module from 'module';
import './auth';

module.config($httpProvider => {
  $httpProvider.interceptors.push(($q, auth) => ({
    request: config => ({
        ...config,
        headers: {
          ...config.headers,
          'Authorization': auth.getAuthorizationHeader(),
        }
      })
    }));
});

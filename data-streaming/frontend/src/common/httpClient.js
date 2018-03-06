import module  from 'module';
import { Observable } from 'rxjs/Observable';


module.factory('httpClient', ($http, $q) => {
  const handler = {
    get: (target, name) => {
      return (...args) => {
        const canceler = $q.defer();
        let configIndex = 1;
        if(['post', 'patch', 'put'].includes(name)) {
          configIndex = 2;
        }

        const configObject = ((args.length > configIndex && args[configIndex]) || {});
        args[configIndex] = {
          ...configObject,
          timeout: canceler.promise
        };

        const result = target[name].apply(target, args);
        return new Observable.create(subscriber => {
          result.then(value => {
            subscriber.next(value);
            subscriber.complete()
          })
            .catch(err => subscriber.error(err));

          return () => canceler.resolve();
        });
      }
    }
  };

  return new Proxy($http, handler);
});